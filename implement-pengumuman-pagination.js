const fs = require('fs');
let code = fs.readFileSync('src/app/[masjidId]/page.js', 'utf8');

// 1. Add state
code = code.replace(
  'const [keuanganPage, setKeuanganPage] = useState(0);',
  'const [keuanganPage, setKeuanganPage] = useState(0);\n  const [pengumumanPage, setPengumumanPage] = useState(0);'
);

// 2. Add useEffect logic
const useEffectLogic = `
  // 4.6 Pengumuman Pagination Logic
  useEffect(() => {
    if (!currentSlide || currentSlide.url !== "pengumuman") {
      setPengumumanPage(0);
      return;
    }
    
    const activePengumuman = pengumuman || [];
    const totalPages = Math.ceil(activePengumuman.length / 2); // 2 per page
    if (totalPages <= 1) return;

    const timer = setInterval(() => {
      setPengumumanPage((prev) => (prev + 1) % totalPages);
    }, 8000); // Rotate every 8 seconds

    return () => clearInterval(timer);
  }, [currentSlide, pengumuman]);

  // 5. Zero-Setup API Auto-Update`;
code = code.replace('// 5. Zero-Setup API Auto-Update', useEffectLogic);

// 3. Render logic
const renderStart = '{(pengumuman || []).slice(0, 4).map((item, index) => (';
const renderEnd = '{(pengumuman || []).slice(pengumumanPage * 2, (pengumumanPage + 1) * 2).map((item, index) => (';
code = code.replace(renderStart, renderEnd);

// 4. Add pagination dots
const oldSlideEnd = `                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Slide 6: Keuangan-Summary (Card Big Numbers) */}`;
const newSlideEnd = `                    </div>
                  </div>
                ))}
              </div>
              
              {/* Pagination Dots */}
              {pengumuman && pengumuman.length > 2 && (
                <div className="flex justify-center gap-2 mt-4">
                  {Array.from({ length: Math.ceil(pengumuman.length / 2) }).map((_, i) => (
                    <div key={i} className={\`h-2 rounded-full transition-all duration-500 \${i === pengumumanPage ? "w-8 bg-primary" : "w-2 bg-primary/30"}\`} />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Slide 6: Keuangan-Summary (Card Big Numbers) */}`;
code = code.replace(oldSlideEnd, newSlideEnd);

fs.writeFileSync('src/app/[masjidId]/page.js', code, 'utf8');
console.log('Pengumuman Pagination Updated.');
