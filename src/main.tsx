import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./pages/Auth/Login.tsx";
import Signup from "./pages/Auth/Signup.tsx";
import Home from "./pages/Home/Home.tsx";
import WebLayout from "./pages/WebLayout/WebLayout.tsx";
import { Provider } from "react-redux";
import { store } from "./redux/Store/store.ts";
import SearchPosts from "./pages/SearchPosts/SearchPosts.tsx";
import SearchUsers from "./pages/SearchUsers/SearchUsers.tsx";
import UserProfile from "./pages/UserProfile/UserProfile.tsx";
import MyProfile from "./pages/MyProfile/MyProfile.tsx";
import { createTheme, ThemeProvider } from "@mui/material";
import ProtectedRoutes from "./components/ProtectedRoutes/ProtectedRoutes.tsx";
import AuthProtectedRoutes from "./components/AuthProtectedRoutes/AuthProtectedRoutes.tsx";
import PageNotFound from "./pages/PageNotFound/PageNotFound.tsx";


const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#F5F5F5',
      contrastText: '#2C3E50',
    },
    secondary: {
      main: '#2C3E50',
      contrastText: '#FFFFFF',
    },
    tertiary: {
      main: '#1ABC9C',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#FFFFFF',
      paper: '#FAFAFA',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});

const router = createBrowserRouter([
    {
        path:"/",
        element:<AuthProtectedRoutes><Login /></AuthProtectedRoutes>
    },
    {
        path:"/signup",
        element:<AuthProtectedRoutes><Signup /></AuthProtectedRoutes>
    },
    {
        path:"/home",
        element:<ProtectedRoutes><WebLayout /></ProtectedRoutes>,
        children:[
            {index:true, element:<Home />},
            {
                path:"explore", 
                element:<SearchPosts />,
            },
            {path:"search", element:<SearchUsers />},
            {path:"search/profile/:id", element:<UserProfile />},
            {path:"profile/me", element:<MyProfile />},
            { path: "*", element: <PageNotFound /> }
        ]
    },
    {
      path:"*",
      element:<PageNotFound />
    }
    
])

createRoot(document.getElementById("root")!).render(
    <Provider store={store}>
        <ThemeProvider theme={theme}>
            <RouterProvider router={router} />
        </ThemeProvider>
    </Provider>
);
