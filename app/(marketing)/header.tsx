"use client";
import { useState } from "react";
import {
  ClerkLoaded,
  ClerkLoading,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
  useAuth,
} from "@clerk/nextjs";
import { Loader } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import Banner from "@/components/banner";
import { Button } from "@/components/ui/button";
import { links } from "@/config";
import { cn } from "@/lib/utils";

export const Header = () => {
  const { isSignedIn } = useAuth();
  const [hideBanner, setHideBanner] = useState(true);

  return (
    <>
      <Banner hide={hideBanner} setHide={setHideBanner} />

      <header
        className={cn(
          "w-full border-b border-slate-300 backdrop-blur-md bg-white/80 dark:bg-slate-900/80 transition-all duration-300",
          !hideBanner ? "mt-20 sm:mt-16 lg:mt-10" : "mt-0"
        )}
      >
        <div className="mx-auto flex h-20 items-center justify-between px-6 lg:max-w-screen-lg">
          {/* Logo + Title */}
          <Link href="/" className="flex items-center gap-x-3">
            <Image
              src="/mascot.png"
              alt="Mascot"
              height={42}
              width={42}
              className="drop-shadow-md"
            />
            <h1 className="text-3xl font-bold tracking-tight text-blue-600 dark:text-blue-400">
              SpeakEasy
            </h1>
          </Link>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {/* Admin Login Button */}
            <Link href="/admin-login">
              <Button
                size="sm"
                variant="ghost"
                className="rounded-xl border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50 transition gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Admin
              </Button>
            </Link>

            <ClerkLoading>
              <Loader className="h-5 w-5 animate-spin text-muted-foreground" />
            </ClerkLoading>

            <ClerkLoaded>
              <SignedIn>
                <UserButton
                  appearance={{
                    elements: {
                      userButtonAvatarBox: "ring-2 ring-blue-500",
                    },
                  }}
                />
              </SignedIn>

              <SignedOut>
                <SignInButton mode="modal">
                  <Button
                    size="sm"
                    className="rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition"
                  >
                    Login
                  </Button>
                </SignInButton>
              </SignedOut>

              <Link
                href={links.sourceCode}
                target="_blank"
                rel="noreferrer noopener"
                className={cn(
                  "hover:opacity-80 transition",
                  isSignedIn ? "pt-0.5" : "pt-1"
                )}
              >
              </Link>
            </ClerkLoaded>
          </div>
        </div>
      </header>
    </>
  );
};
