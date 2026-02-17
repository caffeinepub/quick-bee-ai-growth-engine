import { useState, useEffect } from 'react';
import { useActor } from './useActor';
import { getDemoSession, setDemoSession, clearDemoSession } from '../utils/sessionAuth';

export function useDemoSession() {
  const { actor } = useActor();
  const [isDemoActive, setIsDemoActive] = useState<boolean>(() => getDemoSession());
  const [isLoading, setIsLoading] = useState(false);

  // Sync with backend demo status when actor is available
  useEffect(() => {
    const checkBackendDemoStatus = async () => {
      if (!actor) return;
      
      try {
        const backendDemoStatus = await actor.isDemoSession();
        const localDemoStatus = getDemoSession();
        
        // Sync local state with backend
        if (backendDemoStatus !== localDemoStatus) {
          setDemoSession(backendDemoStatus);
          setIsDemoActive(backendDemoStatus);
        }
      } catch (error) {
        console.warn('Failed to check backend demo status:', error);
      }
    };

    checkBackendDemoStatus();
  }, [actor]);

  const startDemo = async () => {
    setIsLoading(true);
    try {
      if (actor) {
        await actor.startDemoSession();
      }
      setDemoSession(true);
      setIsDemoActive(true);
    } catch (error) {
      console.error('Failed to start demo session:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const endDemo = async () => {
    setIsLoading(true);
    try {
      if (actor) {
        await actor.endDemoSession();
      }
      clearDemoSession();
      setIsDemoActive(false);
    } catch (error) {
      console.error('Failed to end demo session:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isDemoActive,
    isLoading,
    startDemo,
    endDemo,
  };
}
