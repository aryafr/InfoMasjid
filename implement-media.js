const fs = require('fs');

const pathAdmin = 'src/app/[masjidId]/admin/page.js';
let codeAdmin = fs.readFileSync(pathAdmin, 'utf8');

// 1. Add extractYouTubeId
if (!codeAdmin.includes('const extractYouTubeId =')) {
  codeAdmin = codeAdmin.replace(
    'const compressImageToBase64 =',
    `const extractYouTubeId = (url) => {
  if (!url) return null;
  const match = url.match(/[?&]v=([^&]+)/) || url.match(/youtu\\.be\\/([^?]+)/);
  return match ? match[1] : null;
};

const compressImageToBase64 =`
  );
}

// 2. Add uploadingPoster state
if (!codeAdmin.includes('uploadingPoster')) {
  codeAdmin = codeAdmin.replace(
    'const [uploadingLogo, setUploadingLogo] = useState(false);',
    'const [uploadingLogo, setUploadingLogo] = useState(false);\n  const [uploadingPoster, setUploadingPoster] = useState({ index: null, status: false });'
  );
}

// 3. Modify handleSettingsSubmit for duration logic
const oldHandleSettingsSubmit = `  const handleSettingsSubmit = (e) => {
    e.preventDefault();
    executeSave(updateSettings, settingsForm, "Pengaturan global berhasil diperbarui!");
  };`;

const newHandleSettingsSubmit = `  const handleSettingsSubmit = (e) => {
    e.preventDefault();
    const updatedSettings = { ...settingsForm };
    if (updatedSettings.murottal?.enabled) {
      const duration = updatedSettings.murottal.duration || "always";
      if (duration === "always") {
        updatedSettings.murottal.expiresAt = null;
      } else {
        const msMap = {
          "5m": 5 * 60 * 1000,
          "10m": 10 * 60 * 1000,
          "15m": 15 * 60 * 1000,
          "30m": 30 * 60 * 1000,
          "1h": 60 * 60 * 1000,
          "2h": 120 * 60 * 1000
        };
        updatedSettings.murottal.expiresAt = Date.now() + msMap[duration];
      }
    } else {
      updatedSettings.murottal.expiresAt = null;
    }
    executeSave(updateSettings, updatedSettings, "Pengaturan global berhasil diperbarui!");
  };`;

codeAdmin = codeAdmin.replace(oldHandleSettingsSubmit, newHandleSettingsSubmit);

// 4. Update the Toggle UI to add Durasi dropdown
const toggleLabelClose = `</label>
                    </div>`;

const durationDropdown = `</label>
                      {settingsForm.murottal?.enabled && (
                        <div className="mt-4 pt-4 border-t border-border/50">
                          <label className="text-sm font-bold block mb-2">Durasi Putar Video</label>
                          <select 
                            value={settingsForm.murottal?.duration || "always"}
                            onChange={(e) => {
                              setSettingsForm({ ...settingsForm, murottal: { ...settingsForm.murottal, duration: e.target.value }});
                            }}
                            className="bg-input/50 border border-border rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary w-full text-foreground"
                          >
                            <option value="always">Putar Terus Menerus</option>
                            <option value="5m">Aktif 5 Menit</option>
                            <option value="10m">Aktif 10 Menit</option>
                            <option value="15m">Aktif 15 Menit</option>
                            <option value="30m">Aktif 30 Menit</option>
                            <option value="1h">Aktif 1 Jam</option>
                            <option value="2h">Aktif 2 Jam</option>
                          </select>
                        </div>
                      )}
                    </div>`;

// Be careful to only replace the first matching toggleLabelClose inside the Pengaturan Video & Kajian section
const videoSectionStart = codeAdmin.indexOf('Pengaturan Video & Kajian');
if (videoSectionStart !== -1) {
  const labelCloseIdx = codeAdmin.indexOf(toggleLabelClose, videoSectionStart);
  if (labelCloseIdx !== -1) {
    codeAdmin = codeAdmin.substring(0, labelCloseIdx) + durationDropdown + codeAdmin.substring(labelCloseIdx + toggleLabelClose.length);
  }
}

