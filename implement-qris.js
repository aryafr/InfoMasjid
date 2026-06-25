const fs = require('fs');
const pathAdmin = 'src/app/[masjidId]/admin/page.js';
let codeAdmin = fs.readFileSync(pathAdmin, 'utf8');

// 1. Make sure icons are imported
const requiredIcons = ['Building', 'CreditCard', 'MessageSquare', 'QrCode', 'UploadCloud', 'Save'];
requiredIcons.forEach(icon => {
  if (!codeAdmin.includes(icon)) {
    codeAdmin = codeAdmin.replace('LayoutDashboard', `LayoutDashboard, ${icon}`);
  }
});

// 2. Refactor the QRIS Tab UI
const oldQrisTabStart = `          {/* ==================== 6. TAB: QRIS ==================== */}
          {activeTab === "qris" && qris && (
            <div className="relative">
              {renderPremiumLockOverlay()}
              <div className="animate-fade-in flex flex-col gap-6 max-w-6xl w-full mx-auto pb-20">
              <div className="bg-card/20 backdrop-blur-3xl border border-border/60 shadow-xl shadow-emerald-500/30 rounded-3xl p-8 shadow-sm max-w-2xl mx-auto w-full">
                <h2 className="text-lg font-bold text-foreground mb-6 border-b border-border pb-4">Pengaturan QRIS Donasi</h2>
                
                <form onSubmit={handleQrisSubmit} className="flex flex-col gap-5">
                  <div>
                    <label className="text-sm text-foreground font-medium mb-2 block">Nama Merchant (Atas Nama)</label>
                    <input 
                      type="text" 
                      value={qrisForm.atas_nama}
                      onChange={(e) => setQrisForm({ ...qrisForm, atas_nama: e.target.value })}
                      className="w-full bg-input/50 border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-foreground"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-5">
                    <div>
                      <label className="text-sm text-foreground font-medium mb-2 block">Nama Bank / E-Wallet</label>
                      <input 
                        type="text" 
                        value={qrisForm.bank}
                        onChange={(e) => setQrisForm({ ...qrisForm, bank: e.target.value })}
                        className="w-full bg-input/50 border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-foreground"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-foreground font-medium mb-2 block">Nomor Rekening</label>
                      <input 
                        type="text" 
                        value={qrisForm.nomor_rekening}
                        onChange={(e) => setQrisForm({ ...qrisForm, nomor_rekening: e.target.value })}
                        className="w-full bg-input/50 border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-foreground font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm text-foreground font-medium mb-2 block">Keterangan Ajakan</label>
                    <input 
                      type="text" 
                      value={qrisForm.keterangan}
                      onChange={(e) => setQrisForm({ ...qrisForm, keterangan: e.target.value })}
                      className="w-full bg-input/50 border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-foreground"
                    />
                  </div>

                  <div>
                    <label className="text-sm text-foreground font-medium mb-2 block">Upload Gambar QRIS</label>
                    <div className="flex items-center gap-4">
                      <div className="h-20 w-20 rounded-xl border border-border overflow-hidden bg-white shrink-0 shadow-inner flex items-center justify-center p-2">
                        {qrisForm.gambar ? (
                          <Image src={qrisForm.gambar} alt="QR Preview" width={80} height={80} className="object-contain w-full h-full mix-blend-multiply" />
                        ) : (
                          <span className="text-xs text-muted-foreground text-center">No Image</span>
                        )}
                      </div>
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            compressImageToBase64(file).then(base64 => {
                              setQrisForm({ ...qrisForm, gambar: base64 });
                            }).catch(err => {
                              console.error("Error compression QRIS:", err);
                              showAlert("Gagal", "Gagal mengolah gambar QRIS.");
                            });
                          }
                        }}
                        className="w-full bg-input/50 border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-primary text-foreground text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 transition-all cursor-pointer"
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                    <button type="submit" disabled={isSaving} className="bg-primary text-primary-foreground font-bold py-3 px-6 rounded-xl hover:opacity-90 transition-colors cursor-pointer flex items-center justify-center">
                      {isSaving ? <span className="animate-spin text-xl">⏳</span> : "Simpan Data QRIS"}
                    </button>
                  </div>
                </form>
              </div>
              </div>
            </div>
          )}`;

