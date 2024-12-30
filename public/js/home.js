const home = document.getElementById("home_container");

document.addEventListener('wheel',(event)=>{
    home.scrollTop += event.deltaY;
})