import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type SpeechRecognitionAlternative = {
  transcript: string;
  confidence?: number;
};

type SpeechRecognitionResultLike = {
  isFinal: boolean;
  length: number;
  [index: number]: SpeechRecognitionAlternative;
};

type SpeechRecognitionEventLike = {
  resultIndex: number;
  results: ArrayLike<SpeechRecognitionResultLike>;
};

type SpeechRecognitionErrorEventLike = {
  error?: string;
};

type SpeechRecognitionLike = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  onstart: (() => void) | null;
  onend: (() => void) | null;
  onerror: ((e: SpeechRecognitionErrorEventLike) => void) | null;
  onresult: ((e: SpeechRecognitionEventLike) => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
};

type SpeechRecognitionConstructor = new () => SpeechRecognitionLike;

type UsePushToTalkOptions = {
  language?: string;
  continuous?: boolean;
  interimResults?: boolean;
  onFinalTranscript?: (text: string) => void;
  onInterimTranscript?: (text: string) => void;
};

export function usePushToTalk(options: UsePushToTalkOptions = {}) {
  const {
    language = "en-IN",
    continuous = false,
    interimResults = true,
    onFinalTranscript,
    onInterimTranscript,
  } = options;

  const RecognitionCtor = useMemo(() => {
    const w = window as unknown as {
      SpeechRecognition?: SpeechRecognitionConstructor;
      webkitSpeechRecognition?: SpeechRecognitionConstructor;
    };
    return (w.SpeechRecognition || w.webkitSpeechRecognition) ?? null;
  }, []);

  const supported = !!RecognitionCtor;
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mapError = useCallback((err: string) => {
    if (err === "network") {
      return "Speech recognition service unavailable. Check your internet connection and try again (Chrome/Edge recommended).";
    }
    if (err === "not-allowed" || err === "service-not-allowed") {
      return "Microphone permission blocked. Allow mic access in the browser and try again.";
    }
    if (err === "no-speech") {
      return "No speech detected. Hold the mic button and speak clearly.";
    }
    if (err === "audio-capture") {
      return "No microphone found. Check your input device and try again.";
    }
    return err;
  }, []);

  const stop = useCallback(() => {
    const rec = recognitionRef.current;
    if (!rec) return;

    try {
      rec.abort();
    } catch {
      // ignore
    }

    try {
      rec.stop();
    } catch {
      // ignore
    }
  }, []);

  const start = useCallback(() => {
    if (!RecognitionCtor) {
      setError("Speech recognition not supported in this browser");
      return;
    }

    setError(null);

    if (!recognitionRef.current) {
      const rec = new RecognitionCtor();
      rec.lang = language;
      rec.continuous = continuous;
      rec.interimResults = interimResults;
      rec.maxAlternatives = 1;

      rec.onstart = () => {
        setIsListening(true);
      };

      rec.onend = () => {
        setIsListening(false);
      };

      rec.onerror = (e) => {
        const mapped = mapError(e.error || "speech_recognition_error");
        setError(mapped);
        setIsListening(false);
        recognitionRef.current = null;
      };

      rec.onresult = (event) => {
        let interim = "";
        let finalText = "";

        for (let i = event.resultIndex; i < event.results.length; i += 1) {
          const result = event.results[i];
          const alternatives = Array.from({ length: result.length }, (_, idx) => result[idx]);
          const text = alternatives
            .map((alt) => alt.transcript)
            .join(" ")
            .trim();

          if (result.isFinal) {
            finalText += (finalText ? " " : "") + text;
          } else {
            interim += (interim ? " " : "") + text;
          }
        }

        if (interim && onInterimTranscript) onInterimTranscript(interim);
        if (finalText && onFinalTranscript) onFinalTranscript(finalText);
      };

      recognitionRef.current = rec;
    }

    try {
      recognitionRef.current.start();
    } catch {
      // If called twice quickly, browsers can throw.
    }
  }, [RecognitionCtor, language, continuous, interimResults, onFinalTranscript, onInterimTranscript]);

  useEffect(() => {
    return () => {
      stop();
      recognitionRef.current = null;
    };
  }, [stop]);

  return {
    supported,
    isListening,
    error,
    start,
    stop,
  };
}
