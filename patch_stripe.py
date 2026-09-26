with open("src/app/index.tsx", "r") as f:
    content = f.read()

start = content.find("  const StripeSimulator = () => {")
end = content.find("  const TransactionDetailsModal = () => {")

if start != -1 and end != -1:
    stripe_block = content[start:end]
    content = content[:start] + content[end:]
    
    with open("src/app/index.tsx", "w") as f:
        f.write(content.replace("{showStripeSim && <StripeSimulator />}", ""))
        
    with open("src/app/property/[id].tsx", "r") as f2:
        prop_content = f2.read()
        
    # Inject StripeSimulator inside PropertyDetailsScreen
    prop_start = prop_content.find("  const renderCalendar = () => {")
    prop_content = prop_content[:prop_start] + stripe_block + "\n" + prop_content[prop_start:]
    
    # Render it
    prop_content = prop_content.replace("</Modal>\n    </View>", "</Modal>\n      {showStripeSim && <StripeSimulator />}\n    </View>")
    
    with open("src/app/property/[id].tsx", "w") as f2:
        f2.write(prop_content)
