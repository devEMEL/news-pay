// This component displays and enables the purchase of a product

// Importing the dependencies
import { useCallback, useEffect, useState } from "react";
// Import ethers to format the price of the product correctly
import { ethers } from "ethers";
// Import the useConnectModal hook to trigger the wallet connect modal
import { useConnectModal } from "@rainbow-me/rainbowkit";
// Import the useAccount hook to get the user's address
import { useAccount } from "wagmi";
// Import the toast library to display notifications
import { toast } from "react-toastify";
// Import our custom hooks to interact with the smart contract
import { useContractCall } from "../hooks/contract/useContractRead";
import { useContractSend } from "../hooks/contract/useContractWrite";

const Product = ({ id, setError, setLoading, clear }) => {
  const [product, setProduct] = useState({});
  // Use the useAccount hook to store the user's address
  const { address } = useAccount();
  // Use the useContractCall hook to read the data of the product with the id passed in, from the marketplace contract
  const { data: rawProduct } = useContractCall("readCamera", [id], true);
  const _amount = ethers.utils.parseEther(product.price.toString());

  const { writeAsync: buyCamera } = useContractSend(
    "buyCamera",
    [Number(id)],
    _amount
  );

  const { openConnectModal } = useConnectModal();
  // Format the product data that we read from the smart contract

  const getFormatProduct = useCallback(() => {
    if (!rawProduct) return null;
    setProduct({
      owner: rawProduct[0],
      name: rawProduct[1],
      imageURL: rawProduct[2],
      description: rawProduct[3],
      price: Number(rawProduct[4]),
      sold: Number(rawProduct[4]),
    });
  }, [rawProduct]);

  // Call the getFormatProduct function when the rawProduct state changes
  useEffect(() => {
    getFormatProduct();
  }, [getFormatProduct]);

  // Define the handlePurchase function which handles the purchase interaction with the smart contract
  const handleBuyCamera = async () => {
    if (!buyCamera) {
      throw "Failed to buy camera";
    }
    const res = await buyCamera();
    await res.wait();
    setLoading("Buying camera...");
  };

  // Define the purchaseProduct function that is called when the user clicks the purchase button
  const _buyCamera = async () => {
    setLoading("Approving ...");
    clear();

    try {
      // If the user is not connected, trigger the wallet connect modal
      if (!address && openConnectModal) {
        openConnectModal();
        return;
      }
      // If the user is connected, call the handlePurchase function and display a notification
      await toast.promise(handleBuyCamera(), {
        pending: "Buying Camera...",
        success: "Camera bought successfully",
        error: "Failed to buy camera",
      });
      // If there is an error, display the error message
    } catch (e) {
      console.log({ e });
      setError(e?.reason || e?.message || "Something went wrong. Try again.");
      // Once the purchase is complete, clear the loading state
    } finally {
      setLoading(null);
    }
  };

  // If the product cannot be loaded, return null
  if (!product) return null;

  // Format the price of the product from wei to cUSD otherwise the price will be way too high
  // const productPriceFromWei = ethers.utils.formatEther(product.price.toString());
  return (
    <div className={"shadow-lg relative rounded-b-lg"}>
      <div className="group">
        <div className="flex justify-between items-center">
          {/* Show the number of products sold */}
          <div
            className={
              "ml-4 mt-4 bg-amber-400 text-black p-1 rounded-l-lg px-4"
            }
          >
            {product.sold} sold
          </div>

          <div
            className={
              "mr-4 mt-4 bg-amber-400 text-black p-1 rounded-l-lg px-4"
            }
          >
            {product.price
              ? ethers.utils.formatEther(product.price.toString())
              : 0}{" "}
            $ONI
          </div>
        </div>

        <div className={"m-5"}>
          <div className={"pt-1"}>
            {/* Show the product name */}
            <p className="mt-4 text-2xl font-bold">{product.name}</p>
            <img src={product.imageURL} alt="" className="w-[100%]" />
            <div className={"h-40 overflow-y-hidden scrollbar-hide"}>
              {/* Show the product description */}
              <h3 className="mt-4 text-sm text-gray-700">
                {product.description}
              </h3>
            </div>
            <button onClick={_buyCamera}>Buy Camera</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product;
