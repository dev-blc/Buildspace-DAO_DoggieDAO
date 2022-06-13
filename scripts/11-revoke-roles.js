import sdk from "./1-initialize-sdk.js";

const token = sdk.getToken("0x2575CC48e88Ae9b316bBaAaFbD0ABd69B2E33913");

(async() => {
    try {
        const allRoles = await token.roles.getAll();
        console.log("Current Roles", allRoles);

        await token.roles.setAll({admin: [], minter: [] });
        console.log("Revoked Roles - ", await token.roles.getAll());
    } catch (err) {
        console.log("Failed to Revoke Current Roles!!!!!! ERROR - ", err);
    }
})();