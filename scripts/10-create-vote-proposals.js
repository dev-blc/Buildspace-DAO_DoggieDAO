import sdk from "./1-initialize-sdk.js";
import { ethers } from "ethers";

const vote = sdk.getVote("0x5499e360961e6fc248206903E7d5eb4F4EdAEEBf");
const token = sdk.getToken("0x2575CC48e88Ae9b316bBaAaFbD0ABd69B2E33913");

(async() => {
    try {
        const amount = 420_000;
        const description = "Should The DAO Mint "+amount+" $WOOF tokens?";
        const executions = [
            {
                toAddress: token.getAddress(),
                nativeTokenValue: 0,
                transactionData: token.encoder.encode("mintTo",[vote.getAddress(),ethers.utils.parseUnits(amount.toString(),18)]),
            }
        ];
        await vote.propose(description, executions);
        console.log("Proposal \""+ description + "\" Created Successfully");
    } catch (err) {
        console.error("Proposal Creation Failed!! ERROR - ",err);
        process.exit(1);
    }

    try {
        const amount = 25_000;
        const description = "Should the DAO reward "+amount+" $WOOF tokens to "+process.env.WALLET_ADDRESS+" for adopting 3 doggies?";
        const executions = [
            {
                nativeTokenValue: 0,
                transactionData: token.encoder.encode("transfer",[process.env.WALLET_ADDRESS,ethers.utils.parseUnits(amount.toString(),18)]),
                toAddress: token.getAddress(),
            },
        ];
        await vote.propose(description, executions);
        console.log("Proposal \""+ description + "\" Created Successfully");
    } catch (err) {
        console.error("Proposal Creation Failed!! ERROR - ",err);
        process.exit(1);
    }
})();