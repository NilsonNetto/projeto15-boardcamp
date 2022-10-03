import express from "express";
import * as customerControllers from "../controllers/customers.controllers.js";
import customerValidation from "../middlewares/customerValidation.middleware.js";

const router = express.Router();

router.post('/customers', customerValidation, customerControllers.createCustomer);

router.put('/customers/:id', customerValidation, customerControllers.updateCustomer);

router.get('/customers', customerControllers.listCustomers);

router.get('/customers/:id', customerControllers.listCustomerById);

export default router;