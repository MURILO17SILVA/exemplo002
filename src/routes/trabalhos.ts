import { Router } from "express";
import TrabalhoController from "../controllers/TrabalhoController";

const trabalhosRouter = Router();
const trabalhoCtrl = new TrabalhoController();

// Definição das rotas
trabalhosRouter.post("/", (req, res) => trabalhoCtrl.salvar(req, res));
trabalhosRouter.get("/area/:codArea", (req, res) => trabalhoCtrl.buscarPorArea(req, res));

export default trabalhosRouter;
