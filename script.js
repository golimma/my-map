// 네이버 Geocoding API 키
const NCP_CLIENT_ID = "8iovj40edt";     // ← 여기 입력
const NCP_CLIENT_SECRET = "BOn9tbawnb4lyuqum0QXAC3W8Xcjks8soUbrTsAk"; // ← 여기 입력

// Leaflet 지도 초기화
let map = L.map('map').setView([37.5665, 126.9780], 7);

// OpenStreetMap 타일 사용
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; OpenStreetMap Contributors'
}).addTo(map);

let markers = [];
let selectedMarkers = [];
let polyline = null;

// 네이버 지오코딩 API 호출
async function geocodeAddress(address) {
  const url = `https://naveropenapi.apigw.ntruss.com/map-geocode/v2/geocode?query=${encodeURIComponent(address)}`;

  const res = await fetch(url, {
    headers: {
      "X-NCP-APIGW-API-KEY-ID": NCP_CLIENT_ID,
      "X-NCP-APIGW-API-KEY": NCP_CLIENT_SECRET
    }
  });

  const data = await res.json();
  if (data.addresses.length === 0) {
    console.log("주소 변환 실패:", address);
    return null;
  }

  return {
    lat: parseFloat(data.addresses[0].y),
    lng: parseFloat(data.addresses[0].x)
  };
}

// 마커 생성
function addMarker(lat, lng, title) {
  const marker = L.marker([lat, lng])
    .addTo(map)
    .bindPopup(title);

  marker.on("click", () => handleMarkerClick(marker));

  markers.push(marker);
}

// 마커 클릭 2개 선택 → 경로 표시
function handleMarkerClick(marker) {
  selectedMarkers.push(marker);

  if (selectedMarkers.length === 2) {
    drawRoute(selectedMarkers[0], selectedMarkers[1]);
    selectedMarkers = [];
  }
}

// 두 지점 사이 선 그리기
function drawRoute(m1, m2) {
  const latlngs = [
    m1.getLatLng(),
    m2.getLatLng()
  ];

  if (polyline) {
    map.removeLayer(polyline);
  }

  polyline = L.polyline(latlngs, { color: "red", weight: 4 }).addTo(map);

  map.fitBounds(polyline.getBounds());
}

// 여러 주소 처리
async function processAddresses() {
  const text = document.getElementById("addrInput").value.trim();
  if (!text) {
    alert("주소를 입력하세요.");
    return;
  }

  const lines = text.split("\n");

  for (let addr of lines) {
    const point = await geocodeAddress(addr);
    if (point) {
      addMarker(point.lat, point.lng, addr);
    }
  }
}
