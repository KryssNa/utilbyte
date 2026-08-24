"use client";

import { Clock, HelpCircle, Loader2, Mail, MessageSquare, Send } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const faqs = [
  {
    question: "Are all tools really free?",
    answer: "Yes, all UtilByte tools are completely free to use with no hidden fees, subscriptions, or premium tiers. We believe essential utilities should be accessible to everyone.",
  },
  {
    question: "Is my data safe?",
    answer: "Absolutely. All file processing happens directly in your browser. Your files never leave your device or get uploaded to our servers. This ensures maximum privacy and security.",
  },
  {
    question: "Do I need to create an account?",
    answer: "No, you don't need to sign up or create an account to use any of our tools. Just visit the tool page and start using it immediately.",
  },
  {
    question: "Can I use these tools offline?",
    answer: "Once a tool page is loaded, many of our tools work offline since all processing happens in your browser. However, you'll need an internet connection to initially load the page.",
  },
  {
    question: "How can I report a bug?",
    answer: "Use the contact form above with 'Support' selected as the inquiry type. Include details about the issue, what tool you were using, and your browser.",
  },
  {
    question: "Can I request a new tool?",
    answer: "We love hearing from users! Use the contact form with 'Feedback' selected to send your tool suggestions.",
  },
];

type InquiryType = "general" | "support" | "feedback";

interface FormState {
  name: string;
  email: string;
  type: InquiryType;
  message: string;
}

export default function ContactPage() {
  const [formData, setFormData] = useState<FormState>({
    name: "",
    email: "",
    type: "general",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");
    setErrorMessage("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitStatus("success");
        setFormData({ name: "", email: "", type: "general", message: "" });
      } else {
        const data = await response.json();
        setErrorMessage(data.error || "Failed to send message");
        setSubmitStatus("error");
      }
    } catch {
      setErrorMessage("Network error. Please try again.");
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-gradient-to-b from-transparent to-violet-50/30 dark:to-violet-950/10">
        <div className="container mx-auto px-4 py-16 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center gap-3 rounded-full bg-violet-500/10 border border-violet-500/20 px-4 py-2 text-sm font-medium text-violet-600 dark:text-violet-400 mb-6">
              <Send className="h-4 w-4" />
              Get In Touch
            </div>
            <h1 className="font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              Contact Us
            </h1>
            <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
              Have a question, feedback, or need help? We're here to assist you.
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-16 lg:px-8">
        <div className="mx-auto max-w-4xl">
          {/* Contact Form */}
          <section className="mb-16">
            <h2 className="flex items-center gap-3 font-display text-2xl font-bold tracking-tight text-foreground mb-6">
              <Mail className="h-6 w-6 text-violet-500" />
              Send Us a Message
            </h2>

            {submitStatus === "success" ? (
              <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-xl p-8 text-center">
                <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-emerald-100 dark:bg-emerald-900 mb-4">
                  <MessageSquare className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h3 className="font-semibold text-xl text-emerald-800 dark:text-emerald-200 mb-2">
                  Message Sent!
                </h3>
                <p className="text-emerald-700 dark:text-emerald-300 mb-6">
                  Thank you for reaching out. We'll get back to you within 24-48 hours.
                </p>
                <button
                  onClick={() => setSubmitStatus("idle")}
                  className="text-sm font-medium text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  {/* Name */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                      Your Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-colors"
                      placeholder="John Doe"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-colors"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                {/* Inquiry Type */}
                <div>
                  <label htmlFor="type" className="block text-sm font-medium text-foreground mb-2">
                    Inquiry Type
                  </label>
                  <select
                    id="type"
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-colors"
                  >
                    <option value="general">General Inquiry</option>
                    <option value="support">Support / Bug Report</option>
                    <option value="feedback">Feedback / Feature Request</option>
                  </select>
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-colors resize-none"
                    placeholder="How can we help you?"
                  />
                </div>

                {/* Error Message */}
                {submitStatus === "error" && (
                  <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg p-4 text-red-700 dark:text-red-300 text-sm">
                    {errorMessage}
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-violet-600 hover:bg-violet-700 disabled:bg-violet-400 text-white px-6 py-3 font-medium transition-colors w-full md:w-auto"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="h-5 w-5" />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            )}
          </section>

          {/* Response Time */}
          <section className="mb-16">
            <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <Clock className="h-6 w-6 text-amber-600 dark:text-amber-400 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-amber-800 dark:text-amber-200 mb-2">
                    Response Time
                  </h3>
                  <p className="text-amber-700 dark:text-amber-300">
                    We aim to respond to all inquiries within <strong>24-48 hours</strong> during business days.
                    For urgent issues, please include "URGENT" in your message.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* FAQs */}
          <section className="mb-16">
            <h2 className="flex items-center gap-3 font-display text-2xl font-bold tracking-tight text-foreground mb-6">
              <HelpCircle className="h-6 w-6 text-violet-500" />
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="p-6 rounded-xl bg-gradient-to-br from-violet-50/50 to-fuchsia-50/50 dark:from-violet-950/20 dark:to-fuchsia-950/20 border border-violet-100 dark:border-violet-900"
                >
                  <h3 className="font-semibold text-foreground mb-2">{faq.question}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Back to Home CTA */}
          <section>
            <div className="bg-gradient-to-br from-violet-500/10 to-fuchsia-500/10 border border-violet-200 dark:border-violet-800 rounded-xl p-8 text-center">
              <h2 className="font-display text-2xl font-bold tracking-tight text-foreground mb-4">
                Ready to Get Started?
              </h2>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Explore our collection of free, privacy-first tools designed to help you work more efficiently.
              </p>
              <Link
                href="/"
                className="inline-flex items-center gap-2 rounded-full bg-violet-600 hover:bg-violet-700 text-white px-6 py-3 font-medium transition-colors"
              >
                Explore Tools
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
