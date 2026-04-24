import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { X, Send, MessageSquare, Calendar, Mail, PhoneCall } from 'lucide-react';
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
    <div className="fixed inset-0 z-[1400] flex items-center justify-center p-3 sm:p-5">
      {alert?.show && <Alert type={alert.type} message={alert.message} onClose={hideAlert} />}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.96, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="glass-panel custom-scrollbar relative max-h-[92dvh] w-full max-w-4xl overflow-y-auto bg-primary p-5 rounded-[26px] sm:p-7 md:p-9 lg:p-10 lg:rounded-[32px]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-7 flex items-start justify-between gap-5 sm:mb-9">
          <div>
            <h2 className="text-xl font-bold sm:text-2xl">Contact Mahmoud</h2>
            <p className="mt-2 text-sm leading-6 text-sec sm:leading-7">Reach out for senior Flutter roles, product delivery, architecture support, or consulting.</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full">
            <X />
          </button>
        </div>

        {!firebaseEnabled && (
          <div className="mb-7 rounded-2xl border border-blue-500/20 bg-blue-500/8 px-5 py-4 text-sm leading-7 text-sec">
            This deployment is running in static mode. Messages and meeting requests will open in your email app instead of syncing to Firebase.
          </div>
        )}

        {!hideTabs && (
          <div className="mb-9 grid grid-cols-2 gap-2 rounded-2xl bg-black/5 p-1.5 dark:bg-white/5 sm:mb-12">
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

        <form onSubmit={activeTab === 'meeting' ? handleMeetingSubmit : handleMessageSubmit} className="flex flex-col gap-6 sm:gap-8">
          <input
            type="text"
            placeholder="Name"
            className="w-full rounded-2xl border border-black/10 bg-black/5 p-3.5 outline-none transition-colors focus:border-blue-500 dark:border-white/10 dark:bg-white/5 sm:p-4"
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
            className="w-full rounded-2xl border border-black/10 bg-black/5 p-3.5 outline-none transition-colors focus:border-blue-500 dark:border-white/10 dark:bg-white/5 sm:p-4"
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
              className="h-36 w-full resize-none rounded-2xl border border-black/10 bg-black/5 p-3.5 leading-7 outline-none transition-colors focus:border-blue-500 dark:border-white/10 dark:bg-white/5 sm:h-44 sm:p-4"
              required
              value={formData.message}
              onChange={(event) => setFormData((prev) => ({ ...prev, message: event.target.value }))}
            />
          ) : (
            <div className="rounded-[24px] border border-black/10 bg-black/[0.03] p-5 dark:border-white/10 dark:bg-white/[0.04] sm:p-6">
              <div className="grid gap-6 sm:gap-7">
                <div className="rounded-2xl border border-black/10 bg-white/35 px-4 py-3 text-sm text-sec dark:border-white/10 dark:bg-white/5 sm:px-5 sm:py-4">
                  <div className="font-semibold text-primary">Requested date</div>
                  <div className="mt-2">{selectedDateLabel}</div>
                </div>

                <input
                  type="text"
                  placeholder="What is this meeting about?"
                  className="w-full rounded-2xl border border-black/10 bg-white/35 p-3.5 outline-none transition-colors focus:border-blue-500 dark:border-white/10 dark:bg-white/5 sm:p-4"
                  value={meetingData.reason}
                  onChange={(event) => setMeetingData((prev) => ({ ...prev, reason: event.target.value }))}
                />

                <div className="grid grid-cols-2 gap-4 pt-1 sm:grid-cols-4 sm:gap-5 sm:pt-2">
                  {timeSlots.map((slot) => {
                    const userSlot = convertTimeToUser(slot);
                    const isTaken = takenSlots.includes(userSlot);

                    return (
                      <button
                        key={slot}
                        type="button"
                        disabled={isTaken}
                        onClick={() => setSelectedTime(userSlot)}
                        className={`rounded-xl border p-3 text-xs font-bold transition-all sm:p-3.5 ${
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
            </div>
          )}

          <div className="grid gap-5 md:grid-cols-2 md:gap-6">
            <a href={`mailto:${personalInfo.email}`} className="group flex min-h-[110px] flex-col justify-between rounded-[22px] border border-black/10 bg-black/5 px-5 py-5 text-sm text-sec transition-all hover:border-blue-500/20 hover:bg-blue-500/[0.02] dark:border-white/10 dark:bg-white/5 sm:min-h-[130px] sm:px-6 sm:py-6">
              <div className="flex items-center gap-2 font-semibold text-primary">
                <Mail size={16} className="text-blue-500" />
                Email
              </div>
              <div className="mt-3 break-all text-sm font-bold transition-colors group-hover:text-blue-500">{personalInfo.email}</div>
            </a>
            <a href={`tel:${personalInfo.phone.replace(/\s+/g, '')}`} className="rounded-[22px] border border-black/10 bg-black/5 px-5 py-5 text-sm text-sec transition-all hover:border-blue-500/20 hover:bg-blue-500/[0.02] dark:border-white/10 dark:bg-white/5 sm:px-6 sm:py-6">
              <div className="flex items-center gap-2 font-semibold text-primary">
                <PhoneCall size={16} className="text-blue-500" />
                Call Mahmoud
              </div>
              <div className="mt-3">{personalInfo.phone}</div>
            </a>
          </div>

          <button type="submit" disabled={isSubmitting} className="flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-500 py-4 font-bold text-white transition-colors hover:bg-blue-600 disabled:opacity-70 sm:py-4">
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
