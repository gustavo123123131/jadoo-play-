import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const { transactionId } = req.body;

  if (!transactionId) {
    return res.status(400).json({ error: 'ID da transação ausente.' });
  }

  // ✅ Simula o pagamento aprovado SEM chamar o PushinPay
  return res.status(200).json({ status: 'paid' });
}
