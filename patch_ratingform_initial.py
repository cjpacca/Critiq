import re

with open("src/components/RatingForm.tsx", "r") as f:
    code = f.read()

# 1. Update signature
old_sig = "export function RatingForm({ type, mediaId, mediaData }: { type: 'movie'|'tv'|'track'|'book'|'game', mediaId: string, mediaData: any }) {"
new_sig = "export function RatingForm({ type, mediaId, mediaData, initialData }: { type: 'movie'|'tv'|'track'|'book'|'game', mediaId: string, mediaData: any, initialData?: any }) {"
code = code.replace(old_sig, new_sig)

# 2. Update scores state
old_scores = """  const [scores, setScores] = useState<Record<string, number>>(
    categories.reduce((acc, cat) => ({ ...acc, [cat.id]: Math.floor(cat.max / 2) }), {})
  );"""
new_scores = """  const [scores, setScores] = useState<Record<string, number>>(() => {
    if (initialData) {
      return categories.reduce((acc, cat) => ({ ...acc, [cat.id]: initialData[cat.id] ?? Math.floor(cat.max / 2) }), {});
    }
    return categories.reduce((acc, cat) => ({ ...acc, [cat.id]: Math.floor(cat.max / 2) }), {});
  });"""
code = code.replace(old_scores, new_scores)

# 3. Update extendedStats state
old_extended = """  const [extendedStats, setExtendedStats] = useState<any>({
    status: "Completado",
    startDate: "",
    endDate: "",
    replayCount: 0,
    bingeDays: "",
    viewingMedium: "",
    dropPoint: "",
    companions: "",
    playtimeHours: "",
    completionTier: "",
    platform: "",
    totalPages: "",
    bookFormat: "",
    language: "",
    playCount: "",
    valence: ""
  });"""

new_extended = """  const [extendedStats, setExtendedStats] = useState<any>(() => {
    const defaults = {
      status: "Completado", startDate: "", endDate: "", replayCount: 0, bingeDays: "", viewingMedium: "", dropPoint: "", companions: "", playtimeHours: "", completionTier: "", platform: "", totalPages: "", bookFormat: "", language: "", playCount: "", valence: "", playDays: ""
    };
    if (initialData) {
      return {
        ...defaults,
        status: initialData.status || defaults.status,
        startDate: initialData.startDate ? new Date(initialData.startDate).toISOString().split('T')[0] : "",
        endDate: initialData.endDate ? new Date(initialData.endDate).toISOString().split('T')[0] : "",
        replayCount: initialData.replayCount || 0,
        bingeDays: initialData.bingeDays || "",
        viewingMedium: initialData.viewingMedium || "",
        dropPoint: initialData.dropPoint || "",
        companions: initialData.companions || "",
        playtimeHours: initialData.playtimeHours || "",
        completionTier: initialData.completionTier || "",
        platform: initialData.platform || "",
        totalPages: initialData.totalPages || "",
        bookFormat: initialData.bookFormat || "",
        language: initialData.language || "",
        playCount: initialData.playCount || "",
        valence: initialData.valence || "",
        playDays: initialData.playDays || ""
      };
    }
    return defaults;
  });"""

code = code.replace(old_extended, new_extended)

with open("src/components/RatingForm.tsx", "w") as f:
    f.write(code)
