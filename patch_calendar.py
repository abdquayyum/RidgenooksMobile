with open("src/app/index.tsx", "r") as f:
    content = f.read()

if "from 'react-native-calendars'" not in content:
    content = content.replace("from 'lucide-react-native';", "from 'lucide-react-native';\nimport { Calendar } from 'react-native-calendars';")

state_addition = """  const [checkoutNights, setCheckoutNights] = useState(1);
  const [checkoutGuests, setCheckoutGuests] = useState(1);
  const [bookedDates, setBookedDates] = useState({});
  const [checkInDate, setCheckInDate] = useState(null);
  const [checkOutDate, setCheckOutDate] = useState(null);
  
  useEffect(() => {
    if (showCheckout && selectedProperty) {
      fetch(`${API_URL}/api/properties/${selectedProperty.id}/availability`)
        .then(res => res.json())
        .then(data => {
          let blocked = {};
          data.forEach(booking => {
            let curr = new Date(booking.check_in);
            const end = new Date(booking.check_out);
            while (curr <= end) {
              const dStr = curr.toISOString().split('T')[0];
              blocked[dStr] = { disabled: true, disableTouchEvent: true, color: '#cbd5e1' };
              curr.setDate(curr.getDate() + 1);
            }
          });
          setBookedDates(blocked);
        })
        .catch(err => console.log(err));
    }
  }, [showCheckout, selectedProperty]);
"""

old_state = """  const [checkoutNights, setCheckoutNights] = useState(1);
  const [checkoutGuests, setCheckoutGuests] = useState(1);"""

if "const [bookedDates" not in content:
    content = content.replace(old_state, state_addition)

with open("src/app/index.tsx", "w") as f:
    f.write(content)
