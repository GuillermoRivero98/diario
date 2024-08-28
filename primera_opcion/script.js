// Seleccionamos los elementos del modal
const articleModal = document.getElementById('articleModal');
const closeModalButton = document.getElementById('closeModal');
const modalTitle = document.getElementById('modalTitle');
const modalContent = document.getElementById('modalContent');

// Función para abrir el modal
function openModal(title, content) {
    modalTitle.textContent = title;
    modalContent.textContent = content;
    articleModal.classList.add('is-active');
}

// Función para cerrar el modal
function closeModal() {
    articleModal.classList.remove('is-active');
}

// Event listeners para los botones "Leer más"
document.querySelectorAll('.read-more').forEach(button => {
    button.addEventListener('click', () => {
        const title = button.getAttribute('data-title');
        const content = button.getAttribute('data-content');
        openModal(title, content);
    });
});

// Cerrar el modal cuando se hace clic en el botón de cerrar
closeModalButton.addEventListener('click', closeModal);

// Cerrar el modal al hacer clic en el fondo del modal
document.querySelector('.modal-background').addEventListener('click', closeModal);
