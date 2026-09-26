with open("src/app/property/[id].tsx", "r") as f:
    content = f.read()

content = content.replace("billingEmail: currentUser?.email ||", "email: currentUser?.email ||")

with open("src/app/property/[id].tsx", "w") as f:
    f.write(content)
print("Email field fixed!")
