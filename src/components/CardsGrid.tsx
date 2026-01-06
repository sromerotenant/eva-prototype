import { MdAssignment, MdHome, MdGroup, MdBarChart } from 'react-icons/md';

interface CardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function Card({ icon, title, description }: CardProps) {
  return (
    <div className="bg-surface-white flex flex-row gap-eva-100 items-center justify-start px-eva-150 py-eva-150 rounded-eva-l sm:flex-col sm:gap-3 sm:items-center sm:justify-center sm:py-eva-350">
      <div className="w-6 h-6 text-brand-accent flex items-center justify-center flex-shrink-0 sm:w-7 sm:h-7">
        {icon}
      </div>
      <div className="flex flex-col gap-2 items-start justify-start w-full sm:items-center sm:justify-center">
        <h3 className="text-eva-body-sm-bold text-text-default text-left sm:text-center">
          {title}
        </h3>
        <p className="text-eva-label text-text-secondary text-left sm:text-center">
          {description}
        </p>
      </div>
    </div>
  );
}

type ChatMode = 'closed' | 'side' | 'floating';

interface CardsGridProps {
  isChatOpen?: boolean;
  chatMode?: ChatMode;
}

export default function CardsGrid({ isChatOpen = false, chatMode = 'closed' }: CardsGridProps) {
  const cards = [
    {
      icon: <MdAssignment className="w-6 h-6 sm:w-7 sm:h-7 text-brand-accent" />,
      title: 'Applications',
      description: 'Review and manage applications',
    },
    {
      icon: <MdHome className="w-6 h-6 sm:w-7 sm:h-7 text-brand-accent" />,
      title: 'Onboarding hub',
      description: 'Manage your properties',
    },
    {
      icon: <MdGroup className="w-6 h-6 sm:w-7 sm:h-7 text-brand-accent" />,
      title: 'Users',
      description: 'Manage user accounts',
    },
    {
      icon: <MdBarChart className="w-6 h-6 sm:w-7 sm:h-7 text-brand-accent" />,
      title: 'Analytics',
      description: 'View insights and reports',
    },
  ];

  // Show 4 columns when closed or floating (full width), 2 columns when side mode
  const isSideMode = chatMode === 'side';
  
  return (
    <div className={`flex flex-col sm:grid gap-eva-100 sm:gap-5 w-full transition-all duration-300 ${
      isSideMode 
        ? 'sm:grid-cols-2' 
        : 'sm:grid-cols-2 lg:grid-cols-4'
    }`}>
      {cards.map((card, index) => (
        <Card key={index} icon={card.icon} title={card.title} description={card.description} />
      ))}
    </div>
  );
}

