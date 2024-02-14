import { cn } from "@/lib/utils";
import { mesaageType } from "@/routes/Room";

interface ChatMessageProps {
  type: string;
  message: mesaageType;
}

function ChatMessage({ type, message }: ChatMessageProps) {
  return (
    <div
      className={cn(
        "flex gap-2 items-start",
        type == "sent" ? "justify-end" : ""
      )}
    >
      {type == "sent" ? null : (
        <img
          className="h-[32px] w-[32px] rounded-full"
          src={message.user.image}
          alt="message"
        />
      )}
      <div
        className={cn(
          "flex gap-2 flex-col w-full ",
          type === "sent" ? "items-end " : "items-start "
        )}
      >
        <div
          className={cn(
            "px-4 py-2 text-sm rounded-3xl items-start shadow bg-white flex flex-col  gap-2 w-auto max-w-[60%]",
            type === "sent" ? "rounded-br-none " : "rounded-bl-none "
          )}
        >
          {type == "sent" ? null : (
            <span className=" text-gray-600 truncate">{message.user.name}</span>
          )}
          <p className="text-lg">{message.content}</p>
        </div>
        <span className="text-[12px] text-white opacity-35">4:30PM</span>
      </div>
    </div>
  );
}

export default ChatMessage;
