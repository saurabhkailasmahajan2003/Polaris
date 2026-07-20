import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AgentAvatar from '../ui/AgentAvatar';
import TypewriterText from '../ui/TypewriterText';
import { buildingLabel } from '../../lib/agentBuildings';

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function readPauseMs(text = '') {
  // Extra time after typing so users can finish reading
  return 3500 + Math.min(text.length * 18, 9000);
}

/**
 * Queues agent messages and reveals them one-by-one with typewriter pace.
 * Feels like humans thinking aloud inside a building.
 */
export default function LiveDeliberationFeed({
  messages = [],
  speakingAgent = null,
  title = 'Live deliberation',
  emptyHint = 'Waiting for agents to begin thinking…',
  className = '',
}) {
  const [visible, setVisible] = useState([]);
  const [current, setCurrent] = useState(null);
  const [typingDone, setTypingDone] = useState(false);
  const processedIds = useRef(new Set());
  const queueRef = useRef([]);
  const runningRef = useRef(false);
  const bottomRef = useRef(null);
  const typingResolveRef = useRef(null);

  const runQueue = useCallback(async () => {
    if (runningRef.current) return;
    runningRef.current = true;

    while (queueRef.current.length > 0) {
      const next = queueRef.current.shift();
      setTypingDone(false);
      setCurrent(next);
      await new Promise((resolve) => {
        typingResolveRef.current = resolve;
      });
      await sleep(readPauseMs(next.content));
      setVisible((v) => [...v, next].slice(-30));
      setCurrent(null);
      await sleep(1200);
    }

    runningRef.current = false;
  }, []);

  useEffect(() => {
    const fresh = [];
    for (const msg of messages) {
      const id = msg.id || `${msg.agentId}-${msg.content?.slice(0, 24)}-${msg.round}`;
      if (processedIds.current.has(id)) continue;
      processedIds.current.add(id);
      fresh.push({ ...msg, id });
    }
    if (!fresh.length) return;

    // Catch-up: dump older backlog instantly; only animate the newest few
    if (fresh.length > 3) {
      const backlog = fresh.slice(0, -2);
      const animate = fresh.slice(-2);
      setVisible((v) => [...v, ...backlog].slice(-30));
      queueRef.current.push(...animate);
    } else {
      queueRef.current.push(...fresh);
    }
    runQueue();
  }, [messages, runQueue]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [visible, current, speakingAgent]);

  const handleTypeComplete = () => {
    setTypingDone(true);
    const resolve = typingResolveRef.current;
    typingResolveRef.current = null;
    resolve?.();
  };

  return (
    <div className={`flex flex-col min-h-0 ${className}`}>
      <div className="flex items-center justify-between gap-2 mb-3 shrink-0">
        <h3 className="text-[10px] font-mono uppercase tracking-widest text-text-muted">{title}</h3>
        {(speakingAgent || current) && (
          <span className="text-[10px] font-mono text-primary animate-pulse">● thinking live</span>
        )}
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 min-h-[140px] max-h-[420px] pr-1 overscroll-contain">
        {visible.length === 0 && !current && !speakingAgent && (
          <p className="text-sm text-text-muted py-6 text-center">{emptyHint}</p>
        )}

        <AnimatePresence initial={false}>
          {visible.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-xl border border-white/[0.08] bg-city/80 p-3"
            >
              <div className="flex gap-2.5">
                <AgentAvatar name={msg.agentName} agentId={msg.agentId} size="sm" />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-1.5 mb-1">
                    <span className="text-sm font-heading font-semibold">{msg.agentName}</span>
                    {msg.buildingId && (
                      <span className="text-[9px] font-mono text-text-muted px-1.5 py-0.5 rounded bg-white/5">
                        {buildingLabel(msg.buildingId)}
                      </span>
                    )}
                    {msg.round != null && (
                      <span className="text-[9px] font-mono text-text-muted">R{msg.round}</span>
                    )}
                  </div>
                  <p className="text-sm text-text-secondary leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                  {msg.confidence != null && (
                    <p className="text-[10px] font-mono text-text-muted mt-2">Confidence {msg.confidence}%</p>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {current && (
          <motion.div
            key={`typing-${current.id}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl border border-primary/40 bg-primary/10 p-3 shadow-[0_0_24px_rgba(79,110,247,0.15)]"
          >
            <div className="flex gap-2.5">
              <AgentAvatar name={current.agentName} agentId={current.agentId} size="sm" glow />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-1.5 mb-1">
                  <span className="text-sm font-heading font-semibold text-primary">{current.agentName}</span>
                  <span className="text-[9px] font-mono text-primary/80 animate-pulse">
                    {typingDone ? 'finished speaking' : 'is speaking…'}
                  </span>
                </div>
                <p className="text-sm text-text-primary leading-relaxed whitespace-pre-wrap">
                  <TypewriterText
                    text={current.content || ''}
                    speed={32}
                    onComplete={handleTypeComplete}
                  />
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {!current && speakingAgent && (
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3 flex items-center gap-3">
            <AgentAvatar name={speakingAgent.agentName} agentId={speakingAgent.agentId} size="sm" glow />
            <div>
              <p className="text-sm font-medium">{speakingAgent.agentName}</p>
              <p className="text-xs text-primary animate-pulse mt-0.5">
                Thinking at {buildingLabel(speakingAgent.buildingId)}…
              </p>
              <p className="text-[10px] font-mono text-text-muted mt-1 capitalize">
                {(speakingAgent.phase || '').replace(/_/g, ' ')}
              </p>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>
    </div>
  );
}
