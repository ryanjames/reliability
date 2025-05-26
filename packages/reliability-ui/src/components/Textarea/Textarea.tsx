import { useRef, useEffect } from 'react';
import { TextArea as RadixTextArea } from '@radix-ui/themes';
import type { TextAreaProps as RadixTextAreaProps } from '@radix-ui/themes';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn';

const textAreaVariants = cva('reliability-textarea', {
  variants: {
    display: {
      default: '',
    },
  },
  defaultVariants: {
    display: 'default',
  },
});

type TextAreaProps = RadixTextAreaProps &
  VariantProps<typeof textAreaVariants> & {
    className?: string;
  };

const Textarea = ({ display, className, onChange, ...props }: TextAreaProps) => {
  const ref = useRef<HTMLTextAreaElement>(null);

  // Resize handler
  const resize = () => {
    const el = ref.current;
    if (el) {
      el.style.height = 'auto'; // Reset
      el.style.height = `${el.scrollHeight}px`; // Expand
    }
  };

  useEffect(() => {
    resize(); // initial resize
  }, [props.value]); // also resize on value change

  return (
    <>
      <RadixTextArea
        {...props}
        onChange={e => {
          onChange?.(e);
          resize();
        }}
        ref={ref}
        className={cn(textAreaVariants({ display }), className)}
      />
      <style
        dangerouslySetInnerHTML={{
          __html: `
            .reliability-textarea {
              resize: none;
              overflow: hidden;
            }
          `,
        }}
      />
    </>
  );
};

export default Textarea;
