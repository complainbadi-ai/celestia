# Celestia Privacy & Safety Documentation

## Overview
This document outlines Celestia's approach to user privacy, data protection, mental health safety, and ethical design principles.

---

## Data Collection & Usage

### Minimal Data Collection
We collect only what's necessary for core functionality:

**Required Data:**
- Nickname (not real name)
- Birthdate (for zodiac sign calculation)
- Timezone (for accurate daily horoscope timing)
- Email (for authentication only)
- Password (hashed with bcrypt, never stored in plaintext)

**Optional Data (User can opt out):**
- Relationship status
- Rising sign
- Interest tags
- Custom preferences

### Data We Never Collect
- Real names (unless voluntarily provided in nickname field)
- Location beyond timezone
- Contact lists
- Social media connections
- Financial information (except payment processor tokens for premium features)
- Health information

---

## Data Flows

### Registration Flow
```
User Input → Validation → Password Hashing (bcrypt) → 
Database Storage (encrypted at rest) → JWT Token Generation → 
Secure HTTP-only Cookie (or local secure storage)
```

### Journal Entry Flow
```
User Input → Client-side Sentiment Analysis → 
Distress Detection Check → AES-256-GCM Encryption → 
Encrypted Storage in Database → Decryption on Retrieval
```

### Distress Detection Flow
```
Journal Entry → Keyword Matching + Sentiment Scoring → 
Threshold Exceeded → Non-judgmental Support Modal → 
Anonymous Report Created (no PII) → Admin Dashboard Alert
```

---

## Encryption & Security

### At Rest
- **PII Fields**: AES-256-GCM encryption
- **Journal Entries**: AES-256-GCM encryption with user-specific keys
- **Passwords**: bcrypt with 10 rounds
- **Database**: PostgreSQL with encryption at rest (provider-level)

### In Transit
- All API communications over HTTPS/TLS 1.3
- Certificate pinning in mobile app (production builds)
- Secure WebSocket connections for real-time features

### Key Management
- Encryption keys stored in environment variables (never in code)
- Production keys managed via secrets manager (AWS Secrets Manager, Vault, etc.)
- Key rotation every 90 days

---

## Retention Policy

### Active Users
- **Profile Data**: Retained while account is active
- **Journal Entries**: Retained until user deletes or account deletion
- **Horoscope View History**: 30 days rolling window
- **Session Logs**: 30 days, then anonymized

### Deleted Accounts
- **Immediate**: JWT tokens invalidated, user marked as deleted
- **7 Days**: Soft delete period (user can reactivate)
- **30 Days**: Hard delete of all PII and journal entries
- **Retained (anonymized)**: Aggregate analytics only (no PII)

### Distress Reports
- **PII**: Removed after 90 days or resolution
- **Anonymous Metrics**: Retained indefinitely for safety improvements
- **Admin Notes**: Retained for 1 year

---

## User Control & Rights

### GDPR Rights (All Users)
Users can exercise these rights via in-app settings or support request:

1. **Right to Access**: Export all personal data in JSON format
2. **Right to Rectification**: Edit profile and preferences anytime
3. **Right to Erasure**: Delete account and all associated data
4. **Right to Restrict Processing**: Disable personalization features
5. **Right to Data Portability**: Download data in machine-readable format
6. **Right to Object**: Opt out of any optional data processing

### COPPA Compliance (Users Under 13)
- Age verification during registration
- Parental consent flow for users under 13
- Limited data collection for minors
- Parental access to child's data via support request
- Enhanced privacy protections (no behavioral tracking)

### CALOPPA Compliance
- Privacy policy accessible from homepage and in-app settings
- Clear disclosure of data collection practices
- Opt-out mechanisms for all optional features
- Third-party disclosure policy

---

## Mental Health & Safety Framework

### Distress Detection System

**Trigger Categories:**
1. **Critical Keywords**: suicide, kill myself, want to die, end it all, no reason to live
2. **High-Risk Phrases**: hopeless, can't go on, better off without me, no way out
3. **Sentiment Threshold**: Sentiment score < -0.7 across 3+ entries within 24 hours
4. **Frequency Pattern**: Repeated negative sentiment (score < -0.5) for 7+ consecutive days

**Detection Algorithm:**
```
IF (critical_keyword_match OR 
    (high_risk_phrase_count >= 2 AND sentiment_score < -0.6) OR
    (sentiment_score < -0.7 AND entry_count >= 3 within 24hrs) OR
    (negative_entries >= 7 consecutive days))
THEN trigger_safety_intervention
```

### Safety Intervention Flow

**Step 1: Non-Judgmental Support Modal**
```
Title: "We're Here for You"

Body: "We noticed you might be going through a difficult time. 
You're not alone, and there are people who want to help. 
Your feelings are valid, and reaching out is a sign of strength, not weakness."

Buttons:
- "Get Immediate Help" (crisis hotlines)
- "Talk to Someone" (text/chat resources)
- "Not Now" (dismisses but saves anonymous report)
```

**Step 2: Resource Presentation**
- Localized crisis hotlines (based on timezone/region)
- 24/7 text/chat resources (Crisis Text Line, etc.)
- Mental health app recommendations
- Option to contact Celestia support (human, not automated)

**Step 3: Anonymous Reporting**
- No PII shared with admin unless user explicitly consents
- Report includes: timestamp, trigger type, user ID (hashed)
- Admin can view aggregate patterns, not individual entries
- Follow-up check-in notification sent 24 hours later (optional opt-in)

