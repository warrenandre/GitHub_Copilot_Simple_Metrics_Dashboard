# Custom Dashboard Feature

## Overview
The Custom Dashboard allows users to create personalized metric views by selecting from 15 available metrics across three categories (Copilot, Pull Request, and General). Users can save their configuration, edit it anytime, and view both weekly and monthly comparisons.

## Key Features

### 1. **Metric Selection**
- **15 Available Metrics** organized into 3 categories:
  - **Copilot Metrics** (6): Acceptances, Suggestions, Acceptance Rate, Active Users, Lines Suggested, Lines Accepted
  - **Pull Request Metrics** (6): Total PRs, Merged PRs, Open PRs, Closed PRs, Avg Time to Merge, Contributors
  - **General Metrics** (3): Total Commits, Active Contributors, Lines Changed

### 2. **Persistent Configuration**
- Dashboard configuration saved to **localStorage**
- Automatically loads saved configuration on page visit
- Tracks creation and update timestamps
- Custom dashboard name (editable)

### 3. **Edit Mode**
- Click "Edit Dashboard" to enter edit mode
- Toggle metrics on/off by clicking metric cards
- Visual feedback shows selected metrics (blue highlight + checkmark)
- Save or Cancel changes
- Edit dashboard name in Settings modal

### 4. **Data Visualization**

#### Summary Cards
- Display current week value for each selected metric
- Show trend indicators (up/down arrows)
- Week-over-week change percentage
- Month-over-month change percentage
- Color-coded: Green (positive), Red (negative)

#### Weekly Comparison Charts
- Bar charts showing Previous Week vs Current Week
- Up to 4 metrics displayed side-by-side
- Color-coded bars based on performance trend
- Responsive layout (2 columns on large screens)

#### Monthly Comparison Charts
- Bar charts showing Previous Month vs Current Month
- Up to 4 metrics displayed side-by-side
- Color-coded bars based on performance trend
- Responsive layout (2 columns on large screens)

### 5. **Demo Mode Support**
- Full demo data generation for all 15 metrics
- Realistic variability based on metric type
- Purple banner when in demo mode
- Live/Demo toggle with DataSourceToggle component
- Separate empty state for live mode (when not connected)

### 6. **Settings Modal**
- Edit dashboard name
- View metrics count
- See last updated timestamp
- Quick save functionality

### 7. **Empty States**
- Friendly message when no metrics selected
- Quick action button to add metrics
- Live mode notification when data not available
- Clear call-to-action prompts

## User Workflow

### First Time Setup
1. Navigate to "Custom Dashboard" from sidebar
2. Click "Edit Dashboard" or "Add Metrics" button
3. Select desired metrics by clicking on them
4. Click "Save Changes"
5. View personalized dashboard with comparisons

### Editing Dashboard
1. Click "Edit Dashboard" button
2. Add metrics: Click on unselected metrics
3. Remove metrics: Click on selected metrics to toggle off
4. Click "Save Changes" to persist
5. Or click "Cancel" to discard changes

### Changing Dashboard Name
1. Click "Settings" button
2. Edit dashboard name in text field
3. Click "Save"
4. Name persists across sessions

## Technical Implementation

### Data Structure
```typescript
interface CustomDashboardConfig {
  id: string
  name: string
  metrics: DashboardMetric[]
  createdAt: string
  updatedAt: string
}

interface DashboardMetric {
  metricId: string
  visible: boolean
  order: number
}
```

### Storage
- **localStorage key**: `customDashboard`
- **Format**: JSON string
- **Auto-save**: On save button click
- **Auto-load**: On component mount

### Default Configuration
If no saved configuration exists, initializes with 4 default metrics:
- Copilot Acceptances
- Acceptance Rate
- Merged PRs
- Avg Time to Merge

### Demo Data Generation
- Realistic base values for each metric
- Random variation for week/month comparisons
- Consistent with metric types (counts, percentages, time)
- Automatically calculates change values and percentages

## Navigation
- **Route**: `/custom-dashboard`
- **Icon**: LayoutDashboard (purple when active)
- **Position**: Between "Compare Metrics" and "Enterprise Metrics" sections
- **Sidebar**: Always visible

## Benefits

### For Users
- ✅ Personalized metric view
- ✅ Focus on relevant KPIs
- ✅ Quick performance comparison
- ✅ Saved preferences across sessions
- ✅ Easy to modify anytime

### For Teams
- ✅ Different team members can track different metrics
- ✅ Executive summary view capability
- ✅ Developer-focused metrics available
- ✅ Flexible reporting structure

## Future Enhancements (Potential)
- Multiple saved dashboards (named presets)
- Metric ordering/drag-and-drop
- Export dashboard to PDF/Image
- Share dashboard configuration with team
- Custom date ranges for comparisons
- Alerts/thresholds for specific metrics
- Metric annotations and notes

## Accessibility
- Keyboard navigation support
- Clear visual indicators for selected state
- Color-coded with semantic meaning
- Empty states with helpful guidance
- Mobile responsive design

## Browser Compatibility
- Works in all modern browsers
- Requires localStorage support
- Responsive design for mobile/tablet/desktop
- Dark/light theme support via ThemeContext

---

**Developed by Warren Joubert - Microsoft Software Engineer**
