import { useEffect, useState } from "react";
import "./App.css";
import useUserStore from "./lib/store";
import { toast } from "./components/ui/use-toast";
import { Button } from "./components/ui/button";
import { Link, redirect } from "react-router-dom";
import { faker } from "@faker-js/faker";

function App() {
  const { token, isAnonymous, storeUser, logOut, user, storeAnonymousUser } =
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
      storeUser(data.user, token as string);
      redirect("/home");
    } else {
      logOut();
      toast({
        title: "Error",
        description: "Invalid token",
      });
    }
  };

  // User Logged in Anonymusly

  const handleAnonymously = () => {
    const user = {
      _id: faker.string.uuid(),
      username: faker.internet.userName(),
      image: faker.image.avatar(),
      name: `${faker.person.firstName()} ${faker.person.lastName()}`,
    };
    console.log(user);
    storeAnonymousUser(user);

    redirect("/room/global");
  };

  useEffect(() => {
    if (!isAnonymous) {
      verifyUser();
    }
  }, [isAnonymous]);

  return (
    <>
      <div>App</div>
      <p>{user?.username + " " + user?.name}</p>

      <div className="flex flex-col">
        <Link to={"/login"}>
          {" "}
          <Button>Login</Button>
        </Link>
        <Link to={"/register"}>
          <Button>Create an Account</Button>
        </Link>
        <Button onClick={handleAnonymously}>Chat Anonymously</Button>
      </div>
    </>
  );
}

export default App;