### Crisis Resources

**Placeholder Structure** (must be populated with verified, current resources):

```json
{
  "US": {
    "phone": "988",
    "name": "National Suicide Prevention Lifeline",
    "text": "Text HOME to 741741",
    "url": "https://988lifeline.org"
  },
  "UK": {
    "phone": "116 123",
    "name": "Samaritans",
    "url": "https://www.samaritans.org"
  },
  "international": {
    "url": "https://findahelpline.com"
  }
}
```

**Important**: Resources must be verified quarterly and updated for accuracy.

---

## Age Gating & Parental Consent

### Registration Flow for Minors

**Age Detection:**
```
IF birthdate indicates age < 14:
  SHOW parental_consent_required_screen
  REQUIRE parent_email verification
  SEND consent_request to parent_email
  WAIT FOR parent_approval
  IF approved: enable_limited_account
  IF not approved within 7 days: delete_registration
```

**Limited Account Features (Under 14):**
- ✅ Daily horoscope viewing
- ✅ Basic journaling (encrypted, parent can request access)
- ❌ Social sharing disabled
- ❌ Community features disabled
- ❌ Personalization disabled
- ❌ Push notifications disabled (unless parent enables)

### Parental Controls
Parents can:
- View child's activity summary (not journal content without child's consent)
- Enable/disable features
- Export child's data
- Delete child's account
- Update consent preferences

---

## Ethical Design Commitments

### What We Do NOT Do
- ❌ Use dark patterns (hidden costs, forced actions, guilt-based copy)
- ❌ Create artificial urgency ("Read now or miss your luck!")
- ❌ Make deterministic health/death claims ("You will get sick")
- ❌ Hide safety features behind paywalls
- ❌ Sell user data to third parties
- ❌ Use manipulative A/B tests
- ❌ Exploit emotional vulnerabilities for monetization

### What We DO
- ✅ Use probabilistic language ("may," "might," "could")
- ✅ Provide action-oriented, empowering guidance
- ✅ Offer clear opt-outs for all features
- ✅ Make privacy controls accessible
- ✅ Provide transparent monetization (cosmetic upgrades only)
- ✅ Include mental health safeguards
- ✅ Respect user autonomy

### Monetization Guardrails
**Premium Features (Allowed):**
- Custom horoscope card designs
- Additional zodiac chart calculations
- Historical horoscope archive access
- Ad-free experience

**Never Behind Paywall:**
- Core daily horoscope
- Safety resources
- Journal functionality
- Account export/deletion
- Privacy controls

---

## Third-Party Services

### Payment Processing
- Stripe (for premium subscriptions)
- Data shared: Transaction amount, timestamp, anonymized user ID
- No financial details stored by Celestia
- PCI DSS compliant processing

### Analytics (Privacy-Preserving)
- Plausible or Fathom (privacy-focused analytics)
- Data collected: Page views, session duration (no individual tracking)
- No cookies, no cross-site tracking
- GDPR-compliant

### Crash Reporting
- Sentry (error monitoring)
- Data shared: Error logs, stack traces (PII redacted automatically)
- User consent required for sharing device info

---

## Incident Response Plan

### Data Breach Protocol
1. **Detection** (automated monitoring + manual review)
2. **Containment** (isolate affected systems within 1 hour)
3. **Assessment** (determine scope within 24 hours)
4. **Notification** (users notified within 72 hours per GDPR)
5. **Remediation** (patch vulnerabilities, rotate keys)
6. **Post-Mortem** (public transparency report within 30 days)

### User Notification Template
```
Subject: Important Security Update from Celestia

Dear [User],

We're writing to inform you of a security incident that may have 
affected your account. On [DATE], we discovered [BRIEF DESCRIPTION].

What happened: [DETAILS]
What data was affected: [SPECIFIC DATA TYPES]
What we're doing: [ACTIONS TAKEN]
What you should do: [USER ACTIONS, e.g., reset password]

We take your privacy seriously and are implementing additional 
safeguards to prevent future incidents.

For questions: security@celestia-app.example.com
```

---

## Legal Compliance Summary

### Frameworks Addressed
- ✅ GDPR (General Data Protection Regulation) - EU
- ✅ COPPA (Children's Online Privacy Protection Act) - US
- ✅ CALOPPA (California Online Privacy Protection Act) - California
- ✅ CCPA (California Consumer Privacy Act) - California
- ✅ PIPEDA (Personal Information Protection) - Canada

### Regular Audits
- **Quarterly**: Privacy policy review and resource verification
- **Bi-annually**: Security penetration testing
- **Annually**: Full compliance audit by external firm
- **Ongoing**: Monitoring of new privacy regulations

---

## Contact & Support

### Privacy Inquiries
- Email: privacy@celestia-app.example.com
- Response time: 48 hours

### Data Subject Requests
- Portal: https://celestia-app.example.com/privacy/request
- Fulfillment time: 30 days (per GDPR)

### Security Concerns
- Email: security@celestia-app.example.com
- Bug bounty program for responsible disclosure

### General Support
- In-app support chat
- Email: support@celestia-app.example.com

---

## Document Version
- **Version**: 1.0
- **Last Updated**: 2025-01-15
- **Next Review**: 2025-04-15
- **Changelog**: Initial release

---

## Acknowledgments
This privacy and safety framework was designed with input from mental health professionals, privacy advocates, and COPPA compliance experts to ensure user wellbeing and data protection are prioritized above all else.