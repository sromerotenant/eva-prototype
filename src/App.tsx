import { useState, useEffect, useRef } from 'react';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import ActionChips from './components/ActionChips';
import InputArea from './components/InputArea';
import CardsGrid from './components/CardsGrid';
import SideChat from './components/SideChat';

type ChatMode = 'closed' | 'side' | 'floating';

type Message = {
  text: string;
  isUser: boolean;
  type?: 'text' | 'widget';
  widgetType?: 'changeRequest';
};

// Eva response mapping - matches action keywords to responses
const getEvaResponse = (actionText: string): string => {
  const lowerText = actionText.toLowerCase();
  
  if (lowerText.includes('add user') || lowerText.includes('user')) {
    return "I can help you add a new user to the system. To get started, I'll need some information:\n\n• Full name\n• Email address\n• Role/permissions level\n• Associated property or organization\n\nWould you like me to guide you through the user creation process step by step?";
  }
  
  if (lowerText.includes('check application') || lowerText.includes('application status')) {
    return "I can help you check the status of applications. I can look up applications by:\n\n• Application ID or reference number\n• Applicant name\n• Property address\n• Date range\n\nWhat would you like to search for?";
  }
  
  if (lowerText.includes('re-open') || lowerText.includes('reopen')) {
    return "I can assist you with re-opening applications. To proceed, I'll need:\n\n• The application ID or reference number\n• The reason for re-opening\n• Any additional notes or context\n\nDo you have the application details ready?";
  }
  
  if (lowerText.includes('change request') || lowerText.includes('submit change')) {
    return "I can help you submit a change request. Let me gather the necessary information:\n\n• Type of change (property details, tenant info, lease terms, etc.)\n• Property or application reference\n• Description of the requested change\n• Reason for the change\n\nWhat type of change would you like to request?";
  }
  
  // Default response for unmatched actions
  return "I can certainly help you with that. To get started, could you briefly describe what you'd like to do?";
};

