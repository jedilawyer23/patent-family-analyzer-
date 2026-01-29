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

## Techniques Coming in Implementation Phase

- Test-driven development with Claude
- Incremental building (smallest working version first)
- Error-first development (handle failures before happy path)
- Prompt engineering for consistent AI extraction
