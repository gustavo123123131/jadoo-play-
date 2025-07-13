import { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
)

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' })
  }

  const { id_personalizado, idioma, telefone, fuso_horario } = req.body

  // Atualiza dados básicos
  const { error } = await supabase
    .from('usuarios')
    .update({ telefone, idioma, fuso_horario })
    .eq('id_personalizado', id_personalizado)

  if (error) {
    return res.status(500).json({ error: 'Erro ao atualizar perfil' })
  }

  // Se a moeda selecionada for INR, multiplica o saldo
if (idioma === 'INR') {
  const { data, error: selectError } = await supabase
    .from('usuarios')
    .select('saldo')
    .eq('id_personalizado', id_personalizado)
    .single()

  if (selectError || !data) {
    return res.status(500).json({ error: 'Erro ao buscar saldo' })
  }

  const taxa = 17.24
  const novoSaldo = data.saldo * taxa

  const { error: updateSaldoError } = await supabase
    .from('usuarios')
    .update({ saldo: novoSaldo })
    .eq('id_personalizado', id_personalizado)

  if (updateSaldoError) {
    return res.status(500).json({ error: 'Erro ao atualizar saldo' })
  }
}

  return res.status(200).json({ message: 'Perfil atualizado com sucesso' })
}
