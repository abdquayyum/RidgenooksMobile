import os
import glob

def replace_in_file(filepath):
    with open(filepath, "r") as f:
        content = f.read()
    
    if "useRouter" in content:
        # Replace import
        content = content.replace("import { useRouter } from 'expo-router';", "import { router } from 'expo-router';")
        content = content.replace('import { useRouter } from "expo-router";', 'import { router } from "expo-router";')
        
        # Remove hook call
        content = content.replace("const router = useRouter();\n", "")
        content = content.replace("  const router = useRouter();\n", "")
        content = content.replace("    const router = useRouter();\n", "")
        
        with open(filepath, "w") as f:
            f.write(content)
        print(f"Fixed {filepath}")

# Find all TSX files
for root, dirs, files in os.walk("src"):
    for file in files:
        if file.endswith(".tsx"):
            replace_in_file(os.path.join(root, file))
