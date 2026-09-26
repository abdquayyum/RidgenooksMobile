with open("src/app/index.tsx", "r") as f:
    content = f.read()

start_idx = content.find("  const ChatScreen = () => {")
end_idx = content.find("  const ExploreScreen = () => {")

if start_idx != -1 and end_idx != -1:
    content = content[:start_idx] + content[end_idx:]

with open("src/app/index.tsx", "w") as f:
    f.write(content)
