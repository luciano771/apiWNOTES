// openAIRoutes.js

import express from 'express'
import  openAIController  from '../controllers/openAIController.js';
import  linkedinController  from '../controllers/linkedinController.js';


const openAIRoutes = express.Router();
const openaicontrollers = new openAIController(); 
openAIRoutes.post('/', async (req, res) => {
    const publicacionGET = req.body.mensaje;
    const mensaje = `Estoy a punto de compartir una publicación en mis redes sociales con el siguiente contenido: '${publicacionGET}'.
    Quiero mejorar el tono y la creatividad de esta publicación considerando la audiencia, principalmente de Argentina.
    Necesito 4 ejemplos únicos y creativos, cada uno con su propio estilo y emojis para conectar de manera efectiva con la audiencia.
    Podes usar hashtags, etiquedas y todos los recursos nesesarios para hacer que el contenido sea creativo
    Por favor, proporciona el texto en formato JSON como se muestra a continuación. Es crucial mantener la misma estructura del JSON, cambiando únicamente el contenido de las publicaciones:
    {
    "1": "publicación 1",
    "2": "publicación 2",
    ...
    }`;

    try {
        const respuesta = await openaicontrollers.enviarPrompt(mensaje);
        const respuestaObjeto = JSON.parse(respuesta);
        res.json(respuestaObjeto);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al procesar la solicitud' });
    }
});

export default openAIRoutes;


 
