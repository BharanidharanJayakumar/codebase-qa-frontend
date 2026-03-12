"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";

interface CommandItem {
  id: string;
  label: string;
  description?: string;
  icon?: React.ReactNode;
  action: () => void;
  category: string;
}

interface CommandPaletteProps {
  items?: CommandItem[];
}

export function CommandPalette({ items = [] }: CommandPaletteProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const defaultItems: CommandItem[] = [
    {
      id: "home",
      label: "Go to Home",
      description: "Landing page",
      category: "Navigation",
      action: () => router.push("/"),
    },
    {
      id: "dashboard",
      label: "Go to Dashboard",
      description: "View all projects",
      category: "Navigation",
      action: () => router.push("/dashboard"),
    },
    ...items,
  ];

  const filtered = defaultItems.filter(
    (item) =>
      item.label.toLowerCase().includes(query.toLowerCase()) ||
      item.description?.toLowerCase().includes(query.toLowerCase())
  );

  // Keyboard shortcut to open
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Focus input on open
  useEffect(() => {
    if (open) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => Math.min(prev + 1, filtered.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => Math.max(prev - 1, 0));
      } else if (e.key === "Enter" && filtered[selectedIndex]) {
        e.preventDefault();
        filtered[selectedIndex].action();
        setOpen(false);
      }
    },
    [filtered, selectedIndex]
  );

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />

          {/* Palette */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-x-0 top-[20%] z-50 mx-auto w-full max-w-lg"
          >
            <div className="overflow-hidden rounded-xl border border-white/10 bg-[var(--background)] shadow-2xl">
              {/* Search input */}
              <div className="flex items-center gap-3 border-b border-[var(--border)] px-4 py-3">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-[var(--muted-foreground)]">
                  <circle cx="7" cy="7" r="5" />
                  <path d="M14 14l-3-3" />
                </svg>
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setSelectedIndex(0);
                  }}
                  onKeyDown={handleKeyDown}
                  placeholder="Type a command..."
                  className="flex-1 bg-transparent text-sm outline-none placeholder:text-[var(--muted-foreground)]"
                />
                <kbd className="rounded border border-[var(--border)] px-1.5 py-0.5 text-[10px] text-[var(--muted-foreground)]">
                  ESC
                </kbd>
              </div>

              {/* Results */}
              <div className="max-h-64 overflow-y-auto py-2">
                {filtered.length === 0 ? (
                  <p className="px-4 py-6 text-center text-sm text-[var(--muted-foreground)]">
                    No results found.
                  </p>
                ) : (
                  filtered.map((item, i) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        item.action();
                        setOpen(false);
                      }}
                      className={`flex w-full items-center gap-3 px-4 py-2 text-left text-sm transition-colors ${
                        i === selectedIndex
                          ? "bg-[var(--muted)] text-[var(--foreground)]"
                          : "text-[var(--muted-foreground)] hover:bg-[var(--muted)]"
                      }`}
                    >
                      {item.icon && <span className="shrink-0">{item.icon}</span>}
                      <div className="min-w-0 flex-1">
                        <div className="font-medium">{item.label}</div>
                        {item.description && (
                          <div className="text-xs text-[var(--muted-foreground)] truncate">
                            {item.description}
                          </div>
                        )}
                      </div>
                      <span className="shrink-0 text-[10px] text-[var(--muted-foreground)]">
                        {item.category}
                      </span>
                    </button>
                  ))
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
