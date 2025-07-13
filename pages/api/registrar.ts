import { createClient } from '@supabase/supabase-js';
import { NextApiRequest, NextApiResponse } from 'next';

// Conexão com o Supabase
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

// Gera ID aleatório de 4 caracteres
function gerarIdPersonalizado() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  return Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const { nome, email, senha, idioma, fuso_horario } = req.body;

  if (!nome || !email || !senha) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
  }

  // Verifica se o email já existe
  const { data: usuarioExistente, error: erroBusca } = await supabase
    .from('usuarios')
    .select('id_usuario') // <- campo correto conforme sua tabela
    .eq('email', email)
    .maybeSingle();

  if (erroBusca) {
    console.error('Erro ao buscar email existente:', erroBusca);
    return res.status(500).json({ error: 'Erro ao verificar email existente.' });
  }

  if (usuarioExistente) {
    return res.status(409).json({ error: 'Este email já está cadastrado.' });
  }

  const idPersonalizado = gerarIdPersonalizado();

  // Inserção na tabela 'usuarios'
  const { error } = await supabase.from('usuarios').insert([
    {
      nome,
      email,
      senha,
      id_personalizado: idPersonalizado,
      idioma,
      fuso_horario
    }
  ]);

  if (error) {
    console.error('Erro ao inserir usuário:', error);
    return res.status(500).json({ error: error.message });
  }

  return res.status(200).json({
    message: 'Usuário registrado com sucesso.',
    id_personalizado: idPersonalizado
  });
}
