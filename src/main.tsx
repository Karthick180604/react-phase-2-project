// import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./pages/Auth/Login.tsx";
import Signup from "./pages/Auth/Signup.tsx";
import Home from "./pages/Home/Home.tsx";
import WebLayout from "./pages/WebLayout/WebLayout.tsx";
import { Provider } from "react-redux";
import { store } from "./redux/Store/store.ts";

const router = createBrowserRouter([
    {
        path:"/login",
        element:<Login />
    },
    {
        path:"/signup",
        element:<Signup />
    },
    {
        path:"/",
        element:<WebLayout />,
        children:[
            {index:true, element:<Home />}
        ]
    }
])

createRoot(document.getElementById("root")!).render(
    <Provider store={store}>
        <RouterProvider router={router} />
    </Provider>
);
