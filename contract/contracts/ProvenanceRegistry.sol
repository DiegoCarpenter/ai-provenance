// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract ProvenanceRegistry {

    struct ProvenanceRecord {
        address submitter;
        uint256 timestamp;
        string  label;
        bool    exists; 
    } 

    mapping(bytes32 => ProvenanceRecord) private records;

    event ContentNotarized(
        bytes32 indexed hash,
        address indexed submitter,
        uint256         timestamp,
        string          label
    );

    error HashAlreadyRecorded(bytes32 hash, address originalSubmitter);
    error InvalidHash();

    function notarize(bytes32 hash, string calldata label) external {
        if (hash == bytes32(0)) revert InvalidHash();
        if (records[hash].exists) {
            revert HashAlreadyRecorded(hash, records[hash].submitter);
        }

        records[hash] = ProvenanceRecord({
            submitter:  msg.sender,
            timestamp:  block.timestamp,
            label:      label,
            exists:     true
        });

        emit ContentNotarized(hash, msg.sender, block.timestamp, label);
    }

    function verify(bytes32 hash)
        external
        view
        returns (
            address submitter,
            uint256 timestamp,
            string memory label,
            bool exists
        )
    {
        ProvenanceRecord storage r = records[hash];
        return (r.submitter, r.timestamp, r.label, r.exists);
    }

    function isRecorded(bytes32 hash) external view returns (bool) {
        return records[hash].exists;
    }
}