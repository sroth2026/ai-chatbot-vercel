'use client';

import { useState, useEffect, useRef } from 'react';

let embeddingPipeline: any = null;
let isLoading = false;

export function useEmbedding() {
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const initRef = useRef(false);

  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;

    async function initPipeline() {
      if (embeddingPipeline) {
        setReady(true);
        return;
      }

      if (isLoading) return;

      try {
        isLoading = true;
        
        // Dynamically import to avoid SSR issues
        const { pipeline } = await import('@xenova/transformers');
        
        embeddingPipeline = await pipeline(
          'feature-extraction',
          'Xenova/all-MiniLM-L6-v2'
        );
        setReady(true);
        setError(null);
        console.log('Embedding model loaded successfully');
      } catch (err) {
        console.error('Failed to load embedding model:', err);
        setError('Failed to load embedding model');
      } finally {
        isLoading = false;
      }
    }

    initPipeline();
  }, []);

  const embed = async (text: string): Promise<number[] | null> => {
    if (!embeddingPipeline) {
      console.warn('Embedding pipeline not ready');
      return null;
    }

    try {
      const result = await embeddingPipeline(text, {
        pooling: 'mean',
        normalize: true,
      });
      return Array.from(result.data);
    } catch (err) {
      console.error('Embedding error:', err);
      return null;
    }
  };

  return { embed, ready, error };
}
