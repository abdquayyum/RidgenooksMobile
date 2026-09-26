with open("src/app/property/[id].tsx", "r") as f:
    content = f.read()

content = content.replace("checkoutNights * checkoutGuests}", "checkoutNights * (checkoutGuests || 1)}")
with open("src/app/property/[id].tsx", "w") as f:
    f.write(content)
