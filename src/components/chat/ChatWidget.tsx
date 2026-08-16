import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { postJSON } from '@/lib/api';
import { MessageCircle, X, Send, Mic } from 'lucide-react';

interface ChatMessage {
  sender: 'user' | 'bot';
  text: string;
}

export function ChatWidget() {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMsg = input;
    setMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
    setInput('');
    
    try {
      const res = await postJSON<{reply: string}>('/chat/', { message: userMsg, language: "en" });
      setMessages(prev => [...prev, { sender: 'bot', text: res.reply }]);
    } catch (e) {
      setMessages(prev => [...prev, { sender: 'bot', text: "Sorry, I am having trouble connecting to the server." }]);
    }
  };

  const handleVoice = () => {
    // Basic Web Speech API Demo
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice input is not supported in this browser.");
      return;
    }
    
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US'; // could be tied to i18n
    
    recognition.onstart = () => setIsRecording(true);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
    };
    recognition.onend = () => setIsRecording(false);
    
    recognition.start();
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 p-4 bg-green-500 text-white rounded-full shadow-lg hover:bg-green-600 transition-colors z-50"
      >
        <MessageCircle size={28} />
      </button>

      {isOpen && (
        <div className="fixed bottom-24 right-6 w-80 md:w-96 bg-slate-50 border border-slate-200 shadow-2xl rounded-2xl flex flex-col overflow-hidden z-50 h-[500px]">
          <div className="bg-green-600 text-white p-4 flex justify-between items-center">
            <div>
              <h3 className="font-bold">AgriMitra Bot</h3>
              <p className="text-xs text-green-100">Demo: simulates WhatsApp bot</p>
            </div>
            <button onClick={() => setIsOpen(false)}><X size={20}/></button>
          </div>
          
          <div className="flex-1 p-4 overflow-y-auto bg-[url('/whatsapp-bg.png')] bg-cover">
            {messages.map((m, i) => (
              <div key={i} className={`mb-3 flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`px-4 py-2 rounded-2xl max-w-[80%] ${m.sender === 'user' ? 'bg-green-100 text-green-900 rounded-tr-sm' : 'bg-white text-slate-800 rounded-tl-sm shadow-sm'}`}>
                  {m.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
            <button 
              onClick={handleVoice}
              className={`p-2 rounded-full ${isRecording ? 'bg-red-100 text-red-500 animate-pulse' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
            >
              <Mic size={20} />
            </button>
            <input 
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              placeholder={t('ask_me')}
              className="flex-1 bg-slate-100 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <button 
              onClick={handleSend}
              className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors"
            >
              <Send size={18} className="ml-1" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
