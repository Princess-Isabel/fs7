import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import Loading from "../components/Loading";
import { BASE_URL } from "../api/base";
import { authRequest } from "../api/Auth_refresh";

const getProductImageUrl = (image) => {
  if (!image) return "/images/switch.png";
  if (image.startsWith("http")) return image;

  return `${BASE_URL}${image.startsWith("/") ? "" : "/"}${image}`;
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
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [error, setError] = useState("");
  const [cartMessage, setCartMessage] = useState("");
  const [cartError, setCartError] = useState("");
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProductDetails = async () => {
      setIsLoading(true);
      setError("");

      try {
        const response = await axios.get(`${BASE_URL}/product/${id}/`);
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

  const handleAddToCart = async () => {
    const accessToken = localStorage.getItem("access_token");
    const refreshToken = localStorage.getItem("refresh_token");

    if (!accessToken && !refreshToken) {
      navigate("/login");
      return;
    }

    setIsAddingToCart(true);
    setCartMessage("");
    setCartError("");

    try {
      await authRequest("post", "/cart/add/", {
        product_id: product.product_id,
        qty: quantity,
      });

      setCartMessage(`${quantity} item added to your cart.`);
    } catch (err) {
      console.log(err);

      if (err.response?.status === 401) {
        navigate("/login");
        return;
      }

      setCartError("This product could not be added to your cart.");
    } finally {
      setIsAddingToCart(false);
    }
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
              disabled={product.countInStock < 1 || isAddingToCart}
              className="mt-4 w-64 bg-[#0f2557] py-2 text-sm text-white transition hover:bg-[#172f68] disabled:cursor-not-allowed disabled:bg-gray-400"
            >
              {isAddingToCart ? "Adding..." : "Add to cart"}
            </button>

            {cartMessage && (
              <p className="mt-3 text-sm font-semibold text-green-700">
                {cartMessage}{" "}
                <Link to="/cart" className="underline">
                  View cart
                </Link>
              </p>
            )}

            {cartError && (
              <p className="mt-3 text-sm font-semibold text-red-600">
                {cartError}
              </p>
            )}
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
