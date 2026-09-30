import React, { useState, useMemo } from 'react';
import { INTERVIEW_QUESTIONS } from '../data/interviewData';
import { InterviewQuestion, BranchType } from '../types';
import { 
  HelpCircle, 
  CheckCircle, 
  Bookmark, 
  Lightbulb, 
  ChevronDown, 
  ChevronUp, 
  Sparkles, 
  BookOpen, 
  Award,
  Search,
  Filter,
  CheckCircle2,
  Send
} from 'lucide-react';

interface InterviewPrepProps {
  studentBranch: BranchType;
}

export const InterviewPrep: React.FC<InterviewPrepProps> = ({ studentBranch }) => {
  const [selectedBranch, setSelectedBranch] = useState<string>('Electronics & Communication');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedQuestionId, setExpandedQuestionId] = useState<string | null>(INTERVIEW_QUESTIONS[0].id);
  const [masteredIds, setMasteredIds] = useState<string[]>([]);
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);
  const [showBookmarkedOnly, setShowBookmarkedOnly] = useState(false);

  // Interactive answer testing state
  const [practiceAnswers, setPracticeAnswers] = useState<Record<string, string>>({});
  const [feedbackState, setFeedbackState] = useState<Record<string, { score: number; matchedKeywords: string[]; advice: string } | null>>({});

  const branches = [
    'Electronics & Communication',
    'Computer Science & IT',
    'Mechanical Engineering',
    'Electrical Engineering',
    'Civil Engineering',
    'General HR',
  ];

  const filteredQuestions = useMemo(() => {
    return INTERVIEW_QUESTIONS.filter((q) => {
      const matchBranch = selectedBranch === 'All' || q.branch === selectedBranch;
      const matchSearch = 
        q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.modelAnswer.toLowerCase().includes(searchTerm.toLowerCase());
      const matchBookmark = !showBookmarkedOnly || bookmarkedIds.includes(q.id);

      return matchBranch && matchSearch && matchBookmark;
    });
  }, [selectedBranch, searchTerm, showBookmarkedOnly, bookmarkedIds]);

  const toggleMastered = (id: string) => {
    setMasteredIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const toggleBookmarked = (id: string) => {
    setBookmarkedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  // Evaluate candidate's self practice answer
  const handleEvaluatePractice = (q: InterviewQuestion) => {
    const candidateAnswer = (practiceAnswers[q.id] || '').toLowerCase();
    if (!candidateAnswer.trim()) return;

    const matched: string[] = [];
    q.keyKeywords.forEach(kw => {
      // Check if keyword or core parts appear
      const words = kw.toLowerCase().split(/[\s/()]+/);
      const hasAnyWord = words.some(w => w.length > 3 && candidateAnswer.includes(w));
      if (hasAnyWord) matched.push(kw);
    });

    const score = Math.round((matched.length / q.keyKeywords.length) * 100);
    let advice = '';
    if (score >= 70) {
      advice = 'Excellent response! You demonstrated strong technical grasp and covered the foundational concepts.';
    } else if (score >= 40) {
      advice = 'Good effort! Make sure to include more specific technical terminology and formulas (see Model Answer).';
    } else {
      advice = 'Review the model answer below to strengthen your conceptual terminology and bench-testing explanations.';
    }

    setFeedbackState(prev => ({
      ...prev,
      [q.id]: { score, matchedKeywords: matched, advice }
    }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 uppercase tracking-wider mb-1">
            <span>Technical & HR Viva Preparation</span>
            <span aria-hidden="true">·</span>
            <span>Shop-Floor & Written Test Questions</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900">Interview Preparation</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Core interview questions curated for polytechnic diploma students and freshers, with interviewer intent, key technical keywords, and model answers.
          </p>
        </div>

        {/* Mastered Counter Badge */}
        <div className="flex items-center gap-3 self-start md:self-auto text-xs">
          <div className="px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-1.5 font-medium">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span>Mastered: <strong className="font-mono">{masteredIds.length}</strong> / {INTERVIEW_QUESTIONS.length}</span>
          </div>
        </div>
      </div>

      {/* Branch Selector Tabs (Interactive Functional Buttons) */}
      <div className="p-1.5 bg-slate-100 rounded-xl flex flex-wrap gap-1">
        {branches.map((b) => {
          const isActive = selectedBranch === b;
          return (
            <button
              key={b}
              onClick={() => setSelectedBranch(b)}
              className={`px-3.5 py-2 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                isActive
                  ? 'bg-white text-blue-700 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              {b}
            </button>
          );
        })}
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search questions or keywords..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-white"
          />
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => setShowBookmarkedOnly(!showBookmarkedOnly)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors flex items-center gap-1.5 ${
              showBookmarkedOnly
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${showBookmarkedOnly ? 'fill-current' : ''}`} />
            <span>Bookmarked ({bookmarkedIds.length})</span>
          </button>
        </div>
      </div>

      {/* Questions Accordion Cards */}
      <div className="space-y-4">
        {filteredQuestions.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-slate-200 p-6">
            <HelpCircle className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <h3 className="text-sm font-semibold text-slate-800">No questions found in this topic</h3>
            <p className="text-xs text-slate-500 mt-1">Try switching to another branch tab above or clear your search.</p>
          </div>
        ) : (
          filteredQuestions.map((q) => {
            const isExpanded = expandedQuestionId === q.id;
            const isMastered = masteredIds.includes(q.id);
            const isBookmarked = bookmarkedIds.includes(q.id);
            const feedback = feedbackState[q.id];

            return (
              <div
                key={q.id}
                className={`bg-white rounded-xl border transition-all ${
                  isExpanded ? 'border-blue-300 shadow-md ring-1 ring-blue-100' : 'border-slate-200/80 hover:border-slate-300'
                }`}
              >
                {/* Question Summary Bar */}
                <div className="p-4 sm:p-5 flex items-start justify-between gap-3 cursor-pointer" onClick={() => setExpandedQuestionId(isExpanded ? null : q.id)}>
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                      <span className="font-semibold text-blue-700">{q.subject}</span>
                      <span aria-hidden="true">·</span>
                      <span>{q.difficulty}</span>
                      {isMastered && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="text-emerald-700 font-semibold flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Mastered
                          </span>
                        </>
                      )}
                    </div>

                    <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                      {q.question}
                    </h3>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => toggleBookmarked(q.id)}
                      className={`p-1.5 rounded-lg border transition-colors ${
                        isBookmarked
                          ? 'bg-blue-50 text-blue-600 border-blue-200'
                          : 'text-slate-400 border-slate-200 hover:bg-slate-50'
                      }`}
                      title={isBookmarked ? 'Bookmarked' : 'Bookmark Question'}
                    >
                      <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
                    </button>

                    <button
                      onClick={() => toggleMastered(q.id)}
                      className={`p-1.5 rounded-lg border transition-colors ${
                        isMastered
                          ? 'bg-emerald-50 text-emerald-600 border-emerald-200'
                          : 'text-slate-400 border-slate-200 hover:bg-slate-50'
                      }`}
                      title={isMastered ? 'Marked Mastered' : 'Mark as Mastered'}
                    >
                      <CheckCircle className={`w-4 h-4 ${isMastered ? 'fill-current' : ''}`} />
                    </button>

                    <button
                      onClick={() => setExpandedQuestionId(isExpanded ? null : q.id)}
                      className="p-1.5 text-slate-400 hover:text-slate-600"
                    >
                      {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="px-4 sm:px-5 pb-5 pt-2 border-t border-slate-100 space-y-4 text-xs">
                    
                    {/* Interviewer Intent Box */}
                    <div className="p-3 rounded-lg bg-blue-50/70 border border-blue-100 text-blue-950 flex items-start gap-2.5">
                      <Lightbulb className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                      <div>
                        <strong className="block text-[11px] uppercase font-bold text-blue-800">
                          What the Interviewer is Evaluating
                        </strong>
                        <p className="mt-0.5 leading-relaxed text-blue-900">
                          {q.interviewerIntent}
                        </p>
                      </div>
                    </div>

                    {/* Interactive "Try Answering" Box */}
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <label className="font-bold text-slate-800 flex items-center gap-1.5">
                          <span>Practice Your Answer</span>
                        </label>
                        <span className="text-[11px] text-slate-500">
                          Type how you would explain this aloud in viva / interview
                        </span>
                      </div>

                      <textarea
                        rows={3}
                        placeholder="Draft your answer here using proper technical terms..."
                        value={practiceAnswers[q.id] || ''}
                        onChange={(e) => {
                          const val = e.target.value;
                          setPracticeAnswers(prev => ({ ...prev, [q.id]: val }));
                        }}
                        className="w-full p-2.5 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-800"
                      />

                      <div className="flex items-center justify-between">
                        <button
                          type="button"
                          onClick={() => handleEvaluatePractice(q)}
                          disabled={!practiceAnswers[q.id]?.trim()}
                          className="px-3 py-1.5 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center gap-1.5"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>Evaluate My Answer</span>
                        </button>
                        <span className="text-[11px] text-slate-400">Instant Keyword & Concept Matching</span>
                      </div>

                      {feedback && (
                        <div className="mt-3 p-3 rounded-lg bg-white border border-slate-200 space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-800">Evaluation Score</span>
                            <span className="font-mono font-bold text-blue-600">{feedback.score}% Coverage</span>
                          </div>
                          <p className="text-slate-600 leading-relaxed">{feedback.advice}</p>
                          {feedback.matchedKeywords.length > 0 && (
                            <div className="pt-1 text-[11px] text-slate-500">
                              <span>Matched Key Terms: </span>
                              <strong className="text-emerald-700">{feedback.matchedKeywords.join(', ')}</strong>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Model Answer Guidance */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <strong className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                          Model Answer & Technical Explanation
                        </strong>
                      </div>
                      <div className="p-4 rounded-xl bg-slate-900 text-slate-100 leading-relaxed font-sans text-xs space-y-2">
                        <p>{q.modelAnswer}</p>
                      </div>
                    </div>

                    {/* Key Technical Keywords & Diploma Tip */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                      <div className="p-3 rounded-lg border border-slate-200 bg-slate-50/50">
                        <span className="font-bold text-slate-800 block text-[11px] uppercase mb-1">
                          Key Technical Keywords to Mention:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {q.keyKeywords.map((kw, i) => (
                            <span key={i} className="px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-700 text-[11px] font-mono">
                              {kw}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="p-3 rounded-lg border border-amber-200 bg-amber-50/50 text-amber-900">
                        <span className="font-bold text-amber-950 block text-[11px] uppercase mb-1">
                          Pro Tip for Diploma Freshers:
                        </span>
                        <p className="text-[11px] leading-relaxed">
                          {q.tipsForDiploma}
                        </p>
                      </div>
                    </div>

                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

    </div>
  );
};
