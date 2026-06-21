import { doc, collection, onSnapshot, updateDoc, setDoc, addDoc, deleteDoc, query, orderBy, limit } from 'firebase/firestore';
import { db, isMockFirebase } from './firebase';
import * as mock from './mockData';

// Helper for Local Storage persistence in Demo/Mock Mode
function getLocalData(key, fallback) {
  if (typeof window === 'undefined') return fallback;
  const val = localStorage.getItem(key);
  if (!val) {
    // Save fallback to localStorage so it is editable
    localStorage.setItem(key, JSON.stringify(fallback));
    return fallback;
  }
  try {
    return JSON.parse(val);
  } catch {
    return fallback;
  }
}

function setLocalData(key, data) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(data));
  // Dispatch custom event to notify other components/tabs in real-time
  window.dispatchEvent(new Event('mock-data-updated'));
}

// Helper to wrap subscriptions with fallbacks
function safeSubscribe(ref, callback, fallbackValue, isDoc = true) {
  if (isMockFirebase) {
    const key = ref.path; // e.g. "settings/global"
    const handleUpdate = () => {
      callback(getLocalData(key, fallbackValue));
    };
    handleUpdate();
    if (typeof window !== 'undefined') {
      window.addEventListener('mock-data-updated', handleUpdate);
      window.addEventListener('storage', handleUpdate);
    }
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('mock-data-updated', handleUpdate);
        window.removeEventListener('storage', handleUpdate);
      }
    };
  }

  try {
    return onSnapshot(ref, 
      (snapshot) => {
        if (isDoc) {
          if (snapshot.exists()) {
            callback(snapshot.data());
          } else {
            callback(fallbackValue);
          }
        } else {
          const list = [];
          snapshot.forEach(doc => {
            list.push({ id: doc.id, ...doc.data() });
          });
          callback(list.length > 0 ? list : fallbackValue);
        }
      },
      (error) => {
        console.warn("Firestore subscription error, using mock data:", error);
        callback(fallbackValue);
      }
    );
  } catch (e) {
    console.warn("Firestore setup error, using mock data:", e);
    callback(fallbackValue);
    return () => {}; // return dummy unsubscribe
  }
}

export function subscribeToSettings(masjidId, callback) {
  const ref = doc(db, 'masjids', masjidId, 'settings', 'global');
  return safeSubscribe(ref, callback, mock.defaultSettings);
}

export function subscribeToJadwal(masjidId, callback) {
  const ref = doc(db, 'masjids', masjidId, 'jadwal', 'sholat');
  return safeSubscribe(ref, callback, mock.defaultJadwalSholat);
}

export function subscribeToSholatJumat(masjidId, callback) {
  if (isMockFirebase) {
    const handleUpdate = () => {
      callback(getLocalData(masjidId + '/sholat_jumat/default', mock.defaultSholatJumat));
    };
    handleUpdate();
    if (typeof window !== 'undefined') {
      window.addEventListener('mock-data-updated', handleUpdate);
      window.addEventListener('storage', handleUpdate);
    }
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('mock-data-updated', handleUpdate);
        window.removeEventListener('storage', handleUpdate);
      }
    };
  }

  const q = query(collection(db, 'masjids', masjidId, 'sholat_jumat'), orderBy('tanggal', 'asc'), limit(1));
  try {
    return onSnapshot(q, (snapshot) => {
      let data = null;
      snapshot.forEach(doc => {
        data = { id: doc.id, ...doc.data() };
      });
      callback(data || mock.defaultSholatJumat);
    }, (error) => {
      console.warn("Firestore sholat jumat error, using mock data:", error);
      callback(mock.defaultSholatJumat);
    });
  } catch (e) {
    console.warn("Firestore setup error for sholat jumat, using mock data:", e);
    callback(mock.defaultSholatJumat);
    return () => {};
  }
}

export function subscribeToPengumuman(masjidId, callback) {
  if (isMockFirebase) {
    const handleUpdate = () => {
      callback(getLocalData(masjidId + '/pengumuman', mock.defaultPengumuman));
    };
    handleUpdate();
    if (typeof window !== 'undefined') {
      window.addEventListener('mock-data-updated', handleUpdate);
      window.addEventListener('storage', handleUpdate);
    }
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('mock-data-updated', handleUpdate);
        window.removeEventListener('storage', handleUpdate);
      }
    };
  }

  const q = query(collection(db, 'masjids', masjidId, 'pengumuman'), orderBy('tanggal', 'asc'));
  try {
    return onSnapshot(q, (snapshot) => {
      const list = [];
      snapshot.forEach(doc => {
        list.push({ id: doc.id, ...doc.data() });
      });
      callback(list.length > 0 ? list : mock.defaultPengumuman);
    }, (error) => {
      console.warn("Firestore pengumuman error, using mock data:", error);
      callback(mock.defaultPengumuman);
    });
  } catch (e) {
    console.warn("Firestore setup error for pengumuman, using mock data:", e);
    callback(mock.defaultPengumuman);
    return () => {};
  }
}

