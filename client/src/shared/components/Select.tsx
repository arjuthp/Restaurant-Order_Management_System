import { useState, useRef, useEffect } from 'react';
import styles from './Select.module.css';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  className?: string;
}

export const Select = ({ value, onChange, options, placeholder, className }: SelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(opt => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <div className={`${styles.select} ${className || ''}`} ref={selectRef}>
      <div 
        className={styles.selectTrigger} 
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{selectedOption?.label || placeholder || 'Select...'}</span>
        <svg 
          className={`${styles.arrow} ${isOpen ? styles.arrowOpen : ''}`}
          width="12" 
          height="12" 
          viewBox="0 0 12 12"
        >
          <path fill="currentColor" d="M6 9L1 4h10z"/>
        </svg>
      </div>
      
      {isOpen && (
        <div className={styles.selectDropdown}>
          {options.map((option) => (
            <div
              key={option.value}
              className={`${styles.selectOption} ${option.value === value ? styles.selectOptionActive : ''}`}
              onClick={() => handleSelect(option.value)}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
