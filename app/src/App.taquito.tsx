import { Contract, ContractsService } from '@dipdup/tzkt-api';
import { BeaconWallet } from '@taquito/beacon-wallet';
import { TezosToolkit } from '@taquito/taquito';
import { useState } from 'react';
import './App.css';
import ConnectButton from './ConnectWallet.taquito';
import DisconnectButton from './DisconnectWallet.taquito';
import { PokeGameWalletType } from './pokeGame.types';

function App() {

  const [Tezos, setTezos] = useState<TezosToolkit>(new TezosToolkit("https://kathmandunet.tezos.marigold.dev"));
  const [Tezos2, setTezos2] = useState<TezosToolkit>(new TezosToolkit("https://kathmandunet.tezos.marigold.dev"));
  const [wallet, setWallet] = useState<BeaconWallet>();
  const [wallet2, setWallet2] = useState<BeaconWallet>();
  const [userAddress, setUserAddress] = useState<string>("");
  const [userBalance, setUserBalance] = useState<number>(0);
  const [userAddress2, setUserAddress2] = useState<string>("");
  const [userBalance2, setUserBalance2] = useState<number>(0);
  const contractsService = new ContractsService({ baseUrl: "https://api.kathmandunet.tzkt.io", version: "", withCredentials: false });
  const [contracts, setContracts] = useState<Array<Contract>>([]);

  const fetchContracts = () => {
    (async () => {
      setContracts((await contractsService.getSimilar({ address: process.env["REACT_APP_CONTRACT_ADDRESS"]!, includeStorage: true, sort: { desc: "id" } })));
    })();
  }


  const poke1 = async (contract: Contract) => {
    let c: PokeGameWalletType = await Tezos.wallet.at<PokeGameWalletType>("" + contract.address);
    try {
      alert("poke1 with signer " + (await Tezos.wallet.pkh()));
      const op = await c.methods.default().send();
      await op.confirmation();
      alert("Tx done");
    } catch (error: any) {
      console.table(`Error: ${JSON.stringify(error, null, 2)}`);
    }
  };

  const poke2 = async (contract: Contract) => {
    let c: PokeGameWalletType = await Tezos2.wallet.at<PokeGameWalletType>("" + contract.address);
    try {
      alert("poke1 with signer " + (await Tezos2.wallet.pkh()));
      const op = await c.methods.default().send();
      await op.confirmation();
      alert("Tx done");
    } catch (error: any) {
      console.table(`Error: ${JSON.stringify(error, null, 2)}`);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <p>

          <hr />
          <h1>USER1</h1>

          <ConnectButton
            Tezos={Tezos}
            setWallet={setWallet}
            setUserAddress={setUserAddress}
            setUserBalance={setUserBalance}
            wallet={wallet!}
          />

          <DisconnectButton
            wallet={wallet!}
            setUserAddress={setUserAddress}
            setUserBalance={setUserBalance}
            setWallet={setWallet}
          />

          <div>
            I am {userAddress} with {userBalance} mutez
          </div>

          <hr />
          <h1>USER2</h1>

          <ConnectButton
            Tezos={Tezos2}
            setWallet={setWallet2}
            setUserAddress={setUserAddress2}
            setUserBalance={setUserBalance2}
            wallet={wallet!}
          />

          <DisconnectButton
            wallet={wallet2!}
            setUserAddress={setUserAddress2}
            setUserBalance={setUserBalance2}
            setWallet={setWallet2}
          />

          <div>
            I am {userAddress2} with {userBalance2} mutez
          </div>

          <hr />


          <br />
          <div>
            <button onClick={fetchContracts}>Fetch contracts</button>
            <table><thead><tr><th>address</th><th>people</th><th>action</th></tr></thead><tbody>
              {contracts.map((contract) => <tr><td style={{ borderStyle: "dotted" }}>{contract.address}</td><td style={{ borderStyle: "dotted" }}>{contract.storage.join(", ")}</td><td style={{ borderStyle: "dotted" }}>
                <button onClick={() => poke1(contract)}>Poke1</button>
                <button onClick={() => poke2(contract)}>Poke2</button>
              </td></tr>)}
            </tbody></table>          </div>

        </p>

      </header>
    </div>
  );
}

export default App;