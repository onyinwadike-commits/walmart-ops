# PROJECT_CONTEXT.md
## Walmart Store Operations Orchestrator - Market 396
**Generated:** January 2025
**Purpose:** Session continuity and project state tracking

---

## 1. Project Locations

### Local Paths
```
Project Root:     /sessions/hopeful-sleepy-lamport/mnt/onyedikachukwunwadike/walmart-ops/
Source Code:      /sessions/hopeful-sleepy-lamport/mnt/onyedikachukwunwadike/walmart-ops/src/
Build Plan:       /sessions/hopeful-sleepy-lamport/mnt/onyedikachukwunwadike/walmart-ops/BUILD_PLAN.md
Package JSON:     /sessions/hopeful-sleepy-lamport/mnt/onyedikachukwunwadike/walmart-ops/package.json
```

### GitHub Repositories
| Repository | Purpose | Status |
|------------|---------|--------|
| `onyinwadike-commits/walmart-ops` | Development repo | Active |
| `Hauly-Co/walmart-ops-v6` | Production deployment source | **Vercel-connected** |

### Deployment URLs
| Environment | URL | Status |
|-------------|-----|--------|
| Production | https://walmart-ops-v6.vercel.app | Live |
| Vercel Dashboard | https://vercel.com/onyinwadike-commits-projects/walmart-ops-v6 | Active |

> **IMPORTANT:** The Vercel deployment is connected to `Hauly-Co/walmart-ops-v6`, NOT `onyinwadike-commits/walmart-ops`. Any changes must be pushed to `Hauly-Co/walmart-ops-v6` to trigger deployment.

---

## 2. Tech Stack

### Dependencies (from package.json)
```json
{
  "dependencies": {
    "@supabase/supabase-js": "^2.90.1",
    "lucide-react": "^0.562.0",
    "next": "14.2.35",
    "react": "^18",
    "react-dom": "^18",
    "zustand": "^5.0.10"
  },
  "devDependencies": {
    "@types/node": "^20",
    "@types/react": "^18",
    "@types/react-dom": "^18",
    "eslint": "^8",
    "eslint-config-next": "14.2.35",
    "postcss": "^8",
    "tailwindcss": "^3.4.1",
    "typescript": "^5"
  }
}
```

### Key Technologies
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript 5
- **Styling:** Tailwind CSS 3.4 (Dark Glassmorphism theme)
- **State:** Zustand
- **Database:** Supabase
- **Icons:** Lucide React
- **Deployment:** Vercel

---

## 3. File Structure

