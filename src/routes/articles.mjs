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
  {
    id: "2",
    title: "Segundo Artículo",
    author: "Michel Sampil",
    content: "Contenido del segundo artículo",
    image: null,
    likes: 0,
    dislikes: 0,
  },
];

// GET todos los artículos
router.get("/articles", (req, res) => {
  res.json(articles);
});

// POST un nuevo artículo
router.post("/articles", (req, res) => {
  const article = req.body;
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

  articles = articles.map((article) => {
    if (article.id === articleId) {
      return { ...article, ...updatedArticle, id: articleId };
    }
    return article;
  });

  res.json(articles.find((article) => article.id === articleId));
});

export default router;
