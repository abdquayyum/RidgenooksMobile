with open("src/context/GlobalStateContext.tsx", "r") as f:
    content = f.read()

old_logic = """      if (reverseGeocode && reverseGeocode.length > 0) {
        const addr = reverseGeocode[0];
        setUserLocationText(`${addr.city || addr.region}, ${addr.country}`);
        
        if (addr.country && addr.country.toLowerCase() === 'nigeria') {
          setCurrencySymbol("₦");
          setPaymentGateway('paystack');
        } else {
          setCurrencySymbol("$");
          setPaymentGateway('stripe');
        }
      }"""

new_logic = """      if (reverseGeocode && reverseGeocode.length > 0) {
        const addr = reverseGeocode[0];
        
        if (addr.country && addr.country.toLowerCase() === 'nigeria') {
          setUserLocationText("Lagos, Nigeria");
          setCurrencySymbol("₦");
          setPaymentGateway('paystack');
        } else if (addr.country && (addr.country.toLowerCase() === 'united states' || addr.country.toLowerCase() === 'usa' || addr.isoCountryCode === 'US')) {
          setUserLocationText("USA");
          setCurrencySymbol("$");
          setPaymentGateway('stripe');
        } else {
          setUserLocationText(`${addr.city || addr.region}, ${addr.country}`);
          setCurrencySymbol("$");
          setPaymentGateway('stripe');
        }
      }"""

content = content.replace(old_logic, new_logic)

with open("src/context/GlobalStateContext.tsx", "w") as f:
    f.write(content)
print("Location detection patched")
