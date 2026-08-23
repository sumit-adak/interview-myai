import React, { useState, useEffect, useMemo, useRef } from 'react'
import { useNavigate } from 'react-router'
import { SlateSidebar } from '../../../components/layout/SlateSidebar'

const PRACTICE_MODES = [
    {
        id: 'rapid-fire',
        title: 'Timed Rapid-Fire Q&A',
        icon: 'timer',
        description: 'Receive high-pressure questions one after another with an adaptive 60-second countdown timer.',
        difficulty: 'Fast Paced • 60s per Question',
        color: 'from-indigo-600 to-purple-600',
        badge: 'High Pressure'
    },
    {
        id: 'sandbox',
        title: 'Coding Sandbox & Whiteboard',
        icon: 'terminal',
        description: 'Interactive code editor and architectural whiteboard interface for live algorithmic problem solving.',
        difficulty: 'Interactive IDE • Multi-Language',
        color: 'from-purple-600 to-blue-600',
        badge: 'Technical & DSA'
    },
    {
        id: 'star-builder',
        title: 'STAR Method Behavioral Builder',
        icon: 'psychology',
        description: 'Structure behavioral narratives step-by-step across Situation, Task, Action, and Result.',
        difficulty: 'Guided Rubric • Executive Framing',
        color: 'from-blue-600 to-emerald-600',
        badge: 'Leadership & STAR'
    }
]

const DOMAINS = [
    'All Domains',
    'Data Structures',
    'Algorithms',
    'System Design',
    'Frontend',
    'Backend',
    'Databases',
    'Distributed Systems',
    'Leadership',
    'Behavioral'
]

const DIFFICULTIES = ['All Levels', 'Junior', 'Mid-Level', 'Senior', 'Lead']

