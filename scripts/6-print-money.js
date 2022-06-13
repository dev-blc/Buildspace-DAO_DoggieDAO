import sdk from "./1-initialize-sdk.js";

const token = sdk.getToken("0x2575CC48e88Ae9b316bBaAaFbD0ABd69B2E33913");

(async() => {
    try {
        const amount = 100000;
        await token.mintToSelf(amount);
        const totalSupply = await token.totalSupply();
        console.log("Minted ",totalSupply.displayValue,"$WOOF Tokens!!")
    } catch (err) {
        console.log("Token Minting failed!!! ERROR - ",err);
    }
})();