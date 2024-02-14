import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import useUserStore from "@/lib/store";
import { Link, redirect, useNavigate } from "react-router-dom";
import { faker } from "@faker-js/faker";

function Login() {
  const { storeUser, storeAnonymousUser } = useUserStore();
  const [loginDetails, setLoginDetails] = useState({
    username: "notpritam",
    password: "123",
    image:
      "https://images.all-free-download.com/images/graphicthumb/belgium_514505.jpg",
    name: "",
  });
  const { toast } = useToast();

  const navigate = useNavigate();

  const handleLogin = async () => {
    console.log(loginDetails, "sending this detials");
    if (loginDetails.username === "" || loginDetails.password === "") {
      toast({
        description: "Please fill in all the fields",
        title: "error",
      });
      return;
    }
    try {
      const res = await fetch("http://localhost:3001/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: loginDetails.username,
          password: loginDetails.password,
        }),
      });

      const data = await res.json();

      if (res.status === 401) {
        toast({
          description: data.message as string,
          title: "error",
        });
        return;
      } else if (res.status === 200) {
        console.log(data, "coming here");
        storeUser(data.user, data.token);
        navigate("/rooms/global");
      }

      //   console.log(res);
    } catch (err: any) {
      console.log(err);
      toast({
        description: err.response.data.message,
        title: "Error",
      });
    }
  };

  const handleAnonymously = () => {
    const user = {
      _id: faker.string.uuid(),
      username: faker.internet.userName(),
      image: faker.image.avatar(),
      name: `${faker.person.firstName()} ${faker.person.lastName()}`,
    };
    console.log(user);
    storeAnonymousUser(user);

    navigate("/rooms/global");
  };

  return (
    <div className="flex h-screen items-center justify-center gap-4 flex-col">
      <h1 className="text-3xl">Login</h1>
      <div className="flex flex-col gap-4 items-start">
        <Input
          type="text"
          name="username"
          placeholder="Username"
          value={loginDetails.username}
          onChange={(e) => {
            setLoginDetails({ ...loginDetails, username: e.target.value });
          }}
        />
        <Input
          type="password"
          name="password"
          placeholder="Password"
          onChange={(e) => {
            setLoginDetails({ ...loginDetails, password: e.target.value });
          }}
        />
        <Button onClick={handleLogin}>Login</Button>
        <Link to={"/register"} type="submit">
          Crete an Account..
        </Link>
        <Button onClick={handleAnonymously}>Login Anonymously</Button>
      </div>
    </div>
  );
}

export default Login;
