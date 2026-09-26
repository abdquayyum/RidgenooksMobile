with open("src/app/index.tsx", "r") as f:
    content = f.read()

import re

# We remove the old DetailsScreen from index.tsx
# Find const DetailsScreen = () => { and its end. Since it's huge and nested, we use a regex or string match.
start_idx = content.find("  const DetailsScreen = () => {")
end_idx = content.find("  const CheckoutOverlay = () => {")

if start_idx != -1 and end_idx != -1:
    content = content[:start_idx] + content[end_idx:]

with open("src/app/index.tsx", "w") as f:
    f.write(content)
