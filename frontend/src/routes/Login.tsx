import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import useUserStore from "@/lib/store";
import { Link, useNavigate } from "react-router-dom";
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

  const handleLogin = async (event: any) => {
    event.preventDefault();
    console.log(loginDetails, "sending this detials");
    if (loginDetails.username === "" || loginDetails.password === "") {
      toast({
        description: "Please fill in all the fields",
        title: "Error",
      });
      return;
    }
    try {
      const res = await fetch(
        
        "https://chat-app-backend-0v3j.onrender.com/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: loginDetails.username,
            password: loginDetails.password,
          }),
        }
      );

      const data = await res.json();

      if (res.status === 401) {
        toast({
          description: data.message as string,
          title: "Error",
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
    <div className="flex h-screen z-[10] min-h-screen justify-center items-center text-start w-full gap-4 flex-col">
      <div className="flex gap-4 flex-col">
        <h1 className="text-[3rem] font-semibold w-full text-gray-200">
          Login
        </h1>
        <div className="flex flex-col min-w-[300px] gap-4 items-start">
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
          <Button type="submit" className="w-full" onClick={handleLogin}>
            Login
          </Button>
          <div className="flex gap-8 w-full">
            <Link to={"/register"} className="w-full">
              <Button className="w-full bg-transparent text-gray-300">
                Register
              </Button>
            </Link>
            <Button
              className="w-full bg-transparent text-gray-300"
              onClick={handleAnonymously}
            >
              Login Anonymously
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
