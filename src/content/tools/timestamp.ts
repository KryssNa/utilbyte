import type { ToolArticleContent } from "@/components/shared/ToolArticle";

export const timestampArticle: ToolArticleContent = {
  intro: [
    "You have a number in a log line, a database column or an API response, and you need to know what moment it refers to. Or the reverse: a date that has to go into a query as an integer.",
    "This converts between Unix time, ISO 8601, UTC, your local format and a relative description. The mechanics are simple. What is worth a few minutes is the set of ways timestamps go wrong, because almost all of them are silent - you get a plausible date that is simply not the right one.",
  ],
  sections: [
    {
      heading: "Seconds or milliseconds",
      body: [
        "Unix time counts from midnight UTC on 1 January 1970. The ambiguity is the unit, and it catches everyone.",
        "Most backends, most log formats and most databases use seconds. JavaScript uses milliseconds, as do a good number of APIs written in it. The two differ by a factor of a thousand, and mixing them produces dates that are obviously wrong in one direction and subtly wrong in the other.",
        "The quick test is length. A current timestamp in seconds is ten digits. In milliseconds it is thirteen. If you feed a millisecond value into something expecting seconds you land tens of thousands of years in the future, which is at least loud. The other direction gives you a date in early 1970, which people sometimes mistake for a genuine null-ish default rather than a unit error.",
        "Some systems use microseconds - sixteen digits - and a few use nanoseconds. Count the digits before you assume.",
      ],
      bullets: [
        "10 digits - seconds. The common case.",
        "13 digits - milliseconds. JavaScript and JS-derived APIs.",
        "16 digits - microseconds. Some databases and tracing systems.",
        "A date in 1970 usually means milliseconds were read as seconds.",
      ],
    },
    {
      heading: "A Unix timestamp has no timezone, and that is the point",
      body: [
        "This is the thing most worth internalising. A Unix timestamp identifies a moment, full stop. It is not in UTC or in any other zone - zones are a display concern applied when you render it.",
        "So two people converting the same timestamp in Kathmandu and London see different wall-clock times, and both are correct. The timestamp did not change.",
        "The failure mode is code that formats a timestamp in the server's local zone, stores that string, and later parses it somewhere with a different zone. The number was unambiguous; the string was not. This is why the advice is always to store the timestamp and format at the edge.",
        "ISO 8601 is the format to use when you must pass a date around as text, because it carries the offset: the Z in 2026-08-25T09:30:00Z means UTC, and +05:45 means Nepal time. A date string with no offset is an invitation to a bug.",
      ],
    },
    {
      heading: "Offsets are not timezones",
      body: [
        "A timezone is a set of rules over history. An offset is one number at one moment. They get conflated constantly and the difference bites twice a year.",
        "Europe/London is a timezone. It is +00:00 in January and +01:00 in July. If you store the offset instead of the zone, you have recorded what was true when you wrote it and lost the ability to reason about any other date.",
        "This matters for anything scheduled in the future. A meeting at 9am London time on a date after the clocks change is not the same instant as the offset today would suggest. Recurring events, alarms and cron-like schedules need the zone name, not a fixed offset.",
        "Nepal is a decent illustration of why hardcoding is hopeless: the offset is +05:45. Not a whole hour, not even a half hour. India is +05:30, Chatham Islands +12:45, and several zones have changed their rules within the last decade.",
      ],
    },
    {
      heading: "The dates that mean something else",
      body: [
        "A few values turn up constantly in real data and are worth recognising on sight.",
        "0, which renders as 1 January 1970, is almost never a real date. It is an uninitialised field, a null coerced to a number, or a parse failure.",
        "Values around 2,147,483,647 - which is 19 January 2038 - are the 32-bit signed integer limit. Systems still storing time in a 32-bit integer overflow at that point. It is a real and unresolved problem in embedded and legacy systems, and a timestamp landing suspiciously close to that date usually means something clamped.",
        "Negative timestamps are valid and represent dates before 1970. Plenty of software rejects or mishandles them, which is why birth dates in older systems are so often stored as strings.",
        "And dates in the far future - the year 33658 is a favourite - are the signature of milliseconds parsed as seconds.",
      ],
    },
  ],
  example: {
    title: "The same instant, four ways",
    input: "Unix seconds:      1787638861\nUnix milliseconds: 1787638861000",
    output: "ISO 8601   2026-08-25T09:01:01Z\nUTC        Mon, 25 Aug 2026 09:01:01 GMT\nKathmandu  25 Aug 2026, 14:46:01 (+05:45)\nLondon     25 Aug 2026, 10:01:01 (+01:00, BST)\n\nThe same number read as milliseconds instead:\n  1787638861 ms -> 22 August 1970",
    note: "Four renderings, one moment - the timestamp itself carries no zone. And the last line is the unit error in miniature: a perfectly plausible-looking date in 1970 that is fifty-six years wrong. It does not throw, it does not warn, and it will sit in a report until somebody notices.",
  },
  limitations: [
    "Local formatting uses your browser's timezone and locale. Someone else opening the same conversion elsewhere sees different wall-clock text for the same instant.",
    "Timezone conversion here is display-only. For scheduling future events, store the zone name rather than an offset - offsets change when clocks do.",
    "Leap seconds are not represented. Unix time ignores them by definition, so it is not a true count of elapsed SI seconds since 1970.",
    "Very large or negative values may be handled inconsistently by the browser's date implementation at the extremes.",
    "No parsing of arbitrary human-written date strings. Ambiguous formats like 03/04/2026 cannot be disambiguated without knowing the convention in use.",
  ],
};
