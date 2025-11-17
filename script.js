// ------------------------------
// 지도 초기화
// ------------------------------
let map = new naver.maps.Map('map', {
  center: new naver.maps.LatLng(37.5665, 126.9780), // 서울시청 기준
  zoom: 7
});

// 마커 저장
let markers = [];

// 마커 1→2 클릭하면 경로 표시 용
let selectedMarkers = [];

// 기존 그려진 경로
let polyline = null;


// ------------------------------
// 주소 → 좌표 변환 (Geocoding API)
// ------------------------------
async function geocodeAddress(address) {
  const url = `https://naveropenapi.apigw.ntruss.com/map-geocode/v2/geocode?query=${encodeURIComponent(address)}`;
  
  const res = await fetch(url, {
    headers: {
      "X-NCP-APIGW-API-KEY-ID": "8iovj40edt",        // ← 여기에 입력
      "X-NCP-APIGW-API-KEY": "BOn9tbawnb4lyuqum0QXAC3W8Xcjks8soUbrTsAk"        // ← 여기에 입력
    }
  });

  const data = await res.json();

  if (data.addresses.length === 0) {
    console.warn("주소 변환 실패:", address);
    return null;
  }

  return {
    lat: parseFloat(data.addresses[0].y),
    lng: parseFloat(data.addresses[0].x)
  };
}


// ------------------------------
// 마커 추가 + 클릭 시 경로용 선택
// ------------------------------
function addMarker(lat, lng, title) {
  const marker = new naver.maps.Marker({
    position: new naver.maps.LatLng(lat, lng),
    map: map,
    title: title
  });

  // 마커 클릭 이벤트
  marker.addListener("click", () => handleMarkerClick(marker));

  markers.push(marker);
}


// ------------------------------
// 마커 클릭 1 → 2 → 경로 표시
// ------------------------------
function handleMarkerClick(marker) {
  selectedMarkers.push(marker);

  // 마커 2개 선택 시 경로 표시
  if (selectedMarkers.length === 2) {
    drawRoute(selectedMarkers[0], selectedMarkers[1]);
    selectedMarkers = []; // 다시 초기화
  }
}


// ------------------------------
// 두 마커 사이 경로(선) 표시
// ------------------------------
function drawRoute(m1, m2) {
  const path = [
    m1.getPosition(),
    m2.getPosition()
  ];

  // 기존 경로 있으면 제거
  if (polyline) polyline.setMap(null);

  polyline = new naver.maps.Polyline({
    map,
    path,
    strokeColor: "#ff0000",
    strokeWeight: 4
  });

  // 두 점이 화면에 모두 보이도록
  const bounds = new naver.maps.LatLngBounds(
    m1.getPosition(), 
    m2.getPosition()
  );
  map.fitBounds(bounds);
}


// ------------------------------
// 입력된 여러 주소 처리
// ------------------------------
async function processAddresses() {
  const text = document.getElementById("addrInput").value.trim();
  if (!text) return alert("주소를 입력하세요.");

  const lines = text.split("\n");

  for (let addr of lines) {
    const point = await geocodeAddress(addr);

    if (point) {
      addMarker(point.lat, point.lng, addr);
    }
  }
}
