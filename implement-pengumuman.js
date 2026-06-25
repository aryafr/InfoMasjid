const fs = require('fs');

const pathAdmin = 'src/app/[masjidId]/admin/page.js';
let codeAdmin = fs.readFileSync(pathAdmin, 'utf8');

const pathTV = 'src/app/[masjidId]/page.js';
let codeTV = fs.readFileSync(pathTV, 'utf8');

// --- 1. Modify Admin UI ---

// 1a. State initialization
const oldPengumumanState = `  const [newPengumuman, setNewPengumuman] = useState({ isi: "", tanggal: "" });`;
const newPengumumanState = `  const [newPengumuman, setNewPengumuman] = useState({ judul: "", isi: "", tanggal: "" });`;
codeAdmin = codeAdmin.replace(oldPengumumanState, newPengumumanState);

// 1b. Handle Add function
const oldHandleAdd = `  const handleAddPengumuman = (e) => {
    e.preventDefault();
    if (!newPengumuman.isi) return;
    executeSave(addPengumuman, {
      isi: newPengumuman.isi,
      tanggal: newPengumuman.tanggal || new Date().toISOString().split('T')[0]
    }, "Pengumuman baru berhasil ditambahkan!");
    setNewPengumuman({ isi: "", tanggal: "" });
  };`;
const newHandleAdd = `  const handleAddPengumuman = (e) => {
    e.preventDefault();
    if (!newPengumuman.isi || !newPengumuman.judul) return;
    executeSave(addPengumuman, {
      judul: newPengumuman.judul,
      isi: newPengumuman.isi,
      tanggal: newPengumuman.tanggal || new Date().toISOString().split('T')[0]
    }, "Pengumuman baru berhasil ditambahkan!");
    setNewPengumuman({ judul: "", isi: "", tanggal: "" });
  };`;
codeAdmin = codeAdmin.replace(oldHandleAdd, newHandleAdd);

// 1c. Pengumuman Tab UI
const oldPengumumanUI = `          {/* ==================== 4. TAB: PENGUMUMAN ==================== */}
          {activeTab === "pengumuman" && (
            <div className="animate-fade-in grid grid-cols-12 gap-8 items-start max-w-6xl w-full mx-auto pb-20">
              
              {/* Form Col */}
              <div className="col-span-4 bg-card/20 backdrop-blur-3xl border border-border/60 shadow-xl shadow-emerald-500/30 rounded-3xl p-8 shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-base font-bold text-foreground mb-5 pb-3 border-b border-border">Buat Agenda Baru</h3>
                <form onSubmit={handleAddPengumuman} className="flex flex-col gap-5">
                  <div>
                    <label className="text-sm text-foreground font-medium mb-2 block">Tanggal Agenda</label>
                    <input 
                      type="date" 
                      value={newPengumuman.tanggal}
                      onChange={(e) => setNewPengumuman({ ...newPengumuman, tanggal: e.target.value })}
                      className="w-full bg-input/50 border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-foreground"
                    />
                  </div>

                  <div>
                    <label className="text-sm text-foreground font-medium mb-2 block">Isi Pengumuman</label>
                    <textarea 
                      value={newPengumuman.isi}
                      onChange={(e) => setNewPengumuman({ ...newPengumuman, isi: e.target.value })}
                      rows={4}
                      className="w-full bg-input/50 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-foreground resize-none"
                    />
                  </div>

                  <button 
                    type="submit" 
                    className="bg-primary text-primary-foreground text-sm font-medium p-3 rounded-xl shadow-sm hover:opacity-90 transition-colors flex justify-center items-center gap-2 cursor-pointer"
                  >
                    <Plus className="h-4 w-4" /> Tambahkan
                  </button>
                </form>
              </div>

              {/* List Col */}
              <div className="col-span-8 bg-card/20 backdrop-blur-3xl border border-border/60 shadow-xl shadow-emerald-500/30 rounded-3xl p-8 shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-base font-bold text-foreground mb-5 pb-3 border-b border-border flex justify-between">
                  Daftar Pengumuman Aktif
                </h3>
                
                <div className="flex flex-col gap-4 max-h-[500px] overflow-y-auto pr-2">
                  {(pengumuman || []).map((item) => (
                    <div key={item.id} className="group p-5 rounded-2xl border border-border bg-muted/20 hover:bg-accent hover:border-primary/30 hover:shadow-sm transition-all flex items-start justify-between gap-4">
                      <div>
                        <div className="inline-block px-2.5 py-1 bg-card/20 backdrop-blur-3xl border border-border/60 shadow-xl shadow-emerald-500/30 rounded-md text-xs font-mono font-medium text-muted-foreground mb-2">
                          {item.tanggal}
                        </div>
                        <p className="text-sm text-foreground leading-relaxed font-medium">{item.isi}</p>
                      </div>
                      <button 
                        onClick={() => handleDeletePengumuman(item.id)}
                        className="text-muted-foreground hover:text-destructive p-2 hover:bg-destructive/10 rounded-lg transition-colors cursor-pointer"
                      >
                        <Trash2 className="h-4.5 w-4.5" />
                      </button>
                    </div>
                  ))}
                  {(!pengumuman || pengumuman.length === 0) && (
                    <div className="text-center py-10 text-muted-foreground text-sm">Belum ada pengumuman.</div>
                  )}
                </div>
              </div>

            </div>
          )}`;

