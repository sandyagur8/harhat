const {AlchemyKey,privateKey,optimismKey} =require("./secrets.json") ;
const bridgeApi=require("./abi/bridge.json");
require("@nomicfoundation/hardhat-ethers");
require("@nomicfoundation/hardhat-toolbox");
task("balance","prints an acoount's balance")
.addParam('account',"The accounts address")
.setAction(async(taskArgs)=>{
  const balance = await ethers.provider.getBalance(taskArgs.account);
  console.log(taskArgs.account,":",balance);
});

task("bridge","bridge eth to base goerli")
.addParam("account","The account's address")
.addParam("amount","The amount to bridge")
.setAction(async(taskArgs)=>{
  const signer = await ethers.provider.getSigner() ;
  console.log("signer",signer);
  const bridgeContract=new ethers.Contract("0xe93c8cD0D409341205A592f8c4Ac1A5fe5585cfA",
  bridgeApi,signer);
  const formatValue=ethers.parseUnits(taskArgs.amount,"ether");
  try{
    const bridgeResult = await bridgeContract.depositTransaction(
      taskArgs.account,formatValue,100000,"false","0x"
    );
  }
  catch(e){
    console.log("error",e);
  }
  console.log("bridgeResult:",bridgeResult);
  const receipt =await bridgeResult.wait();
  console.log("receipt",receipt);

});
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.17",
  defaultNetwork:"goerli",
  networks:{
    goerli:{
      url:"https://eth-goerli.g.alchemy.com/v2/"+AlchemyKey,
      account:[privateKey],
      // path:"m/44'/60'/0'/0/0",
      gasPrice:10000000000, 
    },
    "base-goerli":{
      url:"https://goerli.base.org",
      account:[privateKey],
      // path:"m/44'/60'/0'/0/0",
      gasPrice:10000000000,
    },
    "optimism-goerli":{
      url:"https://opt-goerli.g.alchemy.com/v2/"+optimismKey,
      account:[privateKey],
      // path:"m/44'/60'/0'/0/0",
      gasPrice:10000000000,
    }
  }
};
