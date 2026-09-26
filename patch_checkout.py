with open("src/app/property/[id].tsx", "r") as f:
    content = f.read()

# 1. Add insets to destructuring
content = content.replace("const {\n    properties", "const {\n    insets,\n    properties")

# 2. Fix the sticky footer so it respects bottom insets
old_footer = "      <View className={`absolute bottom-0 left-0 right-0 py-4 px-5 border-t flex-row items-center justify-between ${userSettings.dark_mode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>"
new_footer = "      <View style={{ paddingBottom: Math.max(16, insets?.bottom || 16), paddingTop: 16 }} className={`absolute bottom-0 left-0 right-0 px-5 border-t flex-row items-center justify-between ${userSettings.dark_mode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>"
content = content.replace(old_footer, new_footer)

# 3. Add total price logic and breakdown to the checkout modal
old_checkout = """            <View className="flex-row justify-between items-center mb-6 px-2">
              <View><Text className="text-slate-500 text-xs font-bold uppercase tracking-wider">Check-in</Text><Text className={`font-bold text-lg ${userSettings.dark_mode ? 'text-white' : 'text-slate-900'}`}>{checkInDate ? checkInDate : '--'}</Text></View>
              <View className="items-end"><Text className="text-slate-500 text-xs font-bold uppercase tracking-wider">Check-out</Text><Text className={`font-bold text-lg ${userSettings.dark_mode ? 'text-white' : 'text-slate-900'}`}>{checkOutDate ? checkOutDate : '--'}</Text></View>
            </View>
            <TouchableOpacity onPress={handleCheckoutClick} className={`w-full py-4 rounded-xl items-center ${paymentGateway === 'paystack' ? 'bg-[#09A5DB]' : 'bg-[#635BFF]'}`}>
              <Text className="text-white font-bold text-lg">Pay Now</Text>
            </TouchableOpacity>"""

new_checkout = """            <View className="flex-row justify-between items-center mb-4 px-2">
              <View><Text className="text-slate-500 text-xs font-bold uppercase tracking-wider">Check-in</Text><Text className={`font-bold text-lg ${userSettings.dark_mode ? 'text-white' : 'text-slate-900'}`}>{checkInDate ? checkInDate : '--'}</Text></View>
              <View className="items-end"><Text className="text-slate-500 text-xs font-bold uppercase tracking-wider">Check-out</Text><Text className={`font-bold text-lg ${userSettings.dark_mode ? 'text-white' : 'text-slate-900'}`}>{checkOutDate ? checkOutDate : '--'}</Text></View>
            </View>
            
            <View className={`border-t pt-4 mb-6 ${userSettings.dark_mode ? 'border-slate-700' : 'border-slate-100'}`}>
              <View className="flex-row justify-between mb-2">
                <Text className={`${userSettings.dark_mode ? 'text-slate-400' : 'text-slate-500'}`}>Subtotal ({checkoutNights} nights)</Text>
                <Text className={`font-semibold ${userSettings.dark_mode ? 'text-white' : 'text-slate-900'}`}>{currencySymbol}{getDisplayPrice(getRawPrice(p.price) * checkoutNights)}</Text>
              </View>
              <View className="flex-row justify-between mb-2">
                <Text className={`${userSettings.dark_mode ? 'text-slate-400' : 'text-slate-500'}`}>Service Fee</Text>
                <Text className={`font-semibold ${userSettings.dark_mode ? 'text-white' : 'text-slate-900'}`}>{currencySymbol}{currencySymbol === '$' ? '25' : '25,000'}</Text>
              </View>
              <View className={`flex-row justify-between mt-2 pt-2 border-t ${userSettings.dark_mode ? 'border-slate-700' : 'border-slate-100'}`}>
                <Text className={`font-bold ${userSettings.dark_mode ? 'text-white' : 'text-slate-900'}`}>Total</Text>
                <Text className={`font-bold text-xl ${userSettings.dark_mode ? 'text-white' : 'text-slate-900'}`}>{currencySymbol}{getDisplayPrice(getRawPrice(p.price) * checkoutNights + (currencySymbol === '$' ? 25 : 25000))}</Text>
              </View>
            </View>

            <TouchableOpacity onPress={handleCheckoutClick} className={`w-full py-4 rounded-xl flex-row justify-center items-center ${paymentGateway === 'paystack' ? 'bg-[#09A5DB]' : 'bg-[#635BFF]'}`}>
              <Lock size={18} color="#ffffff" className="mr-2" />
              <Text className="text-white font-bold text-lg">Pay {currencySymbol}{getDisplayPrice(getRawPrice(p.price) * checkoutNights + (currencySymbol === '$' ? 25 : 25000))}</Text>
            </TouchableOpacity>"""
content = content.replace(old_checkout, new_checkout)

# 4. Make sure handleCheckoutClick uses the TOTAL price with Service Fee for BOTH Paystack and Stripe
import re
# We need to replace the amount logic in popup.checkout
content = re.sub(
    r'amount:\s*\(getRawPrice\(p.price\)\s*\*\s*checkoutNights\)\s*\*\s*100,',
    r'amount: (getRawPrice(p.price) * checkoutNights + (currencySymbol === "$" ? 25 : 25000)) * 100,',
    content
)

# And inside the fetch verification for Paystack
content = re.sub(
    r'amount:\s*getRawPrice\(p.price\)\s*\*\s*checkoutNights\s*\}\)',
    r'amount: getRawPrice(p.price) * checkoutNights + (currencySymbol === "$" ? 25 : 25000) })',
    content
)

with open("src/app/property/[id].tsx", "w") as f:
    f.write(content)
print("Checkout layout and prices patched!")
