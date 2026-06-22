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
  const isDemo = ref.path.includes('demo-masjid');
  if (isMockFirebase || isDemo) {
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

export function subscribeToMasjidRoot(masjidId, callback) {
  const ref = doc(db, 'masjids', masjidId);
  return safeSubscribe(ref, callback, masjidId === 'demo-masjid' ? { payment_status: "paid", ownerUid: "demo", subscription_package: "premium" } : null);
}

export function subscribeToSettings(masjidId, callback) {
  const ref = doc(db, 'masjids', masjidId, 'settings', 'global');
  const fallback = masjidId === 'demo-masjid' ? mock.defaultSettings : mock.emptySettings;
  return safeSubscribe(ref, callback, fallback);
}

export function subscribeToJadwal(masjidId, callback) {
  const ref = doc(db, 'masjids', masjidId, 'jadwal', 'sholat');
  const fallback = masjidId === 'demo-masjid' ? mock.defaultJadwalSholat : mock.emptyJadwalSholat;
  return safeSubscribe(ref, callback, fallback);
}

export function subscribeToSholatJumat(masjidId, callback) {
  const fallback = masjidId === 'demo-masjid' ? mock.defaultSholatJumat : mock.emptySholatJumat;
  if (isMockFirebase || masjidId === 'demo-masjid') {
    const handleUpdate = () => {
      callback(getLocalData(masjidId + '/sholat_jumat/default', fallback));
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
      callback(data || fallback);
    }, (error) => {
      console.warn("Firestore sholat jumat error, using mock data:", error);
      callback(fallback);
    });
  } catch (e) {
    console.warn("Firestore setup error for sholat jumat, using mock data:", e);
    callback(fallback);
    return () => {};
  }
}

export function subscribeToPengumuman(masjidId, callback) {
  const fallback = masjidId === 'demo-masjid' ? mock.defaultPengumuman : mock.emptyPengumuman;
  if (isMockFirebase || masjidId === 'demo-masjid') {
    const handleUpdate = () => {
      callback(getLocalData(masjidId + '/pengumuman', fallback));
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
      callback(list.length > 0 ? list : fallback);
    }, (error) => {
      console.warn("Firestore pengumuman error, using mock data:", error);
      callback(fallback);
    });
  } catch (e) {
    console.warn("Firestore setup error for pengumuman, using mock data:", e);
    callback(fallback);
    return () => {};
  }
}

export function subscribeToKeuangan(masjidId, callback) {
  const fallback = masjidId === 'demo-masjid' ? mock.defaultKeuangan : mock.emptyKeuangan;
  if (isMockFirebase || masjidId === 'demo-masjid') {
    const handleUpdate = () => {
      callback(getLocalData(masjidId + '/keuangan', fallback));
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
      callback(list.length > 0 ? list : fallback);
    }, (error) => {
      console.warn("Firestore keuangan error, using mock data:", error);
      callback(fallback);
    });
  } catch (e) {
    console.warn("Firestore setup error for keuangan, using mock data:", e);
    callback(fallback);
    return () => {};
  }
}

export function subscribeToQris(masjidId, callback) {
  const fallback = masjidId === 'demo-masjid' ? mock.defaultQris : mock.emptyQris;
  if (isMockFirebase || masjidId === 'demo-masjid') {
    const handleUpdate = () => {
      callback(getLocalData(masjidId + '/qris', fallback));
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
      callback(data || fallback);
    }, (error) => {
      console.warn("Firestore qris error, using mock data:", error);
      callback(fallback);
    });
  } catch (e) {
    console.warn("Firestore setup error for qris, using mock data:", e);
    callback(fallback);
    return () => {};
  }
}

export function subscribeToIdulFitri(masjidId, callback) {
  const ref = doc(db, 'masjids', masjidId, 'idul_fitri', 'default');
  const fallback = masjidId === 'demo-masjid' ? mock.defaultIdulFitri : mock.emptyIdulFitri;
  return safeSubscribe(ref, callback, fallback);
}

