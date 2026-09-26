with open("src/app/_layout.tsx", "r") as f:
    content = f.read()

if 'import "../global.css";' not in content:
    content = 'import "../global.css";\n' + content

with open("src/app/_layout.tsx", "w") as f:
    f.write(content)

print("global.css imported")
