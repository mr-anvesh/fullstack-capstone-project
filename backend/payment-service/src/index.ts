import express from 'express';
import type { Request, Response } from 'express';

const app = express();

app.post('/payment', (req: Request, res: Response) => {
    res.status(201).json({
        status: 'Successful',
    });
});

app.listen(4005);
