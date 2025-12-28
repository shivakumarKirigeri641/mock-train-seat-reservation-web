import React from "react";
import { Helmet } from "react-helmet";
const RefundPolicyPage = () => {
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
            Refund Policy
          </h1>

          <div className="space-y-6 text-gray-300 leading-relaxed">
            <div className="bg-red-900/20 border border-red-500/30 p-4 rounded-xl text-red-200 font-medium mb-6">
              Please read this policy carefully before making any purchase.
            </div>

            <section>
              <h2 className="text-xl font-semibold text-indigo-400 mb-2">
                1. No Refunds
              </h2>
              <p>
                All sales of API credits, subscription plans, and wallet
                recharges on ServerPe.in are{" "}
                <strong>final and non-refundable</strong>.
              </p>
              <p className="mt-2">
                Once a payment is successfully processed and credits are added
                to your account, we strictly do not offer any refunds,
                cancellations, or chargebacks under any circumstances.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-indigo-400 mb-2">
                2. Digital Goods
              </h2>
              <p>
                Our services constitute "Digital Goods" which are consumed
                immediately upon purchase or API usage. Due to the nature of
                digital goods and the immediate availability of API credits, the
                right of withdrawal or refund is waived upon purchase.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-indigo-400 mb-2">
                3. Failed Transactions
              </h2>
              <p>
                If a transaction fails but the amount has been deducted from
                your bank account, the amount is usually auto-refunded by the
                payment gateway within 5-7 business days. We do not control this
                process. If credits were <strong>not</strong> added to your
                wallet for a successful deduction, please contact support with
                your transaction ID for manual credit adjustment.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-indigo-400 mb-2">
                4. API Uptime & Service Interruptions
              </h2>
              <p>
                While we strive for high availability, temporary service
                interruptions or downtime do not entitle users to a refund of
                their purchased credits or subscription fees.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-indigo-400 mb-2">
                5. Acceptance
              </h2>
              <p>
                By making a purchase on ServerPe.in, you acknowledge that you
                have read, understood, and agreed to this No Refund Policy.
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

export default RefundPolicyPage;
