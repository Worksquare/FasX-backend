const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const articleValidation = require('../../validations/article.validation');
const articleController = require('../../controllers/article.controller');
const router = express.Router();

router
  .route('/')
  .post(auth(), validate(articleValidation.createArticle), articleController.createArticle)
  .get(auth(), validate(articleValidation.getArticles), articleController.getArticles);

router
  .route('/authorblog/:authorId')
  .get(auth(), validate(articleValidation.authorArticles), articleController.articleByAuthor);

router
  .route('/:articleId')
  .get(auth(), validate(articleValidation.getArticle), articleController.getArticle)
  .patch(auth(), validate(articleValidation.updateArticle), articleController.updateArticle)
  .delete(auth(), validate(articleValidation.deleteArticle), articleController.deleteArticle);

module.exports = router;
