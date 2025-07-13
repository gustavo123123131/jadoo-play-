import { createClient } from '@supabase/supabase-js';
import { NextApiRequest, NextApiResponse } from 'next';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ error: 'Email e senha são obrigatórios.' });
  }

  const { data, error } = await supabase
    .from('usuarios')
    .select('id_personalizado')
    .eq('email', email)
    .eq('senha', senha)
    .single(); // espera apenas um resultado

  if (error || !data) {
    return res.status(401).json({ error: 'Email ou senha incorretos.' });
  }

  return res.status(200).json({ id_personalizado: data.id_personalizado });
}
