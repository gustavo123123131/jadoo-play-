import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const { transactionId } = req.body;

  if (!transactionId) {
    return res.status(400).json({ error: 'ID da transação ausente.' });
  }

  try {
    const response = await fetch(`https://api.pushinpay.com.br/api/transactions/${transactionId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${process.env.PUSHINPAY_TOKEN}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Erro da PushinPay:', errorText);
      return res.status(response.status).json({ error: 'Erro ao consultar status do PIX.' });
    }

    const data = await response.json();

    // Exemplo de resposta: { status: 'paid', ... }
    res.status(200).json({ status: data.status });
  } catch (erro: any) {
    console.error('Erro ao verificar transação PIX:', erro);
    res.status(500).json({ error: 'Erro interno ao verificar pagamento.' });
  }
}