```
walmart-ops/
├── src/
│   ├── app/
│   │   ├── page.tsx                           # Main dashboard
│   │   ├── layout.tsx                         # Root layout
│   │   ├── globals.css                        # Global styles
│   │   ├── amazon-warfare/
│   │   │   └── page.tsx                       # Amazon Warfare module
│   │   ├── visual-merchandising/
│   │   │   └── page.tsx                       # Visual Merch AI module
│   │   ├── report/
│   │   │   └── [storeId]/
│   │   │       └── page.tsx                   # AI Report generator
│   │   └── api/
│   │       ├── amazon/route.ts                # Amazon API endpoint
│   │       ├── visual/route.ts                # Visual Merch API
│   │       └── report/[storeId]/route.ts      # Report generation API
│   │
│   ├── components/
│   │   ├── Header.tsx                         # App header
│   │   ├── Sidebar.tsx                        # Navigation sidebar
│   │   ├── StoreCard.tsx                      # Store display card
│   │   ├── MetricCard.tsx                     # Metric display
│   │   ├── SectionTabs.tsx                    # Section navigation
│   │   ├── index.ts                           # Component exports
│   │   ├── amazon/                            # Amazon Warfare components
│   │   │   ├── CompetitorDashboard.tsx
│   │   │   ├── MarketOpportunityCard.tsx
│   │   │   ├── PriceAlertList.tsx
│   │   │   ├── PriceComparisonCard.tsx
│   │   │   ├── StrategyCard.tsx
│   │   │   ├── WarfareModeToggle.tsx
│   │   │   └── index.ts
│   │   ├── report/                            # Report components
│   │   │   ├── AgentAttribution.tsx
│   │   │   ├── ConfidenceBadge.tsx
│   │   │   ├── ReportCard.tsx
│   │   │   ├── ReportSection.tsx
│   │   │   └── index.ts
│   │   └── visual/                            # Visual Merch components
│   │       ├── ComplianceCard.tsx
│   │       ├── PlanogramViewer.tsx
│   │       └── ShelfAnalysis.tsx
│   │
│   ├── data/
│   │   └── stores.ts                          # Market 396 store data (9 stores)
│   │
│   ├── lib/
│   │   ├── llm/                               # Multi-LLM engine
│   │   │   ├── base-agent.ts
│   │   │   ├── orchestrator.ts
│   │   │   ├── report-generator.ts
│   │   │   ├── types.ts
│   │   │   ├── index.ts
│   │   │   └── agents/
│   │   │       ├── perplexity-agent.ts
│   │   │       ├── grok-agent.ts
│   │   │       ├── gemini-agent.ts
│   │   │       ├── claude-agent.ts
│   │   │       ├── chatgpt-agent.ts
│   │   │       ├── deepseek-agent.ts
│   │   │       └── index.ts
│   │   ├── amazon/                            # Amazon Warfare logic
│   │   │   ├── price-tracker.ts
│   │   │   ├── strategy-generator.ts
│   │   │   ├── types.ts
│   │   │   └── index.ts
│   │   └── visual/                            # Visual Merch logic
│   │       ├── merchandising-ai.ts
│   │       ├── planogram-analyzer.ts
│   │       ├── types.ts
│   │       └── index.ts
│   │
│   └── stores/
│       └── appStore.ts                        # Zustand state management
│
├── BUILD_PLAN.md                              # Complete build specification
├── PROJECT_CONTEXT.md                         # This file
├── CONTINUATION_PROMPT.md                     # Session resume prompt
├── package.json
├── tailwind.config.ts
├── tsconfig.json
├── next.config.mjs
├── .env.example                               # Environment template
└── .env.local                                 # Local environment (14 lines, contains API keys)
```

---

## 4. Environment Variables

### Required Keys (from .env.example)
```env
# AI Provider API Keys
PERPLEXITY_API_KEY=           # Real-time search agent
XAI_API_KEY=                  # Grok social trends agent
GOOGLE_AI_API_KEY=            # Gemini visual agent
ANTHROPIC_API_KEY=            # Claude strategy agent
OPENAI_API_KEY=               # ChatGPT general agent
DEEPSEEK_API_KEY=             # DeepSeek backup agent

# Application Config
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Optional
REPORT_CACHE_TTL_MS=300000
USE_MOCK_RESPONSES=true
LOG_LEVEL=info
```

### Credential Notes
- `.env.local` exists with 14 lines of configuration
- API keys are configured for all 6 LLM providers
- No Supabase keys found in .env.local (may need setup)
- No Redis/Upstash keys (caching may use mock mode)

---

## 5. Store Data (Market 396)

### 9 Stores Configured
| # | Store Number | Name | Format | Tier |
|---|-------------|------|--------|------|
| 1 | 2059 | Charleston Supercenter | Supercenter | A |
| 2 | 3455 | Craig Road Supercenter | Supercenter | A+ |
| 3 | 5765 | Tropicana Supercenter | Supercenter | B+ |
| 4 | 4260 | Blue Diamond Supercenter | Supercenter | A+ |
| 5 | 1807 | Henderson Supercenter | Supercenter | B |
| 6 | 4338 | Centennial Hills Supercenter | Supercenter | A+ |
| 7 | 3807 | Flamingo Neighborhood Market | Neighborhood Market | B+ |
| 8 | 5005 | Sahara Neighborhood Market | Neighborhood Market | C+ |
| 9 | 5107 | Rainbow Neighborhood Market | Neighborhood Market | B |

### Store Data Source
File: `src/data/stores.ts`
- Complete store interface with all fields from BUILD_PLAN.md
- Includes: coordinates, sqft, phone, openDate, departments, features, sections, competitorProximity

---

## 6. Feature Completion Status

### Phase 1: Foundation - COMPLETE
- [x] Next.js 14 project setup
- [x] Tailwind + dark glassmorphism theme
- [x] Layout components (Header, Sidebar, SectionTabs)
- [x] Store data constants (9 stores)
- [x] Zustand state management

### Phase 2: Multi-LLM Engine - COMPLETE
- [x] LLM agent configuration (6 agents)
- [x] Base agent class
- [x] Orchestrator service
- [x] Report generation API
- [x] Agent attribution UI
- [x] Confidence badges

