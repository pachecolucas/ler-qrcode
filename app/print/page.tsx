"use client";

import QRCode from "react-qr-code";
import { v4 as uuid } from "uuid";

const TOTAL_CARTOES = 24;

const cartoes = Array.from({ length: TOTAL_CARTOES }).map(() => {
  const id = uuid();

  return {
    id,
    url: `http://meuleitordecartao.vercel.app/${id}`,
  };
});

export default function Index() {
  return (
    <div className="flex justify-center bg-zinc-200 p-10 print:bg-white print:p-0">
      <div className="grid w-[210mm] grid-cols-4 gap-4 bg-white p-6 print:gap-2 print:p-4">
        {cartoes.map((cartao, index) => (
          <div key={cartao.id} className="flex h-[85mm] flex-col items-center justify-between rounded-2xl border border-zinc-300 p-4 print:rounded-none">
            <div className="text-center">
              <h2 className="text-lg font-bold">Cartão #{index + 1}</h2>

              <p className="mt-1 text-xs text-zinc-500">Escaneie o QR Code</p>
            </div>

            <div className="rounded-xl bg-white p-2">
              <QRCode value={cartao.url} size={140} />
            </div>

            <div className="w-full break-all text-center text-[10px] text-zinc-500">{cartao.id}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
