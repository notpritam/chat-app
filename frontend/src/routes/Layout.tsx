import React, { useEffect } from "react";
import { Outlet, redirect, useNavigate } from "react-router-dom";
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

function Layout() {
  const { user, token, logOut, storeUser } = useUserStore();

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
    verifyUser();
  }, []);

  useEffect(() => {
    if (token == null) {
      navigate("/login");
    }
  }, [token]);

  return (
    <div className="min-h-screen relative h-screen flex overflow-hidden max-h-screen">
      {/* //SideBar */}

      <div className="p-4 pt-0 border-r-[1px] flex flex-col gap-12">
        <div className="w-full flex items-center justify-center py-4">
          <img src={logoIcon} alt="logo" className="h-12 w-12" />
        </div>

        <div className="flex flex-col w-full items-center gap-8">
          <a href={"/rooms/global"}>
            <Globe strokeWidth={0.75} />
          </a>
          <div>
            <CircleFadingPlus strokeWidth={0.75} />
          </div>
          <div>
            <MessageSquareMore strokeWidth={0.75} />
          </div>
        </div>

        <div onClick={logOut}>
          <LogOut strokeWidth={0.75} />
        </div>
      </div>

      <Outlet />
    </div>
  );
}

export default Layout;
