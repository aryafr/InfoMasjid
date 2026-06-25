const fs = require('fs');

const pathAdmin = 'src/app/[masjidId]/admin/page.js';
let codeAdmin = fs.readFileSync(pathAdmin, 'utf8');

const pathTV = 'src/app/[masjidId]/page.js';
let codeTV = fs.readFileSync(pathTV, 'utf8');

// 1. Add applyOffset function
const applyOffsetFn = `const applyOffset = (timeStr, offsetMinutes) => {
  if (!timeStr || !offsetMinutes) return timeStr;
  const [h, m] = timeStr.split(':').map(Number);
  const date = new Date();
  date.setHours(h, m + parseInt(offsetMinutes), 0, 0);
  return \`\${date.getHours().toString().padStart(2, '0')}:\${date.getMinutes().toString().padStart(2, '0')}\`;
};`;

if (!codeAdmin.includes('const applyOffset =')) {
  codeAdmin = codeAdmin.replace('const extractYouTubeId', applyOffsetFn + '\n\nconst extractYouTubeId');
}
if (!codeTV.includes('const applyOffset =')) {
  codeTV = codeTV.replace('export default function MasjidDisplay', applyOffsetFn + '\n\nexport default function MasjidDisplay');
}

// 2. Modifying handleForceSync in admin/page.js
const oldHandleForceSync = `      if (res.ok) {
        const result = await res.json();
        const timings = result.data.timings;
        const newJadwal = {
          Subuh: timings.Fajr,
          Dzuhur: timings.Dhuhr,
          Ashar: timings.Asr,
          Maghrib: timings.Maghrib,
          Isya: timings.Isha,
          updated_at: new Date().toISOString()
        };`;

const newHandleForceSync = `      if (res.ok) {
        const result = await res.json();
        const timings = result.data.timings;
        const offsets = settingsForm.jadwal_offsets || {};
        const newJadwal = {
          Imsak: applyOffset(timings.Imsak, offsets.Imsak || 0),
          Subuh: applyOffset(timings.Fajr, offsets.Subuh || 0),
          Terbit: applyOffset(timings.Sunrise, offsets.Terbit || 0),
          Dzuhur: applyOffset(timings.Dhuhr, offsets.Dzuhur || 0),
          Ashar: applyOffset(timings.Asr, offsets.Ashar || 0),
          Maghrib: applyOffset(timings.Maghrib, offsets.Maghrib || 0),
          Isya: applyOffset(timings.Isha, offsets.Isya || 0),
          updated_at: new Date().toISOString()
        };`;
codeAdmin = codeAdmin.replace(oldHandleForceSync, newHandleForceSync);

// 3. Modifying checkAndUpdateJadwal in TV page.js
const oldCheckAndUpdate = `            const newJadwal = {
              Subuh: timings.Fajr,
              Dzuhur: timings.Dhuhr,
              Ashar: timings.Asr,
              Maghrib: timings.Maghrib,
              Isya: timings.Isha,
              updated_at: new Date().toISOString()
            };`;

const newCheckAndUpdate = `            const offsets = settings.jadwal_offsets || {};
            const newJadwal = {
              Imsak: applyOffset(timings.Imsak, offsets.Imsak || 0),
              Subuh: applyOffset(timings.Fajr, offsets.Subuh || 0),
              Terbit: applyOffset(timings.Sunrise, offsets.Terbit || 0),
              Dzuhur: applyOffset(timings.Dhuhr, offsets.Dzuhur || 0),
              Ashar: applyOffset(timings.Asr, offsets.Ashar || 0),
              Maghrib: applyOffset(timings.Maghrib, offsets.Maghrib || 0),
              Isya: applyOffset(timings.Isha, offsets.Isya || 0),
              updated_at: new Date().toISOString()
            };`;
codeTV = codeTV.replace(oldCheckAndUpdate, newCheckAndUpdate);

// 4. Update TV display mapping and logic
codeTV = codeTV.replace(
  `{ name: "Subuh", timeStr: jadwal.Subuh },`,
  `{ name: "Imsak", timeStr: jadwal.Imsak },\n          { name: "Subuh", timeStr: jadwal.Subuh },\n          { name: "Terbit", timeStr: jadwal.Terbit },`
);
codeTV = codeTV.replace(
  `{ name: "Subuh", timeStr: jadwal.Subuh },`,
  `{ name: "Imsak", timeStr: jadwal.Imsak },\n      { name: "Subuh", timeStr: jadwal.Subuh },\n      { name: "Terbit", timeStr: jadwal.Terbit },`
);

