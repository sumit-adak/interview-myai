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
        color: 'bg-blue-600',
        badge: 'High Pressure'
    },
    {
        id: 'sandbox',
        title: 'Coding Sandbox & Whiteboard',
        icon: 'terminal',
        description: 'Interactive code editor and architectural whiteboard interface for live algorithmic problem solving.',
        difficulty: 'Interactive IDE • Multi-Language',
        color: 'bg-blue-700',
        badge: 'Technical & DSA'
    },
    {
        id: 'star-builder',
        title: 'STAR Method Behavioral Builder',
        icon: 'psychology',
        description: 'Structure behavioral narratives step-by-step across Situation, Task, Action, and Result.',
        difficulty: 'Guided Rubric • Executive Framing',
        color: 'bg-blue-800',
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
      <input value={query} onChange={handleSearch} placeholder="Type to filter..." />
      {isPending && <p>Scheduling render...</p>}
      <ul>{filteredData.map(d => <li key={d.id}>{d.name}</li>)}</ul>
    </div>
  );
}`
    },
    {
        id: 'q-2',
        title: 'Distributed Rate Limiter Design with Sliding Window Logs',
        domain: 'System Design',
        difficulty: 'Lead',
        estimatedTime: '12 mins',
        prompt: 'Design a high-throughput API rate limiter operating across 20 global regions. Compare Redis Sliding Window Counter vs Token Bucket, accounting for clock drift and Redis clustering latency.',
        tags: ['System Design', 'Rate Limiting', 'Redis', 'Sliding Window', 'Distributed Systems'],
        keyConcepts: ['Redis sorted sets (ZSET)', 'Lua atomic script execution', 'Clock skew drift', 'Local in-memory fallback'],
        starTips: {
            situation: 'Flash traffic surges flooded payment gateway APIs, exceeding downstream partner throttles.',
            task: 'Protect payment APIs under 150,000 requests/sec with minimal Redis roundtrips.',
            action: 'Implemented Redis Lua sliding window log with local token bucket micro-caching.',
            result: '99.999% SLA maintained with P99 rate-limiter latency under 1.2ms.'
        },
        starterCode: `-- Redis Sliding Window Log Lua Script
local key = KEYS[1]
local now = tonumber(ARGV[1])
local window = tonumber(ARGV[2])
local limit = tonumber(ARGV[3])
local clearBefore = now - window

redis.call('ZREMRANGEBYSCORE', key, 0, clearBefore)
local currentRequests = redis.call('ZCARD', key)

if currentRequests < limit then
  redis.call('ZADD', key, now, now)
  redis.call('EXPIRE', key, math.ceil(window / 1000))
  return 1
else
  return 0
end`
    },
    {
        id: 'q-3',
        title: 'STAR Method: Overcoming Cross-Team Technical Disagreements',
        domain: 'Behavioral',
        difficulty: 'Senior',
        estimatedTime: '6 mins',
        prompt: 'Tell me about a time when an engineering team fiercely opposed your proposed technical architecture. How did you de-escalate the conflict, build alignment, and validate the outcome?',
        tags: ['STAR Method', 'Leadership', 'Conflict Resolution', 'Cross-Functional Alignment'],
        keyConcepts: ['Objective benchmark data', 'Empathy & listening', 'RFC consensus loop', 'Measured rollout phases'],
        starTips: {
            situation: 'Mobile and Web teams locked in stalemate over GraphQL Federation vs REST BFF microservices.',
            task: 'Align 18 engineers across 3 squads on a unified contract within 2 weeks.',
            action: 'Organized proof-of-concept benchmark sprint comparing schema stitching vs GraphQL Gateway latency.',
            result: 'Unanimous consensus reached on Apollo Federation; reduced duplicate endpoints by 65%.'
        },
        starterCode: `// STAR Behavioral Structure
