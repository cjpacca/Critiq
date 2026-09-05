import re

with open("src/components/RatingForm.tsx", "r") as f:
    code = f.read()

states_code = """
  const [extendedStats, setExtendedStats] = useState<any>({
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
    difficulty: "",
    achievementsPct: "",
    playCount: "",
    bpm: "",
    valence: "",
    discoveryMonth: "",
    totalPages: "",
    pagesPerDay: "",
    bookFormat: "",
    language: ""
  });
  const [showExtended, setShowExtended] = useState(false);
"""

code = re.sub(r'(const \[isSaving, setIsSaving\] = useState\(false\);)', r'\1\n' + states_code, code)

with open("src/components/RatingForm.tsx", "w") as f:
    f.write(code)
