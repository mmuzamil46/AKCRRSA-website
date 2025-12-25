import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { RiChat3Line, RiCloseLine, RiSendPlane2Fill, RiRobotLine, RiUserLine } from 'react-icons/ri';

const ChatWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { text: "ሰላም! የአዲስ ከተማ ክፍለ ከተማ ሲቪል ምዝገባ እና የነዋሪነት አገልግሎት ረዳት ነኝ። እንዴት ልርዳዎት? (ለምሳሌ፦ 'መታወቂያ ለማውጣት ምን ያስፈልጋል?' ብለው ይጠይቁኝ)", sender: 'bot' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMsg = input.trim();
        setInput('');
        setMessages(prev => [...prev, { text: userMsg, sender: 'user' }]);
        setIsLoading(true);

        try {
            const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/chat`, { message: userMsg });
            setMessages(prev => [...prev, { 
                text: res.data.text, 
                options: res.data.options || [], // Support for interactive buttons
                sender: 'bot' 
            }]);
        } catch (err) {
            setMessages(prev => [...prev, { text: "ይቅርታ፣ ችግር አጋጥሟል። እባክዎ ትንሽ ቆይተው እንደገና ይሞክሩ።", sender: 'bot' }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleOptionSelect = (option) => {
        setInput(option);
        // We delay the send slightly to show the text in input if any, or just call handleSend
        // Directly calling handleSend with a synthetic event or modified logic
        setTimeout(() => {
            const submitBtn = document.getElementById('chat-submit-btn');
            if (submitBtn) submitBtn.click();
        }, 100);
    };

    return (
        <div className="fixed bottom-6 right-6 z-[1000] font-sans">
            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className="absolute bottom-20 right-0 w-[90vw] md:w-[400px] h-[500px] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-gray-100"
                    >
                        {/* Header */}
                        <div className="bg-primary p-4 text-white flex justify-between items-center shrink-0 shadow-md">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-white/20 rounded-lg">
                                    <RiRobotLine className="text-xl" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-sm">የአገልግሎት ረዳት (Service Assistant)</h3>
                                    <div className="flex items-center gap-1">
                                        <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
                                        <span className="text-[10px] text-white/70 uppercase">Online</span>
                                    </div>
                                </div>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="hover:bg-white/10 p-1.5 rounded-lg transition-colors">
                                <RiCloseLine className="text-xl" />
                            </button>
                        </div>

                        {/* Messages Area */}
                        <div 
                            ref={scrollRef}
                            className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50"
                        >
                            {messages.map((msg, idx) => (
                                <div 
                                    key={idx} 
                                    className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                                >
                                    <div className={`flex gap-2 max-w-[85%] ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                                        <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                                            msg.sender === 'user' ? 'bg-primary text-white' : 'bg-gray-200 text-gray-600'
                                        }`}>
                                            {msg.sender === 'user' ? <RiUserLine /> : <RiRobotLine />}
                                        </div>
                                        <div className={`p-3 rounded-2xl text-sm whitespace-pre-line shadow-sm ${
                                            msg.sender === 'user' 
                                                ? 'bg-primary text-white rounded-tr-none' 
                                                : 'bg-white text-gray-800 rounded-tl-none border border-gray-100'
                                        }`}>
                                            {msg.text}
                                        </div>
                                    </div>

                                    {/* Clarification Buttons */}
                                    {msg.options && msg.options.length > 0 && (
                                        <div className="mt-2 ml-10 flex flex-wrap gap-2">
                                            {msg.options.map((opt, i) => (
                                                <button
                                                    key={i}
                                                    onClick={() => handleOptionSelect(opt)}
                                                    className="px-3 py-1.5 text-xs font-bold border-2 border-primary text-primary rounded-full hover:bg-primary hover:text-white transition-all active:scale-95"
                                                >
                                                    {opt}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                            {isLoading && (
                                <div className="flex justify-start">
                                    <div className="bg-white border border-gray-100 p-3 rounded-2xl rounded-tl-none shadow-sm flex gap-1">
                                        <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce"></div>
                                        <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                                        <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Input Area */}
                        <form onSubmit={handleSend} className="p-4 bg-white border-t flex gap-2">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="ጥያቄዎን እዚህ ይጻፉ..."
                                className="flex-1 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                            />
                            <button 
                                id="chat-submit-btn"
                                type="submit"
                                disabled={!input.trim() || isLoading}
                                className="bg-primary text-white p-2.5 rounded-xl hover:bg-secondary transition-colors disabled:opacity-50 shadow-lg shadow-primary/20 active:scale-95"
                            >
                                <RiSendPlane2Fill className="text-xl" />
                            </button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* FAB Button */}
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className="bg-primary text-white p-4 rounded-full shadow-2xl hover:bg-secondary transition-all flex items-center justify-center relative border-4 border-white"
            >
                {isOpen ? <RiCloseLine className="text-2xl" /> : <RiChat3Line className="text-2xl" />}
                {!isOpen && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-4 w-4 bg-secondary"></span>
                    </span>
                )}
            </motion.button>
        </div>
    );
};

export default ChatWidget;
