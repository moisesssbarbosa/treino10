import { Router } from "express";
import { autenticar } from "../middlewares/autenticar";
import { verificarAdmin } from "../middlewares/verificarAdmin";
import { obterMetricas } from '../controllers/dashboardController';

const router = Router();

router.get('/dashboard', autenticar, verificarAdmin, obterMetricas);

export default router;