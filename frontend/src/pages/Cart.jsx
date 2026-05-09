import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Loading from "../components/Loading";
import { authRequest } from "../api/Auth_refresh";
import { BASE_URL } from "../api/base";

const formatAmount = (amount) =>
  new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
  }).format(Number(amount));

const getProductImageUrl = (image) => {
  if (!image) return "";
  if (image.startsWith("http")) return image;

  return `${BASE_URL}${image.startsWith("/") ? "" : "/"}${image}`;
};

const ProductThumbnail = ({ product }) => {
  const imageUrl = getProductImageUrl(product?.image);

  if (imageUrl) {
    return (
      <img
        src={imageUrl}
        alt={product.product_name}
        className="h-16 w-24 shrink-0 rounded-md border border-gray-200 object-contain p-1"
      />
    );
  }

  return (
    <div className="h-16 w-24 shrink-0 rounded-md border border-gray-400 bg-gray-400 shadow-sm">
      <div className="flex h-full divide-x divide-gray-300">
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className="flex-1 bg-[repeating-linear-gradient(0deg,#2d2d2d_0_3px,#777_3px_6px)]"
          />
        ))}
      </div>
    </div>
  );
};

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyItemIds, setBusyItemIds] = useState([]);

  const fetchCartItems = useCallback(async () => {
    setIsLoading(true);
    setError("");

    try {
      const response = await authRequest("get", "/cart/");
      setCartItems(response.data);
    } catch (err) {
      console.log(err);
      setError("Your cart could not be loaded. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCartItems();
  }, [fetchCartItems]);

  const subtotal = useMemo(
    () =>
      cartItems.reduce(
        (currentTotal, item) =>
          currentTotal + Number(item.product.product_price) * item.qty,
        0,
      ),
    [cartItems],
  );

  const setItemBusy = (id, isBusy) => {
    setBusyItemIds((ids) =>
      isBusy ? [...ids, id] : ids.filter((itemId) => itemId !== id),
    );
  };

  const updateQuantity = async (item, amount) => {
    const nextQuantity = item.qty + amount;
    if (nextQuantity < 1 || busyItemIds.includes(item.card_id)) return;

    setItemBusy(item.card_id, true);
    setError("");

    try {
      const response = await authRequest(
        "put",
        `/cart/update/${item.card_id}/`,
        { qty: nextQuantity },
      );

      setCartItems((items) =>
        items.map((cartItem) =>
          cartItem.card_id === item.card_id ? response.data : cartItem,
        ),
      );
    } catch (err) {
      console.log(err);
      setError("Cart quantity could not be updated.");
    } finally {
      setItemBusy(item.card_id, false);
    }
  };

  const removeItem = async (id) => {
    if (busyItemIds.includes(id)) return;

    setItemBusy(id, true);
    setError("");

    try {
      await authRequest("delete", `/cart/delete/${id}/`);
      setCartItems((items) => items.filter((item) => item.card_id !== id));
    } catch (err) {
      console.log(err);
      setError("Item could not be removed from your cart.");
      setItemBusy(id, false);
    }
  };

  if (isLoading) return <Loading />;

  return (
    <main className="min-h-screen bg-[#f7f8fb] px-4 py-8 text-black sm:px-6">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1fr_360px]">
        <section className="border border-gray-200 bg-white px-5 py-6 shadow-[0_3px_4px_rgba(0,0,0,0.16)] sm:px-8">
          <div className="flex flex-col gap-3 border-b border-gray-200 pb-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold leading-tight">
                Shopping Cart
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                {cartItems.length} {cartItems.length === 1 ? "item" : "items"}{" "}
                in your cart
              </p>
            </div>

            <Link
              to="/products"
              className="text-sm font-semibold text-primary hover:underline"
            >
              Continue shopping
            </Link>
          </div>

          {error && (
            <div className="mt-5 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              {error}
            </div>
          )}

          {cartItems.length === 0 ? (
            <div className="flex min-h-72 flex-col items-center justify-center text-center">
              <h2 className="text-xl font-bold">Your cart is empty</h2>
              <p className="mt-2 max-w-sm text-sm text-gray-500">
                Add a product from the catalog and it will show up here.
              </p>
              <Link
                to="/products"
                className="mt-5 rounded-md bg-primary px-5 py-2 text-sm font-bold text-white transition hover:bg-[#10275f]"
              >
                Shop products
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {cartItems.map((item) => {
                const product = item.product;
                const isBusy = busyItemIds.includes(item.card_id);

                return (
                  <div
                    key={item.card_id}
                    className="grid grid-cols-[auto_1fr] gap-4 py-6 sm:grid-cols-[auto_1fr_auto] sm:items-center"
                  >
                    <ProductThumbnail product={product} />

                    <div className="min-w-0">
                      <h2 className="text-sm font-bold sm:text-base">
                        {product.product_name}
                      </h2>
                      <p className="mt-1 text-xs text-gray-500">
                        {product.brand}
                      </p>
                      <p className="mt-3 text-sm font-bold">
                        {formatAmount(product.product_price)}
                      </p>
                    </div>

                    <div className="col-span-2 flex items-center justify-between gap-4 sm:col-span-1 sm:flex-col sm:items-end">
                      <div className="flex items-center gap-2 text-sm font-bold">
                        <span>Qty:</span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item, -1)}
                          disabled={item.qty <= 1 || isBusy}
                          className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-sm shadow-[0_2px_5px_rgba(0,0,0,0.18)] transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
                          aria-label={`Decrease ${product.product_name} quantity`}
                        >
                          -
                        </button>
                        <span className="min-w-6 text-center">{item.qty}</span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item, 1)}
                          disabled={isBusy || item.qty >= product.countInStock}
                          className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-sm shadow-[0_2px_5px_rgba(0,0,0,0.18)] transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
                          aria-label={`Increase ${product.product_name} quantity`}
                        >
                          +
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeItem(item.card_id)}
                        disabled={isBusy}
                        className="text-sm font-semibold text-red-600 transition hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        <aside className="h-fit border border-gray-200 bg-white px-6 py-6 shadow-[0_3px_4px_rgba(0,0,0,0.16)]">
          <h2 className="text-center text-2xl font-bold">Order Summary</h2>

          <div className="mt-7 space-y-4 text-sm font-bold">
            <div className="flex items-center justify-between">
              <span>Sub Total</span>
              <span>{formatAmount(subtotal)}</span>
            </div>

            <div className="border-t border-gray-300 pt-4">
              <div className="flex items-center justify-between">
                <span>Total</span>
                <span>{formatAmount(subtotal)}</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            disabled={cartItems.length === 0}
            className="mt-7 w-full rounded-md bg-primary py-3 text-sm font-bold text-white transition hover:bg-[#10275f] disabled:cursor-not-allowed disabled:bg-gray-300"
          >
            Checkout
          </button>

          <p className="mt-4 text-center text-xs text-gray-500">
            Shipping and payment will be calculated during checkout.
          </p>
        </aside>
      </div>
    </main>
  );
};

export default Cart;
