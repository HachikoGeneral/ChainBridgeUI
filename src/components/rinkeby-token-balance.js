const Web3 = require("web3");
const web3 = new Web3(
    "https://eth-rinkeby.alchemyapi.io/v2/kAPtSA_EMLRedffB6D1Ehre3rQQ2pmn2"
);
const { sourceChainTokenAddress } = require("../config");
const SourceChainToken = require("../artifacts/contracts/Token/ERC20.sol/TokenERC20.json");

export const checkBalanceRinkeby = async (address) => {
    const recipient = address;
    const tokenContract = new web3.eth.Contract(
        SourceChainToken.abi,
        sourceChainTokenAddress
    );
    const balance = await tokenContract.methods.balanceOf(recipient).call();
    return balance;
};
