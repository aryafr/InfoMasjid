const fs = require('fs');

const pathAdmin = 'src/app/[masjidId]/admin/page.js';
let codeAdmin = fs.readFileSync(pathAdmin, 'utf8');

const pathTV = 'src/app/[masjidId]/page.js';
let codeTV = fs.readFileSync(pathTV, 'utf8');

// --- 1. Modify Admin UI ---

const oldJumatState = `  const [jumatForm, setJumatForm] = useState({ tanggal: "", khatib: "", imam: "", muadzin: "" });`;
const newJumatState = `  const [jumatForm, setJumatForm] = useState({ list: [] });`;
codeAdmin = codeAdmin.replace(oldJumatState, newJumatState);

const oldPopulateJumat = `          return {
            ...prev,
            tanggal: sholatJumat.tanggal || "",
            khatib: sholatJumat.khatib || "",
            imam: sholatJumat.imam || "",
            muadzin: sholatJumat.muadzin || ""
          };`;
const newPopulateJumat = `          return {
            ...prev,
            list: sholatJumat.list || (sholatJumat.tanggal ? [sholatJumat] : [])
          };`;
codeAdmin = codeAdmin.replace(oldPopulateJumat, newPopulateJumat);

const oldJumatSubmit = `  const handleJumatSubmit = (e) => {
    e.preventDefault();
    executeSave(updateSholatJumat, jumatForm, "Jadwal Petugas Jumat berhasil diperbarui!");
  };`;
const newJumatSubmit = `  const handleJumatSubmit = (e) => {
    e.preventDefault();
    // Sort by date before saving
    const sortedList = [...(jumatForm.list || [])].sort((a, b) => new Date(a.tanggal) - new Date(b.tanggal));
    executeSave(updateSholatJumat, { list: sortedList }, "Jadwal Petugas Jumat berhasil diperbarui!");
  };`;
codeAdmin = codeAdmin.replace(oldJumatSubmit, newJumatSubmit);

const oldJumatFormUI = `                <form onSubmit={handleJumatSubmit} className="flex flex-col gap-5">
                  <div>
                    <label className="text-sm text-foreground font-medium mb-2 block">Tanggal Jumat</label>
                    <input 
                      type="date" 
                      value={jumatForm.tanggal}
                      onChange={(e) => setJumatForm({ ...jumatForm, tanggal: e.target.value })}
                      className="w-full bg-input/50 border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-foreground transition-shadow"
                    />
                  </div>

                  <div>
                    <label className="text-sm text-foreground font-medium mb-2 block">Khatib Jumat</label>
                    <input 
                      type="text" 
                      value={jumatForm.khatib}
                      onChange={(e) => setJumatForm({ ...jumatForm, khatib: e.target.value })}
                      className="w-full bg-input/50 border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-foreground transition-shadow"
                    />
                  </div>

                  <div>
                    <label className="text-sm text-foreground font-medium mb-2 block">Imam Jumat</label>
                    <input 
                      type="text" 
                      value={jumatForm.imam}
                      onChange={(e) => setJumatForm({ ...jumatForm, imam: e.target.value })}
                      className="w-full bg-input/50 border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-foreground transition-shadow"
                    />
                  </div>

                  <div>
                    <label className="text-sm text-foreground font-medium mb-2 block">Muadzin / Bilal</label>
                    <input 
                      type="text" 
                      value={jumatForm.muadzin}
                      onChange={(e) => setJumatForm({ ...jumatForm, muadzin: e.target.value })}
                      className="w-full bg-input/50 border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-foreground transition-shadow"
                    />
                  </div>

                  <div className="pt-2">
                    <button 
                      type="submit" 
                      disabled={isSaving}
                      className="bg-primary text-primary-foreground font-bold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {isSaving ? <span className="animate-spin text-xl">⏳</span> : "Simpan Petugas"}
                    </button>
                  </div>
                </form>`;

