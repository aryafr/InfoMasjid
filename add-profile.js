const fs = require('fs');

const path = 'src/app/[masjidId]/admin/page.js';
let code = fs.readFileSync(path, 'utf8');

// 1. Add Auth imports
code = code.replace(
  /import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase\/auth";/g,
  'import { signInWithEmailAndPassword, signOut, onAuthStateChanged, EmailAuthProvider, reauthenticateWithCredential, updatePassword } from "firebase/auth";'
);

// 2. Add Profile Form State
const stateIndex = code.indexOf('const [settingsForm, setSettingsForm]');
if (stateIndex !== -1) {
  code = code.slice(0, stateIndex) + `const [profileForm, setProfileForm] = useState({
    nama_masjid: "", city: "", email: "", wa_number: "", currentPassword: "", newPassword: ""
  });\n  ` + code.slice(stateIndex);
}

// 3. Pre-fill Profile Form inside useEffect that loads data
const useEffectSettings = `        if (settingsData) {
          setSettings(settingsData);
          setSettingsForm({
            ...settingsData,
            tema: settingsData.tema || 'theme-emerald',
            rotation_pages: settingsData.rotation_pages || []
          });`;

const updatedUseEffectSettings = `        if (settingsData) {
          setSettings(settingsData);
          setSettingsForm({
            ...settingsData,
            tema: settingsData.tema || 'theme-emerald',
            rotation_pages: settingsData.rotation_pages || []
          });
          setProfileForm(prev => ({
            ...prev,
            nama_masjid: masjidSnap.data().nama_aplikasi || "",
            email: masjidSnap.data().email || "",
            wa_number: masjidSnap.data().wa_number || "",
            city: settingsData?.auto_update?.city || "",
          }));`;

code = code.replace(useEffectSettings, updatedUseEffectSettings);

// 4. Update Sidebar
code = code.replace(
  /\{ id: "settings", name: "Dashboard Global", icon: LayoutDashboard \},/g,
  `{ id: "profile", name: "Profil Akun", icon: User },\n    { id: "settings", name: "Dashboard Global", icon: LayoutDashboard },`
);

// 5. Update Header User Icon to be a button
code = code.replace(
  /<div className="ml-2 h-10 w-10 bg-accent rounded-full flex items-center justify-center text-muted-foreground border border-border shadow-sm">\s*<User className="h-5 w-5" \/>\s*<\/div>/g,
  `<button onClick={() => setActiveTab("profile")} className="ml-2 h-10 w-10 bg-accent hover:bg-primary/20 hover:text-primary rounded-full flex items-center justify-center text-muted-foreground border border-border shadow-sm transition-colors cursor-pointer">\n              <User className="h-5 w-5" />\n            </button>`
);

// 6. Add handleProfileSave & handlePasswordSave
const executeSaveIndex = code.indexOf('// Save changes wrapper');
const handleProfileLogic = `
  const handleProfileSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      // Update Masjid Root
      await setDoc(doc(db, "masjids", masjidId), {
        nama_aplikasi: profileForm.nama_masjid,
        email: profileForm.email,
        wa_number: profileForm.wa_number
      }, { merge: true });

      // Update Settings Global
      const updatedSettings = {
        ...settingsForm,
        nama_aplikasi: profileForm.nama_masjid,
        auto_update: { ...settingsForm.auto_update, city: profileForm.city }
      };
      await updateSettings(masjidId, updatedSettings);

      // Update User Mapping
      if (auth.currentUser) {
        await setDoc(doc(db, "users", auth.currentUser.uid), {
          email: profileForm.email,
          wa_number: profileForm.wa_number
        }, { merge: true });
      }

      toast.success("Profil berhasil diperbarui!");
      setSettings(updatedSettings);
      setSettingsForm(updatedSettings);
    } catch (err) {
      console.error(err);
      toast.error("Gagal menyimpan profil.");
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordSave = async (e) => {
    e.preventDefault();
    if (!profileForm.currentPassword || !profileForm.newPassword) {
      toast.error("Semua kolom password harus diisi.");
      return;
    }
    if (profileForm.newPassword.length < 6) {
      toast.error("Password baru minimal 6 karakter.");
      return;
    }
    
    setIsSaving(true);
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("Tidak ada user aktif.");

      const credential = EmailAuthProvider.credential(user.email, profileForm.currentPassword);
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, profileForm.newPassword);
      
      toast.success("Password berhasil diubah!");
      setProfileForm(prev => ({ ...prev, currentPassword: "", newPassword: "" }));
    } catch (err) {
      console.error(err);
      if (err.code === "auth/invalid-credential" || err.code === "auth/wrong-password") {
        toast.error("Password lama salah.");
      } else {
        toast.error("Gagal mengganti password: " + err.message);
      }
    } finally {
      setIsSaving(false);
    }
  };

`;

