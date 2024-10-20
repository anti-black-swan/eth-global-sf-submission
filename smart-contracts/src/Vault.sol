// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import {IERC20} from "../node_modules/@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {ERC20} from "../node_modules/@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {ERC4626} from "../node_modules/@openzeppelin/contracts/token/ERC20/extensions/ERC4626.sol";
import {Ownable} from "../node_modules/@openzeppelin/contracts/access/Ownable.sol";
import {Math} from "../node_modules/@openzeppelin/contracts/utils/math/Math.sol";

contract Vault is ERC4626, Ownable {
    IERC20 private immutable _asset;
    uint256 public WITHDRAWAL_COOLDOWN;
    uint256 public MAX_WITHDRAWAL_PERCENTAGE;

    struct UserInfo {
        uint256 balance;
        uint256 baseBalance;
        uint256 latestDeposit;
        uint256 latestWithdrawal;
    }

    mapping(address => UserInfo) public userInfo;

    constructor(
        IERC20 asset_,
        string memory name_,
        string memory symbol_,
        uint256 withdrawalCooldown_,
        uint256 maxWithdrawalPercentage_
    ) ERC4626(asset_) ERC20(name_, symbol_) Ownable(msg.sender) {
        _asset = asset_;
        WITHDRAWAL_COOLDOWN = withdrawalCooldown_;
        MAX_WITHDRAWAL_PERCENTAGE = maxWithdrawalPercentage_;
    }

    function asset() public view virtual override returns (address) {
        return address(_asset);
    }

    function totalAssets() public view virtual override returns (uint256) {
        return _asset.balanceOf(address(this));
    }

    function deposit(uint256 assets, address receiver) public virtual override returns (uint256) {
        require(assets > 0, "Deposit amount must be greater than 0");
        uint256 shares = super.deposit(assets, receiver);
        
        UserInfo storage user = userInfo[receiver];
        user.balance += assets;
        user.baseBalance += assets;
        user.latestDeposit = block.timestamp;
        
        return shares;
    }

    function withdraw(uint256 assets, address receiver, address owner) public virtual override returns (uint256) {
        UserInfo storage user = userInfo[owner];
        
        require(assets > 0, "Withdrawal amount must be greater than 0");
        require(user.balance >= assets, "Insufficient balance");
        require(block.timestamp >= user.latestWithdrawal + WITHDRAWAL_COOLDOWN, "Withdrawal cooldown not met");
        
        uint256 maxWithdrawal = (user.baseBalance * MAX_WITHDRAWAL_PERCENTAGE) / 10000;
        require(assets <= maxWithdrawal, "Withdrawal amount exceeds allowed percentage");
        
        uint256 shares = super.withdraw(assets, receiver, owner);
        
        user.balance -= assets;
        user.baseBalance = user.balance;
        user.latestWithdrawal = block.timestamp;
        
        return shares;
    }

    function maxWithdraw(address owner) public view virtual override returns (uint256) {
        UserInfo storage user = userInfo[owner];
        if (block.timestamp < user.latestWithdrawal + WITHDRAWAL_COOLDOWN) {
            return 0;
        }
        uint256 maxWithdrawal = (user.baseBalance * MAX_WITHDRAWAL_PERCENTAGE) / 10000;
        return Math.min(maxWithdrawal, user.balance);
    }

    function placeBet(uint256 amount) public onlyOwner {
        // Empty implementation
    }

    function settleOnMarketClose() public onlyOwner {
        // Empty implementation
    }

    function getMaxWithdrawalAmount(address user) public view returns (uint256) {
        return (userInfo[user].baseBalance * MAX_WITHDRAWAL_PERCENTAGE) / 10000;
    }

    function getUserBalance(address user) public view returns (uint256) {
        return userInfo[user].balance;
    }
}