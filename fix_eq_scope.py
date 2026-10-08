with open("src/components/AlbumGraphUI.tsx", "r") as f:
    code = f.read()

# I will find CustomEQBar inside CustomDot and move it out.
import re
pattern = r'(    const CustomEQBar = \(props: any\) => \{.*?\n    return <g>\{boxes\}<\/g>;\n  \};\n\n  )return \('
match = re.search(pattern, code, flags=re.DOTALL)
if match:
    eq_code = match.group(1)
    code = code[:match.start()] + 'return (' + code[match.end():]
    
    # Insert eq_code before 'return (' of AlbumGraphUI
    # Let's anchor on 'const ratedScores = Object.values(ratings);'
    target = '  const ratedScores = Object.values(ratings);'
    code = code.replace(target, eq_code + "\n" + target)

with open("src/components/AlbumGraphUI.tsx", "w") as f:
    f.write(code)

