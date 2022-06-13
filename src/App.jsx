import { useAddress, useMetamask, useEditionDrop, useToken, useVote, useNetwork } from "@thirdweb-dev/react";
import { ChainId } from "@thirdweb-dev/sdk";
import { useState, useEffect, useMemo } from 'react';
import { AddressZero } from "@ethersproject/constants";

const App = () => {
  
  const address = useAddress();
  const network = useNetwork();
  const connectWithMetamask = useMetamask();
  console.log("Hello, ",address);

  const editionDrop = useEditionDrop("0x5091C48Cc8eeF4C2448eEFD34e5f3540D5afd4dE");
  const token = useToken("0x2575CC48e88Ae9b316bBaAaFbD0ABd69B2E33913");
  const vote = useVote("0x5499e360961e6fc248206903E7d5eb4F4EdAEEBf");
  const [hasClaimedNFT, setHasClaimedNFT] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);
  const [memberTokenAmounts, setMemberTokenAmounts] = useState([]);
  const [memberAddresses, setMemberAddresses] = useState([]);
  const [proposals, setProposals] = useState([]);
  const [isVoting, setIsVoting] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);

  const shortAddress = (str) => {
    return (str.substring(0,6) + "..." + str.substring(str.length - 4));
  }

  useEffect(() => {
    if(!hasClaimedNFT){ return; }
    const getAllAddresses = async() => {
      try {
        const memberAddresses = await editionDrop.history.getAllClaimerAddresses(0);
        setMemberAddresses(memberAddresses);
        console.log("Member Adressess - ", memberAddresses);
      } catch (err) {
        console.log("Failed to fetch Member list!! ERROR - ",err);
      }
    };
    getAllAddresses();
  }, [hasClaimedNFT,editionDrop.history]);
  
  useEffect(() => {
    if(!hasClaimedNFT){ return; }
    const getAllBalances = async() => {
      try {
        const memberBalances = await token.history.getAllHolderBalances();
        setMemberTokenAmounts(memberBalances);
        console.log("$WOOF Balance - ", memberBalances);
      } catch (err) {
        console.log("Failed to fetch $WOOF Balances !! ERROR - ",err);
      }
    };
    getAllBalances();
  }, [hasClaimedNFT,editionDrop.history]);

  const memberList = useMemo(() => {
    return memberAddresses.map((address) => {
      const member = memberTokenAmounts?.find( ({ holder }) => holder === address);
      return {
        address,
        tokenAmount: member?.balance.displayValue || "0",
      }
    });
  },[memberAddresses,memberTokenAmounts]);

  useEffect(() => {
    if(!hasClaimedNFT){ return; }
    const getAllProposals = async() => {
      try {
        const proposals = await vote.getAll();
        setProposals(proposals);
        console.log("Proposals on the DAO",proposals);
      } catch (error) {
        console.error("Failed to fetch Proposals!! ERROR - ",error);
      }
    };
    getAllProposals();
  }, [hasClaimedNFT,vote]);

  useEffect(() => {
    if(!hasClaimedNFT){ return; }
    if(!proposals.length){ return; }
    const checkHasVoted = async() => {
      try {
        const hasVoted = await vote.hasVoted(proposals[0].proposalId, address);
        setHasVoted(hasVoted);
        if (hasVoted) { console.log("User has already voted");  } 
        else {  console.log("User has not voted yet");  }
      } catch (err) {
        console.error("Failed to fetch Voting status!! ERROR - ",err);
      }
    };
    checkHasVoted();
  }, [hasClaimedNFT,proposals,address,vote])

  useEffect(() => {
    if(!address){ return; }
    const checkBalance = async()=>{
      try {
        const balance = await editionDrop.balanceOf(address,0);
        if (balance.gt(0)) {
          setHasClaimedNFT(true);
          console.log("Membership NFT found!!");
        }else{
          setHasClaimedNFT(false);
          console.log("Membership NFT Not found!!PLEASE CLAIM MEMBERSHIP NFT!!");
        }
      } catch (err) {
        setHasClaimedNFT(false);
        console.error("FAILED TO GET BALANCE!! ERROR - ",err);
      }
    };
    checkBalance();
  },[address, editionDrop]);

  if(!address){
    return(
      <div className="landing">
        <h1>🐾  WELCOME TO DOGGIE DAO  🐾</h1>
        <button onClick={connectWithMetamask} className="btn-hero">Connect to Wallet</button>
      </div>
    );
  }
  
    
  const mintNFT = async() => {
    try {
      setIsClaiming(true);
      await editionDrop.claim("0",1);
      console.log(`NFT Minted Successfully OPENSEA LINK ----  https://testnets.opensea.io/assets/${editionDrop.getAddress()}/0`);
      setHasClaimedNFT(true);
    } catch (err) {
      setHasClaimedNFT(false);
      console.log("NFT Mint Failed!! ERROR - ",err);
    } finally {
      setIsClaiming(false);
    }
  }

  if(address && (network?.[0].data.chain.id !== ChainId.Rinkeby)) {
    return(
      <div className="unsupported-network">
        <h2>Please Connect to Rinkeby Network</h2>
        <p>This DAO dApp works on the Rinkeby Testnet, Please switch the network in your wallet!!</p>
      </div>
    );
  }

  if(!address){
    return(
      <div className="landing">
        <h1>🐾Welcome to Doggie DAO🐾</h1>
        <button onClick={connectWithMetamask} className="btn-hero">
          Connect Wallet!!
        </button>
      </div>
    );
  }

