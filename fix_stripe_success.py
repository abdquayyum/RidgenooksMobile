with open("src/app/property/[id].tsx", "r") as f:
    content = f.read()

old_stripe = """          Alert.alert("Success", "Payment confirmed globally! Your booking is secured.");
          // Notify backend
          fetch(`${API_URL}/api/checkout`, {
            method: 'POST',
            headers: getAuthHeader(),
            body: JSON.stringify({ property_id: p.id, amount: total, currency: currencySymbol, ref: 'pi_' + Date.now() })
          });
          setShowCheckout(false);"""

new_stripe = """          Alert.alert("Success", "Payment confirmed globally! Your booking is secured.");
          await logTransaction('pi_' + Date.now(), total, 'stripe');
          setShowCheckout(false);"""

content = content.replace(old_stripe, new_stripe)

with open("src/app/property/[id].tsx", "w") as f:
    f.write(content)
print("Stripe onSuccess fixed!")
