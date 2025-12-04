import { useState, useCallback, useEffect } from 'react';
import { storage } from '@/lib/storage';
import { ValidationError } from '@/lib/validation';

interface UseFormStateOptions {
  initialData: Record<string, any>;
  storageKey?: string;
  onValidate?: (data: Record<string, any>) => ValidationError[];
}

export function useFormState({
  initialData,
  storageKey,
  onValidate,
}: UseFormStateOptions) {
  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isDirty, setIsDirty] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    if (storageKey) {
      const saved = storage.getItem(storageKey);
      if (saved) {
        setFormData(saved);
        setIsDirty(true);
      }
    }
  }, [storageKey]);

  // Save to localStorage whenever formData changes
  useEffect(() => {
    if (storageKey && isDirty) {
      storage.setItem(storageKey, formData);
    }
  }, [formData, storageKey, isDirty]);

  const handleInputChange = useCallback(
    (field: string, value: any) => {
      setFormData(prev => ({
        ...prev,
        [field]: value,
      }));
      setIsDirty(true);

      // Clear error for this field when user starts typing
      if (errors[field]) {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[field];
          return newErrors;
        });
      }
    },
    [errors]
  );

  const handleBlur = useCallback((field: string) => {
    setTouched(prev => ({
      ...prev,
      [field]: true,
    }));
  }, []);

  const validate = useCallback((): boolean => {
    if (!onValidate) return true;

    const validationErrors = onValidate(formData);
    const errorMap: Record<string, string> = {};

    validationErrors.forEach(error => {
      errorMap[error.field] = error.message;
    });

    setErrors(errorMap);
    return validationErrors.length === 0;
  }, [formData, onValidate]);

  const reset = useCallback(() => {
    setFormData(initialData);
    setErrors({});
    setTouched({});
    setIsDirty(false);
    if (storageKey) {
      storage.removeItem(storageKey);
    }
  }, [initialData, storageKey]);

  const setFieldError = useCallback((field: string, message: string) => {
    setErrors(prev => ({
      ...prev,
      [field]: message,
    }));
  }, []);

  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  return {
    formData,
    setFormData,
    errors,
    touched,
    isDirty,
    handleInputChange,
    handleBlur,
    validate,
    reset,
    setFieldError,
    clearErrors,
  };
}
