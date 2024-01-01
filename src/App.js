import "./App.css";

// This file is the entry point for the app. It is used to wrap the app with the RainbowKitProvider and WagmiConfig components.

// Import the global style sheet as well as the RainbowKit and react-toastify stylesheets.
import "react-toastify/dist/ReactToastify.css";
import "@rainbow-me/rainbowkit/styles.css";

// Import the connectorsForWallets function to create a list of wallets to connect to.
// Import the RainbowKitProvider component to wrap the app with.
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { BrowserRouter, Route, Routes } from "react-router-dom";
// Import three different wallets connectors from the RainbowKit package.
//
import { getDefaultWallets } from "@rainbow-me/rainbowkit";
// Import configureChains, createClient, and WagmiConfig from the Wagmi package to configure the Wagmi client.
import { configureChains, createClient, WagmiConfig } from "wagmi";

// Import the jsonRpcProvider from the Wagmi package to specify the RPC URLs of the chains we want to connect to.

// Import the ToastContainer component from react-toastify to display notifications.
import { ToastContainer } from "react-toastify";

import { publicProvider } from "wagmi/providers/public";
import Header from "./components/Header";
import Home from "./components/Home";
import Footer from "./components/Footer";
import Faucet from "./components/Faucet";
const okpoko = {
  id: 0x500fad,
  name: "Okpoko",
  network: "okpoko",
  iconUrl: "https://example.com/icon.svg",
  iconBackground: "#fff",
  nativeCurrency: {
    decimals: 18,
    name: "OKPOKO",
    symbol: "OKP",
  },
  rpcUrls: {
    public: { http: ["http://devemel123.xyz:8545"] },
    default: { http: ["http://devemel123.xyz:8545"] },
  },

  testnet: false,
};
// 173.249.25.82
// devemel123.xyz 
const { provider, chains } = configureChains([okpoko], [publicProvider()]);

const { connectors } = getDefaultWallets({
  appName: "NewzPay",
  projectId: "f2b6bcbe27485bc2aa6c3c619c9e7165",
  chains,
});

// Create the Wagmi client.
const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});

function App() {
  return (
    <div className="App">
      <WagmiConfig client={wagmiClient}>
        <RainbowKitProvider chains={chains} coolMode={true}>
          <ToastContainer position={"bottom-center"} />
          <BrowserRouter>
            {/* header */}
            <Header />
            {/* routes */}
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/faucet" element={<Faucet />} />
            </Routes>
            {/* footer */}
            <Footer />
          </BrowserRouter>
        </RainbowKitProvider>
      </WagmiConfig>
    </div>
  );
}

export default App;
