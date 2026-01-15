/* =========================
   DATA JADWAL
========================= */
const schedule = [
  { startTime: '07:00', endTime: '08:00', title: 'Senam Pagi', location: 'Lapangan Utama' },
  { startTime: '08:30', endTime: '10:00', title: 'Rapat Koordinasi', location: 'Ruang Meeting Utama' },
  { startTime: '10:15', endTime: '12:00', title: 'Workshop Digitalisasi', location: 'Ruang Workshop' },
  { startTime: '12:00', endTime: '13:00', title: 'Makan Siang', location: 'Kantin' },
  { startTime: '13:00', endTime: '14:30', title: 'Rapat Evaluasi Proyek', location: 'Ruang Rapat 2' },
  { startTime: '14:45', endTime: '16:00', title: 'Diskusi Teknologi Baru', location: 'Ruang Seminar' },
  { startTime: '16:00', endTime: '17:30', title: 'Workshop Manajemen Proyek', location: 'Ruang Workshop' },
  { startTime: '17:45', endTime: '19:00', title: 'Sosialisasi Program Baru', location: 'Ruang Serba Guna' },
  { startTime: '19:30', endTime: '21:00', title: 'Rapat Akhir Hari', location: 'Ruang Meeting Utama' },
  { startTime: '21:00', endTime: '22:00', title: 'Makan Malam', location: 'Kantin' },
  { startTime: '22:15', endTime: '23:00', title: 'Tutup', location: '—' }
];

let currentIndex = -1;

/* =========================
   UTIL: Cari Event Aktif
========================= */
function getCurrentEventIndex(currentTime) {
  return schedule.findIndex(
    event => event.startTime <= currentTime && currentTime <= event.endTime
  );
}

/* =========================
   TANGGAL & WAKTU
========================= */
function updateDateTime() {
  const dateEl = document.getElementById("date");
  const timeEl = document.getElementById("current-time");

  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  const currentTime = `${hours}:${minutes}`;

  // Tanggal
  dateEl.innerText = now.toLocaleDateString("id-ID", {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Jam
  timeEl.innerText = `${hours}:${minutes}:${seconds}`;

  // Cari event aktif
  const activeIndex = getCurrentEventIndex(currentTime);

  if (activeIndex !== -1) {
    currentIndex = activeIndex;
    updateScheduleDisplay();
  } else {
    showNoEvent();
  }

  updateSidebar(currentTime);
}

/* =========================
   TAMPILAN EVENT UTAMA
========================= */
function updateScheduleDisplay() {
  const event = schedule[currentIndex];

  document.getElementById("status").innerText = "🔴 SEDANG BERLANGSUNG";
  document.getElementById("title").innerText = event.title;

  document.getElementById("time").innerHTML = `
    <span>🕘 ${event.startTime} – ${event.endTime} WIB</span>
    <span>📍 ${event.location}</span>
  `;

  // Event selanjutnya
  /* const nextEvent = schedule[currentIndex + 1];
  document.getElementById("next").innerText = nextEvent
    ? `⏭ Selanjutnya: ${nextEvent.startTime} – ${nextEvent.title}`
    : ''; */
}

/* =========================
   FALLBACK: TIDAK ADA KEGIATAN
========================= */
function showNoEvent() {
  document.getElementById("status").innerText = "⚪ TIDAK ADA KEGIATAN";
  document.getElementById("title").innerText = "Menunggu Jadwal Berikutnya";
  document.getElementById("time").innerHTML = "";
  document.getElementById("next").innerHTML = "";
}

/* =========================
   SIDEBAR JADWAL
========================= */
function updateSidebar(currentTime) {
  const sidebar = document.querySelector('.sidebar');
  sidebar.innerHTML = '<h3>Jadwal Hari Ini</h3>';

  schedule
    .filter(event => event.endTime >= currentTime)
    .forEach(event => {
      const item = document.createElement('div');
      item.className = 'schedule-item';

      if (event.startTime <= currentTime && currentTime <= event.endTime) {
        item.classList.add('active');
      }

      item.innerHTML = `
        <div class="schedule-time">${event.startTime} – ${event.endTime}</div>
        <div class="schedule-title">${event.title}</div>
      `;

      sidebar.appendChild(item);
    });
}

/* =========================
   CUACA (FA 5 FRIENDLY)
========================= */
function getWeather() {
  const url = "https://api.open-meteo.com/v1/forecast?latitude=-6.47&longitude=108.20&current_weather=true";

  fetch(url)
    .then(res => res.json())
    .then(data => {
      const temp = data.current_weather.temperature;
      const code = data.current_weather.weathercode;

      document.getElementById("weather-info").innerText = `${temp}°C`;
      document.getElementById("weather-icon").className = `fas ${getWeatherIcon(code)}`;
    })
    .catch(() => {
      document.getElementById("weather-info").innerText = "Cuaca tidak tersedia";
    });
}

function getWeatherIcon(code) {
  const icons = {
    0: "fa-sun",
    1: "fa-cloud-sun",
    2: "fa-cloud",
    3: "fa-cloud-rain",
    45: "fa-smog",
    48: "fa-smog",
    51: "fa-cloud-rain",
    61: "fa-cloud-showers-heavy",
    71: "fa-snowflake",
    95: "fa-bolt"
  };
  return icons[code] || "fa-cloud";
}

/* =========================
   INIT
========================= */
getWeather();
updateDateTime();

setInterval(updateDateTime, 1000);
setInterval(getWeather, 10 * 60 * 1000);
