import { ThirdwebSDK } from "@thirdweb-dev/sdk";
import { ethers } from "ethers";
import dotenv from "dotenv";

dotenv.config();
// .env files check 
if(!process.env.PRIVATE_KEY || process.env.PRIVATE_KEY === ""){
    console.log("🛑 Private key not found.");
}
if (!process.env.ALCHEMY_API_URL || process.env.ALCHEMY_API_URL === "") {
    console.log("🛑 Alchemy API URL not found.");
}
if (!process.env.WALLET_ADDRESS || process.env.WALLET_ADDRESS === "") {
    console.log("🛑 Wallet Address not found.");
}

// .env variables setup 
const provider = new ethers.providers.JsonRpcProvider(process.env.ALCHEMY_API_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY,provider);
const sdk = new ThirdwebSDK(wallet);
// SDK Init message
(async() => {
    try {
        const address = await sdk.getSigner().getAddress();
        console.log("SDK Initialized!! From Address: ",address);
    } catch(err) {
        console.log("SDK Initialization failed!!",err);
        process.exit(1);
    }
})();

export default sdk;