import * as functions from 'firebase-functions';
import { firestore } from 'firebase-admin';
import mapSessionsSpeakersSchedule from './schedule-generator/speakers-sessions-schedule-map';
import mapSessionsSpeakers from './schedule-generator/speakers-sessions-map';
import { saveFirestoreData, saveRealTimeData } from './firestore-to-realtime/firebase-utils';

export const sessionsWrite = functions.firestore.document('sessions/{sessionId}').onWrite( async () => {
    return generateAndSaveData();
});

export const scheduleWrite = functions.firestore.document('schedule/{scheduleId}').onWrite( async () => {
    const scheduleConfig = functions.config().schedule;
    const scheduleEnabled = scheduleConfig && scheduleConfig.enabled === 'true';
    return scheduleEnabled && generateAndSaveData();
});

export const speakersWrite = functions.firestore.document('speakers/{speakerId}').onWrite( async (change, context) => {
    const changedSpeaker = change.after.exists ? { id: context.params.speakerId, ...change.after.data() } : null;
    return generateAndSaveData(changedSpeaker);
});

async function generateAndSaveData(changedSpeaker) {
    const sessionsPromise = firestore().collection('sessions').get();
    const schedulePromise = firestore().collection('schedule').orderBy('date', 'desc').get();
    const speakersPromise = firestore().collection('speakers').get();

    const [sessionsSnapshot, scheduleSnapshot, speakersSnapshot] = await Promise.all([sessionsPromise, schedulePromise, speakersPromise]);

    const sessions = {};
    const schedule = {};
    const speakers = {};

    sessionsSnapshot.forEach((doc) => {
        sessions[doc.id] = doc.data();
    });

    scheduleSnapshot.forEach((doc) => {
        schedule[doc.id] = doc.data();
    });

    speakersSnapshot.forEach((doc) => {
        speakers[doc.id] = doc.data();
    });

    let generatedData = {};
    const scheduleConfig = functions.config().schedule;
    const scheduleEnabled = scheduleConfig && scheduleConfig.enabled === 'true';

    if (!Object.keys(sessions).length) {
        generatedData = { ...speakers };
    }
    else if (!scheduleEnabled || !Object.keys(schedule).length) {
        generatedData = mapSessionsSpeakers(sessions, speakers);
    }
    else {
        generatedData = mapSessionsSpeakersSchedule(sessions, speakers, schedule);
    }

    // If changed speaker does not have assigned session(s) yet
    if (changedSpeaker && !generatedData.speakers[changedSpeaker.id]) {
        generatedData.speakers[changedSpeaker.id] = changedSpeaker;
    }

    return Promise.all([
      saveFirestoreData(generatedData.sessions, 'generatedSessions'),
      saveFirestoreData(generatedData.speakers, 'generatedSpeakers'),
      saveFirestoreData(generatedData.schedule, 'generatedSchedule'),
      saveRealTimeData(generatedData.sessions, 'generatedSessions'),
      saveRealTimeData(generatedData.speakers, 'generatedSpeakers'),
      saveRealTimeData(generatedData.schedule, 'generatedSchedule'),
      saveRealTimeData(sessions, 'sessions'),
      saveRealTimeData(speakers, 'speakers'),
      saveRealTimeData(schedule, 'schedule'),
    ]);
}
