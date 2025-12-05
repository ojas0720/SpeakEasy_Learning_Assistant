import {
  ClerkLoaded,
  ClerkLoading,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
} from "@clerk/nextjs";
import { Loader } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function MarketingPage() {
  return (
    <div className="mx-auto flex w-full max-w-[1100px] flex-1 flex-col items-center justify-center gap-8 p-6 lg:flex-row">
      <div className="relative mb-8 h-[280px] w-[280px] lg:mb-0 lg:h-[480px] lg:w-[480px]">
        <Image src="/reading.png" alt="Hero" fill className="rounded-3xl shadow-2xl" />
      </div>

      <div className="flex max-w-[560px] flex-col items-center gap-y-6 text-center">
        <h1 className="bg-gradient-to-br from-emerald-500 to-teal-500 bg-clip-text text-3xl font-extrabold tracking-tight text-transparent lg:text-5xl">
          Learn, practice, and master languages with SpeakEasy
        </h1>
        <p className="text-neutral-600">
          Bite-sized lessons, interactive challenges, and real-time pronunciation analysis across Spanish, French, German, Hindi, Kannada, and Tamil.
        </p>

        <div className="flex w-full max-w-[360px] flex-col items-center gap-y-3">
          <ClerkLoading>
            <Loader className="h-5 w-5 animate-spin text-muted-foreground" />
          </ClerkLoading>

          <ClerkLoaded>
            <SignedOut>
              <SignUpButton mode="modal">
                <Button size="lg" variant="secondary" className="w-full rounded-xl">
                  Get Started
                </Button>
              </SignUpButton>

              <SignInButton mode="modal">
                <Button size="lg" variant="primaryOutline" className="w-full rounded-xl">
                  I already have an account
                </Button>
              </SignInButton>
            </SignedOut>

            <SignedIn>
              <Button size="lg" variant="secondary" className="w-full rounded-xl" asChild>
                <Link href="/learn">Continue Learning</Link>
              </Button>
            </SignedIn>
          </ClerkLoaded>
        </div>
      </div>
    </div>
  );
}
