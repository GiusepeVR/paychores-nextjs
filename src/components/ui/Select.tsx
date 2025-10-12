import { SelectHTMLAttributes } from 'react';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  options: SelectOption[];
  required?: boolean;
  label?: string;
  placeholder?: string;
  error?: string;
  className?: string;
}

export default function Select({
  options,
  className = '',
  required,
  label,
  placeholder,
  error,
  ...props
}: SelectProps) {
  const baseClasses =
    'border border-gray-300 rounded-md p-2 mb-2 w-full bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent';

  const classes = `${baseClasses} ${className}`;

  return (
    <>
      {label && (
        <label className='text-gray-500 mb-1 block'>
          {required ? `${label} *` : label}
        </label>
      )}
      <select className={classes} {...props}>
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className='text-red-500 text-sm mt-1'>{error}</p>}
    </>
  );
}