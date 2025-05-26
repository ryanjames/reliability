import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn';

const datePickerVariants = cva(
  'reliability-datepicker border-1 border-gray-400 rounded p-1.5 font-sans',
  {
    variants: {
      size: {
        default: '',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  },
);

interface DatePickerFieldProps extends VariantProps<typeof datePickerVariants> {
  value?: Date;
  onChange?: (date: Date) => void;
  placeholder?: string;
  className?: string;
}

const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const DatePickerField: React.FC<DatePickerFieldProps> = ({
  value,
  onChange,
  className = '',
  size,
}) => {
  return (
    <input
      type="date"
      className={cn(datePickerVariants({ size }), className)}
      value={value ? formatDate(value) : ''}
      onChange={e => {
        const selected = e.target.value;
        if (selected) {
          const [year, month, day] = selected.split('-').map(Number);
          onChange?.(new Date(year, month - 1, day));
        }
      }}
    />
  );
};

export default DatePickerField;
