// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import {Script} from "forge-std/Script.sol";
import {Vault} from "../src/Vault.sol";
import {IERC20} from "../node_modules/@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract DeployVault is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address assetAddress = 0xBE33D97935151225D6E1C0315BBD6EcaCE965B0e;
        
        vm.startBroadcast(deployerPrivateKey);

        // Deploy the Vault contract
        Vault vault = new Vault(
            IERC20(assetAddress),
            "Anti-Black Swan Vault Token",
            "vABS",
            1 days, // WITHDRAWAL_COOLDOWN (1 day in seconds)
            1000 // MAX_WITHDRAWAL_PERCENTAGE (10% represented as 1000 basis points)
        );

        vm.stopBroadcast();
    }
}