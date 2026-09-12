import type { ToolArticleContent } from "@/components/shared/ToolArticle";

export const countdownArticle: ToolArticleContent = {
  intro: [
    "Set a duration in hours, minutes and seconds for a work session, exercise or short break. The timer runs in this browser tab, with controls to start, pause and reset it.",
    "Keep the tab open while using it. This is a convenient visual timer, not a precise alarm: browser scheduling, background throttling and device sleep can delay the countdown and its sound.",
  ],
  sections: [
    {
      heading: "Why the displayed time can drift",
      body: [
        "This implementation subtracts one second on each JavaScript interval callback. It does not recompute the time remaining from a saved deadline. If a callback arrives late, the countdown can fall behind real elapsed time.",
        "A busy page, a background tab or a sleeping device can delay callbacks. Returning to the tab does not automatically correct accumulated drift. For a fixed appointment or important deadline, use a device alarm as well.",
      ],
    },
    {
      heading: "Choose a manageable work interval",
      body: [
        "A short countdown can give a task a clear boundary. Choose a duration that suits the work, start the timer, and use Pause if you want to stop counting during an interruption.",
        "The page accepts a duration rather than a date and timezone. If you are tracking a scheduled event, calculate the interval separately and leave enough margin for timer drift.",
      ],
    },
    {
      heading: "Sound and background behavior",
      body: [
        "Enable the sound option if you want an audio cue when the counter reaches zero. Browser audio permissions, muted tabs and device volume can prevent you from hearing it.",
        "The tool does not deliver a system push notification or continue after the tab closes. Closing or refreshing loses the timer state.",
      ],
    },
  ],
  example: {
    title: "A focused work interval",
    input: "Hours: 0\nMinutes: 25\nSeconds: 0\nSound: enabled",
    output: "Start the timer and keep the tab open.\nPause during an interruption if needed.\nAn audio cue is attempted when the counter reaches zero.",
    note: "This describes the intended interaction, not a timing benchmark. Browser throttling or device sleep can extend the real elapsed duration.",
  },
  limitations: [
    "Interval-based counting can drift; there is no deadline-based correction.",
    "Background throttling and device sleep can delay counting and completion.",
    "Sound depends on browser permissions and device settings. No system notification is sent.",
    "The tool accepts a duration, not an absolute date or timezone.",
    "Refreshing or closing the tab loses the timer state.",
  ],
};
