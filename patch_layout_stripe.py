with open("src/app/_layout.tsx", "r") as f:
    content = f.read()

import_str = 'import { StripeProvider } from "@stripe/stripe-react-native";\n'

if "StripeProvider" not in content:
    content = content.replace('import { PaystackProvider', import_str + 'import { PaystackProvider')
    content = content.replace('<Stack screenOptions={{ headerShown: false }} />', 
        '<StripeProvider publishableKey={process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY || "pk_test_your_key_here"}>\n            <Stack screenOptions={{ headerShown: false }} />\n          </StripeProvider>')

with open("src/app/_layout.tsx", "w") as f:
    f.write(content)
print("Layout patched for StripeProvider!")
