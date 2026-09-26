with open("src/app/property/[id].tsx", "r") as f:
    content = f.read()

# Remove the duplicated const p line
content = content.replace("const p = properties.find(prop => prop.id.toString() === id);\n", "")

with open("src/app/property/[id].tsx", "w") as f:
    f.write(content)
print("Syntax error fixed!")
