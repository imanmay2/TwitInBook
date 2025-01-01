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
            const overlay = targetComponent.children[1];
            overlay.style.display = '';
            const cancel = overlay.querySelector("#cancel");
            cancel.addEventListener('click',()=>{
                overlay.style.display = 'none';
            });
        }
    });
});

const logout = document.getElementById('logout');
logout.addEventListener('click',()=>{
    window.location.href = '/logout';
});