import { useEffect, useState } from "react";
import "./Storage.css";
import { ethers } from "ethers";
import ABI from "../../contract/artifacts/Storage_ABI.json";

function App() {
  const [showCurrentNumber, setShowCurrentNumber] = useState(null);
  const [connectWallet, setConnectWallet] = useState("Connect Wallet");
  const [showAddress, setShowAddress] = useState("Not connected yet.");
  const [contract, setContract] = useState(null);

  const constractAddress = "0x60513e8fC39aa5d1eCd2CcAE187a766e2b36d4Bb";

  const connectWalletHandler = async () => {
    try {
      if (window.ethereum) {
        const res = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setShowAddress(res[0]);
        setConnectWallet("Wallet is connected");
        loadBlockchainData()
        console.log(res);
      } else {
        alert("Please install and set up MetaMask");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const loadBlockchainData = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const dataFromBlockchain = new ethers.Contract(constractAddress, ABI, signer);

      setContract(dataFromBlockchain)
    } catch (error) {
      console.log(error);
    }
  };

  const getNumber = async (e) => {
    e.preventDefault()
    if(!contract) return alert("Please connect your MetaMask!")
    try {
      const val = await contract.retrieve();
      setShowCurrentNumber(val.toString())

    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmitData = async(e) => {
    e.preventDefault()
    if(!contract) return alert("Please connect your MetaMask!")
    const res = await contract.store(e.target.setNumber.value)

    e.target.reset()
    // console.log(res)
  }

  return (
    <>
      <div className="container">
        <h1>The Storage dApp</h1>
        <button className="btn1" onClick={connectWalletHandler}>
          {" "}
          {connectWallet}{" "}
        </button>
        <p className="text">Address: {showAddress}</p>

        <form onSubmit={handleSubmitData}>
          <label htmlFor="setNumber">Type Number</label>
          <input type="number" id="setNumber"  onChange={(e)=> setnumber(e.target.value)}/>
          <br />
          <button type={"submit"} className="btn2">
            Store Number
          </button>
        </form>

        <button className="btn3" onClick={getNumber}>Retrieve Number</button>
        <div className="display">{showCurrentNumber}</div>
      </div>
    </>
  );
}

export default App;
