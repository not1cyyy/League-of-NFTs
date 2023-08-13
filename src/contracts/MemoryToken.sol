pragma solidity ^0.5.0;

import "./ERC721Full.sol";

contract MemoryToken is ERC721Full {
    constructor() public ERC721Full("Memory Token", "MEMORY") {}

    function mint(address _to, string memory _tokenURI) public returns (bool) {
        uint256 _tokenId = totalSupply().add(1);
        _mint(_to, _tokenId);
        _setTokenURI(_tokenId, _tokenURI);
        return true;
    }
}
