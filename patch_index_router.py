with open("src/app/index.tsx", "r") as f:
    content = f.read()

import re

# Remove AppWrapper
old_wrapper = """export default function AppWrapper() {
  return (
    <GlobalStateProvider>
      <PaystackProvider publicKey="pk_test_314dccd680068de3e230b7714972b3637607fbfb">
        <App />
      </PaystackProvider>
    </GlobalStateProvider>
  );
}"""
content = content.replace(old_wrapper, "")

# Make App default export
content = content.replace("function App() {", "export default function App() {")

# Add useRouter import
if "import { useRouter }" not in content:
    content = content.replace("import React,", "import { useRouter } from 'expo-router';\nimport React,")

with open("src/app/index.tsx", "w") as f:
    f.write(content)
