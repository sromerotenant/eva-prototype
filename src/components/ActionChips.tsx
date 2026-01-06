import { MdChecklist, MdFolderOpen, MdAdd, MdEditNote } from 'react-icons/md';

interface ActionChipProps {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
}

function ActionChip({ icon, label, onClick }: ActionChipProps) {
  return (
    <button 
      onClick={onClick}
      className="bg-surface-info-secondary border-0 flex gap-eva-50 items-center justify-center pl-eva-50 pr-eva-100 py-eva-50 rounded-eva-full shadow-eva-chip hover:bg-[#A8D6FF] transition-colors duration-200 cursor-pointer"
    >
      <div className="w-4 h-4 text-text-default flex items-center justify-center">
        {icon}
      </div>
      <span className="text-eva-body-sm-bold text-text-default text-center">
        {label}
      </span>
    </button>
  );
}

interface ActionChipsProps {
  onQuickAction?: (actionText: string) => void;
}

export default function ActionChips({ onQuickAction }: ActionChipsProps) {
  const chips = [
    { icon: <MdChecklist className="w-4 h-4 text-text-default" />, label: 'Check Application Status' },
    { icon: <MdFolderOpen className="w-4 h-4 text-text-default" />, label: 'Re-open Applications' },
    { icon: <MdAdd className="w-4 h-4 text-text-default" />, label: 'Add User' },
    { icon: <MdEditNote className="w-4 h-4 text-text-default" />, label: 'Submit Change Request' },
  ];

  const handleChipClick = (label: string) => {
    if (onQuickAction) {
      onQuickAction(label);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2 items-center justify-center px-eva-150 py-3 w-full">
      {chips.map((chip, index) => (
        <ActionChip 
          key={index} 
          icon={chip.icon} 
          label={chip.label}
          onClick={() => handleChipClick(chip.label)}
        />
      ))}
    </div>
  );
}

