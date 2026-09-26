  // --- CUSTOM CALENDAR ENGINE ---
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
      <View className="mb-4">
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
                    // Check if there are blocked dates in between
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
