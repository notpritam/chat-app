import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import axios from "axios";
import { useToast } from "@/components/ui/use-toast";
import useUserStore from "@/lib/store";
import { faker } from "@faker-js/faker";
import { Link, useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();
  const { storeUser, storeAnonymousUser } = useUserStore();
  const [loginDetails, setLoginDetails] = useState({
    username: "",
    password: "",
    image:
      "https://images.all-free-download.com/images/graphicthumb/belgium_514505.jpg",
    name: "",
  });
  const { toast } = useToast();

  const handleRegister = async () => {
    console.log(loginDetails);
    if (
      loginDetails.username === "" ||
      loginDetails.password === "" ||
      loginDetails.name === ""
    ) {
      toast({
        description: "Please fill in all the fields",
        title: "Error",
      });
      return;
    }
    try {
      const res = await fetch(
        "https://chat-app-backend-0v3j.onrender.com/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: loginDetails.username,
            password: loginDetails.password,
            name: loginDetails.name,
            image: faker.image.avatar(),
          }),
        }
      );

      const data = await res.json();
      if (res.status === 201) {
        console.log(data);
        storeUser(data.user, data.token);
        toast({
          description: "Registered successfully",
          title: "success",
        });
        navigate("/rooms/global");
      } else {
        toast({
          description: data.message,
          title: "Error",
        });
      }
    } catch (err) {
      console.log(err);
      toast({
        description: "An error occurred",
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
        <h1 className="text-3xl">Regsiter</h1>
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
          <Button className="w-full" type="submit" onClick={handleRegister}>
            Register
          </Button>
          <div className="flex gap-8 w-full">
            <Link to={"/login"} className="w-full">
              <Button className="w-full bg-transparent text-gray-300">
                Login
              </Button>
            </Link>
            <Button
              className="w-full bg-transparent text-gray-300"
              onClick={handleAnonymously}
            >
              Register Anonymously
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
