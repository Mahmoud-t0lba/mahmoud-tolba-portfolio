import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { X, Send, MessageSquare, Calendar, Mail } from 'lucide-react';
import { doc, onSnapshot, runTransaction } from 'firebase/firestore';
import Alert from './Alert';
import useSafeAlert from '../hooks/useSafeAlert';
import { personalInfo } from '../data/portfolioData';
import { db, firebaseEnabled } from '../lib/firebase';

interface Meeting {
  Date: string;
  Time: string;
}

const timeSlots = ['09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'];

const MContact = ({ onClose, initialTab = 'meeting', hideTabs = false }: { onClose: () => void; initialTab?: 'message' | 'meeting'; hideTabs?: boolean }) => {
  const [activeTab, setActiveTab] = useState<'message' | 'meeting'>(firebaseEnabled ? initialTab : 'message');
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [meetingData, setMeetingData] = useState({ name: '', email: '', reason: '' });
  const [selectedDate] = useState<Date>(new Date());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [existingMeetings, setExistingMeetings] = useState<Meeting[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hostTimezoneString] = useState(personalInfo.currentTime || 'UTC+02:00');
  const [userTimezone] = useState<number>(() => -(new Date().getTimezoneOffset() / 60));
  const { alert, showAlert, hideAlert } = useSafeAlert(5000);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [onClose]);

  useEffect(() => {
    if (!firebaseEnabled || !db) return;

    const unsubMeetings = onSnapshot(doc(db, 'Settings', 'Canary'), (docSnap) => {
      if (!docSnap.exists()) return;

      const data = docSnap.data();
      const meetingsMap = (data.Meetings || {}) as Record<string, Partial<Meeting>>;
      const meetingsList = Object.values(meetingsMap).map((meeting) => ({
        Date: meeting.Date || '',
        Time: meeting.Time || ''
      }));

      setExistingMeetings(meetingsList);
    });

    return () => unsubMeetings();
  }, []);

  const formatDateDDMMYYYY = useCallback((date: Date) => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }, []);

  const getOffsetFromUTCString = (tzStr: string) => {
    const match = tzStr.match(/UTC([+-]\d{2}):(\d{2})/);
    if (!match) return 0;

    const hours = Number.parseInt(match[1], 10);
    const minutes = Number.parseInt(match[2], 10);
    return hours + (minutes / 60) * (hours < 0 ? -1 : 1);
  };

  const hostOffset = getOffsetFromUTCString(hostTimezoneString);
  const offsetDiff = userTimezone - hostOffset;

  const convertTimeToUser = useCallback((hostTimeStr: string) => {
    const [time, period] = hostTimeStr.split(' ');
    const [hoursValue, minutesValue] = time.split(':').map(Number);
    let hour = hoursValue;

    if (period === 'PM' && hour !== 12) hour += 12;
    if (period === 'AM' && hour === 12) hour = 0;

    const totalMinutes = (hour * 60 + minutesValue + offsetDiff * 60 + 1440) % 1440;
    const newHour = Math.floor(totalMinutes / 60);
    const newMinute = totalMinutes % 60;
    const newPeriod = newHour >= 12 ? 'PM' : 'AM';
    const displayHour = newHour % 12 || 12;

    return `${displayHour.toString().padStart(2, '0')}:${newMinute.toString().padStart(2, '0')} ${newPeriod}`;
  }, [offsetDiff]);

  const convertTimeToHost = useCallback((userTimeStr: string) => {
    const [time, period] = userTimeStr.split(' ');
    const [hoursValue, minutesValue] = time.split(':').map(Number);
    let hour = hoursValue;

    if (period === 'PM' && hour !== 12) hour += 12;
    if (period === 'AM' && hour === 12) hour = 0;

    const totalMinutes = (hour * 60 + minutesValue - offsetDiff * 60 + 1440) % 1440;
    const newHour = Math.floor(totalMinutes / 60);
    const newMinute = totalMinutes % 60;
    const newPeriod = newHour >= 12 ? 'PM' : 'AM';
    const displayHour = newHour % 12 || 12;

    return `${displayHour.toString().padStart(2, '0')}:${newMinute.toString().padStart(2, '0')} ${newPeriod}`;
  }, [offsetDiff]);

  const selectedDateLabel = useMemo(() => formatDateDDMMYYYY(selectedDate), [formatDateDDMMYYYY, selectedDate]);

  const takenSlots = useMemo(() => {
    if (!firebaseEnabled) return [];
    return existingMeetings
      .filter((meeting) => meeting.Date === selectedDateLabel)
      .map((meeting) => convertTimeToUser(meeting.Time));
  }, [convertTimeToUser, existingMeetings, selectedDateLabel]);

  const openMailDraft = (subject: string, body: string) => {
    const mailto = `mailto:${personalInfo.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailto;
  };

  const handleMeetingSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!selectedTime) {
      showAlert({ type: 'error', message: 'Pick a time slot first.' });
      return;
    }

    const subject = `Meeting request from ${meetingData.name || 'Portfolio visitor'}`;
    const body = [
      `Name: ${meetingData.name}`,
      `Email: ${meetingData.email}`,
      `Requested date: ${selectedDateLabel}`,
      `Requested time (${hostTimezoneString}): ${convertTimeToHost(selectedTime)}`,
      `User local time: ${selectedTime}`,
      `Reason: ${meetingData.reason || 'General discussion'}`
    ].join('\n');

    if (!firebaseEnabled || !db) {
      openMailDraft(subject, body);
      showAlert({ type: 'success', message: 'Opening your email app with the meeting request.' });
      return;
    }

    setIsSubmitting(true);

    try {
      const docRef = doc(db, 'Settings', 'Canary');
      const hostTime = convertTimeToHost(selectedTime);

      await runTransaction(db, async (transaction) => {
        const docSnap = await transaction.get(docRef);
        let nextId = '1';

        if (docSnap.exists()) {
          const data = docSnap.data();
          const meetings = data.Meetings || {};
          const keys = Object.keys(meetings).map((key) => Number.parseInt(key, 10)).filter((key) => !Number.isNaN(key));
          if (keys.length > 0) nextId = (Math.max(...keys) + 1).toString();
        }

        transaction.set(docRef, {
          Meetings: {
            [nextId]: {
              Date: selectedDateLabel,
              Time: hostTime,
              UserLocalTime: selectedTime,
              UserTimezone: userTimezone,
              Email: meetingData.email,
              'What For': meetingData.reason,
              Name: meetingData.name,
              timestamp: Date.now()
            }
          }
        }, { merge: true });
      });

      showAlert({ type: 'success', message: 'Meeting request saved.' });
      setTimeout(onClose, 1200);
    } catch {
      showAlert({ type: 'error', message: 'Could not save the meeting request.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMessageSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const subject = `Portfolio message from ${formData.name || 'Visitor'}`;
    const body = [
      `Name: ${formData.name}`,
      `Email: ${formData.email}`,
      '',
      formData.message
    ].join('\n');

    if (!firebaseEnabled || !db) {
      openMailDraft(subject, body);
      showAlert({ type: 'success', message: 'Opening your email app with a drafted message.' });
      return;
    }

    setIsSubmitting(true);

    try {
      const docRef = doc(db, 'Settings', 'Canary');

      await runTransaction(db, async (transaction) => {
        const docSnap = await transaction.get(docRef);
        let nextId = '1';

        if (docSnap.exists()) {
          const data = docSnap.data();
          const emails = data.Emails || {};
          const keys = Object.keys(emails).map((key) => Number.parseInt(key, 10)).filter((key) => !Number.isNaN(key));
          if (keys.length > 0) nextId = (Math.max(...keys) + 1).toString();
        }

        transaction.set(docRef, {
          Emails: {
            [nextId]: {
              Name: formData.name,
              Email: formData.email,
              Message: formData.message,
              Timestamp: Date.now()
            }
          }
        }, { merge: true });
      });

      showAlert({ type: 'success', message: 'Message sent successfully.' });
      setTimeout(onClose, 1200);
    } catch {
      showAlert({ type: 'error', message: 'Failed to send the message.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[1400] flex items-center justify-center p-4">
      {alert?.show && <Alert type={alert.type} message={alert.message} onClose={hideAlert} />}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.96, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="glass-panel relative w-full max-w-2xl overflow-hidden bg-primary p-8 rounded-3xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold">Contact Mahmoud</h2>
            <p className="text-sm text-sec mt-1">Reach out for senior Flutter roles, product delivery, or consulting.</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full">
            <X />
          </button>
        </div>

        {!firebaseEnabled && (
          <div className="mb-5 rounded-2xl border border-blue-500/20 bg-blue-500/8 px-4 py-3 text-sm text-sec">
            This deployment is running in static mode. Messages and meeting requests will open in your email app instead of syncing to Firebase.
          </div>
        )}

        {!hideTabs && (
          <div className="mb-6 grid grid-cols-2 gap-2 rounded-2xl bg-black/5 dark:bg-white/5 p-1.5">
            <button
              type="button"
              onClick={() => setActiveTab('message')}
              className={`rounded-xl px-4 py-3 text-sm font-bold transition-all ${activeTab === 'message' ? 'bg-blue-500 text-white' : 'text-sec'}`}
            >
              <span className="inline-flex items-center gap-2">
                <MessageSquare size={16} />
                Message
              </span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('meeting')}
              className={`rounded-xl px-4 py-3 text-sm font-bold transition-all ${activeTab === 'meeting' ? 'bg-blue-500 text-white' : 'text-sec'}`}
            >
              <span className="inline-flex items-center gap-2">
                <Calendar size={16} />
                Meeting
              </span>
            </button>
          </div>
        )}

        <form onSubmit={activeTab === 'meeting' ? handleMeetingSubmit : handleMessageSubmit} className="space-y-5">
          <input
            type="text"
            placeholder="Name"
            className="w-full p-3 rounded-xl bg-black/5 dark:bg-white/5 border border-transparent focus:border-blue-500 outline-none"
            required
            value={activeTab === 'meeting' ? meetingData.name : formData.name}
            onChange={(event) => (
              activeTab === 'meeting'
                ? setMeetingData((prev) => ({ ...prev, name: event.target.value }))
                : setFormData((prev) => ({ ...prev, name: event.target.value }))
            )}
          />

          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 rounded-xl bg-black/5 dark:bg-white/5 border border-transparent focus:border-blue-500 outline-none"
            required
            value={activeTab === 'meeting' ? meetingData.email : formData.email}
            onChange={(event) => (
              activeTab === 'meeting'
                ? setMeetingData((prev) => ({ ...prev, email: event.target.value }))
                : setFormData((prev) => ({ ...prev, email: event.target.value }))
            )}
          />

          {activeTab === 'message' ? (
            <textarea
              placeholder="Tell Mahmoud a little about the role, product, or help you need."
              className="w-full p-3 h-36 rounded-xl bg-black/5 dark:bg-white/5 border border-transparent focus:border-blue-500 outline-none resize-none"
              required
              value={formData.message}
              onChange={(event) => setFormData((prev) => ({ ...prev, message: event.target.value }))}
            />
          ) : (
            <div className="space-y-4">
              <div className="rounded-2xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 px-4 py-3 text-sm text-sec">
                <div className="font-semibold text-primary">Requested date</div>
                <div className="mt-1">{selectedDateLabel}</div>
              </div>

              <input
                type="text"
                placeholder="What is this meeting about?"
                className="w-full p-3 rounded-xl bg-black/5 dark:bg-white/5 border border-transparent focus:border-blue-500 outline-none"
                value={meetingData.reason}
                onChange={(event) => setMeetingData((prev) => ({ ...prev, reason: event.target.value }))}
              />

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {timeSlots.map((slot) => {
                  const userSlot = convertTimeToUser(slot);
                  const isTaken = takenSlots.includes(userSlot);

                  return (
                    <button
                      key={slot}
                      type="button"
                      disabled={isTaken}
                      onClick={() => setSelectedTime(userSlot)}
                      className={`p-2 text-xs rounded-lg border transition-all ${
                        selectedTime === userSlot
                          ? 'bg-blue-500 text-white border-blue-500'
                          : isTaken
                            ? 'border-black/5 dark:border-white/5 text-muted opacity-50 cursor-not-allowed'
                            : 'border-black/10 dark:border-white/10 hover:border-blue-500'
                      }`}
                    >
                      {userSlot}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div className="rounded-2xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 px-4 py-3 text-sm text-sec">
            <div className="flex items-center gap-2 text-primary font-semibold">
              <Mail size={16} className="text-blue-500" />
              Direct contact
            </div>
            <div className="mt-2">{personalInfo.email}</div>
          </div>

          <button type="submit" disabled={isSubmitting} className="w-full py-4 bg-blue-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-600 transition-colors disabled:opacity-70">
            {isSubmitting
              ? 'Sending...'
              : activeTab === 'meeting'
                ? firebaseEnabled ? 'Request Meeting' : 'Open Meeting Email'
                : firebaseEnabled ? 'Send Message' : 'Open Email Draft'}
            <Send size={18} />
          </button>
        </form>
      </motion.div>
    </div>,
    document.body
  );
};

export default MContact;
