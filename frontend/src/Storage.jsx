import React, { useState } from "react";
import "./Storage.css";
import { ethers } from "ethers";
import ABI from "../../contract/artifacts/Storage_abi.json";

const Storage = () => {
  const [showCurrentNumber, setShowCurrentNumber] = useState(null);
  const [connectWallet, setConnectWallet] = useState("Connect Wallet");
  const [showAddress, setShowAddress] = useState("Not connected yet.");
  const [contract, setContract] = useState(null);

  const contractAddress = "0x2C5b47fA954977E59db8bAd4d949683984AF2b25";

  function connectWalletHandler() {
    if (window.ethereum) {
      window.ethereum
        .request({ method: "eth_requestAccounts" })
        .then((result) => {
          setShowAddress(result[0]);
          setConnectWallet("Wallet is connected");
          loadBlockchainData();
        });
    } else {
      alert("You dont have metamask installed");
    }
  }

  const loadBlockchainData = async () => {
    let provider = new ethers.BrowserProvider(window.ethereum);
    let signer = await provider.getSigner();
    let dataFromBlockchain = new ethers.Contract(contractAddress, ABI, signer);
    setContract(dataFromBlockchain);
  };

  const handleSubmitData = async (e) => {
    e.preventDefault();
    await contract.store(e.target.setNumber.value);
    e.target.reset();
    showTheNumber();
  };

  const retrieveData = async () => {
    let val = await contract.retrieve();
    setShowCurrentNumber(val.toString());
  };

  return (
    <div className="container">
      <h1>The Storage dApp</h1>
      <button onClick={connectWalletHandler} className="btn1">
        {connectWallet}
      </button>
      <p>Address: {showAddress}</p>

      <form onSubmit={handleSubmitData}>
        <label htmlFor="setNumber">Type Number</label>
        <input type="number" id="setNumber" />
        <br />
        <button type={"submit"} className="btn2">
          Store Number
        </button>
      </form>

      <button className="btn3" onClick={retrieveData}>
        Retrieve Number
      </button>
      <div className="display">{showCurrentNumber}</div>
    </div>
  );
};

export default Storage;