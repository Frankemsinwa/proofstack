import * as React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "./utils";

const buttonVariants = cva(
  "flex-row items-center justify-center rounded-md",
  {
    variants: {
      variant: {
        default: "bg-blue-500",
        destructive: "bg-red-500",
        outline: "border border-gray-400",
        secondary: "bg-gray-500",
        ghost: "bg-transparent",
        link: "bg-transparent",
      },
      size: {
        default: "h-10 px-4",
        sm: "h-8 px-3",
        lg: "h-12 px-6",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

const buttonTextVariants = cva("text-sm font-medium", {
  variants: {
    variant: {
      default: "text-white",
      destructive: "text-white",
      outline: "text-gray-900",
      secondary: "text-white",
      ghost: "text-gray-900",
      link: "text-blue-500 underline",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export interface ButtonProps
  extends React.ComponentPropsWithoutRef<typeof TouchableOpacity>,
    VariantProps<typeof buttonVariants> {
  children: React.ReactNode;
}

const Button = React.forwardRef<
  React.ElementRef<typeof TouchableOpacity>,
  ButtonProps
>(({ className, variant, size, children, ...props }, ref) => {
  return (
    <TouchableOpacity
      ref={ref}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    >
      <Text className={cn(buttonTextVariants({ variant }))}>{children}</Text>
    </TouchableOpacity>
  );
});
Button.displayName = "Button";

export { Button, buttonVariants };
