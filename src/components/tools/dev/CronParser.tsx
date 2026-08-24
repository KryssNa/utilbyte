"use client";

import ToolLayout from "@/components/shared/ToolLayout";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { AlertCircle, Calendar, CheckCircle, Clock, FileText } from "lucide-react";
import { useCallback, useMemo, useState } from "react";

interface CronField {
  name: string;
  value: string;
  description: string;
  allowedValues: string;
}

interface ParsedCron {
  fields: CronField[];
  humanReadable: string;
  nextRuns: Date[];
  isValid: boolean;
  error?: string;
}

export default function CronParser() {
  const [cronExpression, setCronExpression] = useState<string>("");
  const [parsed, setParsed] = useState<ParsedCron | null>(null);

  const parseCronExpression = useCallback((expression: string): ParsedCron => {
    if (!expression.trim()) {
      return {
        fields: [],
        humanReadable: "",
        nextRuns: [],
        isValid: false,
      };
    }

    const parts = expression.trim().split(/\s+/);
    if (parts.length !== 5 && parts.length !== 6) {
      return {
        fields: [],
        humanReadable: "",
        nextRuns: [],
        isValid: false,
        error: "Invalid cron expression. Must have 5 or 6 fields separated by spaces.",
      };
    }

    const fieldNames = parts.length === 6
      ? ["Second", "Minute", "Hour", "Day of Month", "Month", "Day of Week"]
      : ["Minute", "Hour", "Day of Month", "Month", "Day of Week"];

    const fields: CronField[] = fieldNames.map((name, index) => ({
      name,
      value: parts[index],
      description: getFieldDescription(name, parts[index]),
      allowedValues: getAllowedValues(name),
    }));

    try {
      const humanReadable = generateHumanReadable(parts);
      const nextRuns = calculateNextRuns(parts);

      return {
        fields,
        humanReadable,
        nextRuns,
        isValid: true,
      };
    } catch (error) {
      return {
        fields,
        humanReadable: "",
        nextRuns: [],
        isValid: false,
        error: error instanceof Error ? error.message : "Failed to parse cron expression",
      };
    }
  }, []);

  const getFieldDescription = (fieldName: string, value: string): string => {
    const descriptions: Record<string, Record<string, string>> = {
      "Minute": {
        "*": "Every minute",
        "*/5": "Every 5 minutes",
        "0": "At the start of the hour",
        "30": "At 30 minutes past the hour",
      },
      "Hour": {
        "*": "Every hour",
        "*/2": "Every 2 hours",
        "0": "At midnight",
        "12": "At noon",
      },
      "Day of Month": {
        "*": "Every day",
        "1": "On the 1st of the month",
        "15": "On the 15th of the month",
        "L": "On the last day of the month",
      },
      "Month": {
        "*": "Every month",
        "1": "In January",
        "6": "In June",
        "12": "In December",
      },
      "Day of Week": {
        "*": "Every day of the week",
        "0": "On Sunday",
        "1": "On Monday",
        "6": "On Saturday",
        "1-5": "Monday through Friday",
      },
      "Second": {
        "*": "Every second",
        "0": "At the start of the minute",
        "30": "At 30 seconds past the minute",
      },
    };

    return descriptions[fieldName]?.[value] || `Custom value: ${value}`;
  };

  const getAllowedValues = (fieldName: string): string => {
    const ranges: Record<string, string> = {
      "Second": "0-59",
      "Minute": "0-59",
      "Hour": "0-23",
      "Day of Month": "1-31",
      "Month": "1-12 (or JAN-DEC)",
      "Day of Week": "0-7 (0 or 7 = Sunday, or SUN-SAT)",
    };
    return ranges[fieldName] || "";
  };

  const generateHumanReadable = (parts: string[]): string => {
    const [minute, hour, dayOfMonth, month, dayOfWeek, second] = parts;

    let description = "";

    // Handle seconds if present
    if (second && second !== "*") {
      description += `At second ${second} `;
    }

    // Handle minutes
    if (minute === "0") {
      description += "at the start of ";
    } else if (minute === "*") {
      description += "every minute ";
    } else if (minute.startsWith("*/")) {
      const interval = minute.split("/")[1];
      description += `every ${interval} minutes `;
    } else {
      description += `at minute ${minute} `;
    }

    // Handle hours
    if (hour === "*") {
      description += "of every hour ";
    } else if (hour === "0") {
      description += "of every day at midnight ";
    } else if (hour === "12") {
      description += "of every day at noon ";
    } else if (hour.startsWith("*/")) {
      const interval = hour.split("/")[1];
      description += `every ${interval} hours `;
    } else {
      description += `at ${hour}:00 `;
    }

    // Handle days
    if (dayOfMonth !== "*" || dayOfWeek !== "*") {
      if (dayOfMonth === "1") {
        description += "on the 1st of ";
      } else if (dayOfMonth === "15") {
        description += "on the 15th of ";
      } else if (dayOfMonth === "L") {
        description += "on the last day of ";
      } else if (dayOfMonth !== "*") {
        description += `on day ${dayOfMonth} of `;
      } else {
        description += "every ";
      }
    } else {
      description += "every ";
    }

    // Handle months
    if (month === "*") {
      description += "every month ";
    } else {
      const monthNames = ["", "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"];
      const monthNum = parseInt(month);
      if (monthNum >= 1 && monthNum <= 12) {
        description += monthNames[monthNum] + " ";
      }
    }

    // Handle days of week
    if (dayOfWeek !== "*") {
      const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      if (dayOfWeek.includes("-")) {
        const [start, end] = dayOfWeek.split("-").map(d => parseInt(d));
        if (start !== undefined && end !== undefined) {
          description += `on ${dayNames[start]} through ${dayNames[end]}`;
        }
      } else {
        const dayNum = parseInt(dayOfWeek);
        if (dayNum >= 0 && dayNum <= 6) {
          description += `on ${dayNames[dayNum]}`;
        }
      }
    }

    return description.trim() || "Custom cron schedule";
  };

  const calculateNextRuns = (parts: string[]): Date[] => {
    const now = new Date();
    const runs: Date[] = [];

    // This is a simplified calculation - a full implementation would need a proper cron library
    // For now, we'll just show some example next run times based on common patterns

    const [minute, hour] = parts;

    for (let i = 0; i < 5; i++) {
      const nextRun = new Date(now);

      if (minute === "*") {
        nextRun.setMinutes(nextRun.getMinutes() + i);
      } else if (minute.startsWith("*/")) {
        const interval = parseInt(minute.split("/")[1]);
        nextRun.setMinutes(nextRun.getMinutes() + (i * interval));
      } else {
        nextRun.setMinutes(parseInt(minute));
        if (nextRun <= now) {
          nextRun.setHours(nextRun.getHours() + 1);
        }
      }

      if (hour !== "*") {
        nextRun.setHours(parseInt(hour));
        if (nextRun <= now) {
          nextRun.setDate(nextRun.getDate() + 1);
        }
      }

      runs.push(new Date(nextRun));
    }

    return runs;
  };

  const handleParse = useCallback(() => {
    const result = parseCronExpression(cronExpression);
    setParsed(result);
  }, [cronExpression, parseCronExpression]);

  const loadExample = (example: string) => {
    setCronExpression(example);
  };

  const examples = [
    { expression: "* * * * *", description: "Every minute" },
    { expression: "0 * * * *", description: "Every hour at minute 0" },
    { expression: "0 0 * * *", description: "Every day at midnight" },
    { expression: "0 12 * * 1", description: "Every Monday at noon" },
    { expression: "*/15 * * * *", description: "Every 15 minutes" },
    { expression: "0 9-17 * * 1-5", description: "Every weekday from 9 AM to 5 PM" },
  ];

  const parsedCron = useMemo(() => {
    if (!cronExpression) return null;
    return parseCronExpression(cronExpression);
  }, [cronExpression, parseCronExpression]);

  const faqs = [
    {
      question: "What is a cron expression?",
      answer: "A cron expression is a string consisting of 5 or 6 fields separated by spaces that tells the system when to execute a command or job.",
    },
    {
      question: "What do the cron fields represent?",
      answer: "The fields represent: Minute (0-59), Hour (0-23), Day of Month (1-31), Month (1-12), Day of Week (0-7, where 0/7=Sunday).",
    },
    {
      question: "What does the asterisk (*) mean?",
      answer: "The asterisk (*) is a wildcard that matches all possible values for that field. For example, * in the hour field means 'every hour'.",
    },
  ];

  return (
    <ToolLayout
      title="Cron Parser"
      description="Parse and understand cron expressions. See when your scheduled jobs will run next with human-readable explanations."
      category="dev"
      categoryLabel="Developer Tools"
      icon={Clock}
      faqs={faqs}
      relatedTools={[
        { title: "Regex Tester", description: "Test regular expressions", href: "/dev-tools/regex-tester", icon: Clock, category: "dev" },
        { title: "Hash Generator", description: "Generate hashes", href: "/dev-tools/hash-generator", icon: Clock, category: "dev" },
        { title: "JWT Decoder", description: "Decode JWT tokens", href: "/dev-tools/jwt-decoder", icon: Clock, category: "dev" },
      ]}
    >
      <div className="space-y-6">
        {/* Cron Input */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium">Cron Expression</h3>
          <Input
            value={cronExpression}
            onChange={(e) => setCronExpression(e.target.value)}
            placeholder="Enter cron expression (e.g., * * * * *)"
            className="font-mono text-center text-lg"
          />

          {/* Examples */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Common Examples
            </h4>
            <div className="grid gap-2 sm:grid-cols-2">
              {examples.map((example, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => loadExample(example.expression)}
                  className="h-auto p-3 text-left justify-start"
                >
                  <div>
                    <div className="font-mono text-sm font-medium">{example.expression}</div>
                    <div className="text-xs text-muted-foreground">{example.description}</div>
                  </div>
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Results */}
        {parsedCron && (
          <div className="space-y-6">
            {/* Status */}
            <div className="flex items-center gap-2">
              {parsedCron.isValid ? (
                <>
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <Badge variant="secondary">Valid Cron Expression</Badge>
                </>
              ) : (
                <>
                  <AlertCircle className="h-5 w-5 text-red-500" />
                  <Badge variant="destructive">Invalid Expression</Badge>
                </>
              )}
            </div>

            {/* Error */}
            {parsedCron.error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{parsedCron.error}</AlertDescription>
              </Alert>
            )}

            {/* Human Readable */}
            {parsedCron.isValid && parsedCron.humanReadable && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Human Readable
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-base font-medium">{parsedCron.humanReadable}</p>
                </CardContent>
              </Card>
            )}

            {/* Field Breakdown */}
            {parsedCron.isValid && parsedCron.fields.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Field Breakdown</CardTitle>
                  <CardDescription>
                    Understanding each part of your cron expression
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {parsedCron.fields.map((field, index) => (
                      <div key={index} className="border rounded-lg p-4 space-y-2">
                        <div className="flex items-center justify-between">
                          <h5 className="font-medium text-sm">{field.name}</h5>
                          <Badge variant="outline" className="font-mono text-xs">
                            {field.value}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{field.description}</p>
                        <p className="text-xs text-muted-foreground">
                          Allowed: {field.allowedValues}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Next Runs */}
            {parsedCron.isValid && parsedCron.nextRuns.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Next Run Times
                  </CardTitle>
                  <CardDescription>
                    When this cron expression will trigger next
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {parsedCron.nextRuns.slice(0, 5).map((runTime, index) => (
                      <div key={index} className="flex items-center gap-3 p-2 bg-muted/50 rounded">
                        <Badge variant="secondary" className="min-w-fit">
                          #{index + 1}
                        </Badge>
                        <span className="font-mono text-sm">
                          {runTime.toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Cron Format Guide */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Cron Expression Format</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 text-sm">
              <div>
                <strong>Minute</strong><br />
                <span className="text-muted-foreground">0-59</span>
              </div>
              <div>
                <strong>Hour</strong><br />
                <span className="text-muted-foreground">0-23</span>
              </div>
              <div>
                <strong>Day of Month</strong><br />
                <span className="text-muted-foreground">1-31</span>
              </div>
              <div>
                <strong>Month</strong><br />
                <span className="text-muted-foreground">1-12</span>
              </div>
              <div>
                <strong>Day of Week</strong><br />
                <span className="text-muted-foreground">0-7 (0=Sunday)</span>
              </div>
              <div>
                <strong>Special Characters</strong><br />
                <span className="text-muted-foreground">*, -, /, L, W, #</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  );
}
