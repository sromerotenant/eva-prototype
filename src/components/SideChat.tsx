import { useState, useEffect, useRef } from 'react';
import { MdSend, MdCloseFullscreen, MdFullscreen, MdAttachFile } from 'react-icons/md';
import ChangeRequestWidget from './ChangeRequestWidget';

type ChatMode = 'closed' | 'side' | 'floating';

type Message = {
  text: string;
  isUser: boolean;
  type?: 'text' | 'widget';
  widgetType?: 'changeRequest';
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
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Clear input when chat mode changes to closed
  useEffect(() => {
    if (chatMode === 'closed') {
      setInputValue('');
      setSelectedFiles([]);
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
    if (inputValue.trim() || selectedFiles.length > 0) {
      onAddMessage(inputValue.trim());
      setInputValue('');
      setSelectedFiles([]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setSelectedFiles((prev) => [...prev, ...files]);
    }
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAttachClick = () => {
    fileInputRef.current?.click();
  };

  // Auto-resize textarea
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = '24px';
      const scrollHeight = inputRef.current.scrollHeight;
      inputRef.current.style.height = `${Math.min(scrollHeight, 120)}px`;
    }
  }, [inputValue]);


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
            messages.map((message, index) => {
              // Render widget if message type is widget
              if (message.type === 'widget' && message.widgetType === 'changeRequest') {
                return (
                  <div key={index} className="flex justify-start w-full">
                    <ChangeRequestWidget
                      onComplete={(data) => {
                        // Handle widget completion - could add a success message
                        console.log('Change request submitted:', data);
                      }}
                    />
                  </div>
                );
              }

              // Render text messages
              return message.isUser ? (
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
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area - Sticky Bottom - New Layout */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 px-5 pb-6 pt-3">
        {/* Input Container - Light gray background */}
        <div className="bg-[#f0f0f0] border border-[#e3e3e3] rounded-eva-xl p-4 flex flex-col gap-4 shadow-[14px_16px_25.4px_0px_rgba(0,0,0,0.05)]">
          {/* File Preview Chips - Inside container at the top */}
          {selectedFiles.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {selectedFiles.map((file, index) => {
                // Format file size
                const formatFileSize = (bytes: number): string => {
                  if (bytes === 0) return '0 Bytes';
                  const k = 1024;
                  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
                  const i = Math.floor(Math.log(bytes) / Math.log(k));
                  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + sizes[i];
                };

                // Get file extension for icon color
                const getFileExtension = (filename: string): string => {
                  return filename.split('.').pop()?.toLowerCase() || '';
                };

                const fileExtension = getFileExtension(file.name);
                const isPdf = fileExtension === 'pdf';
                const iconBgColor = isPdf ? '#f14242' : '#009cdb';

                return (
                  <div
                    key={index}
                    className="bg-white border-[1.5px] border-[#adadad] rounded-eva-m px-2 py-2 flex items-center justify-between gap-2 w-fit"
                  >
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      {/* File Icon */}
                      <div 
                        className="flex items-center justify-center rounded-[22px] w-[38px] h-[38px] flex-shrink-0"
                        style={{ backgroundColor: iconBgColor }}
                      >
                        <MdAttachFile className="w-5 h-5 text-white" />
                      </div>
                      
                      {/* File Info */}
                      <div className="flex flex-col gap-0.5 min-w-0 flex-1">
                        <p className="text-[12px] font-medium text-[#4f4559] leading-[1.2] truncate">
                          {file.name}
                        </p>
                        <p className="text-[10px] text-[#7a6b8c] leading-[24px] tracking-[0.1px]">
                          {formatFileSize(file.size)}
                        </p>
                      </div>
                    </div>

                    {/* Close Button */}
                    <button
                      type="button"
                      onClick={() => handleRemoveFile(index)}
                      className="bg-white flex items-center justify-center rounded-full w-6 h-6 flex-shrink-0 hover:bg-[#f7f7f7] transition-colors"
                    >
                      <span className="text-[#282531] text-base leading-none">×</span>
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {/* Text Input Area - Textarea that grows */}
          <textarea
            ref={inputRef}
            placeholder="Ask me anything "
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
              }
            }}
            rows={1}
            className="flex-1 text-eva-body-sm text-[#4e445a] tracking-[0.1px] outline-none bg-transparent resize-none min-h-[24px] max-h-[120px] overflow-y-auto"
            style={{ height: 'auto' }}
          />

          {/* Bottom Action Bar */}
          <div className="flex items-center justify-between">
            {/* Left: Add Files Button */}
            <button
              type="button"
              onClick={handleAttachClick}
              className="bg-white border border-[#e3e3e3] rounded-[33px] px-3 py-1 flex items-center gap-2 hover:bg-[#f7f7f7] transition-colors"
            >
              <MdAttachFile className="w-6 h-6 text-[#4f4559]" />
              <span className="text-eva-body-sm-bold text-[#4f4559] tracking-[0.1px]">Add Files</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={handleFileSelect}
              className="hidden"
            />

            {/* Right: Send Button */}
            <button 
              type="submit"
              className="bg-[#4e445a] flex items-center justify-center rounded-full w-8 h-8 hover:opacity-90 transition-opacity flex-shrink-0"
            >
              <MdSend className="w-5 h-5 text-white" />
            </button>
          </div>
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

