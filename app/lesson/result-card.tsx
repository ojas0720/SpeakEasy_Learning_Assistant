import { InfinityIcon } from "lucide-react";
import Image from "next/image";

import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

type ResultCardProps = {
  value: number;
  variant: "points" | "hearts";
};

export const ResultCard = ({ value, variant }: ResultCardProps) => {
  const imageSrc = variant === "points" ? "/points.svg" : "/heart.svg";

  return (
    <Card
      variant="elevated"
      spacing="none"
      className={cn(
        "w-full overflow-hidden",
        variant === "points" && "border-accent/20 shadow-accent/10",
        variant === "hearts" && "border-destructive/20 shadow-destructive/10"
      )}
    >
      <div
        className={cn(
          "px-4 py-2 text-center text-xs font-semibold text-white",
          variant === "points" && "bg-accent",
          variant === "hearts" && "bg-destructive"
        )}
      >
        {variant === "hearts" ? "Hearts Left" : "Total XP"}
      </div>

      <div
        className={cn(
          "flex items-center justify-center bg-card p-6 text-lg font-bold",
          variant === "points" && "text-accent",
          variant === "hearts" && "text-destructive"
        )}
      >
        <Image
          src={imageSrc}
          alt={variant}
          height={30}
          width={30}
          className="mr-2"
        />
        {value === Infinity ? (
          <InfinityIcon className="h-6 w-6 stroke-[3]" />
        ) : (
          value
        )}
      </div>
    </Card>
  );
};