const QUESTION_BANK = [
    {
        id: 'q-1',
        title: 'React 19 Concurrency & Asynchronous Transition Scheduling',
        domain: 'Frontend',
        difficulty: 'Senior',
        estimatedTime: '8 mins',
        prompt: 'How does React 19 handle asset loading and transition scheduling compared to traditional async effects? Explain how useTransition prevents UI blocking during high-priority typing events.',
        tags: ['React 19', 'Concurrency', 'Fiber Tree', 'Performance'],
        keyConcepts: ['Microtask scheduling', 'Fiber reconciliation', 'Transition interruptibility', 'Suspense cache'],
        starTips: {
            situation: 'High-volume autocomplete input on an e-commerce dashboard causing input lag.',
            task: 'Maintain 60fps responsiveness without debouncing input strokes.',
            action: 'Wrapped rendering tree in startTransition and optimized microtasks.',
            result: 'Reduced INP from 380ms to 42ms with zero keystroke dropping.'
        },
        starterCode: `// React 19 Concurrent Transition Example
import { useState, useTransition } from 'react';

export function SearchFilter({ dataset }) {
  const [query, setQuery] = useState('');
  const [filteredData, setFilteredData] = useState(dataset);
  const [isPending, startTransition] = useTransition();

  function handleSearch(e) {
    const value = e.target.value;
    setQuery(value); // High priority update

    startTransition(() => {
      // Low priority concurrent update
      setFilteredData(
        dataset.filter(item => item.name.toLowerCase().includes(value.toLowerCase()))
      );
    });
  }

  return (
    <div>
      <input value={query} onChange={handleSearch} placeholder="Search items..." />
      {isPending && <span>Updating list...</span>}
      <ul>{filteredData.map(i => <li key={i.id}>{i.name}</li>)}</ul>
    </div>
  );
}`
    },
    {
        id: 'q-2',
        title: 'Design a High-Throughput Globally Distributed Rate Limiter',
        domain: 'System Design',
        difficulty: 'Lead',
        estimatedTime: '15 mins',
        prompt: 'Architect a globally distributed rate limiter that handles 500,000 requests per second across 4 continents with under 5ms overhead and localized fallback.',
        tags: ['System Design', 'Sliding Window', 'Token Bucket', 'CAP Theorem', 'Redis'],
        keyConcepts: ['Hierarchical token bucket', 'Sliding window log', 'Asynchronous synchronization', 'CAP trade-offs'],
        starTips: {
            situation: 'API gateway suffered distributed denial of service due to uncoordinated client bursts.',
            task: 'Design localized rate-limiting with global quota sync across multi-region edge nodes.',
            action: 'Implemented Envoy proxy token buckets backed by regional Redis clusters with asynchronous delta gossip.',
            result: 'Prevented 99.8% of abusive spikes with under 2.4ms p99 overhead.'
        },
        starterCode: `// Sliding Window Rate Limiter Prototype
class SlidingWindowRateLimiter {
  constructor(limit = 100, windowMs = 60000) {
    this.limit = limit;
    this.windowMs = windowMs;
    this.requests = new Map();
  }

  isAllowed(clientId) {
    const now = Date.now();
    const windowStart = now - this.windowMs;
    
    if (!this.requests.has(clientId)) {
      this.requests.set(clientId, []);
    }
    
    const timestamps = this.requests.get(clientId).filter(t => t > windowStart);
    this.requests.set(clientId, timestamps);
    
    if (timestamps.length < this.limit) {
      timestamps.push(now);
      return { allowed: true, remaining: this.limit - timestamps.length };
    }
    
    return { allowed: false, remaining: 0 };
  }
}`
    },
    {
        id: 'q-3',
        title: 'Resolving Severe Cross-Functional Engineering Conflict',
        domain: 'Behavioral',
        difficulty: 'Senior',
        estimatedTime: '10 mins',
        prompt: 'Describe a situation where product leadership demanded an aggressive deadline that risked severe architectural tech debt. How did you negotiate and resolve the disagreement?',
        tags: ['STAR Method', 'Conflict Resolution', 'Stakeholder Management', 'Leadership'],
        keyConcepts: ['Trade-off matrix', 'Iterative MVP scoping', 'Executive diplomacy', 'Measurable risk reduction'],
        starTips: {
            situation: 'Product insisted on shipping a real-time collaboration feature in 3 weeks, skipping automated migration tests.',
            task: 'Align engineering quality standards with business launch milestones.',
            action: 'Facilitated a trade-off matrix session, delivering an 80% MVP with decoupled staging flags for phase 2.',
            result: 'Launched on schedule with zero customer-facing regression errors.'
        },
        starterCode: `// Behavioral Note Template
// Structure your response following the STAR framework:
// Situation: Context and organizational challenge
// Task: Responsibility and constraints
// Action: Specific engineering / leadership decisions
// Result: Quantifiable business outcome`
    },
    {
        id: 'q-4',
        title: 'LRU Cache Implementation with O(1) Operations',
        domain: 'Data Structures',
        difficulty: 'Mid-Level',
        estimatedTime: '12 mins',
        prompt: 'Implement a Least Recently Used (LRU) Cache supporting get(key) and put(key, value) in strict O(1) time complexity using a Hash Map and Doubly Linked List.',
        tags: ['LRU Cache', 'Doubly Linked List', 'Hash Map', 'O(1) Time'],
        keyConcepts: ['Doubly linked list sentinel nodes', 'Hash map pointer lookup', 'Node eviction heuristics'],
        starTips: {
            situation: 'In-memory service caching layer was thrashing memory under variable lookup loads.',
            task: 'Design bounded deterministic memory eviction with O(1) performance.',
            action: 'Built custom doubly linked list + map eviction container.',
            result: 'Memory stabilized at 512MB maximum footprint with 0.1ms cache hits.'
        },
        starterCode: `class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.map = new Map(); // Maintains key-value insertion order in JS
  }

  get(key) {
    if (!this.map.has(key)) return -1;
    const val = this.map.get(key);
    this.map.delete(key);
    this.map.set(key, val); // Refresh recency
    return val;
  }

  put(key, value) {
    if (this.map.has(key)) {
      this.map.delete(key);
    } else if (this.map.size >= this.capacity) {
      const oldestKey = this.map.keys().next().value;
      this.map.delete(oldestKey);
    }
    this.map.set(key, value);
  }
}`
    },
    {
        id: 'q-5',
        title: 'Database Isolation Levels & MVCC Concurrency Anomalies',
        domain: 'Databases',
        difficulty: 'Senior',
        estimatedTime: '10 mins',
        prompt: 'Explain how Multi-Version Concurrency Control (MVCC) works in PostgreSQL. Compare Read Committed, Repeatable Read, and Serializable isolation levels regarding Phantom Reads and Write Skew.',
        tags: ['PostgreSQL', 'MVCC', 'ACID', 'Write Skew', 'Locking'],
        keyConcepts: ['Snapshot isolation', 'xmin/xmax transaction visibility', 'Predicate locking', 'Write skew anomalies'],
        starTips: {
            situation: 'High-throughput inventory checkout experienced double-booking anomalies during flash sales.',
            task: 'Eliminate phantom reads and write skew without killing throughput.',
            action: 'Upgraded transaction isolation to Repeatable Read with optimistic row version checks.',
            result: 'Zero overselling incidents across 50,000 simultaneous checkouts.'
        },
        starterCode: `// SQL MVCC Transaction Simulation
-- BEGIN TRANSACTION ISOLATION LEVEL REPEATABLE READ;
-- SELECT balance FROM accounts WHERE user_id = 42;
-- UPDATE accounts SET balance = balance - 100 WHERE user_id = 42;
-- COMMIT;`
    },
    {
        id: 'q-6',
        title: 'Dynamic Programming: Maximum Subarray & Stock Trading',
        domain: 'Algorithms',
        difficulty: 'Mid-Level',
        estimatedTime: '8 mins',
        prompt: 'Given an array of integers representing stock prices, find the maximum profit possible with at most two transactions. Solve with dynamic programming in O(N) time and O(1) auxiliary space.',
        tags: ['Dynamic Programming', 'State Machine', 'Optimization', 'O(N) Time'],
        keyConcepts: ['State machine transition', 'Buy/Sell state array', 'Prefix/Suffix maximization'],
        starTips: {
            situation: 'Financial algorithmic engine needed real-time 2-trade arbitrage evaluation.',
            task: 'Compute optimal dual trade points in sub-millisecond time.',
            action: 'Implemented Kadane state machine in single-pass linear array traversal.',
            result: 'Achieved sub-0.5ms evaluation latency over 100,000 tick bars.'
        },
        starterCode: `function maxProfitTwoTransactions(prices) {
  let hold1 = -Infinity, hold2 = -Infinity;
  let release1 = 0, release2 = 0;

  for (const price of prices) {
    release2 = Math.max(release2, hold2 + price);
    hold2 = Math.max(hold2, release1 - price);
    release1 = Math.max(release1, hold1 + price);
    hold1 = Math.max(hold1, -price);
  }

  return release2;
}`
    }
]

