const PATENTSVIEW_API = 'https://api.patentsview.org/patents/query';

/**
 * Normalize patent number to USPTO format
 * Accepts: "US10123456", "10123456", "US 10,123,456", "10,123,456"
 * Returns: "10123456"
 */
function normalizePatentNumber(input) {
  return input
    .toUpperCase()
    .replace(/^US\s*/i, '')
    .replace(/,/g, '')
    .replace(/\s/g, '')
    .trim();
}

/**
 * Format patent number for display
 * Input: "10123456"
 * Output: "US10,123,456"
 */
export function formatPatentNumber(number) {
  const normalized = normalizePatentNumber(number);
  // Add commas for readability
  const formatted = normalized.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return `US${formatted}`;
}

/**
 * Fetch patent data from USPTO PatentsView API
 */
export async function fetchPatentFromUSPTO(patentNumber) {
  const normalized = normalizePatentNumber(patentNumber);

  const query = {
    q: { patent_number: normalized },
    f: [
      'patent_number',
      'patent_title',
      'patent_abstract',
      'patent_date',
      'patent_type',
      'claims'
    ],
    o: {
      include_subentity_total_counts: false
    }
  };

  const response = await fetch(PATENTSVIEW_API, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(query),
  });

  if (!response.ok) {
    throw new Error(`USPTO API error: ${response.status}`);
  }

  const data = await response.json();

  if (!data.patents || data.patents.length === 0) {
    throw new Error(`Patent ${patentNumber} not found. Note: Only granted US patents are available.`);
  }

  const patent = data.patents[0];

  // Extract claims text
  const claimsText = patent.claims
    ?.map(c => c.claim_text)
    .join('\n\n') || '';

  return {
    patentNumber: patent.patent_number,
    title: patent.patent_title,
    abstract: patent.patent_abstract,
    date: patent.patent_date,
    type: patent.patent_type,
    claimsText: claimsText,
  };
}

/**
 * Determine relationship type from patent data
 * This is a basic heuristic - USPTO doesn't provide direct parent/child info in PatentsView
 */
export function inferRelationship(patentData, existingPatents) {
  // If this is the first patent, it's the original
  if (existingPatents.length === 0) {
    return 'original';
  }

  // PatentsView doesn't give us continuation data directly
  // We'll mark as 'unknown' and let Claude analyze later
  return 'unknown';
}
