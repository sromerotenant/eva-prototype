import { useState, useEffect, useRef } from 'react';
import { MdSend, MdCloseFullscreen, MdFullscreen } from 'react-icons/md';

type ChatMode = 'closed' | 'side' | 'floating';

type Message = {
  text: string;
  isUser: boolean;
};

interface SideChatProps {
  messages: Message[];
  onAddMessage: (message: string) => void;
  onEndChat: () => void;
  chatMode: ChatMode;
  onToggleChatMode?: () => void;
}

export default function SideChat({ messages, onAddMessage, onEndChat, chatMode, onToggleChatMode }: SideChatProps) {
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Clear input when chat mode changes to closed
  useEffect(() => {
    if (chatMode === 'closed') {
      setInputValue('');
    }
  }, [chatMode]);

  useEffect(() => {
    // Auto-focus input when chat opens
    if (inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 300); // Small delay to ensure transition completes
    }
  }, [chatMode]);

  // Scroll to bottom when new messages are added
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (inputValue.trim()) {
      onAddMessage(inputValue.trim());
      setInputValue('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className="bg-white flex flex-col h-full w-full shadow-eva-chat-panel overflow-hidden">
      {/* Header - Same padding as input area */}
      <div className="flex items-center justify-between px-5 py-eva-100">
        <button 
          onClick={onEndChat}
          className="bg-[#f0f0f0] border border-[#e3e3e3] border-solid flex items-center justify-center px-eva-100 py-eva-50 rounded-eva-s shrink-0 cursor-pointer hover:opacity-80 transition-opacity"
        >
          <p className="text-eva-body-sm-bold text-[#4f4559] text-nowrap relative shrink-0 leading-[1.2]">End Chat</p>
        </button>
        {onToggleChatMode && (
          <button 
            onClick={onToggleChatMode}
            className="cursor-pointer flex items-center p-0 relative shrink-0 hover:opacity-80 transition-opacity"
            aria-label={chatMode === 'side' ? 'Minimize chat' : 'Maximize chat'}
          >
            <div className="relative shrink-0 w-6 h-6">
              {chatMode === 'side' ? (
                <MdCloseFullscreen className="w-6 h-6 text-[#4f4559]" />
              ) : (
                <MdFullscreen className="w-6 h-6 text-[#4f4559]" />
              )}
            </div>
          </button>
        )}
      </div>

      {/* Chat Messages Area - Scrollable */}
      <div className="flex-1 overflow-y-auto backdrop-blur-[13.25px] px-5 py-eva-10">
        <div className="flex flex-col gap-5 justify-start items-start min-h-full">
          {messages.length === 0 ? (
            // Default welcome message when no messages
            <div className="flex justify-start w-full">
              <p className="text-eva-body text-[#4e445a] leading-[1.4] max-w-[80%]">
                I can certainly help you with that. To get started, could you briefly describe the change you would like to make?
              </p>
            </div>
          ) : (
            messages.map((message, index) => (
              message.isUser ? (
                // User message - with bubble
                <div key={index} className="flex justify-end w-full">
                  <div className="bg-[#f0f0f0] border-[1.5px] border-[#e3e3e3] rounded-tl-eva-xl rounded-tr-eva-xl rounded-bl-eva-xl rounded-br-[6px] px-eva-150 py-eva-100 max-w-[80%]">
                    <p className="text-eva-body text-[#4f4559] leading-[1.4] whitespace-pre-line">
                      {message.text}
                    </p>
                  </div>
                </div>
              ) : (
                // Eva message - plain text, no bubble
                <div key={index} className="flex justify-start w-full">
                  <p className="text-eva-body text-[#4e445a] leading-[1.4] max-w-[80%] whitespace-pre-line">
                    {message.text}
                  </p>
                </div>
              )
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area - Sticky Bottom - Same padding as header */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-eva-100 px-5 pb-6 pt-3">
        {/* Input field - Pill shape with send button inside */}
        <div className="bg-[#f7f7f7] border border-[#e3e3e3] border-solid flex items-center gap-6 p-eva-150 rounded-3xl shadow-eva-chat-input w-full">
          <input
            ref={inputRef}
            type="text"
            placeholder="Ask me anything "
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1 text-eva-body-sm text-[#4e445a] tracking-[0.1px] outline-none bg-transparent"
          />
          <button 
            type="submit"
            className="bg-[#4e445a] flex items-center justify-center rounded-full w-8 h-8 hover:opacity-90 transition-opacity flex-shrink-0"
          >
            <MdSend className="w-5 h-5 text-white" />
          </button>
        </div>
        
        {/* Footer Text */}
        <p className="text-eva-label text-[#7a6b8c] text-center leading-[1.2]">
          <span className="font-medium">By messaging Eva, you agree to our </span>
          <span className="font-semibold text-[#4f4559]">Terms and Privacy Policy</span>
        </p>
      </form>
    </div>
  );
}

