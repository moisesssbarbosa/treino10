import { Router } from "express";
import { fazerLogin } from '../controllers/authController';

const router = Router();

router.post('/auth/login', fazerLogin);

export default router;