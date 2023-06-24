
async function loadConfig() {
    const response = await fetch("config.json");
    const jsonData = await response.json();
    window.config = jsonData
    hydrate()
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
            document.getElementById("name").value =jsonData.user.name
            document.getElementById("email").value = jsonData.user.email
            document.getElementById("project").value = jsonData.user.project
            document.getElementById("bio").value = jsonData.user.bio
            } else {
            response.json().then((json) => {
                location.href = "/login.html"
            })
        }
    })
}

function send() {
    try{
        token = document.cookie.split(";").filter((item) => item.includes("jwt="))[0].split("=")[1]
    }
    catch(e) {
        console.log(e)
        location.href = "/login.html"
    }
    var name = document.getElementById("name").value
    var email = document.getElementById("email").value
    var project = document.getElementById("project").value
    var bio = document.getElementById("bio").value
    fetch(window.config.address + "/register", {
        method: "PUT",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            token : token,
            name : name,
            email : email,
            project : project,
            bio : bio
        })
    }).then((response) => {
        if (response.status == 200) {
            document.getElementById("output").innerHTML = '<div class="alert alert-success" role="alert">Your profile has been updated successfully!</div>'
        } else {
            response.json().then((json) => {
                document.getElementById("output").innerHTML = `<div class="alert alert-danger" role="alert">${json.error}</div>`
            })
        }
    })
    document.getElementById("bio").value = ""
    document.getElementById("name").value = ""
    document.getElementById("email").value = ""
    document.getElementById("project").value = ""
}

