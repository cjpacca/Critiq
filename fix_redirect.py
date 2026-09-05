import re

with open("src/components/RatingForm.tsx", "r") as f:
    code = f.read()

# Remove router.push('/') and add success state
code = code.replace("router.push('/');", "/* router.push('/'); quitado a peticion */")

# Instead of redirecting, maybe add a success state to the button?
# We have isSaving. We can just set it to false.
code = code.replace("router.refresh();", "router.refresh();\n      setTimeout(() => setIsSaving(false), 500);")

with open("src/components/RatingForm.tsx", "w") as f:
    f.write(code)