// Situation: The context & initial friction
// Task: What you were personally accountable for delivering
// Action: Concrete steps, data-driven prototyping, and team consensus building
// Result: Verifiable business & engineering outcomes with measurable metrics`
    },
    {
        id: 'q-4',
        title: 'Node.js Event Loop Microtask Starvation & Garbage Collection',
        domain: 'Backend',
        difficulty: 'Senior',
        estimatedTime: '7 mins',
        prompt: 'How does Node.js prioritize process.nextTick vs Promise.then vs setImmediate? What symptoms indicate V8 GC pause spikes under heavy heap allocation, and how would you diagnose them?',
        tags: ['Node.js', 'Event Loop', 'Libuv', 'V8 Engine', 'Garbage Collection'],
        keyConcepts: ['Microtask queue drain', 'Libuv poll phase', 'V8 Young/Old generation GC', 'Heap snapshot profiling'],
        starTips: {
            situation: 'WebSocket real-time server suffered intermittent 400ms heartbeat packet drops.',
            task: 'Identify event loop blocking culprits without restarting the cluster.',
            action: 'Profiled with clinic.js and diagnosed runaway nextTick recursive chain starving libuv I/O.',
            result: 'Converted to setImmediate batching; dropped P99 event loop delay from 420ms to 4ms.'
        },
        starterCode: `// Event Loop Microtask Priority Demonstration
console.log('1. Script start');

setTimeout(() => console.log('2. setTimeout 0'), 0);
setImmediate(() => console.log('3. setImmediate'));

Promise.resolve().then(() => console.log('4. Promise microtask'));
process.nextTick(() => console.log('5. nextTick microtask'));

console.log('6. Script end');`
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
        starterCode: `-- SQL MVCC Transaction Simulation
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
                    if (next === 10) setFillerWordCount(1)
                    if (next === 25) {
                        setFillerWordCount(2)
                        setAiHint('⚡ Good technical depth. Now clarify the trade-off vs an alternative architecture.')
                    }
                    if (next === 40) {
                        setCompletenessScore(75)
                        setAiHint('🎯 Excellent progress. Wrap up with concrete metrics and verification.')
                    }
                    return next
                })
            }, 1000)
        } else {
            clearInterval(recordIntervalRef.current)
        }
        return () => clearInterval(recordIntervalRef.current)
    }, [isRecording, recordingPaused])

    // Rapid-fire countdown
    useEffect(() => {
        if (rapidFireActive && rapidFireSeconds > 0 && isRecording) {
            const timer = setInterval(() => {
                setRapidFireSeconds(prev => {
                    if (prev <= 1) {
                        clearInterval(timer)
                        handleStopRecording()
                        return 0
                    }
                    return prev - 1
                })
            }, 1000)
            return () => clearInterval(timer)
        }
    }, [rapidFireActive, rapidFireSeconds, isRecording])

    // Filter questions
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
        <div className="bg-[#FAF8F5] text-[#0F172A] font-['Inter',sans-serif] antialiased overflow-x-hidden min-h-screen flex selection:bg-blue-100 selection:text-blue-900">
            {/* Mobile Top Header */}
            <nav className="md:hidden flex justify-between items-center px-6 py-4 w-full fixed top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-[#E8E4DC] shadow-sm">
                <div onClick={() => navigate('/')} className="font-['Hanken_Grotesk'] text-[20px] font-bold text-[#0F172A] cursor-pointer flex items-center gap-2">
                    <span className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white text-base font-bold shadow-sm">
                        AI
                    </span>
                    Interview AI
                </div>
                <button
                    onClick={() => navigate('/interview/setup')}
                    className="p-2 text-[#0F172A] hover:text-blue-600 transition-colors"
                >
                    <span className="material-symbols-outlined text-[24px]">add_circle</span>
                </button>
            </nav>

            {/* Desktop Slate Sidebar */}
            <SlateSidebar />

            {/* Main Content Area */}
            <main className="flex-1 md:ml-64 pt-20 md:pt-0 min-h-screen flex flex-col relative pb-20 md:pb-12">
                {/* Top Desktop Bar */}
                <header className="hidden md:flex justify-between items-center px-8 py-4 border-b border-[#E8E4DC] bg-white/80 backdrop-blur-md sticky top-0 z-30">
                    <div className="flex items-center gap-3">
                        <span className="font-['Hanken_Grotesk'] text-lg font-bold text-[#0F172A]">
                            Interactive Question Bank & Practice Gym
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-['JetBrains_Mono'] bg-blue-50 text-blue-700 border border-blue-200 font-semibold">
                            {filteredQuestions.length} Questions Ready
                        </span>
                    </div>

                    <button
                        onClick={() => navigate('/interview/setup')}
                        className="btn-primary rounded-xl px-4 py-2 font-['JetBrains_Mono'] text-[13px] font-semibold flex items-center gap-2 shadow-sm"
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
                                <span className="material-symbols-outlined text-blue-600 text-[18px]">psychology</span>
                                <span className="font-['JetBrains_Mono'] text-xs uppercase tracking-wider text-blue-700 font-bold">
                                    Adaptive Interview Training Environment
                                </span>
                            </div>
                            <h2 className="font-['Hanken_Grotesk'] text-[28px] sm:text-[34px] md:text-[38px] text-[#0F172A] font-bold tracking-tight">
                                Question Bank & Practice Modes
                            </h2>
                            <p className="font-['Inter'] text-[15px] text-[#64748B] mt-0.5">
                                Drill technical algorithms, refine STAR leadership stories, or test your reflexes in timed rapid-fire mode with real-time AI telemetry.
                            </p>
                        </div>

                        {/* Top Practice Statistics Pill */}
                        <div className="flex items-center gap-4 bg-white border border-[#E8E4DC] px-5 py-3 rounded-2xl shadow-sm self-start md:self-auto">
                            <div className="flex flex-col">
                                <span className="text-[11px] font-['JetBrains_Mono'] text-[#64748B]">Completed</span>
                                <span className="font-['Hanken_Grotesk'] text-lg font-bold text-emerald-600">48 Qs</span>
                            </div>
                            <div className="h-7 w-px bg-[#E8E4DC]"></div>
                            <div className="flex flex-col">
                                <span className="text-[11px] font-['JetBrains_Mono'] text-[#64748B]">Avg Score</span>
                                <span className="font-['Hanken_Grotesk'] text-lg font-bold text-blue-600">88%</span>
                            </div>
                            <div className="h-7 w-px bg-[#E8E4DC]"></div>
                            <div className="flex flex-col">
                                <span className="text-[11px] font-['JetBrains_Mono'] text-[#64748B]">Streak</span>
                                <span className="font-['Hanken_Grotesk'] text-lg font-bold text-amber-600">7 Days 🔥</span>
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
                                className="bg-white rounded-2xl p-6 border border-[#E8E4DC] hover:border-blue-300 hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 flex flex-col justify-between gap-5 relative overflow-hidden group shadow-sm"
                            >
                                <div>
                                    <div className="flex justify-between items-start mb-3">
                                        <div className={`w-12 h-12 rounded-xl ${mode.color} flex items-center justify-center text-white shadow-sm`}>
                                            <span className="material-symbols-outlined text-[24px]">{mode.icon}</span>
                                        </div>
                                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-['JetBrains_Mono'] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                                            {mode.badge}
                                        </span>
                                    </div>

                                    <h3 className="font-['Hanken_Grotesk'] text-lg font-bold text-[#0F172A] mb-1.5 group-hover:text-blue-600 transition-colors">
                                        {mode.title}
                                    </h3>
                                    <p className="font-['Inter'] text-xs text-[#64748B] leading-relaxed">
                                        {mode.description}
                                    </p>
                                </div>

                                <div className="flex flex-col gap-3 pt-3 border-t border-[#E8E4DC]">
                                    <span className="text-[11px] font-['JetBrains_Mono'] text-[#64748B]">
                                        {mode.difficulty}
                                    </span>
                                    <button
                                        onClick={() => handleOpenQuestion(QUESTION_BANK[0], mode.id)}
                                        className="w-full py-2.5 rounded-xl bg-[#FAF8F5] hover:bg-blue-600 border border-[#E8E4DC] hover:border-transparent text-xs font-['JetBrains_Mono'] font-semibold flex items-center justify-center gap-2 text-[#0F172A] hover:text-white transition-all cursor-pointer shadow-sm"
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
                    <div className="bg-white rounded-2xl p-5 lg:p-6 border border-[#E8E4DC] shadow-sm flex flex-col gap-4">
                        
                        {/* Search Bar */}
                        <div className="relative">
                            <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8] text-[18px]">
                                search
                            </span>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search questions by concept (e.g. Concurrency, Rate Limiter, STAR, LRU Cache)..."
                                className="w-full bg-[#FAF8F5] border border-[#D8D2C7] rounded-xl pl-10 pr-10 py-3 font-['Inter'] text-xs md:text-sm text-[#0F172A] focus:outline-none focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all placeholder:text-[#94A3B8]"
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery('')}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-[#0F172A] p-1"
                                >
                                    <span className="material-symbols-outlined text-[16px]">close</span>
                                </button>
                            )}
                        </div>

                        {/* Experience Level & Domain Pills */}
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pt-2 border-t border-[#E8E4DC]">
                            
                            {/* Domain Filter */}
                            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                                <span className="text-xs font-['JetBrains_Mono'] text-[#64748B] shrink-0 font-medium mr-1">
                                    Domain:
                                </span>
                                {DOMAINS.map(domain => (
                                    <button
                                        key={domain}
                                        onClick={() => setSelectedDomain(domain)}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-['JetBrains_Mono'] whitespace-nowrap transition-all cursor-pointer ${
                                            selectedDomain === domain
                                                ? 'bg-blue-600 text-white font-bold shadow-sm'
                                                : 'bg-[#F5F2EB] text-[#475569] hover:text-[#0F172A] border border-[#E2DDD5]'
                                        }`}
                                    >
                                        {domain}
                                    </button>
                                ))}
                            </div>

                            {/* Difficulty Filter */}
                            <div className="flex items-center gap-2 shrink-0">
                                <span className="text-xs font-['JetBrains_Mono'] text-[#64748B] shrink-0 font-medium">
                                    Level:
                                </span>
                                <div className="flex items-center bg-[#F5F2EB] p-1 rounded-xl border border-[#E2DDD5]">
                                    {DIFFICULTIES.map(lvl => (
                                        <button
                                            key={lvl}
                                            onClick={() => setSelectedDifficulty(lvl)}
                                            className={`px-2.5 py-1 rounded-lg text-xs font-['JetBrains_Mono'] transition-all cursor-pointer ${
                                                selectedDifficulty === lvl
                                                    ? 'bg-blue-600 text-white font-bold shadow-sm'
                                                    : 'text-[#64748B] hover:text-[#0F172A]'
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
                        <div className="flex justify-between items-center px-1 text-xs font-['JetBrains_Mono'] text-[#64748B]">
                            <span>Showing {filteredQuestions.length} curated questions</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
                            {filteredQuestions.map(q => (
                                <div
                                    key={q.id}
                                    className="bg-white rounded-2xl p-5 md:p-6 border border-[#E8E4DC] hover:border-blue-300 hover:shadow-md transition-all flex flex-col justify-between gap-4 group shadow-sm"
                                >
                                    <div>
                                        {/* Top Badges */}
                                        <div className="flex justify-between items-center mb-2.5">
                                            <div className="flex items-center gap-2">
                                                <span className="px-2.5 py-0.5 rounded-md text-[11px] font-['JetBrains_Mono'] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                                                    {q.domain}
                                                </span>
                                                <span className={`px-2 py-0.5 rounded text-[10px] font-['JetBrains_Mono'] font-semibold ${
                                                    q.difficulty === 'Lead' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                                                    q.difficulty === 'Senior' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                                                    'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                                }`}>
                                                    {q.difficulty}
                                                </span>
                                            </div>
                                            <span className="text-[11px] font-['JetBrains_Mono'] text-[#64748B] flex items-center gap-1">
                                                <span className="material-symbols-outlined text-[14px]">schedule</span>
                                                {q.estimatedTime}
                                            </span>
                                        </div>

                                        {/* Title & Prompt */}
                                        <h4 className="font-['Hanken_Grotesk'] text-[16px] font-bold text-[#0F172A] group-hover:text-blue-600 transition-colors leading-snug">
                                            {q.title}
                                        </h4>
                                        <p className="font-['Inter'] text-xs text-[#475569] mt-2 line-clamp-2 leading-relaxed">
                                            {q.prompt}
                                        </p>

                                        {/* Tags */}
                                        <div className="flex items-center gap-1.5 flex-wrap mt-3">
                                            {q.tags.map((t, idx) => (
                                                <span key={idx} className="text-[10px] font-['JetBrains_Mono'] px-2 py-0.5 rounded bg-[#FAF8F5] text-[#475569] border border-[#E8E4DC]">
                                                    #{t}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Action Button */}
                                    <div className="pt-3 border-t border-[#E8E4DC] flex items-center justify-between">
                                        <span className="text-[11px] font-['JetBrains_Mono'] text-blue-600 font-semibold">
                                            AI Telemetry Ready
                                        </span>
                                        <button
                                            onClick={() => handleOpenQuestion(q, 'voice')}
                                            className="px-4 py-2 rounded-xl btn-primary text-white text-xs font-['JetBrains_Mono'] font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm hover:bg-blue-700"
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
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white max-w-4xl w-full rounded-2xl border border-[#E8E4DC] shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-150">
                        
                        {/* Workspace Header */}
                        <div className="p-5 md:p-6 border-b border-[#E8E4DC] bg-[#FAF8F5] flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shrink-0">
                                    <span className="material-symbols-outlined text-[22px]">psychology</span>
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className="px-2 py-0.5 rounded text-[10px] font-['JetBrains_Mono'] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                                            {activeQuestion.domain}
                                        </span>
                                        <span className="text-xs font-['JetBrains_Mono'] text-[#64748B]">
                                            {activeQuestion.difficulty} Level
                                        </span>
                                        {rapidFireActive && (
                                            <span className="px-2 py-0.5 rounded text-[10px] font-['JetBrains_Mono'] font-bold bg-red-50 text-red-700 border border-red-200">
                                                ⏱️ {rapidFireSeconds}s Remaining
                                            </span>
                                        )}
                                    </div>
                                    <h3 className="font-['Hanken_Grotesk'] text-base md:text-lg font-bold text-[#0F172A] mt-0.5">
                                        {activeQuestion.title}
                                    </h3>
                                </div>
                            </div>

                            <button
                                onClick={handleCloseWorkspace}
                                className="p-2 text-[#64748B] hover:text-[#0F172A] rounded-lg hover:bg-[#F5F2EB]"
                            >
                                <span className="material-symbols-outlined text-[22px]">close</span>
                            </button>
                        </div>

                        {/* Mode Navigation Tabs Inside Modal */}
                        <div className="flex border-b border-[#E8E4DC] bg-white px-6 overflow-x-auto scrollbar-none">
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
                                            ? 'text-blue-600 border-blue-600 bg-blue-50/50'
                                            : 'text-[#64748B] border-transparent hover:text-[#0F172A]'
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
                            <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E8E4DC] text-xs font-['Inter'] text-[#0F172A] leading-relaxed">
                                <span className="text-blue-700 font-bold font-['JetBrains_Mono'] block mb-1">INTERVIEW PROMPT:</span>
                                {activeQuestion.prompt}
                            </div>

                            {/* TAB 1: AUDIO RECORDING & REAL-TIME AI TELEMETRY */}
                            {workspaceTab === 'voice' && (
                                <div className="flex flex-col gap-6">
                                    {/* Live Recording Panel */}
                                    <div className="bg-white rounded-2xl p-6 border border-[#E8E4DC] shadow-sm flex flex-col items-center justify-center text-center gap-5">
                                        {/* Waveform Visualizer */}
                                        <div className="h-16 w-full max-w-lg bg-[#FAF8F5] rounded-xl border border-[#E8E4DC] flex items-center justify-center gap-1 px-4 overflow-hidden">
                                            {Array.from({ length: 36 }).map((_, idx) => {
                                                const height = isRecording && !recordingPaused
                                                    ? Math.sin(idx * 0.4 + recordingSeconds) * 40 + 50
                                                    : 18
                                                return (
                                                    <div
                                                        key={idx}
                                                        className={`w-1 rounded-full transition-all duration-150 ${
                                                            isRecording && !recordingPaused ? 'bg-blue-600' : 'bg-slate-300'
                                                        }`}
                                                        style={{ height: `${height}%` }}
                                                    />
                                                )
                                            })}
                                        </div>

                                        {/* Recording Duration Timer */}
                                        <div className="flex flex-col items-center">
                                            <div className="font-['JetBrains_Mono'] text-3xl font-bold text-[#0F172A]">
                                                {formatTimer(recordingSeconds)}
                                            </div>
                                            <span className="text-xs font-['JetBrains_Mono'] text-blue-600 font-semibold mt-1">
                                                {isRecording && !recordingPaused ? '🔴 Live Recording & Telemetry...' : recordingPaused ? '⏸️ Recording Paused' : 'Ready to record'}
                                            </span>
                                        </div>

                                        {/* Controls */}
                                        <div className="flex items-center gap-4">
                                            {!isRecording ? (
                                                <button
                                                    onClick={handleStartRecording}
                                                    className="px-6 py-3.5 rounded-full btn-primary text-white font-['JetBrains_Mono'] text-xs font-semibold flex items-center gap-2 shadow-sm hover:scale-105 transition-all cursor-pointer"
                                                >
                                                    <span className="material-symbols-outlined text-[20px]">mic</span>
                                                    <span>{hasRecorded ? 'Record Again' : 'Start Recording Response'}</span>
                                                </button>
                                            ) : (
                                                <>
                                                    <button
                                                        onClick={handlePauseRecording}
                                                        className="px-4 py-2.5 rounded-xl btn-secondary text-xs font-['JetBrains_Mono'] font-semibold flex items-center gap-1.5 cursor-pointer"
                                                    >
                                                        <span className="material-symbols-outlined text-[18px]">
                                                            {recordingPaused ? 'play_arrow' : 'pause'}
                                                        </span>
                                                        <span>{recordingPaused ? 'Resume' : 'Pause'}</span>
                                                    </button>

                                                    <button
                                                        onClick={handleStopRecording}
                                                        className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-['JetBrains_Mono'] font-semibold flex items-center gap-1.5 shadow-sm cursor-pointer"
                                                    >
                                                        <span className="material-symbols-outlined text-[18px]">stop</span>
                                                        <span>Stop & Analyze AI Response</span>
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    {/* Real-Time Live AI Telemetry & Hints */}
                                    <div className="bg-[#FAF8F5] rounded-2xl p-5 border border-[#E8E4DC] flex flex-col gap-4">
                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center gap-2">
                                                <span className="material-symbols-outlined text-blue-600 text-[20px]">
                                                    sensors
                                                </span>
                                                <h4 className="font-['Hanken_Grotesk'] text-sm font-bold text-[#0F172A]">
                                                    Live AI Telemetry & Real-Time Coaching
                                                </h4>
                                            </div>
                                            <span className="text-[11px] font-['JetBrains_Mono'] text-emerald-700 font-semibold">
                                                Acoustic Engine Active
                                            </span>
                                        </div>

                                        {/* Telemetry Metrics Row */}
                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-['JetBrains_Mono']">
                                            <div className="p-2.5 rounded-xl bg-white border border-[#E8E4DC] text-center shadow-sm">
                                                <span className="text-[#64748B] text-[10px] block">Filler Words</span>
                                                <span className="font-bold text-amber-600 text-base">{fillerWordCount} detected</span>
                                            </div>
                                            <div className="p-2.5 rounded-xl bg-white border border-[#E8E4DC] text-center shadow-sm">
                                                <span className="text-[#64748B] text-[10px] block">Clarity Rating</span>
                                                <span className="font-bold text-emerald-600 text-base">{clarityScore}%</span>
                                            </div>
                                            <div className="p-2.5 rounded-xl bg-white border border-[#E8E4DC] text-center shadow-sm">
                                                <span className="text-[#64748B] text-[10px] block">Completeness</span>
                                                <span className="font-bold text-blue-600 text-base">{completenessScore}%</span>
                                            </div>
                                            <div className="p-2.5 rounded-xl bg-white border border-[#E8E4DC] text-center shadow-sm">
                                                <span className="text-[#64748B] text-[10px] block">Cadence</span>
                                                <span className="font-bold text-blue-700 text-base">Optimal</span>
                                            </div>
                                        </div>

                                        {/* Dynamic Live AI Hint Card */}
                                        <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 flex items-start gap-3">
                                            <span className="material-symbols-outlined text-blue-600 text-[20px] shrink-0 mt-0.5">
                                                lightbulb
                                            </span>
                                            <div className="text-xs font-['Inter'] text-[#0F172A]">
                                                <strong className="text-blue-800 font-['JetBrains_Mono'] block mb-0.5">LIVE COACHING CUE:</strong>
                                                {aiHint}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* TAB 2: STAR METHOD BEHAVIORAL BUILDER */}
                            {workspaceTab === 'star' && (
                                <div className="flex flex-col gap-4">
                                    <p className="text-xs font-['Inter'] text-[#64748B]">
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
                                                <label className="text-xs font-['JetBrains_Mono'] font-bold text-blue-700">
                                                    {field.label}
                                                </label>
                                                <textarea
                                                    rows={2}
                                                    value={starForm[field.key]}
                                                    onChange={(e) => setStarForm({ ...starForm, [field.key]: e.target.value })}
                                                    placeholder={field.placeholder}
                                                    className="w-full bg-[#FAF8F5] border border-[#D8D2C7] rounded-xl p-3 font-['Inter'] text-xs text-[#0F172A] focus:outline-none focus:border-blue-600 focus:bg-white resize-none"
                                                />
                                            </div>
                                        ))}
                                    </div>

                                    <button
                                        onClick={() => setWorkspaceTab('voice')}
                                        className="btn-primary py-2.5 px-4 rounded-xl text-xs font-['JetBrains_Mono'] font-semibold flex items-center justify-center gap-2 self-end mt-2"
                                    >
                                        <span>Practice Speaking STAR Story</span>
                                        <span className="material-symbols-outlined text-[16px]">mic</span>
                                    </button>
                                </div>
                            )}

                            {/* TAB 3: CODING SANDBOX */}
                            {workspaceTab === 'code' && (
                                <div className="flex flex-col gap-4">
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-['JetBrains_Mono'] text-[#64748B]">Language:</span>
                                            <select
                                                value={codeLanguage}
                                                onChange={(e) => setCodeLanguage(e.target.value)}
                                                className="bg-[#FAF8F5] border border-[#D8D2C7] rounded-lg px-2.5 py-1 text-xs font-['JetBrains_Mono'] text-[#0F172A] focus:outline-none"
                                            >
                                                <option value="javascript">JavaScript (ES2024)</option>
                                                <option value="typescript">TypeScript</option>
                                                <option value="python">Python 3.12</option>
                                                <option value="go">Go 1.22</option>
                                            </select>
                                        </div>

                                        <button
                                            onClick={handleRunCode}
                                            className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-['JetBrains_Mono'] text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-sm"
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
                                        className="w-full bg-[#0F172A] text-emerald-300 border border-[#E8E4DC] rounded-xl p-4 font-['JetBrains_Mono'] text-xs focus:outline-none focus:border-blue-600 font-mono leading-relaxed"
                                    />

                                    {/* Execution Output */}
                                    {sandboxOutput && (
                                        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-['JetBrains_Mono'] text-emerald-800 flex justify-between items-center">
                                            <span>✓ {sandboxOutput.testsPassed}</span>
                                            <span className="text-[#64748B]">Runtime: {sandboxOutput.runtime} • Memory: {sandboxOutput.memory}</span>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* TAB 4: AI POST-RESPONSE EVALUATION & REVIEW */}
                            {workspaceTab === 'review' && (
                                <div className="flex flex-col gap-5">
                                    <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
                                        <div>
                                            <h4 className="font-['Hanken_Grotesk'] text-base font-bold text-emerald-800">
                                                AI Response Evaluation Generated
                                            </h4>
                                            <p className="font-['Inter'] text-xs text-[#64748B]">
                                                Analyzed {recordingSeconds}s audio recording across clarity, structure, and algorithmic depth.
                                            </p>
                                        </div>
                                        <div className="font-['Hanken_Grotesk'] text-2xl font-bold text-emerald-700">
                                            91 / 100
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-3 gap-3 text-xs font-['JetBrains_Mono']">
                                        <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#E8E4DC] text-center">
                                            <span className="text-[#64748B] text-[10px]">Technical Accuracy</span>
                                            <div className="font-bold text-blue-600 text-lg">94%</div>
                                        </div>
                                        <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#E8E4DC] text-center">
                                            <span className="text-[#64748B] text-[10px]">Speech & Fluency</span>
                                            <div className="font-bold text-blue-700 text-lg">88%</div>
                                        </div>
                                        <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#E8E4DC] text-center">
                                            <span className="text-[#64748B] text-[10px]">Structure & STAR</span>
                                            <div className="font-bold text-emerald-600 text-lg">92%</div>
                                        </div>
                                    </div>

                                    <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E8E4DC] text-xs font-['Inter'] text-[#0F172A] leading-relaxed">
                                        💡 <strong>AI Feedback:</strong> Excellent articulation of race condition mitigations. You structured your thoughts logically and addressed the core invariants. Next time, aim to explicitly state the time complexity tradeoffs before finishing.
                                    </div>

                                    <div className="flex justify-end gap-3 pt-2">
                                        <button
                                            onClick={() => setWorkspaceTab('voice')}
                                            className="btn-secondary px-4 py-2 rounded-xl text-xs font-['JetBrains_Mono'] font-semibold"
                                        >
                                            Try Again
                                        </button>
                                        <button
                                            onClick={handleCloseWorkspace}
                                            className="btn-primary px-5 py-2 rounded-xl text-xs font-['JetBrains_Mono'] font-semibold"
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
            <nav className="md:hidden fixed bottom-0 w-full bg-white/95 backdrop-blur-xl border-t border-[#E8E4DC] flex justify-around items-center py-3 px-4 z-50">
                <button onClick={() => navigate('/dashboard')} className="flex flex-col items-center gap-1 text-[#64748B] hover:text-[#0F172A]">
                    <span className="material-symbols-outlined text-[20px]">dashboard</span>
                    <span className="text-[10px] font-['JetBrains_Mono']">Overview</span>
                </button>
                <button onClick={() => navigate('/history')} className="flex flex-col items-center gap-1 text-[#64748B] hover:text-[#0F172A]">
                    <span className="material-symbols-outlined text-[20px]">history</span>
                    <span className="text-[10px] font-['JetBrains_Mono']">History</span>
                </button>
                <button onClick={() => navigate('/practice')} className="flex flex-col items-center gap-1 text-blue-600 font-bold">
                    <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                        psychology
                    </span>
                    <span className="text-[10px] font-['JetBrains_Mono']">Practice</span>
                </button>
                <button onClick={() => navigate('/resume')} className="flex flex-col items-center gap-1 text-[#64748B] hover:text-[#0F172A]">
                    <span className="material-symbols-outlined text-[20px]">description</span>
                    <span className="text-[10px] font-['JetBrains_Mono']">Resume</span>
                </button>
            </nav>
        </div>
    )
}

export default Practice
