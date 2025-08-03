import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";

// Local import
import ContextProvider from "./context/ContextProvider";
import Main from "./layouts/Main";
import LandingPage from "./pages/LandingPage";
import NotFoundPage from "./pages/NotFoundPage";
import SignUpPage, { signUpAction } from "./pages/SignUpPage";
import SignInPage, { signInAction } from "./pages/SignInPage";
import Home, { homeAction, homeLoader } from "./pages/Home";
import BudgetPage, { budgetAction, budgetLoader } from "./pages/BudgetPage";
import VerifyEmailPage from "./pages/VerifyEmailPage";
import RequireAuth from "./components/RequireAuth";

export default function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Main />,
      children: [
        { path: "/", element: <LandingPage /> },
        { path: "signup", element: <SignUpPage />, action: signUpAction },
        { path: "signin", element: <SignInPage />, action: signInAction },
        {
          path: "home",
          element: (
            <RequireAuth>
              <Home />
            </RequireAuth>
          ),
          loader: homeLoader,
          action: homeAction,
        },
        {
          path: "budgets/:id",
          element: (
            <RequireAuth>
              <BudgetPage />
            </RequireAuth>
          ),
          loader: budgetLoader,
          action: budgetAction,
        },
        { path: "verify", element: <VerifyEmailPage /> },
      ],
    },
    {
      path: "*",
      element: (
        <RequireAuth>
          <NotFoundPage />
        </RequireAuth>
      ),
    },
  ]);

  return (
    <ContextProvider>
      <RouterProvider router={router} />
      <ToastContainer />
    </ContextProvider>
  );
}
