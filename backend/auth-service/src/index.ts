import express from 'express';
import {registerUser, loginUser} from './services/user.service'

const app = express();

app.use(express.json());

app.post('/auth/register', registerUser);

app.post('/auth/login', loginUser);