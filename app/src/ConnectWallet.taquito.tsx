import {
    NetworkType
} from "@airgap/beacon-sdk";
import { BeaconWallet } from "@taquito/beacon-wallet";
import { TezosToolkit } from "@taquito/taquito";
import { Dispatch, SetStateAction, useEffect } from "react";

type ButtonProps = {
    Tezos: TezosToolkit;
    setWallet: Dispatch<SetStateAction<BeaconWallet | undefined>>;
    setUserAddress: Dispatch<SetStateAction<string>>;
    setUserBalance: Dispatch<SetStateAction<number>>;
    wallet: BeaconWallet;
};

const ConnectButton = ({
    Tezos,
    setWallet,
    setUserAddress,
    setUserBalance,
    wallet
}: ButtonProps): JSX.Element => {

    const setup = async (userAddress: string): Promise<void> => {
        setUserAddress(userAddress);
        // updates balance
        const balance = await Tezos.tz.getBalance(userAddress);
        setUserBalance(balance.toNumber());
    };

    const connectWallet = async (): Promise<void> => {
        try {
            if (!wallet) await createWallet();
            await wallet.requestPermissions({
                network: {
                    type: NetworkType.KATHMANDUNET,
                    rpcUrl: "https://KATHMANDUNET.tezos.marigold.dev"
                }
            });
            // gets user's address
            const userAddress = await wallet.getPKH();
            await setup(userAddress);
        } catch (error) {
            console.log(error);
        }
    };

    const createWallet = async () => {
        // creates a wallet instance if not exists
        if (!wallet) {
            wallet = new BeaconWallet({
                name: "training",
                preferredNetwork: NetworkType.GHOSTNET
            });
        }
        Tezos.setWalletProvider(wallet);
        setWallet(wallet);
        // checks if wallet was connected before
        const activeAccount = await wallet.client.getActiveAccount();
        if (activeAccount) {
            const userAddress = await wallet.getPKH();
            await setup(userAddress);
        }
    }

    useEffect(() => {
        (async () => createWallet())();
    }, []);

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