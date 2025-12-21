import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductsHeader from '../components/ProductsHeader';
import ProductsGrid from '../components/ProductsGrid';
import WhyWeRecommend from '../components/WhyWeRecommend';

const Products = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
        <ProductsHeader/>
        <ProductsGrid/>
        <WhyWeRecommend/>
      <Footer />
    </div>
  );
};

export default Products;