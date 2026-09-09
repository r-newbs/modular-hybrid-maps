/**
 * HYBRID MAPS: Monitoring-as-Part-of-a-System (v2)
 * Benefit-focused, context-aware plan copy and features
 *
 * Rule: Use comparative copy ("Plan X +") ONLY if plan to the left is cheaper.
 * Otherwise use benefit-focused standalone copy.
 *
 * Source of truth: https://support.simplisafe.com/page/monitoring-plans
 */

const PLANS = {
  unmonitored: {
    name: 'Unmonitored',
    order: 0,
    pricePerDay: 'Free',
    discount: null,
    warranty: 'Lifetime warranty with active service',

    taglines: {
      standalone: 'DIY system with local alerts, no professional monitoring',
      benefit: 'Local security system with mobile app access',
    },

    features: {
      base: [
        'Live video feed of your cameras from the SimpliSafe app.',
        'Remotely arm/disarm your system with the SimpliSafe app.',
        'Mobile notifications for all activity.',
        'Lifetime warranty with active service.',
      ],
    },
  },

  selfMonitoring: {
    name: 'Self-Monitoring',
    order: 1,
    pricePerDay: '$0.33/day',
    discount: null,
    warranty: 'Lifetime warranty with active service',

    taglines: {
      standalone: 'DIY monitoring with unlimited camera recordings',
      benefit: 'Unlimited camera recordings and mobile alerts',
      afterUnmonitored: 'Unmonitored + unlimited camera recordings',
    },

    features: {
      base: [
        'Unlimited camera recordings for 30 days (video only, encrypted).',
        'Push notifications for all camera activity.',
        'Email notifications for alarms.',
        'You monitor your own system via app.',
        'No professional response — you decide when to call 911.',
      ],
    },
  },

  standard: {
    name: 'Standard Monitoring',
    order: 2,
    pricePerDay: '$0.76/day',
    discount: '50% off equipment',
    warranty: 'Lifetime warranty with active service',

    taglines: {
      standalone: 'Professional monitoring with 24/7 emergency dispatch',
      benefit: 'Professional monitoring and emergency dispatch',
      afterSelfMonitoring: 'Self-Monitoring + professional monitoring with 24/7 dispatch',
      afterUnmonitored: 'Unmonitored + professional monitoring with 24/7 dispatch',
    },

    features: {
      base: [
        'When your alarm is triggered, sirens blare and you get notified.',
        'U.S.-based agents request dispatch for break-ins, fires, and floods, 24/7.',
        'Video is encrypted and stored in the cloud for 30 days.',
        'Agents deter crime by speaking to potential intruders through your indoor camera.',
      ],
    },
  },

  core: {
    name: 'Core Monitoring',
    order: 3,
    pricePerDay: '$1.10/day',
    discount: '50% off equipment',
    warranty: 'Lifetime warranty with active service',

    taglines: {
      standalone: 'Professional monitoring with indoor and outdoor control',
      benefit: 'Indoor monitoring plus real-time outdoor alerts',
      afterStandard: 'Standard + real-time motion alerts and 2-way outdoor audio',
      afterSelfMonitoring: 'Self-Monitoring + professional monitoring and outdoor alerts',
      afterUnmonitored: 'Unmonitored + professional monitoring and outdoor alerts',
    },

    features: {
      base: [
        'When your alarm is triggered, sirens blare and you get notified.',
        'U.S.-based agents request dispatch for break-ins, fires, and floods, 24/7.',
        'Video is encrypted and stored in the cloud for 30 days.',
        'Agents deter crime by speaking to potential intruders through your indoor camera.',
        'Real-time motion alerts from outdoor cameras.',
        'Speak directly to anyone outside with 2-way audio.',
      ],
    },
  },

  pro: {
    name: 'Pro Monitoring',
    order: 4,
    pricePerDay: '$1.66/day',
    discount: '50% off equipment',
    warranty: 'Lifetime warranty with active service',

    taglines: {
      standalone: 'Overnight protection with AI outdoor camera and live agent intervention',
      benefit: 'Overnight outdoor crime prevention with live agent intervention',
      afterCore: 'Core + AI outdoor camera threat detection and agent intervention (8pm–6am)',
      afterStandard: 'Core + outdoor crime prevention overnight',
    },

    features: {
      base: [
        'When your alarm is triggered, sirens blare and you get notified.',
        'U.S.-based agents request dispatch for break-ins, fires, and floods, 24/7.',
        'Video is encrypted and stored in the cloud for 30 days.',
        'Agents deter crime by speaking to potential intruders through your indoor camera.',
        'Real-time motion alerts from outdoor cameras.',
        'Speak directly to anyone outside with 2-way audio.',
        'Smart AI outdoor camera spots threats and alerts a live agent.',
        'Agents stop intruders outside before they enter with camera siren, spotlight, and verbal warning (active 8pm–6am).',
      ],
    },
  },

  proPlus: {
    name: 'Pro Plus Monitoring',
    order: 5,
    pricePerDay: '$2.66/day',
    discount: '50% off equipment',
    warranty: 'Lifetime warranty with active service',

    taglines: {
      standalone: '24/7 outdoor crime prevention with AI camera and live agents',
      benefit: '24/7 outdoor protection with AI threat detection and agent response',
      afterPro: 'Pro + always-on protection (upgraded from 8pm–6am)',
      afterCore: 'Core + 24/7 outdoor crime prevention',
    },

    features: {
      base: [
        'When your alarm is triggered, sirens blare and you get notified.',
        'U.S.-based agents request dispatch for break-ins, fires, and floods, 24/7.',
        'Video is encrypted and stored in the cloud for 30 days.',
        'Agents deter crime by speaking to potential intruders through your indoor camera.',
        'Real-time motion alerts from outdoor cameras.',
        'Speak directly to anyone outside with 2-way audio.',
        'Smart AI outdoor camera spots threats and alerts a live agent.',
        'Agents stop intruders outside before they enter with camera siren, spotlight, and verbal warning (active 24/7).',
      ],
    },
  },
};

