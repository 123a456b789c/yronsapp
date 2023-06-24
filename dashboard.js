async function loadConfig() {
    const response = await fetch("config.json");
    const jsonData = await response.json();
    window.config = jsonData
    hydrate()
}

function toggleQR() {
    if (document.getElementById("qrcode").style.display == "none") {
        document.getElementById("qrcode").style.display = "block"
        document.getElementById("QRButton").textContent = "Hide QR Code"
    } else {
        document.getElementById("qrcode").style.display = "none"
        document.getElementById("QRButton").textContent = "Show QR Code"
    }
}

function hydrate() {
    try{
        token = document.cookie.split(";").filter((item) => item.includes("jwt="))[0].split("=")[1]
    } catch(e) {
        console.log(e)
        location.href = "/login.html"
    }
    console.log(token)
    fetch(window.config.address + "/getPersonalInfo", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            token : token
        })
    }).then( async (response) => {
        if (response.status == 200) {
            jsonData = await response.json()
            console.log(jsonData)
            document.getElementById("name").textContent = "Welcome, " + jsonData.user.name + "!"
            document.getElementById("meta").textContent = "(" + jsonData.user.country + " " + getFlag(jsonData.user.country) + " - " + jsonData.user.school + ")"
            document.getElementById("sharing_code").textContent = jsonData.user.d6_Identifier
            document.getElementById("email").textContent = jsonData.user.email
            new QRCode(document.getElementById("qrcode"),{ text: window.config.address_of_static + "qrscanned.html?" + jsonData.user.d6_Identifier, width: 128, height: 128,});
        } else {
            response.json().then((json) => {
                location.href = "/login.html"
            })
        }
    })
    console.log(token)
    fetch(window.config.address + "/events", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            token : token
        })
    }).then( async (response) => {
        jsonData = await response.json()
        console.log(jsonData)
        if (response.status == 200) {
            var index = 0
            var last_distance = 0
            var upcomingArray = []
            for (i = 0; i<jsonData.events.length; i++) {
                console.log(new Date(jsonData.events[i].start_date) - Date.now())
                if (new Date(jsonData.events[i].start_date) - Date.now() > 0) {
                    upcomingArray.push(jsonData.events[i])
                }
            }
            jsonData.events = upcomingArray
            last_distance = new Date(upcomingArray[0].start_date) - Date.now()
            for (i = 0; i<jsonData.events.length; i++) {
                var current_event = jsonData.events[i]
                var parsed_date = new Date(current_event.start_date)
                var dist_now = parsed_date.getTime() - Date.now()
                console.log(dist_now, current_event.name, last_distance)
                if (dist_now < last_distance) {
                    last_distance = parsed_date - Date.now()
                    index = i
                    console.log("new index")
                }
            }
            var best_fit = jsonData.events[index]
            var start_date = new Date(best_fit.start_date)
            var miscdaydesc = ""
            if (start_date.getDate() == new Date().getDate()) {
                miscdaydesc = "Today"
            } else if (start_date.getDate() == new Date().getDate() + 1) {
                miscdaydesc = "Tomorrow"
            } else {
                miscdaydesc = "On " + start_date.getDate() + "/" + start_date.getMonth() + "/" + start_date.getFullYear()
            }
            document.getElementById("eventContainer").innerHTML = `
            <div class="card" style="width: 100%;margin-bottom: 10px;">
            <div class="card-body">
              <h5 class="card-title">${best_fit.name}</h5>
              <i>Starts at ${start_date.getHours()}:${start_date.getMinutes()}, ${miscdaydesc}</i><br>
              <i>Location: ${best_fit.place}</i>
              <p class="card-text">${best_fit.description}</p>
            </div>
          </div>`
        } else {
            response.json().then((json) => {
                location.href = "/login.html"
            })
        }
    })
}

function logout() {
    document.cookie = "jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    location.reload()
}