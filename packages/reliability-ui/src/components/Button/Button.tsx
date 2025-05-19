import { cva, type VariantProps } from "class-variance-authority";
import {
  Button as RadixButton,
  ButtonProps as RadixButtonProps,
} from "@radix-ui/themes";
import { cn } from "../../utils/cn";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors",
  {
    variants: {
      intent: {
        primary: "bg-blue-600 text-white hover:bg-blue-700",
        secondary: "bg-gray-100 text-black hover:bg-gray-200",
      },
      size: {
        sm: "h-8 px-3",
        md: "h-10 px-4",
        lg: "h-12 px-6",
      },
    },
    defaultVariants: {
      intent: "primary",
      size: "md",
    },
  }
);

type ButtonProps = RadixButtonProps & VariantProps<typeof buttonVariants>;

const Button = ({ className, intent, size, ...props }: ButtonProps) => {
  return (
    <RadixButton
      className={cn(buttonVariants({ intent, size }), className)}
      {...props}
    />
  );
};

export default Button;
