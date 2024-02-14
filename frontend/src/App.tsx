import { useEffect, useState } from "react";
import "./App.css";
import useUserStore from "./lib/store";
import { toast } from "./components/ui/use-toast";
import { Button } from "./components/ui/button";
import { Link, redirect } from "react-router-dom";

function App() {
  const { token, isAnonymous, storeUser, logOut, username, name } =
    useUserStore();

  const verifyUser = async () => {
    const res = await fetch("http://localhost:3001/api/auth/verify", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    });

    const data = await res.json();

    if (res.status === 200) {
      console.log(data);
      storeUser(data.user, token);
      redirect("/home");
    } else {
      logOut();
      toast({
        title: "Error",
        description: "Invalid token",
      });
    }
  };

  useEffect(() => {
    if (!isAnonymous) {
      verifyUser();
    }
  }, [isAnonymous]);

  return (
    <>
      <div>App</div>
      <p>{username + " " + name}</p>

      <div className="flex flex-col">
        <Link to={"/login"}>
          {" "}
          <Button>Login</Button>
        </Link>
        <Link to={"/register"}>
          <Button>Chat Anonymously</Button>
        </Link>
      </div>
    </>
  );
}

export default App;
