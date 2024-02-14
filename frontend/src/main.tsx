import ErrorPage from "./error-page.tsx";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Room from "./routes/Room.tsx";
import Login from "./routes/Login.tsx";
import { Toaster } from "@/components/ui/toaster";
import Register from "./routes/Register.tsx";
import Home from "./routes/Home.tsx";
import ChatPage from "./routes/ChatPage.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Room />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/rooms/:id",
        element: <ChatPage />,
      },
    ],
  },

  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
  { path: "/home", element: <Home /> },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
    <Toaster />
  </React.StrictMode>
);
