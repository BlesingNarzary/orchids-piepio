"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
  useUser,
} from "@clerk/nextjs";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user } = useUser();

  const navLinks = [
    { name: "Features", href: "#features" },
    { name: "How it Works", href: "#how-it-works" },
    { name: "Pricing", href: "#pricing" },
    { name: "Docs", href: "#docs" },
    { name: "Blog", href: "#blog" },
  ];

  return (
    <nav className="sticky top-0 left-0 w-full z-[101] bg-background border-b border-border h-20 lg:h-[80px]">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1314px] border-x border-border h-full pointer-events-none z-[-1]" />
      
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1314px] h-full pointer-events-none">
        <svg
          height="21"
          width="22"
          className="pointer-events-none absolute -left-[10.5px] -bottom-[21px] text-border fill-none"
        >
          <path d="M0 0V21H22" stroke="currentColor" strokeWidth="1" />
        </svg>
        <svg
          height="21"
          width="22"
          className="pointer-events-none absolute -right-[10.5px] -bottom-[21px] text-border fill-none"
        >
          <path d="M22 0V21H0" stroke="currentColor" strokeWidth="1" />
        </svg>
      </div>

      <div className="container mx-auto max-w-[1314px] flex justify-between items-center h-full px-6 lg:px-14">
        <div className="flex gap-6 items-center">
          <a className="flex items-center gap-2 group" href="/">
            <div className="flex items-center gap-1.5">
                <div className="w-8 h-8 rounded-lg bg-foreground flex items-center justify-center overflow-hidden relative">
                  <Image
                    src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/project-uploads/3d6ecce6-cc10-46fc-af6f-e55871f87b8c/image-1768289104761.png?width=8000&height=8000&resize=contain"
                    alt="Piepio Logo"
                    width={32}
                    height={32}
                    className="object-contain"
                    priority
                  />
                </div>
                <span className="text-[20px] font-bold tracking-tight text-foreground">
                  Piepio
                </span>
            </div>
          </a>

          <div className="text-foreground/20 text-[14px] select-none hidden lg:block">·</div>

          <div className="hidden lg:flex gap-1 relative select-none">
            {navLinks.map((link) => (
              <a
                key={link.name}
                className="relative px-3 py-1.5 flex items-center h-8 group rounded-md transition-all duration-150 active:scale-[0.98]"
                href={link.href}
              >
                <span className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/5 rounded-md transition-all scale-95 group-hover:scale-100" />
                <span className="relative z-10 text-[14px] font-medium text-foreground">
                  {link.name}
                </span>
              </a>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden lg:flex items-center gap-4">
            <SignedOut>
              <SignInButton mode="modal">
                <Button variant="ghost" size="sm">
                  Log in
                </Button>
              </SignInButton>
              <SignUpButton mode="modal">
                <Button size="sm">
                  Sign up
                </Button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </div>

          <button
            className="lg:hidden p-2 rounded-md hover:bg-foreground/5 transition-colors"
            aria-label="Toggle menu"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6 text-foreground" />
            ) : (
              <Menu className="w-6 h-6 text-foreground" />
            )}
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-20 left-0 w-full bg-background border-b border-border shadow-lg animate-in fade-in slide-in-from-top-2">
          <div className="flex flex-col p-6 gap-4">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-lg font-medium text-foreground py-2 border-b border-border last:border-0"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.name}
              </a>
            ))}
            <div className="flex flex-col gap-2 pt-4">
              <SignedOut>
                <SignInButton mode="modal">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Log in
                  </Button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <Button
                    className="w-full"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Sign up
                  </Button>
                </SignUpButton>
              </SignedOut>
              <SignedIn>
                <div className="flex flex-col gap-2">
                  <div className="p-2 border rounded-md text-sm text-foreground truncate">
                    {user?.primaryEmailAddress?.emailAddress ??
                      user?.emailAddresses[0]?.emailAddress ??
                      ""}
                  </div>
                  <UserButton />
                </div>
              </SignedIn>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
