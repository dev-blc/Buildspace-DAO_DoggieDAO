import sdk from "./1-initialize-sdk.js";

(async() => {
    try {
        const voteContractAddress = await sdk.deployer.deployVote({
            name: "Doggie Democracy",
            voting_token_address: "0x2575CC48e88Ae9b316bBaAaFbD0ABd69B2E33913",
            voting_delay_in_blocks: 0,
            voting_period_in_blocks: 6570,
            voting_quorum_fraction: 0,
            proposal_token_threshold: 0,
        });
        console.log("Voting Contract Deployed Sucessfully!!! @ ADDRESS - ",voteContractAddress);
    } catch (err) {
        console.log("Voting Contract Deployment Failed!!! @ ERROR - ",err);
    }
})();