import React from "react";
import AddProductModal from "./AddProductModal";
import ProductList from "./ProductList";
const Home = () => {
  return (
    <div className="min-h-[80vh] bg-[#000000] text-[#ffffff]">
      <AddProductModal />
      <div className="mt-20 text-4xl">
        Welcome to Cameo. Home of everything camera <br />Explore cameo marketplace
      </div>
      <ProductList />
    </div>
  );
};

export default Home;
