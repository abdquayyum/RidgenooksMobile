with open("src/app/index.tsx", "r") as f:
    content = f.read()

old_payload = """      const payload = {
        property_id: selectedProperty?.id || 0,
        amount: amount,
        currency: currencySymbol === "$" ? "USD" : "NGN",
        status: "Completed",
        ref: ref || `REF_${Date.now()}`
      };"""

new_payload = """      const payload = {
        property_id: selectedProperty?.id || 0,
        amount: amount,
        currency: currencySymbol === "$" ? "USD" : "NGN",
        status: "Completed",
        ref: ref || `REF_${Date.now()}`,
        check_in: checkInDate,
        check_out: checkOutDate
      };"""

content = content.replace(old_payload, new_payload)

with open("src/app/index.tsx", "w") as f:
    f.write(content)
