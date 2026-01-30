# Patent Family Analyzer

A web application for analyzing patent families and comparing claims across related patents. Built with React and powered by Claude AI.

## Features

- **Patent Lookup**: Enter a patent number to automatically fetch patent data from USPTO
- **Family Discovery**: Automatically finds related US patents from Google Patents
- **Claim Extraction**: AI extracts and displays the first independent claim from each patent
- **Inventive Concept Summary**: AI-generated summary of each patent's core innovation
- **Claim Comparison**: Compare claims between any two patents in the family
  - **Element Matrix**: AI-powered element-by-element comparison showing what changed
  - **Redline View**: Traditional redline showing additions and deletions
  - **Side-by-Side View**: Raw claims displayed in parallel columns

## Setup

### Prerequisites

- Node.js 18+
- Claude API key (from [Anthropic](https://console.anthropic.com/))
- USPTO API key (free, from [PatentsView](https://patentsview.org/apis/keyrequest))

### Installation

```bash
# Clone the repository
git clone https://github.com/jedilawyer23/patent-family-analyzer-.git
cd patent-family-analyzer-

# Install dependencies
npm install

# Start the development server
npm run dev
```

### Configuration

Enter your API keys in the app interface when prompted:
- **Claude API Key**: Used for claim extraction, analysis, and comparison
- **USPTO API Key**: Used for fetching patent data

## Usage

1. Enter your API keys
2. Enter a patent number (e.g., `7657849` or `US7657849`)
3. The app fetches patent data and finds family members
4. Select which family members to add
5. Check two patents and click "Compare Claims" to analyze differences

## Tech Stack

- **Frontend**: React + Vite + Material UI
- **AI**: Claude API (Anthropic)
- **Data Sources**: USPTO PatentSearch API, Google Patents (scraping)

## Limitations

- Only supports granted US patents (not pending applications)
- Google Patents scraping may break if their HTML structure changes
- API keys are stored in browser localStorage (suitable for personal/demo use)

## License

MIT
