import sdk from "./1-initialize-sdk.js";
import { AddressZero } from "@ethersproject/constants";


(async() => {
    try {
        const tokenAddress = await sdk.deployer.deployToken({
            name: "Doggie DAO Governance Token",
            symbol: "Woof",
            primary_sale_recipient: AddressZero,
        });
        console.log("Woof Token Deployed Successfully @ ADDRESS - ", tokenAddress);
    } catch (err) {
        console.error("Woof Token Deployment FAILED!!  ERROR - ", err);
    }
})();
