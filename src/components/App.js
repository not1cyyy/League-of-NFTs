import React, { Component } from 'react';
import Web3 from 'web3'
import './App.css';
import MemoryToken from '../abis/MemoryToken.json'
import thumbnail from '../thumbnail.png'
import theme from "../audio/sg_theme.mp3"
import {BsFillVolumeUpFill,BsFillVolumeMuteFill} from "react-icons/bs"
import { useState } from "react";


const CARD_ARRAY = [
  // { name: "yasuo", img: "/images/yasuo.jpg" },
  { name: "ahri", img: "/images/ahri.jpg" },
  { name: "caitlyn", img: "/images/caitlyn.jpg" },
  { name: "missfortune", img: "/images/missfortune.jpg" },
  { name: "qiyana", img: "/images/qiyana.jpg" },
  { name: "riven", img: "/images/riven.jpg" },
  { name: "sona", img: "/images/sona.jpg" },
  // { name: "yasuo", img: "/images/yasuo.jpg" },
  { name: "ahri", img: "/images/ahri.jpg" },
  { name: "caitlyn", img: "/images/caitlyn.jpg" },
  { name: "missfortune", img: "/images/missfortune.jpg" },
  { name: "qiyana", img: "/images/qiyana.jpg" },
  { name: "riven", img: "/images/riven.jpg" },
  { name: "sona", img: "/images/sona.jpg" },
]

class App extends Component {
  
  async componentWillMount() {
    await this.LoadWeb3()
    await this.LoadBlockchainData()
    this.setState({ cardArray: CARD_ARRAY.sort(() => 0.5 - Math.random()) })
  }

  async LoadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }

  async LoadBlockchainData() {
    const web3 = window.web3
    // Load account
    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })
    // Network ID
    const networkId = await web3.eth.net.getId()
    const networkData = MemoryToken.networks[networkId]
    if (networkData) {
      const abi = MemoryToken.abi
      const address = networkData.address
      const token = new web3.eth.Contract(abi, address)
      this.setState({ token })
      const totalSupply = await token.methods.totalSupply().call()
      this.setState({ totalSupply })
      // Load Tokens
      let balanceOf = await token.methods.balanceOf(accounts[0]).call()
      for (let i = 0; i < balanceOf; i++) {
        let id = await token.methods.tokenOfOwnerByIndex(accounts[0], i).call()
        let tokenURI = await token.methods.tokenURI(id).call()
        this.setState({
          tokenURIs: [...this.state.tokenURIs, tokenURI]
        })
      }
    } else {
      window.alert('Smart contract not deployed to detected network.')
    }
  }

  chooseImage = (cardId) => {
    cardId = cardId.toString()
    if (this.state.cardsWon.includes(cardId)) {
      return window.location.origin + '/images/white.png'
    }
    else if (this.state.cardsChosenId.includes(cardId)) {
      return CARD_ARRAY[cardId].img
    } else {
      return window.location.origin + '/images/blank.png'
    }
  }

  flipCard = async (cardId) => {
    let alreadyChosen = this.state.cardsChosen.length

    this.setState({
      cardsChosen: [...this.state.cardsChosen, this.state.cardArray[cardId].name],
      cardsChosenId: [...this.state.cardsChosenId, cardId]
    })

    if (alreadyChosen === 1) {
      setTimeout(this.checkForMatch, 100)
    }
  }

  checkForMatch = async () => {
    const optionOneId = this.state.cardsChosenId[0]
    const optionTwoId = this.state.cardsChosenId[1]

    if (optionOneId == optionTwoId) {
      alert('Stop hitting yourself!')
    } else if (this.state.cardsChosen[0] === this.state.cardsChosen[1]) {
      alert('OUTPLAYED THEM ALL!')
      this.state.token.methods.mint(
        this.state.account,
        window.location.origin + CARD_ARRAY[optionOneId].img.toString()
      )
        .send({ from: this.state.account })
        .on('transactionHash', (hash) => {
          this.setState({
            cardsWon: [...this.state.cardsWon, optionOneId, optionTwoId],
            tokenURIs: [...this.state.tokenURIs, CARD_ARRAY[optionOneId].img]
          })
        })
    } else {
      alert('*sad noises*')
    }
    this.setState({
      cardsChosen: [],
      cardsChosenId: []
    })
    if (this.state.cardsWon.length === CARD_ARRAY.length) {
      alert('VICTORY!')
    }
  }

  constructor(props) {
    super(props)
    this.state = {
      account: '0x0',    // Metamask account
      token: null,       // Smart contract
      totalSupply: 0,    // Total number of tokens
      tokenURIs: [],     // Array of token URIs
      cardArray: [],     // Array of cards
      cardsChosen: [],   // Array of cards chosen
      cardsChosenId: [], // Array of cards chosen ID
      cardsWon: [],      // Array of cards won
      isMuted: false,    // Mute music bool 

    }
    
  }
  toggleMute = () => {
    this.setState((prevState) => ({
      isMuted: !prevState.isMuted,
    }));
  };
 

  render() {

    const { isMuted } = this.state;
    return (

      <div>
        <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
          <a
            className="navbar-brand col-sm-3 col-md-2 mr-0"
            href="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={thumbnail} width="30" height="30" className="d-inline-block align-top" alt="" />
            &nbsp; League of NFTs
          </a>
          <ul className="navbar-nav px-3">
            <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
              <small className="text-muted"><span id="account">{this.state.account}</span></small>
            </li>
          </ul>
        </nav>
        <div className="container-fluid mt-5" id="container">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto">
                <h1 className="d-4" id="title">Start the hunt !</h1>

                <div className="grid mt-5" id="grid" >

                  {this.state.cardArray.map((card, key) => {
                    return (
                      <img
                        className="card"
                        key={key}
                        src={this.chooseImage(key)}
                        data-id={key}
                        onClick={(event) => {
                          let cardId = event.target.getAttribute('data-id')
                          if (!this.state.cardsWon.includes(cardId.toString())) {
                            this.flipCard(cardId)
                          }
                        }}
                      />
                    )
                  })}

                </div>

                <div>

                  <h5 classNamemt="txt mt-5" id="txt">Tokens Collected:<span id="result">&nbsp;{this.state.tokenURIs.length}</span></h5>


                  <div className="grid mt-5" id="grid2" >

                    {this.state.tokenURIs.map((tokenURI, key) => {
                      return (
                        <img
                          className="card"
                          key={key}
                          src={tokenURI}
                        />
                      )
                    })}

                  </div>

                </div>

              </div>

            </main>
          </div>
        </div>
        <img src="/images/bg.svg" id="bg" />
        <audio autoPlay loop  muted={isMuted}>
  <source src={theme} type="audio/mpeg"  />


</audio>    


    <button className="Mute"  title="Mute/Play Music" onClick={this.toggleMute}>
      {isMuted ?  <BsFillVolumeMuteFill/>:<BsFillVolumeUpFill/>}
      </button>
  </div>



    );
  }
}

export default App;
