"use client";

import { useRef, useState } from "react";

import { useQRCodeReader } from "@/app/hooks/useQRCodeReader";

type Pessoa = {
  id: number;
  nome: string;
  codigo: string;
};

export default function Index() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const isProcessingRef = useRef(false);

  const [mensagem, setMensagem] = useState("");
  const [mostrarMensagem, setMostrarMensagem] = useState(false);

  useQRCodeReader({
    videoRef,
    canvasRef,

    async onRead(value) {
      if (isProcessingRef.current) return;

      isProcessingRef.current = true;

      const pessoaEncontrada = await buscaCadastro(value);

      if (pessoaEncontrada) {
        setMensagem(`Cadastro encontrado: ${pessoaEncontrada.nome}`);
        setMostrarMensagem(true);

        await esperar(3000);

        setMostrarMensagem(false);
      }

      isProcessingRef.current = false;
    },
  });

  return (
    <div className="relative">
      <div>
        <video ref={videoRef} className="aspect-video w-full object-cover" muted playsInline />

        <canvas ref={canvasRef} className="hidden" />
      </div>

      {mostrarMensagem && (
        <div className="absolute inset-x-0 top-6 flex justify-center">
          <div className="rounded-2xl bg-emerald-500 px-6 py-4 text-lg font-semibold text-white shadow-2xl">{mensagem}</div>
        </div>
      )}
    </div>
  );
}

async function buscaCadastro(codigo: string): Promise<Pessoa | undefined> {
  console.log("buscaCadastro", codigo);

  await esperar(1000);

  const pessoaEncontrada = PESSOAS.find((p) => p.codigo === codigo);

  console.log("pessoaEncontrada", pessoaEncontrada);

  return pessoaEncontrada;
}

function esperar(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

const PESSOAS: Pessoa[] = [
  {
    id: 1,
    nome: "João",
    codigo: "https://cartao.eliti.org/7b0ab107-a90c-4293-9f8c-fb08af9ab93c",
  },

  {
    id: 2,
    nome: "Maria",
    codigo: "https://cartao.eliti.org/7a4b1a51-1eb0-43dd-9ec3-2577f5db352d",
  },
];
