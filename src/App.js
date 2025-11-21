import ReactDOM from "react-dom/client";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router";
import HomePage from "./components/HomePage";
import BookTicketPage from "./components/BookTicketPage";
import Error from "./components/Error";
import LoginPage from "./components/LoginPage";
import UserHomePage from "./components/UserHomePage";
const App = () => {
  return (
    <div>
      <Outlet />
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
    ],
    errorElement: <Error />,
  },
]);
ReactDOM.createRoot(document.getElementById("root")).render(
  <RouterProvider router={appRouter}></RouterProvider>
);
export default App;
