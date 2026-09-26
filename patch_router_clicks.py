with open("src/app/index.tsx", "r") as f:
    content = f.read()

# Replace the click in HomeScreen
old_click = "setSelectedProperty(p); setCurrentScreen('details');"
new_click = "setSelectedProperty(p); router.push('/property/' + p.id);"

content = content.replace(old_click, new_click)

with open("src/app/index.tsx", "w") as f:
    f.write(content)
