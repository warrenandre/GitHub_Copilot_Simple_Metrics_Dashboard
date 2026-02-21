# Data Folder

This folder is used to store downloaded GitHub Copilot metrics data files.

## Usage

When you download data from the Admin page:
1. Data is saved to localStorage (for immediate use)
2. A JSON file is automatically downloaded to your Downloads folder
3. Manually move the downloaded file to this `/public/data` folder
4. Rename it to `copilot-metrics.json` for automatic loading

## File Format

The JSON file should follow this structure:

```json
{
  "metadata": {
    "organization": "your-org-name",
    "downloadedAt": "2025-06-10T12:00:00Z",
    "recordCount": 30,
    "dateRange": {
      "from": "2025-01-01",
      "to": "2025-01-30"
    }
  },
  "data": [
    {
      "date": "2025-01-01",
      "total_suggestions_count": 1500,
      "total_acceptances_count": 750,
      // ... more metrics
    }
  ]
}
```

## Automatic Loading

The live dashboard pages will automatically:
1. Check localStorage first (fastest)
2. Fall back to loading from `/public/data/copilot-metrics.json` if localStorage is empty
3. Save file data to localStorage for faster subsequent access

## Notes

- Place your data file here to persist metrics across browser sessions
- The app supports both localStorage and file-based storage
- Files in the public folder are served statically by Vite
