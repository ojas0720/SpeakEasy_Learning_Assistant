import { ArrowLeft, BookOpen } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

type HeaderProps = {
  title: string;
};

export const Header = ({ title }: HeaderProps) => {
  return (
    <div className="sticky top-0 mb-5 flex items-center justify-between border-b-2 bg-white/70 backdrop-blur lg:z-50 lg:mt-[-28px] lg:pt-[28px]">
      <Link href="/courses">
        <Button size="sm" variant="ghost">
          <ArrowLeft className="h-5 w-5 stroke-2 text-neutral-400" />
        </Button>
      </Link>

      <h1 className="text-lg font-bold text-neutral-800">{title}</h1>

      <Link href="/learn/lessons">
        <Button size="sm" variant="primary" className="gap-2 rounded-xl">
          <BookOpen className="h-4 w-4" /> Lessons
        </Button>
      </Link>
    </div>
  );
};
