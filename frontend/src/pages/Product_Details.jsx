import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Loading from "../components/Loading";

const API_BASE_URL = "http://127.0.0.1:8000";

const getProductImageUrl = (image) => {
  if (!image) return "/images/switch.png";
  if (image.startsWith("http")) return image;

  return `${API_BASE_URL}${image.startsWith("/") ? "" : "/"}${image}`;
};

const formatPrice = (price) =>
  new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
  }).format(Number(price));

const Product_Details = () => {
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const { id } = useParams();

  useEffect(() => {
    const fetchProductDetails = async () => {
      setIsLoading(true);
      setError("");

      try {
        const response = await axios.get(`${API_BASE_URL}/product/${id}/`);
        setProduct(response.data);
        setQuantity(response.data.countInStock > 0 ? 1 : 0);
      } catch (err) {
        console.log(err);
        setError("Product details could not be loaded.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProductDetails();
  }, [id]);

  const increaseQuantity = () => {
    if (quantity < product.countInStock) {
      setQuantity((prev) => prev + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleAddToCart = () => {
    console.log("Added to cart:", {
      product,
      quantity,
    });
  };

  if (isLoading) return <Loading />;

  if (error || !product) {
    return (
      <section className="min-h-screen bg-white px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <p className="text-sm text-red-600">
            {error || "Product was not found."}
          </p>
        </div>
      </section>
    );
  }

  const imageUrl = getProductImageUrl(product.image);

  return (
    <section className="min-h-screen bg-white px-6 py-16">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2">
          {/* Product Image */}
          <div className="flex justify-center">
            <img
              src={imageUrl}
              alt={product.product_name}
              className="w-full max-w-sm object-contain"
            />
          </div>

          {/* Product Info */}
          <div className="flex flex-col items-start">
            <h1 className="text-3xl font-bold text-black">
              {product.product_name}
            </h1>

            <p className="mt-3 text-xl text-black">
              {formatPrice(product.product_price)}
            </p>

            <p className="mt-3 text-sm text-black">
              Available Stocks: {product.countInStock}
            </p>

            {/* Quantity Control */}
            <div className="mt-3 flex items-center gap-6">
              <button
                type="button"
                onClick={decreaseQuantity}
                disabled={quantity <= 1}
                className="flex h-8 w-8 items-center justify-center bg-[#0f2557] text-white hover:bg-[#172f68]"
              >
                -
              </button>

              <span className="text-sm text-black">{quantity}</span>

              <button
                type="button"
                onClick={increaseQuantity}
                disabled={quantity >= product.countInStock}
                className="flex h-8 w-8 items-center justify-center bg-[#0f2557] text-white hover:bg-[#172f68]"
              >
                +
              </button>
            </div>

            <button
              type="button"
              onClick={handleAddToCart}
              disabled={product.countInStock < 1}
              className="mt-4 w-64 bg-[#0f2557] py-2 text-sm text-white hover:bg-[#172f68]"
            >
              Add to cart
            </button>
          </div>
        </div>

        {/* Description */}
        <div className="mt-20 max-w-4xl">
          <h2 className="text-sm font-bold text-black">Description</h2>

          <p className="mt-3 text-sm leading-snug text-black">
            {product.description}
          </p>
        </div>
      </div>
    </section>
  );
};

export default Product_Details;