// Tier map for comparison logic
const PLAN_ORDER = {
  unmonitored: 0,
  selfMonitoring: 1,
  standard: 2,
  core: 3,
  pro: 4,
  proPlus: 5,
};

/**
 * Get the appropriate tagline for a plan based on adjacent plans
 *
 * RULE: Use comparative copy ("Plan X +") ONLY if the plan to the left
 * is cheaper (lower tier). Otherwise use benefit-focused copy.
 *
 * @param {string} planKey - Key of the plan (e.g., 'core', 'pro')
 * @param {string|null} leftPlan - Key of plan to the left, or null
 * @param {string|null} rightPlan - Key of plan to the right, or null
 * @returns {string} The contextualized tagline
 */
function getTagline(planKey, leftPlan, rightPlan) {
  const plan = PLANS[planKey];
  if (!plan) return '';

  // Check if left plan is cheaper: if so, try comparative copy
  if (leftPlan && PLAN_ORDER[leftPlan] < PLAN_ORDER[planKey]) {
    const contextKey = `after${capitalize(leftPlan)}`;
    if (plan.taglines[contextKey]) {
      return plan.taglines[contextKey];
    }
  }

  // Fall back to benefit-focused copy
  if (plan.taglines.benefit) {
    return plan.taglines.benefit;
  }

  return plan.taglines.standalone || '';
}

/**
 * Get features for a plan
 * @param {string} planKey - Key of the plan
 * @returns {Array} Feature list
 */
function getFeatures(planKey) {
  const plan = PLANS[planKey];
  return plan?.features?.base || [];
}

/**
 * Get the pricing footer
 * @param {string} planKey
 * @returns {string}
 */
function getPricingFooter(planKey) {
  const plan = PLANS[planKey];
  if (!plan) return '';

  let footer = '';
  if (plan.discount) {
    footer += plan.discount + '\n';
  }
  if (plan.pricePerDay === 'Free') {
    footer += 'No plan required\n';
  } else if (plan.pricePerDay) {
    footer += `First month free, then ${plan.pricePerDay} after that\n`;
  }
  footer += plan.warranty || '';

  return footer;
}

/**
 * Helper: capitalize string for context key building
 */
function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).replace(/([A-Z])/g, '$1');
}

/**
 * Build a hybrid maps layout
 * @param {string} defaultPlan - The plan to center (default selection)
 * @param {string|null} leftPlan - Plan to left of default
 * @param {string|null} rightPlan - Plan to right of default
 * @returns {Object} Structured layout with left/center/right card data
 */
function renderHybridMaps(defaultPlan, leftPlan = null, rightPlan = null) {
  return {
    left: leftPlan ? {
      name: PLANS[leftPlan].name,
      tagline: getTagline(leftPlan, null, defaultPlan),
      features: getFeatures(leftPlan),
      price: PLANS[leftPlan].pricePerDay,
      footer: getPricingFooter(leftPlan),
    } : null,

    center: {
      name: PLANS[defaultPlan].name,
      tagline: getTagline(defaultPlan, leftPlan, rightPlan),
      features: getFeatures(defaultPlan),
      price: PLANS[defaultPlan].pricePerDay,
      footer: getPricingFooter(defaultPlan),
      isDefault: true,
    },

    right: rightPlan ? {
      name: PLANS[rightPlan].name,
      tagline: getTagline(rightPlan, defaultPlan, null),
      features: getFeatures(rightPlan),
      price: PLANS[rightPlan].pricePerDay,
      footer: getPricingFooter(rightPlan),
    } : null,
  };
}

// ============================================================================
// EXPORT FOR USE
// ============================================================================

module.exports = {
  PLANS,
  PLAN_ORDER,
  getTagline,
  getFeatures,
  getPricingFooter,
  renderHybridMaps,
};

// ============================================================================
// USAGE EXAMPLES
// ============================================================================

/*
EXAMPLE 1: User WITHOUT outdoor camera (DEFAULT: Core Monitoring)
---
const layout = renderHybridMaps('core', 'standard', 'pro');

Result:
{
  left: {
    name: 'Standard Monitoring',
    tagline: 'Professional monitoring and emergency dispatch',
    features: [...],
    price: '$0.76/day',
  },
  center: {
    name: 'Core Monitoring',
    tagline: 'Standard + real-time motion alerts and 2-way outdoor audio',
    features: [...],
    price: '$1.10/day',
    isDefault: true
  },
  right: {
    name: 'Pro Monitoring',
    tagline: 'Core + AI outdoor camera threat detection and agent intervention (8pm–6am)',
    features: [...],
    price: '$1.66/day',
  }
}

---

EXAMPLE 2: User WITH outdoor camera (DEFAULT: Pro Monitoring)
---
const layout = renderHybridMaps('pro', 'core', 'proPlus');

Result:
{
  left: {
    name: 'Core Monitoring',
    tagline: 'Indoor monitoring plus real-time outdoor alerts',
    features: [...],
    price: '$1.10/day',
  },
  center: {
    name: 'Pro Monitoring',
    tagline: 'Core + AI outdoor camera threat detection and agent intervention (8pm–6am)',
    features: [...],
    price: '$1.66/day',
    isDefault: true
  },
  right: {
    name: 'Pro Plus Monitoring',
    tagline: 'Pro + always-on protection (upgraded from 8pm–6am)',
    features: [...],
    price: '$2.66/day',
  }
}

*/
