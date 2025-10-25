import React, { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [paymentLoading, setPaymentLoading] = useState(false);

  const createPaymentOrder = async (productId) => {
    try {
      const response = await axios.post(
        `http://localhost:3000/api/payments/orders/${productId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error creating payment order:", error);
    }
  };

  const handleBuyNow = async (productId) => {
    if (paymentLoading) return;

    setPaymentLoading(true);

    try {
      const order = await createPaymentOrder(productId);
      if (order) {
        console.log("Order details:", order);

        const options = {
          key: "rzp_test_RXhRUgNZmuqtn8",
          amount: order.amount,
          currency: order.currency,
          name: "My Store",
          description: "Test Transaction",
          order_id: order.id,
          theme: {
            color: "#f04646ff",
          },
          handler: async function (response) {
            console.log("Payment successful:", response);
            const {
              razorpay_payment_id,
              razorpay_order_id,
              razorpay_signature,
            } = response;

            try {
              await axios.post("http://localhost:3000/api/payments/verify", {
                orderId: razorpay_order_id,
                paymentId: razorpay_payment_id,
                signature: razorpay_signature,
              });

              alert("Payment verified successfully!");
            } catch (error) {
              console.error("Error verifying payment:", error);
            }
          },
        };

        const rzp1 = new window.Razorpay(options);
        rzp1.open();

        rzp1.on("payment.failed", function (response) {
          console.error("Payment failed:", response.error);
          alert("Payment failed. Please try again.");
        });
      }
    } catch (error) {
      console.error("Error processing payment:", error);
    } finally {
      setPaymentLoading(false);
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      setProductsLoading(true);

      try {
        const response = await axios.get("http://localhost:3000/api/products");
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setProductsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (productsLoading) {
    return <div>Loading...</div>;
  }

  if (products.length === 0) {
    return <div>No products available.</div>;
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
            {(product.price.amount / 100).toFixed(2)} {product.price.currency}
          </p>

          <button
            onClick={() => handleBuyNow(product._id)}
            className={`mt-4 w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 ${
              paymentLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={paymentLoading}
          >
            {paymentLoading ? "Processing..." : "Buy Now"}
          </button>
        </div>
      ))}
    </div>
  );
}

export default App;
