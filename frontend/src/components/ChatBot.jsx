import { useState } from 'react';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { type: 'bot', text: 'Hi! I\'m your career assistant. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');

  const quickReplies = [
    'What careers suit me?',
    'How to become a software engineer?',
    'Tell me about JEE exam',
    'What skills do I need?'
  ];

  const handleSend = () => {
    if (!input.trim()) return;

    setMessages([...messages, { type: 'user', text: input }]);
    
    setTimeout(() => {
      const botResponse = getBotResponse(input);
      setMessages(prev => [...prev, { type: 'bot', text: botResponse }]);
    }, 500);

    setInput('');
  };

  const getBotResponse = (query) => {
    const q = query.toLowerCase();
    
    if (q.includes('software') || q.includes('engineer')) {
      return 'To become a Software Engineer: Complete 10th → Choose Science (PCM) → Prepare for JEE → B.Tech in CS → Learn programming, DSA → Internships → Entry-level job. Starting salary: ₹3-6 LPA.';
    } else if (q.includes('jee')) {
      return 'JEE (Joint Entrance Examination) is required for engineering admissions. JEE Main for NITs, IIITs. JEE Advanced for IITs. Prepare in 11th-12th. Focus on Physics, Chemistry, Maths.';
    } else if (q.includes('skill')) {
      return 'Key skills depend on your career. For tech: Programming, Problem-solving. For medicine: Biology, Patient care. For business: Communication, Leadership. Check your career roadmap for specific skills!';
    } else if (q.includes('career') || q.includes('suit')) {
      return 'Based on your profile, I recommend checking "My Career Path" section for personalized recommendations. Your strengths and interests will help determine the best fit!';
    } else {
      return 'I can help you with career guidance, exam information, skill recommendations, and roadmap queries. Try asking about specific careers or exams!';
    }
  };

  return (
    <>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full shadow-lg flex items-center justify-center text-white text-2xl hover:shadow-xl transition-all z-50"
        >
          🤖
        </button>
      )}

      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 h-[500px] bg-white rounded-2xl shadow-2xl flex flex-col z-50">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 rounded-t-2xl flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">🤖</span>
              <div>
                <h3 className="text-white font-semibold">AI Career Assistant</h3>
                <p className="text-blue-100 text-xs">Online</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white hover:text-gray-200">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-lg ${
                  msg.type === 'user' 
                    ? 'bg-blue-600 text-white rounded-br-none' 
                    : 'bg-gray-100 text-gray-800 rounded-bl-none'
                }`}>
                  <p className="text-sm">{msg.text}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 border-t">
            <div className="flex flex-wrap gap-2 mb-3">
              {quickReplies.map((reply, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setInput(reply);
                    setTimeout(() => handleSend(), 100);
                  }}
                  className="text-xs px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-700"
                >
                  {reply}
                </button>
              ))}
            </div>
            <div className="flex space-x-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask me anything..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
              <button onClick={handleSend} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBot;
