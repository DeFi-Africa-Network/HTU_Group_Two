import React, {useState, useEffect} from "react";
import './Storage.css'
import {ethers} from 'ethers'
import ABI from '../../contract/artifacts/storage_abi.json'

const Storage = () =>{
  const [showCurrentNumber, setShowCurrentNumber] = useState(null)
  const [connectWallet, setConnectWallet] = useState("Connect Wallet")
  const [showAddress, setShowAddress] = useState("Not connected yet.")
  const [contract, setContract] = useState(null)
  const contractAddress = "0xc964d233Ed33b2A87A7372C8bD9298C8A5Dd427a"

  function connectWalletHandler(){
    if (window.ethereum){
        window.ethereum.request({method: 'eth_requestAccounts'})
        .then(result=>{
            setShowAddress(result[0])
            setConnectWallet("Wallet is Connected")
            loadBlockchainData()
        })
    }
    else{
        alert("You have to intsall your metamask")
    }
  }

  const loadBlockchainData = async() =>{
    try {
        let provider = new ethers.BrowserProvider(window.ethereum)
        let signer = await provider.getSigner()
        let dataFromBlockchain = new ethers.Contract(contractAddress,ABI,signer)
        setContract(dataFromBlockchain)
    } catch (error) {
        console.log(error)
    }
  }

  const handleSubmitData = async(e) =>{
    e.preventDefault()
    const res = await contract.store(e.target.setNumber.value)
    e.target.reset();
    console.log(res)
  }

  const retrieveData = async() =>{
    let val = await contract.retrieve();
    setShowCurrentNumber(val.toString())
  }
  

  return(
    <div className="container">
      <h1>The Storage dApp</h1>
      <button className="btn1" onClick={connectWalletHandler}>{connectWallet}</button>
      <p className="address">Address: {showAddress}</p>
      
      <form onSubmit={handleSubmitData}>
        <div>
        <label htmlFor="setNumber" className="type_number">Type Number</label>
        <div className="qwerty">
        <input type="" id="setNumber"/><br/>
        <button type={'submit'} className="btn2">Store Number</button>
        </div>
        </div>
      </form>
      <button className="btn3" onClick={retrieveData}>Retrieve Number</button>
      <div className="display">{showCurrentNumber}</div>
    </div>
  );
}

export default Storage;