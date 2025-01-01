
const editButtons = document.querySelectorAll("#edit_POST"); 
const cancel = document.getElementById('cancel');
const overlay = document.getElementById("overlay");
const editTextarea = document.getElementById("edit_text");
const postID = document.getElementById("postID");

overlay.style.display = 'none'; //VERY IMP TO HIDE INITIALLY
editButtons.forEach(button => {
    button.addEventListener("click", (event) => {
        event.preventDefault();
        overlay.style.display = "flex";
        cancel.addEventListener('click', () => {
            overlay.style.display = 'none';
        });
        const post_id = button.closest(".box_post").querySelector(".post_id").textContent;
        postID.value = post_id;
        console.log(postID.value);
        const postText = button.closest(".box_post").querySelector(".post_para").textContent;
        editTextarea.value = postText.trim();
    });
});
