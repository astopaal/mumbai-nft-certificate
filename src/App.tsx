import { useState } from "react";
import { ethers } from "ethers";
import abi from "./MyNFT.json";
import "./App.css";

declare global {
  interface Window {
    ethereum: any;
  }
}

function App() {
  const [ogrenciNo, setOgrenciNo] = useState("");
  const [ready, setReady] = useState(false);

  const contractAddress = "0x153670F13e8104B9395BF6FDfe8F2F12293d4497";
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const contract = new ethers.Contract(contractAddress, abi, signer);

  const createCertificate = () => {
    return null;
  };

  const createNft = async (ogrenci_no: number) => {
    try {
      // Kullanıcının bağlı MetaMask cüzdanını kontrol et
      if (!window.ethereum) {
        throw new Error("MetaMask not found");
      }

      // MetaMask cüzdanına bağlan
      await window.ethereum.request({ method: "eth_requestAccounts" });
      console.log("cevrilmis ogrno : ", ogrenciNo);
      // Kullanıcıya transaction'ı onaylat
      const transaction = await contract.createNFT(ogrenci_no);

      const tx = await signer.sendTransaction(transaction);

      // Transaction'ın işleme alınmasını bekle
      const receipt = await tx.wait();
      console.log("Transaction receipt", receipt);
      console.log("NFT created!");
    } catch (error) {
      console.error("Error creating NFT:", error);
    }
  };

  return (
    <div className="h-screen flex flex-col items-center">
      <p className="mt-20 text-5xl text-center"> create nft!</p>
      <div className="flex flex-col mt-10">
        <input
          type="text"
          onChange={(e) => {
            setOgrenciNo(e.target.value);
          }}
          className="ogr-no m-2 p-4 bg-[#242424] border rounded"
          placeholder="Öğrenci no..."
        />
      </div>
      {ready && (
        <button
          className="create-nft mt-20 text-lg border-2 border-yellow-500 max-w-sm p-5 rounded hover:scale-110 hover:bg-yellow-500 hover:border-white hover:text-black transition duration-700 hover:border-2"
          onClick={() => {
            createNft(Number(ogrenciNo));
          }}
        >
          Connect Wallet And Mint
        </button>
      )}
      {!ready && (
        <button
          onClick={() => {
            setReady(true);
            createCertificate();
          }}
        >
          Belge Oluştur
        </button>
      )}
    </div>
  );
}

export default App;
