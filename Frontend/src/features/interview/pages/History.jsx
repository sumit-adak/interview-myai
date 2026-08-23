import React, { useState, useEffect, useMemo, useRef } from 'react'
import { useNavigate } from 'react-router'
import { SlateSidebar } from '../../../components/layout/SlateSidebar'

// Comprehensive historical interviews dataset
const MOCK_INTERVIEWS = [
    {
        id: 'int-01',
        role: 'Senior Full Stack Engineer',
        company: 'Google',
        companyDomain: 'google.com',
        type: 'Technical',
        date: 'Aug 22, 2026',
        time: '02:30 PM',
        daysAgo: 1,
        duration: '45 mins',
        durationSec: 2700,
        overallScore: 92,
        status: 'Completed',
        difficulty: 'Advanced',
        topics: ['React 19 Concurrent Mode', 'Distributed Caching', 'Node.js Event Loop', 'GraphQL Federation'],
        summary: 'Excellent depth in full-stack architecture and JavaScript asynchronous paradigms. Identified edge cases quickly in race condition scenarios and communicated system trade-offs with high clarity.',
        strengths: [
            'Exceptional grasp of React concurrency, Suspense internals, and virtual DOM diffing.',
            'Structured thought process using STAR framework for complex technical trade-offs.',
            'Proactive verification of edge cases in cache invalidation (TTL vs Write-Through).'
        ],
        weaknesses: [
            'Could elaborate more on database isolation levels (Serializable vs Repeatable Read).',
            'Slight hesitation when discussing Kafka consumer partition rebalancing strategies.'
        ],
        transcript: [
            {
                id: 't-1',
                sender: 'AI Interviewer',
                role: 'ai',
                timestamp: '00:15',
                text: 'Welcome Sumit. Let’s begin with front-end concurrency. How does React 19 handle asset loading and transition scheduling compared to traditional async effects?'
            },
            {
                id: 't-2',
                sender: 'Candidate (Sumit)',
                role: 'user',
                timestamp: '00:48',
                text: 'In React 19, Actions and useTransition provide first-class state transition tracking without manual pending state flags. Concurrency allows high-priority user interactions (like key typing) to interrupt low-priority rendering trees, ensuring a fluid 60fps UI.'
            },
            {
                id: 't-3',
                sender: 'AI Interviewer',
                role: 'ai',
                timestamp: '02:10',
                text: 'Great. Now let’s look at a microservices scenario where a checkout service needs to coordinate with payment and inventory. How would you prevent partial state failure?'
            },
            {
                id: 't-4',
                sender: 'Candidate (Sumit)',
                role: 'user',
                timestamp: '03:15',
                text: 'I would implement the Saga Pattern with orchestrated compensation transactions rather than a two-phase commit (2PC) to preserve system availability and loose coupling across distributed boundaries.'
            },
            {
                id: 't-5',
                sender: 'AI Interviewer',
                role: 'ai',
                timestamp: '05:40',
                text: 'Solid answer. How would you handle idempotent payment operations if the network times out during credit card authorization?'
            },
            {
                id: 't-6',
                sender: 'Candidate (Sumit)',
                role: 'user',
                timestamp: '06:30',
                text: 'We attach a unique client-generated Idempotency Key (UUIDv4) in the HTTP headers. The payment gateway stores keys with expiration in Redis. If a retry occurs with the same key, it returns the cached response rather than charging twice.'
            }
        ],
        questionsBreakdown: [
            {
                qNumber: 1,
                title: 'React 19 Concurrency & State Transitions',
                category: 'Frontend Engineering',
                technicalScore: 95,
                communicationScore: 92,
                confidenceScore: 90,
                overall: 93,
                aiNotes: 'Flawless technical explanation of scheduler microtasks and fiber reconciliation.'
            },
            {
                qNumber: 2,
                title: 'Distributed Saga vs 2PC Architecture',
                category: 'System Design',
                technicalScore: 91,
                communicationScore: 89,
                confidenceScore: 88,
                overall: 90,
                aiNotes: 'Clear comparison of consistency models with practical fallback mitigation.'
            },
            {
                qNumber: 3,
                title: 'Idempotent API Design with Distributed Cache',
                category: 'Backend & Resilience',
                technicalScore: 94,
                communicationScore: 93,
                confidenceScore: 92,
                overall: 93,
                aiNotes: 'Precise implementation details including TTL strategies and deduplication keys.'
            }
        ],
        improvementTips: [
            {
                icon: 'database',
                title: 'Deepen Database Isolation Knowledge',
                description: 'Review multi-version concurrency control (MVCC) mechanics in Postgres to explain phantom read anomalies in high-throughput transactions.'
            },
            {
                icon: 'hub',
                title: 'Clarify Event Broker Rebalance Mechanisms',
                description: 'When discussing Kafka consumers, explicitly mention Cooperative Sticky Assignor vs Eager Partition assignment.'
            }
        ]
    },
    {
        id: 'int-02',
        role: 'Distributed Systems Architect',
        company: 'Amazon',
        companyDomain: 'amazon.com',
        type: 'System Design',
        date: 'Aug 20, 2026',
        time: '05:00 PM',
        daysAgo: 3,
        duration: '60 mins',
        durationSec: 3600,
        overallScore: 84,
        status: 'Passed',
        difficulty: 'Expert',
        topics: ['Global Rate Limiting', 'Consistent Hashing', 'DynamoDB Partitioning', 'Multi-Region Replication'],
        summary: 'Solid architectural blueprint for a Tier-1 streaming data pipeline. Strong knowledge of consistent hashing with virtual nodes and token bucket rate limit algorithms.',
        strengths: [
            'Accurate back-of-the-envelope capacity estimations for 10M QPS ingestion.',
            'Effective use of Read-After-Write consistency models in distributed key-value stores.',
            'Clear diagrams explaining CDN cache eviction and origin shield nodes.'
        ],
        weaknesses: [
            'Did not immediately account for cold start latency in serverless edge worker fallbacks.',
            'Could structure trade-off discussions earlier before diving into schema definitions.'
        ],
        transcript: [
            {
                id: 't-1',
                sender: 'AI Interviewer',
                role: 'ai',
                timestamp: '00:20',
                text: 'Design a globally distributed rate limiter that handles 500,000 requests per second across 4 continents with less than 5ms overhead.'
            },
            {
                id: 't-2',
                sender: 'Candidate (Sumit)',
                role: 'user',
                timestamp: '01:10',
                text: 'I would employ a sliding window log with a hierarchical local + global token bucket. Local edge proxies (Envoy/Redis in each region) handle 95% of traffic asynchronously and sync counters periodically.'
            },
            {
                id: 't-3',
                sender: 'AI Interviewer',
                role: 'ai',
                timestamp: '03:45',
                text: 'What happens if the cross-region link between US-East and EU-West is partitioned?'
            },
            {
                id: 't-4',
                sender: 'Candidate (Sumit)',
                role: 'user',
                timestamp: '04:30',
                text: 'We favor Availability over absolute Consistency (AP in CAP). Regions temporarily enforce localized quotas with a 15% safety buffer until the partition heals.'
            }
        ],
        questionsBreakdown: [
            {
                qNumber: 1,
                title: 'High-Throughput Global Rate Limiter',
                category: 'Distributed Systems',
                technicalScore: 86,
                communicationScore: 84,
                confidenceScore: 85,
                overall: 85,
                aiNotes: 'Good use of hierarchical aggregation and sliding window counters.'
            },
            {
                qNumber: 2,
                title: 'Network Partition Fault Tolerance',
                category: 'Resilience Engineering',
                technicalScore: 83,
                communicationScore: 82,
                confidenceScore: 84,
                overall: 83,
                aiNotes: 'CAP theorem applied reasonably with quota degradation strategy.'
            }
        ],
        improvementTips: [
            {
                icon: 'speed',
                title: 'Latency Breakdown Under Edge Failure',
                description: 'Factor in TLS handshake latency and fallback routing penalties when regional points of presence (PoPs) go offline.'
            }
        ]
    },
    {
        id: 'int-03',
        role: 'Frontend Infrastructure Specialist',
        company: 'Meta',
        companyDomain: 'meta.com',
        type: 'Technical',
        date: 'Aug 17, 2026',
        time: '11:00 AM',
        daysAgo: 6,
        duration: '45 mins',
        durationSec: 2700,
        overallScore: 88,
        status: 'Completed',
        difficulty: 'Advanced',
        topics: ['Micro-Frontends', 'Webpack 5 Module Federation', 'Web Vitals LCP/CLS', 'AST Codemods'],
        summary: 'Strong mastery of web performance metrics, bundle splitting strategies, and client-side memory profiling. Articulate explanations of Largest Contentful Paint (LCP) bottlenecks.',
        strengths: [
            'Extensive familiarity with Chrome Performance Profiler and flame graph analysis.',
            'Well-reasoned architecture for shared design system component versioning.'
        ],
        weaknesses: [
            'Opportunity to explain Service Worker caching strategies (Stale-While-Revalidate) in greater depth.'
        ],
        transcript: [
            {
                id: 't-1',
                sender: 'AI Interviewer',
                role: 'ai',
                timestamp: '00:10',
                text: 'How would you diagnose and optimize a Web Vitals LCP score of 4.8 seconds on an international web application?'
            },
            {
                id: 't-2',
                sender: 'Candidate (Sumit)',
                role: 'user',
                timestamp: '01:05',
                text: 'I break LCP into 4 phases: TTFB, Resource Load Delay, Resource Load Time, and Element Render Delay. I prioritize preloading the hero image via priority hints (fetchpriority="high") and CDN edge compression (AVIF/WebP).'
            }
        ],
        questionsBreakdown: [
            {
                qNumber: 1,
                title: 'Core Web Vitals Optimization',
                category: 'Web Performance',
                technicalScore: 90,
                communicationScore: 88,
                confidenceScore: 86,
                overall: 88,
                aiNotes: 'Accurate sub-part breakdown of LCP with actionable remedies.'
            }
        ],
        improvementTips: [
            {
                icon: 'memory',
                title: 'Service Worker Offline Strategies',
                description: 'Elaborate on Workbox integration and background sync for offline-first resilience.'
            }
        ]
    },
    {
        id: 'int-04',
        role: 'Engineering Lead / Behavioral',
        company: 'Microsoft',
        companyDomain: 'microsoft.com',
        type: 'Behavioral',
        date: 'Aug 10, 2026',
        time: '03:15 PM',
        daysAgo: 13,
        duration: '50 mins',
        durationSec: 3000,
        overallScore: 91,
        status: 'Completed',
        difficulty: 'Intermediate',
        topics: ['Conflict Resolution', 'Cross-functional Alignment', 'Mentorship', 'Crisis Management'],
        summary: 'Compelling leadership narratives with high empathy and crisp STAR methodology. Demonstrated strong executive presence and constructive dispute resolution.',
        strengths: [
            'Structured storytelling highlighting measurable business and team impact.',
            'Emphasized continuous psychological safety and mentorship frameworks.'
        ],
        weaknesses: [
            'Could quantify cost savings and velocity metrics with more specific percentages.'
        ],
        transcript: [
            {
                id: 't-1',
                sender: 'AI Interviewer',
                role: 'ai',
                timestamp: '00:30',
                text: 'Tell me about a time when your engineering team strongly disagreed with a critical product deadline.'
            },
            {
                id: 't-2',
                sender: 'Candidate (Sumit)',
                role: 'user',
                timestamp: '01:25',
                text: 'In my last role, Product wanted to launch a real-time analytics feature in 3 weeks, which posed tech debt risks. I organized a transparent trade-off matrix meeting, scoped a Phase 1 MVP that delivered 80% user value on time, and scheduled Phase 2 for full hardening.'
            }
        ],
        questionsBreakdown: [
            {
                qNumber: 1,
                title: 'Deadlines & Scope Negotiation',
                category: 'Leadership & Conflict',
                technicalScore: 92,
                communicationScore: 94,
                confidenceScore: 90,
                overall: 92,
                aiNotes: 'Great stakeholder management example with tangible outcomes.'
            }
        ],
        improvementTips: [
            {
                icon: 'leaderboard',
                title: 'Metrics-Driven Impact Statements',
                description: 'Anchor behavioral outcomes with precise numbers (e.g. reduced sprint churn by 35%).'
            }
        ]
    },
    {
        id: 'int-05',
        role: 'Cloud Native & Platform Engineer',
        company: 'Netflix',
        companyDomain: 'netflix.com',
        type: 'System Design',
        date: 'Jul 28, 2026',
        time: '04:00 PM',
        daysAgo: 26,
        duration: '60 mins',
        durationSec: 3600,
        overallScore: 86,
        status: 'Passed',
        difficulty: 'Advanced',
        topics: ['Chaos Engineering', 'Kubernetes HPA', 'Istio Service Mesh', 'Observability OpenTelemetry'],
        summary: 'Solid cloud infrastructure principles and deep understanding of zero-downtime blue/green canary deployments and eBPF network observability.',
        strengths: [
            'Hands-on expertise in distributed tracing and tail-based sampling.',
            'Clear understanding of Kubernetes control plane scheduling.'
        ],
        weaknesses: [
            'Could discuss memory limits vs requests throttling behaviors in cgroups v2.'
        ],
        transcript: [
            {
                id: 't-1',
                sender: 'AI Interviewer',
                role: 'ai',
                timestamp: '00:15',
                text: 'How would you architect a zero-downtime canary deployment pipeline that automatically rolls back when error rates exceed 0.5%?'
            },
            {
                id: 't-2',
                sender: 'Candidate (Sumit)',
                role: 'user',
                timestamp: '01:10',
                text: 'We leverage Flagger with Istio and Prometheus. Traffic is shifted to the canary pod starting at 5% incrementing every minute while monitoring HTTP 5xx rates and p99 latency.'
            }
        ],
        questionsBreakdown: [
            {
                qNumber: 1,
                title: 'Automated Canary & Metric Analysis',
                category: 'Platform Engineering',
                technicalScore: 88,
                communicationScore: 85,
                confidenceScore: 85,
                overall: 86,
                aiNotes: 'Sound implementation of automated progressive delivery.'
            }
        ],
        improvementTips: [
            {
                icon: 'cloud_sync',
                title: 'cgroups v2 Throttling Mechanics',
                description: 'Review CFS quota allocation and OOM killer heuristics in container runtimes.'
            }
        ]
    },
    {
        id: 'int-06',
        role: 'Culture, Leadership & HR Fit',
        company: 'Apple',
        companyDomain: 'apple.com',
        type: 'HR',
        date: 'Jul 15, 2026',
        time: '10:30 AM',
        daysAgo: 39,
        duration: '35 mins',
        durationSec: 2100,
        overallScore: 94,
        status: 'Completed',
        difficulty: 'Intermediate',
        topics: ['Culture Add', 'Career Vision', 'Collaboration', 'Ethics'],
        summary: 'Outstanding cultural resonance, clear passion for product excellence, attention to privacy-by-design, and long-term career ambition.',
        strengths: [
            'Very articulate communication style with sincere emotional intelligence.',
            'Clear philosophy on user privacy, accessible design, and craft.'
        ],
        weaknesses: [
            'Minor: ensure answers stay concise when expanding on long personal career background.'
        ],
        transcript: [
            {
                id: 't-1',
                sender: 'AI Interviewer',
                role: 'ai',
                timestamp: '00:20',
                text: 'Why are you passionate about building software with strict on-device privacy guarantees?'
            },
            {
                id: 't-2',
                sender: 'Candidate (Sumit)',
                role: 'user',
                timestamp: '01:00',
                text: 'Privacy is a fundamental right. Building localized ML models that process user data on-device eliminates telemetry attack vectors and creates authentic trust with the end user.'
            }
        ],
        questionsBreakdown: [
            {
                qNumber: 1,
                title: 'Values, Ethics & Privacy Alignment',
                category: 'Culture & Principles',
                technicalScore: 94,
                communicationScore: 96,
                confidenceScore: 93,
                overall: 94,
                aiNotes: 'Exceptional alignment with core engineering values.'
            }
        ],
        improvementTips: [
            {
                icon: 'verified',
                title: 'Keep Introductory Pitches Concise',
                description: 'Aim for 90 seconds on career history to reserve maximum time for deep behavioral questions.'
            }
        ]
    },
    {
        id: 'int-07',
        role: 'Full Stack & Mobile Systems',
        company: 'Other',
        companyDomain: 'startup.io',
        type: 'Mixed',
        date: 'Jun 28, 2026',
        time: '01:45 PM',
        daysAgo: 56,
        duration: '50 mins',
        durationSec: 3000,
        overallScore: 78,
        status: 'Needs Review',
        difficulty: 'Advanced',
        topics: ['React Native Bridge', 'WebSockets Sync', 'PostgreSQL JSONB', 'Authentication JWT'],
        summary: 'Good baseline implementation of offline data sync and push notification queuing. Some gaps in token refresh race conditions and optimistic UI rollbacks.',
        strengths: [
            'Pragmatic approach to shipping features rapidly in agile setups.',
            'Good understanding of WebSocket heartbeat protocols.'
        ],
        weaknesses: [
            'Struggled with silent token refresh concurrency when multiple API requests fire simultaneously.',
            'Overly relied on optimistic updates without robust conflict resolution.'
        ],
        transcript: [
            {
                id: 't-1',
                sender: 'AI Interviewer',
                role: 'ai',
                timestamp: '00:30',
                text: 'How do you handle JWT access token expiration when 5 simultaneous fetch requests return HTTP 401?'
            },
            {
                id: 't-2',
                sender: 'Candidate (Sumit)',
                role: 'user',
                timestamp: '01:15',
                text: 'You use an Axios interceptor with a shared Promise queue (isRefreshing lock). The first 401 triggers the refresh; the remaining 4 requests wait on the resolved token.'
            }
        ],
        questionsBreakdown: [
            {
                qNumber: 1,
                title: 'Concurrent JWT Refresh Interceptor',
                category: 'Security & State',
                technicalScore: 78,
                communicationScore: 80,
                confidenceScore: 76,
                overall: 78,
                aiNotes: 'Identified Axios queue pattern after a hint.'
            }
        ],
        improvementTips: [
            {
                icon: 'lock_reset',
                title: 'Practice Race Condition Interceptors',
                description: 'Implement a standalone RxJS or Promise-based refresh lock queue from memory without external helpers.'
            }
        ]
    }
]

