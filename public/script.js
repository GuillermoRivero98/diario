document.addEventListener('DOMContentLoaded', function() {
    const formModal = document.getElementById("formModal");
    const toggleFormButton = document.getElementById("toggleForm");
    const closeModal = document.querySelector(".close");
    const articleForm = document.getElementById("article-form");
    const articlesContainer = document.getElementById("articles-container");

    fetch('/api/articles')
        .then(response => response.json())
        .then(articles => {
            articles.forEach(article => renderArticle(article));
        })
        .catch(err => console.error("Error al obtener los artículos:", err));

    toggleFormButton.addEventListener('click', function() {
        formModal.style.display = "block";
    });

    closeModal.onclick = function() {
        formModal.style.display = "none";
    };

    window.onclick = function(event) {
        if(event.target == formModal) {
            formModal.style.display = "none";
        }
    };

    articleForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const title = document.getElementById("title").value;
        const author = document.getElementById("author").value;
        const content = document.getElementById("content").value;
        const image = document.getElementById("image").files[0]; 

        if (!title || !author || !content) {
            alert("Por favor, rellena todos los campos.");
            return;
        }

        if (image && image.size > 2 * 1024 * 1024) {
            alert("La imagen no puede pesar más de 2MB.");
            return;
        }

        const article = {
            title: title,
            author: author,
            content: content,
            image: image ? URL.createObjectURL(image) : null, 
            likes: 0,
            dislikes: 0
        };

        fetch('/api/articles', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(article)
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(errorData => {
                    throw new Error(errorData.error);
                });
            }
            return response.json();
        })
        .then(newArticle => {
            renderArticle(newArticle); 
            formModal.style.display = "none";
            articleForm.reset();
        })
        .catch(err => {
            alert("Error al crear artículo: " + err.message); 
        });
    });

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

        likeButton.addEventListener('click', function() {
            article.likes++;
            likeButton.textContent = `👍 ${article.likes}`;
            updateArticle(article); 
        });

        dislikeButton.addEventListener('click', function() {
            article.dislikes++;
            dislikeButton.textContent = `👎 ${article.dislikes}`;
            updateArticle(article); 
        });

        deleteButton.addEventListener('click', function() {
            fetch(`/api/articles/${article.id}`, {
                method: 'DELETE',
            })
            .then(() => {
                articlesContainer.removeChild(articleElement);
            })
            .catch(err => console.error("Error al eliminar artículo:", err));
        });

        editButton.addEventListener('click', function() {
            editArticle(article, h3Element, smallElement, pElement, articleElement.querySelector('img'));
        });
    }

    function updateArticle(article) {
        fetch(`/api/articles/${article.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(article)
        })
        .then(response => response.json())
        .catch(err => console.error("Error al actualizar artículo:", err));
    }

    function editArticle(article, titleElement, authorElement, contentElement, imgElement) {
        const newTitle = prompt("Editar título:", article.title);
        if (newTitle !== null && newTitle.trim() !== "") {
            article.title = newTitle.trim();
            titleElement.textContent = newTitle.trim();
        }

        const newAuthor = prompt("Editar autor:", article.author);
        if (newAuthor !== null && newAuthor.trim() !== "") {
            article.author = newAuthor.trim();
            authorElement.textContent = "Por " + newAuthor.trim();
        }

        const newContent = prompt("Editar contenido:", article.content);
        if (newContent !== null && newContent.trim() !== "") {
            article.content = newContent.trim();
            contentElement.textContent = newContent.trim();
        }

        updateArticle(article);
    }

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
