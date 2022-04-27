// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "./ERC20.sol";
import "./IERC20.sol";
import "./IExchange.sol";
import "./IFactory.sol";

contract Exchange is ERC20{

    string name_ = "Liquidity Token";
    string symbol_ = "LIQUID";

    IERC20 token;
    IFactory factory;

    event TokenPurchase(address indexed buyer, uint256 indexed eth_sold, uint256 indexed tokens_bought);
    event EthPurchase(address indexed buyer, uint256 indexed tokens_sold, uint256 indexed eth_bought);
    event AddLiquidity(address indexed provider, uint256 indexed eth_amount, uint256 indexed token_amount);
    event RemoveLiquidity(address indexed provider, uint256 indexed eth_amount, uint256 indexed token_amount);

    constructor(address token_addr) ERC20(name_, symbol_){
        assert(address(token) == address(0));
        require(token_addr != address(0));
        token = IERC20(token_addr);
        factory = IFactory(msg.sender);
    }

    receive() external payable {
        ethToTokenInput(msg.value, 1, block.timestamp, msg.sender, msg.sender);
    }

    function addLiquidity(uint256 min_liquidity, uint256 max_tokens, uint256 deadline) external payable returns(uint256){
        require(deadline > block.timestamp && max_tokens > 0 && msg.value > 0);
        uint256 total_liquidity = totalSupply();
        if(total_liquidity > 0){
            require(min_liquidity > 0);
            uint256 eth_reserve = address(this).balance - msg.value;
            uint256 token_reserve = token.balanceOf(address(this));
            uint256 token_amount = ((msg.value * token_reserve) / eth_reserve) + 1;
            uint256 liquidity_minted = (msg.value * total_liquidity) / eth_reserve;
            require(max_tokens >= token_amount && liquidity_minted >= min_liquidity);
            _mint(msg.sender, liquidity_minted);
            require(token.transferFrom(msg.sender, address(this), token_amount)); 
            emit AddLiquidity(msg.sender, msg.value, token_amount);
            return liquidity_minted;
        } else {
            assert(address(token) != address(0));
            require(msg.value >= 1000000000);
            uint256 token_amount = max_tokens;
            uint256 initial_liquidity = address(this).balance;
            _mint(msg.sender, initial_liquidity);
            require(token.transferFrom(msg.sender, address(this), token_amount)); 
            emit AddLiquidity(msg.sender, msg.value, token_amount);
            return initial_liquidity;
        }
    }

    function removeLiquidity(uint256 amount, uint256 min_eth, uint256 min_tokens, uint256 deadline) external returns(uint256, uint256){
        require(amount > 0 && deadline > block.timestamp && min_eth > 0 && min_tokens > 0);
        uint256 total_liquidity = totalSupply();
        require(total_liquidity > 0);
        uint256 token_reserve = token.balanceOf(address(this));
        uint256 eth_amount = (amount * address(this).balance) / total_liquidity;
        uint256 token_amount = (amount * token_reserve) / total_liquidity;
        require(eth_amount >= min_eth && token_amount >= min_tokens);
        _burn(msg.sender, amount);
        payable(msg.sender).transfer(eth_amount);
        require(token.transfer(msg.sender, token_amount));
        emit RemoveLiquidity(msg.sender, eth_amount, token_amount);
        return (eth_amount, token_amount);
    }

    function getInputPrice(uint256 input_amount, uint256 input_reserve, uint256 output_reserve) private pure returns (uint256) {
        require(input_reserve > 0 && output_reserve > 0);
        uint256 input_amount_with_fee = input_amount * 997;
        uint256 numerator = input_amount_with_fee * output_reserve;
        uint256 denominator = (input_reserve * 1000) + input_amount_with_fee;
        return numerator / denominator;
    }

    function getOutputPrice(uint256 output_amount, uint256 input_reserve, uint256 output_reserve) private pure returns (uint256) {
        require(input_reserve > 0 && output_reserve > 0);
        uint256 numerator = ((input_reserve * output_amount) * 1000);
        uint256 denominator = (output_reserve - output_amount) * 997;
        return (numerator / denominator) + 1;
    }

    function ethToTokenInput(uint256 eth_sold, uint256 min_tokens, uint256 deadline, address buyer, address recipient) private returns (uint256) {
        require(deadline >= block.timestamp && eth_sold > 0 && min_tokens > 0);
        uint256 token_reserve = token.balanceOf(address(this));
        uint256 tokens_bought = getInputPrice(eth_sold, (address(this).balance - eth_sold), token_reserve);
        require(tokens_bought >= min_tokens);
        require(token.transfer(recipient, tokens_bought));
        emit TokenPurchase(buyer, eth_sold, tokens_bought);
        return tokens_bought;
    }

    function ethToTokenSwapInput(uint256 min_tokens, uint256 deadline) external payable returns (uint256) {
        return ethToTokenInput(msg.value, min_tokens, deadline, msg.sender, msg.sender);
    }

    function ethToTokenTransferInput(uint256 min_tokens, uint256 deadline, address recipient) external payable returns(uint256) {
        require(recipient != address(this) && recipient != address(0));
        return ethToTokenInput(msg.value, min_tokens, deadline, msg.sender, recipient);
    }

    function ethToTokenOutput(uint256 tokens_bought, uint256 max_eth, uint256 deadline, address payable buyer, address recipient) private returns (uint256) {
        require(deadline >= block.timestamp && tokens_bought > 0 && max_eth > 0);
        uint256 token_reserve = token.balanceOf(address(this));
        uint256 eth_sold = getOutputPrice(tokens_bought, (address(this).balance - max_eth), token_reserve);
        uint256 eth_refund = (max_eth - eth_sold);
        if (eth_refund > 0) {buyer.transfer(eth_refund);}
        require(token.transfer(recipient, tokens_bought));
        emit TokenPurchase(buyer, eth_sold, tokens_bought);
        return eth_sold;
    }

    function ethToTokenSwapOutput(uint256 tokens_bought, uint256 deadline) external payable returns(uint256) {
        return ethToTokenOutput(tokens_bought, msg.value, deadline, payable(msg.sender), msg.sender);
    }

    function ethToTokenTransferOutput(uint256 tokens_bought, uint256 deadline, address recipient) external payable returns (uint256) {
        require(recipient != address(this) && recipient != address(0));
        return ethToTokenOutput(tokens_bought, msg.value, deadline, payable(msg.sender), recipient);
    }

    function tokenToEthInput(uint256 tokens_sold, uint256 min_eth, uint256 deadline, address buyer, address payable recipient) private returns (uint256) {
        require(deadline >= block.timestamp && tokens_sold > 0 && min_eth > 0);
        uint256 token_reserve = token.balanceOf(address(this));
        uint256 eth_bought = getInputPrice(tokens_sold, token_reserve, address(this).balance);
        uint256 wei_bought = eth_bought;
        require(wei_bought >= min_eth);

        ///////////RE ENTRANCY ATTACK////////////
        recipient.transfer(wei_bought);
        require(token.transferFrom(buyer, address(this), tokens_sold));
        ///////////RE ENTRANCY ATTACK////////////

        emit EthPurchase(buyer, tokens_sold, wei_bought);
        return wei_bought;
    }

    function tokenToEthSwapInput(uint256 tokens_sold, uint256 min_eth, uint256 deadline) external returns (uint256) {
        return tokenToEthInput(tokens_sold, min_eth, deadline, msg.sender, payable(msg.sender));
    }

    function tokenToEthTransferInput(uint256 tokens_sold, uint256 min_eth, uint256 deadline, address recipient) external returns (uint256) {
        require(recipient != address(this) && recipient != address(0));
        return tokenToEthInput(tokens_sold, min_eth, deadline, msg.sender, payable(recipient));
    }

    function tokenToEthOutput(uint256 eth_bought, uint256 max_tokens, uint256 deadline, address buyer, address payable recipient) private returns (uint256) {
        require(deadline >= block.timestamp && eth_bought > 0);
        uint256 token_reserve = token.balanceOf(address(this));
        uint256 tokens_sold = getOutputPrice(eth_bought, token_reserve, address(this).balance);
        require(max_tokens >= tokens_sold);
        recipient.transfer(eth_bought);
        require(token.transferFrom(buyer, address(this), tokens_sold));
        emit EthPurchase(buyer, tokens_sold, eth_bought);
        return tokens_sold;
    }

    function tokenToEthSwapOutput(uint256 eth_bought, uint256 max_tokens, uint256 deadline) external returns (uint256) {
        return tokenToEthOutput(eth_bought, max_tokens, deadline, msg.sender, payable(msg.sender));
    }

    function tokenToEthTransferOutput(uint256 eth_bought, uint256 max_tokens, uint256 deadline, address payable recipient) external returns (uint256) {
        require(recipient != address(this) && recipient != address(0));
        return tokenToEthOutput(eth_bought, max_tokens, deadline, msg.sender, recipient);
    }

    function tokenToTokenInput(uint256 tokens_sold, uint256 min_tokens_bought, uint256 min_eth_bought, uint256 deadline,address buyer, address recipient, address payable exchange_addr) private returns (uint256) {
        require(deadline >= block.timestamp && tokens_sold > 0 && min_tokens_bought > 0 && min_eth_bought > 0);
        require(exchange_addr != address(this) && exchange_addr != address(0));
        uint256 token_reserve = token.balanceOf(address(this));
        uint256 eth_bought = getInputPrice(tokens_sold, token_reserve, address(this).balance);
        uint256 wei_bought = eth_bought;
        require(wei_bought >= min_eth_bought);
        require(token.transferFrom(buyer, address(this), tokens_sold));
        uint256 tokens_bought = IExchange(exchange_addr).ethToTokenTransferInput{value:wei_bought}(min_tokens_bought, deadline, recipient);        
        emit EthPurchase(buyer, tokens_sold, wei_bought);
        return tokens_bought;
    }

    function tokenToTokenSwapInput(uint256 tokens_sold, uint256 min_tokens_bought, uint256 min_eth_bought, uint256 deadline, address token_addr) external returns (uint256) {
        address payable exchange_addr = factory.getExchange(token_addr);
        return tokenToTokenInput(tokens_sold, min_tokens_bought, min_eth_bought, deadline, msg.sender, msg.sender, exchange_addr);
    }

    function tokenToTokenTransferInput(uint256 tokens_sold, uint256 min_tokens_bought, uint256 min_eth_bought, uint256 deadline, address recipient, address token_addr) external returns (uint256) {
        address payable exchange_addr = factory.getExchange(token_addr);
        return tokenToTokenInput(tokens_sold, min_tokens_bought, min_eth_bought, deadline, msg.sender, recipient, exchange_addr);
    }

    function tokenToTokenOutput(uint256 tokens_bought, uint256 max_tokens_sold, uint256 max_eth_sold, uint256 deadline, address buyer, address recipient, address payable exchange_addr) private returns (uint256) {
        require(deadline >= block.timestamp && (tokens_bought > 0 && max_eth_sold > 0));
        require(exchange_addr != address(this) && exchange_addr != address(0));
        uint256 eth_bought = IExchange(exchange_addr).getEthToTokenOutputPrice(tokens_bought);
        uint256 token_reserve = token.balanceOf(address(this));
        uint256 tokens_sold = getOutputPrice(eth_bought, token_reserve, address(this).balance);
        require(max_tokens_sold >= tokens_sold && max_eth_sold >= eth_bought);
        require(token.transferFrom(buyer, address(this), tokens_sold));
        uint256 eth_sold = IExchange(exchange_addr).ethToTokenTransferOutput{value:eth_bought}(tokens_bought, deadline, recipient); //?
        emit EthPurchase(buyer, tokens_sold, eth_bought);
        return tokens_sold;
    }

    function tokenToTokenSwapOutput(uint256 tokens_bought, uint256 max_tokens_sold, uint256 max_eth_sold, uint256 deadline, address token_addr) external returns (uint256) {
        address payable exchange_addr = factory.getExchange(token_addr);
        return tokenToTokenOutput(tokens_bought, max_tokens_sold, max_eth_sold, deadline, msg.sender, msg.sender, exchange_addr);
    }

    function tokenToTokenTransferOutput(uint256 tokens_bought, uint256 max_tokens_sold, uint256 max_eth_sold, uint256 deadline, address recipient, address token_addr) external returns (uint256) {
        address payable exchange_addr = factory.getExchange(token_addr);
        return tokenToTokenOutput(tokens_bought, max_tokens_sold, max_eth_sold, deadline, msg.sender, recipient, exchange_addr);
    }

    function tokenToExchangeSwapInput(uint256 tokens_sold, uint256 min_tokens_bought, uint256 min_eth_bought, uint256 deadline, address payable exchange_addr) external returns (uint256) {
        return tokenToTokenInput(tokens_sold, min_tokens_bought, min_eth_bought, deadline, msg.sender, msg.sender, exchange_addr);
    }

     function tokenToExchangeTransferInput(uint256 tokens_sold, uint256 min_tokens_bought, uint256 min_eth_bought, uint256 deadline, address recipient, address payable exchange_addr) external returns (uint256) {
        require(recipient != address(this));
        return tokenToTokenInput(tokens_sold, min_tokens_bought, min_eth_bought, deadline, msg.sender, recipient, exchange_addr);
    }

    function tokenToExchangeSwapOutput(uint256 tokens_bought, uint256 max_tokens_sold, uint256 max_eth_sold, uint256 deadline, address payable exchange_addr) external returns (uint256) {
        return tokenToTokenOutput(tokens_bought, max_tokens_sold, max_eth_sold, deadline, msg.sender, msg.sender, exchange_addr);
    }

    function tokenToExchangeTransferOutput(uint256 tokens_bought, uint256 max_tokens_sold, uint256 max_eth_sold, uint256 deadline, address recipient, address payable exchange_addr) external returns (uint256) {
        require(recipient != address(this));
        return tokenToTokenOutput(tokens_bought, max_tokens_sold, max_eth_sold, deadline, msg.sender, recipient, exchange_addr);
    }

    function getEthToTokenInputPrice(uint256 eth_sold) external view returns (uint256) {
        require(eth_sold > 0);
        uint256 token_reserve = token.balanceOf(address(this));
        return getInputPrice(eth_sold, address(this).balance, token_reserve);
    }

    function getEthToTokenOutputPrice(uint256 tokens_bought) external view returns (uint256) {
        require(tokens_bought > 0);
        uint256 token_reserve = token.balanceOf(address(this));
        uint256 eth_sold = getOutputPrice(tokens_bought, address(this).balance, token_reserve);
        return eth_sold;
    }

    function getTokenToEthInputPrice(uint256 tokens_sold) external view returns (uint256) {
        require(tokens_sold > 0);
        uint256 token_reserve = token.balanceOf(address(this));
        uint256 eth_bought = getInputPrice(tokens_sold, token_reserve, address(this).balance);
        return eth_bought;
    }

    function getTokenToEthOutputPrice(uint256 eth_bought) external view returns (uint256) {
        require(eth_bought > 0);
        uint256 token_reserve = token.balanceOf(address(this));
        return getOutputPrice(eth_bought, token_reserve, address(this).balance);
    }

}

