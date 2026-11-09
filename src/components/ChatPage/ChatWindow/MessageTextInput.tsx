/* eslint-disable @typescript-eslint/no-explicit-any */
import { Send, Smile } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import EmojiPicker, { Theme } from "emoji-picker-react";

type TMessageTextInputProps = {
  handleSendMessage: (e: React.FormEvent) => void;
  handleTyping: (e: React.ChangeEvent<HTMLInputElement>) => void;
  newMessage: string;
  isLoading: boolean;
  isPending: boolean;
};

const MessageTextInput = ({
  handleSendMessage,
  handleTyping,
  newMessage,
  isLoading,
  isPending,
}: TMessageTextInputProps) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Handle clicking outside to close the emoji picker
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target as Node)
      ) {
        setShowEmojiPicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle emoji selection
  const handleEmojiClick = (emojiData: any) => {
    const syntheticEvent = {
      target: { value: newMessage + emojiData.emoji },
    } as React.ChangeEvent<HTMLInputElement>;

    handleTyping(syntheticEvent);
    inputRef.current?.focus();
  };

  return (
    <div className="p-4 border-t border-neutral-50 bg-white">
      <form onSubmit={handleSendMessage} className="flex gap-2 items-center">
        
        {/* Input Wrapper (Acts as the input border) */}
        <div className="relative flex-1 flex items-center bg-white border border-neutral-50 rounded-lg focus-within:ring-1 focus-within:ring-primary-10 focus-within:border-transparent transition-all duration-200">
          
          {/* Emoji Picker Container (Inside Input, Left Side) */}
          <div className="relative flex items-center pl-2" ref={emojiPickerRef}>
            <button
              type="button"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              disabled={isLoading || isPending}
              className={`p-2 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                showEmojiPicker
                  ? "text-primary-10 bg-primary-10/10"
                  : "text-neutral-40 hover:text-primary-10 hover:bg-primary-10/5"
              }`}
            >
              <Smile size={20} />
            </button>

            {/* Emoji Picker Popup */}
            {showEmojiPicker && (
              <div className="absolute bottom-full mb-3 left-0 z-50 shadow-xl rounded-xl overflow-hidden border border-neutral-20">
                <EmojiPicker
                  onEmojiClick={handleEmojiClick}
                  theme={Theme.LIGHT}
                  lazyLoadEmojis={true}
                  height={350}
                  width={300}
                  searchDisabled={false}
                  skinTonesDisabled={true}
                  previewConfig={{
                    showPreview: false,
                  }}
                />
              </div>
            )}
          </div>

          {/* Actual Text Input */}
          <input
            ref={inputRef}
            type="text"
            disabled={isLoading || isPending}
            value={newMessage}
            onChange={handleTyping}
            placeholder="Type a message"
            className="w-full py-3 pr-4 bg-transparent text-neutral-10 focus:outline-none font-Roboto disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>

        {/* Send Button */}
        <button
          type="submit"
          disabled={!newMessage.trim() || isLoading || isPending}
          className="px-4 py-3.5 bg-primary-10 text-white rounded-lg hover:bg-primary-10/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  );
};

export default MessageTextInput;