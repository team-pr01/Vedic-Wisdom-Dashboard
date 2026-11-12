/* eslint-disable @typescript-eslint/no-explicit-any */
const TypingIndicator = ({ typingUsers, selectedChat } : any) => {
  return (
    <div className="px-4 h-6 flex items-center">
      {typingUsers.length > 0 && (
        <>
          {!selectedChat.isGroup ? (
            // 1-on-1: Show Animated Bouncing Dots
            <div className="flex items-center gap-1 bg-neutral-100 px-3 py-1.5 rounded-full w-fit">
              <span className="w-1.5 h-1.5 bg-neutral-45 rounded-full animate-bounce [animation-delay:-0.3s]" />
              <span className="w-1.5 h-1.5 bg-neutral-45 rounded-full animate-bounce [animation-delay:-0.15s]" />
              <span className="w-1.5 h-1.5 bg-neutral-45 rounded-full animate-bounce" />
            </div>
          ) : (
            // Group: Show Text with Names
            <p className="text-xs text-primary-10 font-medium animate-pulse">
              {typingUsers.map((u:any) => u.userName).join(", ")}{" "}
              {typingUsers.length === 1 ? "is" : "are"} typing...
            </p>
          )}
        </>
      )}
    </div>
  );
};

export default TypingIndicator;
