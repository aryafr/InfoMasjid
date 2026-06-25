const fs = require('fs');

const path = 'src/app/[masjidId]/admin/page.js';
let code = fs.readFileSync(path, 'utf8');

// 1. Move sidebar item to the bottom
code = code.replace(
  /\{\s*id:\s*"profile",\s*name:\s*"Profil Akun",\s*icon:\s*User\s*\},\n\s*/g,
  ''
);

const sidebarEndMatch = code.match(/\{ id: "panduan", name: "Buku Panduan", icon: BookOpen \}\s*\];/);
if (sidebarEndMatch) {
  code = code.replace(
    /\{ id: "panduan", name: "Buku Panduan", icon: BookOpen \}\s*\];/g,
    `{ id: "panduan", name: "Buku Panduan", icon: BookOpen },\n    { id: "profile", name: "Profil Akun", icon: User }\n  ];`
  );
}

// 2. Fix the header button
code = code.replace(
  /<button onClick=\{\(\) => setActiveTab\("profile"\)\} className="ml-2 h-10 w-10 bg-accent hover:bg-primary\/20 hover:text-primary rounded-full flex items-center justify-center text-muted-foreground border border-border shadow-sm transition-colors cursor-pointer">\n              <User className="h-5 w-5" \/>\n            <\/button>/g,
  `<Button variant="outline" size="icon" className="ml-2 rounded-full" onClick={() => setActiveTab("profile")}>\n              <User className="h-5 w-5" />\n            </Button>`
);

// 3. Inject Profile Tab JSX
const profileTabJSX = `
          {/* ==================== 0. TAB: PROFILE ==================== */}
          {activeTab === "profile" && (
            <div className="animate-fade-in flex flex-col gap-8 max-w-6xl w-full mx-auto pb-20">
              <div className="flex flex-col gap-2">
                <h2 className="text-3xl font-black tracking-tight text-foreground">Profil Masjid & Keamanan</h2>
                <p className="text-muted-foreground text-sm">Kelola data dasar masjid dan pengaturan keamanan administrator Anda.</p>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                {/* Data Profil Form */}
                <Card className="bg-card/20 backdrop-blur-3xl border-border/60 shadow-xl shadow-emerald-500/10">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5 text-primary"/> Data Profil Organisasi
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleProfileSave} className="flex flex-col gap-5">
                      <div>
                        <label className="text-sm font-bold mb-1.5 block">Nama Masjid / Organisasi</label>
                        <Input 
                          value={profileForm.nama_masjid}
                          onChange={(e) => setProfileForm({...profileForm, nama_masjid: e.target.value})}
                          required
                        />
                      </div>
                      <div>
                        <label className="text-sm font-bold mb-1.5 block">Kota / Kabupaten</label>
                        <Input 
                          value={profileForm.city}
                          onChange={(e) => setProfileForm({...profileForm, city: e.target.value})}
                          required
                          placeholder="misal: Jakarta"
                        />
                        <p className="text-xs text-muted-foreground mt-1">Digunakan untuk auto-sinkronisasi jadwal sholat Anda.</p>
                      </div>
                      <div>
                        <label className="text-sm font-bold mb-1.5 block">Alamat Email Kontak</label>
                        <Input 
                          type="email"
                          value={profileForm.email}
                          onChange={(e) => setProfileForm({...profileForm, email: e.target.value})}
                          required
                        />
                        <p className="text-xs text-muted-foreground mt-1">Email ini hanya untuk kontak, BUKAN email login Anda.</p>
                      </div>
                      <div>
                        <label className="text-sm font-bold mb-1.5 block">Nomor WhatsApp Pengelola</label>
                        <Input 
                          type="text"
                          value={profileForm.wa_number}
                          onChange={(e) => setProfileForm({...profileForm, wa_number: e.target.value})}
                          required
                        />
                      </div>
                      <Button type="submit" isLoading={isSaving} className="mt-4 w-full">
                        Simpan Pembaruan Profil
                      </Button>
                    </form>
                  </CardContent>
                </Card>

                {/* Ganti Password Form */}
                <Card className="bg-card/20 backdrop-blur-3xl border-border/60 shadow-xl shadow-emerald-500/10 h-fit">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Lock className="h-5 w-5 text-primary"/> Ubah Password Login
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handlePasswordSave} className="flex flex-col gap-5">
                      <div className="bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 p-3 rounded-lg flex gap-2">
                        <Lock className="w-4 h-4 mt-0.5 shrink-0" />
                        <p className="text-xs">Sistem akan meminta Anda untuk memasukkan password saat ini demi memverifikasi identitas Anda dengan aman.</p>
                      </div>
                      <div>
                        <label className="text-sm font-bold mb-1.5 block">Password Saat Ini</label>
                        <Input 
                          type="password"
                          value={profileForm.currentPassword}
                          onChange={(e) => setProfileForm({...profileForm, currentPassword: e.target.value})}
                          required
                          placeholder="Masukkan password yang Anda gunakan sekarang"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-bold mb-1.5 block">Password Baru</label>
                        <Input 
                          type="password"
                          value={profileForm.newPassword}
                          onChange={(e) => setProfileForm({...profileForm, newPassword: e.target.value})}
                          required
                          placeholder="Minimal 6 karakter kombinasi"
                        />
                      </div>
                      <Button type="submit" variant="secondary" isLoading={isSaving} className="mt-4 w-full border border-border hover:border-primary">
                        Perbarui Password
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
`;

const tabSettingsIndex = code.indexOf('{/* ==================== 1. TAB: SETTINGS / DASHBOARD ==================== */}');
if (tabSettingsIndex !== -1 && !code.includes('TAB: PROFILE ====================')) {
  code = code.slice(0, tabSettingsIndex) + profileTabJSX + "\n\n          " + code.slice(tabSettingsIndex);
  console.log("Injected JSX successfully");
} else {
  console.log("Failed to inject or already injected");
}

fs.writeFileSync(path, code, 'utf8');
