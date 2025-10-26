"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { PortableText } from "@portabletext/react";
import { Button } from "@/components/Button";

interface FormField {
  name: string | null;
  label: string | null;
  fieldType: "text" | "email" | "tel" | "textarea" | "radio" | "select" | null;
  required: boolean | null;
  options?: Array<{
    label: string | null;
    value: string | null;
  }> | null;
}

interface FormData {
  _id: string;
  name: string | null;
  title: string | null;
  text: any; // eslint-disable-line @typescript-eslint/no-explicit-any
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
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Early return if form data is incomplete
  if (
    !form.name ||
    !form.fields ||
    !form.submitButtonText ||
    !form.recipientEmail
  ) {
    return null;
  }

  const handleInputChange = (fieldName: string | null, value: string) => {
    if (!fieldName) return;
    setFormData((prev) => ({
      ...prev,
      [fieldName]: value,
    }));

    // Clear field error when user starts typing
    if (fieldErrors[fieldName]) {
      setFieldErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      });
    }
  };

  const validateForm = (): {
    fieldErrors: Record<string, string>;
    hasErrors: boolean;
  } => {
    const fieldErrors: Record<string, string> = {};
    let hasErrors = false;

    if (!form.fields) return { fieldErrors, hasErrors };

    form.fields.forEach((field) => {
      if (!field.name || !field.label || !field.fieldType) return;

      const value = formData[field.name] || "";

      if (field.required && (!value || value.trim() === "")) {
        fieldErrors[field.name] = `${field.label} is required`;
        hasErrors = true;
        return;
      }

      if (value && value.trim() !== "") {
        // Email validation
        if (field.fieldType === "email") {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(value)) {
            fieldErrors[field.name] =
              `${field.label} must be a valid email address`;
            hasErrors = true;
          }
        }

        // Phone validation (basic)
        if (field.fieldType === "tel") {
          const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
          if (!phoneRegex.test(value.replace(/[\s\-\(\)]/g, ""))) {
            fieldErrors[field.name] =
              `${field.label} must be a valid phone number`;
            hasErrors = true;
          }
        }
      }
    });

    return { fieldErrors, hasErrors };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { fieldErrors: newFieldErrors, hasErrors } = validateForm();
    setFieldErrors(newFieldErrors);

    if (hasErrors) {
      const errorMessages = Object.values(newFieldErrors);
      setErrorMessage(errorMessages.join(", "));
      setSubmitStatus("error");
      
      // Focus on first field with error
      const firstErrorField = Object.keys(newFieldErrors)[0];
      if (firstErrorField) {
        const errorElement = document.getElementById(firstErrorField);
        if (errorElement) {
          errorElement.focus();
        }
      }
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus("idle");
    setErrorMessage("");
    setFieldErrors({});

    try {
      const response = await fetch("/api/forms/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
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
        setSubmitStatus("success");
        setFormData({});
        setFieldErrors({});
      } else {
        setErrorMessage(
          result.error || "An error occurred while submitting the form"
        );
        setSubmitStatus("error");
      }
    } catch {
      setErrorMessage("An error occurred while submitting the form");
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderField = (field: FormField) => {
    if (!field.name || !field.label || !field.fieldType) return null;

    const commonProps = {
      id: field.name,
      name: field.name,
      value: formData[field.name] || "",
      onChange: (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      ) => handleInputChange(field.name!, e.target.value),
      required: field.required || false,
      className:
        "w-full px-4 py-3 border border-neutral-300 bg-white rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors",
      "aria-describedby": fieldErrors[field.name] 
        ? `${field.name}-error` 
        : field.required 
        ? `${field.name}-required` 
        : undefined,
      "aria-invalid": fieldErrors[field.name] ? true : false,
    };

    switch (field.fieldType) {
      case "textarea":
        return (
          <textarea
            {...commonProps}
            rows={4}
            className="w-full px-4 py-3 bg-white border border-neutral-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors resize-vertical"
          />
        );
      case "email":
        return <input {...commonProps} type="email" />;
      case "tel":
        return <input {...commonProps} type="tel" />;
      case "radio":
        return (
          <fieldset className="space-y-2">
            <legend className="sr-only">{field.label}</legend>
            {field.options?.map((option, index) => (
              <label 
                key={option.value} 
                className="flex items-center space-x-2 cursor-pointer"
                htmlFor={`${field.name}-${index}`}
              >
                <input
                  type="radio"
                  id={`${field.name}-${index}`}
                  name={field.name || ""}
                  value={option.value || ""}
                  checked={formData[field.name || ""] === option.value}
                  onChange={(e) =>
                    handleInputChange(field.name!, e.target.value)
                  }
                  required={field.required || false}
                  className="text-primary-600 focus:ring-primary-500"
                  aria-describedby={field.name && fieldErrors[field.name] ? `${field.name}-error` : undefined}
                />
                <span className="text-sm text-gray-700">{option.label}</span>
              </label>
            ))}
          </fieldset>
        );
      case "select":
        return (
          <div className="relative">
            <select
              id={field.name || ""}
              name={field.name || ""}
              value={formData[field.name || ""] || ""}
              onChange={(e) => handleInputChange(field.name!, e.target.value)}
              required={field.required || false}
              className="w-full px-4 py-3 pr-10 bg-white border border-neutral-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors appearance-none cursor-pointer"
              aria-describedby={field.name && fieldErrors[field.name] ? `${field.name}-error` : undefined}
            >
              <option value="">Select an option...</option>
              {field.options?.map((option) => (
                <option key={option.value} value={option.value || ""}>
                  {option.label}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none" aria-hidden="true">
              <ChevronDown
                strokeWidth={1.5}
                className="h-6 w-6 text-neutral-950"
              />
            </div>
          </div>
        );
      default:
        return <input {...commonProps} type="text" />;
    }
  };

  if (submitStatus === "success") {
    return (
      <div 
        className="max-w-2xl mx-auto p-8 bg-green-50 border border-green-200 rounded-lg"
        role="alert"
        aria-live="polite"
      >
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4" aria-hidden="true">
            <svg
              className="h-6 w-6 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-green-900 mb-2">
            Form Submitted Successfully!
          </h3>
          <p className="text-green-700">
            Thank you for your submission. We&apos;ll get back to you soon.
          </p>
        </div>
      </div>
    );
  }

  return (
    <section className="container px-4 sm:px-6 md:px-8 xl:px-10 py-12">
      <div className="bg-neutral-100 px-8 py-12 rounded-lg max-w-full mx-auto">
      <form 
        onSubmit={handleSubmit} 
        className="space-y-6 max-w-2xl mx-auto"
        aria-labelledby="form-title"
        noValidate
      >
        <div className="mb-8">
          <h2 id="form-title" className="text-5xl text-primary-950 mb-6">
            {form.title}
          </h2>
          {form.text && (
            <div className="text-lg text-neutral-900" role="complementary" aria-label="Form description">
              <PortableText value={form.text} />
            </div>
          )}
        </div>

        <div className="space-y-6">
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
                    <>
                      <span className="text-red-500 ml-1" aria-label="required">
                        *
                      </span>
                      <span id={`${field.name}-required`} className="sr-only">
                        (required)
                      </span>
                    </>
                  )}
                </label>
                {renderField(field)}
                {fieldErrors[field.name] && (
                  <p 
                    id={`${field.name}-error`}
                    className="text-sm text-red-600 mt-1"
                    role="alert"
                    aria-live="polite"
                  >
                    {fieldErrors[field.name]}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        {submitStatus === "error" && (
          <div 
            id="form-error"
            className="p-4 bg-red-50 border border-red-200 rounded-lg"
            role="alert"
            aria-live="assertive"
          >
            <div className="flex">
              <div className="flex-shrink-0" aria-hidden="true">
                <svg
                  className="h-5 w-5 text-red-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
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
            aria-describedby={submitStatus === "error" ? "form-error" : undefined}
          >
            {isSubmitting ? "Submitting..." : form.submitButtonText}
          </Button>
        </div>
      </form>
      </div>
    </section>
  );
}
