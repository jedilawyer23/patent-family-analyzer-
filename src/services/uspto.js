const PATENTSVIEW_BASE = 'https://search.patentsview.org/api/v1';
const CORS_PROXY = 'https://api.allorigins.win/raw?url=';

/**
 * Scrape claims and family members from Google Patents
 * Returns: { claims: string, familyMembers: string[], googlePatentsUrl: string }
 */
async function scrapeGooglePatents(patentNumber) {
  const normalized = patentNumber.replace(/,/g, '').replace(/\s/g, '').replace(/^US/i, '');
  // Try different patent number formats
  const formats = [
    `US${normalized}B2`,
    `US${normalized}B1`,
    `US${normalized}A1`,
    `US${normalized}`,
  ];

  for (const patentId of formats) {
    const url = `https://patents.google.com/patent/${patentId}/en`;
    console.log('Trying Google Patents:', url);

    try {
      const response = await fetch(`${CORS_PROXY}${encodeURIComponent(url)}`);
      if (!response.ok) continue;

      const html = await response.text();

      // Check if we got a valid patent page
      if (!html.includes('class="claim"') && !html.includes('class="claims"')) {
        continue;
      }

      // Extract claims from HTML
      const claims = extractClaimsFromHtml(html);

      // Extract US family members
      const familyMembers = extractUSFamilyMembers(html, normalized);

      if (claims) {
        console.log('Successfully scraped from Google Patents');
        console.log('Found', familyMembers.length, 'US family members');
        return {
          claims,
          familyMembers,
          googlePatentsUrl: url,
        };
      }
    } catch (err) {
      console.warn('Google Patents fetch failed for', patentId, ':', err.message);
    }
  }

  return null;
}

/**
 * Extract US family member patent numbers from Google Patents HTML
 * Only looks at: "Priority Applications", "Applications Claiming Priority",
 *                "Related Child/Parent Applications", "Family Applications"
 * Ignores: "Cited By", "Citations", "Similar Documents", etc.
 */
function extractUSFamilyMembers(html, excludePatentNumber) {
  const familyMembers = new Set();

  // Section headers to INCLUDE (these contain actual family members)
  const includeSectionPatterns = [
    /Priority Applications/i,
    /Applications Claiming Priority/i,
    /Related.*Applications/i,
    /Family Applications/i,
    /Parent Applications/i,
    /Child Applications/i,
    /Coverage/i,
  ];

  // Section headers to EXCLUDE (these are citations, not family)
  const excludeSectionPatterns = [
    /Cited By/i,
    /Citations/i,
    /Similar Documents/i,
    /Families Citing/i,
    /Family Cites/i,
    /Patent Citations/i,
    /Non-Patent Citations/i,
  ];

  // Split HTML by h2 headers to process sections individually
  const sections = html.split(/<h2>/i);

  for (const section of sections) {
    // Get the section header (text before closing </h2>)
    const headerMatch = section.match(/^([^<]*)<\/h2>/i);
    if (!headerMatch) continue;

    const headerText = headerMatch[1];

    // Check if this is an excluded section
    let isExcluded = false;
    for (const pattern of excludeSectionPatterns) {
      if (pattern.test(headerText)) {
        isExcluded = true;
        break;
      }
    }
    if (isExcluded) continue;

    // Check if this is an included section
    let isIncluded = false;
    for (const pattern of includeSectionPatterns) {
      if (pattern.test(headerText)) {
        isIncluded = true;
        break;
      }
    }
    if (!isIncluded) continue;

    // Extract US patent numbers from this section
    // Pattern: href="/patent/US7657849B2/en" or similar
    const patentMatches = section.matchAll(/href="\/patent\/(US\d+)[^"]*"/gi);
    for (const match of patentMatches) {
      const patentNum = match[1].replace(/^US/i, '');
      if (patentNum !== excludePatentNumber && patentNum.length >= 6) {
        familyMembers.add(patentNum);
      }
    }
  }

  console.log('Extracted US family members from Priority/Related sections:', Array.from(familyMembers));
  return Array.from(familyMembers);
}

/**
 * Legacy function for backward compatibility
 */
async function scrapeGooglePatentsClaims(patentNumber) {
  const result = await scrapeGooglePatents(patentNumber);
  return result ? result.claims : null;
}

/**
 * Extract claims text from Google Patents HTML
 */
function extractClaimsFromHtml(html) {
  // Create a DOM parser
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  // Try to find claims section
  const claimsSection = doc.querySelector('.claims');
  if (!claimsSection) {
    // Try alternative selectors
    const claimDivs = doc.querySelectorAll('[class*="claim"]');
    if (claimDivs.length === 0) return null;
  }

  // Extract individual claims
  const claimElements = doc.querySelectorAll('.claim, .claim-text, [class*="claim-"]');
  if (claimElements.length === 0) {
    // Fallback: try to get all text from claims section
    if (claimsSection) {
      return claimsSection.textContent.trim();
    }
    return null;
  }

  const claims = [];
  claimElements.forEach((el, index) => {
    const text = el.textContent.trim();
    if (text && text.length > 10) {
      // Check if it already has a claim number
      if (/^\d+\./.test(text)) {
        claims.push(text);
      } else {
        claims.push(`${index + 1}. ${text}`);
      }
    }
  });

  return claims.length > 0 ? claims.join('\n\n') : null;
}

