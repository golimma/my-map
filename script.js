#map {
  width: 100%;
  height: 80vh;
}
// 지도 초기화
let map = new naver.maps.Map('map', {
  center: new naver.maps.LatLng(37.5665, 126.9780), // 서울시청 기본 위치
  zoom: 7
});

// 마커 저장하는 배열
let markers = [];

// 마커 두 개 선택하는 배열
let selectedMarkers = [];

// 그려진 경로(Polyline)
let polyline = null;
function addMarker(lat, lng, title) {
  const marker = new naver.maps.Marker({
    position: new naver.maps.LatLng(lat, lng),
    map: map,
    title: title,
  });

  marker.addListener("click", () => handleMarkerClick(marker));

  markers.push(marker);
}

function handleMarkerClick(marker) {
  selectedMarkers.push(marker);

  // 마커 2개 누르면 경로 표시
  if (selectedMarkers.length === 2) {
    drawRoute(selectedMarkers[0], selectedMarkers[1]);
    selectedMarkers = []; // 다시 초기화
  }
}

function drawRoute(m1, m2) {
  const path = [
    m1.getPosition(),
    m2.getPosition()
  ];

  // 기존 라인 삭제
  if (polyline) polyline.setMap(null);

  polyline = new naver.maps.Polyline({
    map,
    path,
    strokeColor: "#ff0000",
    strokeWeight: 4
  });

  // 두 점이 다 보이도록
  map.panToBounds(new naver.maps.LatLngBounds(...path));
}
async function geocodeAddress(address) {
  const url = `https://naveropenapi.apigw.ntruss.com/map-geocode/v2/geocode?query=${encodeURIComponent(address)}`;
  
  const res = await fetch(url, {
    headers: {
      "X-NCP-APIGW-API-KEY-ID": "YOUR_CLIENT_ID",
      "X-NCP-APIGW-API-KEY": "YOUR_CLIENT_SECRET"
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
