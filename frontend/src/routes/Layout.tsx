import React, { useEffect } from "react";
import {
  Link,
  Outlet,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import useUserStore from "@/lib/store";
import { LogOut } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import logoIcon from "../assets/img/chat.png";
import { toast } from "@/components/ui/use-toast";
import ChatList from "@/components/ChatList";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { faker } from "@faker-js/faker";
import { io } from "socket.io-client";
import globalIcon from "../assets/img/global.png";
import addIcon from "../assets/img/plus.png";
import personalIcon from "../assets/img/personal.png";
import { cn } from "@/lib/utils";

export const socket = io("https://chat-app-backend-0v3j.onrender.com/");

function Layout() {
  const { user, token, logOut, storeUser, isAnonymous } = useUserStore();

  let location = useLocation();
  const { id } = useParams();

  const [showSidebar, setShowSidebar] = React.useState(false);

  const [createRoom, setCreateRoom] = React.useState(false);

  const [roomValue, setRoomValue] = React.useState("");

  const navigate = useNavigate();

  const verifyUser = async () => {
    const res = await fetch(
      "https://chat-app-backend-0v3j.onrender.com/api/auth/verify",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      }
    );

    const data = await res.json();

    if (res.status === 200) {
      console.log(data);
      storeUser(data.user, token as string);
    } else {
      logOut();
      toast({
        title: "Error",
        description: "Invalid token",
      });
    }
  };

  const createorJoinRooms = async () => {
    try {
      const res = await fetch(
        `https://chat-app-backend-0v3j.onrender.com/api/rooms/${
          createRoom ? "create" : "join"
        }`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
          body: JSON.stringify({
            room: {
              name: roomValue.trim(),
              image: faker.image.urlLoremFlickr({
                category: roomValue.replace(/\d/g, ""),
                width: 200,
                height: 200,
              }),
            },
          }),
        }
      );

      const data = await res.json();

      if (res.status === 200) {
        console.log(data);
        navigate(`/rooms/${data.name}`);
        toast({
          title: "Success",
          description: data.message,
        });
      } else {
        toast({
          title: "Error",
          description: data.message,
        });
      }
    } catch (error: any) {
      console.log(error);
      toast({
        title: "Error",
        description: error.message,
      });
    }
  };

  useEffect(() => {
    if (!isAnonymous && user != null) {
      verifyUser();
    } else if (user == null) {
      navigate("/login");
    }
  }, []);

  useEffect(() => {
    if (token == null && user == null) {
      navigate("/login");
    }
  }, [token]);

  return (
    <div className="min-h-screen relative h-screen flex overflow-hidden max-h-screen bg-black bg-opacity-10 backdrop-filter backdrop-blur-3xl  border-gray-200  rounded-md shadow-md">
      {/* //SideBar */}
      {/* <div className="absolute z-[-1] blur-3xl bg-cover bg-center bg-[url(https://4kwallpapers.com/images/walls/thumbs_3t/6420.jpg)] top-0 right-0 left-0 bottom-0"></div> */}

      <div
        className="absolute blur-3xl    bg-cover bg-center z-[0] h-full w-full top-0 left-0 right-0 bottom-0"
        style={{
          backgroundImage:
            "url(https://i.pinimg.com/originals/c8/79/59/c8795971c58cf637bb181dad8a4b3bfb.jpg)",
        }}
      >
        <div className="h-screen w-screen bg-black opacity-20"></div>
      </div>
      <Dialog>
        <div className="md:p-4 md:pb-12 p-4 pt-0 border-r-[1px]  flex flex-col gap-12 bg-white bg-opacity-20 backdrop-filter backdrop-blur-3xl  border-gray-200 ">
          <div className="w-full flex items-center justify-center py-4">
            <img
              src={logoIcon}
              alt="logo"
              className="h-10 w-10 md:h-12 md:w-12"
            />
          </div>

          <div className="flex flex-col w-full items-center h-full gap-8">
            <Link
              to={
                location.pathname.includes("login") ? "/login" : "/rooms/global"
              }
            >
              <div
                className="cursor-pointer"
                onClick={() => {
                  if (
                    location.pathname.includes("login") ||
                    location.pathname.includes("register")
                  ) {
                    // navigate("/rooms/global");
                  } else {
                    setShowSidebar(!showSidebar);
                  }
                }}
              >
                <img className="h-8 w-8" src={globalIcon} />
              </div>
            </Link>
            <DialogTrigger>
              <div>
                <img className="h-8 w-8" src={addIcon} />
              </div>
            </DialogTrigger>

            <div
              className="cursor-pointer"
              onClick={() => setShowSidebar(!showSidebar)}
            >
              <img className="h-8 w-8" src={personalIcon} />
            </div>
          </div>

          <div className="flex flex-col w-full items-center gap-8">
            {user?.name && (
              <div>
                <img
                  className="w-10 h-10 rounded-full object-cover object-center"
                  src={user?.image}
                ></img>
              </div>
            )}
            <div onClick={logOut}>
              <LogOut strokeWidth={0.75} />
            </div>
          </div>
        </div>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create or Join Room</DialogTitle>
            <DialogDescription>
              {isAnonymous &&
                "You need to create an account to create or join a room, currently you are using an anonymous account."}
            </DialogDescription>
          </DialogHeader>
          {isAnonymous ? (
            <Link to="/login">
              <Button>Create an Account</Button>
            </Link>
          ) : (
            <>
              <Input
                placeholder="Room Name"
                onChange={(e) => setRoomValue(e.target.value)}
                value={roomValue}
              />
              <div className="flex gap-2 items-center">
                <Switch
                  checked={createRoom}
                  onCheckedChange={(e) => {
                    setCreateRoom(e);
                  }}
                />{" "}
                <Label>Create Room</Label>
              </div>

              <Button onClick={createorJoinRooms}>
                {createRoom ? "Create Room" : "Join Room"}
              </Button>
            </>
          )}
        </DialogContent>
      </Dialog>

      <div className="w-full h-full flex flex-col ">
        <div className="md:h-[80px] md:flex  p-4  shadow border-b-[1px] bg-white bg-opacity-20 backdrop-filter backdrop-blur-3xl border border-gray-200">
          <span className="text-2xl md:text-3xl font-medium">
            {location.pathname.includes("login") ||
            location.pathname.includes("register")
              ? "Login"
              : ` Chats : ${id?.toLocaleUpperCase()}`}
          </span>
        </div>

        <div className="flex h-full overflow-hidden hs  ">
          {showSidebar ? <ChatList setSidebar={setShowSidebar} /> : null}

          {/* Chat Area */}
          <div
            className={cn(showSidebar ? "hidden lg:flex" : "flex", "w-full")}
          >
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Layout;
