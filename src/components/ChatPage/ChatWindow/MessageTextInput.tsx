import { Send } from "lucide-react";

const MessageTextInput = ({handleSendMessage, handleTyping, newMessage, isLoading, isPending}) => {
  return (
    <div className="p-4 border-t border-neutral-50 bg-white">
      <form onSubmit={handleSendMessage} className="flex gap-2">
        <input
          type="text"
          disabled={isLoading || isPending}
          value={newMessage}
          onChange={handleTyping}
          placeholder="Type a message"
          className="flex-1 px-4 py-2 border border-neutral-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-10 bg-neutral-50/50 disabled:cursor-not-allowed"
        />
        <button
          type="submit"
          disabled={!newMessage.trim()}
          className="px-4 py-2 bg-primary-10 text-white rounded-lg hover:bg-primary-10/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  );
};

export default MessageTextInput;
