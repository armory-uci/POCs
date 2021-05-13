const btnAdd = document.getElementById("btnAdd")
btnAdd.addEventListener("click", e => login(prompt("Enter Username:")))

async function login(userId) {
    const res = await fetch("login", {"method": "post", "headers": {"content-type": "application/json"}, "body": JSON.stringify({ userId })});
    const a = await res.json();
    location.reload();
}
