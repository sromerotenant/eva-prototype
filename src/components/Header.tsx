import { MdAccountCircle, MdLogout, MdMoreVert } from 'react-icons/md';

type ChatMode = 'closed' | 'side' | 'floating';

interface HeaderProps {
  chatMode: ChatMode;
}

export default function Header({ chatMode }: HeaderProps) {
  const isSideMode = chatMode === 'side';
  
  return (
    <header className={`bg-brand-primary flex items-center justify-between py-4 w-full shrink-0 transition-all duration-300 ${
      isSideMode ? 'px-4 sm:px-6' : 'px-4 sm:px-6 md:px-12 lg:px-[100px]'
    }`}>
      {/* Logo */}
      <div className="h-8 flex items-center">
        <img 
          src="/logo-horizontal.svg" 
          alt="Tenant Evaluation" 
          className="h-full w-auto"
        />
      </div>

      {/* Mobile Menu Button */}
      <button className="md:hidden flex items-center justify-center w-10 h-10 rounded-full hover:opacity-80 transition-opacity">
        <MdMoreVert className="w-6 h-6 text-text-on-light" />
      </button>

      {/* Desktop Menu - Hidden on mobile */}
      <div className="hidden md:flex gap-4 items-center">
        <button className="flex gap-2 items-center px-eva-100 py-eva-10 rounded-eva-s hover:opacity-80 transition-opacity">
          <MdAccountCircle className="w-4 h-4 text-text-on-light" />
          <span className="text-eva-body-sm-bold text-text-on-light">My Profile</span>
        </button>
        
        <div className="h-6 w-px bg-white/20" />
        
        <button className="flex gap-2 items-center px-eva-100 py-eva-10 rounded-eva-s hover:opacity-80 transition-opacity">
          <MdLogout className="w-4 h-4 text-text-on-light" />
          <span className="text-eva-body-sm-bold text-text-on-light">Log out</span>
        </button>
      </div>
    </header>
  );
}

