Hybrid Maps: SimpliSafe Monitoring Plan Builder
An interactive tool for exploring and comparing SimpliSafe monitoring plans with dynamic, context-aware pricing and feature information.
What It Does
Hybrid Maps lets you:

Build custom pricing grid layouts (1, 2, or 3 plans side-by-side)
See how plan descriptions adapt based on which plans are shown
Compare features across all 6 monitoring tiers
Share visual plan comparisons with customers or teams

The system uses smart copy logic: if a cheaper plan is shown to the left, comparative copy appears ("Core + outdoor alerts"). Otherwise, benefit-focused copy stands alone. This keeps messaging clear and non-repetitive.
How to Use
For Non-Developers
Open hybrid-maps-interactive.html in your browser
Use quick presets:
No Outdoor Camera System — Shows Standard | Core | Pro
Outdoor Camera System — Shows Core | Pro | Pro Plus
3 Plans / 2 Plans / 1 Plan — Custom configurations
Use dropdowns to swap plans and see copy adapt in real-time
For Developers
Import hybrid-maps-plan-content-v2.js into your React/Vue component:

import { getTagline, getFeatures, renderHybridMaps } from './hybrid-maps-plan-content-v2';

// Get context-aware tagline
const tagline = getTagline('pro', 'core', 'proPlus');
// Returns: "Core + AI outdoor camera threat detection..."

// Build full layout
const layout = renderHybridMaps('core', 'standard', 'pro');
// Returns: { left: {...}, center: {...}, right: {...} }
Plans Available
Plan
Price
Key Features
Unmonitored
Free
App access, local alerts
Self-Monitoring
$0.33/day
DIY + unlimited 30-day video
Standard Monitoring
$0.76/day
24/7 professional dispatch
Core Monitoring
$1.10/day
Indoor + outdoor monitoring
Pro Monitoring
$1.66/day
Outdoor AI protection (8pm–6am)
Pro Plus Monitoring
$2.66/day
Outdoor AI protection (24/7)

The Copy Logic
Rule: Use "Plan +" comparison copy only if the plan to the left is cheaper. Otherwise use benefit-focused copy.

Example:

✅ Standard | Core | Pro → Core says: "Standard + real-time motion alerts..."
✅ Core (alone) | Pro → Core says: "Indoor monitoring plus real-time outdoor alerts"

This keeps copy modular and prevents repetition across different layout combinations.
Customizing
Add a New Plan
Edit hybrid-maps-plan-content-v2.js:

elite: {
  name: 'Elite Monitoring',
  order: 6,
  pricePerDay: '$3.99/day',
  taglines: { benefit: 'Your new benefit copy...' },
  features: { base: ['Feature 1', 'Feature 2', ...] }
}

Update PLAN_ORDER with the new tier number
Add context keys in existing plans if they can be neighbors to Elite
Update Copy or Features
Edit the taglines or features objects in the plan definition
All adjacent plans will auto-adapt their messaging
Documentation
See HYBRID-MAPS-REFERENCE-V2.md for:

Complete tagline library by context
Feature comparison matrix
Implementation guide
Testing checklist
All preset combinations
Browser Support
Works in all modern browsers (Chrome, Safari, Firefox, Edge). Responsive design adapts to mobile.
Questions?
Refer to HYBRID-MAPS-REFERENCE-V2.md for detailed docs, or contact the team.



Source of Truth: https://support.simplisafe.com/page/monitoring-plans
Last Updated: September 2026
