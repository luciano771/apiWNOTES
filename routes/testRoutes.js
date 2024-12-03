import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Convertir import.meta.url en una ruta de archivo
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Ruta para devolver el HTML
router.get('/index', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'test.html'));
});

 
// Función para determinar la semana del mes
function getWeekOfMonth(date) {
    const [day, month, year] = date.split('/').map(Number);
    const currentDate = new Date(`20${year}-${month}-${day}`);
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    return Math.ceil((currentDate.getDate() + firstDayOfMonth.getDay()) / 7);
}

// Ruta para procesar el archivo y devolver un JSON agrupado por semanas dentro del mes
router.get('/getChatGroupedByMonth', (req, res) => {
    const filePath = path.resolve(__dirname, '../Chat', 'Chat.txt');

    if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: 'Archivo Chat.txt no encontrado' });
    }

    fs.readFile(filePath, 'utf-8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Error al leer el archivo' });
        }

        const lines = data.split('\n');
        const groupedByMonth = {};

        lines.forEach((line) => {
            const match = line.match(/^(\d{1,2}\/\d{1,2}\/\d{2}) (\d{2}:\d{2}) - (.+?):\s*(.*)$/);
            if (match) {
                const date = match[1];
                const time = match[2];
                const name = match[3];
                const content = match[4];

                const [day, month, year] = date.split('/').map(Number);
                const monthYear = `${month}/20${year}`; // Formato "mes/año"
                const week = getWeekOfMonth(date); // Semana del mes

                if (!groupedByMonth[monthYear]) {
                    groupedByMonth[monthYear] = { 1: [], 2: [], 3: [], 4: [] }; // Inicializar semanas
                }

                if (week <= 4) {
                    groupedByMonth[monthYear][week].push({
                        date,
                        time,
                        name,
                        content,
                    });
                }
            }
        });

        res.json(groupedByMonth);
    });
});

export default router;
