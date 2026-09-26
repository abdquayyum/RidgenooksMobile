with open("src/app/property/[id].tsx", "r") as f:
    content = f.read()

# Replace the <Modal> with a simple View so that Paystack's Modal can overlay it
content = content.replace('<Modal visible={showCheckout} animationType="slide" transparent>', '{showCheckout && (')
content = content.replace('</Modal>', ')}')

with open("src/app/property/[id].tsx", "w") as f:
    f.write(content)
print("Modal replaced!")
