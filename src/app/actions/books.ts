"use server";

export async function searchBooks(query: string) {
  if (!query) return [];
  
  // Usamos OpenLibrary API porque Google Books tiene límites restrictivos de cuota (429 Too Many Requests)
  const res = await fetch(`https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=12`);
  if (!res.ok) throw new Error("Failed to search Books");
  const data = await res.json();
  
  if (!data.docs) return [];

  return data.docs.map((item: any) => ({
    id: item.key.replace('/works/', ''),
    title: item.title,
    author: item.author_name?.[0] || "Desconocido",
    poster: item.cover_i ? `https://covers.openlibrary.org/b/id/${item.cover_i}-L.jpg` : null,
    year: item.first_publish_year ? item.first_publish_year.toString() : "Unknown",
  }));
}

export async function getBookDetails(id: string) {
  const res = await fetch(`https://openlibrary.org/works/${id}.json`);
  if (!res.ok) throw new Error("Failed to fetch Book details");
  const data = await res.json();
  
  let author = "Autor desconocido";
  if (data.authors && data.authors.length > 0) {
    try {
      const authorRes = await fetch(`https://openlibrary.org${data.authors[0].author.key}.json`);
      if (authorRes.ok) {
        const authorData = await authorRes.json();
        author = authorData.name;
      }
    } catch (e) {
      console.error("No se pudo obtener el autor", e);
    }
  }

  let description = "";
  if (data.description) {
    description = typeof data.description === 'string' ? data.description : data.description.value || "";
  }

  return {
    id,
    title: data.title,
    author,
    description,
    posterUrl: data.covers && data.covers.length > 0 ? `https://covers.openlibrary.org/b/id/${data.covers[0]}-L.jpg` : "",
    raw_metadata: data ? JSON.stringify(data) : null
  };
}
