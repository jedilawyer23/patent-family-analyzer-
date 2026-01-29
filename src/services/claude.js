const CLAUDE_API_URL = 'https://api.anthropic.com/v1/messages';

/**
 * Call Claude API
 */
async function callClaude(apiKey, systemPrompt, userPrompt) {
  const response = await fetch(CLAUDE_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }],
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error?.message || `Claude API error: ${response.status}`);
  }

  const data = await response.json();
  return data.content[0].text;
}

/**
 * Extract the first independent claim from claims text
 */
export async function extractFirstIndependentClaim(apiKey, claimsText) {
  const systemPrompt = `You are a patent claim analyzer. Extract the first independent claim from the provided claims text.
An independent claim is one that stands alone and does not reference another claim (no "according to claim X" or "The method of claim X").
Return ONLY the claim text, nothing else. Do not include the claim number.`;

  const userPrompt = `Extract the first independent claim from this patent claims text:\n\n${claimsText}`;

  return callClaude(apiKey, systemPrompt, userPrompt);
}

/**
 * Generate inventive concept summary from a claim
 */
export async function generateInventiveConcept(apiKey, claimText, patentTitle) {
  const systemPrompt = `You are a patent analyst. Summarize the core inventive concept of a patent claim in 1-2 sentences.
Focus on what makes this invention novel - strip away boilerplate language and get to the essence.
Be concise and technical. Do not start with "This claim" or "The invention".`;

  const userPrompt = `Patent title: ${patentTitle}\n\nFirst independent claim:\n${claimText}\n\nSummarize the inventive concept:`;

  return callClaude(apiKey, systemPrompt, userPrompt);
}

/**
 * Analyze overlap and differentiation across patent family
 */
export async function analyzeFamily(apiKey, patents) {
  const systemPrompt = `You are a patent family analyst. Analyze the overlap and differentiation between patent claims in a family.

For each patent, determine:
1. Which other patents in the family it overlaps with (similar inventive concepts)
2. What differentiates it from other family members

Return JSON in this exact format:
{
  "analysis": [
    {
      "patentNumber": "string",
      "overlapsWith": ["patent numbers"],
      "overlapExplanation": "Brief explanation of what concepts overlap",
      "differentiation": "What makes this patent unique in the family"
    }
  ]
}`;

  const patentSummaries = patents.map(p =>
    `Patent ${p.patentNumber} (${p.relationship}):\nTitle: ${p.title}\nInventive Concept: ${p.inventiveConcept}`
  ).join('\n\n---\n\n');

  const userPrompt = `Analyze this patent family:\n\n${patentSummaries}`;

  const response = await callClaude(apiKey, systemPrompt, userPrompt);

  // Parse JSON from response
  try {
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    throw new Error('No JSON found in response');
  } catch (e) {
    throw new Error(`Failed to parse Claude response: ${e.message}`);
  }
}

/**
 * Infer relationship between patents
 */
export async function inferRelationship(apiKey, newPatent, existingPatents) {
  if (existingPatents.length === 0) {
    return 'original';
  }

  const systemPrompt = `You are a patent analyst. Determine the relationship of a new patent to an existing patent family.
Based on the titles and dates, infer if this is likely:
- continuation: Similar subject matter, later date, extends the original
- divisional: Split from original due to restriction requirement, narrower scope
- cip: Continuation-in-part, adds new matter to original disclosure

Return ONLY one of: continuation, divisional, cip, unknown`;

  const existingSummary = existingPatents.map(p =>
    `${p.patentNumber}: ${p.title} (${p.date})`
  ).join('\n');

  const userPrompt = `Existing patents:\n${existingSummary}\n\nNew patent:\n${newPatent.patentNumber}: ${newPatent.title} (${newPatent.date})\n\nRelationship:`;

  const response = await callClaude(apiKey, systemPrompt, userPrompt);
  const relationship = response.toLowerCase().trim();

  if (['continuation', 'divisional', 'cip'].includes(relationship)) {
    return relationship;
  }
  return 'unknown';
}