const newJumatFormUI = `                <form onSubmit={handleJumatSubmit} className="flex flex-col gap-6">
                  {jumatForm.list && jumatForm.list.map((item, index) => (
                    <div key={index} className="bg-muted/20 border border-border/50 rounded-2xl p-6 relative group">
                      <button
                        type="button"
                        onClick={() => {
                          const newList = [...jumatForm.list];
                          newList.splice(index, 1);
                          setJumatForm({ ...jumatForm, list: newList });
                        }}
                        className="absolute top-4 right-4 p-2 bg-destructive/10 text-destructive rounded-lg hover:bg-destructive hover:text-white transition-colors md:opacity-0 md:group-hover:opacity-100"
                        title="Hapus Jadwal"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs text-muted-foreground font-medium mb-1 block">Tanggal Jumat</label>
                          <input 
                            type="date" 
                            value={item.tanggal}
                            onChange={(e) => {
                              const newList = [...jumatForm.list];
                              newList[index].tanggal = e.target.value;
                              setJumatForm({ ...jumatForm, list: newList });
                            }}
                            className="w-full bg-input/50 border border-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-foreground"
                            required
                          />
                        </div>
                        <div>
                          <label className="text-xs text-muted-foreground font-medium mb-1 block">Khatib Jumat</label>
                          <input 
                            type="text" 
                            value={item.khatib}
                            onChange={(e) => {
                              const newList = [...jumatForm.list];
                              newList[index].khatib = e.target.value;
                              setJumatForm({ ...jumatForm, list: newList });
                            }}
                            className="w-full bg-input/50 border border-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-foreground"
                            placeholder="Nama Khatib"
                            required
                          />
                        </div>
                        <div>
                          <label className="text-xs text-muted-foreground font-medium mb-1 block">Imam Jumat</label>
                          <input 
                            type="text" 
                            value={item.imam}
                            onChange={(e) => {
                              const newList = [...jumatForm.list];
                              newList[index].imam = e.target.value;
                              setJumatForm({ ...jumatForm, list: newList });
                            }}
                            className="w-full bg-input/50 border border-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-foreground"
                            placeholder="Nama Imam"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-muted-foreground font-medium mb-1 block">Muadzin / Bilal</label>
                          <input 
                            type="text" 
                            value={item.muadzin}
                            onChange={(e) => {
                              const newList = [...jumatForm.list];
                              newList[index].muadzin = e.target.value;
                              setJumatForm({ ...jumatForm, list: newList });
                            }}
                            className="w-full bg-input/50 border border-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-foreground"
                            placeholder="Nama Muadzin"
                          />
                        </div>
                      </div>
                    </div>
                  ))}

                  <div className="flex flex-col md:flex-row gap-3 pt-4 border-t border-border/50">
                    <button 
                      type="button" 
                      onClick={() => {
                        setJumatForm({
                          ...jumatForm,
                          list: [...(jumatForm.list || []), { tanggal: "", khatib: "", imam: "", muadzin: "" }]
                        });
                      }}
                      className="bg-secondary text-secondary-foreground font-bold px-6 py-3 rounded-xl shadow hover:shadow-md transition-all flex items-center justify-center gap-2"
                    >
                      <Plus className="w-5 h-5" /> Tambah Jadwal Jumat
                    </button>
                    <button 
                      type="submit" 
                      disabled={isSaving}
                      className="bg-primary text-primary-foreground font-bold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 disabled:opacity-50 flex-1"
                    >
                      {isSaving ? <span className="animate-spin text-xl">⏳</span> : "Simpan Semua Jadwal"}
                    </button>
                  </div>
                </form>`;

codeAdmin = codeAdmin.replace(oldJumatFormUI, newJumatFormUI);

if (!codeAdmin.includes('Trash2,')) {
  codeAdmin = codeAdmin.replace('Edit2\n} from "lucide-react";', 'Edit2,\n  Trash2,\n  Plus\n} from "lucide-react";');
}


// --- 2. Modify TV Logic ---

const closestFridayCode = `  const upcomingJumat = useMemo(() => {
    if (!sholatJumat) return null;
    let list = [];
    if (sholatJumat.list) {
      list = sholatJumat.list;
    } else if (sholatJumat.tanggal) {
      list = [sholatJumat];
    }
    
    // Filter to future or today's fridays
    const today = new Date();
    today.setHours(0, 0, 0, 0); // start of today
    
    const validList = list.filter(j => {
      if (!j.tanggal) return false;
      const jDate = new Date(j.tanggal);
      jDate.setHours(0,0,0,0);
      return jDate >= today;
    }).sort((a, b) => new Date(a.tanggal) - new Date(b.tanggal));
    
    return validList.length > 0 ? validList[0] : null;
  }, [sholatJumat]);`;

if (!codeTV.includes('const upcomingJumat = useMemo')) {
  if (!codeTV.includes('useMemo')) {
     codeTV = codeTV.replace('useEffect, useState', 'useEffect, useState, useMemo');
  }
  codeTV = codeTV.replace('const [sholatJumat, setSholatJumat] = useState(null);', 'const [sholatJumat, setSholatJumat] = useState(null);\n' + closestFridayCode);
}

// Ensure backward compatibility by searching for sholatJumat?. and replacing it with upcomingJumat?. inside the return ()
const renderStart = codeTV.indexOf('return (');
if (renderStart !== -1) {
    const beforeRender = codeTV.slice(0, renderStart);
    const afterRender = codeTV.slice(renderStart);
    
    const newAfterRender = afterRender.replace(/sholatJumat\?\./g, 'upcomingJumat?.');
    codeTV = beforeRender + newAfterRender;
}


fs.writeFileSync(pathAdmin, codeAdmin, 'utf8');
fs.writeFileSync(pathTV, codeTV, 'utf8');
console.log('Successfully upgraded Petugas Jumat.');
