"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { qaApi } from "@/lib/api/qa";
import { getSessionId, setSessionId, generateSessionId } from "@/lib/chat/session-store";
import { ChatMessage } from "./ChatMessage";
import { TypingIndicator } from "./TypingIndicator";
import type { AnswerDoneEvent } from "@/types/api";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  relevantFiles?: string[];
  followUp?: string[];
}

interface ChatPanelProps {
  projectPath: string;
  projectId: string;
  onFileClick?: (filePath: string) => void;
}

export function ChatPanel({ projectPath, projectId, onFileClick }: ChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = useCallback(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const getOrCreateSession = () => {
    let sid = getSessionId(projectId);
    if (!sid) {
      sid = generateSessionId();
      setSessionId(projectId, sid);
    }
    return sid;
  };

  const sendMessage = async (text: string) => {
    if (!text.trim() || streaming) return;

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      role: "user",
      content: text.trim(),
    };

    const assistantMsg: Message = {
      id: `a-${Date.now()}`,
      role: "assistant",
      content: "",
    };

    setMessages((prev) => [...prev, userMsg, assistantMsg]);
    setInput("");
    setStreaming(true);

    try {
      const sessionId = getOrCreateSession();
      let fullText = "";

      for await (const event of qaApi.answerQuestion(text.trim(), sessionId, projectPath)) {
        if (event.type === "delta") {
          fullText += event.text;
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantMsg.id ? { ...m, content: fullText } : m
            )
          );
        } else if (event.type === "done") {
          const done = event as AnswerDoneEvent;
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantMsg.id
                ? {
                    ...m,
                    content: done.answer,
                    relevantFiles: done.relevant_files,
                    followUp: done.follow_up,
                  }
                : m
            )
          );
        }
      }
    } catch {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantMsg.id
            ? { ...m, content: "Failed to get a response. Please try again." }
            : m
        )
      );
    } finally {
      setStreaming(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const lastMessage = messages[messages.length - 1];
  const followUps = lastMessage?.followUp;

  return (
    <div className="flex h-full flex-col">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="flex h-full items-center justify-center text-[var(--muted-foreground)]">
            <p>Ask a question about this codebase</p>
          </div>
        )}
        {messages.map((msg) => (
          <ChatMessage
            key={msg.id}
            role={msg.role}
            content={msg.content}
            relevantFiles={msg.relevantFiles}
            onFileClick={onFileClick}
          >
            {msg.role === "assistant" && streaming && !msg.content && (
              <TypingIndicator />
            )}
          </ChatMessage>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Follow-up suggestions */}
      {followUps && followUps.length > 0 && !streaming && (
        <div className="flex gap-2 px-4 pb-2 flex-wrap">
          {followUps.map((q, i) => (
            <button
              key={i}
              onClick={() => sendMessage(q)}
              className="rounded-full border border-[var(--border)] px-3 py-1 text-xs text-[var(--muted-foreground)] transition-colors hover:border-[var(--muted-foreground)] hover:text-[var(--foreground)]"
            >
              {q}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <form onSubmit={handleSubmit} className="border-t border-[var(--border)] p-4">
        <div className="flex gap-2">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about the codebase..."
            rows={1}
            className="flex-1 resize-none rounded-lg border border-[var(--border)] bg-[var(--background)] px-4 py-2.5 text-sm outline-none placeholder:text-[var(--muted-foreground)] focus:ring-2 focus:ring-[var(--primary)]"
            disabled={streaming}
          />
          <button
            type="submit"
            disabled={streaming || !input.trim()}
            className="rounded-lg bg-[var(--primary)] px-4 py-2.5 text-sm font-medium text-[var(--primary-foreground)] transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {streaming ? "..." : "Send"}
          </button>
        </div>
      </form>
    </div>
  );
}
