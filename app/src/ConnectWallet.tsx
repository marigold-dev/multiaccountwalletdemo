import {
    DAppClient,
    NetworkType
} from "@airgap/beacon-sdk";
import { Dispatch, SetStateAction } from "react";

type ButtonProps = {
    Tezos: DAppClient;
    setUserAddress: Dispatch<SetStateAction<string>>;
};

const ConnectButton = ({
    Tezos,
    setUserAddress,
}: ButtonProps): JSX.Element => {

    const connectWallet = async (): Promise<void> => {
        try {
            //to authorize new connection
            await Tezos.clearActiveAccount();

            if ((await Tezos.getAccounts()).length == 0 || (await Tezos.getAccounts()).length == 1) {
                const permissions = await Tezos.requestPermissions({
                    network: {
                        type: NetworkType.KATHMANDUNET,
                        rpcUrl: "https://KATHMANDUNET.tezos.marigold.dev"
                    }
                });
                setUserAddress(permissions.address);
            } else if ((await Tezos.getAccounts()).length == 2) {
                Tezos.removeAllAccounts();
                console.log("cleaning old local storage");
                const permissions = await Tezos.requestPermissions({
                    network: {
                        type: NetworkType.KATHMANDUNET,
                        rpcUrl: "https://KATHMANDUNET.tezos.marigold.dev"
                    }
                });
                setUserAddress(permissions.address);
            }
            else {
                console.log("no more accounts to log")
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="buttons">
            <button className="button" onClick={connectWallet}>
                <span>
                    <i className="fas fa-wallet"></i>&nbsp; Connect with wallet
                </span>
            </button>
        </div>
    );
};

export default ConnectButton;