function App() {
  const [chatMode, setChatMode] = useState<ChatMode>('closed');
  const [messages, setMessages] = useState<Message[]>([]);
  const [sidebarWidth, setSidebarWidth] = useState(643);
  const [isResizing, setIsResizing] = useState(false);
  const resizeStartX = useRef<number>(0);
  const resizeStartWidth = useRef<number>(643);

  const handleInputSubmit = (message: string, _files?: File[]) => {
    if (message.trim()) {
      // Add user message
      const userMessage: Message = { text: message.trim(), isUser: true, type: 'text' };
      setMessages((prev) => [...prev, userMessage]);
      
      // Open chat if closed
      if (chatMode === 'closed') {
        setChatMode('side');
      }
      
      // Check if this is a change request trigger
      const lowerMessage = message.trim().toLowerCase();
      if (lowerMessage.includes('change request') || lowerMessage.includes('submit change')) {
        // Add Eva's text message first
        setTimeout(() => {
          setMessages((prev) => [...prev, { 
            text: "I can certainly help you with that. To get started, Select request type",
            isUser: false, 
            type: 'text'
          }]);
        }, 500);
        
        // Then add widget
        setTimeout(() => {
          setMessages((prev) => [...prev, { 
            text: '', 
            isUser: false, 
            type: 'widget',
            widgetType: 'changeRequest'
          }]);
        }, 800);
      } else {
        // Get Eva's response
        const evaResponse = getEvaResponse(message.trim());
        setTimeout(() => {
          setMessages((prev) => [...prev, { text: evaResponse, isUser: false, type: 'text' }]);
        }, 500); // Small delay to simulate response time
      }
    }
  };

  const handleQuickAction = (actionText: string) => {
    // Open chat in 'side' mode if it was closed
    if (chatMode === 'closed') {
      setChatMode('side');
    }
    
    // Check if this is a "Submit Change Request" action
    if (actionText.toLowerCase().includes('change request') || actionText.toLowerCase().includes('submit change')) {
      // Add user message
      const userMessage: Message = { text: actionText, isUser: true, type: 'text' };
      setMessages((prev) => [...prev, userMessage]);
      
      // Add Eva's text message first
      setTimeout(() => {
        setMessages((prev) => [...prev, { 
          text: "I can certainly help you with that. To get started, Select request type",
          isUser: false, 
          type: 'text'
        }]);
      }, 300);
      
      // Then add widget
      setTimeout(() => {
        setMessages((prev) => [...prev, { 
          text: '', 
          isUser: false, 
          type: 'widget',
          widgetType: 'changeRequest'
        }]);
      }, 600);
    } else {
      // For other actions, use normal text flow
      const userMessage: Message = { text: actionText, isUser: true, type: 'text' };
      setMessages((prev) => [...prev, userMessage]);
      
      // Get and add Eva's response immediately after
      const evaResponse = getEvaResponse(actionText);
      setTimeout(() => {
        setMessages((prev) => [...prev, { text: evaResponse, isUser: false, type: 'text' }]);
      }, 300); // Small delay for conversational feel
    }
  };

  const handleEndChat = () => {
    // Action 1: Close the chat UI
    setChatMode('closed');
    
    // Action 2: Reset messages to empty array (full session reset)
    setMessages([]);
    
    // Action 3: Reset sidebar width to default
    setSidebarWidth(643);
    
    // Note: Input fields will be cleared via key prop remounting
  };

  const handleAddMessage = (message: string, _files?: File[]) => {
    if (message.trim()) {
      const userMessage: Message = { text: message.trim(), isUser: true, type: 'text' };
      setMessages((prev) => [...prev, userMessage]);
      
      // Check if this is a change request trigger
      const lowerMessage = message.trim().toLowerCase();
      if (lowerMessage.includes('change request') || lowerMessage.includes('submit change')) {
        // Add Eva's text message first
        setTimeout(() => {
          setMessages((prev) => [...prev, { 
            text: "I can certainly help you with that. To get started, Select request type",
            isUser: false, 
            type: 'text'
          }]);
        }, 500);
        
        // Then add widget
        setTimeout(() => {
          setMessages((prev) => [...prev, { 
            text: '', 
            isUser: false, 
            type: 'widget',
            widgetType: 'changeRequest'
          }]);
        }, 800);
      } else {
        // Get Eva's response
        const evaResponse = getEvaResponse(message.trim());
        setTimeout(() => {
          setMessages((prev) => [...prev, { text: evaResponse, isUser: false, type: 'text' }]);
        }, 500);
      }
    }
  };

  const handleToggleChatMode = () => {
    if (chatMode === 'side') {
      setChatMode('floating');
    } else if (chatMode === 'floating') {
      setChatMode('side');
    }
  };

  const handleAddEvaMessage = (text: string) => {
    setMessages((prev) => [...prev, { text, isUser: false, type: 'text' }]);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
    resizeStartX.current = e.clientX;
    resizeStartWidth.current = sidebarWidth;
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;

      const windowWidth = window.innerWidth;
      const mouseX = e.clientX;
      const newWidth = windowWidth - mouseX;

      // Apply constraints
      const minWidth = 300;
      const maxWidth = Math.min(800, windowWidth * 0.5);
      const constrainedWidth = Math.max(minWidth, Math.min(maxWidth, newWidth));

      setSidebarWidth(constrainedWidth);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      // Prevent text selection during resize
      document.body.style.userSelect = 'none';
      document.body.style.cursor = 'col-resize';
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    } else {
      // Restore normal cursor and text selection
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
    };
  }, [isResizing]);

  const isChatOpen = chatMode !== 'closed';
  const isSideMode = chatMode === 'side';

  return (
    <div className="flex h-screen w-full overflow-hidden">
      {/* Child A - Left Side: App Content (Header + MainContent) */}
      <div className="flex-1 flex flex-col bg-surface-light transition-all duration-300 overflow-hidden">
        {/* Header - Inside Child A, only spans left section width */}
        <Header chatMode={chatMode} />

        {/* MainContent - Scrollable area with greeting and cards */}
        <div className="flex-1 overflow-y-auto flex flex-col justify-center items-center">
          <div className={`w-full transition-all duration-300 ${isSideMode ? 'max-w-full px-4 sm:px-6' : 'max-w-[1022px] px-4 sm:px-6 lg:px-0 mx-auto'}`}>
            <div className="flex flex-col gap-4 items-center justify-center px-0 py-12 w-full">
              {/* Hero Section */}
              <HeroSection />

              {/* Chat Input Container (includes Action Chips and Input Area) - Hidden when chat is open */}
              {!isChatOpen && (
                <div className="flex flex-col gap-3 items-start rounded-eva-xl w-full max-w-[464px] transition-all duration-300">
                  <ActionChips onQuickAction={handleQuickAction} />
                  <InputArea key={chatMode} onSubmit={handleInputSubmit} />
                </div>
              )}
            </div>

            {/* Cards Grid */}
            <CardsGrid chatMode={chatMode} />
          </div>
        </div>
      </div>

      {/* Child B - Right Side: Side Chat Panel (only in 'side' mode) */}
      {isSideMode && (
        <div 
          className={`bg-white border-l border-border-default-gray h-full overflow-hidden flex relative ${!isResizing ? 'transition-all duration-300' : ''}`}
          style={{ width: `${sidebarWidth}px` }}
        >
          {/* Resizer Handle - only show in side mode */}
          <div
            onMouseDown={handleMouseDown}
            className={`absolute left-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-blue-500 z-10 ${isResizing ? 'bg-blue-500' : ''}`}
          />
          <SideChat 
            messages={messages}
            onAddMessage={handleAddMessage}
            onAddEvaMessage={handleAddEvaMessage}
            onEndChat={handleEndChat}
            chatMode={chatMode}
            onToggleChatMode={handleToggleChatMode}
          />
        </div>
      )}

      {/* Floating Chat Panel (only in 'floating' mode) */}
      {chatMode === 'floating' && (
        <div className="fixed bottom-6 right-6 w-[400px] h-[600px] max-h-[calc(100vh-48px)] z-50 bg-white border border-[#e2e2e2] rounded-[24px] shadow-[0px_4px_19.5px_0px_rgba(91,66,120,0.2)] overflow-hidden flex flex-col backdrop-blur-[13.25px]">
          <SideChat 
            messages={messages}
            onAddMessage={handleAddMessage}
            onAddEvaMessage={handleAddEvaMessage}
            onEndChat={handleEndChat}
            chatMode={chatMode}
            onToggleChatMode={handleToggleChatMode}
          />
        </div>
      )}
    </div>
  );
}

export default App;


