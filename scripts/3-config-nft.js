import sdk from "./1-initialize-sdk.js";
import { readFileSync } from "fs";
import { Description } from "@ethersproject/properties";

const editionDrop = sdk.getEditionDrop("0x5091C48Cc8eeF4C2448eEFD34e5f3540D5afd4dE");

(async() => {
    try{
        await editionDrop.createBatch([{
            name: "Treat",
            description: "This Treat NFT will give access to Doggie DAO",
            image: readFileSync("scripts/assets/Treat.png"),
        }]);
        console.log("NFT Creation Successful!!");
    }catch(err){
        console.log("NFT Creation Failed!! ERROR - ",err);
    }
})();