import ReactDOM from "react-dom/client";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router";
import TicketConfirmationPage from "./components/TicketConfirmationPage";
import BookingHistoryPage from "./components/BookingHistoryPage";
import PnrStatusPage from "./components/PnrStatusPage";
import CancelTicketPage from "./components/CancelTicketPage";
import HomePage from "./components/HomePage";
import BookTicketPage from "./components/BookTicketPage";
import Error from "./components/Error";
import ProfilePage from "./components/ProfilePage";
import LoginPage from "./components/LoginPage";
import UserHomePage from "./components/UserHomePage";
import GenericHeader from "./components/GenericHeader";
import Footer from "./components/Footer";
import TermsAndConditions from "./components/TermsAndConditions";
import PrivacyPolicy from "./components/PrivacyPolicy";
import PassengerDetailsPage from "./components/PassengerDetailsPage";
import { Provider } from "react-redux";
import appStore from "./store/appStore";
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
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "/user-home",
        element: <UserHomePage />,
      },
      {
        path: "/book-ticket",
        element: <BookTicketPage />,
      },
      {
        path: "/booking-history",
        element: <BookingHistoryPage />,
      },
      {
        path: "/pnr-status",
        element: <PnrStatusPage />,
      },
      {
        path: "/confirm-ticket",
        element: <PassengerDetailsPage />,
      },
      {
        path: "/passenger-details",
        element: <PassengerDetailsPage />,
      },
      {
        path: "/cancel-ticket",
        element: <CancelTicketPage />,
      },
      {
        path: "/profile",
        element: <ProfilePage />,
      },
      {
        path: "/privacy-policy",
        element: <PrivacyPolicy />,
      },
      //ticket-confirmation
      {
        path: "/ticket-confirmation",
        element: <TicketConfirmationPage />,
      },
      {
        path: "/terms-and-conditions",
        element: <TermsAndConditions />,
      },
    ],
    errorElement: <Error />,
  },
]);
ReactDOM.createRoot(document.getElementById("root")).render(
  <RouterProvider router={appRouter}></RouterProvider>
);
export default App;
