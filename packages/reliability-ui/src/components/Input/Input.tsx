import { forwardRef } from 'react';
import { TextField } from '@radix-ui/themes';
import type { TextField as RadixTextFieldNS } from '@radix-ui/themes';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn';

const textFieldVariants = cva('', {
  variants: {
    display: {
      default: '',
      inline:
        'reliability-input-inline h-6 w-full p-0 outline-0 shadow-none border-b-1 border-gray-400 pb-0.5 rounded-none bg-transparent focus:border-0',
    },
  },
  defaultVariants: {
    display: 'default',
  },
});

type CustomTextFieldProps = RadixTextFieldNS.RootProps &
  VariantProps<typeof textFieldVariants> & {
    className?: string;
  };

const CustomTextField = forwardRef<HTMLInputElement, CustomTextFieldProps>(
  ({ display, className, ...props }, ref) => {
    return (
      <>
        <TextField.Root
          {...props}
          ref={ref}
          className={cn(textFieldVariants({ display }), className)}
        />
        <style
          dangerouslySetInnerHTML={{
            __html: `
              .reliability-input-inline input {
                text-indent: 1px;
                font-weight: 600;
              }
            `,
          }}
        />
      </>
    );
  },
);

CustomTextField.displayName = 'CustomTextField';

export default CustomTextField;
