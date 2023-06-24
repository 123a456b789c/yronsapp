async function loadConfig() {
    const response = await fetch("config.json");
    const jsonData = await response.json();
    window.config = jsonData
}

function send() {
    var email = document.getElementById("email").value
    var passkey = document.getElementById("passkey").value
    fetch(window.config.address + "/login", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email : email,
            passkey : passkey
        })
    }).then( async (response) => {
        if (response.status == 200) {
            jsonData = await response.json()
            document.getElementById("output").innerHTML = '<div class="alert alert-success" role="alert">Login succesfull! Saving JWT to cookies and redirecting!</div>'
            document.cookie = "jwt=" + jsonData.token + ";path=/"
            window.location.href = "/dashboard.html"
        } else {
            response.json().then((json) => {
                document.getElementById("output").innerHTML = `<div class="alert alert-danger" role="alert">${json.error}</div>`
            })
        }
    })

    document.getElementById("email").value = ""
    document.getElementById("passkey").value = ""
}

