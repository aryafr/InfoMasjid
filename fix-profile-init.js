const fs = require('fs');
const path = 'src/app/[masjidId]/admin/page.js';
let code = fs.readFileSync(path, 'utf8');

const targetLine = '  // Set alert timeouts';
const hookJSX = `  // Populate Profile Form when data arrives
  useEffect(() => {
    if (masjidRoot && settings) {
      setProfileForm(prev => {
        // Only populate if not already populated to avoid overwriting typing
        if (!prev.nama_masjid && !prev.email && !prev.wa_number) {
          return {
            ...prev,
            nama_masjid: masjidRoot.nama_aplikasi || "",
            email: masjidRoot.email || auth?.currentUser?.email || "",
            wa_number: masjidRoot.wa_number || "",
            city: settings.auto_update?.city || "Jakarta",
            alamat_lengkap: masjidRoot.alamat_lengkap || "",
          };
        }
        return prev;
      });
    }
  }, [masjidRoot, settings, auth?.currentUser]);

`;

if (code.indexOf(hookJSX) === -1) {
  code = code.replace(targetLine, hookJSX + targetLine);
  fs.writeFileSync(path, code, 'utf8');
  console.log("Successfully injected profileForm population hook.");
} else {
  console.log("Hook already injected.");
}
