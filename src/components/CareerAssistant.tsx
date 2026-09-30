import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, StudentProfile } from '../types';
import { CAREER_PRESET_PROMPTS } from '../data/careerAdviceData';
import { 
  Sparkles, 
  Send, 
  User, 
  Bot, 
  Copy, 
  Check, 
  RotateCcw, 
  AlertCircle, 
  ShieldCheck,
  Compass,
  ArrowRight
} from 'lucide-react';

interface CareerAssistantProps {
  studentProfile: StudentProfile;
  hasApiKey: boolean;
}

export const CareerAssistant: React.FC<CareerAssistantProps> = ({
  studentProfile,
  hasApiKey,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      content: `Hello ${studentProfile.name.split(' ')[0]}! I am Setu Guru, your dedicated career advisor on SkillSetu AI.
      
I'm here to help you navigate pivotal decisions after your ${studentProfile.qualification} in ${studentProfile.branch}:
• Deciding between Lateral Entry B.Tech (LEET) vs PSU/Core Industry jobs
• Understanding NATS Apprenticeship rules & permanent job prospects
• Preparing for written tests & technical interviews for Diploma Engineer Trainee (DET)
• Selecting high-value practical certifications for your branch

What career questions can I answer for you today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isDemo: !hasApiKey
    }
  ]);

  const [inputPrompt, setInputPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputPrompt).trim();
    if (!query || isLoading) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputPrompt('');
    setIsLoading(true);

    try {
      // Check preset library for instantaneous matching response
      const matchedPreset = CAREER_PRESET_PROMPTS.find(
        p => p.prompt.toLowerCase() === query.toLowerCase() ||
             query.toLowerCase().includes(p.label.toLowerCase()) ||
             p.label.toLowerCase().includes(query.toLowerCase())
      );

      // Attempt server-side Gemini route
      const res = await fetch('/api/career-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          profileContext: studentProfile,
          history: messages.slice(-4)
        })
      });

      if (!res.ok) throw new Error('API server returned error');
      const data = await res.json();

      let replyContent = data.reply;
      let isDemo = Boolean(data.isDemo);

      // If demo mode or matching preset found, provide the enriched curated student advice
      if (isDemo && matchedPreset) {
        replyContent = matchedPreset.response;
      }

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        content: replyContent,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isDemo
      };

      setMessages(prev => [...prev, botMsg]);
    } catch {
      // Graceful offline fallback
      const matchedPreset = CAREER_PRESET_PROMPTS.find(
        p => query.toLowerCase().includes('lateral') || 
             query.toLowerCase().includes('leet') ||
             query.toLowerCase().includes('nats') ||
             query.toLowerCase().includes('det') ||
             query.toLowerCase().includes('skill')
      );

      const fallbackText = matchedPreset 
        ? matchedPreset.response 
        : `[Demo Mode Guidance] As a ${studentProfile.qualification} student in ${studentProfile.branch}, your primary career avenues are:
1. **Core Industry DET Roles**: High shop-floor learning at top firms (e.g. Tata Motors, BEL, L&T).
2. **NATS Apprenticeship**: 1 year government-certified on-the-job training in PSUs.
3. **Lateral Entry B.Tech (LEET)**: Direct 2nd-year admission into accredited technical universities.

For specialized queries, you can also select the prompt shortcuts below!`;

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        content: fallbackText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isDemo: true
      };

      setMessages(prev => [...prev, botMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyMessage = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClearHistory = () => {
    setMessages([
      {
        id: 'welcome-reset',
        sender: 'assistant',
        content: `Chat history reset. How can I assist you with your career goals today, ${studentProfile.name.split(' ')[0]}?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isDemo: !hasApiKey
      }
    ]);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 uppercase tracking-wider mb-1">
            <span>Career Decision Intelligence</span>
            <span aria-hidden="true">·</span>
            <span>Setu Guru Advisor</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900">AI Career Assistant</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Practical career navigation, polytechnic vs degree guidance, and PSU selection advice.
          </p>
        </div>

        {/* Live vs Demo Status Indicator */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className={`px-2.5 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 border ${
            hasApiKey 
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
              : 'bg-amber-50 border-amber-200 text-amber-800'
          }`}>
            <span className={`w-2 h-2 rounded-full ${hasApiKey ? 'bg-emerald-500' : 'bg-amber-500'}`} />
            <span>{hasApiKey ? 'Gemini 3.8 Live' : 'Demo Mode Active'}</span>
          </div>

          <button
            onClick={handleClearHistory}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            title="Reset Chat"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Demo Notice Banner if no key */}
      {!hasApiKey && (
        <div className="p-3.5 rounded-xl bg-amber-50/80 border border-amber-200/90 text-amber-950 text-xs flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <p className="font-semibold">
              Running in Transparent Demo Mode
            </p>
            <p className="text-amber-800 leading-relaxed">
              SkillSetu AI operates here using curated student career guidance responses. We do not pretend a live model is connected without real API keys. To connect live Gemini 3.8 Flash, users configure their secret in the AI Studio Secrets panel.
            </p>
          </div>
        </div>
      )}

      {/* Suggested Quick Prompt Chips */}
      <div className="space-y-2">
        <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
          Frequent Questions for Diploma Graduates:
        </label>
        <div className="flex flex-wrap gap-2">
          {CAREER_PRESET_PROMPTS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => handleSendMessage(preset.prompt)}
              className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50/40 text-slate-700 text-xs text-left transition-colors flex items-center gap-1.5 shadow-2xs"
            >
              <Compass className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span>{preset.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages Log */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col h-[520px]">
        
        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.map((msg) => {
            const isBot = msg.sender === 'assistant';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isBot ? 'items-start' : 'items-start flex-row-reverse'}`}
              >
                {/* Avatar */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                  isBot 
                    ? 'bg-blue-600 text-white shadow-xs' 
                    : 'bg-slate-800 text-white'
                }`}>
                  {isBot ? <Sparkles className="w-4 h-4" /> : <User className="w-4 h-4" />}
                </div>

                {/* Message Bubble */}
                <div className={`max-w-[85%] sm:max-w-[78%] rounded-2xl p-4 text-xs leading-relaxed ${
                  isBot
                    ? 'bg-slate-50 border border-slate-200/80 text-slate-800'
                    : 'bg-blue-600 text-white shadow-xs'
                }`}>
                  <div className="whitespace-pre-line space-y-2">
                    {msg.content}
                  </div>

                  {/* Message Footer */}
                  <div className={`mt-2 pt-1.5 border-t flex items-center justify-between text-[10px] ${
                    isBot ? 'border-slate-200 text-slate-400' : 'border-blue-500/60 text-blue-100'
                  }`}>
                    <span>{msg.timestamp}</span>

                    {isBot && (
                      <div className="flex items-center gap-2">
                        {msg.isDemo && (
                          <span className="text-amber-700 bg-amber-50 px-1 py-0.5 rounded border border-amber-200 font-medium">
                            Demo Response
                          </span>
                        )}
                        <button
                          onClick={() => handleCopyMessage(msg.id, msg.content)}
                          className="text-slate-400 hover:text-slate-700 flex items-center gap-0.5"
                          title="Copy Answer"
                        >
                          {copiedId === msg.id ? (
                            <Check className="w-3 h-3 text-emerald-600" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                          <span>{copiedId === msg.id ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex gap-3 items-start">
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                <Sparkles className="w-4 h-4 animate-spin" />
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-500 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping" />
                <span>Setu Guru is formulating career guidance...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-3.5 border-t border-slate-200 bg-slate-50/50 rounded-b-2xl">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Ask about polytechnic careers, exam syllabus, NATS stipend, LEET cutoffs..."
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              className="flex-1 px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-800"
            />
            <button
              type="submit"
              disabled={!inputPrompt.trim() || isLoading}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl disabled:opacity-50 transition-colors shadow-xs flex items-center gap-1.5 shrink-0"
            >
              <span>Send</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
          
          <div className="mt-2 px-1 text-[10px] text-slate-400 text-center">
            Informational career counseling only. Official state gazettes, university admission brochures, and PSU advertisements govern recruitment eligibility.
          </div>
        </div>

      </div>

    </div>
  );
};
