import admin from 'firebase-admin';

import saveUserData from './save-user-data';
import sendGeneralNotification from './notifications';
import scheduleNotifications from './schedule-notifications';
import optimizeImages from './optimize-images';
import mailchimpSubscribe from './mailchimp-subscribe';
import prerender from './prerender';
import { scheduleWrite, sessionsWrite, speakersWrite } from './generate-sessions-speakers-schedule';
import {
  blogWrite,
  galleryWrite,
  videosWrite,
  usersWrite,
  featuredSessionsWrite,
  previousSpeakersWrite,
  partnersWrite,
  ticketsWrite,
  teamWrite,
} from './firestore-to-realtime';

admin.initializeApp();

export {
  saveUserData,
  sendGeneralNotification,
  scheduleNotifications,
  optimizeImages,
  mailchimpSubscribe,
  prerender,
  blogWrite,
  featuredSessionsWrite,
  galleryWrite,
  partnersWrite,
  previousSpeakersWrite,
  scheduleWrite,
  sessionsWrite,
  speakersWrite,
  teamWrite,
  ticketsWrite,
  usersWrite,
  videosWrite,
}
