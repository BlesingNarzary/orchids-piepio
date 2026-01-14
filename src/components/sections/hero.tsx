import React, { useState, useEffect } from 'react';
import { ArrowRight, CodeXml, Search, Sparkles, Box, Atom, Briefcase, Paperclip, ChevronDown, ArrowUp } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import ComplianceLogos from './compliance-logos';


const HeroSection = () => {
  const [placeholder, setPlaceholder] = useState('');
  const phrases = [
    "Ask Piepio to build anything...",
    "Ask Piepio to build app...",
    "Ask Piepio to build software...",
    "Ask Piepio to build website...",
    "Ask Piepio to build whatever...",
  ];

  useEffect(() => {
    let currentPhraseIndex = 0;
    let currentCharIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    const type = () => {
      const currentPhrase = phrases[currentPhraseIndex];
      
      if (isDeleting) {
        setPlaceholder(currentPhrase.substring(0, currentCharIndex - 1));
        currentCharIndex--;
        typingSpeed = 50;
      } else {
        setPlaceholder(currentPhrase.substring(0, currentCharIndex + 1));
        currentCharIndex++;
        typingSpeed = 100;
      }

      if (!isDeleting && currentCharIndex === currentPhrase.length) {
        isDeleting = true;
        typingSpeed = 2000; // Pause at the end
      } else if (isDeleting && currentCharIndex === 0) {
        isDeleting = false;
        currentPhraseIndex = (currentPhraseIndex + 1) % phrases.length;
        typingSpeed = 500; // Pause before starting next phrase
      }

      setTimeout(type, typingSpeed);
    };

    const timer = setTimeout(type, typingSpeed);
    return () => clearTimeout(timer);
  }, []);


  return (
    <section id="home-hero" className="relative overflow-x-clip min-h-[850px] pt-28 lg:pt-[150px] pb-[115px] colorful-bg">
      {/* Background Technical Grid Overlay */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">


        {/* Floating Accents */}
        <div className="absolute top-[180px] left-[15%] animate-pulse pointer-events-none opacity-20 lg:block hidden">
          <div className="w-3 h-3 bg-primary rotate-45"></div>
        </div>
        <div className="absolute top-[220px] right-[18%] animate-pulse pointer-events-none opacity-20 lg:block hidden">
          <div className="w-3 h-3 bg-primary rotate-45"></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container relative z-10 px-6 lg:px-[24px]">
        <div className="flex flex-col items-center text-center max-w-[900px] mx-auto pt-20">
            {/* Badge */}
            <Link href="#pricing" className="inline-flex items-center gap-2 px-3 py-1 mb-8 rounded-full bg-accent border border-primary/10 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500 hover:bg-accent/80 transition-colors">
              <span className="text-[14px] font-medium text-primary">2 Month Free - Annually</span>
              <div className="w-5 h-5 flex items-center justify-center bg-foreground rounded-full">
                <ArrowRight className="w-3 h-3 text-background" />
              </div>
            </Link>


          {/* Heading */}
            <h1 className="text-4xl md:text-6xl lg:text-[64px] font-bold leading-[1.1] tracking-[-0.03em] text-foreground mb-6">
              Piepio The AI full-stack engineer.
            </h1>

          {/* Subheading */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-[700px] mb-12 !whitespace-pre-line">
            Bring your idea — Piepio builds the frontend, backend, auth, database, and payments instantly. Make it all work now.
          </p>

            {/* Prompt Interaction Box */}
            <div className="w-full max-w-[800px] relative animate-in fade-in zoom-in-95 duration-700 delay-200">
              <div className="bg-[#131313] rounded-[24px] border border-white/5 p-5 shadow-2xl shadow-black/50">
                <div className="flex flex-col gap-8">
                  {/* Input Area */}
                  <div className="px-2 pt-2">
                    <textarea
                      placeholder={placeholder}
                      className="w-full bg-transparent border-none outline-none text-[20px] md:text-[22px] font-medium placeholder:text-white/20 text-white resize-none min-h-[60px]"
                      rows={1}
                    />
                  </div>

                  {/* Actions Row */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors text-[13px] font-medium text-white/70">
                        <Atom className="w-4 h-4" />
                        Auto
                        <ChevronDown className="w-3 h-3 opacity-50" />
                      </button>
                      <button className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors text-[13px] font-medium text-white/70">
                        <Briefcase className="w-4 h-4" />
                        Tools
                        <ChevronDown className="w-3 h-3 opacity-50" />
                      </button>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <button className="p-2 text-white/40 hover:text-white/70 transition-colors">
                        <Paperclip className="w-5 h-5" />
                      </button>
                      <button className="bg-white/10 text-white p-2 rounded-xl hover:bg-white/20 transition-all border border-white/5">
                        <ArrowUp className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

      {/* Background Subgrid */}
        <div className="absolute top-[400px] left-1/2 -translate-x-1/2 w-full max-w-[1314px] h-[400px] pointer-events-none overflow-hidden lg:block hidden z-0 px-6 lg:px-[24px]">
          <div className="grid grid-cols-6 grid-rows-4 w-full h-full border-t border-[#E5E5E5]/40 text-transparent">
            {Array.from({ length: 24 }).map((_, i) =>
            <div key={i} className="border-r border-b border-[#E5E5E5]/30 relative">
                {i === 0 && (
                  <div className="absolute top-8 left-0 flex flex-col gap-6 font-mono select-none z-10">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-foreground flex items-center justify-center overflow-hidden relative">
                        <Image
                          src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/project-uploads/3d6ecce6-cc10-46fc-af6f-e55871f87b8c/image-1768289104761.png?width=8000&height=8000&resize=contain"
                          alt="Piepio Logo"
                          width={24}
                          height={24}
                          className="object-contain"
                        />
                      </div>
                      <span className="text-[18px] font-bold tracking-tight text-foreground">
                        Piepio
                      </span>
                    </div>

                        <div className="flex flex-col gap-1 text-[11px] tracking-[0.1em] text-[#525252] uppercase font-mono">
                          <div>AI FULLSTACK ENGINEER</div>
                          <div className="text-[9px] opacity-70">SOC 2 TYPE 1, SOC 2 TYPE 2, ISO 27001</div>
                          <ComplianceLogos className="mt-1 scale-[0.6] origin-left" />
                        </div>

                  </div>
                )}
                {(i === 2 || i === 15) &&
            <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-1 h-1 bg-[#FF4D00]/40 rounded-full"></div>
                </div>
            }
            </div>
          )}
        </div>
      </div>
    </section>);

};

export default HeroSection;
