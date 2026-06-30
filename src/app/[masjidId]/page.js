"use client";

import { useParams, notFound } from "next/navigation";

import { useEffect, useState, useMemo, useRef } from "react";
import Image from "next/image";
import { 
  Clock, 
  Calendar, 
  Volume2, 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  MapPin, 
  Info, 
  CalendarDays,
  User,
  HeartHandshake,
  MoonStar,
  Megaphone,
  Maximize,
  AlertTriangle,
  Settings,
  Quote
} from "lucide-react";
import { 
  subscribeToSettings, 
  subscribeToJadwal, 
  subscribeToSholatJumat, 
  subscribeToPengumuman, 
  subscribeToKeuangan, 
  subscribeToQris, 
  subscribeToIdulFitri, 
  subscribeToIdulAdha,
  updateJadwalSholatFirestore,
  subscribeToMasjidRoot
} from "@/lib/firestoreService";

let audioCtx = null;
const playBeep = (isLong = false) => {
  if (typeof window === 'undefined') return;
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) audioCtx = new AudioContext();
  }
  if (!audioCtx) return;

  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }

  const duration = isLong ? 2.5 : 0.2;

  const oscillator = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();
  
  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(880, audioCtx.currentTime); // A5 note
  
  gainNode.gain.setValueAtTime(0.5, audioCtx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration);
  
  oscillator.connect(gainNode);
  gainNode.connect(audioCtx.destination);
  
  oscillator.start();
  oscillator.stop(audioCtx.currentTime + duration);
};

function convertGDriveLink(url) {
  if (!url) return url;
  
  // Handle drive.google.com/file/d/ID/view
  const match1 = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (match1 && match1[1]) {
    return `https://drive.google.com/uc?export=view&id=${match1[1]}`;
  }
  
  // Handle drive.google.com/open?id=ID
  const match2 = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (url.includes('drive.google.com') && match2 && match2[1]) {
    return `https://drive.google.com/uc?export=view&id=${match2[1]}`;
  }
  
  return url;
}

const FALLBACK_QUOTES = [
  "“Barangsiapa yang menempuh suatu jalan untuk menuntut ilmu, maka Allah Swt. akan memudahkan baginya jalan menuju surga.” (HR. Muslim)",
  "“Sebaik-baik kalian adalah orang yang belajar Al-Qur’an dan mengajarkannya.” (HR. Bukhari)",
  "“Tidaklah suatu kaum berkumpul di salah satu rumah Allah membaca Kitabullah dan saling mengajarkan satu dan lainnya melainkan akan turun kepada mereka sakinah (ketenangan).” (HR. Muslim)",
  "“Sesungguhnya shalat itu adalah fardhu yang ditentukan waktunya atas orang-orang yang beriman.” (QS. An-Nisa: 103)",
  "“Jadikanlah sabar dan shalat sebagai penolongmu. Dan sesungguhnya yang demikian itu sungguh berat, kecuali bagi orang-orang yang khusyu'.” (QS. Al-Baqarah: 45)"
];

const applyOffset = (timeStr, offsetMinutes) => {
  if (!timeStr || !offsetMinutes) return timeStr;
  const [h, m] = timeStr.split(':').map(Number);
  const date = new Date();
  date.setHours(h, m + parseInt(offsetMinutes), 0, 0);
  return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
};