export const Practice = () => {
    const navigate = useNavigate()
    const [selectedDifficulty, setSelectedDifficulty] = useState('All Levels')
    const [selectedDomain, setSelectedDomain] = useState('All Domains')
    const [searchQuery, setSearchQuery] = useState('')

    // Practice Modal / Workspace State
    const [activeQuestion, setActiveQuestion] = useState(null)
    const [workspaceTab, setWorkspaceTab] = useState('voice') // 'voice' | 'star' | 'code' | 'review'
    
    // Audio Recording States
    const [isRecording, setIsRecording] = useState(false)
    const [recordingPaused, setRecordingPaused] = useState(false)
    const [recordingSeconds, setRecordingSeconds] = useState(0)
    const [hasRecorded, setHasRecorded] = useState(false)
    const recordIntervalRef = useRef(null)

    // Live AI Telemetry States
    const [fillerWordCount, setFillerWordCount] = useState(0)
    const [clarityScore, setClarityScore] = useState(92)
    const [completenessScore, setCompletenessScore] = useState(45)
    const [aiHint, setAiHint] = useState('💡 Try explaining the problem and edge constraints before jumping into code.')

    // STAR Form States
    const [starForm, setStarForm] = useState({
        situation: '',
        task: '',
        action: '',
        result: ''
    })

    // Code Sandbox State
    const [codeContent, setCodeContent] = useState('')
    const [codeLanguage, setCodeLanguage] = useState('javascript')
    const [sandboxOutput, setSandboxOutput] = useState(null)

    // Rapid-Fire Timer State
    const [rapidFireActive, setRapidFireActive] = useState(false)
    const [rapidFireSeconds, setRapidFireSeconds] = useState(60)

    // Recording simulation timer
    useEffect(() => {
        if (isRecording && !recordingPaused) {
            recordIntervalRef.current = setInterval(() => {
                setRecordingSeconds(prev => {
                    const next = prev + 1
                    // Dynamic live telemetry simulation
                    if (next === 10) setFillerWordCount(1)
                    if (next === 25) {
                        setFillerWordCount(2)
                        setAiHint('💡 Great pacing. Make sure to articulate your fallback failure plan.')
                    }
                    if (next === 45) {
                        setCompletenessScore(75)
                        setClarityScore(94)
                    }
                    if (next === 70) {
                        setCompletenessScore(90)
                        setAiHint('💡 Strong finish. Wrap up with a crisp summary of trade-offs.')
                    }
                    return next
                })
            }, 1000)
        } else {
            if (recordIntervalRef.current) clearInterval(recordIntervalRef.current)
        }
        return () => {
            if (recordIntervalRef.current) clearInterval(recordIntervalRef.current)
        }
    }, [isRecording, recordingPaused])

    // Rapid Fire countdown
    useEffect(() => {
        let timer
        if (rapidFireActive && rapidFireSeconds > 0) {
            timer = setInterval(() => {
                setRapidFireSeconds(prev => prev - 1)
            }, 1000)
        }
        return () => clearInterval(timer)
    }, [rapidFireActive, rapidFireSeconds])

    // Filter Logic
    const filteredQuestions = useMemo(() => {
        return QUESTION_BANK.filter(q => {
            if (selectedDifficulty !== 'All Levels' && q.difficulty !== selectedDifficulty) {
                return false
            }
            if (selectedDomain !== 'All Domains' && q.domain !== selectedDomain) {
                return false
            }
            if (searchQuery.trim()) {
                const query = searchQuery.toLowerCase().trim()
                const matchTitle = q.title.toLowerCase().includes(query)
                const matchPrompt = q.prompt.toLowerCase().includes(query)
                const matchDomain = q.domain.toLowerCase().includes(query)
                const matchTags = q.tags.some(t => t.toLowerCase().includes(query))
                if (!matchTitle && !matchPrompt && !matchDomain && !matchTags) return false
            }
            return true
        })
    }, [selectedDifficulty, selectedDomain, searchQuery])

    const handleOpenQuestion = (question, mode = 'voice') => {
        setActiveQuestion(question)
        setWorkspaceTab(mode === 'rapid-fire' ? 'voice' : mode === 'sandbox' ? 'code' : mode === 'star-builder' ? 'star' : 'voice')
        setIsRecording(false)
        setRecordingPaused(false)
        setRecordingSeconds(0)
        setHasRecorded(false)
        setFillerWordCount(0)
        setCompletenessScore(30)
        setClarityScore(92)
        setAiHint('💡 Try explaining the problem and edge constraints before jumping into code.')
        setCodeContent(question.starterCode || '')
        setStarForm(question.starTips || { situation: '', task: '', action: '', result: '' })
        setSandboxOutput(null)

        if (mode === 'rapid-fire') {
            setRapidFireActive(true)
            setRapidFireSeconds(60)
            setIsRecording(true)
        } else {
            setRapidFireActive(false)
        }
    }

    const handleCloseWorkspace = () => {
        setActiveQuestion(null)
        setIsRecording(false)
        setRapidFireActive(false)
    }

    const handleStartRecording = () => {
        setIsRecording(true)
        setRecordingPaused(false)
        setHasRecorded(true)
    }

    const handlePauseRecording = () => {
        setRecordingPaused(!recordingPaused)
    }

    const handleStopRecording = () => {
        setIsRecording(false)
        setRecordingPaused(false)
        setWorkspaceTab('review')
    }

    const handleRunCode = () => {
        setSandboxOutput({
            status: 'success',
            runtime: '42ms',
            memory: '14.2 MB',
            testsPassed: '3/3 Tests Passed (100% Correctness)'
        })
    }

    const formatTimer = (sec) => {
        const m = Math.floor(sec / 60)
        const s = Math.floor(sec % 60)
        return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`
    }

    return (
        <div className="bg-[#0b1326] text-[#dae2fd] font-['Inter',sans-serif] antialiased overflow-x-hidden min-h-screen flex selection:bg-[#b8c8e0] selection:text-[#223144]">
            {/* Mobile Top Header */}
            <nav className="md:hidden flex justify-between items-center px-6 py-4 w-full fixed top-0 z-50 bg-[#0b1326]/90 backdrop-blur-xl border-b border-[#334155] shadow-[0_20px_40px_rgba(0,0,0,0.25)]">
                <div onClick={() => navigate('/')} className="font-['Hanken_Grotesk'] text-[20px] font-bold text-[#E2E8F0] cursor-pointer flex items-center gap-2">
                    <span className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-purple-500 flex items-center justify-center text-white text-base font-bold shadow-md shadow-indigo-500/30">
                        AI
                    </span>
                    Interview AI
                </div>
                <button
                    onClick={() => navigate('/interview/setup')}
                    className="p-2 text-[#dae2fd] hover:text-[#b8c8e0] transition-colors"
                >
                    <span className="material-symbols-outlined text-[24px]">add_circle</span>
                </button>
            </nav>

            {/* Desktop Slate Sidebar */}
            <SlateSidebar />

            {/* Main Content Area */}
            <main className="flex-1 md:ml-64 pt-20 md:pt-0 min-h-screen flex flex-col relative pb-20 md:pb-12">
                <div className="scanline"></div>

                {/* Top Desktop Bar */}
                <header className="hidden md:flex justify-between items-center px-8 py-4 border-b border-[#334155] bg-[#0b1326]/80 backdrop-blur-md sticky top-0 z-30">
                    <div className="flex items-center gap-3">
                        <span className="font-['Hanken_Grotesk'] text-lg font-bold text-[#E2E8F0]">
                            Interactive Question Bank & Practice Gym
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-['JetBrains_Mono'] bg-indigo-500/10 text-[#818cf8] border border-indigo-500/20">
                            {filteredQuestions.length} Questions Ready
                        </span>
                    </div>

                    <button
                        onClick={() => navigate('/interview/setup')}
                        className="btn-primary rounded-lg px-4 py-2 font-['JetBrains_Mono'] text-[13px] font-bold flex items-center gap-2"
                    >
                        <span className="material-symbols-outlined text-[16px]">play_arrow</span>
                        Full Simulation
                    </button>
                </header>

                {/* Content Canvas */}
                <div className="p-4 md:p-8 lg:p-10 max-w-[1440px] mx-auto w-full flex-1 flex flex-col gap-6 lg:gap-8">
                    
                    {/* Header Banner */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className="material-symbols-outlined text-[#818cf8] text-[18px]">psychology</span>
                                <span className="font-['JetBrains_Mono'] text-xs uppercase tracking-wider text-[#818cf8] font-bold">
                                    Adaptive Interview Training Environment
                                </span>
                            </div>
                            <h2 className="font-['Hanken_Grotesk'] text-[28px] sm:text-[34px] md:text-[38px] text-[#E2E8F0] font-bold tracking-tight">
                                Question Bank & Practice Modes
                            </h2>
                            <p className="font-['Inter'] text-[15px] text-[#c4c6cd] mt-0.5">
                                Drill technical algorithms, refine STAR leadership stories, or test your reflexes in timed rapid-fire mode with real-time AI telemetry.
                            </p>
                        </div>

                        {/* Top Practice Statistics Pill */}
                        <div className="flex items-center gap-4 bg-[#0F172A] border border-[#334155] px-5 py-3 rounded-2xl shadow-lg self-start md:self-auto">
                            <div className="flex flex-col">
                                <span className="text-[11px] font-['JetBrains_Mono'] text-[#c4c6cd]">Completed</span>
                                <span className="font-['Hanken_Grotesk'] text-lg font-bold text-emerald-400">48 Qs</span>
                            </div>
                            <div className="h-7 w-px bg-[#334155]"></div>
                            <div className="flex flex-col">
                                <span className="text-[11px] font-['JetBrains_Mono'] text-[#c4c6cd]">Avg Score</span>
                                <span className="font-['Hanken_Grotesk'] text-lg font-bold text-[#818cf8]">88%</span>
                            </div>
                            <div className="h-7 w-px bg-[#334155]"></div>
                            <div className="flex flex-col">
                                <span className="text-[11px] font-['JetBrains_Mono'] text-[#c4c6cd]">Streak</span>
                                <span className="font-['Hanken_Grotesk'] text-lg font-bold text-amber-400">7 Days 🔥</span>
                            </div>
                        </div>
                    </div>

                    {/* =========================================================
                        PRACTICE MODE SELECTION CARDS
                    ========================================================= */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        {PRACTICE_MODES.map(mode => (
                            <div
                                key={mode.id}
                                className="glass-panel rounded-2xl p-6 border border-[#334155] hover:border-[#818cf8]/50 hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(0,0,0,0.35)] transition-all duration-300 flex flex-col justify-between gap-5 relative overflow-hidden group"
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl group-hover:bg-indigo-500/20 transition-colors pointer-events-none"></div>

                                <div>
                                    <div className="flex justify-between items-start mb-3">
                                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${mode.color} flex items-center justify-center text-white shadow-md shadow-indigo-500/30`}>
                                            <span className="material-symbols-outlined text-[24px]">{mode.icon}</span>
                                        </div>
                                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-['JetBrains_Mono'] font-bold bg-indigo-500/10 text-[#818cf8] border border-indigo-500/20">
                                            {mode.badge}
                                        </span>
                                    </div>

                                    <h3 className="font-['Hanken_Grotesk'] text-lg font-bold text-[#E2E8F0] mb-1.5 group-hover:text-white transition-colors">
                                        {mode.title}
                                    </h3>
                                    <p className="font-['Inter'] text-xs text-[#c4c6cd] leading-relaxed">
                                        {mode.description}
                                    </p>
                                </div>

                                <div className="flex flex-col gap-3 pt-3 border-t border-[#334155]/60">
                                    <span className="text-[11px] font-['JetBrains_Mono'] text-[#c4c6cd]">
                                        {mode.difficulty}
                                    </span>
                                    <button
                                        onClick={() => handleOpenQuestion(QUESTION_BANK[0], mode.id)}
                                        className="w-full py-2.5 rounded-xl bg-[#0F172A] hover:bg-gradient-to-r hover:from-indigo-600 hover:to-purple-600 border border-[#334155] hover:border-transparent text-xs font-['JetBrains_Mono'] font-bold flex items-center justify-center gap-2 text-[#E2E8F0] hover:text-white transition-all cursor-pointer shadow-sm"
                                    >
                                        <span>Start Practice Mode</span>
                                        <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* =========================================================
                        FILTERING SYSTEM (DIFFICULTY, DOMAINS, SEARCH)
                    ========================================================= */}
                    <div className="glass-panel rounded-2xl p-5 lg:p-6 border border-[#334155] shadow-lg flex flex-col gap-4">
                        
                        {/* Search Bar */}
                        <div className="relative">
                            <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#c4c6cd] text-[18px]">
                                search
                            </span>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search questions by concept (e.g. Concurrency, Rate Limiter, STAR, LRU Cache)..."
                                className="w-full bg-[#0F172A] border border-[#334155] rounded-xl pl-10 pr-10 py-3 font-['Inter'] text-xs md:text-sm text-[#dae2fd] focus:outline-none focus:border-[#6366f1] focus:ring-1 focus:ring-[#6366f1]/50 transition-all placeholder:text-[#c4c6cd]/50"
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery('')}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#c4c6cd] hover:text-white p-1"
                                >
                                    <span className="material-symbols-outlined text-[16px]">close</span>
                                </button>
                            )}
                        </div>

                        {/* Experience Level & Domain Pills */}
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pt-2 border-t border-[#334155]/60">
                            
                            {/* Domain Filter */}
                            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                                <span className="text-xs font-['JetBrains_Mono'] text-[#c4c6cd] shrink-0 font-medium mr-1">
                                    Domain:
                                </span>
                                {DOMAINS.map(domain => (
                                    <button
                                        key={domain}
                                        onClick={() => setSelectedDomain(domain)}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-['JetBrains_Mono'] whitespace-nowrap transition-all cursor-pointer ${
                                            selectedDomain === domain
                                                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold shadow-sm'
                                                : 'bg-[#0F172A] text-[#c4c6cd] hover:text-[#E2E8F0] border border-[#334155]'
                                        }`}
                                    >
                                        {domain}
                                    </button>
                                ))}
                            </div>

                            {/* Difficulty Filter */}
                            <div className="flex items-center gap-2 shrink-0">
                                <span className="text-xs font-['JetBrains_Mono'] text-[#c4c6cd] shrink-0 font-medium">
                                    Level:
                                </span>
                                <div className="flex items-center bg-[#0F172A] p-1 rounded-xl border border-[#334155]">
                                    {DIFFICULTIES.map(lvl => (
                                        <button
                                            key={lvl}
                                            onClick={() => setSelectedDifficulty(lvl)}
                                            className={`px-2.5 py-1 rounded-lg text-xs font-['JetBrains_Mono'] transition-all cursor-pointer ${
                                                selectedDifficulty === lvl
                                                    ? 'bg-indigo-600 text-white font-bold'
                                                    : 'text-[#c4c6cd] hover:text-white'
                                            }`}
                                        >
                                            {lvl}
                                        </button>
                                    ))}
                                </div>
                            </div>

                        </div>

                    </div>

                    {/* =========================================================
                        QUESTION CARDS LIST
                    ========================================================= */}
                    <div className="flex flex-col gap-4">
                        <div className="flex justify-between items-center px-1 text-xs font-['JetBrains_Mono'] text-[#c4c6cd]">
                            <span>Showing {filteredQuestions.length} curated questions</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
                            {filteredQuestions.map(q => (
                                <div
                                    key={q.id}
                                    className="glass-panel rounded-2xl p-5 md:p-6 border border-[#334155] hover:border-indigo-500/50 hover:shadow-lg transition-all flex flex-col justify-between gap-4 group"
                                >
                                    <div>
                                        {/* Top Badges */}
                                        <div className="flex justify-between items-center mb-2.5">
                                            <div className="flex items-center gap-2">
                                                <span className="px-2.5 py-0.5 rounded-md text-[11px] font-['JetBrains_Mono'] font-bold bg-[#171f33] text-[#818cf8] border border-indigo-500/20">
                                                    {q.domain}
                                                </span>
                                                <span className={`px-2 py-0.5 rounded text-[10px] font-['JetBrains_Mono'] font-semibold ${
                                                    q.difficulty === 'Lead' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' :
                                                    q.difficulty === 'Senior' ? 'bg-indigo-500/10 text-[#818cf8] border border-indigo-500/20' :
                                                    'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                                }`}>
                                                    {q.difficulty}
                                                </span>
                                            </div>
                                            <span className="text-[11px] font-['JetBrains_Mono'] text-[#c4c6cd] flex items-center gap-1">
                                                <span className="material-symbols-outlined text-[14px]">schedule</span>
                                                {q.estimatedTime}
                                            </span>
                                        </div>

                                        {/* Title & Prompt */}
                                        <h4 className="font-['Hanken_Grotesk'] text-[16px] font-bold text-[#E2E8F0] group-hover:text-white transition-colors leading-snug">
                                            {q.title}
                                        </h4>
                                        <p className="font-['Inter'] text-xs text-[#c4c6cd] mt-2 line-clamp-2 leading-relaxed">
                                            {q.prompt}
                                        </p>

                                        {/* Tags */}
                                        <div className="flex items-center gap-1.5 flex-wrap mt-3">
                                            {q.tags.map((t, idx) => (
                                                <span key={idx} className="text-[10px] font-['JetBrains_Mono'] px-2 py-0.5 rounded bg-[#0F172A] text-[#dae2fd] border border-[#334155]">
                                                    #{t}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Action Button */}
                                    <div className="pt-3 border-t border-[#334155]/60 flex items-center justify-between">
                                        <span className="text-[11px] font-['JetBrains_Mono'] text-[#818cf8]">
                                            AI Telemetry Ready
                                        </span>
                                        <button
                                            onClick={() => handleOpenQuestion(q, 'voice')}
                                            className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-['JetBrains_Mono'] font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-md shadow-indigo-500/20"
                                        >
                                            <span className="material-symbols-outlined text-[16px]">mic</span>
                                            <span>Practice Question</span>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </main>

            {/* =========================================================
                FOCUSED PRACTICE WORKSPACE MODAL (AUDIO & LIVE AI HINTS)
            ========================================================= */}
            {activeQuestion && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
                    <div className="glass-modal max-w-4xl w-full rounded-2xl border border-[#334155] shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-150">
                        
                        {/* Workspace Header */}
                        <div className="p-5 md:p-6 border-b border-[#334155] bg-[#0F172A]/90 backdrop-blur-md flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-[#818cf8] shrink-0">
                                    <span className="material-symbols-outlined text-[22px]">psychology</span>
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className="px-2 py-0.5 rounded text-[10px] font-['JetBrains_Mono'] font-bold bg-[#171f33] text-[#818cf8]">
                                            {activeQuestion.domain}
                                        </span>
                                        <span className="text-xs font-['JetBrains_Mono'] text-[#c4c6cd]">
                                            {activeQuestion.difficulty} Level
                                        </span>
                                        {rapidFireActive && (
                                            <span className="px-2 py-0.5 rounded text-[10px] font-['JetBrains_Mono'] font-bold bg-red-500/20 text-red-300 animate-pulse border border-red-500/30">
                                                ⏱️ {rapidFireSeconds}s Remaining
                                            </span>
                                        )}
                                    </div>
                                    <h3 className="font-['Hanken_Grotesk'] text-base md:text-lg font-bold text-[#E2E8F0] mt-0.5">
                                        {activeQuestion.title}
                                    </h3>
                                </div>
                            </div>

                            <button
                                onClick={handleCloseWorkspace}
                                className="p-2 text-[#c4c6cd] hover:text-white rounded-lg hover:bg-white/10"
                            >
                                <span className="material-symbols-outlined text-[22px]">close</span>
                            </button>
                        </div>

                        {/* Mode Navigation Tabs Inside Modal */}
                        <div className="flex border-b border-[#334155] bg-[#1E293B]/40 px-6 overflow-x-auto scrollbar-none">
                            {[
                                { id: 'voice', label: 'Audio & Live Hints', icon: 'mic' },
                                { id: 'star', label: 'STAR Method Builder', icon: 'account_tree' },
                                { id: 'code', label: 'Coding Sandbox', icon: 'terminal' },
                                { id: 'review', label: 'AI Review & Score', icon: 'grading' }
                            ].map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setWorkspaceTab(tab.id)}
                                    className={`py-3 px-4 font-['JetBrains_Mono'] text-xs font-semibold flex items-center gap-1.5 border-b-2 transition-all cursor-pointer ${
                                        workspaceTab === tab.id
                                            ? 'text-[#818cf8] border-[#818cf8] bg-indigo-500/5'
                                            : 'text-[#c4c6cd] border-transparent hover:text-white'
                                    }`}
                                >
                                    <span className="material-symbols-outlined text-[16px]">{tab.icon}</span>
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        {/* Workspace Body */}
                        <div className="p-6 overflow-y-auto flex-1 flex flex-col gap-6">
                            
                            {/* Question Prompt Box */}
                            <div className="p-4 rounded-xl bg-[#0F172A] border border-[#334155] text-xs font-['Inter'] text-[#dae2fd] leading-relaxed">
                                <span className="text-[#818cf8] font-bold font-['JetBrains_Mono'] block mb-1">INTERVIEW PROMPT:</span>
                                {activeQuestion.prompt}
                            </div>

                            {/* =========================================================
                                TAB 1: AUDIO RECORDING & REAL-TIME AI TELEMETRY
                            ========================================================= */}
                            {workspaceTab === 'voice' && (
                                <div className="flex flex-col gap-6">
                                    
                                    {/* Live Recording Panel */}
                                    <div className="glass-panel rounded-2xl p-6 border border-[#334155] flex flex-col items-center justify-center text-center gap-5">
                                        
                                        {/* Waveform Visualizer */}
                                        <div className="h-16 w-full max-w-lg bg-[#020617] rounded-xl border border-[#334155] flex items-center justify-center gap-1 px-4 overflow-hidden">
                                            {Array.from({ length: 36 }).map((_, idx) => {
                                                const height = isRecording && !recordingPaused
                                                    ? Math.sin(idx * 0.4 + recordingSeconds) * 40 + 50
                                                    : 18
                                                return (
                                                    <div
                                                        key={idx}
                                                        className={`w-1 rounded-full transition-all duration-150 ${
                                                            isRecording && !recordingPaused ? 'bg-gradient-to-t from-indigo-500 to-purple-400' : 'bg-slate-700'
                                                        }`}
                                                        style={{ height: `${height}%` }}
                                                    />
                                                )
                                            })}
                                        </div>

                                        {/* Recording Duration Timer */}
                                        <div className="flex flex-col items-center">
                                            <div className="font-['JetBrains_Mono'] text-3xl font-bold text-[#E2E8F0]">
                                                {formatTimer(recordingSeconds)}
                                            </div>
                                            <span className="text-xs font-['JetBrains_Mono'] text-[#818cf8] mt-1">
                                                {isRecording && !recordingPaused ? '🔴 Live Recording & Telemetry...' : recordingPaused ? '⏸️ Recording Paused' : 'Ready to record'}
                                            </span>
                                        </div>

                                        {/* Controls */}
                                        <div className="flex items-center gap-4">
                                            {!isRecording ? (
                                                <button
                                                    onClick={handleStartRecording}
                                                    className="px-6 py-3.5 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-['JetBrains_Mono'] text-xs font-bold flex items-center gap-2 shadow-lg shadow-indigo-500/40 hover:scale-105 transition-all cursor-pointer"
                                                >
                                                    <span className="material-symbols-outlined text-[20px]">mic</span>
                                                    <span>{hasRecorded ? 'Record Again' : 'Start Recording Response'}</span>
                                                </button>
                                            ) : (
                                                <>
                                                    <button
                                                        onClick={handlePauseRecording}
                                                        className="px-4 py-2.5 rounded-xl btn-secondary text-xs font-['JetBrains_Mono'] font-bold flex items-center gap-1.5 cursor-pointer"
                                                    >
                                                        <span className="material-symbols-outlined text-[18px]">
                                                            {recordingPaused ? 'play_arrow' : 'pause'}
                                                        </span>
                                                        <span>{recordingPaused ? 'Resume' : 'Pause'}</span>
                                                    </button>

                                                    <button
                                                        onClick={handleStopRecording}
                                                        className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-['JetBrains_Mono'] font-bold flex items-center gap-1.5 shadow-lg shadow-red-600/30 cursor-pointer"
                                                    >
                                                        <span className="material-symbols-outlined text-[18px]">stop</span>
                                                        <span>Stop & Analyze AI Response</span>
                                                    </button>
                                                </>
                                            )}
                                        </div>

                                    </div>

                                    {/* Real-Time Live AI Telemetry & Hints */}
                                    <div className="glass-panel rounded-2xl p-5 border border-indigo-500/30 bg-indigo-950/10 flex flex-col gap-4">
                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center gap-2">
                                                <span className="material-symbols-outlined text-[#818cf8] text-[20px] animate-pulse">
                                                    sensors
                                                </span>
                                                <h4 className="font-['Hanken_Grotesk'] text-sm font-bold text-[#E2E8F0]">
                                                    Live AI Telemetry & Real-Time Coaching
                                                </h4>
                                            </div>
                                            <span className="text-[11px] font-['JetBrains_Mono'] text-emerald-400">
                                                Acoustic Engine Active
                                            </span>
                                        </div>

                                        {/* Telemetry Metrics Row */}
                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-['JetBrains_Mono']">
                                            <div className="p-2.5 rounded-lg bg-[#0F172A] border border-[#334155] text-center">
                                                <span className="text-[#c4c6cd] text-[10px] block">Filler Words</span>
                                                <span className="font-bold text-amber-400 text-base">{fillerWordCount} detected</span>
                                            </div>
                                            <div className="p-2.5 rounded-lg bg-[#0F172A] border border-[#334155] text-center">
                                                <span className="text-[#c4c6cd] text-[10px] block">Clarity Rating</span>
                                                <span className="font-bold text-emerald-400 text-base">{clarityScore}%</span>
                                            </div>
                                            <div className="p-2.5 rounded-lg bg-[#0F172A] border border-[#334155] text-center">
                                                <span className="text-[#c4c6cd] text-[10px] block">Completeness</span>
                                                <span className="font-bold text-[#818cf8] text-base">{completenessScore}%</span>
                                            </div>
                                            <div className="p-2.5 rounded-lg bg-[#0F172A] border border-[#334155] text-center">
                                                <span className="text-[#c4c6cd] text-[10px] block">Cadence</span>
                                                <span className="font-bold text-purple-400 text-base">Optimal</span>
                                            </div>
                                        </div>

                                        {/* Dynamic Live AI Hint Card */}
                                        <div className="p-3.5 rounded-xl bg-[#0F172A] border border-indigo-500/40 flex items-start gap-3">
                                            <span className="material-symbols-outlined text-[#818cf8] text-[20px] shrink-0 mt-0.5">
                                                lightbulb
                                            </span>
                                            <div className="text-xs font-['Inter'] text-[#dae2fd]">
                                                <strong className="text-[#818cf8] font-['JetBrains_Mono'] block mb-0.5">LIVE COACHING CUE:</strong>
                                                {aiHint}
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            )}

                            {/* =========================================================
                                TAB 2: STAR METHOD BEHAVIORAL BUILDER
                            ========================================================= */}
                            {workspaceTab === 'star' && (
                                <div className="flex flex-col gap-4">
                                    <p className="text-xs font-['Inter'] text-[#c4c6cd]">
                                        Structure your response into clear executive pillars. The AI dynamically validates your impact metrics.
                                    </p>

                                    <div className="grid grid-cols-1 gap-3.5">
                                        {[
                                            { key: 'situation', label: 'S — Situation', placeholder: 'Describe the context, company situation, and the core challenge...' },
                                            { key: 'task', label: 'T — Task', placeholder: 'What was your specific responsibility and constraints?' },
                                            { key: 'action', label: 'A — Action', placeholder: 'What specific engineering or leadership steps did you execute?' },
                                            { key: 'result', label: 'R — Result', placeholder: 'Quantify the outcome (e.g. latency reduced by 40%, zero regression)...' }
                                        ].map(field => (
                                            <div key={field.key} className="flex flex-col gap-1.5">
                                                <label className="text-xs font-['JetBrains_Mono'] font-bold text-[#818cf8]">
                                                    {field.label}
                                                </label>
                                                <textarea
                                                    rows={2}
                                                    value={starForm[field.key]}
                                                    onChange={(e) => setStarForm({ ...starForm, [field.key]: e.target.value })}
                                                    placeholder={field.placeholder}
                                                    className="w-full bg-[#0F172A] border border-[#334155] rounded-xl p-3 font-['Inter'] text-xs text-[#dae2fd] focus:outline-none focus:border-[#6366f1] resize-none"
                                                />
                                            </div>
                                        ))}
                                    </div>

                                    <button
                                        onClick={() => setWorkspaceTab('voice')}
                                        className="btn-primary py-2.5 rounded-xl text-xs font-['JetBrains_Mono'] font-bold flex items-center justify-center gap-2 self-end mt-2"
                                    >
                                        <span>Practice Speaking STAR Story</span>
                                        <span className="material-symbols-outlined text-[16px]">mic</span>
                                    </button>
                                </div>
                            )}

                            {/* =========================================================
                                TAB 3: CODING SANDBOX / WHITEBOARD
                            ========================================================= */}
                            {workspaceTab === 'code' && (
                                <div className="flex flex-col gap-4">
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-['JetBrains_Mono'] text-[#c4c6cd]">Language:</span>
                                            <select
                                                value={codeLanguage}
                                                onChange={(e) => setCodeLanguage(e.target.value)}
                                                className="bg-[#0F172A] border border-[#334155] rounded-lg px-2.5 py-1 text-xs font-['JetBrains_Mono'] text-[#dae2fd] focus:outline-none"
                                            >
                                                <option value="javascript">JavaScript (ES2024)</option>
                                                <option value="typescript">TypeScript</option>
                                                <option value="python">Python 3.12</option>
                                                <option value="go">Go 1.22</option>
                                            </select>
                                        </div>

                                        <button
                                            onClick={handleRunCode}
                                            className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-['JetBrains_Mono'] text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md"
                                        >
                                            <span className="material-symbols-outlined text-[16px]">play_arrow</span>
                                            Run & Validate Code
                                        </button>
                                    </div>

                                    {/* Monospace Editor */}
                                    <textarea
                                        value={codeContent}
                                        onChange={(e) => setCodeContent(e.target.value)}
                                        rows={12}
                                        className="w-full bg-[#020617] border border-[#334155] rounded-xl p-4 font-['JetBrains_Mono'] text-xs text-emerald-300 focus:outline-none focus:border-indigo-500 font-mono leading-relaxed"
                                    />

                                    {/* Execution Output */}
                                    {sandboxOutput && (
                                        <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-500/40 text-xs font-['JetBrains_Mono'] text-emerald-300 flex justify-between items-center">
                                            <span>✓ {sandboxOutput.testsPassed}</span>
                                            <span className="text-[#c4c6cd]">Runtime: {sandboxOutput.runtime} • Memory: {sandboxOutput.memory}</span>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* =========================================================
                                TAB 4: AI POST-RESPONSE EVALUATION & REVIEW
                            ========================================================= */}
                            {workspaceTab === 'review' && (
                                <div className="flex flex-col gap-5">
                                    <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 flex items-center justify-between">
                                        <div>
                                            <h4 className="font-['Hanken_Grotesk'] text-base font-bold text-emerald-300">
                                                AI Response Evaluation Generated
                                            </h4>
                                            <p className="font-['Inter'] text-xs text-[#c4c6cd]">
                                                Analyzed {recordingSeconds}s audio recording across clarity, structure, and algorithmic depth.
                                            </p>
                                        </div>
                                        <div className="font-['Hanken_Grotesk'] text-2xl font-bold text-emerald-400">
                                            91 / 100
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-3 gap-3 text-xs font-['JetBrains_Mono']">
                                        <div className="p-3 rounded-xl bg-[#0F172A] border border-[#334155] text-center">
                                            <span className="text-[#c4c6cd] text-[10px]">Technical Accuracy</span>
                                            <div className="font-bold text-indigo-400 text-lg">94%</div>
                                        </div>
                                        <div className="p-3 rounded-xl bg-[#0F172A] border border-[#334155] text-center">
                                            <span className="text-[#c4c6cd] text-[10px]">Speech & Fluency</span>
                                            <div className="font-bold text-purple-400 text-lg">88%</div>
                                        </div>
                                        <div className="p-3 rounded-xl bg-[#0F172A] border border-[#334155] text-center">
                                            <span className="text-[#c4c6cd] text-[10px]">Structure & STAR</span>
                                            <div className="font-bold text-emerald-400 text-lg">92%</div>
                                        </div>
                                    </div>

                                    <div className="p-4 rounded-xl bg-[#0F172A] border border-[#334155] text-xs font-['Inter'] text-[#dae2fd] leading-relaxed">
                                        💡 <strong>AI Feedback:</strong> Excellent articulation of race condition mitigations. You structured your thoughts logically and addressed the core invariants. Next time, aim to explicitly state the time complexity tradeoffs before finishing.
                                    </div>

                                    <div className="flex justify-end gap-3 pt-2">
                                        <button
                                            onClick={() => setWorkspaceTab('voice')}
                                            className="btn-secondary px-4 py-2 rounded-xl text-xs font-['JetBrains_Mono'] font-bold"
                                        >
                                            Try Again
                                        </button>
                                        <button
                                            onClick={handleCloseWorkspace}
                                            className="btn-primary px-5 py-2 rounded-xl text-xs font-['JetBrains_Mono'] font-bold"
                                        >
                                            Next Question
                                        </button>
                                    </div>
                                </div>
                            )}

                        </div>

                    </div>
                </div>
            )}

            {/* Mobile Bottom Navigation */}
            <nav className="md:hidden fixed bottom-0 w-full bg-[#0F172A]/95 backdrop-blur-xl border-t border-[#334155] flex justify-around items-center py-3 px-4 z-50">
                <button onClick={() => navigate('/dashboard')} className="flex flex-col items-center gap-1 text-[#c4c6cd] hover:text-[#E2E8F0]">
                    <span className="material-symbols-outlined text-[20px]">dashboard</span>
                    <span className="text-[10px] font-['JetBrains_Mono']">Overview</span>
                </button>
                <button onClick={() => navigate('/history')} className="flex flex-col items-center gap-1 text-[#c4c6cd] hover:text-[#E2E8F0]">
                    <span className="material-symbols-outlined text-[20px]">history</span>
                    <span className="text-[10px] font-['JetBrains_Mono']">History</span>
                </button>
                <button onClick={() => navigate('/practice')} className="flex flex-col items-center gap-1 text-[#818cf8]">
                    <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                        psychology
                    </span>
                    <span className="text-[10px] font-['JetBrains_Mono']">Practice</span>
                </button>
                <button onClick={() => navigate('/resume')} className="flex flex-col items-center gap-1 text-[#c4c6cd] hover:text-[#E2E8F0]">
                    <span className="material-symbols-outlined text-[20px]">description</span>
                    <span className="text-[10px] font-['JetBrains_Mono']">Resume</span>
                </button>
            </nav>
        </div>
    )
}

export default Practice
