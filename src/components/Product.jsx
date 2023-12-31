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

// Approve the spending of the product's price, for the ERC20 cUSD contract
// const approveTx = await approve();
// Define the Product component which takes in the id of the product and some functions to display notifications
const Product = ({ id, setError, setLoading, clear }) => {
  const [product, setProduct] = useState({});
  const [tipAmount, setTipAmount] = useState(0);
  // Use the useAccount hook to store the user's address
  const { address } = useAccount();
  // Use the useContractCall hook to read the data of the product with the id passed in, from the marketplace contract
  const { data: rawProduct } = useContractCall("getNews", [id], true);
  // Use the useContractSend hook to purchase the product with the id passed in, via the marketplace contract
  // const newsPriceInWei = ethers.utils.parseEther(debouncedNewsPrice.toString());
  const _amount = ethers.utils.parseEther(tipAmount.toString());
  const { writeAsync: tipCreator } = useContractSend(
    "tipCreator",
    [Number(id), _amount],
    _amount
  );
  const { writeAsync: likeAndDislikeNews } = useContractSend(
    "likeAndDislikeNews",
    [Number(id)],
    undefined
  );

  // Use the useContractApprove hook to approve the spending of the product's price, for the ERC20 cUSD contract
  // const { writeAsync: approve } = useContractApprove(product?.price?.toString() || "0");
  // Use the useConnectModal hook to trigger the wallet connect modal
  const { openConnectModal } = useConnectModal();
  // Format the product data that we read from the smart contract
  const getFormatProduct = useCallback(() => {
    if (!rawProduct) return null;
    setProduct({
      owner: rawProduct[0],
      title: rawProduct[1],
      description: rawProduct[2],
      likes: Number(rawProduct[3]),
      tips: Number(rawProduct[4]),
    });
  }, [rawProduct]);

  // Call the getFormatProduct function when the rawProduct state changes
  useEffect(() => {
    getFormatProduct();
  }, [getFormatProduct]);

  // Define the handlePurchase function which handles the purchase interaction with the smart contract
  const handleLikeNews = async () => {
    if (!likeAndDislikeNews) {
      throw "Failed to like this news";
    }
    const res = await likeAndDislikeNews();
    await res.wait();
    setLoading("Liking news...");
  };

  // Define the purchaseProduct function that is called when the user clicks the purchase button
  const likeNews = async () => {
    setLoading("Approving ...");
    clear();

    try {
      // If the user is not connected, trigger the wallet connect modal
      if (!address && openConnectModal) {
        openConnectModal();
        return;
      }
      // If the user is connected, call the handlePurchase function and display a notification
      await toast.promise(handleLikeNews(), {
        pending: "Liking news...",
        success: "News liked successfully",
        error: "Failed to like news",
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
  const handleTipNewsCreator = async () => {
    if (!tipCreator) {
      throw "Failed to tip this news creator";
    }
    const res = await tipCreator();
    await res.wait();
    setLoading("Tipping news...");
  };

  const tipNewsCreator = async () => {
    setLoading("Approving ...");
    clear();

    try {
      // If the user is not connected, trigger the wallet connect modal
      if (!address && openConnectModal) {
        openConnectModal();
        return;
      }
      // If the user is connected, call the handlePurchase function and display a notification
      await toast.promise(handleTipNewsCreator(), {
        pending: "Tipping news creator...",
        success: "News creator tipped successfully",
        error: "Failed to tip news creator",
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
            {product.likes} Likes
          </div>

          <div
            className={
              "mr-4 mt-4 bg-amber-400 text-black p-1 rounded-l-lg px-4"
            }
          >
            {product.tips
              ? ethers.utils.formatEther(product.tips.toString())
              : 0}{" "}
            OKP ETH
          </div>
        </div>

        <div className={"m-5"}>
          <div className={"pt-1"}>
            {/* Show the product name */}
            <p className="mt-4 text-2xl font-bold">{product.title}</p>
            <div className={"h-40 overflow-y-hidden scrollbar-hide"}>
              {/* Show the product description */}
              <h3 className="mt-4 text-sm text-gray-700">
                {product.description}
              </h3>
            </div>
          </div>

          <div className="mt-4">
            <input
              type="number"
              onChange={(e) => setTipAmount(Number(e.target.value))}
              placeholder="Enter amount in eth"
              className="h-10 pl-4 w-[100%]"
            />

            <div className="flex items-center">
              <div className="basis-[80%] mr-8">
                <button
                  onClick={tipNewsCreator}
                  className="mt-4 h-14 w-full border-[1px] border-gray-500 text-black p-2 rounded-lg hover:bg-black hover:text-white "
                >
                  Tip Creator
                </button>
              </div>
              <div className="basis-[20%]">
                <button
                  className="bg-[#000000] text-[#ffffff] p-4 mt-4 rounded-lg"
                  onClick={likeNews}
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M12.0122 5.57169L10.9252 4.48469C8.77734 2.33681 5.29493 2.33681 3.14705 4.48469C0.999162 6.63258 0.999162 10.115 3.14705 12.2629L11.9859 21.1017L11.9877 21.0999L12.014 21.1262L20.8528 12.2874C23.0007 10.1395 23.0007 6.65711 20.8528 4.50923C18.705 2.36134 15.2226 2.36134 13.0747 4.50923L12.0122 5.57169ZM11.9877 18.2715L16.9239 13.3352L18.3747 11.9342L18.3762 11.9356L19.4386 10.8732C20.8055 9.50635 20.8055 7.29028 19.4386 5.92344C18.0718 4.55661 15.8557 4.55661 14.4889 5.92344L12.0133 8.39904L12.006 8.3918L12.005 8.39287L9.51101 5.89891C8.14417 4.53207 5.92809 4.53207 4.56126 5.89891C3.19442 7.26574 3.19442 9.48182 4.56126 10.8487L7.10068 13.3881L7.10248 13.3863L11.9877 18.2715Z"
                      fill="currentColor"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product;
