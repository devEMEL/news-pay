import React from "react";
import AddProductModal from "./AddProductModal";
import ProductList from "./ProductList";
const Home = () => {
  return (
    <div className="min-h-[70vh]">
      <AddProductModal />
      <ProductList />
    </div>
  );
};

export default Home;
