import * as React from 'react';

const KEY = 'robotics-library.bookmarks';

function read(): Set<string> {
  try {
    const raw = localStorage.getItem(KEY);
    return new Set(raw ? (JSON.parse(raw) as string[]) : []);
  } catch {
    return new Set();
  }
}

/** The reader's personal bookmarks, persisted to the browser's localStorage. */
export function useBookmarks() {
  const [bookmarks, setBookmarks] = React.useState<Set<string>>(() =>
    typeof localStorage === 'undefined' ? new Set<string>() : read(),
  );

  React.useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify([...bookmarks]));
    } catch {
      /* private mode / quota — ignore */
    }
  }, [bookmarks]);

  const toggle = React.useCallback((id: string) => {
    setBookmarks((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  return { bookmarks, toggle };
}
