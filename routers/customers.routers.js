import express from "express";
import * as customerControllers from "../controllers/customers.controllers.js";

const router = express.Router();

router.post('/customers', customerControllers.createCustomer);

router.put('/customers/:id', customerControllers.updateCustomer);

router.get('/customers', customerControllers.listCustomers);

router.get('/customers/:id', customerControllers.listCustomerById);

export default router;