import { useState, useRef } from 'react';
import { MdSend, MdAttachFile } from 'react-icons/md';

interface InputAreaProps {
  onSubmit: (message: string, files?: File[]) => void;
}

export default function InputArea({ onSubmit }: InputAreaProps) {
  const [inputValue, setInputValue] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (inputValue.trim() || selectedFiles.length > 0) {
      onSubmit(inputValue.trim(), selectedFiles);
      setInputValue('');
      setSelectedFiles([]);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSubmit();
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

  return (
    <form onSubmit={handleSubmit} className="bg-surface-white border border-border-default-gray rounded-eva-xl shadow-eva-input w-full flex flex-col p-eva-150 gap-4">
      {/* File Preview Chips - Inside container at the top */}
      {selectedFiles.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedFiles.map((file, index) => {
            const fileExtension = getFileExtension(file.name);
            const isPdf = fileExtension === 'pdf';
            const iconBgColor = isPdf ? '#f14242' : '#009cdb';

            return (
              <div
                key={index}
                className="bg-white border-[1.5px] border-[#adadad] rounded-[12px] px-2 py-2 flex items-center justify-between gap-2 overflow-hidden w-fit"
              >
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  {/* File Icon */}
                  <div 
                    className="flex items-center justify-center rounded-[22px] w-[38px] h-[38px] flex-shrink-0"
                    style={{ backgroundColor: iconBgColor }}
                  >
                    <MdAttachFile className="w-5 h-6 text-white" />
                  </div>
                  
                  {/* File Info */}
                  <div className="flex flex-col items-start justify-center min-w-0 flex-1">
                    <p className="text-[12px] font-medium text-[#4f4559] leading-[1.2] overflow-ellipsis overflow-hidden text-nowrap w-full">
                      {file.name}
                    </p>
                    <p className="text-[10px] font-normal text-[#7a6b8c] leading-[24px] tracking-[0.1px] text-nowrap">
                      {formatFileSize(file.size).toLowerCase()}
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

      {/* Input Row - Horizontal layout */}
      <div className="flex items-center gap-4">
        <input
          type="text"
          placeholder="Ask me anything "
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          className="flex-1 text-eva-body-sm text-text-default tracking-[0.1px] outline-none bg-transparent"
        />
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleFileSelect}
          className="hidden"
        />
        <button
          type="button"
          onClick={handleAttachClick}
          className="text-[#7a6b8c] hover:text-[#009cdb] transition-colors p-1"
        >
          <MdAttachFile className="w-5 h-5" />
        </button>
        <button 
          type="submit"
          className="bg-brand-surface flex items-center justify-center rounded-eva-full w-8 h-8 hover:opacity-90 transition-opacity"
        >
          <MdSend className="w-5 h-5 text-text-on-light" />
        </button>
      </div>
    </form>
  );
}

