import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthProvider";

const Profile = () => {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  const purchaseHistory = [
    {
      id: 1,
      productName: "Cisco Example",
      purchaseDate: "January 15 2025",
      quantity: 2,
      amount: "$2999",
    },
    {
      id: 2,
      productName: "Cisco Example",
      purchaseDate: "January 15 2025",
      quantity: 2,
      amount: "$2999",
    },
    {
      id: 3,
      productName: "Cisco Example",
      purchaseDate: "January 15 2025",
      quantity: 2,
      amount: "$2999",
    },
  ];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <main className="min-h-screen bg-white px-4 py-8 text-black sm:px-6">
      <section className="mx-auto max-w-[930px] border border-gray-200 bg-white px-7 py-6 shadow-[0_3px_4px_rgba(0,0,0,0.25)] sm:px-8">
        <h1 className="text-[28px] font-bold leading-tight">My Profile</h1>

        <div className="mt-5 space-y-3 text-sm">
          <p>
            <span className="font-bold">Username:</span>
            <span className="ml-3">emapleUser</span>
          </p>
          <p>
            <span className="font-bold">Email:</span>
            <span className="ml-3">exmaple@example.com</span>
          </p>
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
          <table className="w-full min-w-[760px] table-fixed text-left text-xs">
            <thead>
              <tr className="font-bold">
                <th className="w-[23%] py-2">Product Image</th>
                <th className="w-[24%] py-2">Product Name</th>
                <th className="w-[23%] py-2">Purchase Date</th>
                <th className="w-[17%] py-2 text-center">Quantity</th>
                <th className="w-[13%] py-2 text-center">Amount</th>
              </tr>
            </thead>
            <tbody>
              {purchaseHistory.map((purchase) => (
                <tr key={purchase.id}>
                  <td className="py-8">
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
                  </td>
                  <td className="py-8">{purchase.productName}</td>
                  <td className="py-8">{purchase.purchaseDate}</td>
                  <td className="py-8 text-center">{purchase.quantity}</td>
                  <td className="py-8 text-center">{purchase.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
};

export default Profile;
