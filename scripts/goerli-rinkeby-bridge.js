const {
    sourceChainBridgeAddress,
    destinationChainBridgeAddress,
    goerliPrivateKey,
} = require("../config");
const Web3 = require("web3");
const SourceChainBridge = require("../artifacts/contracts/SourceChainBridge.sol/SourceChainBridge.json");
const DestinationChainBridge = require("../artifacts/contracts/DestinationChainBridge.sol/DestinationChainBridge.json");

const web3Rinkeby = new Web3(
    "ws://70.34.216.42:9933"
);
const web3Goerli = new Web3(
    "wss://polygon-mainnet.g.alchemy.com/v2/Sziok2o64OsCpH9HP339wQdHe-akTGFi"
);

// Private key to sign transaction
const adminPrivKey = goerliPrivateKey;

const { address: admin } = web3Rinkeby.eth.accounts.wallet.add(adminPrivKey);

// Init source contract to interact
const bridgeRinkeby = new web3Rinkeby.eth.Contract(
    SourceChainBridge.abi,
    sourceChainBridgeAddress
);
// Init destination contract to interact
const bridgeGoerli = new web3Goerli.eth.Contract(
    DestinationChainBridge.abi,
    destinationChainBridgeAddress
);

// Listening event on source chain and mint token on destination chain
bridgeGoerli.events
    .Transfer({ step: 1 }, function (error, event) {
        console.log("err", error);
    })
    .on("data", async (event) => {
        // console.log(event);
        // Get data from event
        const { from, to, amount, date, nonce } = event.returnValues;

        // Mint token on destination chain
        const tx = bridgeRinkeby.methods.release("0x2e5E530dC2C6b2A8f214ee929dC4a302575881A9", amount, nonce);
        const [gasPrice, gasCost] = await Promise.all([
            web3Rinkeby.eth.getGasPrice(),
            tx.estimateGas({ from: admin }),
        ]);
        const data = tx.encodeABI();
        const txData = {
            from: admin,
            to: bridgeRinkeby.options.address,
            data,
            gas: gasCost,
            gasPrice,
        };
        const receipt = await web3Rinkeby.eth.sendTransaction(txData);
        console.log(`Transaction hash: ${receipt.transactionHash}`);
        console.log(`
            Processed transfer:
            - from ${from}
            - to ${to}
            - amount ${amount} tokens
            - date ${date}
          `);
    });
