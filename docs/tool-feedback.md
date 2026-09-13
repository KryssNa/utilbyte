# Tool feedback

Every tool page has a Feedback control in its top toolbar. It opens an inline comment form; it has no overlay, sign-in, required email, or restriction on using the tool. Closing the form retains the comment while that tool page stays mounted. Comments are not written to browser storage.

## Setup

Reuse `SLACK_WEBHOOK_URL`, the same server-only setting used by `/api/contact`. No new integration, database, or migration is required. The existing contact form is unchanged.

`POST /api/feedback` accepts a catalog tool ID and a comment of up to 2,000 characters. Slack receives the comment, the tool's catalog title, and its canonical public URL. Tool inputs, files, arbitrary page URLs, and browser details are not included. Comments use Slack plain-text blocks to avoid mention injection.

A honeypot and a best-effort five-submission/five-minute limit per sender per server instance reduce spam. This in-memory limit is not shared across instances and resets on restart. Sender keys expire after five minutes and are never forwarded to Slack. Stronger distributed limits can be added separately if traffic requires them.

Failed delivery retains the comment for retry. The server times out after ten seconds; the client stops waiting after fifteen. Missing configuration returns an unavailable response instead of claiming success.

## Verification

Mocked-webhook tests cover the outgoing payload, invalid input, the spam trap, rate limiting, missing configuration and Slack failures. UI tests verify that working in the tool continues during submission, focus is not stolen, and failed comments remain available. No test comments were sent to the real Slack channel.
