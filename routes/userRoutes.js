import { Router } from "express";
import { login, register, verifyOTP } from "../controllers/userController.js";

const router = Router();

router.post('/', register);
router.post('/login', login);
router.post('/verify-otp', verifyOTP)

export default router;

