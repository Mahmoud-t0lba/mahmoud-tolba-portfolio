import { useState, useEffect, useCallback } from 'react';
import { doc, updateDoc, runTransaction } from 'firebase/firestore';
import { db, firebaseEnabled } from '../lib/firebase';

// Convert milliseconds to seconds
const msToSeconds = (ms: number) => Math.round(ms / 1000 * 10) / 10; // Round to 1 decimal

// Format timestamp to DD/MM/YYYY-H:MMPM format
const formatTimestamp = (ms: number) => {
    const date = new Date(ms);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const period = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12; // Convert to 12-hour format
    return `${day}/${month}/${year}-${hours}:${minutes}${period}`;
};

const isOfflineFirestoreError = (error: unknown) => {
    const errorLike = typeof error === 'object' && error ? error as { code?: unknown; message?: unknown } : null;
    const code = errorLike?.code ? String(errorLike.code).toLowerCase() : '';
    const rawMessage = errorLike?.message ?? (error instanceof Error ? error.message : String(error));
    const message = String(rawMessage).toLowerCase();
    return code === 'unavailable' || message.includes('client is offline') || message.includes('offline');
};

export const useSocialTracker = () => {
    const [pendingVisit, setPendingVisit] = useState<{ linkName: string; clickId: string; clickTime: number } | null>(null);
    const firestore = db;

    const trackClick = useCallback(async (linkName: string) => {
            if (!firebaseEnabled || !firestore) {
                return;
            }

            const clickTime = Date.now();
            let clickKey = '';

            try {
                const socialRef = doc(firestore, 'Settings', 'Views', 'Socials', linkName);

                // Use transaction to avoid lost-updates if two users click at exact same time
                await runTransaction(firestore, async (transaction) => {
                    const socialSnap = await transaction.get(socialRef);
                    let nextClickNum = 1;

                    if (socialSnap.exists()) {
                        const data = socialSnap.data();
                        // Find highest numeric key
                        const existingKeys = Object.keys(data)
                            .map(key => parseInt(key))
                            .filter(num => !isNaN(num));
                        if (existingKeys.length > 0) {
                            nextClickNum = Math.max(...existingKeys) + 1;
                        }
                    }

                    clickKey = nextClickNum.toString();
                    transaction.set(socialRef, {
                        [clickKey]: {
                            timestamp: formatTimestamp(clickTime),
                            duration: null // Will be updated on return
                        }
                    }, { merge: true });
                });

                if (clickKey) {
                    // Set pending state for duration tracking
                    setPendingVisit({ linkName, clickId: clickKey, clickTime });
                }

            // Dispatch Global Event for Algorithm.tsx (Session Recording)
            window.dispatchEvent(new CustomEvent('tolba:social_click', {
                detail: { name: linkName }
            }));

        } catch (error) {
            if (!isOfflineFirestoreError(error)) {
                console.error('Error tracking social click:', error);
            }
        }
    }, [firestore]);

    useEffect(() => {
        const handleVisibilityChange = async () => {
            if (!firebaseEnabled || !firestore) return;
            if (document.visibilityState === 'visible' && pendingVisit) {
                const endTime = Date.now();
                const durationMs = endTime - pendingVisit.clickTime;
                const durationSec = msToSeconds(durationMs);

                try {
                    // Update duration for this click as a string
                    const socialRef = doc(firestore, 'Settings', 'Views', 'Socials', pendingVisit.linkName);
                    await updateDoc(socialRef, {
                        [`${pendingVisit.clickId}.duration`]: durationSec.toString()
                    });

                    // Dispatch Global Event for Algorithm.tsx (Session Recording)
                    window.dispatchEvent(new CustomEvent('tolba:social_return', {
                        detail: { name: pendingVisit.linkName, duration: durationMs }
                    }));

                } catch (error) {
                    if (!isOfflineFirestoreError(error)) {
                        console.error('Error tracking social return:', error);
                    }
                } finally {
                    setPendingVisit(null);
                }
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [firestore, pendingVisit]);

    return { trackClick };
};
