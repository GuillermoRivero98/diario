document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById("newsModal");
    const modalTitle = document.getElementById("modalTitle");
    const modalImage = document.getElementById("modalImage");
    const modalContent = document.getElementById("modalContent");
    const closeModal = document.querySelector(".close");

    // Funcionalidad para abrir el modal al hacer clic en la imagen o en el título de la noticia
    const newsItems = document.querySelectorAll('.news-item');
    newsItems.forEach(item => {
        item.addEventListener('click', function() {
            const titleText = this.querySelector('.news-title').textContent;
            const imageSrc = this.querySelector('.news-image').src;
            const content = this.querySelector('.news-content').innerHTML;

            // Configurar el contenido del modal
            modalTitle.textContent = titleText;
            modalImage.src = imageSrc;
            modalContent.innerHTML = content;

            // Mostrar el modal
            modal.style.display = "block";
        });
    });

    // Funcionalidad para cerrar el modal
    closeModal.onclick = function() {
        modal.style.display = "none";
    };

    // Cerrar el modal si se hace clic fuera del contenido del modal
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    };
});
