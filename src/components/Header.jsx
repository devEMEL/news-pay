import { Disclosure } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useEffect, useState } from "react";
import { useAccount, useBalance } from "wagmi";
import { Link } from "react-router-dom";

export default function Header() {
  // Use the useAccount hook to store the user's address
  const { address, isConnected } = useAccount();
  const { data: ethBalance } = useBalance({ address, chainId: 0x5232cb });
  const [displayBalance, setDisplayBalance] = useState(false);

  // If the user is connected and has a balance, display the balance
  useEffect(() => {
    if (isConnected && ethBalance) {
      setDisplayBalance(true);
      console.log("great oo")
      return;
    }
    setDisplayBalance(false);
  }, [ethBalance, isConnected]);

  return (
    <Disclosure
      as="nav"
      className="bg-prosperity border-b border-black bg-[#000000]"
    >
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8 bg-[#000000] text-[#ffffff]">
            <div className="relative flex h-16 justify-between">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                {/* Mobile menu button */}
                <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-black focus:outline-none focus:ring-1 focus:ring-inset focus:rounded-none focus:ring-black">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>

              <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                <div className="flex flex-shrink-0 items-center text-2xl text-[#ffffff]">
                  <Link
                    to="/"
                    className="text-2xl inline-flex items-center border-b-2 border-black px-1 pt-1 font-medium"
                  >
                    Cameo
                  </Link>
                </div>
              </div>
              <div className="flex items-center">
                <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                  <Link
                    to="/faucet"
                    className="text-2xl inline-flex items-center border-b-2 border-black px-1 pt-1 font-medium text-[#ffffff]"
                  >
                    Get Faucet
                  </Link>
                </div>
                <div>
                  {displayBalance && (
                    <span
                      className="inline-block ml-4 px-6 py-2.5 font-medium text-md leading-tight rounded-2xl shadow-none text-[#ffffff]"
                      data-bs-toggle="modal"
                      data-bs-target="#exampleModalCenter"
                    >
                      Balance: {Number(ethBalance?.formatted || 0).toFixed(2)}{" "}
                      $ONI
                    </span>
                  )}
                </div>

                <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                  <ConnectButton
                    showBalance={{ smallScreen: true, largeScreen: false }}
                  />
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </Disclosure>
  );
}
