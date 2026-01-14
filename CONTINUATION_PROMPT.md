# CONTINUATION_PROMPT.md
## Ready-to-Use Session Resume Prompt

Copy and paste the following prompt to resume work on this project:

---

## Prompt for New Session

```
I'm continuing work on the Walmart Store Operations Orchestrator project.

## Project Context
Read the PROJECT_CONTEXT.md file at:
/sessions/hopeful-sleepy-lamport/mnt/onyedikachukwunwadike/walmart-ops/PROJECT_CONTEXT.md

## Key Information
- **Project Root**: /sessions/hopeful-sleepy-lamport/mnt/onyedikachukwunwadike/walmart-ops/
- **Deployed URL**: https://walmart-ops-v6.vercel.app
- **Build Plan**: BUILD_PLAN.md in project root
- **Deployment Repo**: Hauly-Co/walmart-ops-v6 (NOT onyinwadike-commits/walmart-ops)

## Current State
- Dashboard, Amazon Warfare, and Visual Merchandising modules are implemented
- 9 Market 396 Las Vegas stores are configured
- Multi-LLM engine with 6 AI agents is built
- User Feedback System (Phase 5) is NOT STARTED

## Tech Stack
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS (Dark Glassmorphism theme)
- Zustand (state management)
- Lucide React (icons)

## What I Need Help With
[DESCRIBE YOUR SPECIFIC TASK HERE]

## Constraints
1. Do NOT add sales metrics/data unless explicitly requested
2. Push changes to Hauly-Co/walmart-ops-v6 for deployment
3. Use the existing dark theme colors (--walmart-blue: #0071CE, --spark-yellow: #FFC220)
4. Store numbers are: 2059, 3455, 5765, 4260, 1807, 4338, 3807, 5005, 5107
```

---

## Quick Reference Commands

### Development
```bash
cd /sessions/hopeful-sleepy-lamport/mnt/onyedikachukwunwadike/walmart-ops
npm run dev
```

### Build
```bash
npm run build
```

### Deploy (via GitHub)
```bash
# Ensure you're pushing to the correct repo
git remote -v
git push origin main  # to Hauly-Co/walmart-ops-v6
```

---

## Common Tasks

### To implement User Feedback System (Phase 5):
```
Continue work on the Walmart Ops project. Next task: Implement Phase 5 - User Feedback System.

Required components:
1. FeedbackForm component with category selection
2. Sentence starter library (from BUILD_PLAN.md section 11)
3. /api/feedback route for submission
4. Feedback dashboard page

Reference BUILD_PLAN.md section 11 for the complete specification.
```

### To fix deployment issues:
```
The Walmart Ops deployment isn't updating. Help me:
1. Check if changes are in Hauly-Co/walmart-ops-v6
2. Verify Vercel deployment status
3. Push latest code if needed
```

### To add a new feature:
```
I need to add [FEATURE] to the Walmart Ops project.

Please:
1. Read PROJECT_CONTEXT.md for current state
2. Check BUILD_PLAN.md for any specifications
3. Implement following existing patterns
4. Test locally before pushing
```

---

## Important Files to Reference

| File | Purpose |
|------|---------|
| `BUILD_PLAN.md` | Complete specification |
| `PROJECT_CONTEXT.md` | Current state & gaps |
| `src/data/stores.ts` | Store data (9 stores) |
| `src/app/page.tsx` | Main dashboard |
| `src/lib/llm/orchestrator.ts` | Multi-LLM logic |
| `src/lib/amazon/` | Amazon Warfare module |
| `src/lib/visual/` | Visual Merch module |

---

## Environment Setup

If starting fresh, create `.env.local` with:
```env
PERPLEXITY_API_KEY=your_key
XAI_API_KEY=your_key
GOOGLE_AI_API_KEY=your_key
ANTHROPIC_API_KEY=your_key
OPENAI_API_KEY=your_key
DEEPSEEK_API_KEY=your_key
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

*Last Updated: January 2025*
