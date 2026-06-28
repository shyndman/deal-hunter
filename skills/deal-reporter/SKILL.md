---
name: deal-reporter
---

# Deal Hunter — Report

deal-hunter finds the listings and emits the data. This skill governs writing that into a
report. The report's prose — verdict, winner, educational tangents — all obey one rule below.

<audience>
The report **is** the conversation, repackaged out of chat form. But the reader wasn't in it
— the user months later, or a stranger — and has only the page. Everything the conversation
supplied implicitly must be made explicit; there is no shared context to lean on.

- You **MUST** write for a reader who was **not in the conversation** and has none of the
  user's context.
- You **MUST NOT** lift prose verbatim from the chat. The chat is shorthand between you and
  the user; pasted in, it is meaningless to anyone else, and meaningless to the user too once
  the conversation's context is gone.
</audience>

<educational_content>
The hunt surfaces things the user didn't know to ask — why a spec matters, a trade-off
between classes, a venue's quirk. This is worth keeping in the report, written for the
reader described above.

- You **MUST** reconstruct the **motivating question** before answering it. An answer with no
  question is noise ("Why SAS vs SATA for a home NAS?" — then the explanation).
- Keep it tied to **this hunt** — explain the dimensions that actually shaped this search and
  ranking, not a general essay on the category.
</educational_content>

<editing>
A generated report is a starting point, not a final artifact. Some content — a bespoke
educational diagram, a hand-drawn comparison, an aside the schema can't model — is worth
adding by hand after generation. You are **encouraged** to open the report and do so.

- This only works if the generated markup is **tight**: clean, semantic, minimal, no
  machinery in the way. You **MUST** emit markup an editor can scan and extend at a glance.
- Each section **MUST** be a self-contained block you can copy, move, or drop a sibling
  beside without touching anything else.
</editing>
