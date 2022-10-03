import express from "express";
import * as categoriesControllers from "../controllers/categories.controllers.js";

const router = express.Router();

router.post('/categories', categoriesControllers.createCategory);

router.get('/categories', categoriesControllers.listCategories);

export default router;