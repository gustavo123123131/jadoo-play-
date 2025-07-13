// pages/api/depositar.ts
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const { valorCentavos } = req.body;

  if (!valorCentavos || valorCentavos < 50) {
    return res.status(400).json({ error: 'Valor mínimo de depósito é R$ 0,50' });
  }

  try {
    const resposta = await fetch('https://api.pushinpay.com.br/api/pix/cashIn', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.PUSHINPAY_TOKEN}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        value: valorCentavos,
        webhook_url: 'https://SEU-SITE.com/api/webhook-pushinpay' // opcional
      })
    });

    const json = await resposta.json();

    if (!resposta.ok) {
      return res.status(resposta.status).json({ error: json.message || 'Erro ao gerar QR Code' });
    }

    return res.status(200).json(json);
  } catch (erro) {
    console.error('Erro ao criar PIX:', erro);
    return res.status(500).json({ error: 'Erro interno ao criar Pix' });
  }
}
