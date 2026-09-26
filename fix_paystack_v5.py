with open("src/app/property/[id].tsx", "r") as f:
    content = f.read()

# 1. Fix the import
content = content.replace("import { Paystack } from 'react-native-paystack-webview';", "import { usePaystack } from 'react-native-paystack-webview';")

# 2. Re-add usePaystack and remove ref
old_ref = "  const paystackWebViewRef = React.useRef();"
new_hook = "  const paystackWebViewRef = React.useRef();\n  const { popup } = usePaystack();"
content = content.replace(old_ref, new_hook)

# 3. Update handleCheckoutClick to use popup()
old_handle = """    if (paymentGateway === 'paystack') {
      if (paystackWebViewRef.current) {
        paystackWebViewRef.current.startTransaction();
      }
    } else {"""

new_handle = """    if (paymentGateway === 'paystack') {
      popup({
        amount: getRawPrice(p.price) * checkoutNights * 1,
        billingEmail: currentUser?.email || "guest@ridgenooks.com",
        currency: currencySymbol === '₦' ? 'NGN' : 'USD',
        onSuccess: async (res) => {
          try {
            const result = await fetch(`${API_URL}/api/transactions/verify`, {
              method: 'POST',
              headers: getAuthHeader(),
              body: JSON.stringify({ reference: res.transactionRef.reference, property_id: p.id, amount: getRawPrice(p.price) * checkoutNights * 1 })
            });
            if (result.ok) {
              Alert.alert("Success", "Your booking was successful!");
              router.push('/transactions');
            } else {
              Alert.alert("Error", "Payment verification failed.");
            }
          } catch(err) {
             Alert.alert("Error", "Failed to verify transaction.");
          }
        },
        onCancel: () => {
          Alert.alert("Cancelled", "Payment was cancelled.");
        }
      });
    } else {"""
content = content.replace(old_handle, new_handle)

# 4. Remove the injected <Paystack /> component
import re
content = re.sub(r'<Paystack\s+paystackKey.*?ref=\{paystackWebViewRef\}\s+/>', '', content, flags=re.DOTALL)

with open("src/app/property/[id].tsx", "w") as f:
    f.write(content)
print("Paystack v5 patched!")
