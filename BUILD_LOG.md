# Patent Family Analyzer - Build Log

This log documents the AI-assisted development process for teaching purposes.

---

## Entry 1 - 2026-01-29

### What I Asked Claude
"Build a Patent Family Analyzer tool" with detailed requirements including table columns, AI analysis features, data model, and phase breakdown.

### What Claude Did
Instead of jumping into code, Claude invoked a "brainstorming" skill to first understand requirements through dialogue. Asked clarifying questions one at a time to refine scope.

### Key Technique Used
**Collaborative design before implementation** - Using structured Q&A to refine requirements before writing any code.

### Why This Worked
The initial requirements were detailed but had ambiguities (API key handling, data fetching approach, UI interactions). By asking targeted questions, we avoided building the wrong thing.

### What I'd Tell a Beginner
Don't just dump requirements and say "build this." Let the AI ask clarifying questions. The back-and-forth produces a much better spec than a one-shot prompt.

### Mistakes Avoided or Caught
- Originally planned manual paste for claims/spec - simplified to USPTO auto-fetch only
- Planned color-coded overlap visualization - cut from MVP to reduce scope
- Planned export feature - cut from MVP
- Planned unclaimed concepts analysis - cut (requires spec text we can't get from USPTO)

---

## Entry 2 - 2026-01-29

### What I Asked Claude
"Can you pull patent data from Google Patents directly?"

### What Claude Did
Gave honest assessment: Google Patents has no official API and scraping is unreliable. Recommended USPTO PatentsView API instead (free, official, no auth required).

### Key Technique Used
**Asking about feasibility before committing** - Testing assumptions about external integrations early.

### Why This Worked
Avoided building a brittle scraping solution that could break during the demo. USPTO API is reliable and appropriate for the use case.

### What I'd Tell a Beginner
When your feature depends on external data, ask Claude about API availability and reliability BEFORE designing around it. Claude knows which APIs exist and their limitations.

### Mistakes Avoided or Caught
- Would have wasted time building Google Patents scraper that violates ToS
- Learned USPTO only has granted patents (not pending applications) - documented as limitation

---

## Entry 3 - 2026-01-29

### What I Asked Claude
"Use the Harvey AI UI aesthetic - check what you did for the post employment monitoring project"

### What Claude Did
Read the existing project files to extract the design system (colors, typography, component styles), then applied those same tokens to the new design.

### Key Technique Used
**Reference-based design consistency** - Pointing Claude to an existing project to maintain visual language across projects.

### Why This Worked
Instead of describing the aesthetic in words (error-prone), showing Claude actual code ensured exact consistency. The design tokens were extracted verbatim.

### What I'd Tell a Beginner
If you have an existing project with a style you like, point Claude to it. "Make it look like X" is more reliable than describing colors and spacing in words.

### Mistakes Avoided or Caught
- Could have gotten generic Material UI styling instead of the specific Harvey aesthetic
- Extracted exact hex codes rather than approximate descriptions

---

## Entry 4 - 2026-01-29

### What I Asked Claude
"Add a column listing the first independent claim. Font should scale as we resize the browser window."

### What Claude Did
Added the column to the table spec and introduced CSS `clamp()` for responsive typography, with specific min/max values for each text type.

### Key Technique Used
**Incremental design refinement** - Adding requirements one at a time rather than trying to specify everything upfront.

### Why This Worked
Seeing the table design made it obvious a claim column was missing. Iterating on a concrete design is easier than imagining everything abstractly.

### What I'd Tell a Beginner
Don't try to perfect requirements before starting. Get a draft, look at it, then refine. Claude handles iterative changes well.

### Mistakes Avoided or Caught
- Table would have been missing key information without this addition
- Responsive fonts prevent usability issues on different screen sizes

---

## Entry 5 - 2026-01-29

### What I Asked Claude
"Create implementation plan first"

### What Claude Did
Generated a detailed, 12-task implementation plan with:
- Exact file paths for every file to create/modify
- Complete code snippets (not pseudocode)
- Verification steps for each task
- Git commit messages ready to use

### Key Technique Used
**Detailed implementation planning with complete code** - The plan contained actual copyable code, not just descriptions like "add authentication."

### Why This Worked
When implementation started, each task was unambiguous. No interpretation needed. The subagents could execute exactly what was specified without making assumptions.

### What I'd Tell a Beginner
Ask for plans with ACTUAL CODE, not descriptions. "Create src/services/api.js with this exact content: [code]" beats "Create an API service" every time.

### Mistakes Avoided or Caught
- Plan included verification steps ("run npm run dev, expected: X") to catch issues early
- Dependencies ordered correctly (theme before components, context before components that use it)

---

## Entry 6 - 2026-01-29

### What I Asked Claude
"Subagent-Driven" (chose option 1 for implementation)

### What Claude Did
Used "Subagent-Driven Development" approach:
- Dispatched fresh subagent for each of 12 tasks
- Each subagent received full task context from the plan
- Spec compliance review after each task
- Code quality review after spec approval
- Marked tasks complete and moved to next

### Key Technique Used
**Subagent orchestration with reviews** - Main agent coordinates, fresh subagents execute each task, reviewers verify quality.

### Why This Worked
- Fresh context for each task (no confusion from accumulated context)
- Two-stage reviews caught issues early
- Main agent tracked progress without getting bogged down in implementation details
- 12 tasks completed in sequence with quality gates

### What I'd Tell a Beginner
For multi-task projects, consider orchestrating subagents rather than doing everything in one conversation. Each subagent starts fresh and focused.

### Mistakes Avoided or Caught
- Spec reviews ensured each task matched requirements exactly
- Code reviews caught minor issues (unused imports, missing types) as suggestions rather than blockers

---

## Session Summary - 2026-01-29

### What We Built
- Complete Patent Family Analyzer MVP
- React + Vite + Material UI frontend
- USPTO PatentsView API integration
- Claude API integration for claim extraction and analysis
- Harvey AI design system
- 12 components/services total

### Top 3 Techniques Demonstrated
1. **Collaborative brainstorming** - Design through Q&A before coding
2. **Implementation planning with complete code** - Plans you can execute, not interpret
3. **Subagent orchestration** - Fresh agents per task with review gates

### Best Teaching Moment
The decision to cut features (color coding, export, unclaimed concepts) during brainstorming. Scope reduction happened BEFORE any code was written, saving hours of wasted effort. YAGNI in practice.

### For the Webinar
Highlight the brainstorming phase dialogue where we cut 4 features in 5 minutes. Show the implementation plan with actual code vs a vague task list. Compare: "Add USPTO integration" vs the 90-line service file in the plan.

---
