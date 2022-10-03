import express from "express";
import * as gamesControllers from "../controllers/games.controllers.js";

const router = express.Router();

router.post('/games', gamesControllers.createGame);

router.get('/games', gamesControllers.listGames);

export default router;