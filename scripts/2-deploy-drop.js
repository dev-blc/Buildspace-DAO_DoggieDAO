import { AddressZero } from "@ethersproject/constants";
import sdk from"./1-initialize-sdk.js";
import { readFileSync } from "fs";

(async() => {
    try{
        // NFT Collection Details 
        const editionDropAddress = await sdk.deployer.deployEditionDrop({
            name: "Doggie DAO Membership",
            description: "A DAO for Doggie lovers <3",
            image: readFileSync("scripts/assets/T2.jpg"),
            primary_sale_recipient: AddressZero,
        });

        const editionDrop = sdk.getEditionDrop(editionDropAddress);
        const metadata = await editionDrop.metadata.get();

        console.log("Deployment Successfull!! Deployed in - ",editionDropAddress);
        console.log("Metadata - ",metadata);
    } catch(err){
        console.log("Deployment Failed!! Error - ",err);
    }
})();
