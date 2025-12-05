import { useCallback } from "react";

import Image from "next/image";
import { useAudio, useKey } from "react-use";

import { challenges } from "@/db/schema";
import { cn } from "@/lib/utils";
import { Card as BaseCard } from "@/components/ui/card";

type CardProps = {
  id: number;
  text: string;
  imageSrc: string | null;
  audioSrc: string | null;
  shortcut: string;
  selected?: boolean;
  onClick: () => void;
  status?: "correct" | "wrong" | "none";
  disabled?: boolean;
  type: (typeof challenges.$inferSelect)["type"];
};

export const Card = ({
  text,
  imageSrc,
  audioSrc,
  shortcut,
  selected,
  onClick,
  status,
  disabled,
  type,
}: CardProps) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [audio, _, controls] = useAudio({ src: audioSrc || "" });

  const handleClick = useCallback(() => {
    if (disabled) return;

    void controls.play();
    onClick();
  }, [disabled, onClick, controls]);

  useKey(shortcut, handleClick, {}, [handleClick]);

  return (
    <BaseCard
      variant="interactive"
      onClick={handleClick}
      className={cn(
        "h-full transition-all duration-200 hover:shadow-lg active:scale-[0.98]",
        "p-4 lg:p-6",
        // Selection states with new color scheme
        selected && "ring-2 ring-primary ring-offset-2 bg-primary/5 border-primary/20",
        selected &&
        status === "correct" &&
        "ring-success ring-offset-2 bg-success/5 border-success/20",
        selected &&
        status === "wrong" &&
        "ring-destructive ring-offset-2 bg-destructive/5 border-destructive/20",
        disabled && "pointer-events-none opacity-50 hover:scale-100",
        type === "ASSIST" && "w-full lg:p-3"
      )}
    >
      {audio}
      {imageSrc && (
        <div className="relative mb-4 aspect-square max-h-[80px] w-full overflow-hidden rounded-lg border border-border lg:max-h-[150px]">
          <Image
            src={imageSrc}
            fill
            alt={text}
            className="object-cover transition-transform duration-200 hover:scale-105"
          />
        </div>
      )}

      <div
        className={cn(
          "flex items-center justify-between",
          type === "ASSIST" && "flex-row-reverse"
        )}
      >
        {type === "ASSIST" && <div aria-hidden />}
        <p
          className={cn(
            "text-sm text-muted-foreground lg:text-base font-medium",
            selected && "text-primary",
            selected && status === "correct" && "text-success",
            selected && status === "wrong" && "text-destructive"
          )}
        >
          {text}
        </p>

        <div
          className={cn(
            "flex h-[20px] w-[20px] items-center justify-center rounded-lg border-2 text-xs font-semibold text-muted-foreground bg-muted/50 lg:h-[30px] lg:w-[30px] lg:text-[15px] transition-colors",
            selected && "border-primary text-primary bg-primary/10",
            selected &&
            status === "correct" &&
            "border-success text-success bg-success/10",
            selected && status === "wrong" && "border-destructive text-destructive bg-destructive/10"
          )}
        >
          {shortcut}
        </div>
      </div>
    </BaseCard>
  );
};
