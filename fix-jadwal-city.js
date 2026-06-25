const fs = require('fs');
const path = 'src/app/[masjidId]/admin/page.js';
let code = fs.readFileSync(path, 'utf8');

// 1. Fix the onClick to onMouseDown in the Jadwal Sholat dropdown
const oldDropdownLi = `                              onClick={() => {
                                const formattedCity = city.lokasi.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
                                setSettingsForm({
                                  ...settingsForm, 
                                  auto_update: { ...settingsForm.auto_update, city: formattedCity }
                                });
                                setCitySearchTerm(formattedCity);
                                setShowCityDropdown(false);
                              }}`;

const newDropdownLi = `                              onMouseDown={(e) => {
                                e.preventDefault();
                                const formattedCity = city.lokasi.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
                                setSettingsForm({
                                  ...settingsForm, 
                                  auto_update: { ...settingsForm.auto_update, city: formattedCity }
                                });
                                setCitySearchTerm(formattedCity);
                                setShowCityDropdown(false);
                              }}`;

code = code.replace(oldDropdownLi, newDropdownLi);

// 2. Update handleForceSync to also save the city and update profileForm
const oldForceSyncOk = `        const ok = await updateJadwal(masjidId, newJadwal);
        if (ok) {
          toast.success(\`Sync otomatis berhasil untuk kota \${city}!\`);
        }`;

const newForceSyncOk = `        const ok = await updateJadwal(masjidId, newJadwal);
        if (ok) {
          const updatedSettings = {
            ...settingsForm,
            auto_update: { ...settingsForm.auto_update, city: city, country: country, method: method }
          };
          await updateSettings(masjidId, updatedSettings);
          setSettings(updatedSettings);
          setSettingsForm(updatedSettings);
          setProfileForm(prev => ({...prev, city: city}));
          
          toast.success(\`Sync otomatis berhasil untuk kota \${city}!\`);
        }`;

code = code.replace(oldForceSyncOk, newForceSyncOk);

fs.writeFileSync(path, code, 'utf8');
console.log("Successfully fixed Jadwal dropdown and integrated city sync.");
