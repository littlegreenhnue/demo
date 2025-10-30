// ======== 1. Khởi tạo bản đồ ========
var map = L.map('map').setView([21.0278, 105.8342], 13); // Hà Nội

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: 'Dữ liệu bản đồ © OpenStreetMap'
}).addTo(map);


// ======== 2. Danh sách nhà chờ ban đầu ========
let busStops = [
  { name: "Nhà chờ A - Cầu Giấy", lat: 21.036, lon: 105.800, note: "☀️ Pin mặt trời hoạt động tốt" },
  { name: "Nhà chờ B - Kim Mã", lat: 21.032, lon: 105.815, note: "💨 Có gió mạnh – đang sạc" }
];


// ======== 3. Hàm hiển thị tất cả các nhà chờ ========
function showBusStops() {
  map.eachLayer((layer) => {
    if (layer instanceof L.Marker && !layer._isUserMarker) {
      map.removeLayer(layer);
    }
  });

  busStops.forEach(stop => {
    const marker = L.marker([stop.lat, stop.lon]).addTo(map);
    marker.bindPopup(`<b>${stop.name}</b><br>${stop.note}`);
  });
}


// ======== 4. Tải dữ liệu đã lưu (nếu có) ========
window.onload = function () {
  const saved = localStorage.getItem("busStops");
  if (saved) {
    busStops = JSON.parse(saved);
  }
  showBusStops();
};


// ======== 5. Xử lý nút thêm nhà chờ mới ========
document.getElementById("addBtn").addEventListener("click", () => {
  const name = document.getElementById("nameInput").value.trim();
  const lat = parseFloat(document.getElementById("latInput").value);
  const lon = parseFloat(document.getElementById("lonInput").value);

  // Kiểm tra dữ liệu nhập
  if (!name || isNaN(lat) || isNaN(lon)) {
    alert("⚠️ Vui lòng nhập đủ Tên, Vĩ độ và Kinh độ (số)!");
    return;
  }

  // Tạo nhà chờ mới
  const newStop = {
    name: name,
    lat: lat,
    lon: lon,
    note: "🆕 Nhà chờ mới được thêm thủ công"
  };

  busStops.push(newStop);

  // Hiển thị ngay trên bản đồ
  const marker = L.marker([lat, lon]).addTo(map);
  marker.bindPopup(`<b>${name}</b><br>${newStop.note}`).openPopup();

  // Lưu dữ liệu vào Local Storage (giữ lại sau khi tải lại trang)
  localStorage.setItem("busStops", JSON.stringify(busStops));

  // Xóa nội dung trong ô nhập
  document.getElementById("nameInput").value = "";
  document.getElementById("latInput").value = "";
  document.getElementById("lonInput").value = "";
});


// ======== 6. Hiển thị vị trí người dùng ========
map.locate({ setView: true, maxZoom: 15 });

map.on('locationfound', (e) => {
  const userMarker = L.marker(e.latlng).addTo(map);
  userMarker._isUserMarker = true; // đánh dấu để không bị xóa khi reload marker
  userMarker.bindPopup("📍 Bạn đang ở đây!").openPopup();
});

map.on('locationerror', () => {
  alert("⚠️ Không thể xác định vị trí của bạn. Hãy bật định vị trên trình duyệt!");
});
