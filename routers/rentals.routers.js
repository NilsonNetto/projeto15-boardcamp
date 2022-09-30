import express from "express";
import * as rentalsControllers from "../controllers/rentals.controllers.js";

const router = express.Router();

router.post('/rentals', rentalsControllers.createRental);

export default router;