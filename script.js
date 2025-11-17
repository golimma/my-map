console.log("📌 script.js 로드됨");

// 지도 객체
let map;

// 지도 초기화
function initMap() {
    try {
        if (!kakao || !kakao.maps) {
            console.error("❌ kakao.maps 객체 없음!");
            alert("❌ Kakao Maps SDK 로딩 실패 (kakao.maps 없음)");
            return;
        }

        console.log("✅ Kakao Maps SDK 로딩 성공!");

        const container = document.getElementById('map');
        if (!container) {
            console.error("❌ map div 없음!");
            alert("❌ #map 요소를 찾을 수 없습니다.");
            return;
        }

        const options = {
            center: new kakao.maps.LatLng(37.5665, 126.9780),
            level: 5
        };

        map = new kakao.maps.Map(container, options);
        console.log("✅ 지도 생성 성공", map);

    } catch (err) {
        console.error("🔥 map 생성 중 오류:", err);
        alert("🔥 지도 생성 에러 발생: 콘솔 확인");
    }
}

// SDK 로드 후 실행
window.onload = function () {
    console.log("📌 window.onload 실행됨 → initMap 호출");
    initMap();
};

// 주소 검색 및 마커 표시
function processAddresses() {
    console.log("📌 processAddresses() 호출됨");

    const geocoder = new kakao.maps.services.Geocoder();

    if (!geocoder) {
        console.error("❌ geocoder 생성 실패");
        alert("❌ geocoder 생성 실패");
        return;
    }

    const lines = document.getElementById("addrInput").value.split("\n");

    lines.forEach((addr, index) => {
        addr = addr.trim();

        if (!addr) {
            console.log(`⚠️ ${index + 1}번째 줄: 빈 줄 → 무시`);
            return;
        }

        console.log(`📍 주소 검색 요청 #${index + 1}:`, addr);

        geocoder.addressSearch(addr, function (result, status) {
            console.log(`🔎 검색 결과 #${index + 1}`, { status, result });

            if (status === kakao.maps.services.Status.OK) {
                const lat = result[0].y;
                const lng = result[0].x;

                console.log(`✔️ 좌표 변환 성공: ${lat}, ${lng}`);

                new kakao.maps.Marker({
                    map: map,
                    position: new kakao.maps.LatLng(lat, lng)
                });

            } else {
                console.error(`❌ 주소 검색 실패 (#${index + 1} : ${addr})`, status);
            }
        });
    });
}
