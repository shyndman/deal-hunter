---
name: deal-hunter
description: >
  Use when the user wants to buy, source, or find the best price on a physical product —
  e.g. "find me a 1500W ATX power supply", "where's the cheapest <thing>", "I need an <X>,
  what are my options", "help me shop for <Y>", or finding deals/listings for something they
  intend to purchase. Triggers on product research, price comparison, and deal hunting where
  the goal is real listings to buy from.
---

# Deal Hunter

<prime_directive>
- You **MUST NOT** purchase, add to cart, check out, place a bid, or commit to any
  transaction under any circumstances. The deliverable is a ranked set of product listings
  the user can buy from — nothing more.
- You **MUST** find the best *landed price for a product that meets the user's needs* — not
  the best product. The user sometimes wants the best, sometimes wants the cheapest, but always 
  wants a bunch of options.
</prime_directive>

<pipeline>
The hunt runs in five stages, in order:

1. **Recon** — light, silent. Get current on the product class and where to buy it.
2. **Brief** — interactive. Settle what the user actually wants. User signs off.
3. **Hunt** — fan out one agent per store; gather listings.
4. **Normalize** — convert every listing to landed CAD.
5. **Rank & present** — one ranked markdown table in chat.
</pipeline>

<stage_recon>
Run **before** talking to the user. Keep it shallow — no review-reading yet.

- You **MUST** do a quick gut-check on the product category. Model knowledge of prices and
  state-of-the-art is stale; refresh **what exists now** (current products, current price
  band) and **where people shop for it now**.
