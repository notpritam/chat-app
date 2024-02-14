import { useEffect, useState } from "react";
import "./App.css";
import useUserStore from "./lib/store";
import { toast } from "./components/ui/use-toast";
import { Button } from "./components/ui/button";
import { BrowserRouter, Link, Route, Routes, redirect } from "react-router-dom";
import { faker } from "@faker-js/faker";
import Layout from "./routes/Layout";
import Room from "./routes/Room";
import Login from "./routes/Login";
import ErrorPage from "./error-page";
import ChatPage from "./routes/ChatPage";
import Register from "./routes/Register";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index path="/rooms/:id" element={<ChatPage />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="*" element={<ErrorPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
