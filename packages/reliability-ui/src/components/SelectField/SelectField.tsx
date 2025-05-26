import { Select } from '@radix-ui/themes';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn';

const selectTriggerVariants = cva('reliability-ui-select', {
  variants: {
    display: {
      default: '',
    },
  },
  defaultVariants: {
    display: 'default',
  },
});

type SelectFieldProps = {
  value?: string;
  onValueChange?: (value: string) => void;
  defaultValue?: string;
  children: React.ReactNode;
  className?: string;
} & VariantProps<typeof selectTriggerVariants>;

const SelectField = ({
  value,
  defaultValue,
  onValueChange,
  children,
  display,
  className,
}: SelectFieldProps) => {
  return (
    <>
      <Select.Root value={value} defaultValue={defaultValue} onValueChange={onValueChange}>
        <Select.Trigger className={cn(selectTriggerVariants({ display }), className)} />
        <Select.Content>{children}</Select.Content>
      </Select.Root>
      <style
        dangerouslySetInnerHTML={{
          __html: `
            .reliability-ui-select {
            }
          `,
        }}
      />
    </>
  );
};

export { Select };
export default SelectField;
