import { useEffect, useRef, useState } from 'react';
import { Mic, Square, Send } from 'lucide-react';
import { LANGUAGES, QUESTION_CHIPS, SANCTUARY_TOPICS, type LanguageCode } from '../../content/site';
import { dictationAvailable, listen } from '../../lib/speech';
import { uid } from '../../lib/uid';
import { ExampleMark, PlaceholderNote } from '../Marks';
import { auth, astrology, PUBLISHED_QUESTION, type BirthProfile, type ChatEntry } from '../../services';

export function ConsultView({
  profile,
  signedIn,
  messages,
  language,
  onLanguage,
  draft,
  onDraft,
  onGuestAppend,
}: {
  profile: BirthProfile | null;
  signedIn: boolean;
  messages: ChatEntry[];
  language: LanguageCode;
  onLanguage: (code: LanguageCode) => void;
  draft: string;
  onDraft: (value: string) => void;
  onGuestAppend: (entry: ChatEntry) => void;
}) {
  const [listening, setListening] = useState(false);
  const [voiceNote, setVoiceNote] = useState('');
  const [sending, setSending] = useState(false);
  const scroller = useRef<HTMLDivElement>(null);
  const stopRef = useRef<{ stop: () => void } | null>(null);
  const lang = LANGUAGES.find((item) => item.code === language) ?? LANGUAGES[0];

  useEffect(() => {
    const node = scroller.current;
    if (node) node.scrollTop = node.scrollHeight;
  }, [messages.length]);

  useEffect(() => () => stopRef.current?.stop(), []);

  const append = (entry: ChatEntry) => {
    if (!profile) return;
    if (signedIn) auth.appendMessage(profile.id, entry);
    else onGuestAppend(entry);
  };

  const send = (text: string) => {
    if (!profile || sending) return;
    const question = text.trim();
    if (!question) return;
    setSending(true);
    onDraft('');
    const user: ChatEntry = { id: uid('msg'), role: 'user', text: question, createdAt: new Date().toISOString(), language };
    append(user);
    const reply = astrology.consult({ profile, question, language });
    const assistant: ChatEntry = { id: uid('msg'), role: 'assistant', kind: reply.kind, title: reply.title, body: reply.body, createdAt: new Date().toISOString() };
    append(assistant);
    setSending(false);
  };

  const toggleMic = () => {
    if (listening) {
      stopRef.current?.stop();
      setListening(false);
      return;
    }
    if (!dictationAvailable()) {
      setVoiceNote('Voice input is not available in this browser. Type your question instead.');
      return;
    }
    setVoiceNote(`${lang.label} · listening. Speak clearly.`);
    const handle = listen(lang.speech, {
      onPartial: (text) => onDraft(text),
      onFinal: (text) => onDraft(text),
      onError: (message) => { setVoiceNote(message); setListening(false); },
      onEnd: () => setListening(false),
    });
    if (!handle) {
      setListening(false);
      return;
    }
    stopRef.current = handle;
    setListening(true);
  };

  return (
    <div className="consult">
      <div className="panel-head">
        <div>
          <p className="label">Celestial query sanctuary</p>
          <h2>{profile ? `Namaste${profile.example ? '' : `, ${profile.name.split(' ')[0]}`}` : 'Namaste, Seeker'}</h2>
        </div>
        {profile?.example && <ExampleMark />}
      </div>
      <div className="thread" ref={scroller} aria-live="polite">
        {messages.length === 0 && (
          <div className="zero">
            <p className="zero-title">Ask in plain language.</p>
            <p className="muted">One credit on the live service is one multi-tradition consultation. This preview answers with a notice, or with the single published example when you ask for it.</p>
            <div className="chips" role="group" aria-label="Try asking">
              {SANCTUARY_TOPICS.map((topic) => (
                <button key={topic.label} type="button" className="chip chip--block" onClick={() => onDraft(topic.prompt)}>
                  <strong>{topic.label}</strong>
                  <span>{topic.hint}</span>
                </button>
              ))}
              {QUESTION_CHIPS.map((chip) => (
                <button key={chip.label} type="button" className="chip" onClick={() => onDraft(chip.prompt)}>{chip.label}</button>
              ))}
            </div>
            {profile?.example && (
              <button type="button" className="btn btn--ghost" onClick={() => send(PUBLISHED_QUESTION)}>Show published example</button>
            )}
          </div>
        )}
        {messages.map((message) => message.role === 'user' ? (
          <article key={message.id} className="bubble bubble--user">
            <span className="label">You · {LANGUAGES.find((item) => item.code === message.language)?.label}</span>
            <p>{message.text}</p>
          </article>
        ) : (
          <article key={message.id} className={message.kind === 'published-example' ? 'bubble bubble--example' : 'bubble'}>
            <span className="label">{message.kind === 'published-example' ? 'Published example' : 'Preview'}</span>
            <h3>{message.title}</h3>
            {message.body.split('\n').map((line, index) => <p key={index}>{line || '\u00a0'}</p>)}
          </article>
        ))}
      </div>
      {!profile && <PlaceholderNote>Sign in and save a chart, or open the sanctuary preview, before asking.</PlaceholderNote>}
      <form className="composer" onSubmit={(event) => { event.preventDefault(); send(draft); }}>
        <label className="sr-only" htmlFor="chat-input">Your question</label>
        <textarea
          id="chat-input"
          rows={2}
          lang={lang.speech}
          placeholder={lang.placeholder}
          value={draft}
          disabled={!profile}
          onChange={(event) => onDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter' && !event.shiftKey) {
              event.preventDefault();
              send(draft);
            }
          }}
        />
        <div className="composer-bar">
          <label className="lang-select">
            <span className="sr-only">Answer language</span>
            <select value={language} aria-label="Answer language" onChange={(event) => onLanguage(event.target.value as LanguageCode)}>
              {LANGUAGES.map((item) => <option key={item.code} value={item.code}>{item.native}</option>)}
            </select>
            <span>Answer in: {lang.native}</span>
          </label>
          <div className="composer-actions">
            <button type="button" className="icon-btn" aria-pressed={listening} aria-label={listening ? 'Stop voice input' : 'Start voice input'} onClick={toggleMic}>
              {listening ? <Square size={15} /> : <Mic size={15} strokeWidth={1.6} />}
            </button>
            <button type="submit" className={draft.trim() ? 'search-go is-active' : 'search-go'} aria-label="Send question" disabled={!profile || !draft.trim() || sending}>
              <Send size={16} strokeWidth={1.6} />
            </button>
          </div>
        </div>
        <p className="voice-note" role="status">{listening ? `Dasha is listening in ${lang.label}… Speak clearly.` : voiceNote}</p>
      </form>
    </div>
  );
}