const newPengumumanUI = `          {/* ==================== 4. TAB: PENGUMUMAN ==================== */}
          {activeTab === "pengumuman" && (
            <div className="animate-fade-in grid grid-cols-1 md:grid-cols-12 gap-8 items-start max-w-6xl w-full mx-auto pb-20">
              
              {/* Form Col */}
              <div className="md:col-span-4 bg-card/20 backdrop-blur-3xl border border-border/60 shadow-xl shadow-emerald-500/30 rounded-3xl p-8 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border/50">
                   <div className="p-2.5 bg-primary/10 rounded-xl text-primary">
                     <Megaphone className="w-5 h-5" />
                   </div>
                   <h3 className="text-lg font-bold text-foreground">Buat Agenda Baru</h3>
                </div>
                <form onSubmit={handleAddPengumuman} className="flex flex-col gap-5">
                  <div>
                    <label className="text-sm text-foreground font-medium mb-2 block">Judul Pengumuman</label>
                    <input 
                      type="text" 
                      value={newPengumuman.judul}
                      onChange={(e) => setNewPengumuman({ ...newPengumuman, judul: e.target.value })}
                      className="w-full bg-input/50 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-foreground"
                      placeholder="Misal: Kajian Subuh"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-sm text-foreground font-medium mb-2 block">Tanggal Agenda</label>
                    <input 
                      type="date" 
                      value={newPengumuman.tanggal}
                      onChange={(e) => setNewPengumuman({ ...newPengumuman, tanggal: e.target.value })}
                      className="w-full bg-input/50 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-foreground"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-sm text-foreground font-medium mb-2 block">Isi Pengumuman</label>
                    <textarea 
                      value={newPengumuman.isi}
                      onChange={(e) => setNewPengumuman({ ...newPengumuman, isi: e.target.value })}
                      rows={5}
                      className="w-full bg-input/50 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-foreground resize-none"
                      placeholder="Tuliskan deskripsi lengkap di sini..."
                      required
                    />
                  </div>

                  <button 
                    type="submit" 
                    disabled={isSaving}
                    className="bg-primary text-primary-foreground font-bold p-3.5 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all flex justify-center items-center gap-2 cursor-pointer mt-2 disabled:opacity-50"
                  >
                    {isSaving ? <span className="animate-spin text-xl">⏳</span> : <><Plus className="h-5 w-5" /> Publikasikan Agenda</>}
                  </button>
                </form>
              </div>

              {/* List Col */}
              <div className="md:col-span-8 bg-card/20 backdrop-blur-3xl border border-border/60 shadow-xl shadow-emerald-500/30 rounded-3xl p-8 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border/50">
                  <div className="p-2.5 bg-secondary/80 rounded-xl text-secondary-foreground">
                    <LayoutDashboard className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground">Daftar Pengumuman Aktif</h3>
                </div>
                
                <div className="flex flex-col gap-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                  {(pengumuman || []).map((item) => (
                    <div key={item.id} className="group p-5 rounded-2xl border border-border/60 bg-muted/10 hover:bg-card/40 hover:border-primary/40 hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                           <span className="inline-block px-3 py-1 bg-primary/10 border border-primary/20 rounded-md text-xs font-bold text-primary">
                             {item.tanggal}
                           </span>
                           <h4 className="text-base font-bold text-foreground">{item.judul || "Pengumuman"}</h4>
                        </div>
                        <p className="text-sm text-foreground/80 leading-relaxed line-clamp-3">{item.isi}</p>
                      </div>
                      <button 
                        onClick={() => handleDeletePengumuman(item.id)}
                        className="text-muted-foreground hover:text-destructive p-2 hover:bg-destructive/10 rounded-xl transition-colors cursor-pointer shrink-0 md:opacity-0 group-hover:opacity-100"
                        title="Hapus Agenda"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  ))}
                  {(!pengumuman || pengumuman.length === 0) && (
                    <div className="text-center py-20 flex flex-col items-center justify-center text-muted-foreground opacity-60">
                      <Megaphone className="w-16 h-16 mb-4" />
                      <p className="text-lg font-medium">Belum ada pengumuman aktif.</p>
                      <p className="text-sm">Buat agenda baru di panel sebelah kiri.</p>
                    </div>
                  )}
                </div>
              </div>

            </div>
          )}`;

