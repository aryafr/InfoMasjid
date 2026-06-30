import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebaseAdmin';

function applyOffset(timeStr, offsetMinutes) {
  if (!timeStr || !offsetMinutes) return timeStr;
  const [h, m] = timeStr.split(':').map(Number);
  let totalMinutes = h * 60 + m + parseInt(offsetMinutes, 10);
  
  if (totalMinutes < 0) totalMinutes += 24 * 60;
  totalMinutes = totalMinutes % (24 * 60);
  
  const newH = Math.floor(totalMinutes / 60);
  const newM = totalMinutes % 60;
  
  return `${String(newH).padStart(2, '0')}:${String(newM).padStart(2, '0')}`;
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const masjidId = searchParams.get('masjidId');

    if (!masjidId) {
      return NextResponse.json({ error: 'masjidId is required' }, { status: 400 });
    }

    if (!adminDb) {
      return NextResponse.json({ error: 'Firebase Admin not initialized' }, { status: 500 });
    }

    const settingsRef = adminDb.collection('masjids').doc(masjidId).collection('settings').doc('config');
    const settingsDoc = await settingsRef.get();
    
    if (!settingsDoc.exists) {
      return NextResponse.json({ error: 'Settings not found' }, { status: 404 });
    }

    const settings = settingsDoc.data();
    const cityId = settings?.auto_update?.cityId;

    if (!cityId) {
      return NextResponse.json({ error: 'Auto-sync cityId is not configured for this masjid' }, { status: 400 });
    }

    const now = new Date();
    // Gunakan zona waktu Indonesia untuk menentukan hari ini
    const formatter = new Intl.DateTimeFormat('id-ID', {
      timeZone: settings.timezone || 'Asia/Makassar',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
    
    const parts = formatter.formatToParts(now);
    const year = parts.find(p => p.type === 'year').value;
    const month = parts.find(p => p.type === 'month').value;
    const date = parts.find(p => p.type === 'day').value;
    const dateStr = `${year}-${month}-${date}`;

    const jadwalRef = adminDb.collection('masjids').doc(masjidId).collection('jadwal').doc('sholat');
    const jadwalDoc = await jadwalRef.get();
    
    if (jadwalDoc.exists) {
      const currentJadwal = jadwalDoc.data();
      if (currentJadwal.last_sync_date === dateStr) {
        return NextResponse.json({ message: 'Already synced today', date: dateStr }, { status: 200 });
      }
    }

    const res = await fetch(`https://api.myquran.com/v2/sholat/jadwal/${cityId}/${year}/${month}/${date}`);
    if (!res.ok) {
      return NextResponse.json({ error: 'Failed to fetch from MyQuran API' }, { status: 502 });
    }

    const result = await res.json();
    if (!result.status || !result.data || !result.data.jadwal) {
      return NextResponse.json({ error: 'Invalid data from MyQuran API' }, { status: 502 });
    }

    const timings = result.data.jadwal;
    const offsets = settings.jadwal_offsets || {};
    
    const newJadwal = {
      Imsak: applyOffset(timings.imsak, offsets.Imsak || 0),
      Subuh: applyOffset(timings.subuh, offsets.Subuh || 0),
      Terbit: applyOffset(timings.terbit, offsets.Terbit || 0),
      Dzuhur: applyOffset(timings.dzuhur, offsets.Dzuhur || 0),
      Ashar: applyOffset(timings.ashar, offsets.Ashar || 0),
      Maghrib: applyOffset(timings.maghrib, offsets.Maghrib || 0),
      Isya: applyOffset(timings.isya, offsets.Isya || 0),
      last_sync_date: dateStr,
      updated_at: new Date().toISOString()
    };

    await jadwalRef.set(newJadwal, { merge: true });

    return NextResponse.json({ message: 'Sync successful', data: newJadwal }, { status: 200 });
    
  } catch (error) {
    console.error('Error in sync-jadwal API:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
