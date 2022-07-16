const Web3 = require("web3");
const web3 = new Web3(
    "https://eth-goerli.g.alchemy.com/v2/sNcf8L4HbcXGz_93jNm2TvvhqZ0b6kRp"
);
const { destinationChainTokenAddress } = require("../config");
const DestinationChainToken = require("../artifacts/contracts/Token/DestinationChainToken.sol/DestinationChainToken.json");

export const checkBalanceGoerli = async (address) => {
    const recipient = address;
    const tokenContract = new web3.eth.Contract(
        DestinationChainToken.abi,
        destinationChainTokenAddress
    );
    const balance = await tokenContract.methods.balanceOf(recipient).call();
    console.log(balance);
    return balance;
};
