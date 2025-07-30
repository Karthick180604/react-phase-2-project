import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./redux/Store/store.ts";
import { createTheme, ThemeProvider } from "@mui/material";
import { Suspense, lazy } from "react";

import ProtectedRoutes from "./components/ProtectedRoutes/ProtectedRoutes.tsx";
import AuthProtectedRoutes from "./components/AuthProtectedRoutes/AuthProtectedRoutes.tsx";

const Login = lazy(() => import("./pages/Auth/Login.tsx"));
const Signup = lazy(() => import("./pages/Auth/Signup.tsx"));
const Home = lazy(() => import("./pages/Home/Home.tsx"));
const WebLayout = lazy(() => import("./pages/WebLayout/WebLayout.tsx"));
const SearchPosts = lazy(() => import("./pages/SearchPosts/SearchPosts.tsx"));
const SearchUsers = lazy(() => import("./pages/SearchUsers/SearchUsers.tsx"));
const UserProfile = lazy(() => import("./pages/UserProfile/UserProfile.tsx"));
const MyProfile = lazy(() => import("./pages/MyProfile/MyProfile.tsx"));
const PageNotFound = lazy(() => import("./pages/PageNotFound/PageNotFound.tsx"));

export const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#F5F5F5",
      contrastText: "#2C3E50",
    },
    secondary: {
      main: "#2C3E50",
      contrastText: "#FFFFFF",
    },
    tertiary: {
      main: "#1ABC9C",
      contrastText: "#FFFFFF",
    },
    background: {
      default: "#FFFFFF",
      paper: "#FAFAFA",
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoutes>
        <Login />
      </ProtectedRoutes>
    ),
  },
  {
    path: "/signup",
    element: (
      <ProtectedRoutes>
        <Signup />
      </ProtectedRoutes>
    ),
  },
  {
    path: "/home",
    element: (
      <ProtectedRoutes>
        <WebLayout />
      </ProtectedRoutes>
    ),
    children: [
      { index: true, element: <Home /> },
      {
        path: "explore",
        element: <SearchPosts />,
      },
      { path: "search", element: <SearchUsers /> },
      { path: "search/profile/:id", element: <UserProfile /> },
      { path: "profile/me", element: <MyProfile /> },
      { path: "*", element: <PageNotFound /> },
    ],
  },
  {
    path: "*",
    element: <PageNotFound />,
  },
]);

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <ThemeProvider theme={theme}>
      <Suspense fallback={<div style={{ textAlign: "center", marginTop: "20vh" }}>Loading...</div>}>
        <RouterProvider router={router} />
      </Suspense>
    </ThemeProvider>
  </Provider>
);
