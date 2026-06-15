const btn = document.getElementById("btn");

if(btn){
    btn.addEventListener("click", () => {
        alert("Welcome!");
    });
}

function showName(){
    const name = document.getElementById("name").value;
    document.getElementById("result").textContent =
        `Hello, ${name}!`;
}