export function subscribeToKeuangan(masjidId, callback) {
  if (isMockFirebase) {
    const handleUpdate = () => {
      callback(getLocalData(masjidId + '/keuangan', mock.defaultKeuangan));
    };
    handleUpdate();
    if (typeof window !== 'undefined') {
      window.addEventListener('mock-data-updated', handleUpdate);
      window.addEventListener('storage', handleUpdate);
    }
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('mock-data-updated', handleUpdate);
        window.removeEventListener('storage', handleUpdate);
      }
    };
  }

  const q = query(collection(db, 'masjids', masjidId, 'keuangan'), orderBy('tanggal', 'desc'), limit(20));
  try {
    return onSnapshot(q, (snapshot) => {
      const list = [];
      snapshot.forEach(doc => {
        list.push({ id: doc.id, ...doc.data() });
      });
      callback(list.length > 0 ? list : mock.defaultKeuangan);
    }, (error) => {
      console.warn("Firestore keuangan error, using mock data:", error);
      callback(mock.defaultKeuangan);
    });
  } catch (e) {
    console.warn("Firestore setup error for keuangan, using mock data:", e);
    callback(mock.defaultKeuangan);
    return () => {};
  }
}

export function subscribeToQris(masjidId, callback) {
  if (isMockFirebase) {
    const handleUpdate = () => {
      callback(getLocalData(masjidId + '/qris', mock.defaultQris));
    };
    handleUpdate();
    if (typeof window !== 'undefined') {
      window.addEventListener('mock-data-updated', handleUpdate);
      window.addEventListener('storage', handleUpdate);
    }
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('mock-data-updated', handleUpdate);
        window.removeEventListener('storage', handleUpdate);
      }
    };
  }

  const q = query(collection(db, 'masjids', masjidId, 'qris'), limit(1));
  try {
    return onSnapshot(q, (snapshot) => {
      let data = null;
      snapshot.forEach(doc => {
        data = { id: doc.id, ...doc.data() };
      });
      callback(data || mock.defaultQris);
    }, (error) => {
      console.warn("Firestore qris error, using mock data:", error);
      callback(mock.defaultQris);
    });
  } catch (e) {
    console.warn("Firestore setup error for qris, using mock data:", e);
    callback(mock.defaultQris);
    return () => {};
  }
}

export function subscribeToIdulFitri(masjidId, callback) {
  const ref = doc(db, 'masjids', masjidId, 'idul_fitri', 'default');
  return safeSubscribe(ref, callback, mock.defaultIdulFitri);
}

export function subscribeToIdulAdha(masjidId, callback) {
  const ref = doc(db, 'masjids', masjidId, 'idul_adha', 'default');
  return safeSubscribe(ref, callback, mock.defaultIdulAdha);
}

// Client-side automatic prayer times updates (Zero-Setup)
export async function updateJadwalSholatFirestore(masjidId, sholatTimes) {
  if (isMockFirebase) {
    const existing = getLocalData(`masjids/${masjidId}/jadwal/sholat`, mock.defaultJadwalSholat);
    const updated = {
      ...existing,
      ...sholatTimes,
      updated_at: new Date().toISOString()
    };
    setLocalData(`masjids/${masjidId}/jadwal/sholat`, updated);

    // Also update settings last_update timestamp
    const settings = getLocalData(`masjids/${masjidId}/settings/global`, mock.defaultSettings);
    settings.auto_update = {
      ...settings.auto_update,
      last_update: new Date().toISOString()
    };
    setLocalData(`masjids/${masjidId}/settings/global`, settings);
    return true;
  }

  try {
    const ref = doc(db, 'masjids', masjidId, 'jadwal', 'sholat');
    await setDoc(ref, {
      ...sholatTimes,
      updated_at: new Date().toISOString()
    }, { merge: true });
    
    // Also update settings last_update timestamp
    const settingsRef = doc(db, 'masjids', masjidId, 'settings', 'global');
    await setDoc(settingsRef, {
      auto_update: {
        last_update: new Date().toISOString()
      }
    }, { merge: true });
    console.log("Successfully updated prayer times in Firestore!");
    return true;
  } catch (error) {
    console.error("Failed to update prayer times in Firestore:", error);
    return false;
  }
}

// Write Helpers for Admin Panel

export async function updateSettings(masjidId, data) {
  if (isMockFirebase) {
    setLocalData(`masjids/${masjidId}/settings/global`, data);
    return true;
  }

  try {
    const ref = doc(db, 'masjids', masjidId, 'settings', 'global');
    await setDoc(ref, data, { merge: true });
    return true;
  } catch (error) {
    console.error("Error updating settings:", error);
    return false;
  }
}

