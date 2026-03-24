"use client";

import { useEffect, useRef, useState } from "react";
import {
  MicrophoneIcon,
  StopCircleIcon,
  XMarkIcon
} from "@heroicons/react/24/outline";
import { useAuth } from "@/components/providers/auth-provider";
import { useToast } from "@/components/providers/toast-provider";
import { moodOptions, privacyOptions } from "@/lib/constants";
import { submitDream } from "@/lib/api";
import { DreamMood, DreamPrivacy } from "@/types";

declare global {
  interface Window {
    SpeechRecognition?: new () => SpeechRecognition;
    webkitSpeechRecognition?: new () => SpeechRecognition;
  }
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: Event) => void) | null;
}

interface SpeechRecognitionEvent extends Event {
  results: {
    [index: number]: {
      [index: number]: {
        transcript: string;
      };
    };
    length: number;
  };
}

export function AddDreamModal({
  open,
  onClose
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [dreamText, setDreamText] = useState("");
  const [mood, setMood] = useState<DreamMood>("curious");
  const [privacy, setPrivacy] = useState<DreamPrivacy>("private");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    if (!open) {
      setDreamText("");
      setMood("curious");
      setPrivacy("private");
      setIsListening(false);
      recognitionRef.current?.stop();
    }
  }, [open]);

  function toggleListening() {
    const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!Recognition) {
      showToast("Voice capture is not supported in this browser.", "error");
      return;
    }

    if (!recognitionRef.current) {
      const recognition = new Recognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "en-US";
      recognition.onresult = (event) => {
        const transcript = Array.from({ length: event.results.length })
          .map((_, index) => event.results[index]?.[0]?.transcript || "")
          .join(" ");
        setDreamText(transcript.trim());
      };
      recognition.onerror = () => {
        setIsListening(false);
        showToast("Voice capture stopped unexpectedly.", "error");
      };
      recognitionRef.current = recognition;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  }

  async function handleSubmit() {
    if (!user) {
      showToast("Please sign in first.", "error");
      return;
    }

    if (!dreamText.trim()) {
      showToast("Add a dream before submitting.", "error");
      return;
    }

    setIsSubmitting(true);

    try {
      await submitDream({
        userId: user.uid,
        dream_text: dreamText,
        mood,
        privacy
      });
      showToast("Dream processed and saved.");
      onClose();
      window.dispatchEvent(new CustomEvent("dream:created"));
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Dream submission failed.", "error");
    } finally {
      setIsSubmitting(false);
      recognitionRef.current?.stop();
      setIsListening(false);
    }
  }

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[90] flex items-end bg-slate-950/70 backdrop-blur sm:items-center sm:justify-center">
      <div className="glass-panel max-h-[92vh] w-full rounded-b-none p-5 sm:max-w-2xl sm:rounded-3xl">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-sm text-accent">New entry</p>
            <h3 className="text-xl font-semibold">Capture the dream before it fades</h3>
          </div>
          <button className="rounded-full p-2 hover:bg-panelSoft" onClick={onClose}>
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4">
          <textarea
            className="input-base min-h-40 resize-none"
            placeholder="Type the dream, details, symbols, and the moment you woke up."
            value={dreamText}
            onChange={(event) => setDreamText(event.target.value)}
          />

          <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
            <select
              className="input-base"
              value={mood}
              onChange={(event) => setMood(event.target.value as DreamMood)}
            >
              {moodOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <button className="button-secondary gap-2" onClick={toggleListening} type="button">
              {isListening ? (
                <StopCircleIcon className="h-4 w-4" />
              ) : (
                <MicrophoneIcon className="h-4 w-4" />
              )}
              {isListening ? "Stop voice note" : "Record voice"}
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {privacyOptions.map((option) => (
              <button
                key={option.value}
                className={`rounded-2xl border px-3 py-3 text-sm transition ${
                  privacy === option.value
                    ? "border-accent bg-accent/15 text-accent"
                    : "border-border bg-panelSoft text-muted"
                }`}
                onClick={() => setPrivacy(option.value)}
                type="button"
              >
                {option.label}
              </button>
            ))}
          </div>

          <button className="button-primary w-full" disabled={isSubmitting} onClick={handleSubmit}>
            {isSubmitting ? "Processing with AI..." : "Submit dream"}
          </button>
        </div>
      </div>
    </div>
  );
}
