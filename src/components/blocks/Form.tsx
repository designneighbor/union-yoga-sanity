'use client';

import { useState } from 'react';
import { Button } from '@/components/Button';

interface FormField {
  name: string | null;
  label: string | null;
  fieldType: 'text' | 'email' | 'tel' | 'textarea' | null;
  required: boolean | null;
  placeholder?: string | null;
}

interface FormData {
  _id: string;
  name: string | null;
  fields: FormField[] | null;
  submitButtonText: string | null;
  recipientEmail: string | null;
}

interface FormProps {
  form: FormData;
}

export function Form({ form }: FormProps) {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  // Early return if form data is incomplete
  if (!form.name || !form.fields || !form.submitButtonText || !form.recipientEmail) {
    return null;
  }

  const handleInputChange = (fieldName: string | null, value: string) => {
    if (!fieldName) return;
    setFormData(prev => ({
      ...prev,
      [fieldName]: value
    }));
  };

  const validateForm = (): string[] => {
    const errors: string[] = [];
    
    if (!form.fields) return errors;
    
    form.fields.forEach(field => {
      if (!field.name || !field.label || !field.fieldType) return;
      
      const value = formData[field.name] || '';
      
      if (field.required && (!value || value.trim() === '')) {
        errors.push(`${field.label} is required`);
        return;
      }
      
      if (value && value.trim() !== '') {
        // Email validation
        if (field.fieldType === 'email') {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(value)) {
            errors.push(`${field.label} must be a valid email address`);
          }
        }
        
        // Phone validation (basic)
        if (field.fieldType === 'tel') {
          const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
          if (!phoneRegex.test(value.replace(/[\s\-\(\)]/g, ''))) {
            errors.push(`${field.label} must be a valid phone number`);
          }
        }
      }
    });
    
    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      setErrorMessage(validationErrors.join(', '));
      setSubmitStatus('error');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    try {
      const response = await fetch('/api/forms/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          formId: form._id,
          formName: form.name,
          fields: form.fields,
          recipientEmail: form.recipientEmail,
          formData: formData,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({});
      } else {
        setErrorMessage(result.error || 'An error occurred while submitting the form');
        setSubmitStatus('error');
      }
    } catch {
      setErrorMessage('An error occurred while submitting the form');
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderField = (field: FormField) => {
    if (!field.name || !field.label || !field.fieldType) return null;
    
    const commonProps = {
      id: field.name,
      name: field.name,
      value: formData[field.name] || '',
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => 
        handleInputChange(field.name!, e.target.value),
      placeholder: field.placeholder || undefined,
      required: field.required || false,
      className: "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors",
      'aria-describedby': field.required ? `${field.name}-required` : undefined,
    };

    switch (field.fieldType) {
      case 'textarea':
        return (
          <textarea
            {...commonProps}
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors resize-vertical"
          />
        );
      case 'email':
        return <input {...commonProps} type="email" />;
      case 'tel':
        return <input {...commonProps} type="tel" />;
      default:
        return <input {...commonProps} type="text" />;
    }
  };

  if (submitStatus === 'success') {
    return (
      <div className="max-w-2xl mx-auto p-8 bg-green-50 border border-green-200 rounded-lg">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
            <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-green-900 mb-2">Form Submitted Successfully!</h3>
          <p className="text-green-700">Thank you for your submission. We&apos;ll get back to you soon.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{form.name}</h2>
        </div>

        {form.fields.map((field) => {
          if (!field.name || !field.label) return null;
          
          return (
            <div key={field.name} className="space-y-2">
              <label 
                htmlFor={field.name}
                className="block text-sm font-medium text-gray-700"
              >
                {field.label}
                {field.required && (
                  <span className="text-red-500 ml-1" aria-label="required">
                    *
                  </span>
                )}
              </label>
              {renderField(field)}
              {field.required && (
                <p id={`${field.name}-required`} className="text-sm text-gray-500">
                  This field is required
                </p>
              )}
            </div>
          );
        })}

        {submitStatus === 'error' && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <p className="text-sm text-red-700 mt-1">{errorMessage}</p>
              </div>
            </div>
          </div>
        )}

        <div className="pt-4">
          <Button
            type="submit"
            variant="primary"
            disabled={isSubmitting}
            className="w-full"
          >
            {isSubmitting ? 'Submitting...' : form.submitButtonText}
          </Button>
        </div>
      </form>
    </div>
  );
}
