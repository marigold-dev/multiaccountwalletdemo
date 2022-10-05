import { DAppClient } from "@airgap/beacon-sdk";
import { Dispatch, SetStateAction } from "react";

interface ButtonProps {
    Tezos: DAppClient;
    userAddress: string;
    setUserAddress: Dispatch<SetStateAction<string>>;
}

const DisconnectButton = ({
    Tezos,
    userAddress,
    setUserAddress,
}: ButtonProps): JSX.Element => {
    const disconnectWallet = async (): Promise<void> => {
        setUserAddress("");
        Tezos.removeAccount((await Tezos.getAccounts()).find(a => a.address == userAddress)?.accountIdentifier!)
        console.log("removing user " + userAddress);
    };

    return (
        <div className="buttons">
            <button className="button" onClick={disconnectWallet}>
                <i className="fas fa-times"></i>&nbsp; Disconnect wallet
            </button>
        </div>
    );
};

export default DisconnectButton;