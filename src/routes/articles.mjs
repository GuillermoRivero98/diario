import express from "express";
const router = express.Router();

// Datos de ejemplo (artículos)
let articles = [
  {
    id: "1",
    title: "Primer Artículo",
    author: "Rodrigo Lujambio",
    content: "Contenido del primer artículo",
    image: null,
    likes: 0,
    dislikes: 0,
  },
];

// Función de validación de artículos
function validateArticle(article) {
  if (!article.title || article.title.trim() === "") {
    return { error: "El título es obligatorio." };
  }
  if (!article.author || article.author.trim() === "") {
    return { error: "El autor es obligatorio." };
  }
  if (!article.content || article.content.trim() === "") {
    return { error: "El contenido es obligatorio." };
  }
  return null;
}

// GET todos los artículos
router.get("/articles", (req, res) => {
  res.json(articles);
});

// POST un nuevo artículo con validaciones
router.post("/articles", (req, res) => {
  const article = req.body;

  // Validación de los datos
  const validationError = validateArticle(article);
  if (validationError) {
    return res.status(400).json(validationError); // Responder con error 400 si la validación falla
  }

  article.id = (articles.length + 1).toString();
  articles.push(article);
  res.status(201).json(article);
});

// DELETE un artículo por ID
router.delete("/articles/:articleId", (req, res) => {
  const articleId = req.params.articleId;
  articles = articles.filter((article) => article.id !== articleId);
  res.sendStatus(204);
});

// PUT (actualizar) un artículo por ID
router.put("/articles/:articleId", (req, res) => {
  const articleId = req.params.articleId;
  const updatedArticle = req.body;

  // Validación de los datos
  const validationError = validateArticle(updatedArticle);
  if (validationError) {
    return res.status(400).json(validationError); // Responder con error 400 si la validación falla
  }

  articles = articles.map((article) => {
    if (article.id === articleId) {
      return { ...article, ...updatedArticle, id: articleId };
    }
    return article;
  });

  res.json(articles.find((article) => article.id === articleId));
});

export default router;
