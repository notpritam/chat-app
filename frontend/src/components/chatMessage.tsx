import { cn } from "@/lib/utils";
import { mesaageType } from "@/routes/ChatPage";

interface ChatMessageProps {
  type: string;
  message: mesaageType;
}

function ChatMessage({ type, message }: ChatMessageProps) {
  const formattedTime = (time: string) => {
    const timestamp = time;

    if (!timestamp) {
      return;
    }

    // Convert timestamp to Date object
    const date = new Date(timestamp);

    // Format the date to normal time format
    const formattedTime = new Intl.DateTimeFormat("en-US", {
      hour12: true,
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
    }).format(date);

    console.log("Formatted time:", formattedTime);

    // Get current time in the same format

    return formattedTime;
  };

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
            "px-4 py-2 text-sm rounded-3xl items-start shadow text-white flex flex-col  gap-2 w-auto max-w-[60%]",
            type === "sent"
              ? "rounded-br-none bg-blue-600 "
              : "rounded-bl-none bg-green-500 "
          )}
        >
          {type == "sent" ? null : (
            <span className=" text-gray-600 truncate">{message.user.name}</span>
          )}
          <p className="text-lg">{message.content}</p>
        </div>
        <span className="text-[12px] text-gray-600 opacity-35">
          {formattedTime(message.createdAt)}
        </span>
      </div>
    </div>
  );
}

export default ChatMessage;
