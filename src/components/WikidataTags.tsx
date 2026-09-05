"use client";

import { useEffect, useState } from "react";
import { fetchWikidataMetadata } from "@/app/actions/wikidata";

export function WikidataTags({ title, type }: { title: string; type: string }) {
  const [tags, setTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const fetchedTags = await fetchWikidataMetadata(title, type);
        setTags(fetchedTags);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [title, type]);

  if (loading) {
    return (
      <div className="flex gap-2 mt-4 animate-pulse">
        <div className="h-6 w-24 bg-white/10 rounded-full"></div>
        <div className="h-6 w-32 bg-white/10 rounded-full"></div>
        <div className="h-6 w-20 bg-white/10 rounded-full"></div>
      </div>
    );
  }

  if (tags.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 mt-4">
      {tags.map((tag, i) => (
        <span 
          key={i} 
          className="px-3 py-1 bg-white/10 border border-white/20 rounded-full text-xs text-white font-medium shadow-sm backdrop-blur-sm"
        >
          {tag}
        </span>
      ))}
    </div>
  );
}
