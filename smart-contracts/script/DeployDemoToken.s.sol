// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import {Script} from "forge-std/Script.sol";
import {DemoToken} from "../src/DemoToken.sol";

contract DeployDemoToken is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        DemoToken DemoToken = new DemoToken(
            "DemoToken",
            "ABS",
            18,
            1_000_000_000 * 10 ** 18
        );

        vm.stopBroadcast();
    }
}