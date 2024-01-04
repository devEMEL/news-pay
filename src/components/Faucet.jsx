import React from "react";
import { useState } from "react";

import { toast } from "react-toastify";
import { ethers } from "ethers";

const Faucet = () => {
  const [address, setAddress] = useState("");
  const [txHash, setTxHash] = useState("");
  const PRIVATE_KEY =
    "6ae4fe7881c7fd51d6b059a671e7d6e89ed18399b7cc712db5fe772c42278081";

  const providerRPC = {
    okpoko: {
      name: "onimisi",
      rpc: "http://161.97.115.129:8545",
      chainId: 0x5232cb,
    },
  };
  // 173.249.25.82
  // devemel123.xyz

  // 3. Create ethers provider
  const provider = new ethers.providers.JsonRpcProvider(
    providerRPC.okpoko.rpc,
    {
      chainId: providerRPC.okpoko.chainId,
      name: providerRPC.okpoko.name,
    }
  );
  const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

  const handleGetFaucet = async () => {
    // 1. Create tx object
    const tx = {
      to: address,
      value: ethers.utils.parseEther("100"),
    };

    // 2. Sign and send tx - wait for receipt
    const createReceipt = await wallet.sendTransaction(tx);
    await createReceipt.wait();
    setTxHash(createReceipt.hash);
  };

  const getFaucet = async () => {
    try {
      await toast.promise(handleGetFaucet(), {
        pending: "Sending Faucet...",
        success: `Transaction successful with hash: ${txHash}`,
        error: "Failed to send Faucet",
      });
    } catch (e) {
      console.log({ e });
    } finally {
    }
  };

  return (
    <div className="min-h-[70vh]">
      <div className="text-center mt-8">
        <input
          type="text"
          placeholder="Enter your address"
          className="h-14 w-[390px] p-4 border bg-[#f3f3f3]"
          onChange={(e) => setAddress(e.target.value)}
        />
      </div>
      <div className="text-center mt-8 text-2xl">
        <button
          className="text-[30px] bg-[#000000] text-[#FFFFFF] px-6 py-2.5"
          onClick={getFaucet}
        >
          Click Here To Get Faucet
        </button>
      </div>
    </div>
  );
};

export default Faucet;
