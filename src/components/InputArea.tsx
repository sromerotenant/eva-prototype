import { useState } from 'react';
import { MdSend } from 'react-icons/md';

interface InputAreaProps {
  onSubmit: (message: string) => void;
}

export default function InputArea({ onSubmit }: InputAreaProps) {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (inputValue.trim()) {
      onSubmit(inputValue.trim());
      setInputValue('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-surface-white border border-border-default-gray flex items-center p-eva-150 rounded-eva-xl shadow-eva-input w-full">
      <input
        type="text"
        placeholder="Ask me anything "
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyPress={handleKeyPress}
        className="flex-1 text-eva-body-sm text-text-default tracking-[0.1px] outline-none bg-transparent"
      />
      <button 
        type="submit"
        className="bg-brand-surface flex items-center justify-center rounded-eva-full w-8 h-8 hover:opacity-90 transition-opacity"
      >
        <MdSend className="w-5 h-5 text-text-on-light" />
      </button>
    </form>
  );
}

