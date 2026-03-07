// Esse código vai rodar escondido no servidor da Vercel. Ninguém vê!
export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Método não permitido' });
    }

    try {
        // Ele pega a chave escondida no cofre da Vercel (process.env.GROQ_API_KEY)
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(req.body)
        });

        const data = await response.json();
        res.status(200).json(data);

    } catch (error) {
        console.error('Erro na Matrix:', error);
        res.status(500).json({ error: 'Falha no sistema central.' });
    }
}