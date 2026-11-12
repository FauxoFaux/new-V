import React from 'react';

export interface EditorialFooterProps {
  className?: string;
}

export const EditorialFooter: React.FC<EditorialFooterProps> = ({ className = '' }) => {
  return (
    <footer className={`w-full border-t border-black/[0.1] bg-white mt-16 sm:mt-24 pt-8 sm:pt-10 pb-10 sm:pb-12 text-[#1D1D1F] font-sans ${className}`}>
      <div className="max-w-[1340px] mx-auto px-5 sm:px-8 md:px-12 lg:px-16 flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8">
        
        {/* Left Column: Name & Email */}
        <div className="flex flex-col items-center md:items-start space-y-0.5 text-center md:text-left">
          <span className="font-caps text-[12px] sm:text-[13px] font-bold tracking-[0.1em] text-black">
            KAY RAVICHANDRAN
          </span>
          <a
            href="mailto:itskeerthanaravichandran@gmail.com"
            className="text-[12.5px] sm:text-[13px] text-[#6E6E73] hover:text-black transition-colors"
          >
            itskeerthanaravichandran@gmail.com
          </a>
        </div>

        {/* Center Column: Navigation */}
        <div className="flex items-center gap-2 sm:gap-2.5 text-[13px] sm:text-[14px] text-[#1D1D1F] font-normal">
          <a href="/#work" className="hover:text-black hover:underline underline-offset-4 transition-colors">work</a>
          <span className="text-[#86868B] select-none">·</span>
          <a href="/#about" className="hover:text-black hover:underline underline-offset-4 transition-colors">about</a>
          <span className="text-[#86868B] select-none">·</span>
          <a href="/#play" className="hover:text-black hover:underline underline-offset-4 transition-colors">play</a>
          <span className="text-[#86868B] select-none">·</span>
          <a href="https://drive.google.com/file/d/1ZJWXJ0DoubaRd7qDoCK57abnknj8BDMq/view?usp=sharing" target="_blank" rel="noopener noreferrer" className="hover:text-black hover:underline underline-offset-4 transition-colors">resume</a>
          <span className="text-[#86868B] select-none">·</span>
          <a href="/#contact" className="hover:text-black hover:underline underline-offset-4 transition-colors">contact</a>
        </div>

        {/* Right Column: Social Icons without boxes */}
        <div className="flex items-center gap-4 sm:gap-5 text-[#1D1D1F]">
          {/* Instagram */}
          <a 
            href="https://www.instagram.com/summershuttle/?hl=en" 
            target="_blank" 
            rel="noreferrer"
            aria-label="Instagram"
            title="Instagram"
            className="text-[#1D1D1F] hover:text-black transition-transform hover:scale-110 flex items-center justify-center p-1"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
            </svg>
          </a>

          {/* Behance */}
          <a 
            href="https://www.behance.net/keertharavicha1" 
            target="_blank" 
            rel="noreferrer"
            aria-label="Behance"
            title="Behance"
            className="text-[#1D1D1F] hover:text-black transition-transform hover:scale-110 flex items-center justify-center p-1"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4.5 5.5v13" />
              <path d="M4.5 5.5h4a3 3 0 0 1 0 6h-4" />
              <path d="M4.5 11.5h4.5a3.5 3.5 0 0 1 0 7h-4.5" />
              <path d="M13.5 7.5h5" />
              <path d="M12.5 15h6a3 3 0 1 0-6 0c0 2 1.5 3.5 3.5 3.5 1.3 0 2.4-.6 3-1.6" />
            </svg>
          </a>

          {/* Email */}
          <a 
            href="mailto:itskeerthanaravichandran@gmail.com" 
            aria-label="Email"
            title="Email"
            className="text-[#1D1D1F] hover:text-black transition-transform hover:scale-110 flex items-center justify-center p-1"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="4" width="20" height="16" rx="2"></rect>
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
            </svg>
          </a>

          {/* LinkedIn */}
          <a 
            href="https://www.linkedin.com/in/keerthanaravichandran/" 
            target="_blank" 
            rel="noreferrer"
            aria-label="LinkedIn"
            title="LinkedIn"
            className="text-[#1D1D1F] hover:text-black transition-transform hover:scale-110 flex items-center justify-center p-1"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
              <rect x="2" y="9" width="4" height="12"></rect>
              <circle cx="4" cy="4" r="2"></circle>
            </svg>
          </a>
        </div>

      </div>
    </footer>
  );
};
