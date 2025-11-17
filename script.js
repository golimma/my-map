// 지도 생성
let map;

window.onload = function () {
    const container = document.getElementById('map');

    const options = {
        center: new kakao.maps.LatLng(37.5665, 126.9780), // 서울시청 좌표
        level: 5
    };

    map = new kakao.maps.Map(container, options);
};

// 주소 처리 함수
async function processAddresses() {
    const geocoder = new kakao.maps.services.Geocoder();
    const lines = document.getElementById("addrInput").value.split("\n");

    for (let addr of lines) {
        if (!addr.trim()) continue;

        geocoder.addressSearch(addr, function (result, status) {
            if (status === kakao.maps.services.Status.OK) {
                const lat = result[0].y;
                const lng = result[0].x;

                const marker = new kakao.maps.Marker({
                    map: map,
                    position: new kakao.maps.LatLng(lat, lng)
                });
            }
        });
    }
}
