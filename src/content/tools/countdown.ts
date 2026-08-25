import type { ToolArticleContent } from "@/components/shared/ToolArticle";

export const countdownArticle: ToolArticleContent = {
  intro: [
    "A countdown is a deadline you can see. An exam, a launch, a flight, a submission window closing, the end of a focused work block. Having the remaining time on screen changes how you treat it in a way that knowing the date does not.",
    "This one runs in the page, needs no account, and keeps counting while the tab is open. What follows is mostly about the things that make browser timers behave in ways people find surprising, because knowing them saves you trusting a number you should not.",
  ],
  sections: [
    {
      heading: "Why a browser timer drifts, and why this one does not",
      body: [
        "The naive way to build a countdown is to subtract one second every thousand milliseconds. It is also wrong, and visibly so after a few minutes.",
        "Browsers do not guarantee that a scheduled callback fires exactly on time. It fires when the main thread is free, so every busy moment - a repaint, a fetch resolving, another tab thrashing the CPU - pushes it late. Those delays accumulate in one direction only, because a timer can run late but never early. A naive counter loses seconds steadily and ends up minutes adrift over a long countdown.",
        "The fix is to store the target moment and recompute the remaining time from the current clock on every tick. Then a late tick corrects itself immediately: the display might stutter, but it is never wrong. That is how this is built, which is why leaving it running for hours does not accumulate error.",
        "There is a second reason it matters. Browsers deliberately throttle timers in background tabs, often to once a minute, to save battery. A subtracting counter effectively stops. A recomputing one shows the correct value the instant you switch back.",
      ],
    },
    {
      heading: "The timezone question, which is usually the real bug",
      body: [
        "A countdown to a date is a countdown to a specific moment, and a date without a timezone does not identify one.",
        "If a portal closes at midnight, midnight where? An exam registration that closes at 23:59 on the 31st closes at a particular instant, and if you are in a different zone from the organisation running it, that instant is not 23:59 on your clock. People miss deadlines this way every year.",
        "The rule that saves you: find out the deadline's timezone, convert it to your own, and count down to that. If the deadline is stated as UTC and you are in Nepal, add 5 hours 45 minutes to get your local time.",
        "Daylight saving adds a wrinkle for anything more than a few weeks out. If the deadline is in a zone that changes its clocks between now and then, the offset today is not the offset on the day. Working from the zone rather than a fixed offset is the only reliable approach.",
      ],
      bullets: [
        "Establish the deadline's timezone before setting anything.",
        "Convert to your own local time, then count down to that.",
        "For distant dates, check whether either zone changes its clocks in between.",
        "When in doubt, set your personal deadline earlier. Nothing is lost by being early.",
      ],
    },
    {
      heading: "What a visible countdown is actually good for",
      body: [
        "There is a real behavioural effect and it is worth using deliberately.",
        "A date is abstract. Eleven days is a fact you can dismiss. A number visibly decreasing is a present-tense thing, and it makes the deadline feel like something happening now rather than something happening later. That is precisely why retailers put them on checkout pages, and it works on you regardless of whether you know why.",
        "Turned on yourself it is genuinely useful: a countdown to a submission deadline on a second monitor is a persistent, unignorable reminder that does not require you to check anything.",
        "The shorter form works too. A countdown to the end of a fixed work block - twenty-five minutes, fifty, whatever suits you - creates a boundary that makes starting easier, because you are committing to a bounded amount of time rather than to finishing.",
        "The failure mode is worth naming: a countdown to something you cannot influence is just a source of anxiety. Count down to things you are working towards, not to things you are waiting for.",
      ],
    },
    {
      heading: "Its actual limits as a tool",
      body: [
        "This is a page in a browser tab, not an alarm clock, and the distinction matters if anything important depends on it.",
        "Close the tab and the countdown is gone. There is no notification, nothing runs in the background, and nothing persists.",
        "If you genuinely must not miss something, set a phone alarm as well. A phone alarm survives a closed laptop, a browser crash and a flat battery followed by a recharge. Use the on-screen countdown for awareness and something with an operating system behind it for the actual guarantee.",
      ],
    },
  ],
  example: {
    title: "A deadline stated in UTC, counted down from Kathmandu",
    input: "Portal closes: 31 Aug 2026, 23:59 UTC\nYou are in Kathmandu, UTC+05:45\nNow: 25 Aug 2026, 14:46 local",
    output: "Deadline in local time: 1 Sep 2026, 05:44\nRemaining: 6 days, 14 hours, 58 minutes\n\nThe mistake to avoid:\n  counting down to 31 Aug 23:59 LOCAL\n  = 5 h 45 m early, and on the wrong day",
    note: "The deadline falls on 1 September in Kathmandu even though it is stated as 31 August. Anyone who set a reminder for the 31st local would be fine here, since they would be early - but reverse the direction and the same reasoning makes you late. Convert first, always, and set your own deadline a comfortable margin before the real one.",
  },
  limitations: [
    "It runs only while the tab is open. Closing it loses the countdown entirely.",
    "No notifications, no alarm, nothing in the background. For anything that genuinely matters, set a phone alarm too.",
    "Background tabs are throttled by the browser, so the display may not update while hidden. It corrects itself the moment you return, because the remaining time is recomputed rather than decremented.",
    "The target is interpreted in your browser's local timezone. If the deadline was published in another zone, convert it yourself first.",
    "Nothing is saved. Reopening the page means setting it up again.",
  ],
};
