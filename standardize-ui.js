const fs = require('fs');
const path = 'src/app/[masjidId]/admin/page.js';
let code = fs.readFileSync(path, 'utf8');

// 1. Jadwal Sholat City Input
code = code.replace(
  /<input\s*\n\s*type="text"\s*\n\s*placeholder="Cari Kota\.\.\."\s*\n\s*value=\{citySearchTerm \|\| settingsForm\.auto_update\?\.city \|\| ""\}\s*\n\s*onChange=\{\(e\) => \{\s*\n\s*setCitySearchTerm\(e\.target\.value\);\s*\n\s*setSettingsForm\(\{\s*\n\s*\.\.\.settingsForm,\s*\n\s*auto_update: \{ \.\.\.settingsForm\.auto_update, city: e\.target\.value \}\s*\n\s*\}\);\s*\n\s*\}\}\s*\n\s*onFocus=\{\(\) => \{\s*\n\s*if \(citySuggestions\.length > 0\) setShowCityDropdown\(true\);\s*\n\s*\}\}\s*\n\s*onBlur=\{\(\) => setTimeout\(\(\) => setShowCityDropdown\(false\), 200\)\}\s*\n\s*className="w-48 bg-input\/50 border border-border rounded-xl pl-9 pr-8 py-2 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-foreground"\s*\n\s*\/>/g,
  `<Input 
                        type="text" 
                        placeholder="Cari Kota..."
                        value={citySearchTerm || settingsForm.auto_update?.city || ""}
                        onChange={(e) => {
                          setCitySearchTerm(e.target.value);
                          setSettingsForm({
                            ...settingsForm, 
                            auto_update: { ...settingsForm.auto_update, city: e.target.value }
                          });
                        }}
                        onFocus={() => {
                          if (citySuggestions.length > 0) setShowCityDropdown(true);
                        }}
                        onBlur={() => setTimeout(() => setShowCityDropdown(false), 200)}
                        className="w-56 pl-9 pr-8"
                      />`
);

// 2. Jadwal Sholat "Sync API" button
code = code.replace(
  /<button\s*\n\s*onClick=\{handleForceSync\}\s*\n\s*disabled=\{syncLoading\}\s*\n\s*className="bg-primary\/10 text-primary font-semibold px-4 py-2\.5 rounded-xl flex items-center gap-2 hover:bg-primary\/20 transition-colors disabled:opacity-50 text-sm border border-primary\/20 cursor-pointer"\s*\n\s*>/g,
  `<Button 
                      onClick={handleForceSync}
                      disabled={syncLoading}
                      variant="outline"
                      className="border-primary/20 text-primary hover:bg-primary/10"
                    >`
);

// 3. Jadwal Sholat "Simpan Jadwal Manual" button
code = code.replace(
  /<button\s*\n\s*onClick=\{handleSaveJadwal\}\s*\n\s*className="mt-6 bg-primary hover:bg-primary\/90 text-primary-foreground font-bold py-3 px-6 rounded-xl transition-all shadow-md hover:shadow-primary\/30"\s*\n\s*>\s*Simpan Jadwal Manual\s*<\/button>/g,
  `<Button 
                    onClick={handleSaveJadwal}
                    isLoading={isSaving}
                    size="lg"
                    className="mt-6"
                  >
                    Simpan Jadwal Manual
                  </Button>`
);

// 4. Murottal YouTube Input
code = code.replace(
  /<input\s*\n\s*type="text"\s*\n\s*placeholder="Contoh: https:\/\/www\.youtube\.com\/watch\?v=IPyvDEiUq2s"\s*\n\s*value=\{settingsForm\.murottal\?\.url \|\| ""\}\s*\n\s*onChange=\{\(e\) => \{\s*\n\s*let val = e\.target\.value;\s*\n\s*setSettingsForm\(\{ \.\.\.settingsForm, murottal: \{ \.\.\.settingsForm\.murottal, url: val \} \}\);\s*\n\s*\}\}\s*\n\s*className="w-full bg-input\/50 border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-foreground transition-shadow"\s*\n\s*\/>/g,
  `<Input 
                        type="text" 
                        placeholder="Contoh: https://www.youtube.com/watch?v=IPyvDEiUq2s"
                        value={settingsForm.murottal?.url || ""}
                        onChange={(e) => {
                          let val = e.target.value;
                          setSettingsForm({ ...settingsForm, murottal: { ...settingsForm.murottal, url: val } });
                        }}
                      />`
);

// 5. Murottal Poster Input
code = code.replace(
  /<input\s*\n\s*type="url"\s*\n\s*disabled=\{!isPremium\}\s*\n\s*placeholder="https:\/\/\.\.\. atau klik Upload"\s*\n\s*value=\{poster\}\s*\n\s*onChange=\{\(e\) => \{\s*\n\s*const newPosters = \[\.\.\.settingsForm\.posters\];\s*\n\s*newPosters\[index\] = e\.target\.value;\s*\n\s*setSettingsForm\(\{\.\.\.settingsForm, posters: newPosters\}\);\s*\n\s*\}\}\s*\n\s*className="flex-1 bg-input\/50 border border-border rounded-xl px-4 py-2\.5 text-sm focus:outline-none focus:border-primary text-foreground disabled:opacity-50 disabled:cursor-not-allowed"\s*\n\s*\/>/g,
  `<Input 
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
                          />`
);

// 6. Murottal "Tambah Poster" button
code = code.replace(
  /<button type="button" disabled=\{!isPremium\} onClick=\{\(\) => \{\s*\n\s*const newPosters = \[\.\.\.\(settingsForm\.posters \|\| \[\]\), ""\];\s*\n\s*setSettingsForm\(\{\.\.\.settingsForm, posters: newPosters\}\);\s*\n\s*\}\} className="bg-primary\/10 text-primary px-3 py-1\.5 rounded-lg text-sm font-bold flex items-center gap-1 hover:bg-primary\/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">\s*<Plus className="h-4 w-4"\/> Tambah Poster\s*<\/button>/g,
  `<Button type="button" disabled={!isPremium} variant="outline" size="sm" onClick={() => {
                        const newPosters = [...(settingsForm.posters || []), ""];
                        setSettingsForm({...settingsForm, posters: newPosters});
                      }} className="border-primary/20 text-primary hover:bg-primary/10">
                        <Plus className="h-4 w-4 mr-1"/> Tambah Poster
                      </Button>`
);

fs.writeFileSync(path, code, 'utf8');
console.log("Successfully standardized Jadwal and Murottal UI.");
