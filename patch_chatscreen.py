with open("src/app/index.tsx", "r") as f:
    content = f.read()

import re

old_chat = """  const ChatScreen = () => {
    return ("""

new_chat = """  const ChatScreen = () => {
    const [chatInput, setChatInput] = useState("");
    const ws = useRef(null);

    useEffect(() => {
      // Connect to WebSocket using user's email
      if (currentUser?.email) {
        const wsUrl = `ws://192.168.1.160:8000/ws/chat/${currentUser.email}`;
        ws.current = new WebSocket(wsUrl);
        
        ws.current.onmessage = (e) => {
          const data = e.data;
          const [sender, msg] = data.split("|", 2);
          if (sender === 'admin') {
            setMessages(prev => [...prev, { sender: 'agent', text: msg, time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) }]);
          }
        };
        
        return () => {
          ws.current.close();
        };
      }
    }, [currentUser]);

    const sendMessage = () => {
      if (chatInput.trim().length > 0 && ws.current) {
        // Optimistic UI update
        setMessages(prev => [...prev, { sender: 'user', text: chatInput, time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) }]);
        // Send to backend
        ws.current.send(chatInput);
        setChatInput("");
      }
    };

    return ("""

if "const ws = useRef(null);" not in content:
    content = content.replace(old_chat, new_chat)
    
    # Replace the text input area
    old_input_area = """<View className={`px-5 py-4 flex-row items-center border-t ${userSettings.dark_mode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
          <TouchableOpacity className="h-10 w-10 bg-slate-100 rounded-full items-center justify-center mr-3">
            <Paperclip size={18} color="#64748b" />
          </TouchableOpacity>
          <View className={`flex-1 h-12 rounded-full px-4 justify-center ${userSettings.dark_mode ? 'bg-slate-800' : 'bg-slate-100'}`}>
            <TextInput placeholder="Type a message..." placeholderTextColor="#94a3b8" className={`flex-1 ${userSettings.dark_mode ? 'text-white' : 'text-slate-900'}`} />
          </View>
          <TouchableOpacity className="h-12 w-12 bg-amber-500 rounded-full items-center justify-center ml-3 shadow-md">
            <Send size={18} color="#ffffff" className="ml-1" />
          </TouchableOpacity>
        </View>"""
        
    new_input_area = """<View className={`px-5 py-4 flex-row items-center border-t ${userSettings.dark_mode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
          <TouchableOpacity className="h-10 w-10 bg-slate-100 rounded-full items-center justify-center mr-3">
            <Paperclip size={18} color="#64748b" />
          </TouchableOpacity>
          <View className={`flex-1 h-12 rounded-full px-4 justify-center ${userSettings.dark_mode ? 'bg-slate-800' : 'bg-slate-100'}`}>
            <TextInput 
              placeholder="Type a message..." 
              placeholderTextColor="#94a3b8" 
              className={`flex-1 ${userSettings.dark_mode ? 'text-white' : 'text-slate-900'}`} 
              value={chatInput}
              onChangeText={setChatInput}
            />
          </View>
          <TouchableOpacity onPress={sendMessage} className="h-12 w-12 bg-amber-500 rounded-full items-center justify-center ml-3 shadow-md">
            <Send size={18} color="#ffffff" className="ml-1" />
          </TouchableOpacity>
        </View>"""
        
    content = content.replace(old_input_area, new_input_area)

with open("src/app/index.tsx", "w") as f:
    f.write(content)
