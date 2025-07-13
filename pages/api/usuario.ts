import { createClient } from '@supabase/supabase-js';
import { NextApiRequest, NextApiResponse } from 'next';

// Conexão com o Supabase
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const { id_personalizado } = req.body;

  if (!id_personalizado) {
    return res.status(400).json({ error: 'ID não fornecido.' });
  }

  // Busca todos os campos
  const { data, error } = await supabase
    .from('usuarios')
    .select('*')
    .eq('id_personalizado', id_personalizado)
    .single();

  if (error || !data) {
    return res.status(404).json({ error: 'Usuário não encontrado.' });
  }

  return res.status(200).json(data);
}
