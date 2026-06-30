import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type AIStatus = 'pending' | 'approved' | 'rejected' | 'exception'

export interface DecisionEntity {
  id: string
  timestamp: string
  fundName: string
  proposedAction: string
  confidence: number
  status: AIStatus
  pillar: 'Regime Detection' | 'Dynamic Allocation' | 'Stress Engine' | 'Risk Memory'
  rationale: string
  model_version: string
}

export interface AuthUser {
  username: string
  name: string
  role: string
  initials: string
  landingPath: string
  permissions: string[]
}

interface RiskStore {
  decisions: DecisionEntity[]
  metrics: {
    maxDrawdown: number
    regimeChangeFlagDays: number
    stressTestCycle: string
    trackingError: number
    allocatorNPS: number
  }
  currentUser: AuthUser | null
  updateDecisionStatus: (id: string, status: AIStatus) => void
  addDecision: (decision: DecisionEntity) => void
  login: (user: AuthUser) => void
  logout: () => void
}

const mockDecisions: DecisionEntity[] = [
  {
    id: 'dec-001',
    timestamp: new Date().toISOString(),
    fundName: 'Ascend Flagship Alpha',
    proposedAction: 'Shift 5% to defensive assets',
    confidence: 0.94,
    status: 'pending',
    pillar: 'Regime Detection',
    rationale: 'Macro data indicates impending volatility spike in tech sector.',
    model_version: 'v1.4.2-ensemble'
  },
  {
    id: 'dec-002',
    timestamp: new Date().toISOString(),
    fundName: 'Ascend Income Builder',
    proposedAction: 'Rebalance duration to 4.5 years',
    confidence: 0.88,
    status: 'pending',
    pillar: 'Dynamic Allocation',
    rationale: 'Rate cycle shift detected; expected returns curve steepening.',
    model_version: 'v2.0.1-LLM'
  },
  {
    id: 'dec-003',
    timestamp: new Date(Date.now() - 86400000).toISOString(), // yesterday
    fundName: 'Ascend Small Cap',
    proposedAction: 'Hold',
    confidence: 0.96,
    status: 'approved',
    pillar: 'Risk Memory',
    rationale: 'Historical drawdown event matched. No immediate action required.',
    model_version: 'v1.1.0'
  },
  {
    id: 'dec-004',
    timestamp: new Date(Date.now() - 3 * 3600000).toISOString(), // 3 hours ago
    fundName: 'Ascend Balanced Hybrid',
    proposedAction: 'Increase cash buffer to 8%',
    confidence: 0.91,
    status: 'pending',
    pillar: 'Stress Engine',
    rationale: 'Weekly Monte Carlo run shows tail-risk exposure above the 5% VaR band.',
    model_version: 'v1.3.0-stress'
  },
  {
    id: 'dec-005',
    timestamp: new Date(Date.now() - 2 * 86400000).toISOString(), // 2 days ago
    fundName: 'Ascend Global Equity',
    proposedAction: 'Reduce technology sector weight by 3%',
    confidence: 0.93,
    status: 'approved',
    pillar: 'Regime Detection',
    rationale: 'Regime classifier confirmed late-cycle rotation signal for two consecutive sessions.',
    model_version: 'v1.4.2-ensemble'
  },
  {
    id: 'dec-006',
    timestamp: new Date(Date.now() - 5 * 3600000).toISOString(), // 5 hours ago
    fundName: 'Ascend Short Duration Debt',
    proposedAction: 'Extend duration to 6 years',
    confidence: 0.79,
    status: 'rejected',
    pillar: 'Dynamic Allocation',
    rationale: 'Analyst overrode proposal — rate-cut timeline too uncertain for the duration extension.',
    model_version: 'v2.0.1-LLM'
  },
  {
    id: 'dec-007',
    timestamp: new Date(Date.now() - 6 * 3600000).toISOString(), // 6 hours ago
    fundName: 'Ascend Infrastructure Fund',
    proposedAction: 'Hedge 10% of book via index puts',
    confidence: 0.62,
    status: 'exception',
    pillar: 'Stress Engine',
    rationale: 'Confidence below autonomy threshold — insufficient historical tail-event data for this asset class.',
    model_version: 'v1.3.0-stress'
  },
  {
    id: 'dec-008',
    timestamp: new Date(Date.now() - 3 * 86400000).toISOString(), // 3 days ago
    fundName: 'Ascend ESG Leaders',
    proposedAction: 'Exit two holdings flagged for ESG controversy',
    confidence: 0.85,
    status: 'rejected',
    pillar: 'Risk Memory',
    rationale: 'Domain lead retained holdings pending engagement with portfolio companies.',
    model_version: 'v1.1.0'
  },
  {
    id: 'dec-009',
    timestamp: new Date(Date.now() - 8 * 3600000).toISOString(), // 8 hours ago
    fundName: 'Ascend Multi-Asset Growth',
    proposedAction: 'Rotate 12% allocation to gold and commodities',
    confidence: 0.58,
    status: 'exception',
    pillar: 'Regime Detection',
    rationale: 'Conflicting regime signals between macro and market-data models — routed for senior review.',
    model_version: 'v1.4.2-ensemble'
  },
  {
    id: 'dec-010',
    timestamp: new Date(Date.now() - 4 * 3600000).toISOString(), // 4 hours ago
    fundName: 'Ascend Mid Cap Opportunities',
    proposedAction: 'Trim mid-cap exposure by 4%',
    confidence: 0.83,
    status: 'approved',
    pillar: 'Dynamic Allocation',
    rationale: 'Below auto-approve threshold — portfolio risk analyst reviewed and approved manually after checking sector concentration.',
    model_version: 'v2.0.1-LLM'
  }
]

export const useRiskStore = create<RiskStore>()(
  persist(
    (set) => ({
      decisions: mockDecisions,
      metrics: {
        maxDrawdown: -18.5, // baseline
        regimeChangeFlagDays: 2, // starting to improve
        stressTestCycle: 'bi-weekly',
        trackingError: -15.0,
        allocatorNPS: 5,
      },
      currentUser: null,
      updateDecisionStatus: (id, status) =>
        set((state) => ({
          decisions: state.decisions.map((d) =>
            d.id === id ? { ...d, status } : d
          ),
        })),
      addDecision: (decision) =>
        set((state) => ({
          decisions: [decision, ...state.decisions],
        })),
      login: (user) => set({ currentUser: user }),
      logout: () => set({ currentUser: null }),
    }),
    {
      name: 'ascend-risk-storage-v4',
    }
  )
)