export async function updateJadwal(masjidId, data) {
  if (isMockFirebase) {
    const existing = getLocalData(`masjids/${masjidId}/jadwal/sholat`, mock.defaultJadwalSholat);
    const updated = {
      ...existing,
      ...data,
      updated_at: new Date().toISOString()
    };
    setLocalData(`masjids/${masjidId}/jadwal/sholat`, updated);
    return true;
  }

  try {
    const ref = doc(db, 'masjids', masjidId, 'jadwal', 'sholat');
    await setDoc(ref, {
      ...data,
      updated_at: new Date().toISOString()
    }, { merge: true });
    return true;
  } catch (error) {
    console.error("Error updating jadwal:", error);
    return false;
  }
}

export async function updateSholatJumat(masjidId, data) {
  if (isMockFirebase) {
    setLocalData(`masjids/${masjidId}/sholat_jumat/default`, data);
    return true;
  }

  try {
    const colRef = collection(db, 'masjids', masjidId, 'sholat_jumat');
    const docRef = doc(colRef, 'default');
    await setDoc(docRef, data, { merge: true });
    return true;
  } catch (error) {
    console.error("Error updating sholat jumat:", error);
    return false;
  }
}

export async function addPengumuman(masjidId, data) {
  if (isMockFirebase) {
    const existing = getLocalData(`masjids/${masjidId}/pengumuman`, mock.defaultPengumuman);
    const newDoc = {
      id: Math.random().toString(36).substring(2, 9),
      ...data
    };
    setLocalData(`masjids/${masjidId}/pengumuman`, [...existing, newDoc]);
    return true;
  }

  try {
    const colRef = collection(db, 'masjids', masjidId, 'pengumuman');
    await addDoc(colRef, data);
    return true;
  } catch (error) {
    console.error("Error adding pengumuman:", error);
    return false;
  }
}

export async function deletePengumuman(masjidId, id) {
  if (isMockFirebase) {
    const existing = getLocalData(`masjids/${masjidId}/pengumuman`, mock.defaultPengumuman);
    setLocalData(`masjids/${masjidId}/pengumuman`, existing.filter(item => item.id !== id));
    return true;
  }

  try {
    const docRef = doc(db, 'masjids', masjidId, 'pengumuman', id);
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    console.error("Error deleting pengumuman:", error);
    return false;
  }
}

export async function addKeuangan(masjidId, data) {
  if (isMockFirebase) {
    const existing = getLocalData(`masjids/${masjidId}/keuangan`, mock.defaultKeuangan);
    const newDoc = {
      id: Math.random().toString(36).substring(2, 9),
      ...data
    };
    setLocalData(`masjids/${masjidId}/keuangan`, [newDoc, ...existing]);
    return true;
  }

  try {
    const colRef = collection(db, 'masjids', masjidId, 'keuangan');
    await addDoc(colRef, data);
    return true;
  } catch (error) {
    console.error("Error adding keuangan:", error);
    return false;
  }
}

export async function deleteKeuangan(masjidId, id) {
  if (isMockFirebase) {
    const existing = getLocalData(`masjids/${masjidId}/keuangan`, mock.defaultKeuangan);
    setLocalData(`masjids/${masjidId}/keuangan`, existing.filter(item => item.id !== id));
    return true;
  }

  try {
    const docRef = doc(db, 'masjids', masjidId, 'keuangan', id);
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    console.error("Error deleting keuangan:", error);
    return false;
  }
}

export async function updateQris(masjidId, data) {
  if (isMockFirebase) {
    setLocalData(`masjids/${masjidId}/qris`, data);
    return true;
  }

  try {
    const colRef = collection(db, 'masjids', masjidId, 'qris');
    const docRef = doc(colRef, 'default');
    await setDoc(docRef, data, { merge: true });
    return true;
  } catch (error) {
    console.error("Error updating qris:", error);
    return false;
  }
}

export async function updateIdulFitri(masjidId, data) {
  if (isMockFirebase) {
    setLocalData(`masjids/${masjidId}/idul_fitri/default`, data);
    return true;
  }

  try {
    const ref = doc(db, 'masjids', masjidId, 'idul_fitri', 'default');
    await setDoc(ref, data, { merge: true });
    return true;
  } catch (error) {
    console.error("Error updating idul fitri:", error);
    return false;
  }
}

export async function updateIdulAdha(masjidId, data) {
  if (isMockFirebase) {
    setLocalData(`masjids/${masjidId}/idul_adha/default`, data);
    return true;
  }

  try {
    const ref = doc(db, 'masjids', masjidId, 'idul_adha', 'default');
    await setDoc(ref, data, { merge: true });
    return true;
  } catch (error) {
    console.error("Error updating idul adha:", error);
    return false;
  }
}
