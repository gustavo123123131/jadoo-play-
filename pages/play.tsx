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
          router.replace('/play/index.html');
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

  // Renderiza algo visível temporariamente
  return (
    <div className="w-screen h-screen bg-[#0B0F19]">
      {/* Pode adicionar um loading aqui, se quiser */}
    </div>
  )
}
