// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import {Test} from "forge-std/Test.sol";
import {console} from "forge-std/console.sol";
import {Vault} from "../src/Vault.sol";
import {ERC20} from "../node_modules/@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {IERC20} from "../node_modules/@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract MockERC20 is ERC20 {
    constructor(string memory name, string memory symbol) ERC20(name, symbol) {
        _mint(msg.sender, 1000000 * 10**decimals());
    }
}

contract VaultTest is Test {
    Vault public vault;
    MockERC20 public asset;
    address public owner;
    address public user1;
    address public user2;

    uint256 public constant INITIAL_BALANCE = 10000 * 1e18;
    uint256 public constant WITHDRAWAL_COOLDOWN = 1 days;
    uint256 public constant MAX_WITHDRAWAL_PERCENTAGE = 5000; // 50%

    event Deposit(address indexed caller, address indexed owner, uint256 assets, uint256 shares);
    event Withdraw(address indexed caller, address indexed receiver, address indexed owner, uint256 assets, uint256 shares);

    function setUp() public {
        owner = address(this);
        user1 = address(0x1);
        user2 = address(0x2);

        asset = new MockERC20("Mock Token", "MTK");
        vault = new Vault(IERC20(address(asset)), "Vault Token", "VTK", WITHDRAWAL_COOLDOWN, MAX_WITHDRAWAL_PERCENTAGE);

        asset.approve(address(vault), type(uint256).max);
        asset.transfer(user1, INITIAL_BALANCE);
        asset.transfer(user2, INITIAL_BALANCE);

        vm.prank(user1);
        asset.approve(address(vault), type(uint256).max);
        vm.prank(user2);
        asset.approve(address(vault), type(uint256).max);
    }

    function testDeposit() public {
        uint256 depositAmount = 1000 * 1e18;

        vm.prank(user1);
        vault.deposit(depositAmount, user1);

        assertEq(vault.balanceOf(user1), depositAmount);
        assertEq(vault.totalAssets(), depositAmount);
        assertEq(vault.totalSupply(), depositAmount);

        (uint256 balance, uint256 baseBalance, uint256 latestDeposit, ) = vault.userInfo(user1);
        assertEq(balance, depositAmount);
        assertEq(baseBalance, depositAmount);
        assertEq(latestDeposit, block.timestamp);

        console.log("User1 shares after deposit:", vault.balanceOf(user1));
        console.log("Total assets in vault after deposit:", vault.totalAssets());
    }

    function testWithdraw() public {
        uint256 depositAmount = 1000 * 1e18;
        uint256 withdrawAmount = 500 * 1e18;

        vm.startPrank(user1);
        vault.deposit(depositAmount, user1);
        
        vm.warp(block.timestamp + WITHDRAWAL_COOLDOWN + 1);
        
        uint256 sharesBefore = vault.balanceOf(user1);
        vault.withdraw(withdrawAmount, user1, user1);
        uint256 sharesAfter = vault.balanceOf(user1);

        assertEq(vault.balanceOf(user1), depositAmount - withdrawAmount);
        assertEq(vault.totalAssets(), depositAmount - withdrawAmount);
        
        console.log("User1 shares before withdrawal:", sharesBefore);
        console.log("User1 shares after withdrawal:", sharesAfter);
        console.log("Total assets in vault after withdrawal:", vault.totalAssets());

        vm.stopPrank();
    }

    function testFailWithdrawTooSoon() public {
        uint256 depositAmount = 1000 * 1e18;
        uint256 withdrawAmount = 500 * 1e18;

        vm.startPrank(user1);
        vault.deposit(depositAmount, user1);
        
        // Try to withdraw immediately (should fail)
        vault.withdraw(withdrawAmount, user1, user1);

        vm.stopPrank();
    }

    function testFailWithdrawTooMuch() public {
        uint256 depositAmount = 1000 * 1e18;
        uint256 withdrawAmount = 600 * 1e18; // 60%, which is more than the MAX_WITHDRAWAL_PERCENTAGE

        vm.startPrank(user1);
        vault.deposit(depositAmount, user1);
        
        vm.warp(block.timestamp + WITHDRAWAL_COOLDOWN + 1);
        
        // Try to withdraw more than allowed (should fail)
        vault.withdraw(withdrawAmount, user1, user1);

        vm.stopPrank();
    }

    function testMaxWithdraw() public {
        uint256 depositAmount = 1000 * 1e18;

        vm.startPrank(user1);
        vault.deposit(depositAmount, user1);
        
        // Check max withdraw before cooldown
        assertEq(vault.maxWithdraw(user1), 0);
        
        vm.warp(block.timestamp + WITHDRAWAL_COOLDOWN + 1);
        
        // Check max withdraw after cooldown
        assertEq(vault.maxWithdraw(user1), depositAmount / 2); // 50% of deposit

        console.log("Max withdrawable amount for user1:", vault.maxWithdraw(user1));

        vm.stopPrank();
    }

    function testMultipleUsersDepositWithdraw() public {
        uint256 depositAmount1 = 1000 * 1e18;
        uint256 depositAmount2 = 1500 * 1e18;

        vm.prank(user1);
        vault.deposit(depositAmount1, user1);

        vm.prank(user2);
        vault.deposit(depositAmount2, user2);

        assertEq(vault.totalAssets(), depositAmount1 + depositAmount2);

        vm.warp(block.timestamp + WITHDRAWAL_COOLDOWN + 1);

        uint256 withdrawAmount1 = 400 * 1e18;
        uint256 withdrawAmount2 = 600 * 1e18;

        vm.prank(user1);
        vault.withdraw(withdrawAmount1, user1, user1);

        vm.prank(user2);
        vault.withdraw(withdrawAmount2, user2, user2);

        assertEq(vault.totalAssets(), depositAmount1 + depositAmount2 - withdrawAmount1 - withdrawAmount2);

        console.log("Total assets after multiple users deposit and withdraw:", vault.totalAssets());
    }

    function testOwnerFunctions() public {
        uint256 betAmount = 100 * 1e18;

        // Test placeBet function
        vault.placeBet(betAmount);

        // Test settleOnMarketClose function
        vault.settleOnMarketClose();

        // These functions are empty in the contract, so we're just testing that they don't revert
        assertTrue(true);
    }

    function testGetMaxWithdrawalAmount() public {
        uint256 depositAmount = 1000 * 1e18;

        vm.prank(user1);
        vault.deposit(depositAmount, user1);

        uint256 maxWithdrawal = vault.getMaxWithdrawalAmount(user1);
        assertEq(maxWithdrawal, depositAmount / 2); // 50% of deposit

        console.log("Max withdrawal amount for user1:", maxWithdrawal);
    }

    function testGetUserBalance() public {
        uint256 depositAmount = 1000 * 1e18;

        vm.prank(user1);
        vault.deposit(depositAmount, user1);

        uint256 userBalance = vault.getUserBalance(user1);
        assertEq(userBalance, depositAmount);

        console.log("User1 balance:", userBalance);
    }
}