const MemoryToken = artifacts.require('./MemoryToken.sol')

require('chai')
  .use(require('chai-as-promised'))
  .should()

contract('Memory Token', (accounts) => {
  let token;

  before(async () => {
    token = await MemoryToken.deployed();
  })

  describe('deployment', async () => {
    it('deploys successfully', async () => {
      const address = token.address;
      assert.notEqual(address, 0x0);
      assert.notEqual(address, '');
      assert.notEqual(address, null);
      assert.notEqual(address, undefined);
    })

    it('has a name', async () => {
      const name = await token.name();
      assert.equal(name, 'Memory Token');
    })

    it('has a symbol', async () => {
      const symbol = await token.symbol();
      assert.equal(symbol, 'MEMORY');
    })
  })

  describe('token distribution', async () => {
    let result;

    it('mints tokens', async () => {
      await token.mint(accounts[0], 'https://www.token-uri.com/nft');
      result = await token.totalSupply();
      assert.equal(result.toString(), '1', 'total supply is correct');
      result = await token.balanceOf(accounts[0]);
      assert.equal(result.toString(), '1', 'balanceOf is correct');
      result = await token.ownerOf('1');
      assert.equal(result.toString(), accounts[0].toString(), 'ownerOf is correct');
      result = await token.tokenOfOwnerByIndex(accounts[0], 0);
      let tokenID = result.toString();
      assert.equal(tokenID, '1', 'tokenOfOwnerByIndex is correct');
      result = await token.tokenByIndex(0);
      tokenID = result.toString();
      assert.equal(tokenID, '1', 'tokenByIndex is correct');
    })

    it('lists tokens', async () => {
      const tokenURI = 'https://www.token-uri.com/nft';
      await token.mint(accounts[0], tokenURI);
      await token.mint(accounts[0], tokenURI);
      await token.mint(accounts[0], tokenURI);
      result = await token.totalSupply();
      assert.equal(result.toString(), '4', 'total supply is correct');
      let tokenURIByIndex = await token.tokenByIndex(1);
      assert.equal(tokenURIByIndex.toString(), '2', 'tokenByIndex is correct');
      tokenURIByIndex = await token.tokenOfOwnerByIndex(accounts[0], 1);
      assert.equal(tokenURIByIndex.toString(), '2', 'tokenOfOwnerByIndex is correct');
    })
  })
})
