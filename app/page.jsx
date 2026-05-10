"use client";
import { useEffect, useState } from "react";

import Hero from "@/components/Hero";
import ProductCard from "@/components/ProductCard";
import axios from "axios";

export default function Home() {
  const [clothings, setClothings] = useState([]);
  const [electronics, setElectronics] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => { 
    const fetchProductsByCategory = async () => {
      try {
        const [clothingRes, electronicRes] = await Promise.all([
          axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/products?categories=Clothing`),
          axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/products?categories=Electronics`)
        ]);

        setClothings(clothingRes.data.items);
        setElectronics(electronicRes.data.items);
      } catch (error) {
        console.error("Error fetching products:", error);
      }finally{
        setLoading(false);
      }
    };
    
    fetchProductsByCategory();
  }, []);

  if (loading) {
    return <div className="text-center text-gray-600">Loading products...</div>;
  }

  return (
    <div className="space-y-10"> 
      <Hero />

      {/* Clothing Section */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Clothing Product</h2>
        
        {
          clothings.length === 0 ? (
            <div className="text-gray-600">No clothing products found.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {
                clothings.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))
              }
            </div>
          )
        }
      </section>

      {/* Electronics Section */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Electronics Product</h2>
        {
          electronics.length === 0 ? (
            <div className="text-gray-600">No electronics products found.</div>
          ) : (    
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {
                electronics.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))
              }
            </div>
          )
        }

      </section>
    </div>
  );
}