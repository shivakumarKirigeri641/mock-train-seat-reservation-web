import { useNavigate } from "react-router";

const HomePage = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 selection:bg-indigo-500 selection:text-white">
      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-6 pt-24 pb-16 text-center">
        <div className="inline-block mb-6 px-3 py-1 rounded-full bg-gray-800 border border-gray-700 text-indigo-400 text-sm font-medium">
          v2.0 Enterprise Edition
        </div>
        <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight tracking-tight">
          Mock Train Seat{" "}
          <span className="text-indigo-500">Booking Platform</span>
          <br className="hidden md:block" /> for Developers
        </h1>

        <p className="text-lg text-gray-400 mt-6 max-w-3xl mx-auto leading-relaxed">
          A production-grade simulation environment offering realistic booking
          flows, PNR operations, cancellations, and passenger data handling —
          built specifically for UI development and QA teams.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-4">
          <button
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-xl font-semibold shadow-lg shadow-indigo-500/30 transition-all transform hover:-translate-y-1"
            onClick={() => {
              navigate("/login");
            }}
          >
            Start Mock Booking
          </button>

          <div className="flex flex-col items-center text-sm">
            <p className="text-red-400 font-medium bg-red-900/20 px-4 py-2 rounded-lg border border-red-900/30">
              Disclaimer: Strictly for testing purposes. No real booking or live
              data is used.
            </p>
            <p className="text-indigo-300 mt-2">
              Mock-SMS confirmations are enabled for this session.
            </p>
          </div>
        </div>
      </section>

      {/* Feature Overview */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <h2 className="text-2xl font-bold text-white mb-8 text-center md:text-left">
          Platform Capabilities
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6 hover:bg-gray-750 transition-all hover:border-gray-600 group">
            <div className="mb-4">
              <div className="w-12 h-12 bg-blue-900/30 text-blue-400 border border-blue-500/20 flex items-center justify-center rounded-xl group-hover:scale-110 transition-transform">
                <span className="text-2xl">🎫</span>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors">
              Ticket Booking Flow
            </h3>
            <p className="text-gray-400 text-sm mt-2 leading-relaxed">
              End-to-end mock booking with realistic quota logic, seat
              selection, and passenger handling.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6 hover:bg-gray-750 transition-all hover:border-gray-600 group">
            <div className="mb-4">
              <div className="w-12 h-12 bg-green-900/30 text-green-400 border border-green-500/20 flex items-center justify-center rounded-xl group-hover:scale-110 transition-transform">
                <span className="text-2xl">📄</span>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-white group-hover:text-green-400 transition-colors">
              Booking History
            </h3>
            <p className="text-gray-400 text-sm mt-2 leading-relaxed">
              Retrieve and manage all historical mock ticket data for UI
              regression testing.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6 hover:bg-gray-750 transition-all hover:border-gray-600 group">
            <div className="mb-4">
              <div className="w-12 h-12 bg-purple-900/30 text-purple-400 border border-purple-500/20 flex items-center justify-center rounded-xl group-hover:scale-110 transition-transform">
                <span className="text-2xl">🔍</span>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-white group-hover:text-purple-400 transition-colors">
              PNR Status
            </h3>
            <p className="text-gray-400 text-sm mt-2 leading-relaxed">
              Mock PNR lookup with statuses, passenger lists & coach allocation
              simulation.
            </p>
          </div>

          {/* Card 4 */}
          <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6 hover:bg-gray-750 transition-all hover:border-gray-600 group">
            <div className="mb-4">
              <div className="w-12 h-12 bg-red-900/30 text-red-400 border border-red-500/20 flex items-center justify-center rounded-xl group-hover:scale-110 transition-transform">
                <span className="text-2xl">❌</span>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-white group-hover:text-red-400 transition-colors">
              Cancellation Portal
            </h3>
            <p className="text-gray-400 text-sm mt-2 leading-relaxed">
              Cancel mock tickets with real-flow refund calculations and audit
              tracking logs.
            </p>
          </div>

          {/* Card 5 */}
          <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6 hover:bg-gray-750 transition-all hover:border-gray-600 group">
            <div className="mb-4">
              <div className="w-12 h-12 bg-indigo-900/30 text-indigo-400 border border-indigo-500/20 flex items-center justify-center rounded-xl group-hover:scale-110 transition-transform">
                <span className="text-2xl">👤</span>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-white group-hover:text-indigo-400 transition-colors">
              User Profile
            </h3>
            <p className="text-gray-400 text-sm mt-2 leading-relaxed">
              Store mock user preferences and retained test cases for consistent
              UI flows.
            </p>
          </div>

          {/* Card 6 */}
          <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6 hover:bg-gray-750 transition-all hover:border-gray-600 group">
            <div className="mb-4">
              <div className="w-12 h-12 bg-teal-900/30 text-teal-400 border border-teal-500/20 flex items-center justify-center rounded-xl group-hover:scale-110 transition-transform">
                <span className="text-2xl">💻</span>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-white group-hover:text-teal-400 transition-colors">
              Developer APIs
            </h3>
            <p className="text-gray-400 text-sm mt-2 leading-relaxed">
              High-quality REST endpoints for rapid UI development and
              integration testing.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
