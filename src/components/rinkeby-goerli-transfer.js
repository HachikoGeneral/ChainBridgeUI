const {
    sourceChainBridgeAddress,
    rinkebyPublicKey,
    rinkebyPrivateKey,
} = require("../config");
const SourceChainBridge = require("../artifacts/contracts/SourceChainBridge.sol/SourceChainBridge.json");
const Web3 = require("web3");

const web3 = new Web3(
    "https://polygon-mainnet.g.alchemy.com/v2/Sziok2o64OsCpH9HP339wQdHe-akTGFi"
);

const sourceChainBridge = new web3.eth.Contract(
    SourceChainBridge.abi,
    sourceChainBridgeAddress
);

// const senderPublicKey = rinkebyPublicKey;
// const senderPrivateKey = rinkebyPrivateKey;

// Burn token in source chain
export async function transferFromRinkeby(_account, amount) {
    await sourceChainBridge.methods
        .lock(_account, amount)
        .send({ from: _account })
        .once("error", (err) => {
            console.log(err);
        })
        .then((receipt) => {
            console.log(receipt);
        });
    // const nonce = await web3.eth.getTransactionCount(senderPublicKey, "latest"); //get latest nonce

    // //the transaction
    // const tx = {
    //     from: senderPublicKey,
    //     to: sourceChainBridgeAddress,
    //     nonce: nonce,
    //     gas: 500000,
    //     data: sourceChainBridge.methods.lock(senderPublicKey, 1000).encodeABI(),
    // };

    // const signPromise = web3.eth.accounts.signTransaction(tx, senderPrivateKey);
    // signPromise
    //     .then((signedTx) => {
    //         web3.eth.sendSignedTransaction(
    //             signedTx.rawTransaction,
    //             function (err, hash) {
    //                 if (!err) {
    //                     console.log("The hash of your transaction is: ", hash);
    //                 } else {
    //                     console.log(
    //                         "Something went wrong when submitting your transaction:",
    //                         err
    //                     );
    //                 }
    //             }
    //         );
    //     })
    //     .catch((err) => {
    //         console.log(" Promise failed:", err);
    //     });
}
