import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthProvider";
import { authRequest } from "../api/Auth_refresh";
import { BASE_URL } from "../api/base";

const formatAmount = (amount) =>
  new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
  }).format(Number(amount));

const formatPurchaseDate = (date) => {
  if (!date) return "Pending";

  return new Intl.DateTimeFormat("en-PH", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date));
};

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
        className="h-16 w-24 rounded-md border border-gray-200 object-contain p-1"
      />
    );
  }

  return (
    <div className="h-5 w-16 border border-gray-500 bg-gray-400 shadow-sm">
      <div className="flex h-full divide-x divide-gray-300">
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className="flex-1 bg-[repeating-linear-gradient(0deg,#2c2c2c_0_2px,#777_2px_4px)]"
          />
        ))}
      </div>
    </div>
  );
};

const Profile = () => {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [isProfileLoading, setIsProfileLoading] = useState(true);
  const [profileError, setProfileError] = useState("");
  const [purchaseHistory, setPurchaseHistory] = useState([]);
  const [isHistoryLoading, setIsHistoryLoading] = useState(true);
  const [historyError, setHistoryError] = useState("");
  const [deletingPurchaseIds, setDeletingPurchaseIds] = useState([]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await authRequest("get", "/profile/");
        setProfile(response.data);
      } catch (error) {
        setProfileError("Unable to load your profile.");

        if (error.response?.status === 401) {
          navigate("/login", { replace: true });
        }
      } finally {
        setIsProfileLoading(false);
      }
    };

    const fetchPurchaseHistory = async () => {
      try {
        const response = await authRequest("get", "/purchase-history/");
        setPurchaseHistory(response.data);
      } catch (error) {
        setHistoryError("Unable to load your purchase history.");

        if (error.response?.status === 401) {
          navigate("/login", { replace: true });
        }
      } finally {
        setIsHistoryLoading(false);
      }
    };

    fetchProfile();
    fetchPurchaseHistory();
  }, [navigate]);

  const setPurchaseDeleting = (id, isDeleting) => {
    setDeletingPurchaseIds((ids) =>
      isDeleting ? [...ids, id] : ids.filter((purchaseId) => purchaseId !== id),
    );
  };

  const deletePurchaseHistoryItem = async (id) => {
    if (deletingPurchaseIds.includes(id)) return;

    setPurchaseDeleting(id, true);
    setHistoryError("");

    try {
      await authRequest("delete", `/purchase-history/delete/${id}/`);
      setPurchaseHistory((purchases) =>
        purchases.filter((purchase) => purchase.order_id !== id),
      );
    } catch (error) {
      setHistoryError("Purchase history item could not be deleted.");

      if (error.response?.status === 401) {
        navigate("/login", { replace: true });
      }
    } finally {
      setPurchaseDeleting(id, false);
    }
  };

  return (
    <main className="min-h-screen bg-white px-4 py-8 text-black sm:px-6">
      <section className="mx-auto max-w-[930px] border border-gray-200 bg-white px-7 py-6 shadow-[0_3px_4px_rgba(0,0,0,0.25)] sm:px-8">
        <h1 className="text-[28px] font-bold leading-tight">My Profile</h1>

        <div className="mt-5 space-y-3 text-sm">
          {isProfileLoading ? (
            <p className="font-semibold text-gray-600">Loading profile...</p>
          ) : profileError ? (
            <p className="font-semibold text-red-600">{profileError}</p>
          ) : (
            <>
              <p>
                <span className="font-bold">Username:</span>
                <span className="ml-3">{profile.username}</span>
              </p>
              <p>
                <span className="font-bold">Email:</span>
                <span className="ml-3">{profile.email}</span>
              </p>
            </>
          )}
        </div>

        <div className="mt-4 flex justify-end">
          <button
            onClick={handleLogout}
            className="mt-4 rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </section>

      <section className="mx-auto mt-8 max-w-[930px] border border-gray-100 bg-white px-7 pb-40 pt-6 shadow-[0_3px_4px_rgba(0,0,0,0.2)] sm:px-8">
        <h2 className="text-[28px] font-bold leading-tight">
          Purchase History
        </h2>

        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[860px] table-fixed text-left text-xs">
            <thead>
              <tr className="font-bold">
                <th className="w-[18%] py-2">Product Image</th>
                <th className="w-[24%] py-2">Product Name</th>
                <th className="w-[22%] py-2">Purchase Date</th>
                <th className="w-[12%] py-2 text-center">Quantity</th>
                <th className="w-[12%] py-2 text-center">Amount</th>
                <th className="w-[12%] py-2 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {isHistoryLoading ? (
                <tr>
                  <td colSpan="6" className="py-8 text-center font-semibold">
                    Loading purchase history...
                  </td>
                </tr>
              ) : historyError ? (
                <tr>
                  <td
                    colSpan="6"
                    className="py-8 text-center font-semibold text-red-600"
                  >
                    {historyError}
                  </td>
                </tr>
              ) : purchaseHistory.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="py-8 text-center font-semibold text-gray-500"
                  >
                    No purchase history yet.
                  </td>
                </tr>
              ) : (
                purchaseHistory.map((purchase) => {
                  const isDeleting = deletingPurchaseIds.includes(
                    purchase.order_id,
                  );

                  return (
                    <tr key={purchase.order_id}>
                      <td className="py-8">
                        <ProductThumbnail product={purchase.product} />
                      </td>
                      <td className="py-8">
                        {purchase.product?.product_name || "Deleted product"}
                      </td>
                      <td className="py-8">
                        {formatPurchaseDate(purchase.purchase_date)}
                      </td>
                      <td className="py-8 text-center">{purchase.qty}</td>
                      <td className="py-8 text-center">
                        {formatAmount(purchase.amount)}
                      </td>
                      <td className="py-8 text-center">
                        <button
                          type="button"
                          onClick={() =>
                            deletePurchaseHistoryItem(purchase.order_id)
                          }
                          disabled={isDeleting}
                          className="rounded bg-red-500 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:bg-red-300"
                        >
                          {isDeleting ? "Deleting..." : "Delete"}
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
};

export default Profile;