// 5. Update YouTube Input to add Thumbnail Preview
const oldYouTubeInput = `                      <Input 
                        type="text" 
                        placeholder="Contoh: https://www.youtube.com/watch?v=IPyvDEiUq2s"
                        value={settingsForm.murottal?.url || ""}
                        onChange={(e) => {
                          let val = e.target.value;
                          setSettingsForm({ ...settingsForm, murottal: { ...settingsForm.murottal, url: val } });
                        }}
                      />
                    </div>`;

const newYouTubeInput = `                      <Input 
                        type="text" 
                        placeholder="Contoh: https://www.youtube.com/watch?v=IPyvDEiUq2s"
                        value={settingsForm.murottal?.url || ""}
                        onChange={(e) => {
                          let val = e.target.value;
                          setSettingsForm({ ...settingsForm, murottal: { ...settingsForm.murottal, url: val } });
                        }}
                      />
                      {settingsForm.murottal?.url && extractYouTubeId(settingsForm.murottal.url) && (
                        <div className="mt-3 rounded-xl overflow-hidden border border-border w-full max-w-sm aspect-video relative shadow-sm">
                          <img src={\`https://img.youtube.com/vi/\${extractYouTubeId(settingsForm.murottal.url)}/hqdefault.jpg\`} alt="YouTube Thumbnail" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-[2px]">
                            <PlayCircle className="h-12 w-12 text-white/90 drop-shadow-lg" />
                          </div>
                        </div>
                      )}
                    </div>`;

codeAdmin = codeAdmin.replace(oldYouTubeInput, newYouTubeInput);

// 6. Update Poster Input to add Upload Button & Preview
const oldPosterLi = `                        <li key={index} className="flex items-center gap-2">
                          <Input 
                            type="url" 
                            disabled={!isPremium}
                            placeholder="https://... atau klik Upload"
                            value={poster}
                            onChange={(e) => {
                              const newPosters = [...settingsForm.posters];
                              newPosters[index] = e.target.value;
                              setSettingsForm({...settingsForm, posters: newPosters});
                            }}
                            className="flex-1"
                          />
                          <button 
                            type="button" 
                            disabled={!isPremium}
                            onClick={() => {
                              const newPosters = settingsForm.posters.filter((_, i) => i !== index);
                              setSettingsForm({...settingsForm, posters: newPosters});
                            }}
                            className="bg-destructive/10 text-destructive p-2.5 rounded-xl hover:bg-destructive hover:text-destructive-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </li>`;

