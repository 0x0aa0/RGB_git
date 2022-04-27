// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

interface IFactory {
  event NewExchange(address indexed token, address indexed exchange);

  function initializeFactory(address template) external;

  function createExchange(address token) external returns (address payable);

  function getExchange(address token) external view returns (address payable);

  function getToken(address token) external view returns (address);
  
  function getTokenWihId(uint256 token_id) external view returns (address);
}