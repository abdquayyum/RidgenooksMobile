with open("src/app/property/[id].tsx", "r") as f:
    content = f.read()

content = content.replace("popup({", "popup.checkout({")

with open("src/app/property/[id].tsx", "w") as f:
    f.write(content)
