const fs = require('fs');
const path = 'src/app/[masjidId]/admin/page.js';
let code = fs.readFileSync(path, 'utf8');

// 1. Add alamat_lengkap to profileForm state
code = code.replace(
  /const \[profileForm, setProfileForm\] = useState\(\{([\s\S]*?)nama_masjid: "", city: "", email: "", wa_number: "", currentPassword: "", newPassword: ""\s*\}\);/,
  `const [profileForm, setProfileForm] = useState({$1nama_masjid: "", city: "", email: "", wa_number: "", currentPassword: "", newPassword: "", alamat_lengkap: ""\n  });`
);

// 2. Pre-fill alamat_lengkap
code = code.replace(
  /city: settingsData\?\.auto_update\?\.city \|\| "",/g,
  `city: settingsData?.auto_update?.city || "",\n            alamat_lengkap: masjidSnap.data().alamat_lengkap || "",`
);

// 3. Update handleProfileSave to save alamat_lengkap
code = code.replace(
  /nama_aplikasi: profileForm\.nama_masjid,\n\s*email: profileForm\.email,\n\s*wa_number: profileForm\.wa_number\n\s*\}, \{ merge: true \}\);/g,
  `nama_aplikasi: profileForm.nama_masjid,\n        email: profileForm.email,\n        wa_number: profileForm.wa_number,\n        alamat_lengkap: profileForm.alamat_lengkap\n      }, { merge: true });`
);

// 4. Update the JSX for inputs
const oldKotaInput = `<div>
                        <label className="text-sm font-bold mb-1.5 block">Kota / Kabupaten</label>
                        <Input 
                          value={profileForm.city}
                          onChange={(e) => setProfileForm({...profileForm, city: e.target.value})}
                          required
                          placeholder="misal: Jakarta"
                        />
                        <p className="text-xs text-muted-foreground mt-1">Digunakan untuk auto-sinkronisasi jadwal sholat Anda.</p>
                      </div>`;

const newKotaAndAlamatInput = `<div>
                        <label className="text-sm font-bold mb-1.5 block">Kota / Kabupaten</label>
                        <Input 
                          value={profileForm.city}
                          disabled
                          className="opacity-70 cursor-not-allowed bg-muted/50"
                        />
                        <p className="text-xs text-muted-foreground mt-1">Kota tidak dapat diubah (terhubung ke lisensi sistem sinkronisasi sholat).</p>
                      </div>
                      <div>
                        <label className="text-sm font-bold mb-1.5 block">Alamat Lengkap</label>
                        <Input 
                          value={profileForm.alamat_lengkap}
                          onChange={(e) => setProfileForm({...profileForm, alamat_lengkap: e.target.value})}
                          placeholder="misal: Jl. Kenangan No 123..."
                        />
                      </div>`;

code = code.replace(oldKotaInput, newKotaAndAlamatInput);

const oldEmailInput = `<div>
                        <label className="text-sm font-bold mb-1.5 block">Alamat Email Kontak</label>
                        <Input 
                          type="email"
                          value={profileForm.email}
                          onChange={(e) => setProfileForm({...profileForm, email: e.target.value})}
                          required
                        />
                        <p className="text-xs text-muted-foreground mt-1">Email ini hanya untuk kontak, BUKAN email login Anda.</p>
                      </div>`;

const newEmailInput = `<div>
                        <label className="text-sm font-bold mb-1.5 block">Alamat Email Kontak</label>
                        <Input 
                          type="email"
                          value={profileForm.email}
                          disabled
                          className="opacity-70 cursor-not-allowed bg-muted/50"
                        />
                        <p className="text-xs text-muted-foreground mt-1">Email kontak tidak dapat diubah tanpa verifikasi ulang.</p>
                      </div>`;

code = code.replace(oldEmailInput, newEmailInput);

fs.writeFileSync(path, code, 'utf8');
console.log("Successfully updated profile fields.");
