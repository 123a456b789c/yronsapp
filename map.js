async function loadConfig() {
    const response = await fetch("config.json");
    const jsonData = await response.json();
    window.config = jsonData
    loadMap()
}

function loadMap() {

var map = L.map('map').setView([window.config.lat, window.config.long], window.config.zoom);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

try{
    token = document.cookie.split(";").filter((item) => item.includes("jwt="))[0].split("=")[1]
} catch(e) {
    console.log(e)
    location.href = "/login.html"
}

fetch(window.config.address + "/map_places", {
    method: "POST",
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        token : token,
    })
}).then( async (response) => {
    if (response.status == 200) {
        jsonData = await response.json()
        console.log(jsonData)
        for (var i = 0; i < jsonData.length; i++) {
            L.marker([jsonData[i].lat, jsonData[i].long]).addTo(map)
                .bindPopup("<b>" + jsonData[i].name + "</b><br />" + jsonData[i].description)
        }
    } else {
        response.json().then((json) => {
        location.href = "/login.html"
        })
    }
})

}