codeAdmin = codeAdmin.replace(oldPengumumanUI, newPengumumanUI);

// Make sure Megaphone is imported
if (!codeAdmin.includes('Megaphone')) {
  codeAdmin = codeAdmin.replace('LayoutDashboard', 'LayoutDashboard, Megaphone');
}


// --- 2. Modify TV Logic ---

const oldTVPengumuman = `          {/* Slide 5: Pengumuman (Tabel Full) */}
          {currentSlide.url === "pengumuman" && (
            <div className="animate-fade-in flex flex-col gap-8 w-full h-full justify-center max-w-6xl mx-auto">
              <div className="text-center">
                <h2 className="text-5xl font-black text-foreground tracking-widest uppercase drop-shadow-md">Agenda & Pengumuman</h2>
                <div className="h-2 w-32 bg-primary mx-auto mt-6 rounded-full shadow-lg shadow-primary/30"></div>
              </div>

              <div className="flex flex-col gap-6 w-full mt-4">
                {(pengumuman || []).slice(0, 4).map((item, index) => (
                  <div 
                    key={item.id} 
                    className="bg-card/20 backdrop-blur-3xl p-6 rounded-[2rem] border-2 border-border/60 flex items-center gap-8 shadow-xl shadow-emerald-500/30"
                  >
                    <div className="h-24 w-24 rounded-[1.5rem] bg-primary/10 border-2 border-primary/20 text-primary flex flex-col items-center justify-center font-bold tracking-tight text-center shrink-0 shadow-inner">
                      <span className="text-lg uppercase font-black opacity-80 tracking-widest">Tgl</span>
                      <span className="text-4xl font-mono font-black mt-1 leading-none flex items-center justify-center">
                        {item.tanggal ? item.tanggal.substring(8, 10) : <Megaphone className="h-10 w-10" />}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="text-foreground text-3xl font-semibold leading-snug line-clamp-2">{item.isi}</p>
                      <div className="text-foreground/60 text-xl font-black mt-3 font-mono uppercase tracking-widest">
                        Dipublikasikan pada: {item.tanggal}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}`;

const newTVPengumuman = `          {/* Slide 5: Pengumuman (Tabel Full) */}
          {currentSlide.url === "pengumuman" && (
            <div className="animate-fade-in flex flex-col gap-8 w-full h-full justify-center max-w-6xl mx-auto">
              <div className="text-center">
                <h2 className="text-5xl font-black text-foreground tracking-widest uppercase drop-shadow-md">Agenda & Pengumuman</h2>
                <div className="h-2 w-32 bg-primary mx-auto mt-6 rounded-full shadow-lg shadow-primary/30"></div>
              </div>

              <div className="flex flex-col gap-6 w-full mt-4">
                {(pengumuman || []).slice(0, 4).map((item, index) => (
                  <div 
                    key={item.id} 
                    className="bg-card/20 backdrop-blur-3xl p-6 rounded-[2rem] border-2 border-border/60 flex items-start gap-8 shadow-xl shadow-emerald-500/30"
                  >
                    <div className="h-24 w-24 rounded-[1.5rem] bg-primary border-2 border-primary-foreground/20 text-primary-foreground flex flex-col items-center justify-center font-bold tracking-tight text-center shrink-0 shadow-lg mt-1">
                      <span className="text-lg uppercase font-black opacity-90 tracking-widest leading-none">TGL</span>
                      <span className="text-[2.5rem] font-mono font-black mt-1 leading-none">
                        {item.tanggal ? item.tanggal.substring(8, 10) : <Megaphone className="h-10 w-10" />}
                      </span>
                    </div>
                    <div className="flex-1">
                      {item.judul && (
                        <h3 className="text-4xl font-black text-foreground drop-shadow-sm mb-3">
                          {item.judul}
                        </h3>
                      )}
                      <p className={\`text-foreground/90 font-medium leading-snug \${item.judul ? 'text-2xl line-clamp-2' : 'text-3xl line-clamp-3'}\`}>
                        {item.isi}
                      </p>
                      <div className="text-primary font-black mt-4 font-mono uppercase tracking-widest text-lg flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                        {item.tanggal ? new Date(item.tanggal).toLocaleDateString("id-ID", { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) : ""}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}`;

codeTV = codeTV.replace(oldTVPengumuman, newTVPengumuman);


fs.writeFileSync(pathAdmin, codeAdmin, 'utf8');
fs.writeFileSync(pathTV, codeTV, 'utf8');
console.log('Successfully upgraded Pengumuman.');
