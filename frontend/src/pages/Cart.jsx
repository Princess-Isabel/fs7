                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        import { useMemo, useState } from "react";

const initialCartItems = [
  {
    id: 1,
    name: "Cisco Product Name",
    price: 2999,
    quantity: 1,
  },
  {
    id: 2,
    name: "Cisco Product Name",
    price: 2999,
    quantity: 1,
  },
];

const formatAmount = (amount) => `$${amount.toLocaleString("en-US")}`;

const ProductThumbnail = () => (
  <div className="h-8 w-16 shrink-0 border border-gray-500 bg-gray-400 shadow-sm sm:h-9 sm:w-20">
    <div className="flex h-full divide-x divide-gray-300">
      {Array.from({ length: 8 }).map((_, index) => (
        <div
          key={index}
          className="flex-1 bg-[repeating-linear-gradient(0deg,#2d2d2d_0_2px,#777_2px_4px)]"
        />
      ))}
    </div>
  </div>
);

const Cart = () => {
  const [cartItems, setCartItems] = useState(initialCartItems);

  const subtotal = useMemo(
    () =>
      cartItems.reduce(
        (currentTotal, item) => currentTotal + item.price * item.quantity,
        0
      ),
    [cartItems]
  );

  const updateQuantity = (id, amount) => {
    setCartItems((items) =>
      items.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + amount) }
          : item
      )
    );
  };

  const removeItem = (id) => {
    setCartItems((items) => items.filter((item) => item.id !== id));
  };

  return (
    <main className="min-h-screen bg-white px-4 py-3 text-black sm:px-6">
      <section className="mx-auto max-w-[760px] border border-gray-200 bg-white px-8 pb-24 pt-12 shadow-[0_3px_4px_rgba(0,0,0,0.25)] sm:px-12">
        <h1 className="text-[28px] font-bold leading-tight sm:text-[34px]">
          Shopping Cart
        </h1>

        <div className="mt-8">
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="grid grid-cols-[auto_1fr_auto] items-center gap-5 border-b border-gray-900 py-6 first:pt-0 sm:gap-8"
            >
              <ProductThumbnail />

              <div>
                <h2 className="text-xs font-bold sm:text-sm">{item.name}</h2>

                <div className="mt-2 flex items-center gap-2 text-[11px] font-bold sm:text-xs">
                  <span>Qty:</span>
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.id, -1)}
                    className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-xs shadow-[0_2px_5px_rgba(0,0,0,0.25)]"
                    aria-label={`Decrease ${item.name} quantity`}
                  >
                    -
                  </button>
                  <span className="min-w-4 text-center">{item.quantity}</span>
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.id, 1)}
                    className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-xs shadow-[0_2px_5px_rgba(0,0,0,0.25)]"
                    aria-label={`Increase ${item.name} quantity`}
                  >
                    +
                  </button>
                </div>

                <p className="mt-2 text-[11px] font-bold sm:text-xs">
                  Price: {formatAmount(item.price)}
                </p>
              </div>

              <button
                type="button"
                onClick={() => removeItem(item.id)}
                className="flex h-6 w-6 items-center justify-center rounded-full text-lg leading-none text-black"
                aria-label={`Remove ${item.name}`}
              >
                &otimes;
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-10 max-w-[760px] border border-gray-100 bg-white px-8 pb-4 pt-4 shadow-[0_3px_4px_rgba(0,0,0,0.2)] sm:px-12">
        <h2 className="text-center text-2xl font-bold">Order Summary</h2>

        <div className="mt-7 flex items-center justify-between px-6 text-sm font-bold">
          <span>Sub Total</span>
          <span>{formatAmount(subtotal)}</span>
        </div>

        <div className="my-7 border-t border-gray-900" />

        <div className="flex items-center justify-between px-6 text-sm font-bold">
          <span>Total</span>
          <span>{formatAmount(subtotal)}</span>
        </div>

        <div className="mt-7 flex justify-center">
          <button
            type="button"
            className="w-full max-w-[570px] rounded-md bg-primary py-2 text-sm font-bold text-white transition hover:bg-[#10275f]"
          >
            Checkout
          </button>
        </div>
      </section>
    </main>
  );
};

export default Cart;
