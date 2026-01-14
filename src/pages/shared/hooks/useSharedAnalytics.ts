import { useEffect, useRef } from 'react';

import { createTimeEvent, createViewEvent } from '@actions/analytics';

import type { Shared } from '@actions/shareds/types';

export const useSharedAnalytics = (shared: Shared | null) => {
  const lastSentTimeRef = useRef<number>(0);
  const viewRecordedSlugRef = useRef<string | null>(null);

  useEffect(() => {
    if (!shared) return;

    const currentSlug = shared.slug;

    if (viewRecordedSlugRef.current !== currentSlug) {
      const viewPromise = createViewEvent({
        sharedId: currentSlug,
        viewedAt: new Date().toISOString(),
        userAgent: navigator.userAgent,
        referrer: document.referrer,
      });

      if (shared.isRedirect && shared.redirectUrl) {
        const performRedirect = () => {
          let targetUrl = shared.redirectUrl!;
          if (!targetUrl.match(/^https?:\/\//)) {
            targetUrl = `https://${targetUrl}`;
          }
          window.location.href = targetUrl;
        };

        viewPromise.finally(() => setTimeout(performRedirect, 100));
        setTimeout(performRedirect, 2000);
      } else {
        viewPromise.catch(console.error);
      }

      viewRecordedSlugRef.current = currentSlug;
    }

    if (shared.isRedirect) return;

    lastSentTimeRef.current = Date.now();

    const sendTimeAnalytics = (timeSpent: number) => {
      if (timeSpent <= 0) return;
      createTimeEvent({
        sharedId: currentSlug,
        recordedAt: new Date().toISOString(),
        timeSpent,
      }).catch(console.error);
    };

    const intervalId = setInterval(() => {
      const now = Date.now();
      const duration = Math.floor((now - lastSentTimeRef.current) / 1000);

      if (duration >= 30) {
        sendTimeAnalytics(duration);
        lastSentTimeRef.current = now;
      }
    }, 30000);

    const handleExit = () => {
      const now = Date.now();
      const duration = Math.floor((now - lastSentTimeRef.current) / 1000);
      if (duration > 0) {
        sendTimeAnalytics(duration);
        lastSentTimeRef.current = now;
      }
    };

    window.addEventListener('beforeunload', handleExit);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener('beforeunload', handleExit);
      handleExit();
    };
  }, [shared]);
};