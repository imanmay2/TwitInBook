const sidebarItems = document.querySelectorAll(".sidebar-items");
const components = document.querySelectorAll(".component");

sidebarItems.forEach(item => {
    item.addEventListener("click", ()=> {
        const section = item.getAttribute("data-section");
        components.forEach(component => {
            component.style.display = "none";
        });
        const targetComponent = document.getElementById(section);
        
        if (targetComponent) {
            targetComponent.style.display = "block";
            if(section == "create"){
                const overlay = document.getElementById("overlay");
                overlay.style.display = '';
                const cancel = document.querySelector('#cancel');
                console.log(cancel);     
                cancel.addEventListener('click', () => {
                    console.log("Clicked");
                    overlay.style.display = 'none';
                });
            }
        }
    });
});