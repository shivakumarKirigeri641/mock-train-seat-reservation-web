import ReactDOM from "react-dom/client";
import LogoutPage from "./components/LogoutPage";
import Layout from "./components/Layout";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router";
import Error from "./components/Error";
import LoginPage from "./components/LoginPage";
import HomePage from "./components/HomePage";
import ApiUsage from "./components/apiUsage";
import { Provider } from "react-redux";
import appStore from "./store/appStore";
import APIDocumentationPage from "./components/APIDocumentationPage";
import ApiPricing from "./components/ApiPricing";
import UserHomePage from "./components/UserHomePage";
import PrivacyPolicy from "./components/PrivacyPolicy";
import TermsAndConditions from "./components/TermsAndConditions";
import WalletAndRechargesPage from "./components/WalletAndRechargesPage";
import ProfilePage from "./components/ProfilePage";
import APIDocumentationGeneralPage from "./components/APIDocumentationGeneralPage";
import ApiPricingGeneral from "./components/ApiPricingGeneral";
const App = () => {
  return (
    <Provider store={appStore}>
      <div>
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
          { path: "/api-documentation", element: <APIDocumentationPage /> },
          //
          {
            path: "/general-api-documentation",
            element: <APIDocumentationGeneralPage />,
          },
          { path: "/wallet-recharge", element: <WalletAndRechargesPage /> },
          { path: "/profile", element: <ProfilePage /> },
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
