import sys

with open('src/app/transactions.tsx', 'r') as f:
    content = f.read()

# Fix 1: Date parsing helper
content = content.replace("const getStatusColor =", "const parseDate = (d) => new Date((d || '').replace(' ', 'T') + 'Z');\\n  const getStatusColor =")

# Fix 2: Search filter using .id instead of .ref
content = content.replace("txn.ref?.toLowerCase()", "String(txn.id).toLowerCase()")

# Fix 3: Search filter property title
content = content.replace("(txn.property_title || '').toLowerCase()", "(getTxnProperty(txn.property_id)?.title || '').toLowerCase()")

# Fix 4: Transaction feed rendering (property title, ref -> id, and parseDate)
content = content.replace("new Date(txn.date).toLocaleDateString()", "parseDate(txn.date).toLocaleDateString()")
content = content.replace("new Date(txn.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})", "parseDate(txn.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})")
content = content.replace("{txn.property_title || `Booking #${txn.id}`}", "{getTxnProperty(txn.property_id)?.title || `Booking #${txn.id}`}")
content = content.replace("Ref: {txn.ref}", "Ref: {txn.id}")

# Fix 5: Modal rendering (property title, ref -> id, parseDate)
content = content.replace("{selectedTxn.property_title || 'Unknown Property'}", "{getTxnProperty(selectedTxn.property_id)?.title || 'Unknown Property'}")
content = content.replace("{selectedTxn.ref?.startsWith('pi_') ? 'Stripe Checkout' : 'Paystack Checkout'}", "{String(selectedTxn.id).startsWith('pi_') ? 'Stripe Checkout' : 'Paystack Checkout'}")
content = content.replace("{selectedTxn.ref}", "{selectedTxn.id}")
content = content.replace("new Date(selectedTxn.date).toLocaleDateString()", "parseDate(selectedTxn.date).toLocaleDateString()")
content = content.replace("new Date(selectedTxn.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})", "parseDate(selectedTxn.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})")
content = content.replace("new Date(selectedTxn.check_in).toLocaleDateString()", "parseDate(selectedTxn.check_in).toLocaleDateString()")
content = content.replace("new Date(selectedTxn.check_out).toLocaleDateString()", "parseDate(selectedTxn.check_out).toLocaleDateString()")

with open('src/app/transactions.tsx', 'w') as f:
    f.write(content)
print("Fixed transactions.tsx!")
