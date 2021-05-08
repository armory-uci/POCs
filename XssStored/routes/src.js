const btnAdd = document.getElementById("btnAdd")
btnAdd.addEventListener("click", e => postProduct(prompt("Enter Product Name")))

async function postProduct(name) {
    const olProducts = document.getElementById("olProducts")
    const res = await fetch("products", {"method": "post", "headers": {"content-type": "application/json"}, "body": JSON.stringify({"name": name   }) });
    const a = await res.json();
    alert(JSON.stringify(a))
}