const newPosterLi = `                        <li key={index} className="flex flex-col gap-2 relative group p-3 rounded-xl border border-border/50 bg-background/50 hover:bg-muted/20 transition-colors">
                          <div className="flex items-center gap-2">
                            <Input 
                              type="text" 
                              disabled={!isPremium}
                              placeholder="https://... atau klik ikon upload di sebelah kanan ->"
                              value={poster}
                              onChange={(e) => {
                                const newPosters = [...settingsForm.posters];
                                newPosters[index] = e.target.value;
                                setSettingsForm({...settingsForm, posters: newPosters});
                              }}
                              className="flex-1"
                            />
                            <input 
                              type="file" 
                              accept="image/*" 
                              id={\`upload-poster-\${index}\`}
                              className="hidden"
                              disabled={!isPremium}
                              onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;
                                if (file.size > 2 * 1024 * 1024) {
                                  toast.error("Ukuran file maksimal 2MB.");
                                  return;
                                }
                                setUploadingPoster({ index, status: true });
                                try {
                                  const base64Url = await compressImageToBase64(file, 1280, 0.7);
                                  const newPosters = [...settingsForm.posters];
                                  newPosters[index] = base64Url;
                                  setSettingsForm({...settingsForm, posters: newPosters});
                                  toast.success("Poster berhasil diunggah.");
                                } catch (error) {
                                  toast.error("Gagal memproses gambar.");
                                }
                                setUploadingPoster({ index: null, status: false });
                              }}
                            />
                            <Button 
                              type="button"
                              variant="outline"
                              size="icon"
                              disabled={!isPremium || (uploadingPoster.index === index && uploadingPoster.status)}
                              onClick={() => document.getElementById(\`upload-poster-\${index}\`).click()}
                              className="shrink-0 shadow-sm"
                            >
                              {uploadingPoster.index === index && uploadingPoster.status ? <Loader2 className="h-4 w-4 animate-spin" /> : <UploadCloud className="h-4 w-4 text-muted-foreground" />}
                            </Button>
                            <button 
                              type="button" 
                              disabled={!isPremium}
                              onClick={() => {
                                const newPosters = settingsForm.posters.filter((_, i) => i !== index);
                                setSettingsForm({...settingsForm, posters: newPosters});
                              }}
                              className="bg-destructive/10 text-destructive p-2.5 rounded-xl hover:bg-destructive hover:text-destructive-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed shrink-0 shadow-sm"
                            >
                              <Trash2 className="h-5 w-5" />
                            </button>
                          </div>
                          {poster && (
                            <div className="w-full h-32 md:h-48 rounded-lg border border-border mt-1 overflow-hidden relative shadow-sm">
                              <img src={poster} alt="Poster preview" className="w-full h-full object-cover" />
                            </div>
                          )}
                        </li>`;

codeAdmin = codeAdmin.replace(oldPosterLi, newPosterLi);

fs.writeFileSync(pathAdmin, codeAdmin, 'utf8');

// Now update TV Display in src/app/[masjidId]/page.js
const pathTV = 'src/app/[masjidId]/page.js';
let codeTV = fs.readFileSync(pathTV, 'utf8');

// Update Murottal Mode to respect expiresAt
const oldMurottalCalc = `    // Calculate global Murottal Mode
    const shouldPlayVideo = settings?.murottal?.enabled && !videoFinished && !isAnyPrayerMode && settings?.murottal?.url;
    setIsMurottalMode(shouldPlayVideo);
  }, [settings?.murottal?.enabled, videoFinished, isMenjelangSholat, isAdzanMode, isIqamahMode, isSholatMode, settings?.murottal?.url]);`;

const newMurottalCalc = `    // Calculate global Murottal Mode
    let isExpired = false;
    if (settings?.murottal?.expiresAt) {
      isExpired = Date.now() > settings.murottal.expiresAt;
    }
    const shouldPlayVideo = settings?.murottal?.enabled && !isExpired && !videoFinished && !isAnyPrayerMode && settings?.murottal?.url;
    setIsMurottalMode(shouldPlayVideo);
  }, [settings?.murottal?.enabled, settings?.murottal?.expiresAt, videoFinished, isMenjelangSholat, isAdzanMode, isIqamahMode, isSholatMode, settings?.murottal?.url]);

  // Timer for auto-turn off
  useEffect(() => {
    if (settings?.murottal?.enabled && settings?.murottal?.expiresAt) {
      const timeLeft = settings.murottal.expiresAt - Date.now();
      if (timeLeft > 0) {
        const timer = setTimeout(() => {
          setIsMurottalMode(false);
        }, timeLeft);
        return () => clearTimeout(timer);
      } else {
        setIsMurottalMode(false);
      }
    }
  }, [settings?.murottal?.expiresAt, settings?.murottal?.enabled]);`;

codeTV = codeTV.replace(oldMurottalCalc, newMurottalCalc);

fs.writeFileSync(pathTV, codeTV, 'utf8');
console.log("Successfully implemented all Media enhancements.");
