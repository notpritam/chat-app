import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import useUserStore from "@/lib/store";
import { Link, redirect } from "react-router-dom";

function Login() {
  const { storeUser } = useUserStore();
  const [loginDetails, setLoginDetails] = useState({
    username: "notpritam",
    password: "123",
    image:
      "https://images.all-free-download.com/images/graphicthumb/belgium_514505.jpg",
    name: "",
  });
  const { toast } = useToast();

  const handleLogin = async () => {
    console.log(loginDetails, "sending this detials");
    if (loginDetails.username === "" || loginDetails.password === "") {
      toast({
        description: "Please fill in all the fields",
        title: "error",
      });
      redirect("/home");
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
        redirect("/home");
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
        <Button type="submit" onClick={handleLogin}>
          Login
        </Button>{" "}
        <Link to={"/register"} type="submit">
          Crete an Account..
        </Link>
      </div>
    </div>
  );
}

export default Login;
