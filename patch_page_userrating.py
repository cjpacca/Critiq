import re

with open("src/app/rate/[type]/[id]/page.tsx", "r") as f:
    code = f.read()

# 1. Update import
old_import = 'import { getCommunityStatsDetailed } from "@/app/actions/ratings";'
new_import = 'import { getCommunityStatsDetailed, getUserRating } from "@/app/actions/ratings";'
code = code.replace(old_import, new_import)

# 2. Add fetch logic before rendering
old_fetch_stats = 'const communityStats = await getCommunityStatsDetailed(type, id);'
new_fetch_stats = 'const communityStats = await getCommunityStatsDetailed(type, id);\n  const userRating = await getUserRating(type, id);'
code = code.replace(old_fetch_stats, new_fetch_stats)

# 3. Pass prop to RatingForm
old_rating_form = '<RatingForm type={type as any} mediaId={id} mediaData={media} />'
new_rating_form = '<RatingForm type={type as any} mediaId={id} mediaData={media} initialData={userRating} />'
code = code.replace(old_rating_form, new_rating_form)

with open("src/app/rate/[type]/[id]/page.tsx", "w") as f:
    f.write(code)
