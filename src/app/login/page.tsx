"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { Button } from "@/components/ui/button";
import { SignInButton } from "@clerk/nextjs";

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.03] dark:opacity-[0.05]">
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)', backgroundSize: '40px 40px' }} />
      </div>

      <div className="w-full max-w-[420px] relative z-10">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-12 group transition-colors"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-[14px] font-medium">Back to Home</span>
        </Link>

        <div className="bg-card border border-border rounded-2xl p-8 shadow-2xl shadow-black/5">
          <div className="flex flex-col items-center text-center mb-10">
            <div className="w-12 h-12 rounded-xl bg-black flex items-center justify-center overflow-hidden relative mb-4">
              <Image
                src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/project-uploads/3d6ecce6-cc10-46fc-af6f-e55871f87b8c/image-1768289104761.png?width=8000&height=8000&resize=contain"
                alt="Piepio Logo"
                width={48}
                height={48}
                className="object-contain"
              />
            </div>
            <h1 className="text-[24px] font-bold text-foreground tracking-tight">Welcome to trae.ai</h1>
            <p className="text-muted-foreground text-[14px] mt-2">Sign in to your account to continue</p>
          </div>

          <SignInButton mode="redirect">
            <Button
              variant="outline"
              className="w-full h-12 gap-3 text-[16px] font-medium hover:bg-secondary/80 transition-colors"
            >
              <FcGoogle className="w-5 h-5" />
              Continue with email or Google
            </Button>
          </SignInButton>

          <p className="text-center mt-8 text-[13px] text-muted-foreground px-4">
            By continuing, you agree to our{" "}
            <Link href="/terms" className="underline hover:text-foreground">Terms of Service</Link>
            {" "}and{" "}
            <Link href="/privacy" className="underline hover:text-foreground">Privacy Policy</Link>.
          </p>
        </div>
      </div>
    </div>
  );
}
