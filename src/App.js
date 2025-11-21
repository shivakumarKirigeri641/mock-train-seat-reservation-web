import ReactDOM from "react-dom/client";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router";
import TicketConfirmationPage from "./components/TicketConfirmationPage";
import HomePage from "./components/HomePage";
import BookTicketPage from "./components/BookTicketPage";
import Error from "./components/Error";
import LoginPage from "./components/LoginPage";
import UserHomePage from "./components/UserHomePage";
import GenericHeader from "./components/GenericHeader";
import Footer from "./components/Footer";
import TermsAndConditions from "./components/TermsAndConditions";
import PrivacyPolicy from "./components/PrivacyPolicy";
import ConfirmTicketPage from "./components/ConfirmTicketPage";
const App = () => {
  return (
    <div>
      <header class="bg-blue-600 text-white p-4">
        <GenericHeader />
      </header>
      <main class="flex-1 p-4">
        <Outlet />
      </main>
      <footer class="w-full fixed bottom-0 p-1 bg-gray-200">
        <Footer />
      </footer>
    </div>
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
        path: "/confirm-ticket",
        element: <ConfirmTicketPage />,
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
