const fs = require('fs');
const pathAdmin = 'src/app/[masjidId]/admin/page.js';
let codeAdmin = fs.readFileSync(pathAdmin, 'utf8');

// I need to replace the entire QRIS block, which was accidentally deleted.
// The current code has:
//               <div className="bg-card/20 backdrop-blur-3xl border border-border/60 shadow-2xl shadow-primary/10 rounded-3xl p-8 shadow-sm max-w-2xl mx-auto w-full">
//               </div>
//             </div>
//             </div>

const badBlock = `<div className="bg-card/20 backdrop-blur-3xl border border-border/60 shadow-2xl shadow-primary/10 rounded-3xl p-8 shadow-sm max-w-2xl mx-auto w-full">
              </div>
            </div>
            </div>`;

const goodBlock = `<div className="bg-card/20 backdrop-blur-3xl border border-border/60 shadow-2xl shadow-primary/10 rounded-3xl p-8 shadow-sm max-w-2xl mx-auto w-full">
                
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
            </div>`;

codeAdmin = codeAdmin.replace(badBlock, goodBlock);

fs.writeFileSync(pathAdmin, codeAdmin, 'utf8');
console.log('Successfully injected QRIS code.');
