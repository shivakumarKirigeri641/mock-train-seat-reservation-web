import ReactDOM from "react-dom/client";
import { useEffect } from "react";
import PaymentSuccessSummaryPage from "./components/PaymentSuccessSummaryPage";
import SummaryPage from "./components/SummaryPage";
import LogoutPage from "./components/LogoutPage";
import Layout from "./components/Layout";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router";
import Error from "./components/Error";
import TestimonialsPage from "./components/TestimonialsPage";
import LoginPage from "./components/LoginPage";
import HomePage from "./components/HomePage";
import ApiUsage from "./components/apiUsage";
import RefundPolicyPage from "./components/RefundPolicyPage";
import { Provider } from "react-redux";
import appStore from "./store/appStore";
import APIDocumentationPage from "./components/APIDocumentationPage";
import ApiPricing from "./components/ApiPricing";
import FeedbackForm from "./components/FeedbackForm";
import UserHomePage from "./components/UserHomePage";
import AboutMe from "./components/AboutMe";
import PrivacyPolicy from "./components/PrivacyPolicy";
import TermsAndConditions from "./components/TermsAndConditions";
import WalletAndRechargesPage from "./components/WalletAndRechargesPage";
import APIDocumentationGeneralPage from "./components/APIDocumentationGeneralPage";
import ApiPricingGeneral from "./components/ApiPricingGeneral";
import ApiTermsPage from "./components/ApiTermsPage";
import ContactMe from "./components/ContactMe";
import ConnectionStatusIndicator from "./components/ConnectionStatusIndicator";
import { healthCheckService } from "./utils/healthCheckService";

const App = () => {
  useEffect(() => {
    // Start health checks when app mounts
    healthCheckService.start();

    // Cleanup on unmount
    return () => {
      healthCheckService.stop();
    };
  }, []);

  return (
    <Provider store={appStore}>
      <div>
        {/* Connection Status Indicator - shown when connection is unhealthy */}
        <ConnectionStatusIndicator />
        <Outlet />
      </div>
    </Provider>
  );
};
const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/logout", element: <LogoutPage /> },

      // Wrap authenticated / main pages with Layout
      {
        element: <Layout />,
        children: [
          { path: "/user-home", element: <UserHomePage /> },
          { path: "/user-login", element: <LoginPage /> },
          { path: "/api-usage", element: <ApiUsage /> },
          { path: "/api-pricing", element: <ApiPricing /> },
          { path: "/general-api-pricing", element: <ApiPricingGeneral /> },
          { path: "/about-me", element: <AboutMe /> },
          { path: "/testimonials", element: <TestimonialsPage /> },
          { path: "/api-documentation", element: <APIDocumentationPage /> },
          { path: "/api-terms", element: <ApiTermsPage /> },
          { path: "/contact-me", element: <ContactMe /> },
          //
          {
            path: "/general-api-documentation",
            element: <APIDocumentationGeneralPage />,
          },
          { path: "/wallet-recharge", element: <WalletAndRechargesPage /> },
          { path: "/give-feedback", element: <FeedbackForm /> },
          { path: "/plan-summary", element: <SummaryPage /> },
          { path: "/refund-policy", element: <RefundPolicyPage /> },
          {
            path: "/payment-success",
            element: <PaymentSuccessSummaryPage />,
          },
        ],
      },

      // keep public/legal pages accessible (they don't need header)
      { path: "/privacy-policy", element: <PrivacyPolicy /> },
      { path: "/terms-and-conditions", element: <TermsAndConditions /> },
    ],
    errorElement: <Error />,
  },
]);
ReactDOM.createRoot(document.getElementById("root")).render(
  <RouterProvider router={appRouter}></RouterProvider>
);
export default App;
