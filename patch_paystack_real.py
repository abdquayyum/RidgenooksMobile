with open("src/app/property/[id].tsx", "r") as f:
    content = f.read()

# Make sure it actually gets injected before `    </View>\n  );\n}`
old_end = "      </Modal>\n      \n    </View>\n  );\n}"

new_end = """      </Modal>
      
      <Paystack
        paystackKey="pk_test_e3e9d8e578c7407d5c95a5fbc40d4f58c7e0c451"
        billingEmail={currentUser?.email || "guest@ridgenooks.com"}
        amount={getRawPrice(p.price) * checkoutNights * checkoutGuests}
        currency={currencySymbol === '₦' ? 'NGN' : 'USD'}
        onCancel={(e) => {
          Alert.alert("Cancelled", "Payment was cancelled.");
        }}
        onSuccess={async (res) => {
          try {
            const result = await fetch(`${API_URL}/api/transactions/verify`, {
              method: 'POST',
              headers: getAuthHeader(),
              body: JSON.stringify({ reference: res.data.transactionRef.reference, property_id: p.id, amount: getRawPrice(p.price) * checkoutNights * checkoutGuests })
            });
            if (result.ok) {
              Alert.alert("Success", "Your booking was successful!");
              router.push('/transactions');
            } else {
              Alert.alert("Error", "Payment verification failed.");
            }
          } catch(err) {
             Alert.alert("Error", "Failed to verify transaction.");
          }
        }}
        ref={paystackWebViewRef}
      />
    </View>
  );
}"""

content = content.replace(old_end, new_end)
with open("src/app/property/[id].tsx", "w") as f:
    f.write(content)
