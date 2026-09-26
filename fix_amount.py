with open("src/app/property/[id].tsx", "r") as f:
    content = f.read()

# Fix the amount being passed to Paystack popup
old_code = "amount: (getRawPrice(p.price) * checkoutNights + (currencySymbol === \"$\" ? 25 : 25000)) * 100,"
new_code = "amount: (getRawPrice(p.price) * checkoutNights + (currencySymbol === \"$\" ? 25 : 25000)),"
content = content.replace(old_code, new_code)

with open("src/app/property/[id].tsx", "w") as f:
    f.write(content)
print("Amount fixed!")
