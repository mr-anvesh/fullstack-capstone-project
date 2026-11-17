import express from 'express';
import { registerUser, loginUser } from './services/user.service';

const app = express();
const authRouter = express.Router();

app.use(express.json());

authRouter.post('/register', registerUser);
authRouter.post('/login', loginUser);

app.use('/auth', authRouter);

app.listen(process.env.PORT || 4001);