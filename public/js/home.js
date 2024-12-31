const home = document.getElementById("post_list");

document.addEventListener('wheel', (event) => {
    home.scrollTop += event.deltaY;
})

const posts = document.querySelectorAll('.box_post');

posts.forEach(post => {
    const moreButton = post.querySelector('#more');
    const dropdownMenu = post.querySelector('#dropdown-menu');

    moreButton.addEventListener('click', (event) => {
        event.stopPropagation();

        document.querySelectorAll('#dropdown-menu').forEach(menu => {
            if (menu !== dropdownMenu) {
                menu.style.display = 'none';
            }
        });

        dropdownMenu.style.display = dropdownMenu.style.display === 'block' ? 'none' : 'block';
    });
});

document.addEventListener('click', () => {
    document.querySelectorAll('#dropdown-menu').forEach(menu => {
        menu.style.display = 'none';
    });
});


const edit_POST = document.getElementById('edit_POST');
const overlay = document.getElementById('overlay');
const cancel = document.getElementById('cancel');
overlay.style.display = 'none';
edit_POST.addEventListener('click',()=>{
    overlay.style.display = 'flex !important';
})
cancel.addEventListener('click',()=>{
    overlay.style.display = 'none !important';
})