- The user's primary marketplaces are **Amazon, AliExpress, and eBay**. You **SHOULD** start
  there, but **MUST** widen the venue set for categories those stores serve poorly (e.g. a
  children's T-ball set) — discover where that product is actually sold.
- Don't boil the ocean -- but definitely heat it up a few degrees — on the order of ~10 venues for a broad search. The exact
  number is not prescribed; cover the space properly without going absurd.
</stage_recon>

<stage_brief>
Turn recon into a settled, signed-off search brief.

- You **MUST** come back with category **education plus questions** in one consolidated pass.
  Surface the dimensions the user may not know exist (e.g. for PSUs: efficiency tiers —
  bronze/gold/platinum/titanium — and form-factor alternatives like server supplies).
- You **SHOULD** lean toward **more questions, not fewer**. The user prefers to be asked.
- You **MUST** ask where the product ships to. Default is **Toronto**, but confirm every time
  — it is sometimes BC, Buffalo, or elsewhere, and ship-to drives all pricing downstream.
- For **small, portable items** (mini PCs, a few hard drives, and the like), you **SHOULD**
  also offer a **Buffalo** ship-to: the user's partner's sister lives there and crosses to
  Toronto by land roughly monthly, so she can hand-carry. Surface it whenever the savings look
  meaningful — it trades a US-domestic price (no cross-border shipping or Canadian duties) for
  a wait until her next trip. Present it as an option and let the user decide.
- You **SHOULD** loosen rigid specs sensibly and say so (a request for "1500W" may be fine at
  1400–1600W). Surface the trade-off rather than silently widening.
- **Escape hatch:** if the user says "just search" (or similar) at any point, you **MUST**
  stop asking, fill remaining brief values with sensible defaults, and proceed.
- You **MUST** present the settled brief — acceptable spec ranges, hard requirements vs
  nice-to-haves, ship-to, currency, candidate venues — and **wait for the user's go** before
  starting the hunt (unless the escape hatch was used).

The brief decides the hunt's shape:

- **Models-first** — when *which product* is unsettled (user doesn't know brands; the T-ball
  case). Read reviews/roundups → pick a shortlist of specific models that fit → then
  price-hunt those exact models across venues.
- **Listings-first** — when the user already knows the product. Search venues for the
  category, pull everything matching the spec; reviews only inform ranking.
</stage_brief>

<stage_hunt>
- You **MUST** browse with the **camoufox-cli** (see `skill://camoufox-cli`). Each store-agent
  runs in its **own ephemeral clone** of the persistent **shopping** profile
  (`camou --session <store> --clone-from shopping ...`) — a throwaway copy that inherits the
  logged-in cookies and frozen fingerprint but writes nothing back and is discarded on close.
- You **MUST** fan out **one agent per store** (not per product). Each store-agent gets the
  brief plus the candidate model list, runs its own searches in that one store, and returns
  normalized listings. Per-store keeps each store to a single session, single login, and
  makes within-store dedup free.
- Each store-agent gets its **own isolated session** — no shared tabs, no shared state. It
  **MUST** close that session when done so the clone is discarded. Re-snapshot after every
  navigation or DOM change (refs are temporary — see the camoufox ref-lifecycle rules).
- You **MUST** search by **first visiting the store's home page, typing into its search field,
  and submitting that form**. **Direct search/category URLs are PROHIBITED** — jumping
  straight to a constructed query URL is a commonly detected signal that a bot is driving the
  browser.
- Deep review-reading happens **here**, after the brief is settled — to build the shortlist
  (models-first) or to inform ranking (listings-first).
- For each listing, capture: title, **price and shipping in the listing's native currency
  (no conversion)**, ship-from country, seller/rating, stock, key specs against the brief,
  and the listing URL. Store-agents **MUST NOT** convert currencies — that is the
  orchestrator's job.
- On **AliExpress, Temu, DHgate, Banggood, and Alibaba** — image-heavy stores that lean on
  images over text — you **MUST** open and read **several product images**
  before trusting a listing. The information you need is often locked in images, and not just
  the gallery: these stores bury specs in the **description section as images**, so read those
  too. Products are frequently mislabeled or misleading, so this verification is what
  separates a real match from a false positive. **Do not** take a listing at its title/spec
  text alone — confirm against the images that it is actually the product you think it is.
- You **SHOULD** gather a **fuller, more varied set**, not just the cheapest few — span the
  spec range, conditions, sellers, and venues. A denser set with real spread shows the shape
  of the market; a thin list of the absolute-cheapest hides it.
- You **MUST** record **how you gathered** — queries run, filters applied, what you skipped
  and why, where you stopped. It need not be statistical; a stated, gut-level rationale is
  enough. An undescribed pile of listings is not a meaningful set.
  
## Bot Blocks & Failures
Default browsing is **headless**. The user does not talk to store-agents directly — only the
orchestrator does.

- **Any failure MUST be reported to the orchestrator over IRC the moment it happens** — not at
  the end. This includes bot walls (Cloudflare Turnstile, captcha, "verify you're human"),
  **forbidden/blocked response codes** (403, 429, etc.), dead venues, parse failures, lost
  logins — anything. **Zero results counts only when it looks like a broken or blocked search**
  (empty results page, failed submit, suspicious wall) — a store genuinely not stocking the
  item is a real answer, not a failure. Silent failure of an entire search strategy is
  **PROHIBITED**.
- After reporting, the store-agent **MUST** wait on IRC (`await: true`) for instructions on
  how to proceed. If no instructions arrive, it **MUST** mark the task **failed** — never
  guess or silently move on.
- **No workarounds.** Store-agents **MUST NOT** attempt to bypass a bot wall or blocked
  response — no opening the browser headed, no retry loops, no evasion. Report it and stop
  that strategy. Workarounds risk getting the account banned.
- The orchestrator **MUST** surface those failures to the user **live**, mid-hunt, so a fix
  or alternative strategy can be applied before the final table is written.
</stage_hunt>

<stage_normalize>
Normalization is **solely the orchestrator's responsibility** — store-agents return native
prices untouched. Every price shown to the user is a **landed price**. For each listing, the
orchestrator:

- You **MUST** convert to **CAD** using the latest exchange rate from **x-rates.com**, and
  note the rate/source.
- You **MUST** fold **shipping into the displayed price** — the headline number is
  item + shipping in CAD.
- You **MUST** estimate **customs/duties whenever the item crosses the Canadian border**
  (ship-from country ≠ ship-to country), and **show it broken out separately** from the
  landed price — never baked in. Label it an **estimate** and note it varies with how the
  seller declares/ships the goods.
- When ship-to is **Buffalo** (the hand-carry route), the item is **US-domestic**: price it
  with US shipping and **no Canadian customs** (personal hand-carried goods). Show this
  landed-to-Buffalo total **alongside** the landed-to-Toronto total so the real savings are
  visible.
</stage_normalize>

<stage_rank>
- You **MUST** rank **price-first within the set of listings that meet the brief**. Do not
  promote a pricier "better" product over a cheaper one that satisfies the stated needs.
- You **MUST** dedupe the same product across venues.
- Output is a **ranked markdown table in chat** — no saved report, no images (deferred).
  Columns: product/model, landed price (CAD, shipping in), customs estimate (separate),
  key specs, seller/venue, and a short why-this-one. Include the live listing link per row.
</stage_rank>

<report>
Turning a completed hunt into a standalone, shareable report — verdict, winner, educational
prose around the ranked listings — is governed by a separate skill. Read
`skill://deal-reporter` when writing one.
</report>
