"use client";

import { useState, useEffect } from "react";

const phrases = [
  "Ask about architecture",
  "Find every endpoint",
  "Trace any function",
  "Understand any codebase",
  "List all DTOs",
  "Explore the import graph",
];

export function Typewriter() {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const phrase = phrases[phraseIndex];
    const speed = deleting ? 30 : 60;

    if (!deleting && charIndex === phrase.length) {
      const timeout = setTimeout(() => setDeleting(true), 2000);
      return () => clearTimeout(timeout);
    }

    if (deleting && charIndex === 0) {
      setDeleting(false);
      setPhraseIndex((prev) => (prev + 1) % phrases.length);
      return;
    }

    const timeout = setTimeout(() => {
      setCharIndex((prev) => prev + (deleting ? -1 : 1));
    }, speed);

    return () => clearTimeout(timeout);
  }, [charIndex, deleting, phraseIndex]);

  const displayed = phrases[phraseIndex].slice(0, charIndex);

  return (
    <span className="text-[#818cf8]">
      {displayed}
      <span className="animate-pulse">|</span>
    </span>
  );
}
