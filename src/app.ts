import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { Interview } from './Interview';

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

/**
 * Render views
 */
const viewFolder = path.join(__dirname, 'views')
app.set('view engine', 'pug');
app.set('views', viewFolder);

//  Render home page
app.get('/', (req: Request, res: Response) => {
    res.render('index', { title: 'Index', message: 'Hello there!' })
});

app.get('/session/create', (req: Request, res: Response) => {
    const uid = Interview.create()
    res.redirect(`/session/${uid}`)
});

app.get('/session/:uid', (req: Request, res: Response) => {
    const uid = req.params['uid'];
    const interview  = Interview.find(uid);
    if(interview === undefined)
        res.status(404).render('404');
    else res.render('session', { uid, title: `Interview-${uid}` })
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