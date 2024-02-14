import React, { useEffect } from "react";
import {
  Link,
  Outlet,
  redirect,
  useLocation,
  useNavigate,
} from "react-router-dom";
import useUserStore from "@/lib/store";
import {
  CircleFadingPlus,
  Globe,
  LogOut,
  MessageSquareMore,
  Paperclip,
  Pin,
  Send,
  Smile,
} from "lucide-react";
import logoIcon from "../assets/img/chat.png";
import { toast } from "@/components/ui/use-toast";
import ChatList from "@/components/ChatList";

function Layout() {
  const { user, token, logOut, storeUser, isAnonymous } = useUserStore();

  let location = useLocation();
  console.log(location.pathname);

  const [showSidebar, setShowSidebar] = React.useState(false);

  const navigate = useNavigate();

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
    } else {
      logOut();
      toast({
        title: "Error",
        description: "Invalid token",
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
    <div className="min-h-screen relative h-screen flex overflow-hidden max-h-screen">
      {/* //SideBar */}

      <div className="p-4 pb-12 pt-0 border-r-[1px] flex flex-col gap-12">
        <div className="w-full flex items-center justify-center py-4">
          <img src={logoIcon} alt="logo" className="h-12 w-12" />
        </div>

        <div className="flex flex-col w-full items-center h-full gap-8">
          <div
            onClick={() => {
              setShowSidebar(!showSidebar);
              if (location.pathname != "/rooms/global") {
                navigate("/rooms/global");
              }
            }}
          >
            <Globe strokeWidth={0.75} />
          </div>
          <div>
            <CircleFadingPlus strokeWidth={0.75} />
          </div>
          <div onClick={() => setShowSidebar(true)}>
            <MessageSquareMore strokeWidth={0.75} />
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

      <div className="w-full h-full flex flex-col">
        <div className="h-[80px] p-4 shadow border-b-[1px]">
          <span className="text-3xl font-medium">Messages</span>
        </div>

        <div className="flex h-full overflow-hidden hs  ">
          {showSidebar ? <ChatList /> : null}

          {/* Chat Area */}
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default Layout;
