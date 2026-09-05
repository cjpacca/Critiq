"use server";

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

export async function searchMedia(query: string, type: 'movie' | 'tv' | 'multi' = 'multi') {
  if (!query) return [];
  
  const res = await fetch(
    `${BASE_URL}/search/${type}?api_key=${TMDB_API_KEY}&language=es-ES&query=${encodeURIComponent(query)}&page=1`,
    { next: { revalidate: 3600 } }
  );

  if (!res.ok) throw new Error("Failed to fetch from TMDB");
  
  const data = await res.json();
  
  // Solo devolvemos los resultados que tienen póster para mantener un diseño UI "Premium"
  return data.results.filter((item: any) => item.poster_path);
}

export async function getMediaDetails(id: string, type: 'movie' | 'tv') {
  const res = await fetch(
    `${BASE_URL}/${type}/${id}?api_key=${TMDB_API_KEY}&language=es-ES&append_to_response=credits`
  );
  if (!res.ok) throw new Error("Failed to fetch details");
  return await res.json();
}

export async function getTvSeasonDetails(id: string, seasonNumber: number) {
  const res = await fetch(
    `${BASE_URL}/tv/${id}/season/${seasonNumber}?api_key=${TMDB_API_KEY}&language=es-ES`
  );
  if (!res.ok) throw new Error("Failed to fetch season details");
  return await res.json();
}
