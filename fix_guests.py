with open("src/app/property/[id].tsx", "r") as f:
    content = f.read()

content = content.replace("checkoutNights, checkoutGuests, bookedDates", "checkoutNights, bookedDates")
content = content.replace("checkoutNights * (checkoutGuests || 1)}", "checkoutNights * 1}")
content = content.replace("checkoutNights * checkoutGuests", "checkoutNights * 1")

with open("src/app/property/[id].tsx", "w") as f:
    f.write(content)
