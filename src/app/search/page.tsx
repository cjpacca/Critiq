import { SearchUI } from "@/components/SearchUI";

export default function SearchPage() {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="mb-8 mt-4">
        <h1 className="text-4xl font-extrabold text-white mb-2 tracking-tight">Buscar Medios</h1>
        <p className="text-neutral-400 text-lg">Encuentra películas y series usando la base de datos global.</p>
      </header>
      
      <SearchUI />
    </div>
  );
}
