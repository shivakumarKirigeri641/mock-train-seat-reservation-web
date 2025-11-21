import { useNavigate } from "react-router";

const HomePage = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-6 pt-24 pb-16 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
          Mock Train Seat Booking Platform for Developers
        </h1>

        <p className="text-lg text-gray-600 mt-4 max-w-2xl mx-auto">
          A production-grade simulation environment offering realistic booking
          flows, PNR operations, cancellations, and passenger data handling —
          built specifically for UI development and QA teams.
        </p>

        <p className="text-xs text-red-500 mt-3">
          Disclaimer: Strictly for testing purposes. No real booking or live
          data is used.
        </p>
        <p className="text-sm text-blue-900 mt-2 font-medium">
          Mock-SMS confirmation will also be sent to the provided mobile number
          during booking.
        </p>
        <button
          className="mt-8 bg-blue-600 text-white px-8 py-3 rounded-lg font-medium shadow hover:bg-blue-700 transition"
          onClick={() => {
            navigate("/login");
          }}
        >
          Start Mock Booking
        </button>
      </section>

      {/* Feature Overview */}
      <section className="max-w-6xl mx-auto px-6 pb-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        <div className="bg-white border rounded-xl p-6 shadow-sm hover:shadow-md transition">
          <div className="mb-4">
            <div className="w-10 h-10 bg-blue-100 text-blue-700 flex items-center justify-center rounded-lg">
              🎫
            </div>
          </div>
          <h3 className="text-lg font-semibold text-gray-900">
            Ticket Booking Flow
          </h3>
          <p className="text-gray-600 text-sm mt-2">
            End-to-end mock booking with realistic quota logic, and passenger
            handling.
          </p>
        </div>

        <div className="bg-white border rounded-xl p-6 shadow-sm hover:shadow-md transition">
          <div className="mb-4">
            <div className="w-10 h-10 bg-green-100 text-green-700 flex items-center justify-center rounded-lg">
              📄
            </div>
          </div>
          <h3 className="text-lg font-semibold text-gray-900">
            Booking History
          </h3>
          <p className="text-gray-600 text-sm mt-2">
            Retrieve and manage all historical mock ticket data for UI testing.
          </p>
        </div>

        <div className="bg-white border rounded-xl p-6 shadow-sm hover:shadow-md transition">
          <div className="mb-4">
            <div className="w-10 h-10 bg-purple-100 text-purple-700 flex items-center justify-center rounded-lg">
              🔍
            </div>
          </div>
          <h3 className="text-lg font-semibold text-gray-900">PNR Status</h3>
          <p className="text-gray-600 text-sm mt-2">
            Mock PNR lookup with statuses, passenger lists & coach allocation
            simulation.
          </p>
        </div>

        <div className="bg-white border rounded-xl p-6 shadow-sm hover:shadow-md transition">
          <div className="mb-4">
            <div className="w-10 h-10 bg-red-100 text-red-700 flex items-center justify-center rounded-lg">
              ❌
            </div>
          </div>
          <h3 className="text-lg font-semibold text-gray-900">
            Cancellation Portal
          </h3>
          <p className="text-gray-600 text-sm mt-2">
            Cancel mock tickets with real-flow refund calculations and audit
            tracking.
          </p>
        </div>

        <div className="bg-white border rounded-xl p-6 shadow-sm hover:shadow-md transition">
          <div className="mb-4">
            <div className="w-10 h-10 bg-indigo-100 text-indigo-700 flex items-center justify-center rounded-lg">
              👤
            </div>
          </div>
          <h3 className="text-lg font-semibold text-gray-900">User Profile</h3>
          <p className="text-gray-600 text-sm mt-2">
            Store mock user preferences and retained test cases for consistent
            UI flows.
          </p>
        </div>

        <div className="bg-white border rounded-xl p-6 shadow-sm hover:shadow-md transition">
          <div className="mb-4">
            <div className="w-10 h-10 bg-teal-100 text-teal-700 flex items-center justify-center rounded-lg">
              💻
            </div>
          </div>
          <h3 className="text-lg font-semibold text-gray-900">
            Developer APIs
          </h3>
          <p className="text-gray-600 text-sm mt-2">
            High-quality REST endpoints for rapid UI development and integration
            testing.
          </p>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
