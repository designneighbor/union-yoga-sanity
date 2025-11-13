"use client";

import { useState } from "react";
import { Button } from "@/components/Button";

interface NewsletterSubscribeProps {
  className?: string;
  placeholder?: string;
  buttonText?: string;
  successMessage?: string;
}

export function NewsletterSubscribe({
  className = "",
  placeholder = "Enter your email",
  buttonText = "Subscribe",
  successMessage = "Please check your email to confirm your subscription!",
}: NewsletterSubscribeProps) {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus("idle");
    setMessage("");

    try {
      const response = await fetch("/api/newsletters/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();

      if (response.ok) {
        setStatus("success");
        setMessage(successMessage);
        setEmail("");
      } else {
        setStatus("error");
        setMessage(result.error || "Something went wrong. Please try again.");
      }
    } catch (error) {
      setStatus("error");
      setMessage("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={className}>
      <div className="flex flex-col gap-4 sm:flex-row">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={placeholder}
          required
          disabled={isSubmitting}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        />
        <Button
          type="submit"
          disabled={isSubmitting}
          className="whitespace-nowrap"
        >
          {isSubmitting ? "Subscribing..." : buttonText}
        </Button>
      </div>
      {message && (
        <p
          className={`mt-2 text-sm ${
            status === "success" ? "text-green-600" : "text-red-600"
          }`}
        >
          {message}
        </p>
      )}
    </form>
  );
}