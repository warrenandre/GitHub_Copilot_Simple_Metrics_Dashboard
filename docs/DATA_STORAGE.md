# Data Storage Guide

## Overview

The GitHub Copilot Metrics Dashboard uses a **dual-storage** approach to persist your metrics data:

1. **localStorage** - Browser-based storage for fast, immediate access
2. **Local File** - Project file storage for persistence across browser sessions

## How It Works

### When You Download Data

When you click "Download & Save Locally" in the Admin page:

1. ✅ Data is fetched from GitHub Copilot Metrics API
2. ✅ Data is automatically saved to browser `localStorage` (instant access)
3. ✅ A JSON file is downloaded to your Downloads folder
4. ⚠️ **Manual Step Required**: Move the downloaded file to project folder

### When Live Pages Load Data

The live dashboard pages use this loading priority:

```
1. Check localStorage (fastest)
   ↓ if empty
2. Check /public/data/copilot-metrics.json (file-based)
   ↓ if found
3. Save file data to localStorage (for next time)
```

## Setup Instructions

### Step 1: Download Data from Admin Page

1. Navigate to `/admin` in the app
2. Enter your GitHub credentials:
   - Organization name
   - Personal access token
   - Optional: date range and team slug
3. Click **"Download & Save Locally"**

### Step 2: Save File for Persistence

After downloading, a JSON file will appear in your Downloads folder:

**Example filename**: `copilot-metrics-your-org-2025-06-10.json`

**To make it persist across sessions:**

```bash
# 1. Locate the downloaded file in your Downloads folder
# 2. Move it to the project's public/data folder
# 3. Rename it to exactly: copilot-metrics.json
```

**Windows PowerShell:**
```powershell
# From project root
Move-Item "$env:USERPROFILE\Downloads\copilot-metrics-*.json" -Destination "public\data\copilot-metrics.json"
```

**Mac/Linux:**
```bash
# From project root
mv ~/Downloads/copilot-metrics-*.json public/data/copilot-metrics.json
```

### Step 3: Verify

1. Navigate to any Live Data page
2. If localStorage is empty, the app will:
   - Load from `/public/data/copilot-metrics.json`
   - Display metrics automatically
   - Save to localStorage for faster subsequent access

## File Format

The downloaded JSON file has this structure:

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
      "total_lines_suggested": 5000,
      "total_lines_accepted": 2500,
      "total_active_users": 45,
      "total_chat_acceptances": 120,
      "total_chat_turns": 300,
      "total_active_chat_users": 35,
      "breakdown": [
        {
          "language": "typescript",
          "editor": "vscode",
          "suggestions_count": 800,
          "acceptances_count": 400,
          "lines_suggested": 2500,
          "lines_accepted": 1250,
          "active_users": 25
        }
      ]
    }
    // ... more daily records
  ]
}
```

## Storage Locations

### Browser localStorage

- **Key**: `copilot_metrics_data`
- **Timestamp Key**: `copilot_metrics_data_timestamp`
- **Location**: Browser's localStorage (specific to each browser/device)
- **Persistence**: Cleared when browser cache is cleared
- **Access Speed**: Instant (synchronous)

### Local File Storage

- **Path**: `/public/data/copilot-metrics.json`
- **Location**: Project directory (committed to git is optional)
- **Persistence**: Permanent until manually deleted
- **Access Speed**: Fast (async fetch)

## Best Practices

### For Development

✅ **Keep localStorage for quick access**
- Fastest loading during development
- No file system operations needed

✅ **Use local file for persistence**
- Survives browser cache clears
- Can be version controlled (if not sensitive)
- Shareable across team members

### For Production/Deployment

⚠️ **Important Considerations:**

1. **localStorage** - Device/browser specific, doesn't sync across machines
2. **Local File** - Static file served by Vite, good for demo data
3. **Real Production** - Consider implementing a backend API for multi-user access

### Security

🔒 **Protecting Sensitive Data:**

```bash
# Add to .gitignore to prevent committing real data
echo "public/data/copilot-metrics.json" >> .gitignore
```

## Troubleshooting

### "No Data Available" Warning

**Possible causes:**
1. No data in localStorage
2. No file at `/public/data/copilot-metrics.json`

**Solutions:**
1. Download data from Admin page
2. Move downloaded file to `public/data/` folder
3. Ensure filename is exactly `copilot-metrics.json`

### Data Not Loading from File

**Check:**
```bash
# Verify file exists (from project root)
ls public/data/copilot-metrics.json

# Check file contents
cat public/data/copilot-metrics.json
```

**Common issues:**
- File in wrong location (must be in `public/data/`)
- Wrong filename (must be exactly `copilot-metrics.json`)
- Invalid JSON format (check with JSON validator)

### File Access Errors in Console

**Error**: `Failed to load from local file`

**Cause**: File doesn't exist or isn't accessible

**Solution**: 
1. Ensure file is in `public/data/` folder
2. Restart dev server: `npm run dev`
3. Check browser console for detailed error

## API Reference

### Load Data (Automatic)

The `loadData()` method handles everything automatically:

```typescript
// Used by all live pages
const data = await githubApiService.loadData()

// Internally:
// 1. Checks localStorage first
// 2. Falls back to /public/data/copilot-metrics.json
// 3. Saves file data to localStorage for next time
```

### Manual Storage Operations

```typescript
// Save to localStorage
githubApiService.saveToLocalStorage(data)

// Load from localStorage only
const localData = githubApiService.loadFromLocalStorage()

// Load from file only
const fileData = await githubApiService.loadFromLocalFile()

// Get last saved timestamp
const timestamp = githubApiService.getLastSavedTimestamp()
```

## Workflow Summary

```
┌─────────────────────────────────────────────────────────┐
│                    Admin Page                           │
│  1. Enter credentials                                   │
│  2. Click "Download & Save Locally"                     │
└────────────┬────────────────────────────────────────────┘
             │
             ├─────────────────────────────────────────────┐
             │                                             │
             ▼                                             ▼
    ┌────────────────────┐                    ┌──────────────────────┐
    │   localStorage     │                    │  Downloads Folder    │
    │                    │                    │  copilot-metrics-    │
    │  Instant access    │                    │  {org}-{date}.json   │
    └────────────────────┘                    └──────────┬───────────┘
             │                                           │
             │                                           │ Manual Move
             │                                           ▼
             │                              ┌─────────────────────────┐
             │                              │  public/data/           │
             │                              │  copilot-metrics.json   │
             │                              └────────┬────────────────┘
             │                                       │
             └────────────────┬──────────────────────┘
                              │
                              ▼
                   ┌──────────────────────┐
                   │   Live Pages         │
                   │   Auto-load data     │
                   │   from either source │
                   └──────────────────────┘
```

## Additional Resources

- [API Configuration Guide](./API_CONFIGURATION.md)
- [GitHub Copilot Metrics API Docs](https://docs.github.com/en/rest/copilot/copilot-metrics)
- [Project README](../README.md)
