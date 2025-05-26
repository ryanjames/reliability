import {
  Checkbox as RadixCheckbox,
  type CheckboxProps as RadixCheckboxProps,
} from '@radix-ui/themes';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn';

const checkboxWrapper = cva('relative inline-block');

const checkboxStyles = cva('reliability-ui-checkbox', {
  variants: {
    priority: {
      1: 'priority-1',
      2: 'priority-2',
      3: 'priority-3',
    },
  },
});

type CustomCheckboxProps = Omit<RadixCheckboxProps, 'onChange'> &
  VariantProps<typeof checkboxStyles> & {
    className?: string;
    onCheckedChange?: (checked: boolean) => void;
    checked?: boolean;
    priority?: 1 | 2 | 3;
  };

const CheckIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    stroke="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    className="pointer-events-none absolute left-0.75 top-1.75 h-2.5 w-2.5 text-black"
  >
    <path d="M14.8866 3.00637C15.2611 2.93453 15.7152 3.49337 15.3838 3.81558L6.1481 12.8828C5.86941 13.1141 5.63483 12.9631 5.3938 12.7761C4.00571 11.1999 2.05162 9.77692 0.720556 8.19124C0.459078 7.8796 0.375147 7.54894 0.777586 7.29646C0.99387 7.16124 1.11116 7.21828 1.30807 7.35034C1.54588 7.5088 2.057 8.03595 2.30664 8.2673C3.48275 9.35858 4.57601 10.5418 5.74028 11.6447L5.89308 11.689L14.8866 3.00637Z" />
  </svg>
);

const Checkbox = ({
  className,
  priority,
  checked,
  onCheckedChange,
  ...props
}: CustomCheckboxProps) => {
  return (
    <>
      <div className={checkboxWrapper()}>
        <RadixCheckbox
          {...props}
          checked={checked}
          onCheckedChange={onCheckedChange}
          className={cn(checkboxStyles({ priority }), className)}
        />
        {Boolean(checked) && <CheckIcon />}
      </div>
      <style
        dangerouslySetInnerHTML={{
          __html: `
            .reliability-ui-checkbox::before {
              background: transparent;
              box-shadow: none;
              border-width: 1px;
              border-style: solid;
            }
            .priority-1.reliability-ui-checkbox::before {
              border-color: var(--color-gray-400);
            }
            .priority-2.reliability-ui-checkbox::before {
              border-color: var(--color-yellow-500);
            }
            .priority-3.reliability-ui-checkbox::before {
              border-color: var(--color-red-500);
            }
          `,
        }}
      />
    </>
  );
};

export default Checkbox;
