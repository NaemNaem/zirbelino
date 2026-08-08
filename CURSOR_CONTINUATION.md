# Cursor Continuation Instructions

You are continuing an existing Zirbelino commerce project.

DO NOT rebuild the project.

DO NOT replace the architecture.

Read first:

1. README.md
2. docs/CURRENT_STATE.md
3. docs/ARCHITECTURE.md
4. docs/DEMO_TO_PRODUCTION.md
5. docs/CUSTOMER_REQUIREMENTS.md
6. docs/DECISIONS.md
7. migration/source-analysis.md

Architecture rule:

```text
UI → Service → Repository → Adapter → External System
```

Never:

```text
UI → External API
```

Go-live rule:

When backend data arrives, implement/replace adapters and run validated imports. Do not redesign the frontend to fit the old shop system.

Current project stage:

```text
DEMO / PRE-SALES — storefront ready with 20 products
```

Current task:

Presentation polish / customer demo walkthrough.

Next task:

After customer access: OpenCart/legacy importer + production adapters per DEMO_TO_PRODUCTION.md.

Known blockers:

- No customer backend access yet (expected)
- Demo catalog intentionally limited to 20 products
- Cloudflare may block naive Node fetch; crawler uses curl.exe / browser fallback
