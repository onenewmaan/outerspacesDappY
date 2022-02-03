import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { connect } from "../redux/blockchain/blockchainActions";
import { fetchData } from "../redux/data/dataActions";


export function Mint() {

    const dispatch = useDispatch();
  const blockchain = useSelector((state) => state.blockchain);
  const data = useSelector((state) => state.data);
  const [claimingNft, setClaimingNft] = useState(false);
  const [feedback, setFeedback] = useState(`click buy to mint your NFT.`);
  const [mintAmount, setMintAmount] = useState(1);
  const [CONFIG, SET_CONFIG] = useState({
    CONTRACT_ADDRESS: "",
    SCAN_LINK: "",
    NETWORK: {
      NAME: "",
      SYMBOL: "",
      ID: 0,
    },
    NFT_NAME: "",
    SYMBOL: "",
    MAX_SUPPLY: 1,
    WEI_COST: 0,
    DISPLAY_COST: 0,
    GAS_LIMIT: 0,
    MARKETPLACE: "",
    MARKETPLACE_LINK: "",
    SHOW_BACKGROUND: false,
  });

  const claimNFTs = () => {
    let cost = CONFIG.WEI_COST;
    let gasLimit = CONFIG.GAS_LIMIT;
    let totalCostWei = String(cost * mintAmount);
    let totalGasLimit = String(gasLimit * mintAmount);
    let costValue = blockchain.web3.utils.toWei((CONFIG.DISPLAY_COST * mintAmount).toString(), "ether")
    console.log("Cost: ", totalCostWei);
    console.log("Gas limit: ", totalGasLimit);
    setFeedback(`Minting your ${CONFIG.NFT_NAME}...`);
    setClaimingNft(true);
    blockchain.smartContract.methods
      .mint(blockchain.account, mintAmount)
      .send({
        gasLimit: String(totalGasLimit),
        to: CONFIG.CONTRACT_ADDRESS,
        from: blockchain.account,
        value: costValue,
      })
      .once("error", (err) => {
        console.log(err);
        setFeedback("Hmmm, seems like the chain needs more time to proccess...");
        setClaimingNft(false);
      })
      .then((receipt) => {
        console.log(receipt);
        setFeedback(
          `WOW, You have a ${CONFIG.NFT_NAME} citizen! go visit Opensea.io to view it.`
        );
        setClaimingNft(false);
        dispatch(fetchData(blockchain.account));
      });
  };


  const decrementMintAmount = () => {
    let newMintAmount = mintAmount - 1;
    if (newMintAmount < 1) {
      newMintAmount = 1;
    }
    setMintAmount(newMintAmount);
  };

  const incrementMintAmount = () => {
    let newMintAmount = mintAmount + 1;
    if (newMintAmount > 10) {
      newMintAmount = 10;
    }
    setMintAmount(newMintAmount);
  };

  const getData = () => {
    if (blockchain.account !== "" && blockchain.smartContract !== null) {
      dispatch(fetchData(blockchain.account));
    }
  };

  const getConfig = async () => {
    const configResponse = await fetch("/config/config.json", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    const config = await configResponse.json();
    SET_CONFIG(config);
  };


  useEffect(() => {
    getConfig();
  }, []);

  useEffect(() => {
    getData();
  }, [blockchain.account]);

  return (
      <div className='container'>
          
        <div className='token__section'>
          <div className='token__wrapper'>
            <div className="token__container-card">
              <div className="token__container-cardInfo">
                <div className='row' style={{display:'flex'}}>
                    <div className="flux">COSMO </div>
                    <div className="neon">SAPIENS </div>
                </div>
                <div className="row">
                
                </div>
                <div className='row' style={{display:'flex', flexDirection:'column'}}>
                <div className="token__container">
                    <div className='token__container-section' >
                      
                      
                    </div>
                  </div>
            </div>
            <div className='float-div'>
                      <h3>︾</h3>
                      </div>
                      
            <div className="token__container">
                    <div className='token__container-section' >
                      <div className="row">
                        <div className="col">
                          <img src="images/example.gif" width="110px" alt="" style={{margin:'-15px', transform: "scaleX(-1)"}} />
                        </div>
                        <div className="col">
                        <h3 className="neon" style={{fontSize: '25px', fontFamily: 'neon', textAlign:'center'}}>
                        YOGI + ELFI
                    </h3>
                          <h2 style={{display: 'flex',fontSize: '14px', textAlign: 'center'}}>
                          Cosmosapiens Yogies and Elfies are the game frame avatars - are the result of human imagination + hand-drawn & code work, 
                          each is unique and programmatically generated from over 50+ possible traits, 
                          including expression, headwear and more imporantly their location in space & time...</h2>
                        </div>
                        <div className="col">
                          <img src="images/example2.gif" width="110px" alt="" style={{margin:'-15px'}} />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="token__container">
                  <div className="token__wrapper">
                      <img src='images/web/polygon.png'  width="150px" style={{margin:'15px'}} alt=''  />
                    </div>
                  </div>
              <div className='row'>
                <a href={'https://polygonscan.com/token/0xFc0134960C5B1799726179A9C5540A615e63ED8a'}>
                  <h3 style={{fontSize: '15px', margin: '0px 0px 0px 0px', opacity:1}}>/0xFc0134960C5B1799726179A9C5540A615e63ED8a</h3>
                </a>
              </div>
              <div className="row" style={{flexFlow: 'row', alignItems:'center'}}>
                    <h2 style={{display: 'flex',fontSize: '30px', fontWeight: '900', textAlign: 'center'}}>
                    <i>{data.totalSupply}&emsp;</i>
                    </h2>
                    <hr width="3" size="50"/>
                    <h2 style={{fontSize: '35px',fontWeight: '100',textAlign: 'center'}}>
                            &emsp;{CONFIG.MAX_SUPPLY} MAX.
                    </h2>
                  </div>
              </div>
              {Number(data.totalSupply) >= CONFIG.MAX_SUPPLY ? (
                <>
                  <div className='text-title' style={{
                  textAlign: "center",
                  fontSize: 50,
                  fontWeight: "bold",
                  color: "var(--accent-text)",
                }}>
                    The sale has ended.
                  </div>
                  <div className='text-description'
                    style={{ textAlign: "center", color: "var(--accent-text)" }}
                  >
                    You can still find {CONFIG.NFT_NAME} on
                  </div>
                  <p className="bottom-space-xsm" />
                  <a className='styled-link' target={"_blank"} href={CONFIG.MARKETPLACE_LINK}>
                    {CONFIG.MARKETPLACE}
                  </a>
                </>
              ) : (
                <>
                  <div className='token__wrapper'>
                   <h3> 1 {CONFIG.SYMBOL} costs {CONFIG.DISPLAY_COST}{" "}{CONFIG.NETWORK.SYMBOL} </h3>
                   
                   <h3 style={{margin:'5px'}}>✰ optimized gas fees ✰</h3>
                  </div>
                  {blockchain.account === "" ||
                  blockchain.smartContract === null ? (
                    <div className='token__wrapper'>
                      <h3>
                        Connect to the {CONFIG.NETWORK.NAME} network
                      </h3>
                      <div className='btn' onClick={(e) => {
                          e.preventDefault();
                          dispatch(connect());
                          getData();
                        }}>
                        CONNECT
                        </div>
                        
                      {blockchain.errorMsg !== "" ? (
                        <>
                          <p className="bottom-space-xsm" />
                          <div className='text-description'
                            style={{
                              textAlign: "center",
                              color: "var(--accent-text)",
                            }}
                          >
                            <h3>{blockchain.errorMsg}</h3>
                          </div>
                        </>
                      ) : null}
                    </div>
                  ) : (
                    <>
                      <div className='text-description'
                      >
                        <h3>{feedback}</h3>
                      </div>
                      <p className="bottom-space-xsm" />
                      <div className='container' style={{
                            flexDirection: "row",
                          }}>
                        <div className='btn' 
                          style={{ lineHeight: 0.4 }}
                          disabled={claimingNft ? 1 : 0}
                          onClick={(e) => {
                            e.preventDefault();
                            decrementMintAmount();
                          }}
                        >
                          -
                        </div>
                        <p className="bottom-space-xsm" />
                        <h3>{mintAmount}</h3>
                        <p className="bottom-space-xsm" />
                        <div className='btn'
                          disabled={claimingNft ? 1 : 0}
                          onClick={(e) => {
                            e.preventDefault();
                            incrementMintAmount();
                          }}
                        >
                          +
                        </div>
                      </div>
                      <div className='container' style={{
                            flexDirection: "row",
                          }}>
                        <div className='btn'
                        disabled={claimingNft ? 1 : 0}
                        onClick={(e) => {
                          e.preventDefault();
                          claimNFTs();
                          getData();
                        }}>
                          {claimingNft ? "BUSY" : "BUY"}
                        </div>
                      </div>
                      <p className="bottom-space-xsm" />
                      <h3> Once you make the purchase, you cannot undo this action.</h3>
                    </>
                    
                  )}
                </>
              )}
              <div className='token__wrapper'>
              <p className="bottom-space-xsm" />
                <h3 style={{fontSize: '12px'}}>
                  Verify that you are connected to the right network (
                  {CONFIG.NETWORK.NAME} Mainnet) and the correct address.
                </h3>
              <div className="bottom-space-sm" />

                <p style={{alignItems:'center'}}>
                  <img src='images/web/blue_check.png'  width="15px" style={{marginBottom:'-3px'}} alt=''  />
                  &emsp;Check us out:
                </p>
              <div className="bottom-space-sm" />

                <a href={'https://opensea.io/collection/cosmosapiens'}>
                  <img src='images/web/opensea.png'  width="150px" style={{margin:'0px'}} alt=''  />
                </a>
              </div>
 
              <div className="bottom-space-sm" />
              <div className='row' style={{flexFlow:'column'}}>
                      <h2 style={{fontSize: '25px', fontWeight: '500', textAlign: 'center', letterSpacing:'8px'}}>
                      JOIN OUR COMMUNITY 
                        </h2>
              <div className="bottom-space-sm" />

                        <h2 style={{fontSize: '12px', fontWeight: '100', textAlign: 'center', marginTop:'-10px'}}>
                        ✰ FOLLOW OUR SOCIAL CHANNELS ✰
                        <br /> NOW
                        </h2>
                    </div>
            </div>
          </div>
          
        </div>
      </div>
  );
}