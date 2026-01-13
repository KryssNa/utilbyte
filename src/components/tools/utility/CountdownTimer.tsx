"use client";

import ToolLayout from "@/components/shared/ToolLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Bell, BellOff, Pause, Play, RotateCcw, Timer } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

interface TimerPreset {
  name: string;
  duration: number; // in seconds
  description: string;
}

export default function CountdownTimer() {
  const [hours, setHours] = useState<string>("0");
  const [minutes, setMinutes] = useState<string>("5");
  const [seconds, setSeconds] = useState<string>("0");
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(300); // 5 minutes in seconds
  const [initialTime, setInitialTime] = useState<number>(300);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [hasFinished, setHasFinished] = useState<boolean>(false);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio
  useEffect(() => {
    if (typeof window !== 'undefined') {
      audioRef.current = new Audio('/notification.mp3');
      audioRef.current.volume = 0.5;
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const playNotification = useCallback(() => {
    if (soundEnabled && audioRef.current) {
      audioRef.current.play().catch(() => {
        // Fallback: create a simple beep sound
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1);

        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.5);
      });
    }
  }, [soundEnabled]);

  const formatTime = useCallback((totalSeconds: number): { hours: number; minutes: number; seconds: number; display: string; } => {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;

    const display = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;

    return { hours: h, minutes: m, seconds: s, display };
  }, []);

  const calculateTotalSeconds = useCallback((): number => {
    const h = parseInt(hours) || 0;
    const m = parseInt(minutes) || 0;
    const s = parseInt(seconds) || 0;
    return h * 3600 + m * 60 + s;
  }, [hours, minutes, seconds]);

  const startTimer = useCallback(() => {
    const totalSeconds = calculateTotalSeconds();
    if (totalSeconds <= 0) {
      toast.error("Please set a valid timer duration");
      return;
    }

    setInitialTime(totalSeconds);
    setTimeLeft(totalSeconds);
    setIsRunning(true);
    setHasFinished(false);

    toast.success("Timer started!");
  }, [calculateTotalSeconds]);

  const pauseTimer = useCallback(() => {
    setIsRunning(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    toast.info("Timer paused");
  }, []);

  const resetTimer = useCallback(() => {
    setIsRunning(false);
    setTimeLeft(calculateTotalSeconds());
    setInitialTime(calculateTotalSeconds());
    setHasFinished(false);

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, [calculateTotalSeconds]);

  const stopTimer = useCallback(() => {
    setIsRunning(false);
    setTimeLeft(0);
    setHasFinished(true);

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    playNotification();
    toast.success("Timer finished!");
  }, [playNotification]);

  // Timer logic
  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            stopTimer();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeLeft, stopTimer]);

  const loadPreset = useCallback((duration: number) => {
    const { hours: h, minutes: m, seconds: s } = formatTime(duration);
    setHours(h.toString());
    setMinutes(m.toString());
    setSeconds(s.toString());
    setTimeLeft(duration);
    setInitialTime(duration);
    setIsRunning(false);
    setHasFinished(false);
  }, [formatTime]);

  const presets: TimerPreset[] = [
    { name: "1 Minute", duration: 60, description: "Quick break or task" },
    { name: "5 Minutes", duration: 300, description: "Short focus session" },
    { name: "10 Minutes", duration: 600, description: "Extended task" },
    { name: "15 Minutes", duration: 900, description: "Pomodoro technique" },
    { name: "25 Minutes", duration: 1500, description: "Full Pomodoro session" },
    { name: "30 Minutes", duration: 1800, description: "Meeting or study session" },
    { name: "45 Minutes", duration: 2700, description: "Class or workshop" },
    { name: "1 Hour", duration: 3600, description: "Deep work session" },
    { name: "2 Hours", duration: 7200, description: "Extended work block" },
  ];

  const timeLeftFormatted = formatTime(timeLeft);
  const progress = initialTime > 0 ? ((initialTime - timeLeft) / initialTime) * 100 : 0;

  const faqs = [
    {
      question: "How accurate is the countdown timer?",
      answer: "The timer is accurate to within 1 second and runs in the browser using JavaScript intervals.",
    },
    {
      question: "Does the timer work when the browser tab is not active?",
      answer: "The timer will continue running in the background, but may be less accurate if the browser throttles the tab for performance.",
    },
    {
      question: "Can I get notifications when the timer finishes?",
      answer: "Yes! Enable sound notifications to get an audio alert when your timer completes.",
    },
  ];

  return (
    <ToolLayout
      title="Countdown Timer"
      description="Set customizable countdown timers with visual progress indicators, sound alerts, and preset durations for productivity and time management."
      category="utility"
      categoryLabel="Utility Tools"
      icon={Timer}
      faqs={faqs}
      relatedTools={[
        { title: "Timestamp Converter", description: "Convert timestamps", href: "/utility-tools/timestamp", icon: Timer, category: "utility" },
        { title: "Unit Converter", description: "Convert measurements", href: "/utility-tools/unit-converter", icon: Timer, category: "utility" },
        { title: "Color Converter", description: "Convert colors", href: "/utility-tools/color-converter", icon: Timer, category: "utility" },
      ]}
    >
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Timer Display */}
        <Card>
          <CardContent className="p-8">
            <div className="text-center space-y-6">
              {/* Main Timer Display */}
              <div className="space-y-4">
                <div className={`text-6xl md:text-8xl font-mono font-bold tabular-nums ${hasFinished ? 'text-red-500' :
                    timeLeft <= 60 ? 'text-orange-500' :
                      timeLeft <= 300 ? 'text-yellow-500' :
                        'text-primary'
                  }`}>
                  {hasFinished ? "00:00:00" : timeLeftFormatted.display}
                </div>

                {/* Progress Bar */}
                {!hasFinished && initialTime > 0 && (
                  <Progress value={progress} className="h-3" />
                )}

                {/* Status */}
                <div className="flex justify-center">
                  {hasFinished ? (
                    <Badge variant="destructive" className="text-lg px-4 py-2">
                      Time's Up!
                    </Badge>
                  ) : isRunning ? (
                    <Badge variant="default" className="text-lg px-4 py-2">
                      Running
                    </Badge>
                  ) : timeLeft < initialTime ? (
                    <Badge variant="secondary" className="text-lg px-4 py-2">
                      Paused
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-lg px-4 py-2">
                      Ready
                    </Badge>
                  )}
                </div>
              </div>

              {/* Controls */}
              <div className="flex justify-center gap-4">
                {!isRunning && timeLeft === initialTime && !hasFinished && (
                  <Button onClick={startTimer} size="lg" className="gap-2">
                    <Play className="h-5 w-5" />
                    Start
                  </Button>
                )}

                {isRunning && (
                  <Button onClick={pauseTimer} variant="outline" size="lg" className="gap-2">
                    <Pause className="h-5 w-5" />
                    Pause
                  </Button>
                )}

                {!isRunning && timeLeft < initialTime && !hasFinished && (
                  <Button onClick={() => setIsRunning(true)} size="lg" className="gap-2">
                    <Play className="h-5 w-5" />
                    Resume
                  </Button>
                )}

                <Button onClick={resetTimer} variant="outline" size="lg" className="gap-2">
                  <RotateCcw className="h-5 w-5" />
                  Reset
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Timer Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Timer Settings</CardTitle>
              <CardDescription>Set your countdown duration</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="hours">Hours</Label>
                  <Input
                    id="hours"
                    type="number"
                    min="0"
                    max="23"
                    value={hours}
                    onChange={(e) => setHours(e.target.value)}
                    disabled={isRunning}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="minutes">Minutes</Label>
                  <Input
                    id="minutes"
                    type="number"
                    min="0"
                    max="59"
                    value={minutes}
                    onChange={(e) => setMinutes(e.target.value)}
                    disabled={isRunning}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="seconds">Seconds</Label>
                  <Input
                    id="seconds"
                    type="number"
                    min="0"
                    max="59"
                    value={seconds}
                    onChange={(e) => setSeconds(e.target.value)}
                    disabled={isRunning}
                  />
                </div>
              </div>

              {/* Sound Toggle */}
              <div className="flex items-center space-x-2">
                {soundEnabled ? (
                  <Bell className="h-4 w-4" />
                ) : (
                  <BellOff className="h-4 w-4" />
                )}
                <Label htmlFor="sound-toggle" className="text-sm font-medium">
                  Sound notifications
                </Label>
                <Switch
                  id="sound-toggle"
                  checked={soundEnabled}
                  onCheckedChange={setSoundEnabled}
                />
              </div>
            </CardContent>
          </Card>

          {/* Quick Presets */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Presets</CardTitle>
              <CardDescription>Common timer durations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-2">
                {presets.map((preset, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    onClick={() => loadPreset(preset.duration)}
                    disabled={isRunning}
                    className="justify-start h-auto p-3"
                  >
                    <div className="flex justify-between items-center w-full">
                      <div>
                        <div className="font-medium">{preset.name}</div>
                        <div className="text-xs text-muted-foreground">{preset.description}</div>
                      </div>
                      <Badge variant="secondary" className="font-mono">
                        {formatTime(preset.duration).display}
                      </Badge>
                    </div>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Timer Info */}
        <Card>
          <CardHeader>
            <CardTitle>Timer Tips</CardTitle>
            <CardDescription>Making the most of your countdown timer</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6 text-sm">
              <div className="space-y-3">
                <h5 className="font-medium">Productivity Techniques</h5>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• <strong>Pomodoro:</strong> 25 minutes work, 5 minutes break</li>
                  <li>• <strong>Focus sessions:</strong> 50 minutes deep work</li>
                  <li>• <strong>Meetings:</strong> Time-box discussions</li>
                  <li>• <strong>Breaks:</strong> Short pauses between tasks</li>
                </ul>
              </div>

              <div className="space-y-3">
                <h5 className="font-medium">Best Practices</h5>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Keep notifications enabled for alerts</li>
                  <li>• Use presets for common durations</li>
                  <li>• Reset when switching tasks</li>
                  <li>• Take short breaks between sessions</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ToolLayout>
  );
}
