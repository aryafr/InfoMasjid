const fs = require('fs');

const pathAdmin = 'src/app/[masjidId]/admin/page.js';
let codeAdmin = fs.readFileSync(pathAdmin, 'utf8');

const pathTV = 'src/app/[masjidId]/page.js';
let codeTV = fs.readFileSync(pathTV, 'utf8');

// 1. In admin/page.js, update the city select onClick handler to save cityId
const oldCitySelect = `                                  auto_update: { ...settingsForm.auto_update, city: formattedCity }
                                });
                                setCitySearchTerm(formattedCity);
                                setShowCityDropdown(false);
                              }}`;
const newCitySelect = `                                  auto_update: { ...settingsForm.auto_update, city: formattedCity, cityId: city.id }
                                });
                                setCitySearchTerm(formattedCity);
                                setShowCityDropdown(false);
                              }}`;
codeAdmin = codeAdmin.replace(oldCitySelect, newCitySelect);

// 2. In admin/page.js, rewrite handleForceSync
const oldForceSyncBlock = `      const city = settingsForm.auto_update.city || settings.auto_update?.city || "Balikpapan";
      const country = settingsForm.auto_update.country || settings.auto_update?.country || "Indonesia";
      const method = settingsForm.auto_update.method || settings.auto_update?.method || 11;
      
      const res = await fetch(
        \`https://api.aladhan.com/v1/timingsByCity?city=\${encodeURIComponent(city)}&country=\${encodeURIComponent(country)}&method=\${method}\`
      );
      if (res.ok) {
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
          Isya: applyOffset(timings.Isha, offsets.Isya || 0)
        };
        const ok = await updateJadwal(masjidId, newJadwal);
        if (ok) {
          const updatedSettings = {
            ...settingsForm,
            auto_update: { ...settingsForm.auto_update, city: city, country: country, method: method }
          };`;

const newForceSyncBlock = `      const city = settingsForm.auto_update?.city || settings.auto_update?.city || "Balikpapan";
      let cityId = settingsForm.auto_update?.cityId || settings.auto_update?.cityId;
      
      // If no cityId, fetch it first based on city name
      if (!cityId) {
         const searchRes = await fetch(\`https://api.myquran.com/v2/sholat/kota/cari/\${encodeURIComponent(city)}\`);
         if (searchRes.ok) {
            const searchData = await searchRes.json();
            if (searchData.status && searchData.data && searchData.data.length > 0) {
               cityId = searchData.data[0].id;
            }
         }
      }
      
      if (!cityId) {
         toast.error("Gagal mendapatkan ID Kota untuk " + city);
         return;
      }

      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const date = String(now.getDate()).padStart(2, '0');
      
      const res = await fetch(\`https://api.myquran.com/v2/sholat/jadwal/\${cityId}/\${year}/\${month}/\${date}\`);
      if (res.ok) {
        const result = await res.json();
        if (!result.status || !result.data || !result.data.jadwal) throw new Error("Data API MyQuran tidak valid");
        const timings = result.data.jadwal;
        const offsets = settingsForm.jadwal_offsets || {};
        const newJadwal = {
          Imsak: applyOffset(timings.imsak, offsets.Imsak || 0),
          Subuh: applyOffset(timings.subuh, offsets.Subuh || 0),
          Terbit: applyOffset(timings.terbit, offsets.Terbit || 0),
          Dzuhur: applyOffset(timings.dzuhur, offsets.Dzuhur || 0),
          Ashar: applyOffset(timings.ashar, offsets.Ashar || 0),
          Maghrib: applyOffset(timings.maghrib, offsets.Maghrib || 0),
          Isya: applyOffset(timings.isya, offsets.Isya || 0)
        };
        const ok = await updateJadwal(masjidId, newJadwal);
        if (ok) {
          const updatedSettings = {
            ...settingsForm,
            auto_update: { ...settingsForm.auto_update, city: city, cityId: cityId }
          };`;

codeAdmin = codeAdmin.replace(oldForceSyncBlock, newForceSyncBlock);


// 3. In page.js (TV Display), rewrite checkAndUpdateJadwal API call
const oldTVSyncBlock = `          const city = settings.auto_update.city || "Jakarta";
          const country = settings.auto_update.country || "Indonesia";
          const method = settings.auto_update.method || 11;
          
          const res = await fetch(
            \`https://api.aladhan.com/v1/timingsByCity?city=\${encodeURIComponent(city)}&country=\${encodeURIComponent(country)}&method=\${method}\`
          );
          if (res.ok) {
            const result = await res.json();
            const timings = result.data.timings;
            
            const offsets = settings.jadwal_offsets || {};
            const newJadwal = {
              Imsak: applyOffset(timings.Imsak, offsets.Imsak || 0),
              Subuh: applyOffset(timings.Fajr, offsets.Subuh || 0),
              Terbit: applyOffset(timings.Sunrise, offsets.Terbit || 0),
              Dzuhur: applyOffset(timings.Dhuhr, offsets.Dzuhur || 0),
              Ashar: applyOffset(timings.Asr, offsets.Ashar || 0),
              Maghrib: applyOffset(timings.Maghrib, offsets.Maghrib || 0),
              Isya: applyOffset(timings.Isha, offsets.Isya || 0)
            };
            
            await updateJadwalSholatFirestore(masjidId, newJadwal);
          }`;

const newTVSyncBlock = `          const city = settings.auto_update?.city || "Balikpapan";
          let cityId = settings.auto_update?.cityId;
          
          if (!cityId) {
             const searchRes = await fetch(\`https://api.myquran.com/v2/sholat/kota/cari/\${encodeURIComponent(city)}\`);
             if (searchRes.ok) {
                const searchData = await searchRes.json();
                if (searchData.status && searchData.data && searchData.data.length > 0) {
                   cityId = searchData.data[0].id;
                }
             }
          }
          
          if (!cityId) return; // Silent fail for background sync
          
          const now = new Date();
          const year = now.getFullYear();
          const month = String(now.getMonth() + 1).padStart(2, '0');
          const date = String(now.getDate()).padStart(2, '0');
          
          const res = await fetch(\`https://api.myquran.com/v2/sholat/jadwal/\${cityId}/\${year}/\${month}/\${date}\`);
          if (res.ok) {
            const result = await res.json();
            if (!result.status || !result.data || !result.data.jadwal) return;
            const timings = result.data.jadwal;
            
            const offsets = settings.jadwal_offsets || {};
            const newJadwal = {
              Imsak: applyOffset(timings.imsak, offsets.Imsak || 0),
              Subuh: applyOffset(timings.subuh, offsets.Subuh || 0),
              Terbit: applyOffset(timings.terbit, offsets.Terbit || 0),
              Dzuhur: applyOffset(timings.dzuhur, offsets.Dzuhur || 0),
              Ashar: applyOffset(timings.ashar, offsets.Ashar || 0),
              Maghrib: applyOffset(timings.maghrib, offsets.Maghrib || 0),
              Isya: applyOffset(timings.isya, offsets.Isya || 0)
            };
            
            await updateJadwalSholatFirestore(masjidId, newJadwal);
          }`;

codeTV = codeTV.replace(oldTVSyncBlock, newTVSyncBlock);

fs.writeFileSync(pathAdmin, codeAdmin, 'utf8');
fs.writeFileSync(pathTV, codeTV, 'utf8');

console.log("Successfully migrated to MyQuran API.");