export default function MasjidDisplay() {
  const params = useParams();
  const masjidId = params.masjidId || 'demo-masjid';

  // Force Light Mode for TV Display by removing 'dark' class on mount
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  // Realtime States
  const [settings, setSettings] = useState(null);
  const [jadwal, setJadwal] = useState(null);
  const [windowScale, setWindowScale] = useState(1);

  useEffect(() => {
    const handleResize = () => {
      const scaleX = window.innerWidth / 1920;
      const scaleY = window.innerHeight / 1080;
      setWindowScale(Math.min(scaleX, scaleY));
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  const [sholatJumat, setSholatJumat] = useState(null);
  const upcomingJumat = useMemo(() => {
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
  }, [sholatJumat]);
  const [pengumuman, setPengumuman] = useState([]);
  const [keuangan, setKeuangan] = useState([]);
  const [qris, setQris] = useState(null);
  const [idulFitri, setIdulFitri] = useState(null);
  const [idulAdha, setIdulAdha] = useState(null);
  const [masjidRoot, setMasjidRoot] = useState(undefined);
  const [serverTimeOffset, setServerTimeOffset] = useState(0);

  // UI States
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [time, setTime] = useState("");
  const [dateStr, setDateStr] = useState("");
  const [hijriDateStr, setHijriDateStr] = useState("");
  const [countdown, setCountdown] = useState(10);
  const [nextPrayer, setNextPrayer] = useState({ name: "", time: "", minutesLeft: 0, secondsLeft: 0 });
  const [activeSlides, setActiveSlides] = useState([]);
  const currentSlide = activeSlides[currentSlideIndex] || { url: "welcome", name: "Dashboard" };
  const [isIqamahMode, setIsIqamahMode] = useState(false);
  const [isSholatMode, setIsSholatMode] = useState(false);
  const [isMenjelangSholat, setIsMenjelangSholat] = useState(false);
  const [isAdzanMode, setIsAdzanMode] = useState(false);
  const [isMurottalMode, setIsMurottalMode] = useState(false);
  const [videoFinished, setVideoFinished] = useState(false);
  const [audioUnlocked, setAudioUnlocked] = useState(false);
  const [keuanganPage, setKeuanganPage] = useState(0);
  const [pengumumanPage, setPengumumanPage] = useState(0);

  // 0. Unlock Audio on first interaction
  useEffect(() => {
    const handleFirstInteraction = () => {
      if (typeof window !== 'undefined') {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!audioCtx && AudioContext) {
          audioCtx = new AudioContext();
        }
        if (audioCtx && audioCtx.state === 'suspended') {
          audioCtx.resume();
        }
        if (!document.fullscreenElement) {
          document.documentElement.requestFullscreen().catch(() => {});
        }
      }
      setAudioUnlocked(true);
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
      window.removeEventListener('touchstart', handleFirstInteraction);
    };

    window.addEventListener('click', handleFirstInteraction);
    window.addEventListener('keydown', handleFirstInteraction);
    window.addEventListener('touchstart', handleFirstInteraction);
    return () => {
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
      window.removeEventListener('touchstart', handleFirstInteraction);
    };
  }, []);

  const [timeOffset, setTimeOffset] = useState(0);

  const getJedaIqamah = (settings, prayerName) => {
    if (!settings) return 10 * 60;
    const w = prayerName.toLowerCase();
    const v = settings.jeda_iqamah;
    if (typeof v === 'object' && v[w] !== undefined) return v[w] * 60;
    return (typeof v === 'number' ? v : 10) * 60;
  };

  const getDurasiSholat = (settings, prayerName) => {
    if (!settings) return 15 * 60;
    const w = prayerName.toLowerCase();
    const v = settings.durasi_sholat;
    if (typeof v === 'object' && v[w] !== undefined) return v[w] * 60;
    return (typeof v === 'number' ? v : 15) * 60;
  };

  const handleSimulate = (mode) => {
    if (!jadwal) return;
    const localNow = new Date();
    const realNow = new Date(localNow.getTime() + serverTimeOffset);
    const tzOptions = settings?.timezone ? { timeZone: settings.timezone } : {};
    
    const timeParts = new Intl.DateTimeFormat('en-GB', {
      hour: 'numeric', minute: 'numeric', second: 'numeric', hourCycle: 'h23',
      ...tzOptions
    }).formatToParts(realNow);
    
    const hh = parseInt(timeParts.find(p => p.type === 'hour')?.value || '0');
    const mm = parseInt(timeParts.find(p => p.type === 'minute')?.value || '0');
    const ss = parseInt(timeParts.find(p => p.type === 'second')?.value || '0');
    
    const currentRealSeconds = hh * 3600 + mm * 60 + ss;
    
    const prayers = [
      { name: "Subuh", timeStr: jadwal.Subuh },
      { name: "Dzuhur", timeStr: jadwal.Dzuhur },
      { name: "Ashar", timeStr: jadwal.Ashar },
      { name: "Maghrib", timeStr: jadwal.Maghrib },
      { name: "Isya", timeStr: jadwal.Isya }
    ];
    
    let targetPrayerSeconds = null;
    let selectedJeda = 10 * 60;
    
    for (let prayer of prayers) {
      if (!prayer.timeStr) continue;
      const [h, m] = prayer.timeStr.split(":").map(Number);
      const ps = h * 3600 + m * 60;
      
      const jedaIqamah = getJedaIqamah(settings, prayer.name);
      const durasiSholat = getDurasiSholat(settings, prayer.name);
      const totalDuration = jedaIqamah + durasiSholat;

      if (currentRealSeconds < ps + totalDuration) {
        targetPrayerSeconds = ps;
        selectedJeda = jedaIqamah;
        break;
      }
    }
    let firstPrayer = prayers.find(p => p.timeStr);
    if (targetPrayerSeconds === null && firstPrayer) {
      const [h, m] = firstPrayer.timeStr.split(":").map(Number);
      targetPrayerSeconds = h * 3600 + m * 60 + 24 * 3600;
      selectedJeda = getJedaIqamah(settings, firstPrayer.name);
    }
    
    if (targetPrayerSeconds === null) return;
    
    let targetSeconds = currentRealSeconds;
    if (mode === 'menjelang') targetSeconds = targetPrayerSeconds - 10;
    if (mode === 'adzan') targetSeconds = targetPrayerSeconds;
    if (mode === 'iqamah') targetSeconds = targetPrayerSeconds + selectedJeda - 10;
    if (mode === 'sholat') targetSeconds = targetPrayerSeconds + selectedJeda;
    
    setTimeOffset(targetSeconds - currentRealSeconds);
  };

  // Sync time with WorldTimeAPI to prevent TV Clock drift
  useEffect(() => {
    if (!settings || !settings.timezone) return;
    
    const fetchRealTime = async () => {
      try {
        const res = await fetch(`https://worldtimeapi.org/api/timezone/${settings.timezone}`);
        if (!res.ok) return;
        const data = await res.json();
        // data.datetime contains the ISO string of the true time in that timezone
        const serverTime = new Date(data.datetime).getTime();
        const localTime = new Date().getTime();
        setServerTimeOffset(serverTime - localTime);
      } catch (error) {
        console.error("Failed to sync time with WorldTimeAPI", error);
      }
    };
    
    fetchRealTime();
    // Resync every hour to combat drift
    const syncInterval = setInterval(fetchRealTime, 3600 * 1000);
    return () => clearInterval(syncInterval);
  }, [settings?.timezone]);

  // 1. Clock & Next Prayer Calculation
  useEffect(() => {
    const updateTime = () => {
      const localNow = new Date();
      // Apply server time offset for the true current time
      const realNow = new Date(localNow.getTime() + serverTimeOffset);
      const now = new Date(realNow.getTime() + timeOffset * 1000);
      
      const tzOptions = settings?.timezone ? { timeZone: settings.timezone } : {};
      setTime(now.toLocaleTimeString("id-ID", { hour: '2-digit', minute: '2-digit', second: '2-digit', ...tzOptions }));
      
      const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', ...tzOptions };
      setDateStr(now.toLocaleDateString("id-ID", options));

      try {
        const hijriOptions = { day: 'numeric', month: 'long', year: 'numeric', ...tzOptions };
        setHijriDateStr(new Intl.DateTimeFormat('id-TN-u-ca-islamic', hijriOptions).format(now));
      } catch (e) {
        setHijriDateStr("");
      }

      if (jadwal) {
        const prayers = [
          { name: "Subuh", timeStr: jadwal.Subuh },
          { name: "Dzuhur", timeStr: jadwal.Dzuhur },
          { name: "Ashar", timeStr: jadwal.Ashar },
          { name: "Maghrib", timeStr: jadwal.Maghrib },
          { name: "Isya", timeStr: jadwal.Isya }
        ];

        const timeParts = new Intl.DateTimeFormat('en-GB', {
          hour: 'numeric', minute: 'numeric', second: 'numeric', hourCycle: 'h23',
          ...tzOptions
        }).formatToParts(now);
        
        const hh = parseInt(timeParts.find(p => p.type === 'hour')?.value || '0');
        const mm = parseInt(timeParts.find(p => p.type === 'minute')?.value || '0');
        const ss = parseInt(timeParts.find(p => p.type === 'second')?.value || '0');
        
        const currentSeconds = hh * 3600 + mm * 60 + ss;
        let found = false;
        
        for (let prayer of prayers) {
          if (prayer.timeStr) {
            const [h, m] = prayer.timeStr.split(":").map(Number);
            const prayerSeconds = h * 3600 + m * 60;
            
            const jedaIqamah = getJedaIqamah(settings, prayer.name);
            const durasiSholat = getDurasiSholat(settings, prayer.name);
            const totalDuration = jedaIqamah + durasiSholat;

            // If the prayer hasn't passed OR it passed but we're still in Iqamah/Sholat mode
            if (currentSeconds < prayerSeconds + totalDuration) {
              const secondsLeft = prayerSeconds - currentSeconds;
              
              let menjelangMode = false;
              let adzanMode = false;
              let iqamahMode = false;
              let sholatMode = false;
              let murottalMode = false;

              const adzanDuration = Math.min(60, jedaIqamah);

              // Murottal is handled globally now. We don't trigger it here.
              if (secondsLeft <= 300 && secondsLeft > 0) {
                menjelangMode = true;
              } else if (secondsLeft <= 0 && secondsLeft > -adzanDuration) {
                adzanMode = true;
              } else if (secondsLeft <= -adzanDuration && secondsLeft > -jedaIqamah) {
                iqamahMode = true;
              } else if (secondsLeft <= -jedaIqamah && secondsLeft > -totalDuration) {
                sholatMode = true;
              }

              // setIsMurottalMode(murottalMode); // Removed, handled below
              setIsMenjelangSholat(menjelangMode);
              setIsAdzanMode(adzanMode);
              setIsIqamahMode(iqamahMode);
              setIsSholatMode(sholatMode);

              setNextPrayer({
                name: prayer.name,
                time: prayer.timeStr.substring(0, 5),
                secondsLeft: secondsLeft,
                minutesLeft: Math.ceil(secondsLeft / 60)
              });

              // Beep on last 10 seconds before Adzan AND last 10 seconds before Sholat
              if ((secondsLeft >= 0 && secondsLeft <= 10) || 
                  (secondsLeft >= -jedaIqamah && secondsLeft <= -jedaIqamah + 10)) {
                const isLong = (secondsLeft === 0) || (secondsLeft === -jedaIqamah);
                playBeep(isLong);
              }

              found = true;
              break;
            }
          }
        }

        // If all prayers passed, next is tomorrow's first available prayer
        let firstPrayer = prayers.find(p => p.timeStr);
        if (!found && firstPrayer) {
          const [h, m] = firstPrayer.timeStr.split(":").map(Number);
          const prayerSeconds = h * 3600 + m * 60;
          const leftSec = (24 * 3600 - currentSeconds) + prayerSeconds;
          
          // setIsMurottalMode(false);
          setIsMenjelangSholat(false);
          setIsAdzanMode(false);
          setIsIqamahMode(false);
          setIsSholatMode(false);
          
          setNextPrayer({
            name: `${firstPrayer.name} (Besok)`,
            time: firstPrayer.timeStr.substring(0, 5),
            secondsLeft: leftSec,
            minutesLeft: Math.ceil(leftSec / 60)
          });
        }
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [jadwal, settings?.jeda_iqamah, settings?.durasi_sholat, timeOffset]);

  // 2. Subscriptions to Firestore (with Fallback to Mock Data)
  useEffect(() => {
    const unsubRoot = subscribeToMasjidRoot(masjidId, setMasjidRoot);
    const unsubSettings = subscribeToSettings(masjidId, setSettings);
    const unsubJadwal = subscribeToJadwal(masjidId, setJadwal);
    const unsubJumat = subscribeToSholatJumat(masjidId, setSholatJumat);
    const unsubPengumuman = subscribeToPengumuman(masjidId, setPengumuman);
    const unsubKeuangan = subscribeToKeuangan(masjidId, setKeuangan);
    const unsubQris = subscribeToQris(masjidId, setQris);
    const unsubFitri = subscribeToIdulFitri(masjidId, setIdulFitri);
    const unsubAdha = subscribeToIdulAdha(masjidId, setIdulAdha);

    return () => {
      unsubRoot();
      unsubSettings();
      unsubJadwal();
      unsubJumat();
      unsubPengumuman();
      unsubKeuangan();
      unsubQris();
      unsubFitri();
      unsubAdha();
    };
  }, []);

  // 2.5 YouTube API & Video State Logic
  useEffect(() => {
    // Reset videoFinished when admin toggles enabled to true
    if (settings?.murottal?.enabled) {
      setVideoFinished(false);
    }
  }, [settings?.murottal?.enabled]);

  useEffect(() => {
    // Calculate global Murottal Mode
    const isAnyPrayerMode = isMenjelangSholat || isAdzanMode || isIqamahMode || isSholatMode;
    const shouldPlayVideo = settings?.murottal?.enabled && !videoFinished && !isAnyPrayerMode && settings?.murottal?.url;
    setIsMurottalMode(shouldPlayVideo);
  }, [settings?.murottal?.enabled, videoFinished, isMenjelangSholat, isAdzanMode, isIqamahMode, isSholatMode, settings?.murottal?.url]);

  useEffect(() => {
    if (isMurottalMode) {
      const loadPlayer = () => {
        if (!window.YT || !window.YT.Player) {
          setTimeout(loadPlayer, 500);
          return;
        }

        let videoId = "";
        const url = settings.murottal.url;
        if (url.includes("v=")) videoId = url.split("v=")[1].split("&")[0];
        else if (url.includes("embed/")) videoId = url.split("embed/")[1].split("?")[0];
        else if (url.includes("youtu.be/")) videoId = url.split("youtu.be/")[1].split("?")[0];
        else videoId = url;

        const container = document.getElementById('youtube-player-container');
        if (container) {
          container.innerHTML = '<div id="youtube-player" class="w-full h-full"></div>';
          new window.YT.Player('youtube-player', {
            videoId: videoId,
            playerVars: { autoplay: 1, controls: 0, mute: 0, rel: 0, modestbranding: 1 },
            events: {
              'onStateChange': (event) => {
                if (event.data === window.YT.PlayerState.ENDED) {
                  setVideoFinished(true);
                }
              }
            }
          });
        }
      };

      if (!window.YT) {
        const tag = document.createElement('script');
        tag.src = "https://www.youtube.com/iframe_api";
        const firstScriptTag = document.getElementsByTagName('script')[0];
        if (firstScriptTag && firstScriptTag.parentNode) {
          firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
        } else {
          document.head.appendChild(tag);
        }
        window.onYouTubeIframeAPIReady = loadPlayer;
      } else {
        loadPlayer();
      }
    }
  }, [isMurottalMode, settings?.murottal?.url]);

  // Setup active slides based on subscription
  useEffect(() => {
    if (settings && masjidRoot !== undefined) {
      const isPremium = masjidRoot?.subscription_package === 'premium' || masjidId === 'demo-masjid';
      const premiumPages = ['keuangan', 'keuangan-summary', 'qris', 'idul-fitri', 'idul-adha', 'hitung-mundur'];

      let active = (settings.rotation_pages || []).filter(p => {
        if (!p.active) return false;
        if (!isPremium && premiumPages.includes(p.url)) return false;
        return true;
      });
      
      // Inject posters as individual slides ONLY for Premium
      if (isPremium && settings.posters && settings.posters.length > 0) {
        settings.posters.forEach((posterUrl, index) => {
          if (posterUrl) {
            active.push({
              url: `poster-${index}`,
              name: `Poster Campaign ${index + 1}`,
              active: true,
              isPoster: true,
              imageUrl: posterUrl
            });
          }
        });
      }
      
      setActiveSlides(active);
      setCountdown(settings.rotation_interval || 12);
    }
  }, [settings, masjidRoot, masjidId]);

  // Prepare TV Financial Filter
  const keuanganFilteredTV = useMemo(() => {
    return (keuangan || []).filter(item => {
      if (!item.tanggal) return false;
      const itemDate = new Date(item.tanggal);
      const filterType = settings?.keuangan_tv_filter?.type || 'weekly';

      if (filterType === 'weekly') {
         const sevenDaysAgo = new Date();
         sevenDaysAgo.setHours(0, 0, 0, 0);
         sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
         return itemDate >= sevenDaysAgo && itemDate <= new Date();
      }
      if (filterType === 'monthly') {
         const now = new Date();
         return itemDate.getMonth() === now.getMonth() && itemDate.getFullYear() === now.getFullYear();
      }
      if (filterType === 'custom') {
         const start = settings?.keuangan_tv_filter?.customStart;
         const end = settings?.keuangan_tv_filter?.customEnd;
         if (!start || !end) return true;
         const startDate = new Date(start);
         startDate.setHours(0, 0, 0, 0);
         const endDate = new Date(end);
         endDate.setHours(23, 59, 59, 999);
         return itemDate >= startDate && itemDate <= endDate;
      }
      return true;
    }).sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal));
  }, [keuangan, settings?.keuangan_tv_filter]);

  // 4. Unified Slide & Pagination Rotation Logic
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
             const totalPages = Math.ceil(keuanganFilteredTV.length / 4);
             
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
  }, [settings, activeSlides, currentSlideIndex, pengumumanPage, keuanganPage, pengumuman, keuangan]);

  // 5. Zero-Setup API Auto-Update
  useEffect(() => {
    if (!settings || !settings.auto_update.enabled || !jadwal) return;

    const checkAndUpdateJadwal = async () => {
      const todayStr = new Date().toISOString().split('T')[0];
      const lastUpdateStr = jadwal.updated_at ? jadwal.updated_at.split('T')[0] : "";

      if (todayStr !== lastUpdateStr) {
        try {
          const city = settings.auto_update.city || "Balikpapan";
          const country = settings.auto_update.country || "Indonesia";
          const method = settings.auto_update.method || 11;
          
          const res = await fetch(
            `https://api.aladhan.com/v1/timingsByCity?city=${encodeURIComponent(city)}&country=${encodeURIComponent(country)}&method=${method}`
          );
          if (res.ok) {
            const result = await res.json();
            const timings = result.data.timings;
            
            const offsets = settings.jadwal_offsets || {};
            const newJadwal = {
              Imsak: applyOffset(timings.Imsak, offsets.Imsak || 0),
              Subuh: applyOffset(timings.Fajr, offsets.Subuh || 0),
              Terbit: applyOffset(timings.Sunrise, offsets.Terbit || 0),
              Dzuhur: applyOffset(timings.Dhuhr, offsets.Dzuhur || 0),
              Ashar: applyOffset(timings.Asr, offsets.Ashar || 0),
              Maghrib: applyOffset(timings.Maghrib, offsets.Maghrib || 0),
              Isya: applyOffset(timings.Isha, offsets.Isya || 0)
            };
            
            await updateJadwalSholatFirestore(masjidId, newJadwal);
          }
        } catch (err) {
          console.error("Gagal melakukan auto-update jadwal sholat:", err);
        }
      }
    };

    checkAndUpdateJadwal();
  }, [settings, jadwal]);

  // Manual Keyboard Control
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowRight" || e.key === " ") {
        e.preventDefault();
        setCurrentSlideIndex((curr) => (curr + 1) % activeSlides.length);
        if (settings) setCountdown(settings.rotation_interval || 12);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        setCurrentSlideIndex((curr) => (curr - 1 + activeSlides.length) % activeSlides.length);
        if (settings) setCountdown(settings.rotation_interval || 12);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeSlides, settings]);

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  if (masjidRoot === null) {
    notFound();
  }

  if (!settings || masjidRoot === undefined) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-8">
        <div className="text-center">
          <div className="h-24 w-24 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-6"></div>
          <p className="text-3xl font-bold tracking-wide">Memuat Masjid Digital...</p>
        </div>
      </div>
    );
  }

  // PAYMENT LOCK CHECK
  const isExpired = masjidRoot?.active_until ? 
    (masjidRoot.active_until.toDate ? masjidRoot.active_until.toDate() : new Date(masjidRoot.active_until)).getTime() < Date.now() 
    : false;

  if (masjidRoot && masjidRoot.payment_status === "pending" && masjidId !== "demo-masjid") {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-8 text-center border-8 border-red-500">
        <div className="w-24 h-24 bg-red-500/20 rounded-full flex items-center justify-center mb-6">
          <Clock className="w-12 h-12 text-red-500" />
        </div>
        <h1 className="text-5xl font-bold text-white mb-6">MENUNGGU PEMBAYARAN</h1>
        <p className="text-2xl text-gray-400 max-w-3xl leading-relaxed">
          Layar TV InfoMasjid ini sedang dikunci karena status pendaftaran masih tertunda (Pending). 
          <br/><br/>
          Silakan selesaikan pembayaran tagihan Anda. Layar ini akan terbuka otomatis setelah sistem menerima konfirmasi pembayaran dari Midtrans.
        </p>
      </div>
    );
  }

  // EXPIRY LOCK CHECK
  if (isExpired && masjidId !== "demo-masjid") {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-8 text-center border-8 border-orange-500">
        <div className="w-24 h-24 bg-orange-500/20 rounded-full flex items-center justify-center mb-6">
          <AlertTriangle className="w-12 h-12 text-orange-500" />
        </div>
        <h1 className="text-5xl font-bold text-white mb-6">LANGGANAN BERAKHIR</h1>
        <p className="text-2xl text-gray-400 max-w-3xl leading-relaxed">
          Masa berlaku langganan InfoMasjid Anda telah berakhir.
          <br/><br/>
          Silakan perpanjang langganan melalui panel admin untuk kembali menggunakan layanan ini.
        </p>
      </div>
    );
  }

  if (!settings || !jadwal) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background text-primary">
        <div className="text-center">
          <div className="h-24 w-24 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-6"></div>
          <p className="text-3xl font-bold tracking-wide">Memuat Masjid Digital...</p>
        </div>
      </div>
    );
  }

  // Remove currentSlide here since it's moved up

  // Calculate financial sum (All-time)
  const totalPemasukan = (keuangan || []).reduce((sum, item) => sum + Number(item.pemasukan || 0), 0);
  const totalPengeluaran = (keuangan || []).reduce((sum, item) => sum + Number(item.pengeluaran || 0), 0);
  const saldo = totalPemasukan - totalPengeluaran;

  // TV Financial Sum based on filter
  const totalPemasukanTV = keuanganFilteredTV.reduce((sum, item) => sum + Number(item.pemasukan || 0), 0);
  const totalPengeluaranTV = keuanganFilteredTV.reduce((sum, item) => sum + Number(item.pengeluaran || 0), 0);

  // Calculate breakdown for summary
  const breakdownPemasukan = (keuangan || []).filter(i => i.pemasukan > 0).reduce((acc, curr) => {
    acc[curr.kategori || "Lainnya"] = (acc[curr.kategori || "Lainnya"] || 0) + Number(curr.pemasukan);
    return acc;
  }, {});
  const breakdownPengeluaran = (keuangan || []).filter(i => i.pengeluaran > 0).reduce((acc, curr) => {
    acc[curr.kategori || "Lainnya"] = (acc[curr.kategori || "Lainnya"] || 0) + Number(curr.pengeluaran);
    return acc;
  }, {});
  
  const sortedPemasukanKeys = Object.keys(breakdownPemasukan).sort((a, b) => breakdownPemasukan[b] - breakdownPemasukan[a]).slice(0, 3);
  const sortedPengeluaranKeys = Object.keys(breakdownPengeluaran).sort((a, b) => breakdownPengeluaran[b] - breakdownPengeluaran[a]).slice(0, 3);

  return (
    <div className="w-screen h-screen overflow-hidden flex items-center justify-center bg-black">
      <div 
        style={{ 
          width: '1920px', 
          height: '1080px', 
          transform: `scale(${windowScale})`, 
          transformOrigin: 'center center' 
        }}
        className={`relative shrink-0 flex flex-col bg-background text-foreground p-6 overflow-hidden font-sans ${settings?.tema || 'theme-emerald'}`}
      >
      
      {/* Fullscreen Toggle */}
      <button 
        onClick={toggleFullScreen}
        className="absolute top-4 right-4 z-[200] p-3 bg-black/20 hover:bg-black/40 backdrop-blur-sm rounded-full text-white/50 hover:text-white transition-all pointer-events-auto"
        title="Layar Penuh (F11)"
      >
        <Maximize className="w-5 h-5" />
      </button>

      {/* Audio Unlock Warning */}
      {!audioUnlocked && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[100] bg-destructive text-destructive-foreground px-6 py-2 rounded-full font-bold text-sm shadow-xl animate-pulse cursor-pointer pointer-events-auto">
          Klik layar ini untuk mengizinkan suara TV
        </div>
      )}

      {/* SHOLAT / IQAMAH / ADZAN OVERLAYS */}
      {(isMenjelangSholat || isAdzanMode || isIqamahMode || isSholatMode) && (
        <div className={`absolute inset-0 z-[100] flex flex-col items-center justify-center transition-all duration-1000 ${
          isSholatMode
            ? "bg-black text-white" 
            : "bg-background text-foreground"
        }`}>

          {/* Background Decorations for non-sholat non-murottal mode */}
          {(!isSholatMode && !isMurottalMode) && (
            <>
              {/* Premium Glow */}
              <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/20 rounded-[100%] blur-[160px] pointer-events-none z-0"></div>
              <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-secondary/20 rounded-[100%] blur-[160px] pointer-events-none z-0"></div>

              {/* Islamic Pattern / Border */}
              <div className="absolute inset-8 border-[6px] border-primary/30 rounded-[4rem] pointer-events-none z-0 overflow-hidden shadow-2xl">
                <div className="absolute inset-0 border-4 border-primary/20 m-3 rounded-[3.5rem]"></div>
                
                {/* Decorative corners */}
                <div className="absolute top-0 left-0 w-32 h-32 border-r-[12px] border-b-[12px] border-primary/40 rounded-br-[5rem] shadow-xl"></div>
                <div className="absolute top-0 right-0 w-32 h-32 border-l-[12px] border-b-[12px] border-primary/40 rounded-bl-[5rem] shadow-xl"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 border-r-[12px] border-t-[12px] border-primary/40 rounded-tr-[5rem] shadow-xl"></div>
                <div className="absolute bottom-0 right-0 w-32 h-32 border-l-[12px] border-t-[12px] border-primary/40 rounded-tl-[5rem] shadow-xl"></div>
              </div>
            </>
          )}

          {/* SHOLAT MODE (BLACK) */}
          {isSholatMode && (
             <div className="flex flex-col items-center justify-center z-10 w-full h-full">
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03] z-0">
                  <span className="font-serif text-[45rem] text-white">بسم الله</span>
                </div>
                <h1 className="text-6xl md:text-8xl font-black mb-12 text-emerald-400 text-center uppercase tracking-widest drop-shadow-lg">
                  LURUSKAN & RAPATKAN SHAF
                </h1>
                <div className="text-4xl text-gray-400 mt-8 flex items-center gap-4">
                  <span className="w-4 h-4 rounded-full bg-red-500 animate-pulse"></span>
                  Harap nonaktifkan ponsel Anda selama sholat berlangsung
                </div>
             </div>
          )}

          {/* OTHER MODES */}
          {(!isSholatMode && !isMurottalMode) && (
            <div className="z-10 flex flex-col items-center justify-center w-full max-w-6xl px-8 relative mt-10">
              
              {/* LARGE CLOCK / ICON */}
              <div className="mb-10 flex items-center justify-center w-full">
                {isMenjelangSholat && (
                  <div className="text-[16rem] font-mono font-black tabular-nums tracking-tighter text-foreground leading-none">
                    {(() => {
                      const m = Math.floor(Math.max(0, nextPrayer.secondsLeft) / 60);
                      const s = Math.max(0, nextPrayer.secondsLeft) % 60;
                      return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
                    })()}
                  </div>
                )}
                {isAdzanMode && (
                  <div className="h-64 w-64 bg-primary text-primary-foreground rounded-full flex items-center justify-center border-[12px] border-primary/20 shadow-2xl shadow-primary animate-pulse mt-8">
                    <Volume2 className="h-32 w-32" />
                  </div>
                )}
                {isIqamahMode && (
                  <div className={`text-[16rem] font-mono font-black tabular-nums tracking-tighter leading-none transition-colors duration-500 ${
                    (() => {
                      const jeda = getJedaIqamah(settings, nextPrayer.name);
                      const remaining = jeda + nextPrayer.secondsLeft;
                      return remaining > 0 && remaining <= 10 ? "text-red-500 scale-110 animate-pulse" : "text-foreground";
                    })()
                  }`}>
                    {(() => {
                      const jeda = getJedaIqamah(settings, nextPrayer.name);
                      const remaining = jeda + nextPrayer.secondsLeft;
                      const m = Math.floor(Math.max(0, remaining) / 60);
                      const s = Math.max(0, remaining) % 60;
                      return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
                    })()}
                  </div>
                )}
              </div>

              {/* CURRENT TIME BADGE */}
              <div className="flex items-center justify-center gap-4 mb-12 w-full relative">
                 <div className="absolute inset-x-0 h-[3px] bg-gradient-to-r from-transparent via-primary/40 to-transparent top-1/2 -translate-y-1/2"></div>
                 <div className="absolute inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-primary/80 to-transparent top-1/2 -translate-y-1/2"></div>
                 <div className="bg-foreground text-background px-10 py-4 rounded-full text-5xl font-black font-mono shadow-2xl relative z-10 flex items-center gap-4">
                   <Clock className="h-10 w-10 text-background/70" /> {time}
                 </div>
              </div>

              {/* TITLE */}
              <h2 className="text-7xl font-black text-foreground mb-8 uppercase tracking-widest drop-shadow-sm text-center">
                {isMenjelangSholat && `Menjelang ${nextPrayer.name}`}
                {isAdzanMode && `Saatnya Adzan ${nextPrayer.name}`}
                {isIqamahMode && "Menjelang Iqamah"}
              </h2>

              {/* HADITH / MESSAGE */}
              <div className="text-center max-w-4xl text-3xl font-medium text-foreground/80 mt-6 leading-relaxed">
                {(isMenjelangSholat || isAdzanMode) && (
                  <div className="italic">
                    "Salat berjamaah itu lebih utama daripada salat sendiri sebanyak 27 derajat."<br/>
                    <span className="font-black block mt-4 text-primary">- HR. Bukhari</span>
                  </div>
                )}
                {isIqamahMode && (
                  <div className="bg-primary/10 px-10 py-8 rounded-[2rem] border-2 border-primary/30 mt-4">
                    Para jamaah mohon untuk bersiap, dan alat komunikasi<br/>
                    mohon dalam mode senyap, terima kasih.
                  </div>
                )}
              </div>

            </div>
          )}
        </div>
      )}

      {/* Premium Luxury Background Glows (Mesh Gradient Effect) */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/30 rounded-[100%] blur-[160px] pointer-events-none z-0 animate-pulse-soft mix-blend-multiply dark:mix-blend-screen"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-secondary/30 rounded-[100%] blur-[160px] pointer-events-none z-0 animate-pulse-soft mix-blend-multiply dark:mix-blend-screen" style={{ animationDelay: '2s' }}></div>
      <div className="absolute top-[20%] left-[30%] w-[40%] h-[40%] bg-accent/20 rounded-[100%] blur-[140px] pointer-events-none z-0 animate-pulse-soft mix-blend-multiply dark:mix-blend-screen" style={{ animationDelay: '1s' }}></div>
      
      {/* Decorative Calligraphy Watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.02] z-0">
        <span className="font-serif text-[45rem] text-foreground">بسم الله</span>
      </div>

      {/* HEADER SECTION */}
      <header className="relative z-10 flex items-center justify-between border-b-2 border-border/60 pb-6 mb-6 shrink-0">
        <div className="flex items-center gap-6">
          <div className="h-28 w-28 flex items-center justify-center shrink-0 drop-shadow-xl">
            {(masjidRoot?.subscription_package === 'premium' || masjidId === 'demo-masjid') && settings?.logo_url ? (
              <img src={convertGDriveLink(settings.logo_url)} alt="Logo Masjid" className="w-full h-full object-contain" />
            ) : (
              <Image src="/icon.png" alt="Logo InfoMasjid" width={112} height={112} className="w-full h-full object-contain" />
            )}
          </div>
          <div>
            <h1 className="text-5xl font-black tracking-tight text-foreground drop-shadow-sm">
              {settings.nama_aplikasi}
            </h1>
          </div>
        </div>

        {/* Global Countdown & Time */}
        <div className="flex items-center gap-4">
          {/* Next Prayer Countdown Widget */}
          <div className="bg-card/20 backdrop-blur-3xl border-2 border-border/80 px-8 py-4 rounded-3xl shadow-2xl flex items-center gap-6 shadow-primary/5 mr-2 relative shrink-0 overflow-hidden">
            <div className="absolute left-0 inset-y-0 w-2 bg-gradient-to-b from-primary via-secondary to-primary"></div>
            <div className="flex flex-col items-end justify-center">
              <span className="text-sm font-black text-primary tracking-widest uppercase mb-1 whitespace-nowrap">
                Jadwal Berikutnya
              </span>
              <span className="text-3xl font-black text-foreground uppercase drop-shadow-sm leading-none whitespace-nowrap">
                {nextPrayer.name}
              </span>
            </div>
            <div className="h-16 w-1 bg-border/50 rounded-full mx-2"></div>
            <div className="flex items-center gap-4">
              <span className={`text-5xl font-mono font-black tabular-nums tracking-tighter drop-shadow-md transition-all duration-500 ${
                nextPrayer.secondsLeft > 0 && nextPrayer.secondsLeft <= 10
                  ? "text-red-500 scale-110 animate-pulse"
                  : "text-primary"
              }`}>
                {nextPrayer.time}
              </span>
              <div className={`px-5 py-2 rounded-full text-base font-black tracking-widest uppercase shadow-inner whitespace-nowrap flex items-center justify-center transition-all duration-300 ${
                nextPrayer.secondsLeft > 0 && nextPrayer.secondsLeft <= 10
                  ? "bg-red-600 text-white border-transparent shadow-lg scale-110 shadow-red-500/40"
                  : nextPrayer.minutesLeft <= 10 
                    ? "bg-destructive text-destructive-foreground border-transparent animate-pulse shadow-lg shadow-destructive/40" 
                    : "bg-muted/80 text-foreground border-2 border-border"
              }`}>
                {nextPrayer.secondsLeft > 0 && nextPrayer.secondsLeft <= 10
                  ? `${nextPrayer.secondsLeft} Dtk`
                  : nextPrayer.minutesLeft > 60 
                    ? `${Math.floor(nextPrayer.minutesLeft / 60)}J ${nextPrayer.minutesLeft % 60}M`
                    : `${nextPrayer.minutesLeft} MNT`
                }
              </div>
            </div>
          </div>

          <div className="text-right mr-2">
            <div className="text-xl font-black text-foreground tracking-widest uppercase flex items-center justify-end gap-2 drop-shadow-sm">
              <Calendar className="h-6 w-6 text-primary" /> {dateStr}
            </div>
            {hijriDateStr && (
              <div className="text-sm font-bold text-foreground/70 tracking-widest uppercase mt-1 drop-shadow-sm">
                {hijriDateStr}
              </div>
            )}
          </div>
          
          <div className="bg-card/30 backdrop-blur-3xl border-4 border-border/80 px-10 py-5 rounded-[2.5rem] shadow-2xl flex items-center gap-6 shadow-primary/10">
            <Clock className="h-12 w-12 text-primary animate-pulse" />
            <span className="text-7xl font-mono font-black tracking-tighter tabular-nums text-foreground drop-shadow-lg">
              {time}
            </span>
          </div>
        </div>
      </header>

      {/* DYNAMIC CONTENT CONTAINER */}
      <main className="relative z-10 flex-1 flex items-stretch min-h-0 w-full">
        
        {/* FULL WIDTH ACTIVE SLIDES SHOWCASE */}
        <div className="w-full flex flex-col items-stretch justify-center relative min-h-0 h-full">

          {/* Murottal Video Slide (Overrides all other slides when active) */}
          {isMurottalMode && settings?.murottal?.url ? (
            <div className="animate-fade-in flex flex-col justify-center items-center w-full h-full relative px-4">
               {/* Video akan diload ke dalam sini oleh YouTube API */}
               <div id="youtube-player-container" className="h-full max-h-[80vh] aspect-video mx-auto rounded-[3rem] overflow-hidden shadow-2xl border-4 border-border/20 bg-black relative">
               </div>
            </div>
          ) : (
            <>
          
          {/* Slide 1: Welcome/Dashboard */}
          {currentSlide.url === "welcome" && (
            <div className="animate-fade-in flex flex-col gap-6 w-full h-full justify-between">
              
              {/* Top Banner Row */}
              <div className="grid grid-cols-3 gap-6">
                <div className="col-span-2 bg-card/20 backdrop-blur-3xl rounded-[2rem] p-6 border-2 border-border/60 flex flex-col justify-between shadow-xl shadow-emerald-500/30 relative overflow-hidden">
                  
                  {/* Islamic Geometric Ornament Watermark */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/30 pointer-events-none"></div>
                  <svg className="absolute -bottom-16 -right-16 w-80 h-80 text-primary opacity-[0.15] pointer-events-none transform rotate-12" viewBox="0 0 100 100">
                    <path fill="currentColor" d="M50 0L62.5 37.5L100 50L62.5 62.5L50 100L37.5 62.5L0 50L37.5 37.5Z"/>
                    <path fill="currentColor" d="M14.6 14.6L50 29.3L85.4 14.6L70.7 50L85.4 85.4L50 70.7L14.6 85.4L29.3 50Z" opacity="0.7"/>
                    <circle cx="50" cy="50" r="15" fill="none" stroke="currentColor" strokeWidth="4"/>
                  </svg>

                  <div className="relative z-10">
                    <h3 className="text-primary text-2xl font-black flex items-center gap-3 mb-4 uppercase tracking-wider">
                      <Info className="h-7 w-7" /> Informasi Masjid
                    </h3>
                    <p className="text-foreground text-2xl font-semibold leading-snug font-serif italic py-2">
                      "Selamat datang di {settings.nama_aplikasi}. Mari jaga ketertiban, kebersihan, dan kekhusyukan jamaah selama berada di lingkungan masjid."
                    </p>
                  </div>
                  
                  <div className="relative z-10 text-foreground/70 font-bold text-base mt-2 border-t-2 border-border/50 pt-3 flex items-center gap-3">
                    <Clock className="h-6 w-6"/> Layar otomatis terupdate secara realtime.
                  </div>
                </div>

                <div className="bg-card/20 backdrop-blur-3xl rounded-[2rem] p-8 border-2 border-border/60 flex flex-col justify-between items-center text-center shadow-xl shadow-emerald-500/30">
                  <span className="text-foreground/80 text-xl font-black tracking-widest uppercase">Jumat Terdekat</span>
                  <div className="my-4">
                    <p className="text-primary text-4xl font-black">{upcomingJumat?.khatib || "Loading..."}</p>
                    <p className="text-lg text-foreground/70 font-bold mt-2 uppercase tracking-wide">Khatib & Imam</p>
                  </div>
                  <div className="bg-muted/80 px-6 py-3 rounded-2xl border-2 border-border text-lg text-foreground font-bold tabular-nums">
                    {upcomingJumat?.tanggal ? new Date(sholatJumat.tanggal).toLocaleDateString("id-ID", { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) : "Loading..."}
                  </div>
                </div>
              </div>

              {/* Bottom Row - Table of prayers + Announcements */}
              <div className="grid grid-cols-2 gap-6 flex-1 mt-4 min-h-0">
                
                {/* Mini Prayer List */}
                <div className="bg-card/20 backdrop-blur-3xl rounded-[2rem] p-6 border-2 border-border/60 shadow-xl shadow-emerald-500/30 flex flex-col h-full overflow-hidden">
                  <h3 className="text-primary text-xl font-black flex items-center gap-3 mb-3 border-b-2 border-border/50 pb-2 uppercase tracking-wider shrink-0">
                    <Clock className="h-6 w-6" /> Waktu Sholat
                  </h3>
                  <div className="flex flex-col gap-2">
                    {["Imsak", "Subuh", "Terbit", "Dzuhur", "Ashar", "Maghrib", "Isya"].map((name) => (
                      <div 
                        key={name} 
                        className={`flex items-center justify-between px-5 py-3 rounded-2xl transition-all border-2 ${
                          nextPrayer.name === name 
                            ? "bg-gradient-to-r from-primary to-primary/90 text-primary-foreground border-primary shadow-2xl shadow-primary/30 scale-[1.02]" 
                            : "bg-muted/40 border-transparent text-foreground"
                        }`}
                      >
                        <span className="text-xl font-bold tracking-wide uppercase">{name}</span>
                        <span className="text-3xl font-mono font-black tabular-nums tracking-tighter">
                          {jadwal[name]}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Announcements Box */}
                <div className="bg-card/20 backdrop-blur-3xl rounded-[2rem] p-6 border-2 border-border/60 shadow-xl shadow-emerald-500/30 flex flex-col h-full overflow-hidden">
                  <h3 className="text-primary text-xl font-black flex items-center gap-3 mb-3 border-b-2 border-border/50 pb-2 uppercase tracking-wider shrink-0">
                    <Volume2 className="h-6 w-6" /> Pengumuman Utama
                  </h3>
                  <div className="flex flex-col gap-3 overflow-hidden flex-1 justify-start">
                    {pengumuman && pengumuman.length > 0 ? (
                      pengumuman.slice(0, 3).map((item) => (
                        <div key={item.id} className="bg-muted/40 p-3 rounded-2xl border-l-[6px] border-primary flex items-start gap-4 shadow-sm">
                          <div className="bg-background border-2 border-border/80 h-12 w-12 flex items-center justify-center rounded-2xl text-primary shrink-0 text-base font-black font-mono shadow-sm mt-0.5">
                            {item.tanggal ? item.tanggal.substring(8,10) : <Megaphone className="h-5 w-5" />}
                          </div>
                          <p className="text-base text-foreground leading-snug font-semibold whitespace-pre-wrap">{item.isi}</p>
                        </div>
                      ))
                    ) : (
                      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                        <Quote className="h-12 w-12 text-primary/30 mb-4" />
                        <p className="text-xl text-foreground/80 font-serif italic leading-relaxed">
                          {FALLBACK_QUOTES[new Date().getDay() % FALLBACK_QUOTES.length]}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* Slide 2: Utama (Big Prayer Cards) */}
          {currentSlide.url === "utama" && (
            <div className="animate-fade-in flex flex-col gap-10 w-full h-full justify-center">
              <div className="text-center mb-6">
                <h2 className="text-5xl font-black text-foreground tracking-widest uppercase drop-shadow-md">Jadwal Sholat Hari Ini</h2>
                <div className="h-2 w-32 bg-primary mx-auto mt-6 rounded-full shadow-lg shadow-primary/30"></div>
              </div>
              
              <div className="grid grid-cols-7 gap-3">
                {["Imsak", "Subuh", "Terbit", "Dzuhur", "Ashar", "Maghrib", "Isya"].map((name) => {
                  const isActive = nextPrayer.name === name;
                  return (
                    <div 
                      key={name}
                      className={`flex flex-col items-center justify-between p-4 rounded-[1.5rem] border-2 transition-all flex-1 ${
                        isActive 
                          ? "bg-gradient-to-b from-primary to-primary/90 border-primary text-primary-foreground shadow-2xl shadow-primary/40 scale-105 z-10" 
                          : "bg-card/20 backdrop-blur-3xl border-border/60 text-foreground shadow-xl shadow-emerald-500/30"
                      }`}
                    >
                      <span className={`text-2xl font-black uppercase tracking-wider ${isActive ? "text-primary-foreground drop-shadow-md" : "text-foreground/70"}`}>
                        {name}
                      </span>
                      
                      <div className={`flex justify-center items-center ${isActive ? "opacity-30" : "opacity-10"}`}>
                        <MoonStar className="h-12 w-12" strokeWidth={1.5} />
                      </div>
                      
                      <div className="flex flex-col items-center gap-3 w-full">
                        <span className="text-4xl font-mono font-black tracking-tighter tabular-nums drop-shadow-md">
                          {jadwal[name]}
                        </span>
                        {isActive && (
                          <span className="text-lg tracking-widest uppercase font-black text-primary-foreground bg-white/20 border-2 border-white/30 px-6 py-2 rounded-full animate-pulse mt-2 shadow-lg">
                            Berikutnya
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Slide 3: Keuangan (Ledger Table) */}
          {currentSlide.url === "keuangan" && (
            <div className="animate-fade-in flex flex-col gap-8 w-full h-full justify-between max-w-7xl mx-auto">
              <div className="text-center mb-2">
                <h2 className="text-5xl font-black text-foreground tracking-widest uppercase drop-shadow-md">
                  {settings?.keuangan_tv_filter?.type === 'monthly' ? "Mutasi Keuangan Bulan Ini" : 
                   settings?.keuangan_tv_filter?.type === 'custom' ? "Mutasi Keuangan (Periode Pilihan)" : 
                   "Mutasi Keuangan Mingguan"}
                </h2>
                <p className="text-2xl text-foreground/70 font-bold mt-2 tracking-wide">
                  {settings?.keuangan_tv_filter?.type === 'monthly' ? "Laporan mutasi kas masuk dan kas keluar bulan ini" : 
                   settings?.keuangan_tv_filter?.type === 'custom' ? "Laporan mutasi kas masuk dan kas keluar untuk periode yang dipilih" : 
                   "Laporan mutasi kas masuk dan kas keluar dalam 7 hari terakhir"}
                </p>
              </div>

              <div className="bg-card/20 backdrop-blur-3xl border-2 border-border/60 rounded-[2rem] overflow-hidden flex-1 flex flex-col shadow-xl shadow-emerald-500/30">
                <table className="w-full text-left border-collapse flex flex-col h-full">
                  <thead className="bg-muted/80 border-b-2 border-border/60 text-foreground font-black uppercase tracking-widest text-xl">
                    <tr className="flex w-full">
                      <th className="p-6 w-[15%]">Tanggal</th>
                      <th className="p-6 w-[45%]">Keterangan</th>
                      <th className="p-6 w-[20%] text-right">Pemasukan</th>
                      <th className="p-6 w-[20%] text-right">Pengeluaran</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border text-2xl">
                    {keuanganFilteredTV.length === 0 ? (
                      <tr className="flex w-full flex-1 items-center justify-center min-h-[300px]">
                        <td className="text-center text-muted-foreground/70 text-3xl font-bold w-full italic">
                          Tidak ada transaksi pada periode ini.
                        </td>
                      </tr>
                    ) : (
                      keuanganFilteredTV.slice(keuanganPage * 4, (keuanganPage + 1) * 4).map((item, index) => (
                        <tr key={item.id} className={`flex w-full items-center transition-colors flex-1 animate-fade-in ${index % 2 === 1 ? 'bg-muted/30' : 'bg-transparent'}`}>
                          <td className="p-6 w-[15%] text-foreground/70 font-mono font-bold tabular-nums">{item.tanggal}</td>
                          <td className="p-6 w-[45%] font-bold text-foreground flex flex-col justify-center items-start gap-2 h-full">
                            <span className="text-xl line-clamp-1 leading-snug">{item.deskripsi}</span>
                            {item.kategori && (
                              <span className="text-sm font-black uppercase tracking-widest px-3 py-1 bg-secondary/30 text-secondary-foreground rounded-lg border border-secondary/50 inline-block mt-1">
                                {item.kategori}
                              </span>
                            )}
                          </td>
                          <td className="p-6 w-[20%] text-right text-primary font-black font-mono tabular-nums tracking-tight">
                            {item.pemasukan ? `Rp ${Number(item.pemasukan).toLocaleString("id-ID")}` : "-"}
                          </td>
                          <td className="p-8 w-[20%] text-right text-destructive font-black font-mono tabular-nums tracking-tight">
                            {item.pengeluaran ? `Rp ${Number(item.pengeluaran).toLocaleString("id-ID")}` : "-"}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Summary strip */}
              <div className="grid grid-cols-3 gap-6 relative mt-6">
                {/* Pagination Dots indicator */}
                {keuanganFilteredTV.length > 4 && (
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 flex items-center gap-2">
                     {Array.from({ length: Math.ceil(keuanganFilteredTV.length / 4) }).map((_, i) => (
                        <div key={i} className={`h-2 rounded-full transition-all duration-500 ${i === keuanganPage ? "w-8 bg-primary" : "w-2 bg-primary/20"}`} />
                     ))}
                  </div>
                )}
                
                <div className="bg-primary/10 border-2 border-primary/20 rounded-3xl px-8 py-6 flex flex-col items-start justify-center gap-2 shadow-lg">
                  <span className="text-lg text-primary font-black uppercase tracking-widest">
                    Pemasukan ({settings?.keuangan_tv_filter?.type === 'custom' ? 'Periode Ini' : settings?.keuangan_tv_filter?.type === 'monthly' ? 'Bulan Ini' : 'Minggu Ini'})
                  </span>
                  <span className="text-4xl font-black font-mono text-primary tabular-nums tracking-tighter">Rp {totalPemasukanTV.toLocaleString("id-ID")}</span>
                </div>
                <div className="bg-destructive/10 border-2 border-destructive/20 rounded-3xl px-8 py-6 flex flex-col items-start justify-center gap-2 shadow-lg">
                  <span className="text-lg text-destructive font-black uppercase tracking-widest">
                    Pengeluaran ({settings?.keuangan_tv_filter?.type === 'custom' ? 'Periode Ini' : settings?.keuangan_tv_filter?.type === 'monthly' ? 'Bulan Ini' : 'Minggu Ini'})
                  </span>
                  <span className="text-4xl font-black font-mono text-destructive tabular-nums tracking-tighter">Rp {totalPengeluaranTV.toLocaleString("id-ID")}</span>
                </div>
                <div className="bg-secondary/20 border-2 border-secondary/30 rounded-3xl px-8 py-6 flex flex-col items-start justify-center gap-2 shadow-lg">
                  <span className="text-lg text-foreground font-black uppercase tracking-widest">Saldo Kas Bersih Keseluruhan</span>
                  <span className="text-4xl font-black font-mono text-foreground tabular-nums tracking-tighter">Rp {saldo.toLocaleString("id-ID")}</span>
                </div>
              </div>
            </div>
          )}

          {/* Slide 4: Jumat (Jadwal Sholat Jumat) */}
          {currentSlide.url === "jumat" && (
            <div className="animate-fade-in flex flex-col justify-center items-center gap-8 w-full h-full max-w-6xl mx-auto">
              <div className="text-center">
                <h2 className="text-5xl font-black text-foreground tracking-widest uppercase drop-shadow-md">Petugas Sholat Jumat</h2>
                <div className="h-2 w-32 bg-primary mx-auto mt-6 rounded-full shadow-lg shadow-primary/30"></div>
              </div>

              <div className="bg-card/20 backdrop-blur-3xl border-2 border-border/60 p-10 rounded-[3rem] w-full flex flex-col gap-8 shadow-2xl shadow-emerald-500/30 relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-primary text-primary-foreground font-black px-8 py-3 rounded-tr-[3rem] rounded-bl-[2.5rem] text-2xl font-mono shadow-xl">
                  {upcomingJumat?.tanggal || "Segera Hadir"}
                </div>
                
                <div className="flex items-center gap-8 border-b-2 border-border/50 pb-6 mt-4">
                  <div className="p-6 rounded-[2rem] bg-primary/10 text-primary border-4 border-primary/20 shadow-inner">
                    <User className="h-16 w-16" />
                  </div>
                  <div>
                    <h3 className="text-5xl font-black text-foreground drop-shadow-sm">{upcomingJumat?.khatib || "-"}</h3>
                    <p className="text-foreground/70 font-black text-2xl tracking-widest uppercase mt-2">Khatib Sholat Jumat</p>
                  </div>
                </div>

                <div className="flex items-center gap-8 border-b-2 border-border/50 pb-6">
                  <div className="p-6 rounded-[2rem] bg-primary/10 text-primary border-4 border-primary/20 shadow-inner">
                    <User className="h-16 w-16" />
                  </div>
                  <div>
                    <h3 className="text-5xl font-black text-foreground drop-shadow-sm">{upcomingJumat?.imam || "-"}</h3>
                    <p className="text-foreground/70 font-black text-2xl tracking-widest uppercase mt-2">Imam Sholat Jumat</p>
                  </div>
                </div>

                <div className="flex items-center gap-8">
                  <div className="p-6 rounded-[2rem] bg-primary/10 text-primary border-4 border-primary/20 shadow-inner">
                    <Volume2 className="h-16 w-16" />
                  </div>
                  <div>
                    <h3 className="text-5xl font-black text-foreground drop-shadow-sm">{upcomingJumat?.muadzin || "-"}</h3>
                    <p className="text-foreground/70 font-black text-2xl tracking-widest uppercase mt-2">Muadzin / Bilal</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Slide 5: Pengumuman (Tabel Full) */}
          {currentSlide.url === "pengumuman" && (
            <div className="animate-fade-in flex flex-col gap-8 w-full h-full justify-center max-w-6xl mx-auto">
              <div className="text-center">
                <h2 className="text-5xl font-black text-foreground tracking-widest uppercase drop-shadow-md">Agenda & Pengumuman</h2>
                <div className="h-2 w-32 bg-primary mx-auto mt-6 rounded-full shadow-lg shadow-primary/30"></div>
              </div>

              <div className="flex flex-col gap-6 w-full mt-4">
                {(pengumuman || []).slice(pengumumanPage * 2, (pengumumanPage + 1) * 2).map((item, index) => (
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
                      <p className={`text-foreground/90 font-medium leading-relaxed ${item.judul ? 'text-2xl' : 'text-3xl'} whitespace-pre-wrap`}>
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
              
              {/* Pagination Dots */}
              {pengumuman && pengumuman.length > 2 && (
                <div className="flex justify-center gap-2 mt-4">
                  {Array.from({ length: Math.ceil(pengumuman.length / 2) }).map((_, i) => (
                    <div key={i} className={`h-2 rounded-full transition-all duration-500 ${i === pengumumanPage ? "w-8 bg-primary" : "w-2 bg-primary/30"}`} />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Slide 6: Keuangan-Summary (Card Big Numbers) */}
          {currentSlide.url === "keuangan-summary" && (
            <div className="animate-fade-in flex flex-col justify-center items-center gap-8 w-full h-full max-w-6xl mx-auto">
              <div className="text-center">
                <h2 className="text-5xl font-black text-foreground tracking-widest uppercase drop-shadow-md">Rekapitulasi Keuangan</h2>
                <div className="h-2 w-32 bg-primary mx-auto mt-6 rounded-full shadow-lg shadow-primary/30"></div>
              </div>

              <div className="grid grid-cols-3 gap-8 w-full mt-8">
                
                {/* Pemasukan */}
                <div className="bg-card/20 backdrop-blur-3xl border-2 border-border/60 rounded-[3rem] p-8 flex flex-col items-center text-center shadow-xl shadow-emerald-500/30 min-h-[300px]">
                  <div className="p-4 bg-primary/10 border-4 border-primary/20 rounded-full text-primary shadow-inner mb-4">
                    <TrendingUp className="h-10 w-10" />
                  </div>
                  <div className="w-full">
                    <p className="text-foreground/70 font-black uppercase tracking-widest text-base">Total Pemasukan</p>
                    <p className="text-4xl font-mono font-black text-primary mt-1 tracking-tighter tabular-nums drop-shadow-sm pb-4 border-b border-border/50">
                      Rp {totalPemasukan.toLocaleString("id-ID")}
                    </p>
                    <div className="mt-4 flex flex-col gap-3 w-full">
                      {sortedPemasukanKeys.map(cat => {
                        const amount = breakdownPemasukan[cat];
                        const pct = totalPemasukan > 0 ? (amount / totalPemasukan) * 100 : 0;
                        return (
                          <div key={cat} className="flex flex-col gap-1 w-full text-left">
                            <div className="flex justify-between text-xs font-bold text-foreground/80">
                              <span className="truncate pr-2">{cat}</span>
                              <span className="shrink-0 font-mono text-primary">Rp {amount.toLocaleString("id-ID")}</span>
                            </div>
                            <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                              <div className="bg-primary h-full rounded-full" style={{ width: `${pct}%` }}></div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Pengeluaran */}
                <div className="bg-card/20 backdrop-blur-3xl border-2 border-border/60 rounded-[3rem] p-8 flex flex-col items-center text-center shadow-xl shadow-emerald-500/30 min-h-[300px]">
                  <div className="p-4 bg-destructive/10 border-4 border-destructive/20 rounded-full text-destructive shadow-inner mb-4">
                    <TrendingDown className="h-10 w-10" />
                  </div>
                  <div className="w-full">
                    <p className="text-foreground/70 font-black uppercase tracking-widest text-base">Total Pengeluaran</p>
                    <p className="text-4xl font-mono font-black text-destructive mt-1 tracking-tighter tabular-nums drop-shadow-sm pb-4 border-b border-border/50">
                      Rp {totalPengeluaran.toLocaleString("id-ID")}
                    </p>
                    <div className="mt-4 flex flex-col gap-3 w-full">
                      {sortedPengeluaranKeys.map(cat => {
                        const amount = breakdownPengeluaran[cat];
                        const pct = totalPengeluaran > 0 ? (amount / totalPengeluaran) * 100 : 0;
                        return (
                          <div key={cat} className="flex flex-col gap-1 w-full text-left">
                            <div className="flex justify-between text-xs font-bold text-foreground/80">
                              <span className="truncate pr-2">{cat}</span>
                              <span className="shrink-0 font-mono text-destructive">Rp {amount.toLocaleString("id-ID")}</span>
                            </div>
                            <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                              <div className="bg-destructive h-full rounded-full" style={{ width: `${pct}%` }}></div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Saldo Akhir */}
                <div className="bg-card/20 backdrop-blur-3xl border-2 border-border/60 rounded-[3rem] p-8 flex flex-col justify-between items-center text-center shadow-xl shadow-emerald-500/30 min-h-[300px]">
                  <div className="p-6 bg-secondary/10 border-4 border-secondary/20 rounded-full text-foreground shadow-inner">
                    <Wallet className="h-16 w-16" />
                  </div>
                  <div className="mt-4">
                    <p className="text-foreground/70 font-black uppercase tracking-widest text-lg">Saldo Bersih (Kas)</p>
                    <p className="text-3xl font-mono font-black text-foreground mt-2 tracking-tighter tabular-nums drop-shadow-sm">
                      Rp {saldo.toLocaleString("id-ID")}
                    </p>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* Slide 7: QRIS Donasi Cashless */}
          {currentSlide.url === "qris" && (
            <div className="animate-fade-in flex flex-col justify-center items-center gap-8 w-full h-full max-w-6xl mx-auto">
              <div className="text-center">
                <h2 className="text-5xl font-black text-foreground tracking-widest uppercase drop-shadow-md">QRIS Donasi Digital</h2>
                <p className="text-2xl text-foreground/70 font-bold mt-2">Salurkan infak terbaik Anda secara cashless melalui e-wallet / m-banking</p>
              </div>

              <div className="bg-card/20 backdrop-blur-3xl border-2 border-border/60 p-10 rounded-[3rem] w-full grid grid-cols-2 gap-10 items-center shadow-2xl shadow-emerald-500/30 mt-4">
                
                {/* QR Code Column (50%) */}
                <div className="flex flex-col items-center justify-center bg-white p-8 rounded-[2.5rem] border-4 border-border shadow-inner w-full">
                  <Image 
                    src={qris?.gambar || "/qris_example.png"} 
                    alt="QRIS Donasi" 
                    width={400}
                    height={400}
                    priority
                    className="rounded-2xl object-contain mix-blend-multiply w-[350px] h-[350px]"
                  />
                  <span className="text-2xl uppercase font-black text-slate-800 tracking-widest mt-6">
                    QRIS GPN INDONESIA
                  </span>
                </div>

                {/* Bank / Rekening Info Column */}
                <div className="flex flex-col gap-6">
                  <div className="bg-muted/60 p-8 rounded-[2rem] border-2 border-border">
                    <span className="text-xl text-foreground/70 block font-black uppercase tracking-widest">Nama Merchant</span>
                    <span className="text-4xl font-black text-foreground mt-2 block">{qris?.atas_nama || "DKM DA'WATUL ISLAM"}</span>
                  </div>

                  <div className="bg-muted/60 p-8 rounded-[2rem] border-2 border-border">
                    <span className="text-xl text-foreground/70 block font-black uppercase tracking-widest">Rekening Transfer</span>
                    <span className="text-5xl font-mono font-black text-primary mt-2 block tracking-tight">{qris?.nomor_rekening || "-"}</span>
                    <span className="text-2xl text-foreground font-bold uppercase tracking-widest block mt-3">{qris?.bank || "-"}</span>
                  </div>

                  <p className="text-xl text-foreground/60 leading-relaxed italic font-bold">
                    * {qris?.keterangan || "Gunakan GoPay, OVO, Dana, LinkAja, atau Mobile Banking untuk memindai."}
                  </p>
                </div>

              </div>
            </div>
          )}

          {/* Slide 8: Idul Fitri */}
          {currentSlide.url === "idul-fitri" && idulFitri && (
            <div className="animate-fade-in flex flex-col justify-center items-center gap-10 w-full h-full">
              <div className="text-center">
                <span className="text-xl font-black tracking-widest text-primary bg-primary/10 border-2 border-primary/20 px-8 py-3 rounded-full uppercase shadow-inner">
                  Informasi Hari Raya
                </span>
                <h2 className="text-6xl font-black text-foreground tracking-widest uppercase mt-8 drop-shadow-md">Sholat Idul Fitri {idulFitri.tahun}</h2>
                <div className="h-2 w-32 bg-primary mx-auto mt-6 rounded-full shadow-lg shadow-primary/30"></div>
              </div>

              <div className="bg-card/20 backdrop-blur-3xl border-2 border-border/60 p-14 rounded-[3rem] w-full max-w-5xl grid grid-cols-2 gap-12 shadow-xl shadow-emerald-500/30 relative mt-6 overflow-hidden">
                <div className="absolute top-0 right-0 bg-primary text-primary-foreground font-black px-8 py-3 rounded-tr-[3rem] rounded-bl-[2.5rem] text-xl font-mono shadow-xl">
                  {idulFitri.keterangan || "1 Syawal"}
                </div>
                
                <div className="flex flex-col gap-10 justify-center mt-6">
                  <div className="flex items-center gap-6">
                    <div className="p-5 bg-muted rounded-2xl text-primary border-2 border-border/50"><CalendarDays className="h-10 w-10" /></div>
                    <div>
                      <p className="text-foreground/70 text-lg font-black uppercase tracking-widest">Tanggal Pelaksanaan</p>
                      <p className="text-3xl font-black text-foreground mt-1">{idulFitri.tanggal}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="p-5 bg-muted rounded-2xl text-primary border-2 border-border/50"><Clock className="h-10 w-10" /></div>
                    <div>
                      <p className="text-foreground/70 text-lg font-black uppercase tracking-widest">Waktu Mulai</p>
                      <p className="text-3xl font-black font-mono text-foreground mt-1">{idulFitri.waktu} WITA</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-10 mt-6">
                  <div className="bg-muted/40 p-6 rounded-3xl border-2 border-border">
                    <p className="text-foreground/70 text-lg font-black uppercase tracking-widest">Imam Sholat</p>
                    <p className="text-4xl font-black text-foreground mt-2">{idulFitri.imam}</p>
                  </div>
                  <div className="bg-muted/40 p-6 rounded-3xl border-2 border-border">
                    <p className="text-foreground/70 text-lg font-black uppercase tracking-widest">Khatib Sholat</p>
                    <p className="text-4xl font-black text-foreground mt-2">{idulFitri.khatib}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Slide 9: Idul Adha */}
          {currentSlide.url === "idul-adha" && idulAdha && (
            <div className="animate-fade-in flex flex-col justify-center items-center gap-10 w-full h-full">
              <div className="text-center">
                <span className="text-xl font-black tracking-widest text-primary bg-primary/10 border-2 border-primary/20 px-8 py-3 rounded-full uppercase shadow-inner">
                  Informasi Hari Raya
                </span>
                <h2 className="text-6xl font-black text-foreground tracking-widest uppercase mt-8 drop-shadow-md">Sholat Idul Adha {idulAdha.tahun}</h2>
                <div className="h-2 w-32 bg-primary mx-auto mt-6 rounded-full shadow-lg shadow-primary/30"></div>
              </div>

              <div className="bg-card/20 backdrop-blur-3xl border-2 border-border/60 p-14 rounded-[3rem] w-full max-w-5xl grid grid-cols-2 gap-12 shadow-xl shadow-emerald-500/30 relative mt-6 overflow-hidden">
                <div className="absolute top-0 right-0 bg-primary text-primary-foreground font-black px-8 py-3 rounded-tr-[3rem] rounded-bl-[2.5rem] text-xl font-mono shadow-xl">
                  {idulAdha.keterangan || "10 Dzulhijjah"}
                </div>
                
                <div className="flex flex-col gap-10 justify-center mt-6">
                  <div className="flex items-center gap-6">
                    <div className="p-5 bg-muted rounded-2xl text-primary border-2 border-border/50"><CalendarDays className="h-10 w-10" /></div>
                    <div>
                      <p className="text-foreground/70 text-lg font-black uppercase tracking-widest">Tanggal Pelaksanaan</p>
                      <p className="text-3xl font-black text-foreground mt-1">{idulAdha.tanggal}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="p-5 bg-muted rounded-2xl text-primary border-2 border-border/50"><Clock className="h-10 w-10" /></div>
                    <div>
                      <p className="text-foreground/70 text-lg font-black uppercase tracking-widest">Waktu Mulai</p>
                      <p className="text-3xl font-black font-mono text-foreground mt-1">{idulAdha.waktu} WITA</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-10 mt-6">
                  <div className="bg-muted/40 p-6 rounded-3xl border-2 border-border">
                    <p className="text-foreground/70 text-lg font-black uppercase tracking-widest">Imam Sholat</p>
                    <p className="text-4xl font-black text-foreground mt-2">{idulAdha.imam}</p>
                  </div>
                  <div className="bg-muted/40 p-6 rounded-3xl border-2 border-border">
                    <p className="text-foreground/70 text-lg font-black uppercase tracking-widest">Khatib Sholat</p>
                    <p className="text-4xl font-black text-foreground mt-2">{idulAdha.khatib}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Slide 10: Hitung Mundur Hari Besar Islam */}
          {currentSlide.url === "hitung-mundur" && (
            <div className="animate-fade-in flex flex-col justify-center items-center gap-10 w-full h-full">
              <div className="text-center">
                <span className="text-xl font-black tracking-widest text-primary bg-primary/10 border-2 border-primary/20 px-8 py-3 rounded-full uppercase shadow-inner">
                  Menuju Hari Besar Islam
                </span>
                <h2 className="text-6xl font-black text-foreground tracking-widest uppercase mt-8 drop-shadow-md">
                  Hitung Mundur
                </h2>
                <div className="h-2 w-32 bg-primary mx-auto mt-6 rounded-full shadow-lg shadow-primary/30"></div>
              </div>

              <div className="flex justify-center gap-8 flex-wrap mt-8">
                 {/* IDUL FITRI COUNTDOWN */}
                 {(() => {
                   if (!idulFitri?.tanggal) return null;
                   const diff = new Date(idulFitri.tanggal).getTime() - new Date().getTime();
                   if (diff < 0) return null;
                   const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
                   return (
                     <div className="bg-card/20 backdrop-blur-3xl border-2 border-border/60 p-8 rounded-[2rem] w-80 text-center shadow-xl shadow-primary/10 relative overflow-hidden">
                       <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-bl-[4rem] -z-10"></div>
                       <h3 className="text-3xl font-black text-foreground mb-2 drop-shadow-sm">Idul Fitri</h3>
                       <p className="text-foreground/70 font-medium mb-6">{idulFitri.tanggal}</p>
                       <div className="text-7xl font-mono font-black text-primary drop-shadow-lg">{days}</div>
                       <p className="text-xl font-bold text-foreground/80 mt-2 uppercase tracking-widest">Hari Lagi</p>
                     </div>
                   )
                 })()}

                 {/* IDUL ADHA COUNTDOWN */}
                 {(() => {
                   if (!idulAdha?.tanggal) return null;
                   const diff = new Date(idulAdha.tanggal).getTime() - new Date().getTime();
                   if (diff < 0) return null;
                   const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
                   return (
                     <div className="bg-card/20 backdrop-blur-3xl border-2 border-border/60 p-8 rounded-[2rem] w-80 text-center shadow-xl shadow-primary/10 relative overflow-hidden">
                       <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-bl-[4rem] -z-10"></div>
                       <h3 className="text-3xl font-black text-foreground mb-2 drop-shadow-sm">Idul Adha</h3>
                       <p className="text-foreground/70 font-medium mb-6">{idulAdha.tanggal}</p>
                       <div className="text-7xl font-mono font-black text-primary drop-shadow-lg">{days}</div>
                       <p className="text-xl font-bold text-foreground/80 mt-2 uppercase tracking-widest">Hari Lagi</p>
                     </div>
                   )
                 })()}
              </div>
            </div>
          )}

          {/* Slide: Poster Campaign */}
          {currentSlide.isPoster && (
            <div className="animate-fade-in flex flex-col justify-center items-center w-full h-full relative px-4 min-h-0 py-2">
              <img 
                src={convertGDriveLink(currentSlide.imageUrl)} 
                alt={currentSlide.name} 
                className="max-w-full max-h-full w-auto h-auto object-contain rounded-[2rem] shadow-2xl border-4 border-border/20 drop-shadow-xl"
              />
            </div>
          )}

            </>
          )}

        </div>
      </main>

      {/* FOOTER SECTION: RUNNING TEXT MARQUEE */}
      <footer className="relative z-10 mt-6 border-t-4 border-primary/20 bg-primary/5 backdrop-blur-3xl flex items-stretch h-20 shadow-2xl shrink-0 -mx-6 -mb-6">
        
        {/* Banner label */}
        <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground font-black px-10 flex items-center justify-center gap-4 shrink-0 text-2xl tracking-widest uppercase shadow-xl z-20">
          <Volume2 className="h-10 w-10 animate-pulse" /> INFO MASJID
        </div>
        
        {/* Scrolling text zone */}
        <div className="flex-1 flex items-center overflow-hidden relative">
          <div className="absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-background to-transparent z-10"></div>
          <div className="absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-background to-transparent z-10"></div>
          <div className="animate-marquee text-foreground font-black text-3xl tracking-wide flex items-center gap-16 whitespace-nowrap drop-shadow-sm" style={{ animationDuration: `${settings?.running_text_speed || 45}s` }}>
            <span>{settings.running_text}</span>
            <span className="text-primary font-serif italic text-4xl opacity-70">✦ {settings.nama_aplikasi} ✦</span>
            <span>{settings.running_text}</span>
          </div>
        </div>

      </footer>

      {/* DEMO SIMULATION CONTROLS */}
      {masjidId === 'demo-masjid' && (
        <div className="absolute bottom-24 right-8 z-[200] bg-background/90 backdrop-blur-md border-2 border-primary/50 p-4 rounded-2xl shadow-2xl flex flex-col gap-3 opacity-20 hover:opacity-100 transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 group pointer-events-auto">
          <p className="text-[11px] font-black text-primary uppercase text-center tracking-widest flex items-center justify-center gap-2">
            <Settings className="w-3.5 h-3.5 animate-spin-slow" />
            Tes Animasi TV
          </p>
          <div className="flex gap-2">
            <button className="text-[11px] font-bold bg-primary/10 text-primary border border-primary/30 px-3 py-2 rounded-xl hover:bg-primary hover:text-primary-foreground active:scale-95 transition-all w-24 text-center leading-tight" onClick={() => handleSimulate('menjelang')}>-10 Detik<br/>Adzan</button>
            <button className="text-[11px] font-bold bg-primary/10 text-primary border border-primary/30 px-3 py-2 rounded-xl hover:bg-primary hover:text-primary-foreground active:scale-95 transition-all w-24 text-center leading-tight" onClick={() => handleSimulate('iqamah')}>Hitung Mundur<br/>Iqamah</button>
            <button className="text-[11px] font-bold bg-destructive/10 text-destructive border border-destructive/30 px-3 py-2 rounded-xl hover:bg-destructive hover:text-destructive-foreground active:scale-95 transition-all w-24 text-center leading-tight" onClick={() => setTimeOffset(0)}>Kembalikan<br/>Normal</button>
          </div>
        </div>
      )}

    </div>
    </div>
  );
}
