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
  const [gano, setGano] = useState("");

  const contractAddress = "0x6b945A880A143A07D6a27c9e6b92f3E65Ca51f6A";
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const contract = new ethers.Contract(contractAddress, abi, signer);

  const createNft = async (
    mezun_adi: string,
    belge_turu: string,
    ogrenci_no: string,
    gano: string
  ) => {
    try {
      // Kullanıcının bağlı MetaMask cüzdanını kontrol et
      if (!window.ethereum) {
        throw new Error("MetaMask not found");
      }

      // MetaMask cüzdanına bağlan
      await window.ethereum.request({ method: "eth_requestAccounts" });

      // Kullanıcıya transaction'ı onaylat
      const transaction = await contract.createNFT(
        mezun_adi,
        belge_turu,
        ogrenci_no,
        gano,
        { gasPrice: ethers.utils.parseUnits("5", "gwei") }
      );

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
        <input
          type="text"
          onChange={(e) => {
            setGano(e.target.value);
          }}
          className="gano m-2 p-4 bg-[#242424] border rounded"
          placeholder="Gano..."
        />
      </div>
      <button
        className="create-nft mt-20 text-lg border-2 border-yellow-500 max-w-sm p-5 rounded hover:scale-110 hover:bg-yellow-500 hover:border-white hover:text-black transition duration-700 hover:border-2"
        onClick={() => {
          createNft("Samet Topal", "Başarı Belgesi", ogrenciNo, gano);
        }}
      >
        Connect Wallet And Mint
      </button>
    </div>
  );
}

export default App;
