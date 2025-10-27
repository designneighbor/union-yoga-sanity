import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { writeClient } from "@/sanity/lib/writeClient";

const resend = new Resend(process.env.RESEND_API_KEY);

interface FormField {
  name: string;
  label: string;
  fieldType: "text" | "email" | "tel" | "textarea" | "radio" | "select";
  required: boolean;
  options?: Array<{
    label: string | null;
    value: string | null;
  }> | null;
}

interface FormSubmission {
  formId: string;
  formName: string;
  fields: FormField[];
  recipientEmail: string;
  formData: Record<string, string>;
}

export async function POST(request: NextRequest) {
  try {
    // Check if Resend API key is configured
    if (!process.env.RESEND_API_KEY) {
      console.error("RESEND_API_KEY is not configured");
      return NextResponse.json(
        { error: "Email service not configured" },
        { status: 500 }
      );
    }

    const body: FormSubmission = await request.json();
    const { formId, formName, fields, recipientEmail, formData } = body;

    // Validate required fields
    if (!formId || !formName || !fields || !recipientEmail || !formData) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate and sanitize recipient email
    
    // Log the original email for debugging
    console.log("Original recipient email:", recipientEmail);
    console.log("Email type:", typeof recipientEmail);
    console.log("Email length:", recipientEmail?.length);
    
    if (!recipientEmail || typeof recipientEmail !== 'string') {
      return NextResponse.json(
        { error: "Recipient email is required and must be a string" },
        { status: 400 }
      );
    }

    // More aggressive sanitization for Resend compatibility
    const sanitizedRecipientEmail = recipientEmail
      .toLowerCase()
      .trim()
      .replace(/[^\x00-\x7F]/g, "") // Remove non-ASCII characters
      .replace(/[^a-zA-Z0-9@._-]/g, "") // Remove any remaining special characters except @ . _ -
      .replace(/\.{2,}/g, ".") // Replace multiple dots with single dot
      .replace(/@{2,}/g, "@") // Replace multiple @ with single @
      .replace(/^\.+|\.+$/g, "") // Remove leading/trailing dots
      .replace(/@\.|\.@/g, "@"); // Remove dots around @

    console.log("Sanitized recipient email:", sanitizedRecipientEmail);

    // Final validation with stricter regex
    const strictEmailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!strictEmailRegex.test(sanitizedRecipientEmail)) {
      return NextResponse.json(
        { 
          error: "Recipient email contains invalid characters", 
          details: {
            original: recipientEmail,
            sanitized: sanitizedRecipientEmail,
            message: "Email must contain only letters, numbers, dots, hyphens, underscores, and @ symbol"
          }
        },
        { status: 400 }
      );
    }

    // Validate form data against field requirements
    const validationErrors: string[] = [];

    for (const field of fields) {
      const value = formData[field.name];

      if (field.required && (!value || value.trim() === "")) {
        validationErrors.push(`${field.label} is required`);
        continue;
      }

      if (value && value.trim() !== "") {
        // Email validation
        if (field.fieldType === "email") {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(value)) {
            validationErrors.push(
              `${field.label} must be a valid email address`
            );
          }
        }

        // Phone validation (basic)
        if (field.fieldType === "tel") {
          const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
          if (!phoneRegex.test(value.replace(/[\s\-\(\)]/g, ""))) {
            validationErrors.push(
              `${field.label} must be a valid phone number`
            );
          }
        }
      }
    }

    if (validationErrors.length > 0) {
      return NextResponse.json(
        { error: "Validation failed", details: validationErrors },
        { status: 400 }
      );
    }

    // Create email content with proper escaping
    const sanitizeHtml = (str: string) => {
      return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')
        .replace(/[^\x00-\x7F]/g, ''); // Remove non-ASCII characters
    };

    const emailContent = `
      <h2>New Form Submission: ${sanitizeHtml(formName)}</h2>
      <p><strong>Form ID:</strong> ${sanitizeHtml(formId)}</p>
      <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
      
      <h3>Form Data:</h3>
      <ul>
        ${fields
          .map((field) => {
            const value = formData[field.name] || "Not provided";
            return `<li><strong>${sanitizeHtml(field.label)}:</strong> ${sanitizeHtml(value)}</li>`;
          })
          .join("")}
      </ul>
    `;

    // Send email using Resend
    console.log("Sending email to:", sanitizedRecipientEmail);
    console.log("Email subject:", `New ${formName} Submission`);
    
    const { data, error } = await resend.emails.send({
      from: "Union Yoga <no-reply@david-lewis.co>",
      to: [sanitizedRecipientEmail], // Use sanitized email
      subject: `New ${formName} Submission`,
      html: emailContent,
    });

    if (error) {
      console.error("Resend error:", error);
      console.error("Error details:", JSON.stringify(error, null, 2));

      // Handle specific Resend validation errors
      if (error.name === "validation_error") {
        return NextResponse.json(
          {
            error: "Email validation failed. Please check the recipient email address.",
            details: {
              recipientEmail: sanitizedRecipientEmail,
              resendError: error
            }
          },
          { status: 422 }
        );
      }

      return NextResponse.json(
        { 
          error: "Failed to send email",
          details: error
        },
        { status: 500 }
      );
    }

    console.log("Email sent successfully:", data);

    // Store submission in Sanity
    try {
      const submissionData = fields.map(field => ({
        fieldName: field.name,
        fieldLabel: field.label,
        value: formData[field.name] || "Not provided"
      }));

      const submission = await writeClient.create({
        _type: "formSubmission",
        form: {
          _type: "reference",
          _ref: formId
        },
        submittedAt: new Date().toISOString(),
        status: "unread",
        data: submissionData,
        ipAddress: request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown",
        userAgent: request.headers.get("user-agent") || "unknown"
      });

      console.log("Submission stored in Sanity:", submission._id);
    } catch (sanityError) {
      console.error("Failed to store submission in Sanity:", sanityError);
      // Continue with success response even if Sanity storage fails
    }

    return NextResponse.json(
      {
        success: true,
        message: "Form submitted successfully",
        emailId: data?.id,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Form submission error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