### Phase 3: Amazon Warfare - COMPLETE
- [x] Price intelligence dashboard
- [x] Threat level indicators
- [x] Price comparison cards
- [x] Price alert list
- [x] Strategy cards
- [x] Market opportunity cards
- [x] Competitor dashboard
- [x] Warfare mode toggle

### Phase 4: Visual Merchandising AI - COMPLETE
- [x] Planogram viewer
- [x] Compliance scoring
- [x] Shelf analysis component
- [x] AI recommendation panel
- [x] Section filtering
- [x] Heatmap support

### Phase 5: User Feedback System - NOT STARTED
- [ ] Feedback form component
- [ ] Sentence starter library
- [ ] Feedback submission API
- [ ] Feedback dashboard
- [ ] Analytics integration

### Phase 6: Polish & Deploy - PARTIAL
- [x] Basic deployment to Vercel
- [ ] Performance optimization
- [ ] Error handling refinement
- [ ] User onboarding flow
- [ ] Documentation
- [ ] Production environment setup

---

## 7. Known Issues & Deviations

### Critical Issues
1. **Deployment Repository Mismatch**:
   - Vercel watches `Hauly-Co/walmart-ops-v6`
   - Development happens in `onyinwadike-commits/walmart-ops`
   - Must push to correct repo for deployments

2. **Missing Database Integration**:
   - Supabase tables not created
   - No real-time data persistence
   - Reports/feedback not saved

3. **Mock Data Mode**:
   - LLM responses may be mocked without API keys
   - Price tracking uses generated data
   - Visual analysis uses simulated results

### Deviations from BUILD_PLAN.md
| Section | Plan | Reality | Gap |
|---------|------|---------|-----|
| Auth | Full Supabase auth | None | No login/registration |
| Database | PostgreSQL tables | None | All data in-memory |
| Redis | Upstash caching | None | No response caching |
| Framer Motion | Animation library | Not installed | Missing from dependencies |
| React Query | Server state | Not installed | Missing from dependencies |
| Recharts | Visualizations | Not installed | Missing from dependencies |

### Missing Planned Features
1. **Authentication Flow** - No login/register pages
2. **Database Persistence** - No Supabase tables
3. **Report Export** - No PDF/Excel export
4. **Push Notifications** - Not implemented
5. **Settings Page** - Not implemented
6. **Mobile PWA** - Not configured

---

## 8. API Routes

### Implemented
| Route | Method | Purpose |
|-------|--------|---------|
| `/api/report/[storeId]` | GET | Fetch cached report |
| `/api/report/[storeId]` | POST | Generate new report |
| `/api/amazon` | GET/POST | Amazon warfare data |
| `/api/visual` | GET/POST | Visual merchandising analysis |

### Not Implemented (from BUILD_PLAN.md)
- `/api/llm/perplexity` - Direct LLM endpoints
- `/api/llm/grok`
- `/api/llm/gemini`
- `/api/llm/claude`
- `/api/llm/chatgpt`
- `/api/llm/deepseek`
- `/api/stores` - Store management
- `/api/feedback` - User feedback

---

## 9. Next Steps (Priority Order)

### Immediate (Before Next Session)
1. Ensure `Hauly-Co/walmart-ops-v6` has latest code
2. Verify Vercel deployment is working
3. Test all 3 main features (Dashboard, Amazon Warfare, Visual Merch)

### Short Term
1. **Phase 5**: Implement User Feedback System
   - Create feedback form component
   - Add sentence starters
   - Create feedback API route

2. **Database Setup**
   - Create Supabase project
   - Run table migration scripts
   - Add Supabase env keys

### Medium Term
1. Add authentication flow
2. Implement report caching (Redis/Upstash)
3. Add missing dependencies (Framer Motion, Recharts)
4. Performance optimization

---

## 10. Session Notes

### Previous Session Summary
- Fixed store numbers mismatch (had wrong numbers, now correct 9 stores)
- Removed unwanted sales data from dashboard
- Updated `Hauly-Co/walmart-ops-v6` repository
- Triggered Vercel deployment

### Files Modified Recently
- `src/app/page.tsx` - Dashboard with correct store data
- `src/data/stores.ts` - Store data without sales metrics

---

*This document should be read at the start of every session to understand project state.*
