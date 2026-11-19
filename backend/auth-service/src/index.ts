import express from 'express';
import { loginUserController, registerUserController } from './controllers/auth.controller';

const app = express();
const authRouter = express.Router();

app.use(express.json());

authRouter.post('/register', registerUserController);
authRouter.post('/login', loginUserController);

app.use('/auth', authRouter);

app.listen(process.env.PORT || 4001);