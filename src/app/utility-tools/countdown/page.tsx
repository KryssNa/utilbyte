import { createToolMetadata } from "@/lib/tool-metadata";
import CountdownTimer from "@/components/tools/utility/CountdownTimer";

export const metadata = createToolMetadata("/utility-tools/countdown", {
  title: "Countdown Timer Online Free - Productivity Timer with Sound Alerts",
  description: "Create a countdown to a chosen date and time in your browser. View the remaining days, hours, minutes and seconds while the page is open.",
  keywords: [
    "countdown timer online free",
    "productivity timer online",
    "pomodoro timer online",
    "focus timer with sound",
    "meeting countdown timer",
    "study timer online",
    "kitchen timer online",
    "timer app web",
    "online stopwatch",
    "productivity tool online",
    "focus session timer",
    "time management tool"
  ],
});

export default function CountdownTimerPage() {
  return (
    <CountdownTimer />

  );
}
