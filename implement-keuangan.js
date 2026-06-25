const fs = require('fs');
const pathAdmin = 'src/app/[masjidId]/admin/page.js';
let codeAdmin = fs.readFileSync(pathAdmin, 'utf8');

// 1. Fix the typo in the header
const oldHeaderTitle = `{activeTab === 'keuangan' && "Track due billings"}`;
const newHeaderTitle = `{activeTab === 'keuangan' && "Kelola Kas Keuangan"}`;
codeAdmin = codeAdmin.replace(oldHeaderTitle, newHeaderTitle);

// 2. Refactor the Keuangan Tab UI
const oldKeuanganTabStart = `          {/* ==================== 5. TAB: KEUANGAN ==================== */}
          {activeTab === "keuangan" && (
            <div className="relative">
              {renderPremiumLockOverlay()}
              <div className="animate-fade-in flex flex-col gap-8 max-w-6xl w-full mx-auto pb-20">
                
                <div className="bg-card/20 backdrop-blur-3xl border border-border/60 shadow-xl shadow-emerald-500/30 rounded-3xl p-6 shadow-sm">
                  <h3 className="text-base font-bold text-foreground mb-5 pb-3 border-b border-border">Catat Transaksi Baru</h3>
                  
                  {/* TYPE SELECTOR TABS */}
                  <div className="flex gap-4 mb-6">
                    <button 
                      onClick={() => {
                        setTransactionType("masuk");
                        setNewKeuangan({ ...newKeuangan, kategori: "", pemasukan: newKeuangan.pemasukan || newKeuangan.pengeluaran, pengeluaran: 0 });
                      }}
                      className={\`flex-1 py-3 px-4 rounded-xl font-bold transition-all \${transactionType === "masuk" ? "bg-primary text-primary-foreground shadow-md" : "bg-muted/50 text-muted-foreground hover:bg-muted"}\`}
                    >
                      + Pemasukan Baru
                    </button>
                    <button 
                      onClick={() => {
                        setTransactionType("keluar");
                        setNewKeuangan({ ...newKeuangan, kategori: "", pengeluaran: newKeuangan.pemasukan || newKeuangan.pengeluaran, pemasukan: 0 });
                      }}
                      className={\`flex-1 py-3 px-4 rounded-xl font-bold transition-all \${transactionType === "keluar" ? "bg-destructive text-destructive-foreground shadow-md" : "bg-muted/50 text-muted-foreground hover:bg-muted"}\`}
                    >
                      - Pengeluaran Baru
                    </button>
                  </div>

                  <form onSubmit={handleAddKeuangan} className="grid grid-cols-12 gap-5 items-end">
                    <div className="col-span-12 md:col-span-3">
                      <label className="text-xs text-muted-foreground font-medium mb-1.5 block">Tanggal</label>
                      <input 
                        type="date" 
                        value={newKeuangan.tanggal}
                        onChange={(e) => setNewKeuangan({ ...newKeuangan, tanggal: e.target.value })}
                        className="w-full bg-input/50 border border-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-foreground"
                      />
                    </div>

                    <div className="col-span-12 md:col-span-3">
                      <label className="text-xs text-muted-foreground font-medium mb-1.5 block">Kategori</label>
                      <input 
                        list="kategori-options"
                        placeholder="Pilih atau ketik kategori..."
                        value={newKeuangan.kategori}
                        onChange={(e) => setNewKeuangan({ ...newKeuangan, kategori: e.target.value })}
                        className="w-full bg-input/50 border border-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-foreground"
                      />
                      <datalist id="kategori-options">
                        {transactionType === "masuk" ? (
                          <>
                            <option value="Infak Jumat" />
                            <option value="Infak Harian / Kotak Amal" />
                            <option value="Donatur Tetap" />
                            <option value="Zakat & Fidyah" />
                            <option value="Hibah / Lainnya" />
                          </>
                        ) : (
                          <>
                            <option value="Operasional & Pemeliharaan" />
                            <option value="Utilitas (Listrik/Air/Internet)" />
                            <option value="Pembangunan & Renovasi" />
                            <option value="Kajian, Dakwah & Pendidikan" />
                            <option value="Kegiatan Sosial / Santunan" />
                            <option value="Gaji Imam / Marbot / Pegawai" />
                          </>
                        )}
                      </datalist>
                    </div>

                    <div className="col-span-12 md:col-span-4">
                      <label className="text-xs text-muted-foreground font-medium mb-1.5 block">Keterangan / Deskripsi</label>
                      <input 
                        type="text" 
                        placeholder={transactionType === "masuk" ? "Cth: Infak Kotak Amal..." : "Cth: Bayar Listrik..."}
                        value={newKeuangan.deskripsi}
                        onChange={(e) => setNewKeuangan({ ...newKeuangan, deskripsi: e.target.value })}
                        className="w-full bg-input/50 border border-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-foreground"
                      />
                    </div>

                    <div className="col-span-12 md:col-span-2">
                      <label className="text-xs text-muted-foreground font-medium mb-1.5 block">Nominal (Rp)</label>
                      <input 
                        type="number" 
                        placeholder="0"
                        value={transactionType === "masuk" ? newKeuangan.pemasukan || "" : newKeuangan.pengeluaran || ""}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          if (transactionType === "masuk") {
                            setNewKeuangan({ ...newKeuangan, pemasukan: val, pengeluaran: 0 });
                          } else {
                            setNewKeuangan({ ...newKeuangan, pemasukan: 0, pengeluaran: val });
                          }
                        }}
                        className="w-full bg-input/50 border border-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-foreground"
                      />
                    </div>
                    
                    <div className="col-span-12 flex justify-end mt-4">
                      <button type="submit" className={\`\${transactionType === "masuk" ? "bg-primary" : "bg-destructive"} text-white text-sm font-medium px-8 py-3 rounded-xl shadow-sm hover:opacity-90 transition-colors cursor-pointer w-full md:w-auto\`}>
                        Simpan {transactionType === "masuk" ? "Pemasukan" : "Pengeluaran"}
                      </button>
                    </div>
                  </form>
                </div>

                {/* Ledger Table */}
                <div className="bg-card/20 backdrop-blur-3xl border border-border/60 shadow-xl shadow-emerald-500/30 rounded-3xl p-6 shadow-sm">
                  <div className="flex justify-between items-center mb-5 pb-3 border-b border-border">
                    <h3 className="text-base font-bold text-foreground">Buku Kas Rekapitulasi</h3>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                      <thead>
                        <tr>
                          <th className="py-3 px-4 text-xs font-semibold text-muted-foreground border-b border-border w-1/6">Tanggal</th>
                          <th className="py-3 px-4 text-xs font-semibold text-muted-foreground border-b border-border w-2/6">Keterangan</th>
                          <th className="py-3 px-4 text-xs font-semibold text-muted-foreground border-b border-border w-1/6">Kategori</th>
                          <th className="py-3 px-4 text-xs font-semibold text-muted-foreground border-b border-border w-1/6">Nominal</th>
                          <th className="py-3 px-4 text-xs font-semibold text-muted-foreground border-b border-border w-1/6">Status</th>
                          <th className="py-3 px-4 border-b border-border w-12"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/50">
                        {(keuangan || []).map((item, index) => {
                          const isIncome = item.pemasukan > 0;
                          return (
                            <tr key={item.id} className={\`hover:bg-muted/40 transition-colors \${index % 2 === 1 ? 'bg-muted/20' : 'bg-transparent'}\`}>
                              <td className="py-4 px-4 text-sm font-medium text-foreground">{item.tanggal}</td>
                              <td className="py-4 px-4 text-sm text-foreground/80 font-medium">{item.deskripsi}</td>
                              <td className="py-4 px-4">
                                <span className="inline-flex px-3 py-1 bg-secondary/30 text-secondary-foreground text-xs font-semibold rounded-lg border border-secondary/50">
                                  {item.kategori || "-"}
                                </span>
                              </td>
                              <td className="py-4 px-4 text-sm font-mono font-bold text-foreground">
                                Rp {Number(isIncome ? item.pemasukan : item.pengeluaran).toLocaleString("id-ID")}
                              </td>
                              <td className="py-4 px-4">
                                <span className={\`inline-flex px-3.5 py-1 text-xs font-bold rounded-full border \${
                                  isIncome 
                                    ? "bg-primary/10 text-primary border-primary/20" 
                                    : "bg-destructive/10 text-destructive border-destructive/20"
                                }\`}>
                                  {isIncome ? "Pemasukan" : "Pengeluaran"}
                                </span>
                              </td>
                              <td className="py-4 px-4 text-right">
                                <div className="flex items-center justify-end gap-2">
                                  <button 
                                    onClick={() => setEditingKeuangan(item)}
                                    className="text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                                    title="Edit"
                                  >
                                    <Edit className="h-4 w-4" />
                                  </button>
                                  <button 
                                    onClick={() => handleDeleteKeuangan(item.id)}
                                    className="text-muted-foreground hover:text-destructive transition-colors cursor-pointer"
                                    title="Hapus"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                        {(!keuangan || keuangan.length === 0) && (
                          <tr>
                            <td colSpan="6" className="py-10 text-center text-sm text-muted-foreground">Belum ada transaksi.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}`;

