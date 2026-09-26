with open("src/app/property/[id].tsx", "r") as f:
    content = f.read()

old_fetch = """        const response = await fetch(`${API_URL}/api/create-payment-intent`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ amount: Math.round(total * 100), currency: currencySymbol === '$' ? 'usd' : 'ngn' })
        });"""

new_fetch = """        const response = await fetch(`${API_URL}/api/create-payment-intent`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            amount: Math.round(total * 100), 
            currency: currencySymbol === '$' ? 'usd' : 'ngn',
            property_id: p.id,
            nights: checkoutNights
          })
        });"""

content = content.replace(old_fetch, new_fetch)

with open("src/app/property/[id].tsx", "w") as f:
    f.write(content)
print("Stripe frontend req fixed!")
