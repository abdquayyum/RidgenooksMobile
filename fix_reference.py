with open("src/app/property/[id].tsx", "r") as f:
    content = f.read()

# Replace res.transactionRef.reference with res.reference
content = content.replace("res.transactionRef.reference", "res.reference")

with open("src/app/property/[id].tsx", "w") as f:
    f.write(content)
print("Paystack reference fixed!")
