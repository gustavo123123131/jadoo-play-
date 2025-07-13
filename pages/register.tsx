import { useEffect } from 'react'
import { useRouter } from 'next/router'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    const verificarUsuario = async () => {
      if (typeof window === 'undefined') return;

      const id = localStorage.getItem('id_personalizado');

      if (!id) {
        router.replace('/register/index.html');
        return;
      }

      try {
        const res = await fetch(`/api/verificar-usuario?id=${id}`);
        const data = await res.json();

        if (res.ok && data.encontrado) {
          router.replace('/play/index.html'); // Página principal
        } else {
          router.replace('/register/index.html'); // Redireciona se não achar
        }
      } catch (err) {
        console.error('Erro ao verificar ID:', err);
        router.replace('/register/index.html');
      }
    };

    verificarUsuario();
  }, [router]);

  return null;
}
