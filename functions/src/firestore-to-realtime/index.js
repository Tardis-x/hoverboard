import * as functions from 'firebase-functions';
import { migrateData } from './firebase-utils';

const MAPPING = {
  BLOG: {
    firestore: 'blog'
  },
  GALLERY: {
    firestore: 'gallery'
  },
  PARTNERS: {
    firestore: 'partners'
  },
  TEAM: {
    firestore: 'team'
  },
  TICKETS: {
    firestore: 'tickets'
  },
  VIDEOS: {
    firestore: 'videos'
  },
  FEATURED_SESSIONS: {
    firestore: 'featuredSessions'
  },
  PREVIOUS_SPEAKER: {
    firestore: 'previousSpeakers'
  },
  USERS: {
    firestore: 'users',
    realTime: 'usersWeb'
  }
};

export const blogWrite = functions.firestore.document(`${MAPPING.BLOG.firestore}/{docId}`).onWrite( async () => {
  return migrateData(MAPPING.BLOG.firestore, MAPPING.BLOG.firestore);
});

export const galleryWrite = functions.firestore.document(`${MAPPING.GALLERY.firestore}/{docId}`).onWrite( async () => {
  return migrateData(MAPPING.GALLERY.firestore, MAPPING.GALLERY.firestore);
});

export const videosWrite = functions.firestore.document(`${MAPPING.VIDEOS.firestore}/{docId}`).onWrite( async () => {
  return migrateData(MAPPING.VIDEOS.firestore, MAPPING.VIDEOS.firestore);
});

export const featuredSessionsWrite = functions.firestore.document(`${MAPPING.FEATURED_SESSIONS.firestore}/{docId}`).onWrite( async () => {
  return migrateData(MAPPING.FEATURED_SESSIONS.firestore, MAPPING.FEATURED_SESSIONS.firestore);
});

export const previousSpeakersWrite = functions.firestore.document(`${MAPPING.PREVIOUS_SPEAKER.firestore}/{docId}`).onWrite( async () => {
  return migrateData(MAPPING.PREVIOUS_SPEAKER.firestore, MAPPING.PREVIOUS_SPEAKER.firestore);
});

export const usersWrite = functions.firestore.document(`${MAPPING.USERS.firestore}/{docId}`).onWrite( async () => {
  return migrateData(MAPPING.USERS.firestore, MAPPING.USERS.realTime);
});

export const partnersWrite = functions.firestore.document(`${MAPPING.PARTNERS.firestore}/{docId}`).onWrite( async () => {
  return migrateData(MAPPING.PARTNERS.firestore, MAPPING.PARTNERS.firestore);
});

export const ticketsWrite = functions.firestore.document(`${MAPPING.TICKETS.firestore}/{docId}`).onWrite( async () => {
  return migrateData(MAPPING.TICKETS.firestore, MAPPING.TICKETS.firestore);
});

export const teamWrite = functions.firestore.document(`${MAPPING.TEAM.firestore}/{docId}`).onWrite( async () => {
  return migrateData(MAPPING.TEAM.firestore, MAPPING.TEAM.firestore);
});
