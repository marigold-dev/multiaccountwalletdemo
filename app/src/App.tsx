import { AccountInfo, DAppClient, TezosOperationType } from '@airgap/beacon-sdk';
import { Contract, ContractsService } from '@dipdup/tzkt-api';
import { useEffect, useState } from 'react';
import './App.css';
import ConnectButton from './ConnectWallet';
import DisconnectButton from './DisconnectWallet';

function App() {

  const [dAppClient, setdAppClient] = useState<DAppClient>();
  const [userAddress, setUserAddress] = useState<string>("");
  const [userAddress2, setUserAddress2] = useState<string>("");
  const [activeAccount, setActiveAccount] = useState<AccountInfo>();
  const contractsService = new ContractsService({ baseUrl: "https://api.kathmandunet.tzkt.io", version: "", withCredentials: false });
  const [contracts, setContracts] = useState<Array<Contract>>([]);

  useEffect(
    () => {
      setdAppClient(new DAppClient({ name: "Test" }));
      console.log("call once");
    }, []
  );

  const changeAccount = async (address: string) => {
    const a: AccountInfo = (await dAppClient!.getAccounts()).find(a => a.address == address)!;
    setActiveAccount(a);
    await dAppClient!.clearActiveAccount();
    await dAppClient!.setActiveAccount(a);
    console.log("active is : " + a.address);
  }


  const fetchContracts = () => {
    (async () => {
      setContracts((await contractsService.getSimilar({ address: process.env["REACT_APP_CONTRACT_ADDRESS"]!, includeStorage: true, sort: { desc: "id" } })));
    })();
  }


  const poke = async (contract: Contract) => {
    try {
      alert("poke with signer " + (await dAppClient!.getActiveAccount()!)?.address);
      const response = await dAppClient!.requestOperation({
        operationDetails: [{
          kind: TezosOperationType.TRANSACTION,
          destination: contract.address!,
          amount: "0", // Amount in mutez, the smallest unit in Tezos
        }]
      }
      );
      alert("Tx done");
    } catch (error: any) {
      console.table(`Error: ${JSON.stringify(error, null, 2)}`);
    }
  };

  return (
    <div className="App">
      <header className="App-header">


        <hr />
        <h1 onClick={() => changeAccount(userAddress)}>USER1</h1>

        {!userAddress ?
          <ConnectButton
            Tezos={dAppClient!}
            setUserAddress={setUserAddress}
          />
          :
          <DisconnectButton
            Tezos={dAppClient!}
            userAddress={userAddress}
            setUserAddress={setUserAddress}
          />}

        <div>
          I am {userAddress} {activeAccount?.address == userAddress ? "(active)" : ""}
        </div>

        <hr />
        <h1 onClick={() => changeAccount(userAddress2)}>USER2</h1>

        {!userAddress2 ?
          <ConnectButton
            Tezos={dAppClient!}
            setUserAddress={setUserAddress2}
          />
          :
          <DisconnectButton
            Tezos={dAppClient!}
            userAddress={userAddress2}
            setUserAddress={setUserAddress2}
          />
        }

        <div>
          I am {userAddress2} {activeAccount?.address == userAddress2 ? "(active)" : ""}
        </div>

        <hr />


        <br />
        <div>
          <button onClick={fetchContracts}>Fetch contracts</button>
          <table><thead><tr><th>address</th><th>people</th><th>action</th></tr></thead><tbody>
            {contracts.map((contract) => <tr><td style={{ borderStyle: "dotted" }}>{contract.address}</td><td style={{ borderStyle: "dotted" }}>{contract.storage.join(", ")}</td><td style={{ borderStyle: "dotted" }}>
              <button onClick={() => poke(contract)}>Poke</button>
            </td></tr>)}
          </tbody></table>          </div>



      </header>
    </div>
  );
}

export default App;