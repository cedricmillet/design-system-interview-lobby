import dotenv from 'dotenv';
dotenv.config();

import express, { Express, Request, Response } from 'express';
import path from 'path';
import { Interview } from './Interview';
import { Lobby } from './Lobby';

const app: Express = express();
const port = process.env.PORT;

/**
 * Render views
 */
const viewFolder = path.join(__dirname, 'views')
app.set('view engine', 'pug');
app.set('views', viewFolder);
app.use('/assets', express.static(path.join(__dirname, 'views/includes/assets')));

/**
 * Index
 */
app.get('/', (req: Request, res: Response) => {
    res.render('index', { title: 'Index' })
});

/**
 * Create an interview
 */
app.get('/session/create', (req: Request, res: Response) => {
    const uid = Interview.create()
    res.redirect(`/session/${uid}`)
});

/**
 * Join Interview
 */
app.get('/session/:uid', (req: Request, res: Response) => {
    const uid = req.params['uid'];
    const interview  = Interview.find(uid);
    if(interview === undefined) res.status(404).redirect('/?error=InterviewNotFound');
    else res.render('interview', { uid, title: `Interview-${uid}` })
});


/**
 * Connect API
 */
app.get('/api', (req: Request, res: Response) => {
  res.send('API working !');
});


/**
 * Start server
 */
app.listen(port, () => {
  console.log(`⚡️ Server is running at https://localhost:${port}`);
});


Lobby.listen()