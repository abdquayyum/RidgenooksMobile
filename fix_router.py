with open("src/app/settings.tsx", "r") as f:
    content = f.read()

content = content.replace("import { useRouter } from 'expo-router';", "import { router } from 'expo-router';")
content = content.replace("  const router = useRouter();\n", "")

with open("src/app/settings.tsx", "w") as f:
    f.write(content)
print("router fixed!")
