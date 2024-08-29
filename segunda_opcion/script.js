document.addEventListener('DOMContentLoaded', function() {
    const formModal = document.getElementById("formModal");
    const toggleFormButton = document.getElementById("toggleForm");
    const closeModal = document.querySelector(".close");

    // Mostrar el formulario en un pop-up
    toggleFormButton.addEventListener('click', function() {
        formModal.style.display = "block";
    });

    // Cerrar el formulario pop-up
    closeModal.onclick = function() {
        formModal.style.display = "none";
    };

    // Cerrar el formulario si se hace clic fuera del contenido del modal
    window.onclick = function(event) {
        if (event.target == formModal) {
            formModal.style.display = "none";
        }
    };
});
