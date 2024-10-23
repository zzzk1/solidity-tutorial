const { ethers } = require("hardhat")
require("@nomicfoundation/hardhat-verify");

async function main() {
    const fundMeFactory = await ethers.getContractFactory("FundMe")
    console.log(`contract deploying`) 
    const fundMe = await fundMeFactory.deploy(10)
    await fundMe.waitForDeployment()
    console.log(`contract has been deployed successfully, contract address is ${fundMe.target}`) 
    
    if (hre.network.config.chainId = 11155111 && process.env.ETHERSCAN_API_KEY) {
        console.log("Waiting for 5 confirmations")
        await fundMe.deploymentTransaction().wait(5)
        await verifyFundMe(fundMe.target, [10])
    } else {
        console.log("Verification skipped")
    }
}

async function verifyFundMe(fundmeAddr, args) {
    await hre.run("verify:verify", {
        address: fundmeAddr,
        constructorArguments: args,
      });
}

main().then().catch((error) => {
    console.error(error)
    process.exit(0)
})
