import { createClient } from '@supabase/supabase-js'
import { NextApiRequest, NextApiResponse } from 'next'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
)

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'ID inválido' })
  }

  const { data, error } = await supabase
    .from('usuarios')
    .select('id_usuario')
    .eq('id_personalizado', id)
    .single()

  if (error || !data) {
    return res.status(200).json({ encontrado: false })
  }

  return res.status(200).json({ encontrado: true })
}
