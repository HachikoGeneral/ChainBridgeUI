import logo from "./logo.svg";
import "./App.css";
import { useEffect, useState } from "react";
import { checkBalanceRinkeby } from "./components/rinkeby-token-balance";
import { checkBalanceGoerli } from "./components/goerli-token-balance";
import { transferFromRinkeby } from "./components/rinkeby-goerli-transfer";
import Web3Modal from "web3modal";
import { sourceChainBridgeAddress } from "./config";
import SourceChainBridge from "./artifacts/contracts/SourceChainBridge.sol/SourceChainBridge.json";
import { ethers } from "ethers";

function App() {
    const [data, setData] = useState({
        address: "",
        balance: null,
    });
    const [input, setInput] = useState("");
    const [networkId, setNetworkId] = useState(0);

    useEffect(() => {
        if (networkId == 4) {
            checkBalanceRinkeby(data.address).then((result) => {
                setData({ address: data.address, balance: result });
            });
        } else if (networkId == 5) {
            checkBalanceGoerli(data.address).then((result) => {
                setData({ address: data.address, balance: result });
            });
        }
    }, [networkId, data.address]);

    const accountChangeHandler = (_account) => {
        setData({ address: _account });
    };

    const networkChangeHandler = (_networkId) => {
        setNetworkId(_networkId);
    };

    const handleConnectClick = () => {
        if (window.ethereum) {
            window.ethereum
                .request({ method: "eth_requestAccounts" })
                .then((res) => accountChangeHandler(res[0]));
            window.ethereum
                .request({
                    method: "net_version",
                })
                .then((res) => {
                    console.log("network", res[0]);
                    networkChangeHandler(res[0]);
                });
        } else {
            alert("Install metamask extension!");
        }
    };

    const handleSendClick = async () => {
        // transferFromRinkeby(data.address, input);
        const web3Modal = new Web3Modal();
        const connection = await web3Modal.connect();
        const provider = new ethers.providers.Web3Provider(connection);
        const signer = provider.getSigner();

        //create token
        let contract = new ethers.Contract(
            sourceChainBridgeAddress,
            SourceChainBridge.abi,
            signer
        );
        let transaction = await contract.lock(data.address, input);
        await transaction.wait();
        alert("Transaction successfully");
    };

    return (
        <div className='App'>
            <div className='content'>
                <button
                    style={{
                        height: "5vh",
                        width: "10vw",
                        backgroundColor: "#33FFE9",
                    }}
                    onClick={handleConnectClick}
                >
                    Connect
                </button>
                <div style={{ marginTop: "20px" }}>Address: {data.address}</div>
                <div style={{ marginTop: "20px" }}>Balance: {data.balance}</div>
                <input
                    placeholder='Amount'
                    style={{ height: "5vh", width: "15vw", marginTop: "20px" }}
                    onChange={(e) => setInput(e.target.value)}
                ></input>
                <br></br>
                <button
                    style={{
                        height: "5vh",
                        width: "10vw",
                        marginTop: "20px",
                        backgroundColor: "#33FFE9",
                        borderRadius: "10px",
                    }}
                    onClick={handleSendClick}
                >
                    Send
                </button>
            </div>
        </div>
    );
}

export default App;
