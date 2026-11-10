import React, { useState } from 'react';
import { Phone, MessageCircle, X, ExternalLink } from 'lucide-react';

export const WhatsAppSupportButton = () => {
  const [showTooltip, setShowTooltip] = useState(false);
  const phoneNumber = '01816550751';
  const whatsappUrl = 'https://wa.me/8801816550751?text=Hello%20I%20need%20help%20with%20ResumeCraft';

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-2 select-none">
      {/* Tooltip Card on Hover / Toggle */}
      {showTooltip && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-3.5 shadow-2xl w-64 animate-fade-in text-xs space-y-2">
          <div className="flex items-center justify-between pb-1 border-b border-slate-100 dark:border-slate-800">
            <span className="font-bold text-slate-800 dark:text-white flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#25D366] animate-ping" />
              Live WhatsApp Support
            </span>
            <button
              type="button"
              onClick={() => setShowTooltip(false)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
            Need help creating your CV, have formatting issues, or need assistance? Contact me directly:
          </p>
          <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-800 p-2 rounded-xl border border-slate-100 dark:border-slate-700">
            <span className="font-mono font-bold text-slate-900 dark:text-white text-xs">
              {phoneNumber}
            </span>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] font-semibold text-[#25D366] hover:underline flex items-center gap-1"
            >
              <span>Chat</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      )}

      {/* Main Floating WhatsApp Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={() => setShowTooltip(true)}
        className="group flex items-center gap-2.5 bg-[#25D366] hover:bg-[#20ba59] active:scale-95 text-white pl-3.5 pr-4 py-2.5 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer border-2 border-white dark:border-slate-800"
        title="Chat with us on WhatsApp: 01816550751"
      >
        {/* WhatsApp Vector Icon */}
        <div className="relative flex items-center justify-center">
          <svg
            className="w-5 h-5 fill-current"
            viewBox="0 0 24 24"
          >
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
        </div>

        {/* Text & Contact Number */}
        <div className="flex flex-col text-left leading-tight">
          <span className="text-[10px] font-semibold opacity-90 tracking-wide uppercase">
            WhatsApp Support
          </span>
          <span className="text-xs font-bold font-mono tracking-tight">
            {phoneNumber}
          </span>
        </div>
      </a>
    </div>
  );
};

export default WhatsAppSupportButton;
