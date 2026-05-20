import express from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';
import convidadosRoutes from './routes/convidadoRoutes';
import usuariosRoutes from './routes/usuarioRoutes';
import dashboardRoutes from './routes/dashboardRoutes';
import authRoutes from './routes/authRoutes';

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.use(convidadosRoutes);
app.use(usuariosRoutes);
app.use(authRoutes);
app.use(dashboardRoutes);

const PORTA = process.env.PORTA;
app.listen(PORTA, () => {
    console.log(`SERVIDOR NO AR EM: ${PORTA}`)
});