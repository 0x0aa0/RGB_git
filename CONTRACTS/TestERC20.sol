// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "./ERC20.sol";

contract TestERC20 is ERC20{
    string public name_ = "Test ERC20";
    string public symbol_ = "TEST";

    constructor() ERC20(name_, symbol_){
        _mint(msg.sender, 100000 * (10 ** 18));
    }
}
