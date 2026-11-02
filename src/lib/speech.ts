interface SpeechRec {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  onresult: ((event: SpeechResultEvent) => void) | null;
  onerror: ((event: { error?: string }) => void) | null;
  onend: (() => void) | null;
  start(): void;
  stop(): void;
}

interface SpeechResultEvent {
  resultIndex: number;
  results: ArrayLike<ArrayLike<{ transcript: string }> & { isFinal: boolean }>;
}

function ctor(): (new () => SpeechRec) | null {
  if (typeof window === 'undefined') return null;
  const host = window as Window & { SpeechRecognition?: new () => SpeechRec; webkitSpeechRecognition?: new () => SpeechRec };
  return host.SpeechRecognition ?? host.webkitSpeechRecognition ?? null;
}

export function dictationAvailable() {
  return ctor() !== null;
}

export function listen(
  lang: string,
  handlers: {
    onPartial: (text: string) => void;
    onFinal: (text: string) => void;
    onError: (message: string) => void;
    onEnd: () => void;
  },
): { stop: () => void } | null {
  const Speech = ctor();
  if (!Speech) return null;
  const rec = new Speech();
  rec.lang = lang;
  rec.interimResults = true;
  rec.continuous = false;
  rec.onresult = (event) => {
    let text = '';
    let final = false;
    for (let i = event.resultIndex; i < event.results.length; i += 1) {
      text += event.results[i][0]?.transcript ?? '';
      if (event.results[i].isFinal) final = true;
    }
    const spoken = text.trim();
    if (!spoken) return;
    if (final) handlers.onFinal(spoken);
    else handlers.onPartial(spoken);
  };
  rec.onerror = (event) => {
    const code = event.error ?? 'unavailable';
    handlers.onError(code === 'not-allowed' ? 'Microphone permission was blocked. You can still type.' : 'Voice input stopped. You can still type.');
  };
  rec.onend = () => handlers.onEnd();
  try {
    rec.start();
  } catch {
    handlers.onError('Voice input is not available in this browser. Type your question instead.');
    return null;
  }
  return { stop: () => { try { rec.stop(); } catch { /* already stopped */ } } };
}
