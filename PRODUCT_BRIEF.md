# Product Brief: Identity Integration Hub

**Author:** Tamir Siboni
**Date:** April 2026
**Status:** Prototype / v1.0
**Type:** Personal side project — product thinking artifact

---

## Executive Summary

Enterprise security teams have no unified view of which service accounts, API keys, bots, and OAuth tokens have access to which systems. As companies grow, non-human identities (NHIs) proliferate faster than humans can audit. A single mid-size company with 20 SaaS tools may have hundreds of undocumented NHIs — each one a potential breach vector.

This prototype explores the product experience for an API-first identity integration platform that:
1. Connects to enterprise SaaS providers via OAuth
2. Discovers and categorizes all identity entities (human and non-human)
3. Surfaces risk by severity and provides an audit-ready remediation log

**In production, this product would track:**
- Daily active security engineers (DAU)
- Integrations connected per account (stickiness proxy)
- Mean time to detect (MTTD) for new NHIs
- NHI coverage % across the customer's SaaS estate
- Mean time to remediate (MTTR) from flag to resolved action

---

## Problem Statement

### The Core Pain

Security engineers at mid-market companies (200–2,000 employees) are responsible for access governance across a growing stack of SaaS tools — but they have no single source of truth for who (or what) has access to what.

**The three pain points that drove this product:**

> "I have 15 SaaS tools and no idea how many service accounts exist across all of them. I'm not even sure what I don't know."

> "When a developer leaves, I can revoke their human account. But I have no way to confirm their bot tokens, GitHub Actions credentials, or Zapier integrations were also cleaned up."

> "Our SOC 2 auditor asked for a list of all OAuth scopes in use across our integrations. I had to build a spreadsheet manually over two weeks. There has to be a better way."

### Why Existing Alternatives Fail

| Alternative | Why It Falls Short |
|---|---|
| Manual spreadsheets | Stale within days; don't scale beyond 3–4 tools |
| Point-in-time access reviews | Miss dynamic NHIs like GitHub Actions tokens that change per-repo |
| SIEM tools | Capture events, not identity state — reactive, not proactive |
| Identity governance platforms (Saviynt, SailPoint) | Enterprise-only pricing; require months of implementation; built for human identity, not NHI |

### Why Now

- NHI attacks have become one of the top breach vectors in recent years — credential theft via service accounts, AI agents creating new NHI categories, and OAuth token sprawl have all accelerated
- Developer tooling (GitHub Actions, Zapier, Datadog, CI/CD pipelines) has normalized API-key-based integrations that bypass human identity governance entirely
- Security teams are under-resourced and need tooling that provides immediate value, not 6-month implementations

---

## Primary Persona

### Sam — Senior Security Engineer

**Role:** Senior Security Engineer at a 300-person SaaS company
**Reports to:** CISO (indirectly) / Engineering VP (directly)

**Goals:**
- Maintain least-privilege access across all systems
- Pass SOC 2 Type II and ISO 27001 audits with minimal manual work
- Respond to incidents quickly with reliable identity context
- Reduce shadow IT and OAuth token sprawl before it becomes a breach

**Frustrations:**
- Existing tools are built for human identity (SSO, SCIM) — NHIs are an afterthought
- Access reviews happen quarterly at best; the risk surface changes daily
- No audit trail when something goes wrong — "who gave that bot access and when?"
- Leadership asks for reports she can't generate without hours of manual work

**Technical Comfort:** High — understands OAuth 2.0 scopes, API auth patterns, IAM data models
**Decision Authority:** Influences tool selection; budget owner is the CISO
**Time to Value Expectation:** "If I can't see value in the first 15 minutes, I'm not going to champion this internally"

---

## Scope & Prioritization

### MVP (This Prototype)

| Included | Rationale |
|---|---|
| Integration catalog (12 providers in gallery) | Establishes market breadth and validates that the connection model generalizes |
| Deep integration with one provider (Slack-style OAuth flow) | "Do things that don't scale" — prove the end-to-end journey before expanding |
| Entity discovery: accounts, groups, roles, resources | Core value delivery — the moment Sam sees what's actually out there |
| NHI detection and risk severity | The highest-signal risk category; most differentiated from incumbent tools |
| Remediation activity log | Required for the compliance use case; closes the loop from detection to action |
| 4-step OAuth wizard with scope transparency | Reduces abandonment; helps Sam justify the integration to her CISO |

### Explicitly De-Scoped from MVP

| Not Included | Why Deferred |
|---|---|
| Real OAuth backend | Prototype scope; adds infrastructure complexity that obscures UX validation |
| Identity graph visualization | High complexity, lower immediate value than tabular entity data |
| Bulk remediation actions | Requires policy engine — v2 feature |
| RBAC within the platform itself | Internal governance feature; not needed until multi-user accounts |
| Native alerting / notifications | The success screen offers alert setup; backend delivery is infra, not product |
| Mobile-responsive layout | Security engineers work on desktop; mobile is out-of-scope for v1 |

**Prioritization rationale:** MVP scope was chosen to demonstrate the core user journey end-to-end with one integration, rather than shallow coverage across many. This mirrors the "do things that don't scale" principle — a single deep integration that proves the data model is more valuable than 12 partially-connected ones.

---

## Success Metrics

Applying the AARRR framework to identity security tooling:

| Stage | Metric | Target (Hypothetical) |
|---|---|---|
| **Acquisition** | Integration catalog page views; "Connect" button CTR by integration | >30% CTR from catalog to wizard |
| **Activation** | % of signups who complete the OAuth wizard within 7 days | >60% within first session |
| **Retention** | % of connected accounts with dashboard check-ins weekly | >40% weekly active |
| **Revenue** | Integrations connected per account (more = stickier, higher ACV) | >3 integrations within 30 days |
| **Risk Reduction** | Mean time from NHI flagged → remediated (the core value metric) | <24 hours MTTR |

**North Star Metric:** NHI coverage % — the percentage of a customer's SaaS estate where the platform has identity visibility. A customer at 80% coverage is getting full value; at 20% they're still flying blind. All product decisions should increase this number.

---

## Market Context

### Competitive Landscape

| Competitor | Positioning | Gap This Product Addresses |
|---|---|---|
| **Veza** | Enterprise identity data fabric | High price point; complex deployment; not NHI-first |
| **Saviynt** | IGA for large enterprises | Requires months to implement; built for human identities |
| **ConductorOne** | Access request automation | Access governance focus, not discovery-first |
| **Opal** | Developer-friendly access management | Human-identity focused; limited NHI visibility |

### Positioning

**"API-first NHI security for security engineers who don't have 6 months to implement an IGA platform."**

The key differentiators:
1. **NHI-first**, not NHI-as-afterthought — the product is built around the identity types that existing tools ignore
2. **Time to value in minutes**, not months — the OAuth wizard is designed to get Sam to her first entity discovery in under 5 minutes
3. **Security engineer UX**, not CISO compliance UI — designed for the person doing the work, not the person reading the report

---

*This brief is a product thinking artifact created as part of a personal portfolio project. It is not associated with any company or commercial product.*
