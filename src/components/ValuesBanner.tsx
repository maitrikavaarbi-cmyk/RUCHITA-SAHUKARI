import React from 'react';
import { 
  ShieldCheck, 
  Megaphone, 
  Users, 
  Sparkles, 
  Target,
  HeartHandshake
} from 'lucide-react';
import { UserProfile } from '../types';

interface ValuesBannerProps {
  values: UserProfile['values'];
}

export const ValuesBanner: React.FC<ValuesBannerProps> = ({ values }) => {
  const getIcon = (name: string) => {
    switch (name) {
      case 'ShieldCheck':
        return <ShieldCheck className="w-5 h-5 text-pink-600" />;
      case 'Megaphone':
        return <Megaphone className="w-5 h-5 text-pink-600" />;
      case 'Users':
        return <Users className="w-5 h-5 text-pink-600" />;
      case 'Sparkles':
        return <Sparkles className="w-5 h-5 text-pink-600" />;
      case 'Target':
        return <Target className="w-5 h-5 text-pink-600" />;
      default:
        return <HeartHandshake className="w-5 h-5 text-pink-600" />;
    }
  };

  return (
    <section id="values-banner" className="bg-[#fff0f4] py-8 border-b border-pink-200 text-zinc-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-6">
          
          {/* Vertical Label */}
          <div className="flex items-center gap-3 shrink-0 border-b lg:border-b-0 lg:border-r border-pink-200 pb-3 lg:pb-0 lg:pr-6">
            <div className="px-2.5 py-1 rounded-lg bg-pink-100 text-pink-700 text-[11px] font-bold tracking-widest uppercase border border-pink-200">
              ETHOS
            </div>
            <span className="text-xs uppercase tracking-widest text-pink-900 font-bold whitespace-nowrap">
              WHAT DRIVES ME
            </span>
          </div>

          {/* Values Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 flex-1">
            {values.map((v) => (
              <div 
                key={v.title}
                className="p-3.5 rounded-xl bg-white hover:bg-pink-50 border border-pink-200 hover:border-pink-400 transition-all duration-200 group shadow-sm hover:shadow-md"
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="p-1.5 rounded-lg bg-pink-50 border border-pink-200 group-hover:border-pink-300 transition-colors">
                    {getIcon(v.iconName)}
                  </div>
                  <h4 className="text-xs font-bold tracking-wider text-zinc-900 uppercase group-hover:text-pink-600 transition-colors">
                    {v.title}
                  </h4>
                </div>
                <p className="text-[11px] text-zinc-600 leading-relaxed group-hover:text-zinc-800">
                  {v.description}
                </p>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
};
