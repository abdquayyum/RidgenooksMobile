with open("src/app/index.tsx", "r") as f:
    content = f.read()

old_click = """  const handleCheckoutClick = () => {
    const rawPrice = selectedProperty ? getRawPrice(selectedProperty.price) : 0;
    const subtotal = rawPrice * checkoutNights;
    const fee = currencySymbol === '$' ? 25 : 25000;
    const total = subtotal + fee;

    setShowCheckout(false); """

new_click = """  const handleCheckoutClick = () => {
    if (!checkInDate || !checkOutDate) {
      Alert.alert("Missing Dates", "Please select a valid check-in and check-out date.");
      return;
    }
    const rawPrice = selectedProperty ? getRawPrice(selectedProperty.price) : 0;
    const subtotal = rawPrice * checkoutNights;
    const fee = currencySymbol === '$' ? 25 : 25000;
    const total = subtotal + fee;

    setShowCheckout(false); """

content = content.replace(old_click, new_click)

with open("src/app/index.tsx", "w") as f:
    f.write(content)
