const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with account:", deployer.address);

  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", ethers.formatEther(balance), "ETH");

  const Registry = await ethers.getContractFactory("ProvenanceRegistry");
  const registry = await Registry.deploy();
  await registry.waitForDeployment();

  const address = await registry.getAddress();
  console.log("ProvenanceRegistry deployed to:", address);
  console.log(
    "View on Etherscan: https://sepolia.etherscan.io/address/" + address
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
