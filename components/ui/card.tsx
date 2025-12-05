import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

// Professional Speakeasy card styles with modern elevation
const cardVariants = cva(
    "rounded-lg border bg-card text-card-foreground transition-all duration-200",
    {
        variants: {
            variant: {
                default: "border-border shadow-sm hover:shadow-md",
                elevated: "border-border shadow-md hover:shadow-lg",
                interactive: "border-border shadow-sm hover:shadow-md hover:scale-[1.02] cursor-pointer",
                outline: "border-2 border-border shadow-none hover:shadow-sm",
                ghost: "border-transparent shadow-none hover:bg-muted/50",
                gradient: "border-border shadow-lg bg-gradient-to-br from-card to-muted/20",
            },
            size: {
                sm: "p-3",
                default: "p-4",
                lg: "p-6",
                xl: "p-8",
            },
            spacing: {
                none: "p-0",
                tight: "p-2",
                normal: "p-4",
                loose: "p-6",
                spacious: "p-8",
            }
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
);

export interface CardProps
    extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
    asChild?: boolean;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
    ({ className, variant, size, spacing, ...props }, ref) => (
        <div
            ref={ref}
            className={cn(cardVariants({ variant, size, spacing }), className)}
            {...props}
        />
    )
);
Card.displayName = "Card";

const CardHeader = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn("flex flex-col space-y-1.5 pb-4", className)}
        {...props}
    />
));
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<
    HTMLParagraphElement,
    React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
    <h3
        ref={ref}
        className={cn("text-h4 font-semibold leading-none tracking-tight", className)}
        {...props}
    />
));
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<
    HTMLParagraphElement,
    React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
    <p
        ref={ref}
        className={cn("text-small text-muted-foreground", className)}
        {...props}
    />
));
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div ref={ref} className={cn("", className)} {...props} />
));
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn("flex items-center pt-4", className)}
        {...props}
    />
));
CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent, cardVariants };