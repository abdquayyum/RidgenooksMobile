with open("src/app/property/[id].tsx", "r") as f:
    content = f.read()

old_on_success = """        onSuccess: async (res) => {
          try {
            const result = await fetch(`${API_URL}/api/transactions/verify`, {
              method: 'POST',
              headers: getAuthHeader(),
              body: JSON.stringify({ reference: res.reference, property_id: p.id, amount: getRawPrice(p.price) * checkoutNights + (currencySymbol === "$" ? 25 : 25000) })
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
        },"""

new_on_success = """        onSuccess: async (res) => {
          Alert.alert("Success", "Your booking was successful!");
          await logTransaction(res.reference, (getRawPrice(p.price) * checkoutNights + (currencySymbol === "$" ? 25 : 25000)), 'paystack');
        },"""

content = content.replace(old_on_success, new_on_success)

# Change router.push('/') to router.push('/transactions') in logTransaction
content = content.replace("await fetch(`${API_URL}/api/transactions`, { method: 'POST', headers: getAuthHeader(), body: JSON.stringify(payload) });\n      router.push('/');", "await fetch(`${API_URL}/api/transactions`, { method: 'POST', headers: getAuthHeader(), body: JSON.stringify(payload) });\n      router.push('/transactions');")


with open("src/app/property/[id].tsx", "w") as f:
    f.write(content)
print("Paystack onSuccess fixed!")
