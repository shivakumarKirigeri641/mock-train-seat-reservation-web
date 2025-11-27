import ReactDOM from "react-dom/client";
import LogoutPage from "./components/LogoutPage";
import Layout from "./components/Layout";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router";
import TicketConfirmationPage from "./components/TicketConfirmationPage";
import SummarisePassengerDetailsPage from "./components/SummariseDetailsPage";
import BookingHistoryPage from "./components/BookingHistoryPage";
import Dashboard from "./components/Dashboard";
import PnrStatusPage from "./components/PnrStatusPage";
import CancelTicketPage from "./components/CancelTicketPage";
import BookTicketPage from "./components/BookTicketPage";
import Error from "./components/Error";
import ProfilePage from "./components/ProfilePage";
import LoginPage from "./components/LoginPage";
import TermsAndConditions from "./components/TermsAndConditions";
import PrivacyPolicy from "./components/PrivacyPolicy";
import PassengerDetailsPage from "./components/PassengerDetailsPage";
import { Provider } from "react-redux";
import appStore from "./store/appStore";
import APIDocumentationPage from "./components/APIDocumentationPage";
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
      { path: "/", element: <LoginPage /> },
      { path: "/logout", element: <LogoutPage /> },

      // Wrap authenticated / main pages with Layout
      {
        element: <Layout />,
        children: [
          { path: "/user-home", element: <Dashboard /> },
          { path: "/book-ticket", element: <BookTicketPage /> },
          { path: "/booking-history", element: <BookingHistoryPage /> },
          { path: "/pnr-status", element: <PnrStatusPage /> },
          { path: "/confirm-ticket", element: <PassengerDetailsPage /> },
          { path: "/passenger-details", element: <PassengerDetailsPage /> },
          { path: "/cancel-ticket", element: <CancelTicketPage /> },
          { path: "/profile", element: <ProfilePage /> },
          {
            path: "/summarise-passenger-details",
            element: <SummarisePassengerDetailsPage />,
          },
          { path: "/ticket-confirmation", element: <TicketConfirmationPage /> },
          { path: "/api-documentation", element: <APIDocumentationPage /> },
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
