import { NextRequest, NextResponse } from "next/server";

const SLACK_WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL;

interface ContactFormData {
  name: string;
  email: string;
  type: "general" | "support" | "feedback";
  message: string;
}

export async function POST(request: NextRequest) {
  try {
    if (!SLACK_WEBHOOK_URL) {
      console.error("SLACK_WEBHOOK_URL is not configured");
      return NextResponse.json(
        { error: "Contact form is not configured" },
        { status: 500 }
      );
    }

    const body: ContactFormData = await request.json();
    const { name, email, type, message } = body;

    // Validate required fields
    if (!name || !email || !type || !message) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    // Format the message type
    const typeLabels = {
      general: "General Inquiry",
      support: "Support Request",
      feedback: "Feedback",
    };

    // Create Slack message
    const slackMessage = {
      blocks: [
        {
          type: "header",
          text: {
            type: "plain_text",
            text: `📬 New ${typeLabels[type]}`,
            emoji: true,
          },
        },
        {
          type: "section",
          fields: [
            {
              type: "mrkdwn",
              text: `*Name:*\n${name}`,
            },
            {
              type: "mrkdwn",
              text: `*Email:*\n${email}`,
            },
          ],
        },
        {
          type: "section",
          fields: [
            {
              type: "mrkdwn",
              text: `*Type:*\n${typeLabels[type]}`,
            },
            {
              type: "mrkdwn",
              text: `*Date:*\n${new Date().toLocaleString("en-US", { timeZone: "UTC" })} UTC`,
            },
          ],
        },
        {
          type: "divider",
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `*Message:*\n${message}`,
          },
        },
      ],
    };

    // Send to Slack
    const slackResponse = await fetch(SLACK_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(slackMessage),
    });

    if (!slackResponse.ok) {
      console.error("Slack webhook failed:", await slackResponse.text());
      return NextResponse.json(
        { error: "Failed to send message" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
