const home = document.getElementById("post_list");

document.addEventListener('wheel',(event)=>{
    home.scrollTop += event.deltaY;
})