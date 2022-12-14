import express from "express";
import * as rentalsControllers from "../controllers/rentals.controllers.js";

const router = express.Router();

router.post('/rentals', rentalsControllers.createRental);

router.get('/rentals', rentalsControllers.listRentals);

router.post('/rentals/:id/return', rentalsControllers.endRental);

router.delete('/rentals/:id', rentalsControllers.deleteRental);

export default router;