var woof = new Audio("woof.mp3");
document.onclick = function() {
  woof.play();
}

  if(hasClaimedNFT){
    return(
      <div className="member-page">
        <h1>🐾 DOGGIE DAO Member Page🐾 </h1>
        <p>🐾 Welcome to Doggie DAO.🐾 </p>
        <div>
          <div>
            <h2>Member List</h2>
            <table className="card">
              <thead>
                <tr>
                  <th>Address</th>
                  <th>$WOOF Balance</th>
                </tr>
              </thead>
              <tbody>
                {memberList.map((member) => {
                  return(
                    <tr key={member.address}>
                      <td>{shortAddress(member.address)}</td>
                      <td>{member.tokenAmount}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div>
            <h2>Active Proposals</h2>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                e.stopPropagation();

                //before we do async things, we want to disable the button to prevent double clicks
                setIsVoting(true);

                // lets get the votes from the form for the values
                const votes = proposals.map((proposal) => {
                  const voteResult = {
                    proposalId: proposal.proposalId,
                    //abstain by default
                    vote: 2,
                  };
                  proposal.votes.forEach((vote) => {
                    const elem = document.getElementById(
                      proposal.proposalId + "-" + vote.type
                    );

                    if (elem.checked) {
                      voteResult.vote = vote.type;
                      return;
                    }
                  });
                  return voteResult;
                });

                // first we need to make sure the user delegates their token to vote
                try {
                  //we'll check if the wallet still needs to delegate their tokens before they can vote
                  const delegation = await token.getDelegationOf(address);
                  // if the delegation is the 0x0 address that means they have not delegated their governance tokens yet
                  if (delegation === AddressZero) {
                    //if they haven't delegated their tokens yet, we'll have them delegate them before voting
                    await token.delegateTo(address);
                  }
                  // then we need to vote on the proposals
                  try {
                    await Promise.all(
                      votes.map(async ({ proposalId, vote: _vote }) => {
                        // before voting we first need to check whether the proposal is open for voting
                        // we first need to get the latest state of the proposal
                        const proposal = await vote.get(proposalId);
                        // then we check if the proposal is open for voting (state === 1 means it is open)
                        if (proposal.state === 1) {
                          // if it is open for voting, we'll vote on it
                          return vote.vote(proposalId, _vote);
                        }
                        // if the proposal is not open for voting we just return nothing, letting us continue
                        return;
                      })
                    );
                    try {
                      // if any of the propsals are ready to be executed we'll need to execute them
                      // a proposal is ready to be executed if it is in state 4
                      await Promise.all(
                        votes.map(async ({ proposalId }) => {
                          // we'll first get the latest state of the proposal again, since we may have just voted before
                          const proposal = await vote.get(proposalId);

                          //if the state is in state 4 (meaning that it is ready to be executed), we'll execute the proposal
                          if (proposal.state === 4) {
                            return vote.execute(proposalId);
                          }
                        })
                      );
                      // if we get here that means we successfully voted, so let's set the "hasVoted" state to true
                      setHasVoted(true);
                      // and log out a success message
                      console.log("successfully voted");
                    } catch (err) {
                      console.error("failed to execute votes", err);
                    }
                  } catch (err) {
                    console.error("failed to vote", err);
                  }
                } catch (err) {
                  console.error("failed to delegate tokens");
                } finally {
                  // in *either* case we need to set the isVoting state to false to enable the button again
                  setIsVoting(false);
                }
              }}
            >
              {proposals.map((proposal) => (
                <div key={proposal.proposalId} className="card">
                  <h5>{proposal.description}</h5>
                  <div>
                    {proposal.votes.map(({ type, label }) => (
                      <div key={type}>
                        <input
                          type="radio"
                          id={proposal.proposalId + "-" + type}
                          name={proposal.proposalId}
                          value={type}
                          //default the "abstain" vote to checked
                          defaultChecked={type === 2}
                        />
                        <label htmlFor={proposal.proposalId + "-" + type}>
                          {label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              <button disabled={isVoting || hasVoted} type="submit" >
                {isVoting
                  ? "Voting..."
                  : hasVoted
                    ? "You Already Voted"
                    : "Submit Votes"}
              </button>
              {!hasVoted && (
                <small>
                  This will trigger multiple transactions that you will need to
                  sign.
                </small>
              )}
            </form>
          </div>
        </div>
        </div>
    );
  }

  return(
    <div className="mint-nft">
      <h1>🐾Doggie DAO🐾</h1>
      <h2>🐾MINT YOUR FREE DOGGIE DAO NFT HERE🐾</h2>
      <button disabled = {isClaiming} onClick = {mintNFT}>{isClaiming ? "Minting..." : "Mint your nft (FREE)"}</button>
    </div>
  );
};

export default App;
