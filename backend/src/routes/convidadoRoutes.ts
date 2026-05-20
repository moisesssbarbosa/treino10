import { Router } from "express";
import { autenticar } from '../middlewares/autenticar';
import { verificarAdmin } from "../middlewares/verificarAdmin";
import {
  criarConvidados,
  listarConvidados,
  atualizarCheckin,
  atualizarConvidados,
  apagarConvidados,
} from "../controllers/convidadoController";

const router = Router();

router.post("/convidados", autenticar, verificarAdmin, criarConvidados);

router.get("/convidados", autenticar, listarConvidados);

router.patch("/convidados/:id/checkin", autenticar, atualizarCheckin);

router.put("/convidados/:id", autenticar, verificarAdmin, atualizarConvidados);

router.delete("/convidados/:id", autenticar, verificarAdmin, apagarConvidados);

export default router;