# AI-Assisted Development Techniques Summary

Quick reference of techniques demonstrated in this project.

---

## 1. Collaborative Design Before Implementation
**When to use:** Starting any non-trivial project

Let the AI ask clarifying questions before coding. The back-and-forth dialogue refines requirements and catches ambiguities early.

**Example prompt pattern:**
```
"I want to build X. Here are my requirements: [details]"
→ Let AI ask questions
→ Answer one at a time
→ Arrive at validated design
```

---

## 2. Feasibility Checking for External Dependencies
**When to use:** Features that depend on external APIs or services

Ask Claude about API availability, authentication requirements, and limitations before designing around them.

**Example prompt:**
```
"Can you pull data from [service]? What APIs are available?"
```

---

## 3. Reference-Based Design Consistency
**When to use:** Maintaining visual consistency across projects

Point Claude to existing code rather than describing styles in words. "Make it look like project X" is more reliable than color descriptions.

**Example prompt:**
```
"Use the same UI aesthetic as [project path] - check the component files"
```

---

## 4. Incremental Design Refinement
**When to use:** Any design or spec work

Don't try to perfect everything upfront. Get a draft, review it, then iterate. Adding requirements one at a time catches gaps.

**Example prompt pattern:**
```
"Show me the table design"
→ Review
→ "Add column for X, make Y responsive"
→ Review
→ "Looks good, finalize"
```

---

## 5. Scope Cutting with YAGNI
**When to use:** MVP planning

Actively remove features that aren't essential. Ask "do we need this for MVP?" for each feature. Claude will propose cuts if you signal openness to simplification.

**Features cut in this project:**
- Color-coded overlap visualization
- Export to CSV/PDF
- Unclaimed concepts analysis
- Manual paste fallback
- Spec text input

---

## 6. Security Trade-off Acknowledgment
**When to use:** When making pragmatic security decisions

Ask Claude directly "is this safe?" and get an honest assessment. Document the trade-off explicitly rather than ignoring it.

**Example exchange:**
```
User: "Is storing API key in frontend safe?"
Claude: "No, but acceptable for demo/personal use because [reasons]"
→ Document the limitation in design
```

---

## 7. Design Document as Source of Truth
**When to use:** Before implementation begins

Write a comprehensive design doc that serves as the implementation guide. Includes data model, API contracts, UI specs, and scope boundaries.

**Benefits:**
- Catches design issues before coding
- Serves as reference during implementation
- Documents decisions for future you

---

## 8. Implementation Planning with Complete Code
**When to use:** Before any multi-file implementation

Generate plans with actual code, not task descriptions. Each task should include:
- Exact file paths
- Complete code to copy-paste
- Verification commands
- Expected output
- Commit message

**Example prompt:**
```
"Create an implementation plan with actual code for each task, not descriptions"
```

**Bad:** "Task 3: Add authentication"
**Good:** "Task 3: Create src/auth/login.js with this exact content: [100 lines of code]"

---

## 9. Bite-Sized Tasks (2-5 minutes each)
**When to use:** Breaking down implementation work

Each task should be:
- One logical unit of work
- Independently testable
- Independently committable
- Clear success criteria

**Good granularity:**
- Create one component file
- Add one service
- Wire up one integration

**Bad granularity:**
- "Build the frontend" (too big)
- "Add semicolon" (too small)

---

## 10. Subagent Orchestration
**When to use:** Multi-task implementations

Instead of one long conversation, orchestrate fresh subagents:
- Main agent reads plan, creates task list
- Dispatch fresh subagent per task
- Subagent implements, tests, commits
- Review subagent verifies spec compliance
- Review subagent checks code quality
- Mark complete, move to next

**Benefits:**
- Fresh context per task (no accumulated confusion)
- Quality gates between tasks
- Main agent tracks progress without implementation details

---

## 11. Two-Stage Code Review
**When to use:** After each implementation task

1. **Spec compliance review** - Did they build what was requested? Nothing missing, nothing extra?
2. **Code quality review** - Is it well-built? Clean, tested, maintainable?

Run spec review first. Only run quality review after spec passes.

---

## 12. Prompt Engineering for AI Extraction
**When to use:** When Claude analyzes content

For consistent results, use structured prompts:
- Clear role ("You are a patent analyst")
- Specific output format ("Return ONLY the claim text")
- Constraints ("Do not include claim numbers")
- Examples if needed

**Example from this project:**
```
systemPrompt: "You are a patent claim analyzer. Extract the first independent claim...
Return ONLY the claim text, nothing else. Do not include the claim number."
```

---

## Quick Reference Card

| Phase | Key Technique |
|-------|---------------|
| Starting | Collaborative brainstorming with Q&A |
| External APIs | Feasibility check before design |
| UI Design | Reference existing projects |
| Scope | Cut features aggressively (YAGNI) |
| Planning | Complete code in plans, not descriptions |
| Execution | Subagent per task with reviews |
| AI Prompts | Structured prompts with constraints |
