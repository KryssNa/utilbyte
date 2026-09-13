import type { ToolArticleContent } from "@/components/shared/ToolArticle";

export const cronParserArticle: ToolArticleContent = {
  intro: [
    "Cron expressions are five fields of numbers and asterisks that encode a schedule. They are compact, they are everywhere, and almost nobody can read one confidently at a glance.",
    "This translates an expression into plain language and shows the next times it will fire, so you can check a schedule before deploying it rather than after.",
  ],
  sections: [
    {
      heading: "The five fields, and the one that surprises people",
      body: [
        "In order: minute, hour, day of month, month, day of week. An asterisk means every value. A number means that value. Commas list several, a hyphen gives a range, and a slash gives a step.",
        "The surprise is what happens when you set both day of month and day of week. Intuitively that should mean the intersection - the 1st, but only if it is a Monday. Standard cron does the opposite: it fires on either. An expression specifying the 1st and Monday runs on every 1st and on every Monday.",
        "That is a genuine trap, it is standard behaviour rather than a bug, and it catches people writing schedules for month-start reports. If you want an intersection you have to check the condition inside your job.",
        "Day of week numbering is the other one. Sunday is 0 in most implementations, and 7 is often accepted as Sunday too. Some systems start the week at Monday. Check which one you are on before assuming.",
      ],
    },
    {
      heading: "Steps and the every-N misunderstanding",
      body: [
        "A step value means every N within the field's range, counting from the start of that range - not every N from now.",
        "So a step of 15 in the minute field fires at minutes 0, 15, 30 and 45 of every hour. It does not mean fifteen minutes after whatever time you deployed it.",
        "This matters most for intervals that do not divide evenly. A step of 7 in the minute field fires at 0, 7, 14, 21, 28, 35, 42, 49 and 56 - and then again at 0, which is only four minutes later. The interval is not uniform across the hour boundary, and if the job assumes a constant gap it will be wrong once an hour.",
        "For intervals that need to be genuinely uniform, use a value that divides 60 evenly, or schedule differently.",
      ],
      bullets: [
        "Steps count from the start of the field's range, not from now.",
        "Minute steps that do not divide 60 produce a short interval at the hour boundary.",
        "0 6 * * 1-5 - 06:00 on weekdays.",
        "*/15 * * * * - every quarter hour, on the quarter.",
        "0 0 1 * * - midnight on the first of each month.",
      ],
    },
    {
      heading: "Timezones and daylight saving",
      body: [
        "Cron runs in whatever timezone the machine or the scheduler is configured for, and this is where scheduled jobs quietly go wrong.",
        "Most servers run UTC. A job scheduled for 09:00 with a Nepal-based team in mind fires at 14:45 local, unless the scheduler is explicitly configured otherwise. Managed schedulers vary in whether they let you specify a zone at all.",
        "Daylight saving is worse, and it is why running jobs in UTC is the standard advice. When clocks go back, the hour between 1am and 2am happens twice, so a job scheduled in that window can run twice. When they go forward that hour does not exist, and the job does not run at all.",
        "So: schedule in UTC where you can, and if a job must run at a particular local time, use a scheduler that understands timezone names rather than fixed offsets.",
      ],
    },
    {
      heading: "The operational things worth deciding in advance",
      body: [
        "Cron fires on a schedule. It has no opinion about whether the previous run finished, so a job scheduled every five minutes that occasionally takes seven will overlap with itself. If that is a problem, the job needs its own lock.",
        "It also has no retry. A run that fails is simply a run that failed, and the next one happens on schedule regardless.",
        "And a job that produces no output and logs nothing fails silently forever. The most common cron incident is not a job that broke loudly - it is one that stopped working months ago and nobody noticed.",
      ],
    },
  ],
  example: {
    title: "An expression that does not mean what it looks like",
    input: "0 9 1 * 1",
    output: 'Reads as: "at 09:00 on the 1st of the month, AND on every Monday"\n\nNext runs:\n  Mon 31 Aug 2026, 09:00   (Monday)\n  Tue  1 Sep 2026, 09:00   (1st)\n  Mon  7 Sep 2026, 09:00   (Monday)\n  Mon 14 Sep 2026, 09:00   (Monday)\n\nNot: "the 1st, only when it is a Monday"',
    note: "The author almost certainly wanted a monthly report on the first working day. What they got is a job that runs roughly five times a month. The OR behaviour between day-of-month and day-of-week is standard, it is documented, and it still catches people - which is exactly why looking at the next few fire times before deploying is worth the ten seconds.",
  },
  limitations: [
    "Interpretation follows standard five-field cron. Implementations differ: some add a seconds field, some add a year, and Quartz-style expressions with ? and L are not the same syntax.",
    "Next-run times are computed in your browser's timezone. Your server almost certainly runs in a different one - usually UTC.",
    "Daylight saving transitions are not modelled. Around a clock change, a local-time schedule can run twice or not at all.",
    "It parses the expression, not the job. Whether the command works, or whether a run overlaps the previous one, is outside what any parser can tell you.",
    "Non-standard extensions like @reboot are scheduler-specific and not interpreted here.",
  ],
};
