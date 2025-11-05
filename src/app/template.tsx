'use client';

// This is a temporary workaround for a bug in Next.js
// where the template is not rendered on the initial page load.
// see: https://github.com/vercel/next.js/issues/49428
import { useEffect, useState } from 'react';

export default function Template({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }
  
  return <div className="fade-in">{children}</div>;
}
