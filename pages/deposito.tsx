import { useEffect } from 'react'
import { useRouter } from 'next/router'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    const verificarUsuario = async () => {
      if (typeof window === 'undefined') return;

      const id = localStorage.getItem('id_personalizado');
      if (!id) {
        router.replace('/login/index.html');
        return;
      }

      try {
        const res = await fetch(`/api/verificar-usuario?id=${id}`);
        const data = await res.json();

        if (res.ok && data.encontrado) {
          // 🔁 Preserva query string da URL original (ex: ?valor=5000)
          const query = window.location.search || '';
          router.replace(`/deposito/index.html${query}`);
        } else {
          router.replace('/login/index.html');
        }
      } catch (err) {
        console.error('Erro ao verificar ID:', err);
        router.replace('/login/index.html');
      }
    };

    verificarUsuario();
  }, [router]);

  return null;
}
