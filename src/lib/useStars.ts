import * as React from 'react';

const KEY = 'robotics-library.stars';

function read(): Set<string> {
  try {
    const raw = localStorage.getItem(KEY);
    return new Set(raw ? (JSON.parse(raw) as string[]) : []);
  } catch {
    return new Set();
  }
}

/** Bookmarks persisted to the browser's localStorage. */
export function useStars() {
  const [stars, setStars] = React.useState<Set<string>>(() =>
    typeof localStorage === 'undefined' ? new Set<string>() : read(),
  );

  React.useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify([...stars]));
    } catch {
      /* private mode / quota — ignore */
    }
  }, [stars]);

  const toggle = React.useCallback((id: string) => {
    setStars((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  return { stars, toggle };
}
