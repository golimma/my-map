// 지도 초기 생성
let map;

function initMap() {
  const container = document.getElementById('map');
  const options = {
    center: new kakao.maps.LatLng(37.5665, 126.9780), // 서울 기준
    level: 5
  };

  map = new kakao.maps.Map(container, options);
}

initMap();

// 주소-좌표 변환 객체
const geocoder = new kakao.maps.services.Geocoder();

// 마커 저장 배열 (초기화/삭제 가능)
let markers = [];

// 마커 초기화 함수
function clearMarkers() {
  markers.forEach(m => m.setMap(null));
  markers = [];
}

// 주소 처리 메인 함수
async function processAddresses() {
  clearMarkers(); // 기존 마커 삭제

  const input = document.getElementById("addrInput").value.trim();
  if (!input) {
    alert("주소를 입력하세요.");
    return;
  }

  const addressList = input.split("\n").map(a => a.trim()).filter(a => a.length > 0);

  for (let addr of addressList) {
    try {
      await geocodeAddress(addr);
    } catch (e) {
      console.error("Geocode 실패:", addr, e);
    }
  }

  alert("모든 주소 마커 표시 완료!");
}

// 주소 1개를 좌표로 변환 후 지도에 표시
function geocodeAddress(address) {
  return new Promise((resolve, reject) => {
    geocoder.addressSearch(address, function(result, status) {

      if (status === kakao.maps.services.Status.OK) {
        const lat = result[0].y;
        const lng = result[0].x;

        const coords = new kakao.maps.LatLng(lat, lng);

        // 마커 생성
        const marker = new kakao.maps.Marker({
          map: map,
          position: coords
        });
        markers.push(marker);

        // 인포윈도우 생성
        const infowindow = new kakao.maps.InfoWindow({
          content: `<div style="padding:5px;font-size:13px;">${address}</div>`
        });
        
        kakao.maps.event.addListener(marker, 'click', function() {
          infowindow.open(map, marker);
        });

        resolve({lat, lng});
      } else {
        console.warn("주소 변환 실패:", address);
        resolve(null);
      }
    });
  });
}
