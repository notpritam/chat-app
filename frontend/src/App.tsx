import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./routes/Layout";
import Login from "./routes/Login";
import ErrorPage from "./error-page";
import ChatPage from "./routes/ChatPage";
import Register from "./routes/Register";
import { toast } from "./components/ui/use-toast";
import { useEffect, useState } from "react";

function App() {
  const [show, setShow] = useState(true);
  useEffect(() => {
    if (show) {
      setTimeout(() => {
        toast({
          description:
            "Server takes 50s to get started in free plan so you may see some lag during first time. Please be patient.",
          title: "Server Info",
        });
      }, 3000);
    }

    return () => {
      setShow(false);
    };
  }, []);

  return (
    <>
      <BrowserRouter basename="/">
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index path="/rooms/:id" element={<ChatPage />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="*" element={<ErrorPage />} />
            {/* This handles all other routes */}
          </Route>
          <Route path="/rooms" element={<Layout />}>
            <Route index path="/rooms/:id" element={<ChatPage />} />

            {/* This handles all other routes */}
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
