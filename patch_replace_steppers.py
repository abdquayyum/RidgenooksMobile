with open("src/app/index.tsx", "r") as f:
    content = f.read()

import re

# We need to inject the `renderCalendar` function inside `CheckoutOverlay`
cal_func = """
    const renderCalendar = () => {
      const today = new Date();
      const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
      const firstDay = new Date(today.getFullYear(), today.getMonth(), 1).getDay();
      
      let days = [];
      for (let i = 0; i < firstDay; i++) days.push(null);
      for (let i = 1; i <= daysInMonth; i++) {
        const d = new Date(today.getFullYear(), today.getMonth(), i);
        days.push(d);
      }

      return (
        <View className="mb-6">
          <Text className={`font-bold mb-3 ${userSettings.dark_mode ? 'text-white' : 'text-slate-900'}`}>Select Dates</Text>
          <View className="flex-row flex-wrap">
            {['Su','Mo','Tu','We','Th','Fr','Sa'].map((d,i) => (
              <Text key={i} className="w-[14%] text-center text-xs font-bold text-slate-400 mb-2">{d}</Text>
            ))}
            {days.map((date, idx) => {
              if (!date) return <View key={`empty-${idx}`} className="w-[14%] h-10" />;
              
              const dateStr = date.toISOString().split('T')[0];
              const isBlocked = bookedDates[dateStr];
              const isStart = checkInDate === dateStr;
              const isEnd = checkOutDate === dateStr;
              const isBetween = checkInDate && checkOutDate && dateStr > checkInDate && dateStr < checkOutDate;
              const isPast = date < new Date(today.setHours(0,0,0,0));
              
              const disabled = isBlocked || isPast;
              
              let bgClass = "bg-transparent";
              let textClass = userSettings.dark_mode ? 'text-slate-300' : 'text-slate-700';
              
              if (isStart || isEnd) { bgClass = "bg-amber-500 rounded-full"; textClass = "text-white font-bold"; }
              else if (isBetween) { bgClass = "bg-amber-500/20"; textClass = "text-amber-700"; }
              else if (disabled) { textClass = "text-slate-300 line-through"; }

              return (
                <TouchableOpacity 
                  key={idx} 
                  disabled={disabled}
                  onPress={() => {
                    if (!checkInDate || (checkInDate && checkOutDate)) {
                      setCheckInDate(dateStr); setCheckOutDate(null);
                    } else if (dateStr > checkInDate) {
                      let isValid = true;
                      let curr = new Date(checkInDate);
                      while (curr <= date) {
                        if (bookedDates[curr.toISOString().split('T')[0]]) isValid = false;
                        curr.setDate(curr.getDate() + 1);
                      }
                      if (isValid) setCheckOutDate(dateStr);
                      else { setCheckInDate(dateStr); setCheckOutDate(null); }
                    } else {
                      setCheckInDate(dateStr); setCheckOutDate(null);
                    }
                  }}
                  className={`w-[14%] h-10 items-center justify-center ${bgClass}`}
                >
                  <Text className={textClass}>{date.getDate()}</Text>
                </TouchableOpacity>
              )
            })}
          </View>
        </View>
      );
    };

    return (
"""

content = content.replace("    return (\n      <View className=\"absolute inset-0 z-50 justify-end bg-slate-900/60\"", cal_func + "      <View className=\"absolute inset-0 z-50 justify-end bg-slate-900/60\"")

old_steppers = """          {/* Steppers */}
          <View className="flex-row space-x-4 mb-6">
            <View className={`flex-1 p-4 rounded-xl border ${userSettings.dark_mode ? 'bg-slate-900 border-slate-700' : 'bg-slate-50 border-slate-100'}`}>
              <Text className="text-slate-500 text-xs font-bold mb-3 text-center uppercase tracking-wider">Nights</Text>
              <View className="flex-row items-center justify-between">
                <TouchableOpacity onPress={() => setCheckoutNights(Math.max(1, checkoutNights - 1))} className={`h-8 w-8 rounded-full items-center justify-center ${userSettings.dark_mode ? 'bg-slate-700' : 'bg-white shadow-sm'}`}>
                  <Text className={`font-bold text-lg ${userSettings.dark_mode ? 'text-white' : 'text-slate-900'}`}>-</Text>
                </TouchableOpacity>
                <Text className={`font-bold text-lg ${userSettings.dark_mode ? 'text-white' : 'text-slate-900'}`}>{checkoutNights}</Text>
                <TouchableOpacity onPress={() => setCheckoutNights(checkoutNights + 1)} className={`h-8 w-8 rounded-full items-center justify-center ${userSettings.dark_mode ? 'bg-slate-700' : 'bg-white shadow-sm'}`}>
                  <Text className={`font-bold text-lg ${userSettings.dark_mode ? 'text-white' : 'text-slate-900'}`}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View className={`flex-1 p-4 rounded-xl border ${userSettings.dark_mode ? 'bg-slate-900 border-slate-700' : 'bg-slate-50 border-slate-100'}`}>
              <Text className="text-slate-500 text-xs font-bold mb-3 text-center uppercase tracking-wider">Guests</Text>
              <View className="flex-row items-center justify-between">
                <TouchableOpacity onPress={() => setCheckoutGuests(Math.max(1, checkoutGuests - 1))} className={`h-8 w-8 rounded-full items-center justify-center ${userSettings.dark_mode ? 'bg-slate-700' : 'bg-white shadow-sm'}`}>
                  <Text className={`font-bold text-lg ${userSettings.dark_mode ? 'text-white' : 'text-slate-900'}`}>-</Text>
                </TouchableOpacity>
                <Text className={`font-bold text-lg ${userSettings.dark_mode ? 'text-white' : 'text-slate-900'}`}>{checkoutGuests}</Text>
                <TouchableOpacity onPress={() => setCheckoutGuests(Math.min(10, checkoutGuests + 1))} className={`h-8 w-8 rounded-full items-center justify-center ${userSettings.dark_mode ? 'bg-slate-700' : 'bg-white shadow-sm'}`}>
                  <Text className={`font-bold text-lg ${userSettings.dark_mode ? 'text-white' : 'text-slate-900'}`}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>"""

new_steppers = """          {/* Custom Calendar */}
          {renderCalendar()}
          <View className="flex-row justify-between items-center mb-6 px-2">
            <View>
              <Text className="text-slate-500 text-xs font-bold uppercase tracking-wider">Check-in</Text>
              <Text className={`font-bold text-lg ${userSettings.dark_mode ? 'text-white' : 'text-slate-900'}`}>{checkInDate ? checkInDate : '--'}</Text>
            </View>
            <View className="items-end">
              <Text className="text-slate-500 text-xs font-bold uppercase tracking-wider">Check-out</Text>
              <Text className={`font-bold text-lg ${userSettings.dark_mode ? 'text-white' : 'text-slate-900'}`}>{checkOutDate ? checkOutDate : '--'}</Text>
            </View>
          </View>"""

content = content.replace(old_steppers, new_steppers)
with open("src/app/index.tsx", "w") as f:
    f.write(content)
