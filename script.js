document.addEventListener('DOMContentLoaded', function() {
    const formModal = document.getElementById("formModal");
    const toggleFormButton = document.getElementById("toggleForm");
    const closeModal = document.querySelector(".close");
    const articleForm = document.getElementById("article-form");
    const articlesContainer = document.getElementById("articles-container");

    let articles = JSON.parse(localStorage.getItem('articles')) || [];

    // Mostrar los artículos guardados
    articles.forEach(article => renderArticle(article));

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

    // Manejar el envío del formulario
    articleForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const title = document.getElementById("title").value;
        const author = document.getElementById("author").value;
        const content = document.getElementById("content").value;
        const image = document.getElementById("image").files[0];

        // Crear un nuevo artículo
        const article = {
            title: title,
            author: author,
            content: content,
            image: image ? URL.createObjectURL(image) : null,
            likes: 0,
            dislikes: 0
        };

        articles.push(article);
        localStorage.setItem('articles', JSON.stringify(articles));

        // Renderizar el artículo en la página
        renderArticle(article);

        // Cerrar el modal y limpiar el formulario
        formModal.style.display = "none";
        articleForm.reset();
    });

    // Renderizar artículo
    function renderArticle(article) {
        const articleElement = document.createElement("div");
        articleElement.classList.add("article");

        if (article.image) {
            const imgElement = document.createElement("img");
            imgElement.src = article.image;
            imgElement.alt = article.title;
            articleElement.appendChild(imgElement);
        }

        const h3Element = document.createElement("h3");
        h3Element.textContent = article.title;
        articleElement.appendChild(h3Element);

        const smallElement = document.createElement("small");
        smallElement.textContent = "Por " + article.author;
        articleElement.appendChild(smallElement);

        const pElement = document.createElement("p");
        pElement.textContent = article.content;
        articleElement.appendChild(pElement);

        const buttonContainer = document.createElement("div");
        buttonContainer.classList.add("button-container");

        const likeButton = document.createElement("button");
        likeButton.textContent = `👍 ${article.likes}`;
        likeButton.classList.add("like-button");
        buttonContainer.appendChild(likeButton);

        const dislikeButton = document.createElement("button");
        dislikeButton.textContent = `👎 ${article.dislikes}`;
        dislikeButton.classList.add("dislike-button");
        buttonContainer.appendChild(dislikeButton);

        const editButton = document.createElement("button");
        editButton.textContent = "Editar";
        editButton.classList.add("edit-button");
        buttonContainer.appendChild(editButton);

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Borrar";
        deleteButton.classList.add("delete-button");
        buttonContainer.appendChild(deleteButton);

        articleElement.appendChild(buttonContainer);
        articlesContainer.appendChild(articleElement);

        // Botón de "me gusta"
        likeButton.addEventListener('click', function() {
            article.likes++;
            likeButton.textContent = `👍 ${article.likes}`;
            saveArticles();
        });

        // Botón de "no me gusta"
        dislikeButton.addEventListener('click', function() {
            article.dislikes++;
            dislikeButton.textContent = `👎 ${article.dislikes}`;
            saveArticles();
        });

        // Botón de borrar
        deleteButton.addEventListener('click', function() {
            articlesContainer.removeChild(articleElement);
            articles = articles.filter(a => a !== article);
            saveArticles();
        });

        // Botón de editar
        editButton.addEventListener('click', function() {
            editArticle(article, h3Element, smallElement, pElement, articleElement.querySelector('img'));
        });
    }

    function saveArticles() {
        localStorage.setItem('articles', JSON.stringify(articles));
    }

    function editArticle(article, titleElement, authorElement, contentElement, imgElement) {
        const newTitle = prompt("Editar título:", article.title);
        if (newTitle !== null) {
            article.title = newTitle;
            titleElement.textContent = newTitle;
        }

        const newAuthor = prompt("Editar autor:", article.author);
        if (newAuthor !== null) {
            article.author = newAuthor;
            authorElement.textContent = "Por " + newAuthor;
        }

        const newContent = prompt("Editar contenido:", article.content);
        if (newContent !== null) {
            article.content = newContent;
            contentElement.textContent = newContent;
        }

        if (imgElement) {
            const newImage = confirm("¿Quieres cambiar la imagen?");
            if (newImage) {
                const input = document.createElement("input");
                input.type = "file";
                input.accept = "image/*";
                input.onchange = function() {
                    const file = input.files[0];
                    if (file) {
                        const imageUrl = URL.createObjectURL(file);
                        article.image = imageUrl;
                        imgElement.src = imageUrl;
                    }
                };
                input.click();
            }
        }
        saveArticles();
    }

    // Función para abrir una noticia completa en una nueva ventana
    const newsItems = document.querySelectorAll('.side-news .news-item');

    newsItems.forEach(item => {
        item.addEventListener('click', function() {
            const title = item.querySelector('.news-title').textContent;
            const imageSrc = item.querySelector('img').src;
            const newWindow = window.open('', '_blank');
            newWindow.document.write(`
                <html>
                <head><title>${title}</title></head>
                <body>
                    <h1>${title}</h1>
                    <img src="${imageSrc}" alt="${title}">
                    <p>Contenido completo de la noticia...</p>
                </body>
                </html>
            `);
        });
    });
});