const newKeuanganTabStart = `          {/* ==================== 5. TAB: KEUANGAN ==================== */}
          {activeTab === "keuangan" && (
            <div className="relative">
              {renderPremiumLockOverlay()}
              <div className="animate-fade-in flex flex-col gap-8 max-w-6xl w-full mx-auto pb-20">
                
                <div className="bg-card/20 backdrop-blur-3xl border border-border/60 shadow-xl shadow-emerald-500/30 rounded-3xl p-8 shadow-sm">
                  <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border/50">
                    <div className="p-2.5 bg-primary/10 rounded-xl text-primary">
                      <Wallet className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold text-foreground">Catat Transaksi Baru</h3>
                  </div>
                  
                  {/* TYPE SELECTOR TABS */}
                  <div className="flex gap-4 mb-8">
                    <button 
                      onClick={() => {
                        setTransactionType("masuk");
                        setNewKeuangan({ ...newKeuangan, kategori: "", pemasukan: newKeuangan.pemasukan || newKeuangan.pengeluaran, pengeluaran: 0 });
                      }}
                      className={\`flex-1 py-4 px-6 rounded-2xl font-bold transition-all flex items-center justify-center gap-3 \${transactionType === "masuk" ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30 ring-2 ring-primary/50" : "bg-muted/50 text-muted-foreground hover:bg-muted"}\`}
                    >
                      <TrendingUp className="w-5 h-5" /> Pemasukan Baru
                    </button>
                    <button 
                      onClick={() => {
                        setTransactionType("keluar");
                        setNewKeuangan({ ...newKeuangan, kategori: "", pengeluaran: newKeuangan.pemasukan || newKeuangan.pengeluaran, pemasukan: 0 });
                      }}
                      className={\`flex-1 py-4 px-6 rounded-2xl font-bold transition-all flex items-center justify-center gap-3 \${transactionType === "keluar" ? "bg-destructive text-destructive-foreground shadow-lg shadow-destructive/30 ring-2 ring-destructive/50" : "bg-muted/50 text-muted-foreground hover:bg-muted"}\`}
                    >
                      <TrendingDown className="w-5 h-5" /> Pengeluaran Baru
                    </button>
                  </div>

                  <form onSubmit={handleAddKeuangan} className="grid grid-cols-12 gap-6 items-start">
                    <div className="col-span-12 md:col-span-3">
                      <label className="text-xs text-muted-foreground font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5"/> Tanggal</label>
                      <input 
                        type="date" 
                        value={newKeuangan.tanggal}
                        onChange={(e) => setNewKeuangan({ ...newKeuangan, tanggal: e.target.value })}
                        className="w-full bg-input/50 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-foreground transition-shadow"
                      />
                    </div>

                    <div className="col-span-12 md:col-span-3">
                      <label className="text-xs text-muted-foreground font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5"><Tag className="w-3.5 h-3.5"/> Kategori</label>
                      <input 
                        list="kategori-options"
                        placeholder="Pilih atau ketik kategori..."
                        value={newKeuangan.kategori}
                        onChange={(e) => setNewKeuangan({ ...newKeuangan, kategori: e.target.value })}
                        className="w-full bg-input/50 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-foreground transition-shadow"
                      />
                      <datalist id="kategori-options">
                        {transactionType === "masuk" ? (
                          <>
                            <option value="Infak Jumat" />
                            <option value="Infak Harian / Kotak Amal" />
                            <option value="Donatur Tetap" />
                            <option value="Zakat & Fidyah" />
                            <option value="Hibah / Lainnya" />
                          </>
                        ) : (
                          <>
                            <option value="Operasional & Pemeliharaan" />
                            <option value="Utilitas (Listrik/Air/Internet)" />
                            <option value="Pembangunan & Renovasi" />
                            <option value="Kajian, Dakwah & Pendidikan" />
                            <option value="Kegiatan Sosial / Santunan" />
                            <option value="Gaji Imam / Marbot / Pegawai" />
                          </>
                        )}
                      </datalist>
                    </div>

                    <div className="col-span-12 md:col-span-3">
                      <label className="text-xs text-muted-foreground font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5"><FileText className="w-3.5 h-3.5"/> Keterangan / Deskripsi</label>
                      <input 
                        type="text" 
                        placeholder={transactionType === "masuk" ? "Cth: Infak Kotak Amal..." : "Cth: Bayar Listrik..."}
                        value={newKeuangan.deskripsi}
                        onChange={(e) => setNewKeuangan({ ...newKeuangan, deskripsi: e.target.value })}
                        className="w-full bg-input/50 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-foreground transition-shadow"
                      />
                    </div>

                    <div className="col-span-12 md:col-span-3">
                      <label className="text-xs text-muted-foreground font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5"><DollarSign className="w-3.5 h-3.5"/> Nominal (Rp)</label>
                      <input 
                        type="text" 
                        placeholder="0"
                        value={transactionType === "masuk" 
                          ? (newKeuangan.pemasukan ? newKeuangan.pemasukan.toLocaleString('id-ID') : "") 
                          : (newKeuangan.pengeluaran ? newKeuangan.pengeluaran.toLocaleString('id-ID') : "")}
                        onChange={(e) => {
                          const rawValue = e.target.value.replace(/[^0-9]/g, '');
                          const val = Number(rawValue);
                          if (transactionType === "masuk") {
                            setNewKeuangan({ ...newKeuangan, pemasukan: val, pengeluaran: 0 });
                          } else {
                            setNewKeuangan({ ...newKeuangan, pemasukan: 0, pengeluaran: val });
                          }
                        }}
                        className="w-full bg-input/50 border border-border rounded-xl px-4 py-3 text-sm font-mono font-bold focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-foreground transition-shadow"
                      />
                    </div>
                    
                    <div className="col-span-12 flex justify-end mt-2 pt-4 border-t border-border/50">
                      <button type="submit" disabled={isSaving} className={\`\${transactionType === "masuk" ? "bg-primary" : "bg-destructive"} text-white font-bold px-8 py-3.5 rounded-xl shadow-lg hover:-translate-y-0.5 transition-all cursor-pointer w-full md:w-auto flex items-center justify-center gap-2 disabled:opacity-50\`}>
                        {isSaving ? <span className="animate-spin text-xl">⏳</span> : <>Simpan {transactionType === "masuk" ? "Pemasukan" : "Pengeluaran"}</>}
                      </button>
                    </div>
                  </form>
                </div>

                {/* Ledger Table */}
                <div className="bg-card/20 backdrop-blur-3xl border border-border/60 shadow-xl shadow-emerald-500/30 rounded-3xl p-8 shadow-sm">
                  <div className="flex justify-between items-center mb-6 pb-4 border-b border-border/50">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-secondary/80 rounded-xl text-secondary-foreground">
                        <FileText className="w-6 h-6" />
                      </div>
                      <h3 className="text-lg font-bold text-foreground">Buku Kas Rekapitulasi</h3>
                    </div>
                  </div>

                  <div className="overflow-x-auto custom-scrollbar pb-4">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                      <thead>
                        <tr>
                          <th className="py-4 px-5 text-xs font-bold text-muted-foreground uppercase tracking-wider border-b border-border w-1/6">Tanggal</th>
                          <th className="py-4 px-5 text-xs font-bold text-muted-foreground uppercase tracking-wider border-b border-border w-2/6">Keterangan</th>
                          <th className="py-4 px-5 text-xs font-bold text-muted-foreground uppercase tracking-wider border-b border-border w-1/6">Kategori</th>
                          <th className="py-4 px-5 text-xs font-bold text-muted-foreground uppercase tracking-wider border-b border-border w-1/6">Nominal</th>
                          <th className="py-4 px-5 text-xs font-bold text-muted-foreground uppercase tracking-wider border-b border-border w-1/6">Status</th>
                          <th className="py-4 px-5 border-b border-border w-16"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/40">
                        {(keuangan || []).map((item, index) => {
                          const isIncome = item.pemasukan > 0;
                          return (
                            <tr key={item.id} className={\`group hover:bg-muted/30 transition-colors \${index % 2 === 1 ? 'bg-muted/10' : 'bg-transparent'}\`}>
                              <td className="py-5 px-5 text-sm font-semibold text-foreground whitespace-nowrap">{item.tanggal}</td>
                              <td className="py-5 px-5 text-sm text-foreground/90 font-medium leading-relaxed">{item.deskripsi}</td>
                              <td className="py-5 px-5">
                                <span className="inline-flex px-3 py-1.5 bg-secondary/20 text-secondary-foreground text-xs font-bold rounded-lg border border-secondary/40 whitespace-nowrap">
                                  {item.kategori || "-"}
                                </span>
                              </td>
                              <td className={\`py-5 px-5 text-sm font-mono font-bold whitespace-nowrap \${isIncome ? 'text-primary' : 'text-destructive'}\`}>
                                Rp {Number(isIncome ? item.pemasukan : item.pengeluaran).toLocaleString("id-ID")}
                              </td>
                              <td className="py-5 px-5 whitespace-nowrap">
                                <span className={\`inline-flex px-4 py-1.5 text-xs font-bold rounded-full border \${
                                  isIncome 
                                    ? "bg-primary/15 text-primary border-primary/30" 
                                    : "bg-destructive/15 text-destructive border-destructive/30"
                                }\`}>
                                  {isIncome ? "Pemasukan" : "Pengeluaran"}
                                </span>
                              </td>
                              <td className="py-5 px-5 text-right whitespace-nowrap">
                                <div className="flex items-center justify-end gap-3 opacity-50 group-hover:opacity-100 transition-opacity">
                                  <button 
                                    onClick={() => setEditingKeuangan(item)}
                                    className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-colors cursor-pointer"
                                    title="Edit"
                                  >
                                    <Edit className="h-4.5 w-4.5" />
                                  </button>
                                  <button 
                                    onClick={() => handleDeleteKeuangan(item.id)}
                                    className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors cursor-pointer"
                                    title="Hapus"
                                  >
                                    <Trash2 className="h-4.5 w-4.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                        {(!keuangan || keuangan.length === 0) && (
                          <tr>
                            <td colSpan="6" className="py-20 text-center">
                               <div className="flex flex-col items-center justify-center text-muted-foreground opacity-60">
                                  <Wallet className="w-16 h-16 mb-4" />
                                  <p className="text-lg font-bold">Belum ada transaksi</p>
                                  <p className="text-sm mt-1">Mulai catat pemasukan atau pengeluaran pertama Anda.</p>
                               </div>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}`;

codeAdmin = codeAdmin.replace(oldKeuanganTabStart, newKeuanganTabStart);

// Make sure icons are imported
if (!codeAdmin.includes('TrendingDown')) {
  codeAdmin = codeAdmin.replace('LayoutDashboard, Megaphone', 'LayoutDashboard, Megaphone, Wallet, TrendingUp, TrendingDown, Tag, DollarSign, Calendar, FileText');
}

fs.writeFileSync(pathAdmin, codeAdmin, 'utf8');
console.log('Successfully upgraded Keuangan UI.');
