const { ethers } = require("hardhat")
require("@nomicfoundation/hardhat-verify");

async function main() {
    const fundMeFactory = await ethers.getContractFactory("FundMe")
    console.log(`contract deploying`) 
    const fundMe = await fundMeFactory.deploy(500)
    await fundMe.waitForDeployment()
    console.log(`contract has been deployed successfully, contract address is ${fundMe.target}`) 
    
    if (hre.network.config.chainId = 11155111 && process.env.ETHERSCAN_API_KEY) {
        console.log("Waiting for 5 confirmations")
        await fundMe.deploymentTransaction().wait(5)
        await verifyFundMe(fundMe.target, [10])
    } else {
        console.log("Verification skipped")
    }

    const [firstAccount, secondAccount] = await ethers.getSigners()

    const fundTx = await fundMe.fund({value: ethers.parseEther("0.000001")})
    await fundTx.wait()
    const balanceOfContract = await ethers.provider.getBalance(fundMe.target)
    console.log(`Balance of the contract is ${balanceOfContract}`)

    const fundTxWithSecondAccount = await fundMe.connect(secondAccount).fund({valve: ethers.parseEther("0.000001")})
    await fundTxWithSecondAccount.wait()
    const balanceOfContractAfterSecondFund = await ethers.provider.getBalance(fundMe.target)
    console.log(`Balance of the sec contract is ${balanceOfContractAfterSecondFund}`)

    const firstAccountBalanceInFundMe = await fundMe.fundersToAmount(firstAccount.address)
    const secondAccountBalanceInFundMe = await fundMe.fundersToAmount(secondAccount.address)
    console.log(`Balance of the first account is ${firstAccount.address} is ${firstAccountBalanceInFundMe}`)
    console.log(`Balance of the second account is ${secondAccount.address} is ${secondAccountBalanceInFundMe}`)
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
