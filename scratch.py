import re

file_path = "c:/Users/supri/OneDrive/Desktop/MicroTrack/micro-nutrient-tracker/src/data/nutrients.ts"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

content = re.sub(r'regionTags:\s*string\[\];', r'regionTags: string[];\n  calories: number;', content)
content = re.sub(r'(nutrients:\s*\{)\s*calories:\s*(\d+)\s*,?\s*', r'calories: \2,\n    \1 ', content)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Done")
