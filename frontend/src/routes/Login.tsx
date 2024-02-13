import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import axios from "axios";
import { useToast } from "@/components/ui/use-toast";
import useUserStore from "@/lib/store";

function Login() {
  const { storeUser } = useUserStore();
  const [loginDetails, setLoginDetails] = useState({
    username: "",
    password: "",
    image:
      "https://images.all-free-download.com/images/graphicthumb/belgium_514505.jpg",
    name: "",
  });
  const { toast } = useToast();

  const handleLogin = async () => {
    console.log(loginDetails);
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

      if (res.status === 401) {
        toast({
          description: res.body.message,
          title: "error",
        });
        return;
      } else if (res.status === 200) {
        const data = await res.json();
        storeUser(data.user, data.token);
      }

      //   console.log(res);
    } catch (err) {
      console.log(err);
      toast({
        description: err.response.data.message,
        title: "Error",
      });
    }
  };

  const handleRegister = async () => {
    console.log(loginDetails);
    if (
      loginDetails.username === "" ||
      loginDetails.password === "" ||
      loginDetails.name === "" ||
      loginDetails.image === ""
    ) {
      toast({
        description: "Please fill in all the fields",
        title: "error",
      });
      return;
    }
    try {
      await axios
        .post(
          "http://localhost:3001/api/auth/register",
          JSON.stringify({
            username: loginDetails.username,
            password: loginDetails.password,
            name: loginDetails.name,
            image: loginDetails.image,
          })
        )
        .then((res) => {
          console.log(res.data);
          storeUser(res.data.user, res.data.token);
        });
    } catch (err) {
      console.log(err);
      toast({
        description: "An error occurred",
        title: "error",
      });
    }
  };

  return (
    <div className="flex h-screen items-center justify-center gap-4 flex-col">
      <h1 className="text-3xl">Login</h1>
      <div className="flex flex-col gap-4 items-start">
        <Input
          type="text"
          name="name"
          placeholder="Name"
          value={loginDetails.name}
          onChange={(e) => {
            setLoginDetails({ ...loginDetails, name: e.target.value });
          }}
        ></Input>
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
        <Button type="submit" onClick={handleLogin}>
          Login
        </Button>{" "}
        <Button type="submit" onClick={handleRegister}>
          Register
        </Button>
      </div>
    </div>
  );
}

export default Login;