if (executeSaveIndex !== -1) {
  code = code.slice(0, executeSaveIndex) + handleProfileLogic + code.slice(executeSaveIndex);
}

// 7. Add Profile Tab JSX
const tabSettingsIndex = code.indexOf('{/* ==================== 1. TAB: SETTINGS ==================== */}');
const profileTabJSX = `
          {/* ==================== 0. TAB: PROFILE ==================== */}
          {activeTab === "profile" && (
            <div className="animate-fade-in flex flex-col gap-8 max-w-6xl w-full mx-auto pb-20">
              <div className="flex flex-col gap-2">
                <h2 className="text-3xl font-black tracking-tight text-foreground">Profil Masjid</h2>
                <p className="text-muted-foreground text-sm">Kelola data dasar masjid dan pengaturan akun administrator Anda.</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Data Profil Form */}
                <Card className="bg-card/20 backdrop-blur-3xl border-border/60 shadow-xl shadow-emerald-500/10">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5 text-primary"/> Data Pengelola
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleProfileSave} className="flex flex-col gap-5">
                      <div>
                        <label className="text-sm font-medium mb-1.5 block">Nama Masjid / Aplikasi</label>
                        <Input 
                          value={profileForm.nama_masjid}
                          onChange={(e) => setProfileForm({...profileForm, nama_masjid: e.target.value})}
                          required
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-1.5 block">Kota / Kabupaten</label>
                        <Input 
                          value={profileForm.city}
                          onChange={(e) => setProfileForm({...profileForm, city: e.target.value})}
                          required
                          placeholder="misal: Jakarta"
                        />
                        <p className="text-xs text-muted-foreground mt-1">Digunakan untuk sinkronisasi jadwal sholat.</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-1.5 block">Email Pengelola</label>
                        <Input 
                          type="email"
                          value={profileForm.email}
                          onChange={(e) => setProfileForm({...profileForm, email: e.target.value})}
                          required
                        />
                        <p className="text-xs text-muted-foreground mt-1">Hanya mengubah kontak profil, BUKAN email login.</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-1.5 block">Nomor WhatsApp</label>
                        <Input 
                          type="text"
                          value={profileForm.wa_number}
                          onChange={(e) => setProfileForm({...profileForm, wa_number: e.target.value})}
                          required
                        />
                      </div>
                      <Button type="submit" isLoading={isSaving} className="mt-2 w-full">
                        Simpan Profil
                      </Button>
                    </form>
                  </CardContent>
                </Card>

                {/* Ganti Password Form */}
                <Card className="bg-card/20 backdrop-blur-3xl border-border/60 shadow-xl shadow-emerald-500/10 h-fit">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Lock className="h-5 w-5 text-primary"/> Ganti Password
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handlePasswordSave} className="flex flex-col gap-5">
                      <div>
                        <label className="text-sm font-medium mb-1.5 block">Password Saat Ini</label>
                        <Input 
                          type="password"
                          value={profileForm.currentPassword}
                          onChange={(e) => setProfileForm({...profileForm, currentPassword: e.target.value})}
                          required
                          placeholder="Masukkan password Anda saat ini"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-1.5 block">Password Baru</label>
                        <Input 
                          type="password"
                          value={profileForm.newPassword}
                          onChange={(e) => setProfileForm({...profileForm, newPassword: e.target.value})}
                          required
                          placeholder="Minimal 6 karakter"
                        />
                      </div>
                      <Button type="submit" variant="secondary" isLoading={isSaving} className="mt-2 w-full border-primary/20 hover:border-primary/50 text-foreground">
                        Perbarui Password
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

`;

if (tabSettingsIndex !== -1) {
  code = code.slice(0, tabSettingsIndex) + profileTabJSX + code.slice(tabSettingsIndex);
}

fs.writeFileSync(path, code, 'utf8');
console.log("Successfully injected Profile tab features.");
