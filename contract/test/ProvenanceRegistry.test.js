const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ProvenanceRegistry", function () {
  let registry;
  let owner, other;

  beforeEach(async function () {
    [owner, other] = await ethers.getSigners();
    const Registry = await ethers.getContractFactory("ProvenanceRegistry");
    registry = await Registry.deploy();
  });

// lives on the Ethereum blockchain and stores a permanent record of 
//AI-generated content.

  const FAKE_HASH =
    "0xa3f5c2d1e4b7890123456789abcdef01fedcba9876543210deadbeef12345678";

  it("records a new hash and emits the event", async function () {
    const tx = await registry.notarize(FAKE_HASH, "essay");
    const receipt = await tx.wait();
    const block = await ethers.provider.getBlock(receipt.blockNumber);

    await expect(tx)
      .to.emit(registry, "ContentNotarized")
      .withArgs(FAKE_HASH, owner.address, block.timestamp, "essay");
  });

  it("stores the correct submitter and label", async function () {
    await registry.notarize(FAKE_HASH, "code");
    const [submitter, , label, exists] = await registry.verify(FAKE_HASH);

    expect(submitter).to.equal(owner.address);
    expect(label).to.equal("code");
    expect(exists).to.be.true;
  });

  it("isRecorded returns false before submission", async function () {
    expect(await registry.isRecorded(FAKE_HASH)).to.be.false;
  });

  it("isRecorded returns true after submission", async function () {
    await registry.notarize(FAKE_HASH, "");
    expect(await registry.isRecorded(FAKE_HASH)).to.be.true;
  });

  it("rejects duplicate hashes", async function () {
    await registry.notarize(FAKE_HASH, "essay");
    await expect(registry.notarize(FAKE_HASH, "essay"))
      .to.be.revertedWithCustomError(registry, "HashAlreadyRecorded")
      .withArgs(FAKE_HASH, owner.address);
  });

  it("rejects the zero hash", async function () {
    const ZERO_HASH = ethers.ZeroHash;
    await expect(
      registry.notarize(ZERO_HASH, "")
    ).to.be.revertedWithCustomError(registry, "InvalidHash");
  });

  it("different wallets can submit different hashes", async function () {
    const HASH_2 =
      "0xb4f6c3d2e5a8901234567890abcdef02fedcba9876543210deadbeef23456789";

    await registry.connect(owner).notarize(FAKE_HASH, "essay");
    await registry.connect(other).notarize(HASH_2, "code");

    const [sub1] = await registry.verify(FAKE_HASH);
    const [sub2] = await registry.verify(HASH_2);

    expect(sub1).to.equal(owner.address);
    expect(sub2).to.equal(other.address);
  });
});
