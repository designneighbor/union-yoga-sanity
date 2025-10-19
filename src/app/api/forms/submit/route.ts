import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface FormField {
  name: string;
  label: string;
  fieldType: 'text' | 'email' | 'tel' | 'textarea';
  required: boolean;
  placeholder?: string;
}

interface FormSubmission {
  formId: string;
  formName: string;
  fields: FormField[];
  submitButtonText: string;
  recipientEmail: string;
  formData: Record<string, string>;
}

export async function POST(request: NextRequest) {
  try {
    const body: FormSubmission = await request.json();
    const { formId, formName, fields, submitButtonText, recipientEmail, formData } = body;

    // Validate required fields
    if (!formId || !formName || !fields || !recipientEmail || !formData) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate form data against field requirements
    const validationErrors: string[] = [];
    
    for (const field of fields) {
      const value = formData[field.name];
      
      if (field.required && (!value || value.trim() === '')) {
        validationErrors.push(`${field.label} is required`);
        continue;
      }
      
      if (value && value.trim() !== '') {
        // Email validation
        if (field.fieldType === 'email') {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(value)) {
            validationErrors.push(`${field.label} must be a valid email address`);
          }
        }
        
        // Phone validation (basic)
        if (field.fieldType === 'tel') {
          const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
          if (!phoneRegex.test(value.replace(/[\s\-\(\)]/g, ''))) {
            validationErrors.push(`${field.label} must be a valid phone number`);
          }
        }
      }
    }

    if (validationErrors.length > 0) {
      return NextResponse.json(
        { error: 'Validation failed', details: validationErrors },
        { status: 400 }
      );
    }

    // Create email content
    const emailContent = `
      <h2>New Form Submission: ${formName}</h2>
      <p><strong>Form ID:</strong> ${formId}</p>
      <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
      
      <h3>Form Data:</h3>
      <ul>
        ${fields.map(field => {
          const value = formData[field.name] || 'Not provided';
          return `<li><strong>${field.label}:</strong> ${value}</li>`;
        }).join('')}
      </ul>
    `;

    // Send email using Resend
    const { data, error } = await resend.emails.send({
      from: 'Union Yoga <noreply@unionyoga.com>',
      to: [recipientEmail],
      subject: `New ${formName} Submission`,
      html: emailContent,
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json(
        { error: 'Failed to send email' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { 
        success: true, 
        message: 'Form submitted successfully',
        emailId: data?.id 
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Form submission error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
