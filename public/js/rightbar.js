const textarea = document.getElementById("text-area");
textarea.addEventListener('input',()=>{
    if(textarea.value != '')
        textarea.style.fontSize=`${15}px`;
    else
        textarea.style.fontSize=`${20}px`;
    textarea.style.height= `auto`;
    textarea.style.height = `${textarea.scrollHeight}px`;
})

