import OpenAI from 'openai';
import dotenv from 'dotenv'
dotenv.config();

export default class openAIController {

    

    constructor() {
        this.client = new OpenAI({ apiKey: process.env.KEY_OPENAI });
    }

    async enviarPrompt(mensaje) {
        try {
            const completion = await this.client.chat.completions.create({
                messages: [{ role: 'system', content: mensaje }],
                model: 'gpt-3.5-turbo',
                temperature: 0.9,
            });

            return completion.choices[0].message.content;
        } catch (error) {
            throw new Error('Error en enviarPrompt');
        }
    }
}
