import express from 'express';
import openAIRoutes from './routes/openAIRoutes.js';
import linkedinRoutes  from './routes/linkedinRoutes.js';
import testRoutes  from './routes/testRoutes.js';
import path from 'path';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();
app.use(cookieParser());
const __dirname = path.resolve();

// Middleware para servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));
app.use('/chat', express.static(path.join(__dirname, 'Chat')));

app.use(express.json());
app.use(cors());
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
 
  
app.use('/openai', openAIRoutes);
app.use('/linkedin',linkedinRoutes) 
app.use('/test', testRoutes);


app.listen(process.env.PORT, () => {
    console.log('Escuchando en el puerto: ' + process.env.PORT);
});

export default app;
