import { useState, useCallback } from 'react';

/**
 * Custom hook for handling CNIC input with formatting
 * Format: 12345-6789012-3
 */
const useCnicInput = (initialValue: string = '') => {
  const [value, setValue] = useState(initialValue);
  const [error, setError] = useState<string | null>(null);

  // Format CNIC as user types (12345-6789012-3)
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    
    // Remove all non-digit characters
    const digitsOnly = input.replace(/\D/g, '');
    
    // Limit to 13 digits
    const truncated = digitsOnly.slice(0, 13);
    
    // Format with hyphens
    let formatted = '';
    if (truncated.length > 0) {
      formatted = truncated.slice(0, 5);
      if (truncated.length > 5) {
        formatted += '-' + truncated.slice(5, 12);
        if (truncated.length > 12) {
          formatted += '-' + truncated.slice(12);
        }
      }
    }
    
    setValue(formatted);
    
    // Validate
    if (formatted.length > 0 && formatted.length < 15) {
      setError('CNIC must be 13 digits (xxxxx-xxxxxxx-x)');
    } else {
      setError(null);
    }
  }, []);

  // Get raw value (digits only)
  const getRawValue = useCallback(() => {
    return value.replace(/\D/g, '');
  }, [value]);

  // Check if CNIC is valid (13 digits)
  const isValid = useCallback(() => {
    return getRawValue().length === 13;
  }, [getRawValue]);

  return {
    value,
    setValue,
    error,
    setError,
    handleChange,
    getRawValue,
    isValid
  };
};

export default useCnicInput; 