import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setAppearance, setAccent } from '../slices/themeSlice';
import { Check, Palette, Moon, Sun, Monitor, PaintBucket } from 'lucide-react';

const appearances = [
  { id: 'light', name: 'Light', bg: 'bg-white', border: 'border-gray-200', text: 'text-gray-900' },
  { id: 'dark', name: 'Dark', bg: 'bg-slate-900', border: 'border-slate-700', text: 'text-white' },
  { id: 'midnight', name: 'Midnight', bg: 'bg-black', border: 'border-neutral-800', text: 'text-white' },
  { id: 'nord', name: 'Nordic', bg: 'bg-[#2e3440]', border: 'border-[#4c566a]', text: 'text-[#eceff4]' },
];

const accents = [
  { id: 'blue', name: 'Cerulean', color: 'bg-[#0492c2]' },
  { id: 'emerald', name: 'Emerald', color: 'bg-emerald-500' },
  { id: 'purple', name: 'Royal', color: 'bg-violet-600' },
  { id: 'orange', name: 'Sunset', color: 'bg-orange-500' },
  { id: 'rose', name: 'Rose', color: 'bg-rose-500' },
];

const SettingsPage = () => {
  const dispatch = useDispatch();
  const { appearance, accent } = useSelector((state) => state.themeSlice);

  return (
    <div className="bg-skin-base min-h-screen py-8 text-skin-text transition-colors duration-300">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-8">
          <h1 className="text-3xl font-serif font-bold text-skin-text">Settings</h1>
          <p className="text-skin-muted mt-1">Customize the look and feel of your dashboard.</p>
        </div>

        <div className="space-y-8">
          
          {/* SECTION 1: APPEARANCE (Mode) */}
          <div className="bg-skin-surface rounded-2xl shadow-sm border border-skin-border overflow-hidden transition-colors duration-300">
            <div className="p-6 border-b border-skin-border flex items-center gap-3">
              <div className="p-2 bg-brand-teal/10 rounded-lg text-brand-teal">
                <Monitor className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold font-serif text-skin-text">Interface Appearance</h2>
                <p className="text-sm text-skin-muted">Select your preferred background theme.</p>
              </div>
            </div>

            <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-4">
              {appearances.map((mode) => (
                <button
                  key={mode.id}
                  onClick={() => dispatch(setAppearance(mode.id))}
                  className={`
                    group relative rounded-xl border-2 p-1 text-left transition-all duration-200
                    ${appearance === mode.id 
                      ? 'border-brand-teal ring-2 ring-brand-teal/20' 
                      : 'border-transparent hover:border-skin-border hover:shadow-lg'}
                  `}
                >
                  {/* Mock Window Preview */}
                  <div className={`aspect-[4/3] rounded-lg ${mode.bg} border ${mode.border} shadow-sm mb-3 flex flex-col overflow-hidden`}>
                     {/* Sidebar */}
                     <div className="flex h-full">
                       <div className={`w-1/4 h-full border-r ${mode.border} opacity-50`}></div>
                       <div className="flex-1 p-2 space-y-2">
                          <div className={`h-2 w-3/4 rounded-full ${mode.bg === 'bg-white' ? 'bg-gray-200' : 'bg-white/20'}`}></div>
                          <div className={`h-2 w-1/2 rounded-full ${mode.bg === 'bg-white' ? 'bg-gray-200' : 'bg-white/20'}`}></div>
                       </div>
                     </div>
                  </div>
                  
                  <div className="px-1 flex items-center justify-between">
                    <span className={`text-sm font-bold ${appearance === mode.id ? 'text-brand-teal' : 'text-skin-text'}`}>
                        {mode.name}
                    </span>
                    {appearance === mode.id && <Check className="w-4 h-4 text-brand-teal" />}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* SECTION 2: ACCENT COLOR */}
          <div className="bg-skin-surface rounded-2xl shadow-sm border border-skin-border overflow-hidden transition-colors duration-300">
            <div className="p-6 border-b border-skin-border flex items-center gap-3">
              <div className="p-2 bg-brand-teal/10 rounded-lg text-brand-teal">
                <PaintBucket className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold font-serif text-skin-text">Accent Color</h2>
                <p className="text-sm text-skin-muted">Choose the primary brand color for buttons and highlights.</p>
              </div>
            </div>

            <div className="p-6">
               <div className="flex flex-wrap gap-4">
                 {accents.map((item) => (
                   <button
                     key={item.id}
                     onClick={() => dispatch(setAccent(item.id))}
                     className={`
                        relative group flex items-center gap-3 pl-2 pr-4 py-2 rounded-full border transition-all duration-200
                        ${accent === item.id 
                          ? 'bg-skin-base border-brand-teal shadow-sm' 
                          : 'bg-transparent border-transparent hover:bg-skin-base hover:border-skin-border'}
                     `}
                   >
                      <span className={`w-8 h-8 rounded-full shadow-sm ${item.color} flex items-center justify-center`}>
                        {accent === item.id && <Check className="w-4 h-4 text-white" />}
                      </span>
                      <span className={`text-sm font-medium ${accent === item.id ? 'text-brand-teal font-bold' : 'text-skin-text'}`}>
                        {item.name}
                      </span>
                   </button>
                 ))}
               </div>

               {/* Live Preview Button */}
               <div className="mt-8 pt-6 border-t border-skin-border">
                 <h4 className="text-xs font-bold text-skin-muted uppercase tracking-wider mb-3">Live Button Preview</h4>
                 <div className="flex gap-3">
                    <button className="px-4 py-2 bg-brand-teal text-white rounded-lg text-sm font-medium shadow-md hover:bg-brand-teal-hover transition-colors">
                      Primary Button
                    </button>
                    <button className="px-4 py-2 bg-brand-teal/10 text-brand-teal rounded-lg text-sm font-medium hover:bg-brand-teal/20 transition-colors">
                      Secondary Button
                    </button>
                 </div>
               </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default SettingsPage;