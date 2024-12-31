const home = document.getElementById("post_list");

document.addEventListener('wheel',(event)=>{
    home.scrollTop += event.deltaY;
})


function hiddenPostAction(){
    const hiddenPostActionButton = document.getElementById("hiddenPostAction");
    hiddenPostActionButton.submit();
}