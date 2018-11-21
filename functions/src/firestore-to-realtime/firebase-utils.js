import { database, firestore } from 'firebase-admin';

export const migrateData = (firestorePath, rtDBPath) => {
  return getFirestoreData(firestorePath)
    .then(data => saveRealTimeData(data, rtDBPath));
};

export function getFirestoreData(path) {
  const source = getPathObject(path);
  return fetchDataFromFirestore(source.collection, source.doc);
}

export function saveFirestoreData(data, path) {
  const destination = getPathObject(path);
  return saveDataToFirestore(data, destination.collection, destination.doc);
}

export function saveRealTimeData(data, path) {
  return database().ref(path).set(data);
}

export async function fetchDataFromFirestore(collection, doc, deep = 1) {
  if (!doc) {
    const collectionSnapshot = await firestore().collection(collection).get();
    const collectionData = {};

    for (const collectionDoc of collectionSnapshot.docs) {
      const subCollectionsData = {};

      if (deep > 0) {
        const subCollections = await collectionDoc.ref.getCollections();

        for (const subCollection of subCollections) {
          subCollectionsData[subCollection.id] = await fetchDataFromFirestore(`${collection}/${collectionDoc.id}/${subCollection.id}`, null, deep - 1);
        }
      }

      collectionData[collectionDoc.id] = {
        ...collectionDoc.data(),
        ...subCollectionsData
      };
    }

    return collectionData;
  }

  const document = await firestore().collection(collection).doc(doc).get();
  return document.data();
}

export function saveDataToFirestore(data, collection, doc) {
  if (!doc) {
    const batch = firestore().batch();
    Object.entries(data).forEach(([key, value]) => {
      const docRef = firestore().collection(collection).doc(key);
      batch.set(docRef, value);
    });
    return batch.commit();
  }
  return firestore().collection(collection).doc(doc).set(data);
}


export function getPathObject(params) {
  const normalizedParams = params.replace(/\/$/, '');

  if (normalizedParams.split('/').length % 2 !== 0) {
    return {
      collection: normalizedParams,
    };
  }
  return {
    collection: normalizedParams.slice(0, normalizedParams.lastIndexOf('/')),
    doc: normalizedParams.slice(normalizedParams.lastIndexOf('/') + 1),
  };
}
