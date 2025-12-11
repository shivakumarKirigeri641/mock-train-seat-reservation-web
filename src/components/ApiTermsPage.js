import React from "react";

const ApiTermsPage = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans p-8 selection:bg-indigo-500 selection:text-white">
      <div className="max-w-4xl mx-auto bg-gray-800 border border-gray-700 rounded-2xl p-8 shadow-2xl">
        <h1 className="text-3xl font-bold text-white mb-6 border-b border-gray-700 pb-4">
          API Terms & Conditions
        </h1>

        <div className="space-y-6 text-gray-300 leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-indigo-400 mb-2">
              1. Usage Policy
            </h2>
            <p>
              These APIs are provided strictly for{" "}
              <strong>educational, training, and testing purposes only</strong>.
              You agree not to use these endpoints for any commercial production
              environment or real-world transactions.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-indigo-400 mb-2">
              2. Data Accuracy
            </h2>
            <p>
              All data returned by the API (including PNR status, train
              schedules, vehicle specs, and pincodes) is{" "}
              <strong>mock data</strong>. It does not reflect real-time
              information from IRCTC, RTO, or India Post. We claim no accuracy
              or reliability for real-world usage.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-indigo-400 mb-2">
              3. Rate Limiting
            </h2>
            <p>
              To ensure fair usage, all accounts are subject to a rate limit
              (default: 3 requests/second). Excessive requests may result in a
              temporary ban of your API key.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-indigo-400 mb-2">
              4. Privacy & Data Handling
            </h2>
            <p>
              We do not store your personal search queries. However, for the
              purpose of the "Mock Booking SMS" feature, the mobile number
              provided during the booking flow will be used to trigger a
              simulated SMS. This number is not shared with third parties.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-indigo-400 mb-2">
              5. No Liability
            </h2>
            <p>
              ServerPe.in is not liable for any damages, losses, or issues
              arising from the use or inability to use these mock services.
            </p>
          </section>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-700 text-center">
          <button
            onClick={() => window.close()}
            className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium transition-colors"
          >
            Close Tab
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApiTermsPage;
