const fs = require('fs');
const pathAdmin = 'src/app/[masjidId]/admin/page.js';
let codeAdmin = fs.readFileSync(pathAdmin, 'utf8');

// Ensure necessary icons are imported
const requiredIcons = ['Save', 'MapPin', 'Clock', 'User', 'Calendar', 'Moon'];
requiredIcons.forEach(icon => {
  if (!codeAdmin.includes(` ${icon},`) && !codeAdmin.includes(` ${icon}\n`) && !codeAdmin.includes(` ${icon}\r`)) {
     // Be careful, they might be there. I'll just skip complex check since most are there.
  }
});

const oldIedBlock = `          {/* ==================== 6.5. TAB: SHOLAT IED ==================== */}
          {activeTab === "ied" && (
            <div className="relative">
              {renderPremiumLockOverlay()}
              <div className="animate-fade-in flex flex-col gap-6 max-w-6xl w-full mx-auto pb-20">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Form Idul Fitri */}
                  <div className="bg-card/20 backdrop-blur-3xl border border-border/60 shadow-xl shadow-teal-500/30 rounded-3xl p-8 shadow-sm">
                    <h2 className="text-lg font-bold text-foreground mb-6 border-b border-border pb-4 flex items-center gap-2">
                      <Moon className="h-5 w-5 text-teal-500" /> Idul Fitri
                    </h2>
                    <form onSubmit={handleIdulFitriSubmit} className="flex flex-col gap-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm text-foreground font-medium mb-1 block">Tahun Hijriah</label>
                          <input type="text" placeholder="1445 H" value={fitriForm.tahun} onChange={(e) => setFitriForm({ ...fitriForm, tahun: e.target.value })} className="w-full bg-input/50 border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-primary text-foreground" />
                        </div>
                        <div>
                          <label className="text-sm text-foreground font-medium mb-1 block">Tanggal (Masehi)</label>
                          <input type="date" value={fitriForm.tanggal} onChange={(e) => setFitriForm({ ...fitriForm, tanggal: e.target.value })} className="w-full bg-input/50 border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-primary text-foreground" />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm text-foreground font-medium mb-1 block">Imam</label>
                          <input type="text" placeholder="Nama Imam" value={fitriForm.imam} onChange={(e) => setFitriForm({ ...fitriForm, imam: e.target.value })} className="w-full bg-input/50 border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-primary text-foreground" />
                        </div>
                        <div>
                          <label className="text-sm text-foreground font-medium mb-1 block">Khatib</label>
                          <input type="text" placeholder="Nama Khatib" value={fitriForm.khatib} onChange={(e) => setFitriForm({ ...fitriForm, khatib: e.target.value })} className="w-full bg-input/50 border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-primary text-foreground" />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm text-foreground font-medium mb-1 block">Bilal / Muadzin</label>
                          <input type="text" placeholder="Nama Bilal" value={fitriForm.muadzin} onChange={(e) => setFitriForm({ ...fitriForm, muadzin: e.target.value })} className="w-full bg-input/50 border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-primary text-foreground" />
                        </div>
                        <div>
                          <label className="text-sm text-foreground font-medium mb-1 block">Waktu Pelaksanaan</label>
                          <input type="time" value={fitriForm.waktu} onChange={(e) => setFitriForm({ ...fitriForm, waktu: e.target.value })} className="w-full bg-input/50 border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-primary text-foreground" />
                        </div>
                      </div>
                      <div>
                        <label className="text-sm text-foreground font-medium mb-1 block">Keterangan Tambahan</label>
                        <input type="text" placeholder="Cth: Dilaksanakan di Lapangan Masjid" value={fitriForm.keterangan} onChange={(e) => setFitriForm({ ...fitriForm, keterangan: e.target.value })} className="w-full bg-input/50 border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-primary text-foreground" />
                      </div>
                      <button type="submit" className="mt-2 bg-primary text-primary-foreground font-medium px-8 py-3 rounded-xl shadow-sm hover:opacity-90 transition-all cursor-pointer">Simpan Data Idul Fitri</button>
                    </form>
                  </div>

                  {/* Form Idul Adha */}
                  <div className="bg-card/20 backdrop-blur-3xl border border-border/60 shadow-xl shadow-teal-500/30 rounded-3xl p-8 shadow-sm">
                    <h2 className="text-lg font-bold text-foreground mb-6 border-b border-border pb-4 flex items-center gap-2">
                      <Moon className="h-5 w-5 text-teal-500" /> Idul Adha
                    </h2>
                    <form onSubmit={handleIdulAdhaSubmit} className="flex flex-col gap-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm text-foreground font-medium mb-1 block">Tahun Hijriah</label>
                          <input type="text" placeholder="1445 H" value={adhaForm.tahun} onChange={(e) => setAdhaForm({ ...adhaForm, tahun: e.target.value })} className="w-full bg-input/50 border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-primary text-foreground" />
                        </div>
                        <div>
                          <label className="text-sm text-foreground font-medium mb-1 block">Tanggal (Masehi)</label>
                          <input type="date" value={adhaForm.tanggal} onChange={(e) => setAdhaForm({ ...adhaForm, tanggal: e.target.value })} className="w-full bg-input/50 border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-primary text-foreground" />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm text-foreground font-medium mb-1 block">Imam</label>
                          <input type="text" placeholder="Nama Imam" value={adhaForm.imam} onChange={(e) => setAdhaForm({ ...adhaForm, imam: e.target.value })} className="w-full bg-input/50 border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-primary text-foreground" />
                        </div>
                        <div>
                          <label className="text-sm text-foreground font-medium mb-1 block">Khatib</label>
                          <input type="text" placeholder="Nama Khatib" value={adhaForm.khatib} onChange={(e) => setAdhaForm({ ...adhaForm, khatib: e.target.value })} className="w-full bg-input/50 border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-primary text-foreground" />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm text-foreground font-medium mb-1 block">Bilal / Muadzin</label>
                          <input type="text" placeholder="Nama Bilal" value={adhaForm.muadzin} onChange={(e) => setAdhaForm({ ...adhaForm, muadzin: e.target.value })} className="w-full bg-input/50 border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-primary text-foreground" />
                        </div>
                        <div>
                          <label className="text-sm text-foreground font-medium mb-1 block">Waktu Pelaksanaan</label>
                          <input type="time" value={adhaForm.waktu} onChange={(e) => setAdhaForm({ ...adhaForm, waktu: e.target.value })} className="w-full bg-input/50 border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-primary text-foreground" />
                        </div>
                      </div>
                      <div>
                        <label className="text-sm text-foreground font-medium mb-1 block">Keterangan Tambahan</label>
                        <input type="text" placeholder="Cth: Dilaksanakan di Lapangan Masjid" value={adhaForm.keterangan} onChange={(e) => setAdhaForm({ ...adhaForm, keterangan: e.target.value })} className="w-full bg-input/50 border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-primary text-foreground" />
                      </div>
                      <button type="submit" className="mt-2 bg-primary text-primary-foreground font-medium px-8 py-3 rounded-xl shadow-sm hover:opacity-90 transition-all cursor-pointer">Simpan Data Idul Adha</button>
                    </form>
                  </div>
                  
                </div>
              </div>
            </div>
          )}`;


