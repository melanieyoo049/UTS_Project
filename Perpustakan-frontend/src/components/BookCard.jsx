import { useState } from 'react';
import { Book, CheckCircle, AlertCircle } from 'lucide-react';

export default function BookCard({ book, onBorrow, isBorrowing }) {
  const isAvailable = book.stock > 0;

  return (
    <article className="group bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 rounded-xl overflow-hidden flex flex-col transition duration-150 shadow-sm hover:shadow-md">
      <div className="relative aspect-[4/3] bg-slate-900 overflow-hidden">
        {book.cover_url ? (
          <img
            src={book.cover_url}
            alt={book.title}
            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-600">
            <Book className="w-12 h-12 stroke-[1.5]" />
          </div>
        )}
        <div className="absolute top-2.5 right-2.5">
          <span
            className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full border ${
              isAvailable
                ? 'bg-emerald-950/80 border-emerald-500/30 text-emerald-300'
                : 'bg-rose-950/80 border-rose-500/30 text-rose-300'
            }`}
          >
            {isAvailable ? `Tersedia: ${book.stock}` : 'Stok Habis'}
          </span>
        </div>
      </div>

      <div className="p-4 flex flex-col flex-1">
        <span className="text-[11px] font-medium tracking-wide uppercase text-slate-400 mb-1">
          {book.category}
        </span>
        <h3 className="text-base font-semibold text-white group-hover:text-emerald-400 line-clamp-1 transition duration-150 mb-1">
          {book.title}
        </h3>
        <p className="text-xs text-slate-400 mb-2">Penulis: {book.author}</p>
        <p className="text-xs text-slate-300 line-clamp-2 mb-4 flex-1">
          {book.description || 'Tidak ada deskripsi singkat.'}
        </p>

        <button
          onClick={() => onBorrow(book)}
          disabled={!isAvailable || isBorrowing}
          className={`w-full py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition duration-150 active:scale-[0.96] ${
            isAvailable
              ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-sm'
              : 'bg-slate-700/50 text-slate-500 cursor-not-allowed'
          }`}
        >
          {isAvailable ? 'Pinjam Buku' : 'Tidak Dapat Dipinjam'}
        </button>
      </div>
    </article>
  );
}
