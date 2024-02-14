import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import React from "react";

function Home() {
  const [message, setMessage] = React.useState("");
  return (
    <div className="p-4 flex justify-between gap-4 flex-col h-screen">
      <div className="flex gap-4 flex-col">
        <h1>Chat Page</h1>

        <div className="flex justify-between">
          <Button>Chat Globally</Button>
          <Button>Join Room</Button>
          <Button>Create Room</Button>
        </div>
      </div>

      <div className="flex flex-col w-full bg-gray-300 h-full py-4 px-2 ">
        <div className="p-4 bg-blue-800 text-sm text-white rounded-full rounded-bl-none max-w-[60%]">
          <p>this is a mesaage exAMPLE</p>
        </div>
      </div>

      <div className="flex ">
        <Input
          type="text"
          placeholder="Type a message"
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
          }}
        />
        <Button>
          <Send />
        </Button>
      </div>
    </div>
  );
}

export default Home;
