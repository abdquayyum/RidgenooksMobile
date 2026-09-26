with open("src/app/settings.tsx", "r") as f:
    content = f.read()

content = content.replace(
    "const { userSettings, handleUpdateSettings, detectLocation, currencySymbol, setCurrencySymbol, setPaymentGateway } = useGlobalState();",
    "const { userSettings, setUserSettings, detectLocation, currencySymbol, setCurrencySymbol, setPaymentGateway } = useGlobalState();\n  const handleUpdateSettings = (key, val) => setUserSettings({ ...userSettings, [key]: val });"
)

with open("src/app/settings.tsx", "w") as f:
    f.write(content)

print("Settings patched!")