const newQrisTabStart = `          {/* ==================== 6. TAB: QRIS ==================== */}
          {activeTab === "qris" && qris && (
            <div className="relative">
              {renderPremiumLockOverlay()}
              <div className="animate-fade-in flex flex-col gap-6 max-w-6xl w-full mx-auto pb-20">
              <div className="bg-card/20 backdrop-blur-3xl border border-border/60 shadow-2xl shadow-primary/10 rounded-3xl p-8 shadow-sm max-w-2xl mx-auto w-full">
                
                <div className="flex items-center gap-4 mb-8 pb-5 border-b border-border/50">
                  <div className="p-3 bg-primary/10 rounded-2xl text-primary">
                    <QrCode className="w-7 h-7" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-foreground">Pengaturan QRIS Donasi</h2>
                    <p className="text-sm text-muted-foreground mt-1">Perbarui barcode QRIS dan rekening untuk kemudahan jamaah berdonasi.</p>
                  </div>
                </div>
                
                <form onSubmit={handleQrisSubmit} className="flex flex-col gap-6">
                  <div>
                    <label className="text-xs text-muted-foreground font-bold uppercase tracking-wider mb-2.5 flex items-center gap-2"><User className="w-4 h-4"/> Nama Merchant (Atas Nama)</label>
                    <input 
                      type="text" 
                      value={qrisForm.atas_nama}
                      placeholder="Cth: Masjid Al-Ikhlas"
                      onChange={(e) => setQrisForm({ ...qrisForm, atas_nama: e.target.value })}
                      className="w-full bg-input/50 border border-border rounded-xl px-4 py-3.5 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 text-foreground font-medium transition-all shadow-inner"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-xs text-muted-foreground font-bold uppercase tracking-wider mb-2.5 flex items-center gap-2"><Building className="w-4 h-4"/> Nama Bank / E-Wallet</label>
                      <input 
                        type="text" 
                        value={qrisForm.bank}
                        placeholder="Cth: BSI / Gopay"
                        onChange={(e) => setQrisForm({ ...qrisForm, bank: e.target.value })}
                        className="w-full bg-input/50 border border-border rounded-xl px-4 py-3.5 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 text-foreground font-medium transition-all shadow-inner"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground font-bold uppercase tracking-wider mb-2.5 flex items-center gap-2"><CreditCard className="w-4 h-4"/> Nomor Rekening</label>
                      <input 
                        type="text" 
                        value={qrisForm.nomor_rekening}
                        placeholder="Cth: 7123456789"
                        onChange={(e) => setQrisForm({ ...qrisForm, nomor_rekening: e.target.value })}
                        className="w-full bg-input/50 border border-border rounded-xl px-4 py-3.5 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 text-foreground font-mono font-bold tracking-wide transition-all shadow-inner"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-muted-foreground font-bold uppercase tracking-wider mb-2.5 flex items-center gap-2"><MessageSquare className="w-4 h-4"/> Keterangan Ajakan</label>
                    <input 
                      type="text" 
                      value={qrisForm.keterangan}
                      placeholder="Cth: Salurkan infak terbaik Anda melalui QRIS di atas"
                      onChange={(e) => setQrisForm({ ...qrisForm, keterangan: e.target.value })}
                      className="w-full bg-input/50 border border-border rounded-xl px-4 py-3.5 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 text-foreground font-medium transition-all shadow-inner"
                    />
                  </div>

                  <div className="pt-2">
                    <label className="text-xs text-muted-foreground font-bold uppercase tracking-wider mb-2.5 flex items-center gap-2"><QrCode className="w-4 h-4"/> Gambar QRIS</label>
                    
                    <div className="relative group rounded-3xl border-2 border-dashed border-primary/30 bg-primary/5 hover:bg-primary/10 transition-colors overflow-hidden">
                      <div className="flex flex-col items-center justify-center p-8 text-center min-h-[280px]">
                        {qrisForm.gambar ? (
                          <div className="relative w-48 h-48 rounded-xl bg-white shadow-md p-3 group-hover:scale-105 transition-transform duration-300">
                            <Image src={qrisForm.gambar} alt="QR Preview" fill className="object-contain p-2 mix-blend-multiply" />
                          </div>
                        ) : (
                          <div className="w-24 h-24 rounded-2xl bg-white shadow-sm flex items-center justify-center text-muted-foreground mb-4 opacity-50">
                             <QrCode className="w-12 h-12" />
                          </div>
                        )}
                        
                        <div className="mt-6 flex flex-col items-center">
                          <div className="flex items-center gap-2 text-primary font-bold bg-white px-5 py-2.5 rounded-full shadow-sm pointer-events-none">
                            <UploadCloud className="w-5 h-5" />
                            {qrisForm.gambar ? "Ganti Gambar QRIS" : "Pilih Gambar QRIS"}
                          </div>
                          <p className="text-xs text-muted-foreground mt-3 font-medium">Format: JPG, PNG (Maks 2MB)</p>
                        </div>
                      </div>
                      
                      {/* Invisible absolute file input covering the whole dropzone */}
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            compressImageToBase64(file).then(base64 => {
                              setQrisForm({ ...qrisForm, gambar: base64 });
                            }).catch(err => {
                              console.error("Error compression QRIS:", err);
                              showAlert("Gagal", "Gagal mengolah gambar QRIS.");
                            });
                          }
                        }}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        title="Upload gambar QRIS baru"
                      />
                    </div>
                  </div>

                  <div className="pt-6 mt-2 border-t border-border/50">
                    <button type="submit" disabled={isSaving} className="w-full bg-primary text-primary-foreground font-bold py-4 px-6 rounded-xl hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/30 transition-all cursor-pointer flex items-center justify-center gap-3 disabled:opacity-50 disabled:hover:translate-y-0">
                      {isSaving ? <span className="animate-spin text-xl">⏳</span> : <><Save className="w-5 h-5" /> Simpan Data QRIS</>}
                    </button>
                  </div>
                </form>
              </div>
              </div>
            </div>
          )}`;

codeAdmin = codeAdmin.replace(oldQrisTabStart, newQrisTabStart);

fs.writeFileSync(pathAdmin, codeAdmin, 'utf8');
console.log('Successfully upgraded QRIS UI.');
