import { useEffect } from 'react';

export function useSSE(url: string, onMessage: (data: any) => void) {
    useEffect(() => {
        const es = new EventSource(url);
        es.onmessage = (e) => {
            try { onMessage(JSON.parse(e.data)); }
            catch { onMessage(e.data); }
        };
        es.onerror = () => {
        };
        return () => es.close();
    }, [url, onMessage]);
}
