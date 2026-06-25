const fs = require('fs');
let code = fs.readFileSync('src/app/[masjidId]/page.js', 'utf8');

const oldSlideRotation = `  // 4. Slide Rotation Logic
  useEffect(() => {
    if (!settings || !settings.rotation_enabled || activeSlides.length <= 1) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setCurrentSlideIndex((curr) => (curr + 1) % activeSlides.length);
          return settings.rotation_interval || 12;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [settings, activeSlides]);

  // 4.5 Keuangan Pagination Logic
  useEffect(() => {
    if (!currentSlide || currentSlide.url !== "keuangan") {
      setKeuanganPage(0);
      return;
    }
    
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setHours(0, 0, 0, 0);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const weeklyData = (keuangan || []).filter(item => {
      if (!item.tanggal) return false;
      return new Date(item.tanggal) >= sevenDaysAgo;
    });
    
    const totalPages = Math.ceil(weeklyData.length / 4);
    if (totalPages <= 1) return;

    const timer = setInterval(() => {
      setKeuanganPage((prev) => (prev + 1) % totalPages);
    }, 5000);

    return () => clearInterval(timer);
  }, [currentSlide, keuangan]);

  
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
  }, [currentSlide, pengumuman]);`;


const newSlideRotation = `  // 4. Unified Slide & Pagination Rotation Logic
  useEffect(() => {
    if (!settings || !settings.rotation_enabled || activeSlides.length === 0) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          const currentSlideObj = activeSlides[currentSlideIndex];
          const rotationInterval = settings.rotation_interval || 12;
          
          // Check Pengumuman pagination
          if (currentSlideObj?.url === "pengumuman") {
            const totalPages = Math.ceil((pengumuman || []).length / 2);
            if (totalPages > 1) {
              if (pengumumanPage < totalPages - 1) {
                setPengumumanPage(pengumumanPage + 1);
                return rotationInterval;
              } else {
                setPengumumanPage(0);
              }
            }
          }

          // Check Keuangan pagination
          if (currentSlideObj?.url === "keuangan") {
             const sevenDaysAgo = new Date();
             sevenDaysAgo.setHours(0, 0, 0, 0);
             sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
             const weeklyData = (keuangan || []).filter(item => item.tanggal && new Date(item.tanggal) >= sevenDaysAgo);
             const totalPages = Math.ceil(weeklyData.length / 4);
             
             if (totalPages > 1) {
               if (keuanganPage < totalPages - 1) {
                 setKeuanganPage(keuanganPage + 1);
                 return rotationInterval;
               } else {
                 setKeuanganPage(0);
               }
             }
          }

          // Advance to next slide if not blocked by pagination
          // Only advance if there's more than 1 slide
          if (activeSlides.length > 1) {
            setCurrentSlideIndex((curr) => (curr + 1) % activeSlides.length);
          }
          return rotationInterval;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [settings, activeSlides, currentSlideIndex, pengumumanPage, keuanganPage, pengumuman, keuangan]);`;

code = code.replace(oldSlideRotation, newSlideRotation);
fs.writeFileSync('src/app/[masjidId]/page.js', code, 'utf8');
console.log('Unified slide rotation updated.');