const INTERVIEW_TYPES = ['All', 'Technical', 'Behavioral', 'System Design', 'HR', 'Mixed']
const COMPANIES = ['All', 'Google', 'Amazon', 'Microsoft', 'Meta', 'Netflix', 'Other']
const DATE_RANGES = [
    { id: 'ALL', label: 'All Time' },
    { id: '7D', label: 'Last 7 Days' },
    { id: '30D', label: 'Last 30 Days' },
    { id: '3M', label: 'Last 3 Months' }
]

export const History = () => {
    const navigate = useNavigate()
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedType, setSelectedType] = useState('All')
    const [selectedCompany, setSelectedCompany] = useState('All')
    const [selectedDateRange, setSelectedDateRange] = useState('ALL')
    
    // Drawer & Modal States
    const [selectedInterview, setSelectedInterview] = useState(null)
    const [isDrawerOpen, setIsDrawerOpen] = useState(false)
    const [drawerTab, setDrawerTab] = useState('overview') // 'overview' | 'transcript' | 'audio' | 'breakdown' | 'tips'
    const [isShareModalOpen, setIsShareModalOpen] = useState(false)
    const [isCopied, setIsCopied] = useState(false)
    const [isExporting, setIsExporting] = useState(false)
    const [exportSuccessToast, setExportSuccessToast] = useState(false)

    // Audio Player State
    const [isPlaying, setIsPlaying] = useState(false)
    const [currentTime, setCurrentTime] = useState(124) // seconds into audio
    const [playbackSpeed, setPlaybackSpeed] = useState(1)
    const audioIntervalRef = useRef(null)

    // Handle audio tick simulation
    useEffect(() => {
        if (isPlaying && selectedInterview) {
            audioIntervalRef.current = setInterval(() => {
                setCurrentTime(prev => {
                    if (prev >= selectedInterview.durationSec) {
                        setIsPlaying(false)
                        return selectedInterview.durationSec
                    }
                    return prev + playbackSpeed
                })
            }, 1000)
        } else {
            if (audioIntervalRef.current) clearInterval(audioIntervalRef.current)
        }
        return () => {
            if (audioIntervalRef.current) clearInterval(audioIntervalRef.current)
        }
    }, [isPlaying, playbackSpeed, selectedInterview])

    const handleOpenDrawer = (interview) => {
        setSelectedInterview(interview)
        setIsDrawerOpen(true)
        setDrawerTab('overview')
        setIsPlaying(false)
        setCurrentTime(145)
    }

    const handleCloseDrawer = () => {
        setIsDrawerOpen(false)
        setIsPlaying(false)
    }

    // Filter Logic
    const filteredInterviews = useMemo(() => {
        return MOCK_INTERVIEWS.filter(item => {
            // Search query matches role, company, topics, or summary
            if (searchQuery.trim()) {
                const query = searchQuery.toLowerCase().trim()
                const matchesRole = item.role.toLowerCase().includes(query)
                const matchesCompany = item.company.toLowerCase().includes(query)
                const matchesType = item.type.toLowerCase().includes(query)
                const matchesTopics = item.topics.some(t => t.toLowerCase().includes(query))
                const matchesSummary = item.summary.toLowerCase().includes(query)
                if (!matchesRole && !matchesCompany && !matchesType && !matchesTopics && !matchesSummary) {
                    return false
                }
            }

            // Interview Type Filter
            if (selectedType !== 'All' && item.type !== selectedType) {
                return false
            }

            // Company Filter
            if (selectedCompany !== 'All') {
                if (selectedCompany === 'Other') {
                    const major = ['Google', 'Amazon', 'Microsoft', 'Meta', 'Netflix']
                    if (major.includes(item.company)) return false
                } else if (item.company !== selectedCompany) {
                    return false
                }
            }

            // Date Range Filter
            if (selectedDateRange === '7D' && item.daysAgo > 7) return false
            if (selectedDateRange === '30D' && item.daysAgo > 30) return false
            if (selectedDateRange === '3M' && item.daysAgo > 90) return false

            return true
        })
    }, [searchQuery, selectedType, selectedCompany, selectedDateRange])

    const hasActiveFilters = searchQuery !== '' || selectedType !== 'All' || selectedCompany !== 'All' || selectedDateRange !== 'ALL'

    const handleResetFilters = () => {
        setSearchQuery('')
        setSelectedType('All')
        setSelectedCompany('All')
        setSelectedDateRange('ALL')
    }

    const handleCopyLink = () => {
        const shareUrl = `https://interview.ai/review/share-${selectedInterview?.id || 'session'}`
        navigator.clipboard.writeText(shareUrl)
        setIsCopied(true)
        setTimeout(() => setIsCopied(false), 2500)
    }

    const handleExportPdf = () => {
        setIsExporting(true)
        setTimeout(() => {
            setIsExporting(false)
            setExportSuccessToast(true)
            setTimeout(() => setExportSuccessToast(false), 3500)
        }, 1600)
    }

    const formatSeconds = (sec) => {
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
                            Interview History & Archives
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-['JetBrains_Mono'] bg-indigo-500/10 text-[#818cf8] border border-indigo-500/20">
                            {filteredInterviews.length} Sessions Logged
                        </span>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => navigate('/interview/setup')}
                            className="btn-primary rounded-lg px-4 py-2 font-['JetBrains_Mono'] text-[13px] font-bold flex items-center gap-2"
                        >
                            <span className="material-symbols-outlined text-[16px]">add</span>
                            New Simulation
                        </button>
                    </div>
                </header>

                {/* Content Canvas */}
                <div className="p-4 md:p-8 lg:p-10 max-w-[1440px] mx-auto w-full flex-1 flex flex-col gap-6 lg:gap-8">
                    
                    {/* Header Banner */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className="material-symbols-outlined text-[#818cf8] text-[18px]">history_edu</span>
                                <span className="font-['JetBrains_Mono'] text-xs uppercase tracking-wider text-[#818cf8] font-bold">
                                    Performance Archive
                                </span>
                            </div>
                            <h2 className="font-['Hanken_Grotesk'] text-[28px] sm:text-[34px] md:text-[38px] text-[#E2E8F0] font-bold tracking-tight">
                                Past Interview Evaluations
                            </h2>
                            <p className="font-['Inter'] text-[15px] text-[#c4c6cd] mt-0.5">
                                Search, analyze, and review full transcripts, audio playbacks, and question scores from your AI mock rounds.
                            </p>
                        </div>

                        {/* Quick Stats Pill */}
                        <div className="flex items-center gap-3 self-start md:self-auto bg-[#0F172A] border border-[#334155] px-4 py-2.5 rounded-xl shadow-sm">
                            <div className="flex flex-col">
                                <span className="text-[11px] font-['JetBrains_Mono'] text-[#c4c6cd]">Average Score</span>
                                <span className="font-['Hanken_Grotesk'] text-lg font-bold text-emerald-400">87.5%</span>
                            </div>
                            <div className="h-7 w-px bg-[#334155]"></div>
                            <div className="flex flex-col">
                                <span className="text-[11px] font-['JetBrains_Mono'] text-[#c4c6cd]">Completion Rate</span>
                                <span className="font-['Hanken_Grotesk'] text-lg font-bold text-[#818cf8]">100%</span>
                            </div>
                        </div>
                    </div>

                    {/* =========================================================
                        FILTERS AND SEARCH SYSTEM
                    ========================================================= */}
                    <div className="glass-panel rounded-2xl p-5 lg:p-6 border border-[#334155] shadow-lg flex flex-col gap-5">
                        
                        {/* Search Input Bar */}
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                            <div className="relative flex-1">
                                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#c4c6cd] text-[18px]">
                                    search
                                </span>
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search by role, company (Google, Amazon), technical topic, or keyword..."
                                    className="w-full bg-[#0F172A] border border-[#334155] rounded-xl pl-10 pr-10 py-3 font-['Inter'] text-[14px] text-[#dae2fd] focus:outline-none focus:border-[#6366f1] focus:ring-1 focus:ring-[#6366f1]/50 transition-all placeholder:text-[#c4c6cd]/50"
                                />
                                {searchQuery && (
                                    <button
                                        onClick={() => setSearchQuery('')}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#c4c6cd] hover:text-white p-1 rounded-full hover:bg-white/10"
                                    >
                                        <span className="material-symbols-outlined text-[16px]">close</span>
                                    </button>
                                )}
                            </div>

                            {/* Reset Button (If active filters) */}
                            {hasActiveFilters && (
                                <button
                                    onClick={handleResetFilters}
                                    className="px-4 py-3 rounded-xl border border-red-500/20 bg-red-500/10 text-red-300 hover:bg-red-500/20 text-xs font-['JetBrains_Mono'] font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer shrink-0"
                                >
                                    <span className="material-symbols-outlined text-[16px]">filter_alt_off</span>
                                    Reset Filters
                                </button>
                            )}
                        </div>

                        {/* Filter Pill Rows */}
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pt-2 border-t border-[#334155]/60">
                            
                            {/* Left: Interview Type Pills */}
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                                <span className="text-xs font-['JetBrains_Mono'] text-[#c4c6cd] shrink-0 font-medium">
                                    Type:
                                </span>
                                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
                                    {INTERVIEW_TYPES.map(type => (
                                        <button
                                            key={type}
                                            onClick={() => setSelectedType(type)}
                                            className={`px-3 py-1.5 rounded-lg text-xs font-['JetBrains_Mono'] font-medium whitespace-nowrap transition-all cursor-pointer ${
                                                selectedType === type
                                                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-sm font-bold'
                                                    : 'bg-[#0F172A] text-[#c4c6cd] hover:text-[#E2E8F0] border border-[#334155] hover:border-[#4A5568]'
                                            }`}
                                        >
                                            {type}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Right: Date Range Selector */}
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                                <span className="text-xs font-['JetBrains_Mono'] text-[#c4c6cd] shrink-0 font-medium">
                                    Date:
                                </span>
                                <div className="flex items-center bg-[#0F172A] p-1 rounded-xl border border-[#334155]">
                                    {DATE_RANGES.map(range => (
                                        <button
                                            key={range.id}
                                            onClick={() => setSelectedDateRange(range.id)}
                                            className={`px-2.5 py-1 rounded-lg text-xs font-['JetBrains_Mono'] transition-all cursor-pointer ${
                                                selectedDateRange === range.id
                                                    ? 'bg-indigo-600/40 text-[#818cf8] font-bold border border-indigo-500/40'
                                                    : 'text-[#c4c6cd] hover:text-white'
                                            }`}
                                        >
                                            {range.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                        </div>

                        {/* Company Filter Tags */}
                        <div className="flex flex-wrap items-center gap-2 pt-2">
                            <span className="text-xs font-['JetBrains_Mono'] text-[#c4c6cd] shrink-0 font-medium mr-1">
                                Company:
                            </span>
                            {COMPANIES.map(company => (
                                <button
                                    key={company}
                                    onClick={() => setSelectedCompany(company)}
                                    className={`px-3 py-1 rounded-full text-xs font-['JetBrains_Mono'] transition-all cursor-pointer flex items-center gap-1.5 ${
                                        selectedCompany === company
                                            ? 'bg-indigo-500/20 text-[#818cf8] border border-indigo-500/50 font-bold'
                                            : 'bg-[#0F172A] text-[#c4c6cd] hover:text-[#E2E8F0] border border-[#334155] hover:border-[#4A5568]'
                                    }`}
                                >
                                    <span className={`w-1.5 h-1.5 rounded-full ${
                                        company === 'Google' ? 'bg-red-400' :
                                        company === 'Amazon' ? 'bg-amber-400' :
                                        company === 'Microsoft' ? 'bg-blue-400' :
                                        company === 'Meta' ? 'bg-indigo-400' :
                                        company === 'Netflix' ? 'bg-rose-500' : 'bg-slate-400'
                                    }`}></span>
                                    {company}
                                </button>
                            ))}
                        </div>

                    </div>

                    {/* =========================================================
                        INTERVIEW HISTORY LIST
                    ========================================================= */}
                    <div className="flex flex-col gap-3.5">
                        
                        <div className="flex justify-between items-center px-1">
                            <span className="font-['JetBrains_Mono'] text-xs text-[#c4c6cd]">
                                Showing <strong className="text-[#E2E8F0]">{filteredInterviews.length}</strong> archived sessions
                            </span>
                        </div>

                        {filteredInterviews.length === 0 ? (
                            /* Empty State */
                            <div className="glass-panel rounded-2xl p-12 text-center border border-[#334155] flex flex-col items-center justify-center gap-4">
                                <div className="w-16 h-16 rounded-full bg-[#1E293B] border border-[#334155] flex items-center justify-center text-[#c4c6cd]">
                                    <span className="material-symbols-outlined text-[32px]">manage_search</span>
                                </div>
                                <div>
                                    <h3 className="font-['Hanken_Grotesk'] text-xl font-bold text-[#E2E8F0]">
                                        No interviews found
                                    </h3>
                                    <p className="font-['Inter'] text-sm text-[#c4c6cd] mt-1 max-w-md mx-auto">
                                        No mock interviews match your current search and filter selections. Try clearing your filters or starting a new session.
                                    </p>
                                </div>
                                <button
                                    onClick={handleResetFilters}
                                    className="btn-secondary rounded-xl px-5 py-2.5 font-['JetBrains_Mono'] text-xs font-bold"
                                >
                                    Clear All Filters
                                </button>
                            </div>
                        ) : (
                            /* List of Interview Cards */
                            filteredInterviews.map((interview) => (
                                <div
                                    key={interview.id}
                                    onClick={() => handleOpenDrawer(interview)}
                                    className="glass-panel rounded-2xl p-5 md:p-6 border border-[#334155] hover:border-[#818cf8]/50 hover:-translate-y-0.5 hover:shadow-[0_12px_30px_rgba(0,0,0,0.35)] transition-all duration-200 cursor-pointer group relative overflow-hidden"
                                >
                                    {/* Accent line on left */}
                                    <div className={`absolute left-0 top-0 bottom-0 w-1 ${
                                        interview.overallScore >= 90 ? 'bg-emerald-400' :
                                        interview.overallScore >= 80 ? 'bg-[#818cf8]' : 'bg-amber-400'
                                    }`}></div>

                                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 pl-2">
                                        
                                        {/* Left: Role, Company, Type, Topics */}
                                        <div className="flex items-start gap-4">
                                            {/* Company Avatar / Icon */}
                                            <div className="w-12 h-12 rounded-xl bg-[#0F172A] border border-[#334155] group-hover:border-indigo-500/50 flex items-center justify-center text-lg font-bold font-['Hanken_Grotesk'] text-[#818cf8] shrink-0 transition-colors shadow-inner">
                                                {interview.company === 'Google' ? 'G' :
                                                 interview.company === 'Amazon' ? 'A' :
                                                 interview.company === 'Microsoft' ? 'M' :
                                                 interview.company === 'Meta' ? '∞' :
                                                 interview.company === 'Netflix' ? 'N' :
                                                 interview.company === 'Apple' ? '' : 'AI'}
                                            </div>

                                            <div className="flex flex-col">
                                                <div className="flex items-center gap-2.5 flex-wrap">
                                                    <h3 className="font-['Hanken_Grotesk'] text-[17px] md:text-[18px] font-bold text-[#E2E8F0] group-hover:text-white transition-colors">
                                                        {interview.role}
                                                    </h3>
                                                    
                                                    {/* Company Tag */}
                                                    <span className="px-2.5 py-0.5 rounded-md text-[11px] font-['JetBrains_Mono'] font-semibold bg-[#0F172A] text-[#E2E8F0] border border-[#334155]">
                                                        {interview.company}
                                                    </span>

                                                    {/* Type Badge */}
                                                    <span className="px-2.5 py-0.5 rounded-md text-[11px] font-['JetBrains_Mono'] bg-indigo-500/10 text-[#818cf8] border border-indigo-500/20">
                                                        {interview.type}
                                                    </span>
                                                </div>

                                                {/* Summary excerpt */}
                                                <p className="font-['Inter'] text-xs text-[#c4c6cd] mt-1.5 line-clamp-1 max-w-2xl">
                                                    {interview.summary}
                                                </p>

                                                {/* Topic Tags */}
                                                <div className="flex items-center gap-1.5 flex-wrap mt-2.5">
                                                    {interview.topics.slice(0, 3).map((topic, i) => (
                                                        <span
                                                            key={i}
                                                            className="text-[10px] font-['JetBrains_Mono'] px-2 py-0.5 rounded bg-[#171f33]/80 text-[#c4c6cd] border border-[#334155]/60"
                                                        >
                                                            {topic}
                                                        </span>
                                                    ))}
                                                    {interview.topics.length > 3 && (
                                                        <span className="text-[10px] font-['JetBrains_Mono'] text-[#818cf8]">
                                                            +{interview.topics.length - 3} more
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Right: Date, Duration, Score, Status, CTA */}
                                        <div className="flex items-center justify-between lg:justify-end gap-6 pt-3 lg:pt-0 border-t lg:border-t-0 border-[#334155]/40 shrink-0">
                                            
                                            {/* Date & Duration */}
                                            <div className="flex flex-col text-left lg:text-right font-['JetBrains_Mono'] text-xs text-[#c4c6cd]">
                                                <div className="flex items-center lg:justify-end gap-1 text-[#E2E8F0]">
                                                    <span className="material-symbols-outlined text-[14px]">calendar_today</span>
                                                    {interview.date}
                                                </div>
                                                <div className="text-[11px] text-[#c4c6cd]/70 mt-0.5">
                                                    {interview.duration} • {interview.time}
                                                </div>
                                            </div>

                                            {/* Score & Progress Pill */}
                                            <div className="flex items-center gap-3">
                                                <div className="flex flex-col items-end">
                                                    <div className={`font-['Hanken_Grotesk'] text-[22px] font-bold ${
                                                        interview.overallScore >= 90 ? 'text-emerald-400' :
                                                        interview.overallScore >= 80 ? 'text-[#818cf8]' : 'text-amber-400'
                                                    }`}>
                                                        {interview.overallScore}%
                                                    </div>
                                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-['JetBrains_Mono'] font-semibold border ${
                                                        interview.status === 'Completed'
                                                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                                            : interview.status === 'Passed'
                                                            ? 'bg-indigo-500/10 text-[#818cf8] border-indigo-500/20'
                                                            : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                                    }`}>
                                                        {interview.status}
                                                    </span>
                                                </div>

                                                <span className="material-symbols-outlined text-[#c4c6cd] group-hover:text-white group-hover:translate-x-1 transition-all text-[22px]">
                                                    chevron_right
                                                </span>
                                            </div>

                                        </div>

                                    </div>
                                </div>
                            ))
                        )}

                    </div>

                </div>
            </main>

            {/* =========================================================
                SESSION DETAILS SLIDE-IN RIGHT DRAWER
            ========================================================= */}
            {isDrawerOpen && selectedInterview && (
                <>
                    {/* Backdrop */}
                    <div
                        onClick={handleCloseDrawer}
                        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 transition-opacity animate-in fade-in duration-200"
                    />

                    {/* Drawer Canvas */}
                    <aside className="fixed inset-y-0 right-0 max-w-2xl w-full bg-[#0F172A] border-l border-[#334155] shadow-2xl z-50 overflow-y-auto flex flex-col animate-in slide-in-from-right duration-300 select-none">
                        
                        {/* Drawer Header */}
                        <div className="p-6 border-b border-[#334155] bg-[#0F172A]/90 backdrop-blur-md sticky top-0 z-20 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-indigo-950/60 border border-indigo-500/30 flex items-center justify-center text-[#818cf8] font-bold">
                                    <span className="material-symbols-outlined text-[20px]">assignment</span>
                                </div>
                                <div>
                                    <h3 className="font-['Hanken_Grotesk'] text-lg font-bold text-[#E2E8F0]">
                                        Session Evaluation
                                    </h3>
                                    <p className="font-['JetBrains_Mono'] text-xs text-[#c4c6cd]">
                                        {selectedInterview.id} • {selectedInterview.date}
                                    </p>
                                </div>
                            </div>

                            <button
                                onClick={handleCloseDrawer}
                                className="p-2 text-[#c4c6cd] hover:text-white rounded-lg hover:bg-white/5 transition-colors"
                            >
                                <span className="material-symbols-outlined text-[22px]">close</span>
                            </button>
                        </div>

                        {/* Navigation Tabs Inside Drawer */}
                        <div className="flex border-b border-[#334155] bg-[#1E293B]/40 px-6 overflow-x-auto scrollbar-none">
                            {[
                                { id: 'overview', label: 'Overview & AI Feedback', icon: 'insights' },
                                { id: 'transcript', label: 'Transcript', icon: 'chat' },
                                { id: 'audio', label: 'Audio Playback', icon: 'graphic_eq' },
                                { id: 'breakdown', label: 'Question Breakdown', icon: 'checklist' },
                                { id: 'tips', label: 'AI Tips', icon: 'tips_and_updates' }
                            ].map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setDrawerTab(tab.id)}
                                    className={`py-3.5 px-3 font-['JetBrains_Mono'] text-xs font-semibold flex items-center gap-1.5 border-b-2 whitespace-nowrap transition-all cursor-pointer ${
                                        drawerTab === tab.id
                                            ? 'text-[#818cf8] border-[#818cf8] bg-indigo-500/5'
                                            : 'text-[#c4c6cd] border-transparent hover:text-white'
                                    }`}
                                >
                                    <span className="material-symbols-outlined text-[16px]">{tab.icon}</span>
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        {/* Drawer Content Body */}
                        <div className="p-6 flex-1 flex flex-col gap-6">
                            
                            {/* TAB 1: OVERVIEW & AI FEEDBACK SUMMARY */}
                            {drawerTab === 'overview' && (
                                <div className="flex flex-col gap-6">
                                    
                                    {/* Primary Info Card */}
                                    <div className="glass-panel rounded-xl p-5 border border-[#334155] relative overflow-hidden">
                                        <div className="flex justify-between items-start gap-4">
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="px-2.5 py-0.5 rounded text-[11px] font-['JetBrains_Mono'] font-bold bg-[#1E293B] text-white border border-[#334155]">
                                                        {selectedInterview.company}
                                                    </span>
                                                    <span className="px-2 py-0.5 rounded text-[11px] font-['JetBrains_Mono'] bg-indigo-500/10 text-[#818cf8] border border-indigo-500/20">
                                                        {selectedInterview.type}
                                                    </span>
                                                    <span className="px-2 py-0.5 rounded text-[11px] font-['JetBrains_Mono'] bg-slate-800 text-[#c4c6cd]">
                                                        {selectedInterview.difficulty}
                                                    </span>
                                                </div>
                                                <h4 className="font-['Hanken_Grotesk'] text-xl font-bold text-[#E2E8F0]">
                                                    {selectedInterview.role}
                                                </h4>
                                                <div className="flex items-center gap-3 text-xs font-['JetBrains_Mono'] text-[#c4c6cd] mt-2">
                                                    <span>Duration: {selectedInterview.duration}</span>
                                                    <span>•</span>
                                                    <span>Completed: {selectedInterview.date}</span>
                                                </div>
                                            </div>

                                            {/* Score circle badge */}
                                            <div className="flex flex-col items-center justify-center w-20 h-20 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 p-2 text-center shrink-0">
                                                <span className="text-[10px] font-['JetBrains_Mono'] text-[#818cf8]">Overall</span>
                                                <span className="font-['Hanken_Grotesk'] text-2xl font-bold text-emerald-400">
                                                    {selectedInterview.overallScore}%
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* AI Executive Summary */}
                                    <div className="glass-panel rounded-xl p-5 border border-[#334155]">
                                        <h5 className="font-['Hanken_Grotesk'] text-sm font-bold text-[#E2E8F0] mb-2 flex items-center gap-2">
                                            <span className="material-symbols-outlined text-[#818cf8] text-[18px]">psychology</span>
                                            AI Executive Feedback
                                        </h5>
                                        <p className="font-['Inter'] text-sm text-[#c4c6cd] leading-relaxed">
                                            {selectedInterview.summary}
                                        </p>
                                    </div>

                                    {/* Strengths & Growth Areas */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        
                                        {/* Key Strengths */}
                                        <div className="glass-panel rounded-xl p-4 border border-emerald-500/20 bg-emerald-950/10">
                                            <h6 className="font-['Hanken_Grotesk'] text-xs font-bold text-emerald-400 mb-2.5 flex items-center gap-1.5 uppercase tracking-wider">
                                                <span className="material-symbols-outlined text-[16px]">check_circle</span>
                                                Key Strengths
                                            </h6>
                                            <ul className="flex flex-col gap-2">
                                                {selectedInterview.strengths.map((st, i) => (
                                                    <li key={i} className="font-['Inter'] text-xs text-[#c4c6cd] flex items-start gap-2">
                                                        <span className="text-emerald-400 font-bold">•</span>
                                                        <span>{st}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        {/* Areas to Refine */}
                                        <div className="glass-panel rounded-xl p-4 border border-amber-500/20 bg-amber-950/10">
                                            <h6 className="font-['Hanken_Grotesk'] text-xs font-bold text-amber-400 mb-2.5 flex items-center gap-1.5 uppercase tracking-wider">
                                                <span className="material-symbols-outlined text-[16px]">warning</span>
                                                Areas for Improvement
                                            </h6>
                                            <ul className="flex flex-col gap-2">
                                                {selectedInterview.weaknesses.map((wk, i) => (
                                                    <li key={i} className="font-['Inter'] text-xs text-[#c4c6cd] flex items-start gap-2">
                                                        <span className="text-amber-400 font-bold">•</span>
                                                        <span>{wk}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                    </div>

                                </div>
                            )}

                            {/* TAB 2: FULL TRANSCRIPT */}
                            {drawerTab === 'transcript' && (
                                <div className="flex flex-col gap-4">
                                    <div className="flex justify-between items-center text-xs font-['JetBrains_Mono'] text-[#c4c6cd] px-1">
                                        <span>Full dialogue history between AI and candidate</span>
                                        <span>{selectedInterview.transcript.length} Messages</span>
                                    </div>

                                    <div className="flex flex-col gap-4">
                                        {selectedInterview.transcript.map(msg => (
                                            <div
                                                key={msg.id}
                                                className={`p-4 rounded-xl border ${
                                                    msg.role === 'ai'
                                                        ? 'bg-[#1E293B]/60 border-indigo-500/30 self-start max-w-[90%]'
                                                        : 'bg-indigo-950/30 border-purple-500/30 self-end max-w-[90%]'
                                                }`}
                                            >
                                                <div className="flex items-center justify-between gap-3 mb-1.5">
                                                    <div className="flex items-center gap-2">
                                                        <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                                                            msg.role === 'ai' ? 'bg-indigo-600 text-white' : 'bg-purple-600 text-white'
                                                        }`}>
                                                            {msg.role === 'ai' ? 'AI' : 'U'}
                                                        </span>
                                                        <span className="font-['JetBrains_Mono'] text-xs font-bold text-[#E2E8F0]">
                                                            {msg.sender}
                                                        </span>
                                                    </div>
                                                    <span className="font-['JetBrains_Mono'] text-[10px] text-[#c4c6cd]/70">
                                                        {msg.timestamp}
                                                    </span>
                                                </div>
                                                <p className="font-['Inter'] text-xs text-[#dae2fd] leading-relaxed">
                                                    {msg.text}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* TAB 3: AI AUDIO PLAYBACK */}
                            {drawerTab === 'audio' && (
                                <div className="flex flex-col gap-6">
                                    
                                    <div className="glass-panel rounded-2xl p-6 border border-[#334155] flex flex-col gap-5">
                                        
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
                                                    <span className="material-symbols-outlined text-[24px]">graphic_eq</span>
                                                </div>
                                                <div>
                                                    <h5 className="font-['Hanken_Grotesk'] text-base font-bold text-[#E2E8F0]">
                                                        Mock Session Recording
                                                    </h5>
                                                    <p className="font-['JetBrains_Mono'] text-xs text-[#c4c6cd]">
                                                        Synthetic voice reproduction • High Fidelity
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Speed Selector */}
                                            <div className="flex items-center bg-[#0F172A] p-1 rounded-lg border border-[#334155]">
                                                {[0.75, 1, 1.25, 1.5, 2].map(speed => (
                                                    <button
                                                        key={speed}
                                                        onClick={() => setPlaybackSpeed(speed)}
                                                        className={`px-2 py-0.5 rounded text-[10px] font-['JetBrains_Mono'] ${
                                                            playbackSpeed === speed
                                                                ? 'bg-indigo-600 text-white font-bold'
                                                                : 'text-[#c4c6cd] hover:text-white'
                                                        }`}
                                                    >
                                                        {speed}x
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Animated Audio Waveform */}
                                        <div className="h-16 bg-[#020617] rounded-xl border border-[#334155]/60 flex items-center justify-center gap-1 px-4 overflow-hidden">
                                            {Array.from({ length: 42 }).map((_, idx) => {
                                                const heightPercent = Math.sin((idx * 0.4) + (currentTime * 0.5)) * 40 + 50
                                                return (
                                                    <div
                                                        key={idx}
                                                        className={`w-1 rounded-full transition-all duration-150 ${
                                                            isPlaying ? 'bg-gradient-to-t from-indigo-500 to-purple-400' : 'bg-slate-700'
                                                        }`}
                                                        style={{
                                                            height: isPlaying ? `${Math.max(15, heightPercent)}%` : '20%'
                                                        }}
                                                    />
                                                )
                                            })}
                                        </div>

                                        {/* Scrubber and Timestamps */}
                                        <div className="flex flex-col gap-1.5">
                                            <input
                                                type="range"
                                                min="0"
                                                max={selectedInterview.durationSec}
                                                value={currentTime}
                                                onChange={(e) => setCurrentTime(Number(e.target.value))}
                                                className="w-full h-1.5 bg-[#1E293B] rounded-lg appearance-none cursor-pointer accent-indigo-500"
                                            />
                                            <div className="flex justify-between font-['JetBrains_Mono'] text-xs text-[#c4c6cd]">
                                                <span>{formatSeconds(currentTime)}</span>
                                                <span>{formatSeconds(selectedInterview.durationSec)}</span>
                                            </div>
                                        </div>

                                        {/* Controls */}
                                        <div className="flex items-center justify-center gap-4 pt-2">
                                            <button
                                                onClick={() => setCurrentTime(Math.max(0, currentTime - 10))}
                                                className="p-2 text-[#c4c6cd] hover:text-white rounded-full hover:bg-white/5"
                                                title="Rewind 10s"
                                            >
                                                <span className="material-symbols-outlined text-[24px]">replay_10</span>
                                            </button>

                                            <button
                                                onClick={() => setIsPlaying(!isPlaying)}
                                                className="w-14 h-14 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white flex items-center justify-center shadow-lg shadow-indigo-500/40 hover:scale-105 active:scale-95 transition-all cursor-pointer"
                                            >
                                                <span className="material-symbols-outlined text-[32px]">
                                                    {isPlaying ? 'pause' : 'play_arrow'}
                                                </span>
                                            </button>

                                            <button
                                                onClick={() => setCurrentTime(Math.min(selectedInterview.durationSec, currentTime + 10))}
                                                className="p-2 text-[#c4c6cd] hover:text-white rounded-full hover:bg-white/5"
                                                title="Forward 10s"
                                            >
                                                <span className="material-symbols-outlined text-[24px]">forward_10</span>
                                            </button>
                                        </div>

                                    </div>

                                </div>
                            )}

                            {/* TAB 4: PER-QUESTION SCORE BREAKDOWN */}
                            {drawerTab === 'breakdown' && (
                                <div className="flex flex-col gap-4">
                                    {selectedInterview.questionsBreakdown.map((q, idx) => (
                                        <div
                                            key={idx}
                                            className="glass-panel rounded-xl p-5 border border-[#334155] flex flex-col gap-3"
                                        >
                                            <div className="flex justify-between items-start gap-3">
                                                <div>
                                                    <span className="text-[10px] font-['JetBrains_Mono'] text-[#818cf8] uppercase tracking-wider font-bold">
                                                        Question {q.qNumber} • {q.category}
                                                    </span>
                                                    <h5 className="font-['Hanken_Grotesk'] text-sm font-bold text-[#E2E8F0] mt-0.5">
                                                        {q.title}
                                                    </h5>
                                                </div>
                                                <span className="font-['Hanken_Grotesk'] text-lg font-bold text-emerald-400">
                                                    {q.overall}%
                                                </span>
                                            </div>

                                            {/* Multi-Dimensional Scores */}
                                            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#334155]/60 text-xs font-['JetBrains_Mono']">
                                                <div className="bg-[#0F172A] p-2 rounded-lg text-center border border-[#334155]">
                                                    <span className="text-[#c4c6cd] text-[10px]">Technical</span>
                                                    <div className="font-bold text-indigo-400">{q.technicalScore}%</div>
                                                </div>
                                                <div className="bg-[#0F172A] p-2 rounded-lg text-center border border-[#334155]">
                                                    <span className="text-[#c4c6cd] text-[10px]">Communication</span>
                                                    <div className="font-bold text-purple-400">{q.communicationScore}%</div>
                                                </div>
                                                <div className="bg-[#0F172A] p-2 rounded-lg text-center border border-[#334155]">
                                                    <span className="text-[#c4c6cd] text-[10px]">Confidence</span>
                                                    <div className="font-bold text-amber-400">{q.confidenceScore}%</div>
                                                </div>
                                            </div>

                                            <p className="text-xs font-['Inter'] text-[#c4c6cd] bg-[#171f33]/60 p-2.5 rounded-lg border border-[#334155]/40">
                                                💡 <strong>AI Note:</strong> {q.aiNotes}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* TAB 5: AI IMPROVEMENT TIPS */}
                            {drawerTab === 'tips' && (
                                <div className="flex flex-col gap-4">
                                    {selectedInterview.improvementTips.map((tip, idx) => (
                                        <div
                                            key={idx}
                                            className="glass-panel rounded-xl p-5 border border-[#334155] flex items-start gap-4"
                                        >
                                            <div className="w-10 h-10 rounded-xl bg-purple-950/60 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0">
                                                <span className="material-symbols-outlined text-[20px]">{tip.icon}</span>
                                            </div>
                                            <div>
                                                <h5 className="font-['Hanken_Grotesk'] text-sm font-bold text-[#E2E8F0]">
                                                    {tip.title}
                                                </h5>
                                                <p className="font-['Inter'] text-xs text-[#c4c6cd] mt-1 leading-relaxed">
                                                    {tip.description}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                        </div>

                        {/* Drawer Footer Actions (Export & Share) */}
                        <div className="p-6 border-t border-[#334155] bg-[#0F172A]/95 sticky bottom-0 z-20 flex flex-col sm:flex-row items-center gap-3">
                            <button
                                onClick={handleExportPdf}
                                disabled={isExporting}
                                className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-['JetBrains_Mono'] text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/25 transition-all cursor-pointer disabled:opacity-50"
                            >
                                {isExporting ? (
                                    <>
                                        <span className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin"></span>
                                        <span>Generating Report PDF...</span>
                                    </>
                                ) : (
                                    <>
                                        <span className="material-symbols-outlined text-[18px]">download</span>
                                        <span>Export PDF Report</span>
                                    </>
                                )}
                            </button>

                            <button
                                onClick={() => setIsShareModalOpen(true)}
                                className="w-full sm:w-auto py-3 px-4 rounded-xl btn-secondary font-['JetBrains_Mono'] text-xs font-bold flex items-center justify-center gap-2 cursor-pointer"
                            >
                                <span className="material-symbols-outlined text-[18px]">share</span>
                                <span>Share with Mentor</span>
                            </button>
                        </div>

                    </aside>
                </>
            )}

            {/* =========================================================
                SHARE WITH MENTOR MODAL
            ========================================================= */}
            {isShareModalOpen && (
                <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="glass-modal max-w-md w-full rounded-2xl p-6 border border-[#334155] flex flex-col gap-5 animate-in zoom-in-95 duration-150">
                        
                        <div className="flex justify-between items-start">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-[#818cf8]">
                                    <span className="material-symbols-outlined text-[20px]">send</span>
                                </div>
                                <div>
                                    <h4 className="font-['Hanken_Grotesk'] text-lg font-bold text-[#E2E8F0]">
                                        Share Review Session
                                    </h4>
                                    <p className="font-['Inter'] text-xs text-[#c4c6cd]">
                                        Allow mentors or peers to review your AI session
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsShareModalOpen(false)}
                                className="text-[#c4c6cd] hover:text-white p-1"
                            >
                                <span className="material-symbols-outlined text-[20px]">close</span>
                            </button>
                        </div>

                        {/* Link Box */}
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-['JetBrains_Mono'] text-[#c4c6cd]">
                                Shareable Evaluation URL
                            </label>
                            <div className="flex items-center gap-2 bg-[#020617] border border-[#334155] rounded-xl p-2 pl-3">
                                <input
                                    readOnly
                                    value={`https://interview.ai/review/share-${selectedInterview?.id || 'session'}`}
                                    className="bg-transparent text-xs font-['JetBrains_Mono'] text-[#dae2fd] flex-1 focus:outline-none"
                                />
                                <button
                                    onClick={handleCopyLink}
                                    className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-['JetBrains_Mono'] font-bold transition-all flex items-center gap-1"
                                >
                                    <span className="material-symbols-outlined text-[14px]">
                                        {isCopied ? 'check' : 'content_copy'}
                                    </span>
                                    {isCopied ? 'Copied!' : 'Copy'}
                                </button>
                            </div>
                        </div>

                        {/* Permissions Options */}
                        <div className="flex flex-col gap-2.5 pt-2 border-t border-[#334155]/60 text-xs font-['Inter'] text-[#c4c6cd]">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" defaultChecked className="rounded accent-indigo-500" />
                                <span>Include AI per-question score rubric</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" defaultChecked className="rounded accent-indigo-500" />
                                <span>Allow mentor to leave timestamped annotations</span>
                            </label>
                        </div>

                        <div className="flex justify-end gap-3 pt-3">
                            <button
                                onClick={() => setIsShareModalOpen(false)}
                                className="btn-secondary px-4 py-2 rounded-xl text-xs font-['JetBrains_Mono'] font-bold"
                            >
                                Close
                            </button>
                        </div>

                    </div>
                </div>
            )}

            {/* Export Success Toast Notification */}
            {exportSuccessToast && (
                <div className="fixed bottom-6 right-6 bg-[#0F172A] border border-emerald-500/50 px-4 py-3 rounded-xl shadow-2xl z-50 flex items-center gap-3 text-xs font-['JetBrains_Mono'] text-emerald-300 animate-in slide-in-from-bottom duration-200">
                    <span className="material-symbols-outlined text-emerald-400 text-[18px]">check_circle</span>
                    <span>Interview Evaluation PDF downloaded successfully!</span>
                </div>
            )}

            {/* Mobile Bottom Navigation */}
            <nav className="md:hidden fixed bottom-0 w-full bg-[#0F172A]/95 backdrop-blur-xl border-t border-[#334155] flex justify-around items-center py-3 px-4 z-50">
                <button onClick={() => navigate('/dashboard')} className="flex flex-col items-center gap-1 text-[#c4c6cd] hover:text-[#E2E8F0]">
                    <span className="material-symbols-outlined text-[20px]">dashboard</span>
                    <span className="text-[10px] font-['JetBrains_Mono']">Overview</span>
                </button>
                <button onClick={() => navigate('/history')} className="flex flex-col items-center gap-1 text-[#818cf8]">
                    <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                        history
                    </span>
                    <span className="text-[10px] font-['JetBrains_Mono']">History</span>
                </button>
                <button onClick={() => navigate('/interview/setup')} className="flex flex-col items-center gap-1 text-[#c4c6cd] hover:text-[#E2E8F0]">
                    <span className="material-symbols-outlined text-[20px]">psychology</span>
                    <span className="text-[10px] font-['JetBrains_Mono']">Practice</span>
                </button>
                <button onClick={() => navigate('/')} className="flex flex-col items-center gap-1 text-[#c4c6cd] hover:text-[#E2E8F0]">
                    <span className="material-symbols-outlined text-[20px]">home</span>
                    <span className="text-[10px] font-['JetBrains_Mono']">Home</span>
                </button>
            </nav>
        </div>
    )
}

export default History