/**
 * Normalize patent number to USPTO format
 * Accepts: "US10123456", "10123456", "US 10,123,456", "10,123,456"
 * Returns: "10123456"
 */
function normalizePatentNumber(input) {
  if (!input) return '';
  return String(input)
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
  if (!number) return 'Unknown';
  const normalized = normalizePatentNumber(number);
  if (!normalized) return 'Unknown';
  // Add commas for readability
  const formatted = normalized.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return `US${formatted}`;
}

/**
 * Fetch patent data from USPTO PatentSearch API (new API as of May 2025)
 * Requires API key from https://patentsview-support.atlassian.net/servicedesk/customer/portal/1/group/1/create/18
 */
export async function fetchPatentFromUSPTO(patentNumber, usptoApiKey) {
  if (!usptoApiKey) {
    throw new Error('USPTO API key is required. Get one free at: https://patentsview.org/apis/keyrequest');
  }

  const normalized = normalizePatentNumber(patentNumber);
  const headers = {
    'X-Api-Key': usptoApiKey,
  };

  // Try direct lookup by ID first (most reliable)
  let patent = null;

  // Try with original number
  let patentResponse = await fetch(`${PATENTSVIEW_BASE}/patent/${normalized}/`, {
    method: 'GET',
    headers,
  });

  // If not found and number is less than 8 digits, try with zero-padding
  if (patentResponse.status === 404 && /^\d+$/.test(normalized) && normalized.length < 8) {
    const padded = normalized.padStart(8, '0');
    patentResponse = await fetch(`${PATENTSVIEW_BASE}/patent/${padded}/`, {
      method: 'GET',
      headers,
    });
  }

  if (!patentResponse.ok) {
    if (patentResponse.status === 404) {
      throw new Error(`Patent ${patentNumber} not found. Note: Only granted US patents are available.`);
    }
    const errorData = await patentResponse.json().catch(() => ({}));
    throw new Error(`USPTO API error: ${patentResponse.status} - ${errorData.detail || errorData.message || 'Unknown error'}`);
  }

  const patentData = await patentResponse.json();
  console.log('USPTO API response:', patentData);

  if (patentData.error) {
    throw new Error(`USPTO API error: ${patentData.message || patentData.reason || 'Unknown error'}`);
  }

  // Handle both direct object response and array response
  if (patentData.patents && patentData.patents.length > 0) {
    patent = patentData.patents[0];
  } else {
    patent = patentData.patent || patentData;
  }

  // Extract patent ID (may have different field names)
  const patentId = patent.patent_id || patent.patentNumber || patent.patent_number || normalized;
  console.log('Patent ID from response:', patentId);
  console.log('Patent title from response:', patent.patent_title);

  // Try multiple patent ID formats for claims
  const idsToTry = [
    patentId,
    patentId.padStart(8, '0'),  // Zero-padded to 8 digits
  ].filter((v, i, a) => a.indexOf(v) === i); // Remove duplicates

  let claimsText = '';

  for (const tryId of idsToTry) {
    console.log('Trying claims fetch with patent_id:', tryId);

    // Try GET request with URL params
    const queryParams = new URLSearchParams({
      q: JSON.stringify({ patent_id: tryId }),
      f: JSON.stringify(['patent_id', 'claim_number', 'claim_text', 'claim_sequence']),
      s: JSON.stringify([{ claim_sequence: 'asc' }]),
      o: JSON.stringify({ size: 100 }),
    });

    const claimsResponse = await fetch(`${PATENTSVIEW_BASE}/g_claim/?${queryParams}`, {
      method: 'GET',
      headers,
    });

    if (claimsResponse.ok) {
      const claimsData = await claimsResponse.json();
      console.log('Claims API response for', tryId, ':', claimsData);
      if (claimsData.g_claims && claimsData.g_claims.length > 0) {
        claimsText = claimsData.g_claims
          .map(c => `${c.claim_number}. ${c.claim_text}`)
          .join('\n\n');
        console.log('Found claims with ID:', tryId);
        break; // Found claims, stop trying
      }
    } else {
      console.error('Claims fetch failed for', tryId, ':', claimsResponse.status);
    }
  }

  // Try Google Patents for claims (if needed) and family members
  let familyMembers = [];
  let googlePatentsUrl = `https://patents.google.com/patent/US${patentId}/en`;

  console.log('Fetching from Google Patents for claims and family...');
  try {
    const googleData = await scrapeGooglePatents(patentId);
    if (googleData) {
      // Use Google claims if PatentsView didn't have them
      if (!claimsText && googleData.claims) {
        claimsText = googleData.claims;
        console.log('Got claims from Google Patents, length:', claimsText.length);
      }
      // Get family members
      familyMembers = googleData.familyMembers || [];
      googlePatentsUrl = googleData.googlePatentsUrl || googlePatentsUrl;
      console.log('Found', familyMembers.length, 'US family members');
    } else {
      console.warn('Could not fetch from Google Patents for patent:', patentId);
    }
  } catch (err) {
    console.error('Google Patents fetch failed:', err.message);
  }

  console.log('Final claims text length:', claimsText.length);

  return {
    patentNumber: patentId,
    title: patent.patent_title || patent.title || 'Unknown Title',
    abstract: patent.patent_abstract || patent.abstract || '',
    date: patent.patent_date || patent.date || '',
    type: patent.patent_type || patent.type || '',
    claimsText: claimsText,
    familyMembers: familyMembers,
    googlePatentsUrl: googlePatentsUrl,
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