export function subscribeToIdulAdha(masjidId, callback) {
  const ref = doc(db, 'masjids', masjidId, 'idul_adha', 'default');
  const fallback = masjidId === 'demo-masjid' ? mock.defaultIdulAdha : mock.emptyIdulAdha;
  return safeSubscribe(ref, callback, fallback);
}

// Client-side automatic prayer times updates (Zero-Setup)
export async function updateJadwalSholatFirestore(masjidId, sholatTimes) {
  if (isMockFirebase || masjidId === 'demo-masjid') {
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
  if (isMockFirebase || masjidId === 'demo-masjid') {
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
  if (isMockFirebase || masjidId === 'demo-masjid') {
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
  if (isMockFirebase || masjidId === 'demo-masjid') {
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
  if (isMockFirebase || masjidId === 'demo-masjid') {
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
  if (isMockFirebase || masjidId === 'demo-masjid') {
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
  if (isMockFirebase || masjidId === 'demo-masjid') {
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
  if (isMockFirebase || masjidId === 'demo-masjid') {
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

export async function updateKeuangan(masjidId, id, data) {
  if (isMockFirebase || masjidId === 'demo-masjid') {
    const existing = getLocalData(`masjids/${masjidId}/keuangan`, mock.defaultKeuangan);
    const updated = existing.map(item => item.id === id ? { ...item, ...data } : item);
    setLocalData(`masjids/${masjidId}/keuangan`, updated);
    return true;
  }

  try {
    const docRef = doc(db, 'masjids', masjidId, 'keuangan', id);
    // Remove id from data to avoid saving it in the document
    const { id: _, ...updateData } = data;
    await setDoc(docRef, updateData, { merge: true });
    return true;
  } catch (error) {
    console.error("Error updating keuangan:", error);
    return false;
  }
}

export async function updateQris(masjidId, data) {
  if (isMockFirebase || masjidId === 'demo-masjid') {
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
  if (isMockFirebase || masjidId === 'demo-masjid') {
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
  if (isMockFirebase || masjidId === 'demo-masjid') {
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

// ==============================
// GLOBAL PRICING & VOUCHERS
// ==============================

export function subscribeToGlobalPricing(callback) {
  const ref = doc(db, 'configs', 'pricing');
  const fallback = {
    is_discount_active: false,
    berkah: { original_price: 250000, discounted_price: 200000 },
    premium: { original_price: 550000, discounted_price: 450000 }
  };
  return safeSubscribe(ref, callback, fallback);
}

export async function updateGlobalPricing(data) {
  if (isMockFirebase) {
    setLocalData('configs/pricing', data);
    return true;
  }
  try {
    const ref = doc(db, 'configs', 'pricing');
    await setDoc(ref, data, { merge: true });
    return true;
  } catch (error) {
    console.error("Error updating global pricing:", error);
    return false;
  }
}

export function subscribeToVouchers(callback) {
  if (isMockFirebase) {
    callback([]);
    return () => {};
  }
  const ref = collection(db, 'vouchers');
  try {
    return onSnapshot(ref, (snapshot) => {
      const list = [];
      snapshot.forEach(d => list.push({ id: d.id, ...d.data() }));
      callback(list);
    });
  } catch (e) {
    console.warn("Firestore vouchers error:", e);
    callback([]);
    return () => {};
  }
}

export async function addVoucher(data) {
  if (isMockFirebase) return true;
  try {
    const ref = doc(db, 'vouchers', data.code);
    await setDoc(ref, data);
    return true;
  } catch (error) {
    console.error("Error adding voucher:", error);
    return false;
  }
}

export async function updateVoucher(id, data) {
  if (isMockFirebase) return true;
  try {
    const ref = doc(db, 'vouchers', id);
    const { id: _, ...updateData } = data;
    await setDoc(ref, updateData, { merge: true });
    return true;
  } catch (error) {
    console.error("Error updating voucher:", error);
    return false;
  }
}

export async function deleteVoucher(id) {
  if (isMockFirebase) return true;
  try {
    const ref = doc(db, 'vouchers', id);
    await deleteDoc(ref);
    return true;
  } catch (error) {
    console.error("Error deleting voucher:", error);
    return false;
  }
}
