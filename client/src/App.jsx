import React, { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/products");
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  console.log(products);

  if (products.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-full min-h-screen grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-4 p-4 bg-gray-100">
      {products.map((product) => (
        <div key={product._id} className="bg-white p-4 rounded shadow">
          <img
            src={product.imageUrl}
            alt={product.title}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src =
                "https://icon-library.com/images/placeholder-image-icon/placeholder-image-icon-3.jpg";
            }}
            className="w-full h-48 object-cover mb-4 rounded"
          />
          <h2 className="text-lg font-semibold">{product.title}</h2>
          <p className="text-gray-600">{product.description}</p>
          <p className="text-gray-800 font-bold">
            {product.price.amount} {product.price.currency}
          </p>

          <button className="mt-4 w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
            Buy Now
          </button>
        </div>
      ))}
    </div>
  );
}

export default App;
