import React from "react";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans p-8 selection:bg-indigo-500 selection:text-white">
      <div className="max-w-4xl mx-auto bg-gray-800 border border-gray-700 rounded-2xl p-8 shadow-2xl">
        <h1 className="text-3xl font-bold text-white mb-6 border-b border-gray-700 pb-4">
          Privacy Policy
        </h1>

        <div className="space-y-6 text-gray-300 leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-indigo-400 mb-2">
              1. Information We Collect
            </h2>
            <p>
              We collect minimal information required to provide our mock
              services:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4 mt-2">
              <li>
                <strong>Mobile Number:</strong> Used solely to trigger the
                simulated SMS feature for mock bookings.
              </li>
              <li>
                <strong>Email Address:</strong> Used for account verification
                and password recovery.
              </li>
              <li>
                <strong>API Usage Data:</strong> Logs of API calls made using
                your key for rate limiting and analytics.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-indigo-400 mb-2">
              2. How We Use Your Information
            </h2>
            <p>Your data is used exclusively to:</p>
            <ul className="list-disc list-inside space-y-1 ml-4 mt-2">
              <li>Authenticate your API requests.</li>
              <li>Monitor API usage to prevent abuse.</li>
              <li>
                Send mock transactional SMS messages as requested by your API
                calls.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-indigo-400 mb-2">
              3. Data Sharing
            </h2>
            <p>
              We <strong>do not sell, trade, or otherwise transfer</strong> your
              personally identifiable information to outside parties. This is a
              closed sandbox environment.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-indigo-400 mb-2">
              4. Data Retention
            </h2>
            <p>
              Mock booking data and PNR records are temporary. They are
              automatically purged from our systems every 24-48 hours.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-indigo-400 mb-2">
              5. Contact Us
            </h2>
            <p>
              If you have any questions regarding this privacy policy, you may
              contact us at <strong>support@serverpe.in</strong>.
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

export default PrivacyPolicy;
