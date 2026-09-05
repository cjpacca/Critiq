"use server";

const P_CODES = {
  all: ["P136", "P577"],
  movie: ["P364", "P57", "P58", "P161"],
  track: ["P361"],
  book: ["P50"],
  tv: ["P170", "P580", "P582"],
  game: ["P400", "P2284"],
  album: ["P175"]
};

export async function fetchWikidataMetadata(title: string, type: string) {
  try {
    // 1. Search for the entity
    const searchRes = await fetch(`https://www.wikidata.org/w/api.php?action=wbsearchentities&search=${encodeURIComponent(title)}&language=es&format=json`);
    const searchData = await searchRes.json();
    if (!searchData.search || searchData.search.length === 0) return [];
    
    // Simple heuristic: just take the first result for now
    const entityId = searchData.search[0].id;

    // 2. Fetch the entity claims
    const entityRes = await fetch(`https://www.wikidata.org/w/api.php?action=wbgetentities&ids=${entityId}&format=json&props=claims`);
    const entityData = await entityRes.json();
    const claims = entityData.entities[entityId].claims;

    // 3. Determine which P codes to extract
    const requestedCodes = [...P_CODES.all, ...(P_CODES[type as keyof typeof P_CODES] || [])];
    
    const results: { pCode: string; rawValues: any[] }[] = [];
    const qIdsToFetch = new Set<string>();
    
    for (const pCode of requestedCodes) {
      if (claims[pCode]) {
        const rawValues = claims[pCode].slice(0, 3).map((claim: any) => {
          const datavalue = claim.mainsnak?.datavalue;
          if (!datavalue) return null;
          if (datavalue.type === "wikibase-entityid") {
            qIdsToFetch.add(datavalue.value.id);
            return { type: "entity", id: datavalue.value.id };
          }
          if (datavalue.type === "time") {
            return { type: "time", value: datavalue.value.time };
          }
          if (datavalue.type === "string") {
            return { type: "string", value: datavalue.value };
          }
          return null;
        }).filter(Boolean);
        
        if (rawValues.length > 0) {
          results.push({ pCode, rawValues });
          qIdsToFetch.add(pCode); // We also need the label for the property itself
        }
      }
    }

    if (results.length === 0) return [];

    // 4. Fetch labels for all collected Q and P IDs
    const idsArray = Array.from(qIdsToFetch);
    const labelsMap: Record<string, string> = {};
    
    // Wikidata allows max 50 ids per request, we'll just chunk safely
    for (let i = 0; i < idsArray.length; i += 50) {
      const chunk = idsArray.slice(i, i + 50).join("|");
      const labelsRes = await fetch(`https://www.wikidata.org/w/api.php?action=wbgetentities&ids=${chunk}&format=json&props=labels`);
      const labelsData = await labelsRes.json();
      for (const id in labelsData.entities) {
        labelsMap[id] = labelsData.entities[id].labels?.es?.value || labelsData.entities[id].labels?.en?.value || id;
      }
    }

    // 5. Format output
    const formattedTags: string[] = [];
    
    for (const res of results) {
      const propertyName = labelsMap[res.pCode] || res.pCode;
      
      const valuesStr = res.rawValues.map(v => {
        if (v.type === "entity") return labelsMap[v.id] || v.id;
        if (v.type === "time") {
          // Parse wikidata time e.g. "+2015-03-24T00:00:00Z"
          const match = v.value.match(/\+?(-?\d{4}-\d{2}-\d{2})/);
          return match ? match[1] : v.value;
        }
        return v.value;
      }).join(", ");
      
      // Capitalize first letter of property name
      const capProp = propertyName.charAt(0).toUpperCase() + propertyName.slice(1);
      formattedTags.push(`${capProp}: ${valuesStr}`);
    }

    return formattedTags;
  } catch (error) {
    console.error("Wikidata fetch error:", error);
    return [];
  }
}
