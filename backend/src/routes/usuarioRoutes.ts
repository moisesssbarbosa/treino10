import { Router } from "express";
import { criarUsuarios } from '../controllers/usuarioController';
import { autenticar } from "../middlewares/autenticar";
import { verificarAdmin } from "../middlewares/verificarAdmin";

const router = Router();

router.post('/usuarios', autenticar, verificarAdmin, criarUsuarios);

export default router;