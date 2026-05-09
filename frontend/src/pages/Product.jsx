import React, { useState, useEffect, use } from "react";
import axios from "axios";
import Loading from "../components/Loading";
import { Link } from "react-router-dom";
import { BASE_URL } from "../api/base";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/products`);
      setProducts(response.data);
      setLoading(false);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  if (isLoading) return <Loading />;

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">
          Customers also purchased
        </h2>

        <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
          {products.map((product) => (
            <Link to={`/product/${product.product_id}`}>
              <div key={product.product_id} className="group relative">
                <img
                  alt={product.image}
                  src={`${BASE_URL}/${product.image}`}
                  className="aspect-square w-full rounded-md bg-gray-200 object-cover group-hover:opacity-75 lg:aspect-auto lg:h-80"
                />
                <div className="mt-4 flex justify-between">
                  <div>
                    <h3 className="text-sm text-gray-700">
                      <a>
                        <span aria-hidden="true" className="absolute inset-0" />
                        {product.product_name}
                      </a>
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {product.brand}
                    </p>
                  </div>
                  <p className="text-sm font-medium text-gray-900">
                    ₱{product.product_price}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Products;
