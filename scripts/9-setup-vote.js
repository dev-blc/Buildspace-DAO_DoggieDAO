import sdk from "./1-initialize-sdk.js";

const vote = sdk.getVote("0x5499e360961e6fc248206903E7d5eb4F4EdAEEBf");
const token = sdk.getToken("0x2575CC48e88Ae9b316bBaAaFbD0ABd69B2E33913");

(async() => {
    try {
        await token.roles.grant("minter", vote.getAddress());
        console.log("Permission Granted!!");
    } catch (err) {
        console.log("Permission Denied!! ERROR -",err);
        process.exit(1);
    }

    try {
        const tokenBalance = await token.balanceOf(process.env.WALLET_ADDRESS);

        const owned = tokenBalance.displayValue;
        const distValue = owned * 0.75;
        await token.transfer(vote.getAddress(),distValue);
        console.log("Sent "+distValue+"$WOOF Tokens to Vote/Democracy Contract!!!");
    } catch (err) {
        console.log("Token Distribution Failed!! ERROR -",err);
    }
})();