const oldIqamahLogic = `          // Jika countdown sudah 0 atau kurang, masuk mode Sholat (layar hitam)
          if (diffSeconds <= 0 && isAdzanMode && durationMinutes > 0) {
            setIsAdzanMode(false);
            setIsIqamahMode(false);
            setIsSholatMode(true);
            
            // Set timer untuk mengakhiri mode sholat
            setTimeout(() => {
              setIsSholatMode(false);
            }, durationMinutes * 60 * 1000);
          }`;

const newIqamahLogic = `          // Abaikan iqamah/sholat untuk Imsak dan Terbit
          if (nextPrayer === "Imsak" || nextPrayer === "Terbit") {
             if (diffSeconds <= 0) {
                 setIsAdzanMode(false);
                 setIsIqamahMode(false);
             }
          } else {
             // Jika countdown sudah 0 atau kurang, masuk mode Sholat (layar hitam)
             if (diffSeconds <= 0 && isAdzanMode && durationMinutes > 0) {
               setIsAdzanMode(false);
               setIsIqamahMode(false);
               setIsSholatMode(true);
               
               // Set timer untuk mengakhiri mode sholat
               setTimeout(() => {
                 setIsSholatMode(false);
               }, durationMinutes * 60 * 1000);
             }
          }`;
codeTV = codeTV.replace(oldIqamahLogic, newIqamahLogic);


// 5. Admin UI changes: Move Durasi/Jeda and Add Offset
const oldPengaturanWaktu = `                  <div className="border-t border-border/50 pt-6 mt-4">
                    <h3 className="text-lg font-bold text-foreground mb-4">Pengaturan Waktu Sholat (Menit)</h3>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                      {['subuh', 'dzuhur', 'ashar', 'maghrib', 'isya'].map((waktu) => (
                        <div key={waktu} className="bg-muted/30 p-4 rounded-2xl border border-border/50">
                           <label className="text-sm font-bold text-foreground capitalize mb-3 block">{waktu}</label>
                           <div className="flex flex-col gap-3">
                             <div>
                               <label className="text-xs text-muted-foreground mb-1 block">Jeda Iqamah</label>
                               <Input 
                                 type="number" 
                                 value={settingsForm.jeda_iqamah?.[waktu] ?? 10}
                                 onChange={(e) => setSettingsForm({ ...settingsForm, jeda_iqamah: { ...(settingsForm.jeda_iqamah || {}), [waktu]: Number(e.target.value) } })}
                               />
                             </div>
                             <div>
                               <label className="text-xs text-muted-foreground mb-1 block">Durasi Sholat</label>
                               <Input 
                                 type="number" 
                                 value={settingsForm.durasi_sholat?.[waktu] ?? 15}
                                 onChange={(e) => setSettingsForm({ ...settingsForm, durasi_sholat: { ...(settingsForm.durasi_sholat || {}), [waktu]: Number(e.target.value) } })}
                               />
                             </div>
                           </div>
                        </div>
                      ))}
                    </div>
                  </div>`;

codeAdmin = codeAdmin.replace(oldPengaturanWaktu, '');

const oldJadwalForm = `                  <div className="grid grid-cols-2 gap-6">
                    {["Subuh", "Dzuhur", "Ashar", "Maghrib", "Isya"].map((name) => (
                      <div key={name}>
                        <label className="text-sm text-foreground font-medium mb-2 block">Waktu {name}</label>
                        <Input 
                          type="text" 
                          value={jadwalForm[name]}
                          onChange={(e) => setJadwalForm({ ...jadwalForm, [name]: e.target.value })}
                          className="font-mono font-bold text-lg text-center"
                        />
                      </div>
                    ))}
                  </div>`;