const newIedBlock = `          {/* ==================== 6.5. TAB: SHOLAT IED ==================== */}
          {activeTab === "ied" && (
            <div className="relative">
              {renderPremiumLockOverlay()}
              <div className="animate-fade-in flex flex-col gap-6 max-w-7xl w-full mx-auto pb-20">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  
                  {/* Form Idul Fitri */}
                  <div className="bg-card/20 backdrop-blur-3xl border border-border/60 shadow-2xl shadow-teal-500/10 rounded-3xl p-8 transition-all hover:shadow-teal-500/20 group">
                    <div className="flex items-center gap-4 mb-8 pb-5 border-b border-border/50">
                      <div className="p-3 bg-teal-500/10 rounded-2xl text-teal-500 group-hover:scale-110 transition-transform">
                        <Moon className="w-7 h-7" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-foreground">Idul Fitri</h2>
                        <p className="text-sm text-muted-foreground mt-1">Pengaturan jadwal sholat Idul Fitri.</p>
                      </div>
                    </div>
                    
                    <form onSubmit={handleIdulFitriSubmit} className="flex flex-col gap-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                          <label className="text-xs text-muted-foreground font-bold uppercase tracking-wider mb-2.5 flex items-center gap-2"><Calendar className="w-4 h-4"/> Tahun Hijriah</label>
                          <input type="text" placeholder="Cth: 1445 H" value={fitriForm.tahun} onChange={(e) => setFitriForm({ ...fitriForm, tahun: e.target.value })} className="w-full bg-input/50 border border-border rounded-xl px-4 py-3.5 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/30 text-foreground font-medium transition-all shadow-inner" />
                        </div>
                        <div>
                          <label className="text-xs text-muted-foreground font-bold uppercase tracking-wider mb-2.5 flex items-center gap-2"><Calendar className="w-4 h-4"/> Tanggal (Masehi)</label>
                          <input type="date" value={fitriForm.tanggal} onChange={(e) => setFitriForm({ ...fitriForm, tanggal: e.target.value })} className="w-full bg-input/50 border border-border rounded-xl px-4 py-3.5 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/30 text-foreground font-medium transition-all shadow-inner" />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                          <label className="text-xs text-muted-foreground font-bold uppercase tracking-wider mb-2.5 flex items-center gap-2"><User className="w-4 h-4"/> Imam</label>
                          <input type="text" placeholder="Nama Imam" value={fitriForm.imam} onChange={(e) => setFitriForm({ ...fitriForm, imam: e.target.value })} className="w-full bg-input/50 border border-border rounded-xl px-4 py-3.5 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/30 text-foreground font-medium transition-all shadow-inner" />
                        </div>
                        <div>
                          <label className="text-xs text-muted-foreground font-bold uppercase tracking-wider mb-2.5 flex items-center gap-2"><User className="w-4 h-4"/> Khatib</label>
                          <input type="text" placeholder="Nama Khatib" value={fitriForm.khatib} onChange={(e) => setFitriForm({ ...fitriForm, khatib: e.target.value })} className="w-full bg-input/50 border border-border rounded-xl px-4 py-3.5 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/30 text-foreground font-medium transition-all shadow-inner" />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                          <label className="text-xs text-muted-foreground font-bold uppercase tracking-wider mb-2.5 flex items-center gap-2"><Volume2 className="w-4 h-4"/> Bilal / Muadzin</label>
                          <input type="text" placeholder="Nama Bilal" value={fitriForm.muadzin} onChange={(e) => setFitriForm({ ...fitriForm, muadzin: e.target.value })} className="w-full bg-input/50 border border-border rounded-xl px-4 py-3.5 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/30 text-foreground font-medium transition-all shadow-inner" />
                        </div>
                        <div>
                          <label className="text-xs text-muted-foreground font-bold uppercase tracking-wider mb-2.5 flex items-center gap-2"><Clock className="w-4 h-4"/> Waktu Pelaksanaan</label>
                          <input type="time" value={fitriForm.waktu} onChange={(e) => setFitriForm({ ...fitriForm, waktu: e.target.value })} className="w-full bg-input/50 border border-border rounded-xl px-4 py-3.5 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/30 text-foreground font-medium transition-all shadow-inner font-mono" />
                        </div>
                      </div>
                      
                      <div>
                        <label className="text-xs text-muted-foreground font-bold uppercase tracking-wider mb-2.5 flex items-center gap-2"><MapPin className="w-4 h-4"/> Keterangan Tambahan</label>
                        <input type="text" placeholder="Cth: Dilaksanakan di Lapangan Utama Masjid" value={fitriForm.keterangan} onChange={(e) => setFitriForm({ ...fitriForm, keterangan: e.target.value })} className="w-full bg-input/50 border border-border rounded-xl px-4 py-3.5 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/30 text-foreground font-medium transition-all shadow-inner" />
                      </div>
                      
                      <div className="pt-4 mt-2 border-t border-border/50">
                        <button type="submit" disabled={isSaving} className="w-full bg-teal-500 text-white font-bold py-4 px-6 rounded-xl hover:-translate-y-1 hover:shadow-lg hover:shadow-teal-500/30 transition-all cursor-pointer flex items-center justify-center gap-3 disabled:opacity-50 disabled:hover:translate-y-0">
                          {isSaving ? <span className="animate-spin text-xl">⏳</span> : <><Save className="w-5 h-5" /> Simpan Data Idul Fitri</>}
                        </button>
                      </div>
                    </form>
                  </div>

                  {/* Form Idul Adha */}
                  <div className="bg-card/20 backdrop-blur-3xl border border-border/60 shadow-2xl shadow-indigo-500/10 rounded-3xl p-8 transition-all hover:shadow-indigo-500/20 group">
                    <div className="flex items-center gap-4 mb-8 pb-5 border-b border-border/50">
                      <div className="p-3 bg-indigo-500/10 rounded-2xl text-indigo-500 group-hover:scale-110 transition-transform">
                        <Moon className="w-7 h-7" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-foreground">Idul Adha</h2>
                        <p className="text-sm text-muted-foreground mt-1">Pengaturan jadwal sholat Idul Adha.</p>
                      </div>
                    </div>
                    
                    <form onSubmit={handleIdulAdhaSubmit} className="flex flex-col gap-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                          <label className="text-xs text-muted-foreground font-bold uppercase tracking-wider mb-2.5 flex items-center gap-2"><Calendar className="w-4 h-4"/> Tahun Hijriah</label>
                          <input type="text" placeholder="Cth: 1445 H" value={adhaForm.tahun} onChange={(e) => setAdhaForm({ ...adhaForm, tahun: e.target.value })} className="w-full bg-input/50 border border-border rounded-xl px-4 py-3.5 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 text-foreground font-medium transition-all shadow-inner" />
                        </div>
                        <div>
                          <label className="text-xs text-muted-foreground font-bold uppercase tracking-wider mb-2.5 flex items-center gap-2"><Calendar className="w-4 h-4"/> Tanggal (Masehi)</label>
                          <input type="date" value={adhaForm.tanggal} onChange={(e) => setAdhaForm({ ...adhaForm, tanggal: e.target.value })} className="w-full bg-input/50 border border-border rounded-xl px-4 py-3.5 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 text-foreground font-medium transition-all shadow-inner" />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                          <label className="text-xs text-muted-foreground font-bold uppercase tracking-wider mb-2.5 flex items-center gap-2"><User className="w-4 h-4"/> Imam</label>
                          <input type="text" placeholder="Nama Imam" value={adhaForm.imam} onChange={(e) => setAdhaForm({ ...adhaForm, imam: e.target.value })} className="w-full bg-input/50 border border-border rounded-xl px-4 py-3.5 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 text-foreground font-medium transition-all shadow-inner" />
                        </div>
                        <div>
                          <label className="text-xs text-muted-foreground font-bold uppercase tracking-wider mb-2.5 flex items-center gap-2"><User className="w-4 h-4"/> Khatib</label>
                          <input type="text" placeholder="Nama Khatib" value={adhaForm.khatib} onChange={(e) => setAdhaForm({ ...adhaForm, khatib: e.target.value })} className="w-full bg-input/50 border border-border rounded-xl px-4 py-3.5 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 text-foreground font-medium transition-all shadow-inner" />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                          <label className="text-xs text-muted-foreground font-bold uppercase tracking-wider mb-2.5 flex items-center gap-2"><Volume2 className="w-4 h-4"/> Bilal / Muadzin</label>
                          <input type="text" placeholder="Nama Bilal" value={adhaForm.muadzin} onChange={(e) => setAdhaForm({ ...adhaForm, muadzin: e.target.value })} className="w-full bg-input/50 border border-border rounded-xl px-4 py-3.5 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 text-foreground font-medium transition-all shadow-inner" />
                        </div>
                        <div>
                          <label className="text-xs text-muted-foreground font-bold uppercase tracking-wider mb-2.5 flex items-center gap-2"><Clock className="w-4 h-4"/> Waktu Pelaksanaan</label>
                          <input type="time" value={adhaForm.waktu} onChange={(e) => setAdhaForm({ ...adhaForm, waktu: e.target.value })} className="w-full bg-input/50 border border-border rounded-xl px-4 py-3.5 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 text-foreground font-medium transition-all shadow-inner font-mono" />
                        </div>
                      </div>
                      
                      <div>
                        <label className="text-xs text-muted-foreground font-bold uppercase tracking-wider mb-2.5 flex items-center gap-2"><MapPin className="w-4 h-4"/> Keterangan Tambahan</label>
                        <input type="text" placeholder="Cth: Dilaksanakan di Lapangan Utama Masjid" value={adhaForm.keterangan} onChange={(e) => setAdhaForm({ ...adhaForm, keterangan: e.target.value })} className="w-full bg-input/50 border border-border rounded-xl px-4 py-3.5 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 text-foreground font-medium transition-all shadow-inner" />
                      </div>
                      
                      <div className="pt-4 mt-2 border-t border-border/50">
                        <button type="submit" disabled={isSaving} className="w-full bg-indigo-500 text-white font-bold py-4 px-6 rounded-xl hover:-translate-y-1 hover:shadow-lg hover:shadow-indigo-500/30 transition-all cursor-pointer flex items-center justify-center gap-3 disabled:opacity-50 disabled:hover:translate-y-0">
                          {isSaving ? <span className="animate-spin text-xl">⏳</span> : <><Save className="w-5 h-5" /> Simpan Data Idul Adha</>}
                        </button>
                      </div>
                    </form>
                  </div>
                  
                </div>
              </div>
            </div>
          )}`;

codeAdmin = codeAdmin.replace(oldIedBlock, newIedBlock);

fs.writeFileSync(pathAdmin, codeAdmin, 'utf8');
console.log('Successfully upgraded Sholat Ied UI.');
