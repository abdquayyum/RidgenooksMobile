import re

with open("src/app/property/[id].tsx", "r") as f:
    content = f.read()

# Replace usePaystack import with Paystack component
content = content.replace("import { usePaystack } from 'react-native-paystack-webview';", "import { Paystack } from 'react-native-paystack-webview';")

# Add ref
if "const paystackWebViewRef =" not in content:
    content = content.replace("const router = useRouter();", "const router = useRouter();\n  const paystackWebViewRef = React.useRef();")

# Remove usePaystack()
content = content.replace("const { popup } = usePaystack();\n", "")

# Update handleCheckoutClick
old_handle = """    if (paymentGateway === 'paystack') {
      Alert.alert("Paystack", "Paystack checkout flow initiated.");
    } else {"""
new_handle = """    if (paymentGateway === 'paystack') {
      if (paystackWebViewRef.current) {
        paystackWebViewRef.current.startTransaction();
      }
    } else {"""
content = content.replace(old_handle, new_handle)

# Inject the Paystack component at the end of the return statement, before the last </View>
# Let's find the main wrapper
old_return_end = "      </ScrollView>\n    </View>\n  );\n}"
new_return_end = """      </ScrollView>
      <Paystack
        paystackKey="pk_test_e3e9d8e578c7407d5c95a5fbc40d4f58c7e0c451"
        billingEmail={currentUser?.email || "guest@ridgenooks.com"}
        amount={getRawPrice(p.price) * checkoutNights * checkoutGuests}
        currency={currencySymbol === '₦' ? 'NGN' : 'USD'}
        onCancel={(e) => {
          Alert.alert("Cancelled", "Payment was cancelled.");
        }}
        onSuccess={async (res) => {
          // Verify with backend
          try {
            const result = await fetch(`${API_URL}/api/transactions/verify`, {
              method: 'POST',
              headers: getAuthHeader(),
              body: JSON.stringify({ reference: res.data.transactionRef.reference, property_id: p.id, amount: getRawPrice(p.price) * checkoutNights * checkoutGuests })
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
        }}
        ref={paystackWebViewRef}
      />
    </View>
  );
}"""

if "paystackKey=" not in content:
    content = content.replace(old_return_end, new_return_end)

with open("src/app/property/[id].tsx", "w") as f:
    f.write(content)
print("Paystack restored!")
