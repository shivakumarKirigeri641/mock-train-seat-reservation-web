import { Helmet } from "react-helmet";

const TermsAndConditions = () => {
  return (
    <>
      <Helmet>
        <title>ServerPe™ – Desi Mock APIs for Frontend & UI Development</title>
        <meta
          name="description"
          content="ServerPe provides desi mock APIs for frontend developers to build and test UI without real backend dependencies."
        />
      </Helmet>
      <div className="min-h-screen bg-gray-900 text-gray-100 font-sans p-8 selection:bg-indigo-500 selection:text-white">
        <div className="max-w-4xl mx-auto bg-gray-800 border border-gray-700 rounded-2xl p-8 shadow-2xl">
          <h1 className="text-3xl font-bold text-white mb-6 border-b border-gray-700 pb-4">
            Terms and Conditions
          </h1>

          <div className="space-y-6 text-gray-300 leading-relaxed">
            <section>
              <h2 className="text-xl font-semibold text-indigo-400 mb-2">
                1. Introduction
              </h2>
              <p>
                Welcome to ServerPe.in ("we", "our", "us"). These Terms and
                Conditions govern your use of our mock API services. By
                accessing or using our APIs, you agree to be bound by these
                terms.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-indigo-400 mb-2">
                2. Educational Purpose Only
              </h2>
              <p>
                The API endpoints provided (including Train Reservations,
                Car/Bike Specs, and Pincodes) are purely{" "}
                <strong>
                  fictional and for educational/testing purposes only
                </strong>
                . Any resemblance to real-world data, persons, or entities is
                purely coincidental.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-indigo-400 mb-2">
                3. User Responsibilities
              </h2>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>
                  You agree not to use these APIs for production-level financial
                  transactions.
                </li>
                <li>
                  You agree not to overload the service intentionally (DDoS or
                  spamming).
                </li>
                <li>
                  You are responsible for keeping your API Key and Secret
                  confidential.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-indigo-400 mb-2">
                4. Termination
              </h2>
              <p>
                We reserve the right to suspend or terminate your API access
                immediately, without prior notice, if you breach these Terms and
                Conditions.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-indigo-400 mb-2">
                5. Governing Law
              </h2>
              <p>
                These terms shall be governed and construed in accordance with
                the laws of India, without regard to its conflict of law
                provisions.
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
    </>
  );
};

export default TermsAndConditions;
