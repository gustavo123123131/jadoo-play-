// pages/api/adicionar-saldo.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método não permitido' });

  const { id_personalizado, valorCentavos } = req.body;

  if (!id_personalizado || typeof valorCentavos !== 'number') {
    return res.status(400).json({ error: 'Dados inválidos.' });
  }

  const { data, error } = await supabase
    .from('usuarios')
    .select('saldo')
    .eq('id_personalizado', id_personalizado)
    .single();

  if (error || !data) return res.status(404).json({ error: 'Usuário não encontrado' });

  const novoSaldo = (data.saldo || 0) + valorCentavos / 100;

  const { error: erroAtualizacao } = await supabase
    .from('usuarios')
    .update({ saldo: novoSaldo })
    .eq('id_personalizado', id_personalizado);

  if (erroAtualizacao) return res.status(500).json({ error: 'Erro ao atualizar saldo' });

  return res.status(200).json({ sucesso: true });
}
