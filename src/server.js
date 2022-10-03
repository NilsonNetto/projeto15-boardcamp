import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import categoriesRouter from "./routers/categories.routers.js";
import customersRouter from "./routers/customers.routers.js";
import gamesRouter from "./routers/games.routers.js";
import rentalsRouter from "./routers/rentals.routers.js";
dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

app.use(categoriesRouter);

app.use(customersRouter);

app.use(gamesRouter);

app.use(rentalsRouter);

app.listen(process.env.PORT, () => {
  console.log(`Listen on port ${process.env.PORT}`);
});