import sdk from "./1-initialize-sdk.js";
import { MaxUint256 } from "@ethersproject/constants";

const editionDrop = sdk.getEditionDrop("0x5091C48Cc8eeF4C2448eEFD34e5f3540D5afd4dE");

(async() => {
    try {
        const claimConditions = [{
            startTime: new Date(),
            maxQuantity: 50_000,
            price: 0,
            quantityLimitPerTransaction: 1,
            waitInSeconds: MaxUint256,
        }];
        await editionDrop.claimConditions.set("0",claimConditions);
        console.log("Claim Condtion set Successfully!!");
    } catch (err) {
        console.log("Failed to set Claim Condition!! ERROR - ",err);
    }
})();