const newJadwalForm = `                  <div className="grid grid-cols-3 md:grid-cols-7 gap-4">
                    {["Imsak", "Subuh", "Terbit", "Dzuhur", "Ashar", "Maghrib", "Isya"].map((name) => (
                      <div key={name}>
                        <label className="text-sm text-foreground font-medium mb-2 block">Waktu {name}</label>
                        <Input 
                          type="text" 
                          value={jadwalForm[name] || "00:00"}
                          onChange={(e) => setJadwalForm({ ...jadwalForm, [name]: e.target.value })}
                          className="font-mono font-bold text-lg text-center"
                        />
                      </div>
                    ))}
                  </div>
                  
                  <div className="border-t border-border/50 pt-6 mt-6">
                    <h3 className="text-lg font-bold text-foreground mb-4 flex flex-col gap-1">
                      Koreksi Jadwal API (Offset)
                      <span className="text-sm font-normal text-muted-foreground">Isi dengan nilai plus (misal: 2) atau minus (misal: -2) menit. Klik Sync API untuk menerapkan.</span>
                    </h3>
                    <div className="grid grid-cols-3 md:grid-cols-7 gap-4">
                      {["Imsak", "Subuh", "Terbit", "Dzuhur", "Ashar", "Maghrib", "Isya"].map((waktu) => (
                        <div key={waktu} className="bg-muted/30 p-4 rounded-2xl border border-border/50">
                           <label className="text-sm font-bold text-foreground capitalize mb-3 block">{waktu}</label>
                           <Input 
                             type="number" 
                             placeholder="0"
                             value={settingsForm.jadwal_offsets?.[waktu] || ""}
                             onChange={(e) => setSettingsForm({ ...settingsForm, jadwal_offsets: { ...(settingsForm.jadwal_offsets || {}), [waktu]: Number(e.target.value) } })}
                             className="text-center"
                           />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-border/50 pt-6 mt-6">
                    <h3 className="text-lg font-bold text-foreground mb-4">Pengaturan Jeda Iqamah & Durasi Sholat</h3>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                      {['subuh', 'dzuhur', 'ashar', 'maghrib', 'isya'].map((waktu) => (
                        <div key={waktu} className="bg-muted/30 p-4 rounded-2xl border border-border/50">
                           <label className="text-sm font-bold text-foreground capitalize mb-3 block">{waktu}</label>
                           <div className="flex flex-col gap-3">
                             <div>
                               <label className="text-xs text-muted-foreground mb-1 block">Jeda Iqamah (Menit)</label>
                               <Input 
                                 type="number" 
                                 value={settingsForm.jeda_iqamah?.[waktu] ?? 10}
                                 onChange={(e) => setSettingsForm({ ...settingsForm, jeda_iqamah: { ...(settingsForm.jeda_iqamah || {}), [waktu]: Number(e.target.value) } })}
                               />
                             </div>
                             <div>
                               <label className="text-xs text-muted-foreground mb-1 block">Durasi Sholat (Menit)</label>
                               <Input 
                                 type="number" 
                                 value={settingsForm.durasi_sholat?.[waktu] ?? 15}
                                 onChange={(e) => setSettingsForm({ ...settingsForm, durasi_sholat: { ...(settingsForm.durasi_sholat || {}), [waktu]: Number(e.target.value) } })}
                               />
                             </div>
                           </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 flex justify-end">
                       <Button onClick={(e) => { e.preventDefault(); handleSettingsSubmit(e); }}>Simpan Pengaturan Jeda & Offset</Button>
                    </div>
                  </div>`;
codeAdmin = codeAdmin.replace(oldJadwalForm, newJadwalForm);


// 6. Update mapping array for TV Display rendering
codeTV = codeTV.replace(
  `{["Subuh", "Dzuhur", "Ashar", "Maghrib", "Isya"].map((name) => (`,
  `{["Imsak", "Subuh", "Terbit", "Dzuhur", "Ashar", "Maghrib", "Isya"].map((name) => (`
);
codeTV = codeTV.replace(
  `{["Subuh", "Dzuhur", "Ashar", "Maghrib", "Isya"].map((name) => (`,
  `{["Imsak", "Subuh", "Terbit", "Dzuhur", "Ashar", "Maghrib", "Isya"].map((name) => (`
);

fs.writeFileSync(pathAdmin, codeAdmin, 'utf8');
fs.writeFileSync(pathTV, codeTV, 'utf8');
console.log("Successfully implemented Jadwal Sholat enhancements.");
