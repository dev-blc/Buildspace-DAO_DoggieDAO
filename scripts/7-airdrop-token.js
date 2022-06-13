import sdk from "./1-initialize-sdk.js";

const editionDrop = sdk.getEditionDrop("0x5091C48Cc8eeF4C2448eEFD34e5f3540D5afd4dE");
const token = sdk.getToken("0x2575CC48e88Ae9b316bBaAaFbD0ABd69B2E33913");

(async() => {
    try {
        const walletAddresses = await editionDrop.history.getAllClaimerAddresses(0);
        if(walletAddresses.length === 0){
            console.log("No NFT's Has been Claimed yet!!");
            process.exit(0);
        }
        const airdropTargets = walletAddresses.map((address) => {
            const randomAmount = Math.floor(Math.random()* (5000+10 - 500)+ 999);
            console.log(randomAmount,"Woof Tokens will be Airdropped to ",address);
            const airdropTarget = {
                toAddress: address,
                amount: randomAmount,
            };
            return airdropTarget;
        });
        console.log("Executing Airdrops ......."); 
        await token.transferBatch(airdropTargets);
        console.log("Airdrop Successfull!!")
    } catch (err) {
        console.log("Airdrop Failed!! ERROR - ",err)
    }
})();