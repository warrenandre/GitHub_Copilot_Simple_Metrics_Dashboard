# Admin Functionality - Functional Test Guide

**Version:** 1.0  
**Date:** November 2025  
**Purpose:** This document provides comprehensive test case specifications for functional testing of the Admin Settings page in the GitHub Copilot Metrics Dashboard.

---

## Table of Contents

1. [Overview](#overview)
2. [Test Environment Setup](#test-environment-setup)
3. [Admin Page Components](#admin-page-components)
4. [Test Cases by Feature](#test-cases-by-feature)
5. [Validation Rules](#validation-rules)
6. [Error Scenarios](#error-scenarios)
7. [Data Flow Testing](#data-flow-testing)
8. [UI/UX Testing](#uiux-testing)
9. [Security Testing](#security-testing)
10. [Test Data](#test-data)

---

## Overview

### Purpose of Admin Page
The Admin Settings page allows users to:
- Configure GitHub API credentials (Enterprise/Organization name and Personal Access Token)
- Download various types of Copilot metrics data
- Upload pre-downloaded report files
- Manage stored data in browser localStorage
- View current data status and last saved timestamp

### Access URL
- **Path:** `/admin`
- **Navigation:** Accessible via sidebar menu

### User Roles
- **Regular User:** Full access to all admin features in production mode
- **Demo Mode Viewer:** View-only access when `VITE_DEMO_MODE=true`

---

## Test Environment Setup

### Prerequisites
1. Modern web browser (Chrome, Firefox, Edge, Safari - latest versions)
2. Internet connectivity for GitHub API calls
3. GitHub organization/enterprise with:
   - 5+ active Copilot licenses
   - Copilot Metrics API access enabled
4. Valid GitHub Personal Access Token with required scopes
5. Clean browser state or ability to clear localStorage

### Environment Variables
- **Demo Mode:** `VITE_DEMO_MODE=true` (for testing demo mode)
- **Pre-configured Settings:** `VITE_GITHUB_ORG`, `VITE_GITHUB_TOKEN` (optional)

### Test Data Requirements
- Valid GitHub enterprise/organization name
- Valid Personal Access Token (PAT) with correct scopes
- Invalid credentials for negative testing
- Sample JSON files for upload testing

---

## Admin Page Components

### 1. Page Header
**Elements:**
- Page title: "Admin Settings"
- Admin badge indicator
- Demo mode indicator (when applicable)
- Descriptive text

**Visual Indicators:**
- Purple "ADMIN" badge
- Yellow "DEMO MODE" badge (when active)

### 2. Current Data Status Section
**Elements:**
- Blue information box
- Enterprise metrics status (count, date range)
- Organization metrics status (count, date range)
- Last saved timestamp

**Display Conditions:**
- Only visible when data exists in localStorage

### 3. GitHub API Configuration Form
**Input Fields:**
- **Enterprise** (required): Text input
- **Personal Access Token** (required): Password input
- **Team Slug** (optional): Text input
- **Since Date** (optional): Date input
- **Until Date** (optional): Date input

**Field Properties:**
- All fields disabled in demo mode
- Token field is masked (password type)
- Placeholder text provides guidance

### 4. Enterprise Copilot Data Section
**Buttons:**
- "Download Metrics"
- "Download Seats"

**States:**
- Enabled when org and token are provided
- Disabled in demo mode or when loading
- Shows "Downloading..." text during API calls

### 5. Enterprise 28-Day Report Section
**Buttons:**
- "Get Download Link"
- "Upload Report File" (file input)

**Features:**
- Opens download link in new tab
- Accepts .json files
- Validates file format before saving

### 6. User 28-Day Report Section
**Buttons:**
- "Get Download Link"
- "Upload Report File" (file input)

**Features:**
- Opens download link in new tab
- Accepts .json files in NDJSON format
- Validates NDJSON structure

### 7. Organization Copilot Data Section
**Buttons:**
- "Download Metrics"
- "Download Seats"

**States:**
- Enabled when org and token are provided
- Disabled in demo mode or when loading

### 8. Data Management Section
**Buttons:**
- "Clear All Local Data"

**Features:**
- Confirmation dialog before clearing
- Clears all localStorage data
- Resets all result messages

### 9. API Documentation Section
**Content:**
- Enterprise level endpoints and descriptions
- Organization level endpoints and descriptions
- General requirements
- Token permissions
- External documentation link

### 10. Result Message Sections
**Types:**
- Enterprise Metrics Result (blue/red)
- Enterprise Seats Result (blue/red)
- Enterprise 28-Day Report Result (purple/red)
- User 28-Day Report Result (indigo/red)
- Organization Metrics Result (green/red)
- Organization Seats Result (green/red)

**Content:**
- Success/Error icon
- Success/Error title
- Message text
- Record count (when applicable)
- Date range (when applicable)
- Error details (when applicable)

---

## Test Cases by Feature

### Feature 1: Page Load and Initialization

#### TC-ADM-001: Initial Page Load
**Precondition:** User navigates to `/admin` for the first time (no saved config)

**Test Steps:**
1. Navigate to `/admin` URL
2. Observe page rendering

**Expected Results:**
- ✓ Page title "Admin Settings" is displayed
- ✓ "ADMIN" badge is visible
- ✓ All input fields are empty
- ✓ All download buttons are disabled
- ✓ "Clear All Local Data" button is enabled
- ✓ No data status section is visible
- ✓ No result messages are displayed

**Test Data:** None required

---

#### TC-ADM-002: Page Load with Saved Configuration
**Precondition:** User has previously saved configuration (org, date range, team_slug in localStorage)

**Test Steps:**
1. Save test configuration to localStorage
2. Navigate to `/admin` URL
3. Observe form fields

**Expected Results:**
- ✓ Organization field is pre-filled
- ✓ Date range fields are pre-filled (if previously saved)
- ✓ Team slug field is pre-filled (if previously saved)
- ✓ Token field is empty (not saved to localStorage)
- ✓ Download buttons are disabled (token missing)

**Test Data:**
```json
{
  "org": "test-org",
  "since": "2025-10-01",
  "until": "2025-11-01",
  "team_slug": "engineering"
}
```

---

#### TC-ADM-003: Page Load with Existing Data
**Precondition:** LocalStorage contains previously downloaded metrics data

**Test Steps:**
1. Add test metrics data to localStorage
2. Navigate to `/admin` URL
3. Observe data status section

**Expected Results:**
- ✓ "Local Data Available" info box is displayed
- ✓ Enterprise metrics count is shown
- ✓ Date range is displayed correctly
- ✓ Last saved timestamp is visible

**Test Data:**
```json
{
  "copilot_enterprise_metrics_data": [...],
  "copilot_enterprise_metrics_data_timestamp": "2025-11-19T10:00:00.000Z"
}
```

---

#### TC-ADM-004: Demo Mode Page Load
**Precondition:** Application running with `VITE_DEMO_MODE=true`

**Test Steps:**
1. Set environment variable `VITE_DEMO_MODE=true`
2. Build and run application
3. Navigate to `/admin` URL

**Expected Results:**
- ✓ "DEMO MODE" yellow badge is displayed
- ✓ All input fields are disabled
- ✓ All buttons are disabled
- ✓ Description text shows "Viewing in demo mode - all controls are disabled"
- ✓ Form fields show placeholder text but are not editable

**Test Data:** None required

---

### Feature 2: Form Input Validation

#### TC-ADM-005: Organization Field - Valid Input
**Precondition:** Admin page is loaded

**Test Steps:**
1. Click on "Enterprise" field
2. Enter valid organization name: "microsoft"
3. Tab to next field

**Expected Results:**
- ✓ Text is accepted and displayed
- ✓ No validation error appears
- ✓ Field retains focus behavior correctly

**Test Data:** `microsoft`, `github`, `my-test-org`

---

#### TC-ADM-006: Organization Field - Empty Input
**Precondition:** Admin page is loaded

**Test Steps:**
1. Leave "Enterprise" field empty
2. Click "Download Metrics" button

**Expected Results:**
- ✓ Validation error message appears
- ✓ Error: "Organization name is required"
- ✓ Download operation is not initiated
- ✓ Result section shows validation errors

**Test Data:** Empty string

---

#### TC-ADM-007: Token Field - Valid Format
**Precondition:** Admin page is loaded

**Test Steps:**
1. Enter valid token starting with "ghp_": `ghp_abcdefghijklmnopqrstuvwxyz123456`
2. Attempt to download metrics

**Expected Results:**
- ✓ Token is accepted
- ✓ No format validation error
- ✓ Download attempt proceeds (may fail with API error if token is invalid)

**Test Data:** `ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx`, `github_pat_xxxxxxxxxxxxxx`

---

#### TC-ADM-008: Token Field - Invalid Format
**Precondition:** Admin page is loaded

**Test Steps:**
1. Enter token not starting with "ghp_" or "github_pat_": `abc123xyz`
2. Click "Download Metrics" button

**Expected Results:**
- ✓ Validation error appears
- ✓ Error: "Token should start with 'ghp_' or 'github_pat_'"
- ✓ Download is not initiated

**Test Data:** `abc123`, `token_12345`, `invalid_token`

---

#### TC-ADM-009: Token Field - Empty Input
**Precondition:** Admin page is loaded

**Test Steps:**
1. Fill organization field
2. Leave token field empty
3. Click "Download Metrics" button

**Expected Results:**
- ✓ Validation error appears
- ✓ Error: "Personal Access Token is required"
- ✓ Download is not initiated

**Test Data:** Empty string

---

#### TC-ADM-010: Token Field - Masking
**Precondition:** Admin page is loaded

**Test Steps:**
1. Enter token: `ghp_abcdefghijklmnopqrstuvwxyz123456`
2. Observe display

**Expected Results:**
- ✓ Token characters are masked (shown as dots/asterisks)
- ✓ Actual token value is not visible on screen
- ✓ Token can be copied from field (for testing purposes)

**Test Data:** Any valid token

---

#### TC-ADM-011: Date Field - Valid Format
**Precondition:** Admin page is loaded

**Test Steps:**
1. Enter "Since Date": `2025-10-01`
2. Enter "Until Date": `2025-11-01`
3. Click "Download Metrics"

**Expected Results:**
- ✓ Dates are accepted
- ✓ No validation error
- ✓ Download proceeds (if other required fields are valid)

**Test Data:** 
- Since: `2025-10-01`, `2025-01-15`
- Until: `2025-11-01`, `2025-02-15`

---

#### TC-ADM-012: Date Field - Invalid Format
**Precondition:** Admin page is loaded

**Test Steps:**
1. Fill required fields (org, token)
2. Manually enter invalid date in Since field: `10/01/2025`
3. Click "Download Metrics"

**Expected Results:**
- ✓ Validation error appears
- ✓ Error: "Since date must be in YYYY-MM-DD format"
- ✓ Download is not initiated

**Test Data:** `10/01/2025`, `2025/10/01`, `01-10-2025`, `invalid`

---

#### TC-ADM-013: Date Range - Invalid Range (Since > Until)
**Precondition:** Admin page is loaded

**Test Steps:**
1. Fill required fields (org, token)
2. Enter "Since Date": `2025-11-01`
3. Enter "Until Date": `2025-10-01`
4. Click "Download Metrics"

**Expected Results:**
- ✓ Validation error appears
- ✓ Error: "Since date must be before Until date"
- ✓ Download is not initiated

**Test Data:**
- Since: `2025-11-01`, Until: `2025-10-01`
- Since: `2025-12-31`, Until: `2025-01-01`

---

#### TC-ADM-014: Date Range - Valid Range
**Precondition:** Admin page is loaded

**Test Steps:**
1. Fill required fields (org, token)
2. Enter "Since Date": `2025-10-01`
3. Enter "Until Date": `2025-11-15`
4. Observe validation

**Expected Results:**
- ✓ No validation error
- ✓ Fields are accepted
- ✓ Download button remains enabled

**Test Data:**
- Since: `2025-10-01`, Until: `2025-11-15`
- Since: `2025-01-01`, Until: `2025-01-31`

---

#### TC-ADM-015: Team Slug - Optional Field
**Precondition:** Admin page is loaded

**Test Steps:**
1. Fill required fields (org, token)
2. Leave team slug empty
3. Click "Download Metrics"

**Expected Results:**
- ✓ No validation error
- ✓ Download proceeds without team filtering
- ✓ Enterprise-wide metrics are fetched

**Test Data:** Empty string

---

#### TC-ADM-016: Team Slug - With Value
**Precondition:** Admin page is loaded

**Test Steps:**
1. Fill required fields (org, token)
2. Enter team slug: `engineering`
3. Click "Download Metrics"

**Expected Results:**
- ✓ Value is accepted
- ✓ Download proceeds with team filtering
- ✓ Team-specific metrics are fetched

**Test Data:** `engineering`, `qa-team`, `platform-team`

---

#### TC-ADM-017: Validation Error Display
**Precondition:** Admin page is loaded

**Test Steps:**
1. Click "Download Metrics" with all fields empty
2. Observe error display

**Expected Results:**
- ✓ Red error box appears at top of form
- ✓ Error icon (AlertCircle) is displayed
- ✓ Title "Configuration Errors" is shown
- ✓ All validation errors are listed
- ✓ Error: "Organization name is required"
- ✓ Error: "Personal Access Token is required"

**Test Data:** Empty form

---

#### TC-ADM-018: Validation Error Clearing
**Precondition:** Validation errors are displayed

**Test Steps:**
1. Display validation errors (submit empty form)
2. Start typing in any field
3. Observe error display

**Expected Results:**
- ✓ Error box disappears as soon as user starts typing
- ✓ Form becomes editable again
- ✓ Result messages are cleared

**Test Data:** Any character input

---

### Feature 3: Enterprise Metrics Download

#### TC-ADM-019: Download Enterprise Metrics - Success
**Precondition:** Valid credentials configured, internet connection available

**Test Steps:**
1. Enter valid organization: `test-enterprise`
2. Enter valid token with correct scopes
3. Click "Download Metrics" in Enterprise section

**Expected Results:**
- ✓ Button text changes to "Downloading..."
- ✓ Button is disabled during download
- ✓ Success message appears after completion
- ✓ Message: "Enterprise metrics downloaded successfully"
- ✓ Record count is displayed
- ✓ Date range is shown
- ✓ Data is saved to localStorage key: `copilot_enterprise_metrics_data`
- ✓ Timestamp is saved
- ✓ Data status section updates
- ✓ Configuration is saved to localStorage (without token)

**Test Data:** Valid GitHub enterprise credentials

---

#### TC-ADM-020: Download Enterprise Metrics - API Error 401
**Precondition:** Invalid token configured

**Test Steps:**
1. Enter valid organization
2. Enter invalid/expired token
3. Click "Download Metrics"

**Expected Results:**
- ✓ Error message appears
- ✓ Error title: "Enterprise Metrics Error"
- ✓ Error contains status code 401
- ✓ Error details displayed in monospace font
- ✓ No data is saved to localStorage
- ✓ Data status section does not update

**Test Data:** Organization: `test-org`, Token: `ghp_invalidtoken123456789`

---

#### TC-ADM-021: Download Enterprise Metrics - API Error 403
**Precondition:** Valid token but insufficient permissions

**Test Steps:**
1. Enter valid organization
2. Enter token without required scopes
3. Click "Download Metrics"

**Expected Results:**
- ✓ Error message appears
- ✓ Error status 403 Forbidden
- ✓ Suggests checking organization ownership
- ✓ No data is saved

**Test Data:** Token without `manage_billing:copilot` scope

---

#### TC-ADM-022: Download Enterprise Metrics - API Error 404
**Precondition:** Non-existent organization

**Test Steps:**
1. Enter non-existent organization: `nonexistent-org-xyz-123`
2. Enter valid token
3. Click "Download Metrics"

**Expected Results:**
- ✓ Error message appears
- ✓ Error status 404 Not Found
- ✓ Suggests verifying organization name
- ✓ No data is saved

**Test Data:** Organization: `nonexistent-org-xyz-123`

---

#### TC-ADM-023: Download Enterprise Metrics - Network Error
**Precondition:** No internet connection

**Test Steps:**
1. Disconnect internet connection
2. Fill valid credentials
3. Click "Download Metrics"

**Expected Results:**
- ✓ Error message appears
- ✓ Network error is displayed
- ✓ Timeout or connection error mentioned
- ✓ No data is saved

**Test Data:** Valid credentials, no network

---

#### TC-ADM-024: Download Enterprise Metrics - With Date Range
**Precondition:** Valid credentials, specific date range needed

**Test Steps:**
1. Fill valid credentials
2. Set "Since Date": `2025-10-01`
3. Set "Until Date": `2025-10-31`
4. Click "Download Metrics"

**Expected Results:**
- ✓ Download succeeds
- ✓ Returned data is within specified date range
- ✓ Date range in result matches input
- ✓ Data is saved with date range metadata

**Test Data:** Date range covering active period

---

#### TC-ADM-025: Download Enterprise Metrics - With Team Filter
**Precondition:** Valid credentials, team slug provided

**Test Steps:**
1. Fill valid credentials
2. Enter team slug: `engineering`
3. Click "Download Metrics"

**Expected Results:**
- ✓ Download succeeds
- ✓ Only team-specific metrics are returned
- ✓ Team information is included in results
- ✓ Data is saved with team context

**Test Data:** Valid team slug

---

#### TC-ADM-026: Download Enterprise Metrics - Button State During Download
**Precondition:** Valid credentials

**Test Steps:**
1. Fill valid credentials
2. Click "Download Metrics"
3. Observe button state during API call

**Expected Results:**
- ✓ Button shows "Downloading..." text
- ✓ Button is disabled
- ✓ Button has visual disabled state
- ✓ Other download buttons remain enabled/disabled based on their state
- ✓ After completion, button returns to "Download Metrics" text
- ✓ Button is re-enabled

**Test Data:** Valid credentials

---

### Feature 4: Enterprise Seats Download

#### TC-ADM-027: Download Enterprise Seats - Success
**Precondition:** Valid credentials configured

**Test Steps:**
1. Enter valid organization
2. Enter valid token
3. Click "Download Seats" in Enterprise section

**Expected Results:**
- ✓ Button text changes to "Downloading..."
- ✓ Success message appears
- ✓ Message: "Enterprise seats downloaded successfully"
- ✓ Seat count is displayed
- ✓ Data is saved to localStorage key: `copilot_enterprise_seats_data`
- ✓ Data status may show seat information
- ✓ Configuration is saved

**Test Data:** Valid GitHub enterprise credentials

---

#### TC-ADM-028: Download Enterprise Seats - Error Handling
**Precondition:** Invalid credentials

**Test Steps:**
1. Enter invalid organization
2. Enter valid token
3. Click "Download Seats"

**Expected Results:**
- ✓ Error message appears
- ✓ Error title: "Enterprise Seats Error"
- ✓ Appropriate error status and details shown
- ✓ No data is saved

**Test Data:** Invalid organization name

---

#### TC-ADM-029: Concurrent Downloads - Metrics and Seats
**Precondition:** Valid credentials

**Test Steps:**
1. Fill valid credentials
2. Click "Download Metrics"
3. Immediately click "Download Seats" (during metrics download)

**Expected Results:**
- ✓ First download is blocked or prevented
- ✓ `loading` state prevents simultaneous downloads
- ✓ Or second download waits for first to complete
- ✓ Both downloads complete successfully (one after another)
- ✓ Both result messages appear

**Test Data:** Valid credentials

---

### Feature 5: Enterprise 28-Day Report

#### TC-ADM-030: Get 28-Day Report Download Link - Success
**Precondition:** Valid credentials, API supports 28-day report

**Test Steps:**
1. Fill valid credentials
2. Click "Get Download Link" in Enterprise 28-Day Report section
3. Observe behavior

**Expected Results:**
- ✓ New browser tab opens with download link
- ✓ Success message appears in admin page
- ✓ Message explains file needs to be downloaded from new tab
- ✓ Instructions for uploading file are provided

**Test Data:** Valid credentials

---

#### TC-ADM-031: Upload 28-Day Report - Valid JSON File
**Precondition:** Downloaded 28-day report JSON file available

**Test Steps:**
1. Click "Upload Report File" button
2. Select valid 28-day report JSON file
3. Observe upload process

**Expected Results:**
- ✓ File picker dialog opens
- ✓ File is read and parsed
- ✓ Success message appears
- ✓ Message shows day count (e.g., "28 days of data")
- ✓ Date range is displayed
- ✓ Data is saved to localStorage key: `enterprise_report_data`
- ✓ Timestamp is saved
- ✓ Data status section updates

**Test Data:** Valid JSON file with structure:
```json
{
  "data": {
    "day_totals": [...],
    "report_start_day": "2025-10-01",
    "report_end_day": "2025-10-27"
  }
}
```

---

#### TC-ADM-032: Upload 28-Day Report - Invalid JSON Structure
**Precondition:** Invalid JSON file available

**Test Steps:**
1. Click "Upload Report File"
2. Select JSON file without `day_totals` array
3. Observe result

**Expected Results:**
- ✓ Error message appears
- ✓ Error: "Invalid file format. Expected a 28-day report with day_totals array."
- ✓ No data is saved
- ✓ Data status does not update

**Test Data:** JSON file without required structure

---

#### TC-ADM-033: Upload 28-Day Report - Invalid JSON Syntax
**Precondition:** Malformed JSON file available

**Test Steps:**
1. Click "Upload Report File"
2. Select file with JSON syntax errors
3. Observe result

**Expected Results:**
- ✓ Error message appears
- ✓ Parse error is displayed
- ✓ No data is saved

**Test Data:** File with invalid JSON: `{ "data": [ missing bracket`

---

#### TC-ADM-034: Upload 28-Day Report - Non-JSON File
**Precondition:** Text or other file type available

**Test Steps:**
1. Click "Upload Report File"
2. Select .txt or other non-JSON file
3. Observe result

**Expected Results:**
- ✓ File picker may filter out non-.json files
- ✓ If file is selected, parse error appears
- ✓ No data is saved

**Test Data:** .txt, .csv, or other file types

---

#### TC-ADM-035: Upload 28-Day Report - Cancel File Selection
**Precondition:** Admin page loaded

**Test Steps:**
1. Click "Upload Report File"
2. Click "Cancel" in file picker dialog

**Expected Results:**
- ✓ File picker closes
- ✓ No error message appears
- ✓ No changes to data or UI

**Test Data:** None

---

### Feature 6: User 28-Day Report

#### TC-ADM-036: Get User 28-Day Report Download Link - Success
**Precondition:** Valid credentials

**Test Steps:**
1. Fill valid credentials
2. Click "Get Download Link" in User 28-Day Report section

**Expected Results:**
- ✓ New tab opens with download link
- ✓ Success message appears
- ✓ Instructions provided for downloading and uploading

**Test Data:** Valid credentials

---

#### TC-ADM-037: Upload User 28-Day Report - Valid NDJSON File
**Precondition:** Downloaded user report NDJSON file available

**Test Steps:**
1. Click "Upload Report File" in User section
2. Select valid NDJSON file
3. Observe upload

**Expected Results:**
- ✓ File is parsed line by line (NDJSON format)
- ✓ Success message appears
- ✓ Message shows record count and unique user count
- ✓ Date range is displayed
- ✓ Data saved to localStorage key: `user_report_data`
- ✓ Timestamp is saved

**Test Data:** NDJSON file with format:
```
{"user_id": "123", "day": "2025-10-01", "user_login": "user1", ...}
{"user_id": "124", "day": "2025-10-01", "user_login": "user2", ...}
```

---

#### TC-ADM-038: Upload User 28-Day Report - Invalid NDJSON Format
**Precondition:** Invalid NDJSON file available

**Test Steps:**
1. Click "Upload Report File"
2. Select file with invalid NDJSON (missing required fields)

**Expected Results:**
- ✓ Error message appears
- ✓ Error mentions expected format: NDJSON with user activity records
- ✓ No data is saved

**Test Data:** File without `user_id` or `day` fields

---

#### TC-ADM-039: Upload User 28-Day Report - Parse Error on Specific Line
**Precondition:** NDJSON file with syntax error in one line

**Test Steps:**
1. Click "Upload Report File"
2. Select NDJSON file with malformed line

**Expected Results:**
- ✓ Error message appears
- ✓ Error indicates which line failed to parse
- ✓ Example: "Failed to parse line 5: ..."
- ✓ No data is saved

**Test Data:** NDJSON with invalid JSON on line 5

---

### Feature 7: Organization Metrics Download

#### TC-ADM-040: Download Organization Metrics - Success
**Precondition:** Valid credentials with organization access

**Test Steps:**
1. Enter valid organization name
2. Enter valid token
3. Click "Download Metrics" in Organization section

**Expected Results:**
- ✓ Button shows "Downloading..."
- ✓ Success message appears
- ✓ Message: "Organization metrics downloaded successfully"
- ✓ Record count and date range displayed
- ✓ Data saved to localStorage key: `copilot_org_metrics_data`
- ✓ Timestamp saved

**Test Data:** Valid organization credentials

---

#### TC-ADM-041: Download Organization Metrics - With Team Filter
**Precondition:** Valid credentials, team slug provided

**Test Steps:**
1. Fill valid credentials
2. Enter team slug
3. Click "Download Metrics" in Organization section

**Expected Results:**
- ✓ Download succeeds
- ✓ Team-filtered metrics returned
- ✓ Data reflects team scope

**Test Data:** Valid team slug

---

#### TC-ADM-042: Download Organization Metrics - Error Scenarios
**Precondition:** Various invalid inputs

**Test Steps:**
1. Test with invalid org name
2. Test with wrong token
3. Test with expired token

**Expected Results:**
- ✓ Appropriate error messages for each scenario
- ✓ No data saved on errors
- ✓ Helpful troubleshooting information provided

**Test Data:** Various invalid credentials

---

### Feature 8: Organization Seats Download

#### TC-ADM-043: Download Organization Seats - Success
**Precondition:** Valid organization credentials

**Test Steps:**
1. Fill valid credentials
2. Click "Download Seats" in Organization section

**Expected Results:**
- ✓ Success message appears
- ✓ Message: "Organization seats downloaded successfully"
- ✓ Seat count displayed
- ✓ Data saved to localStorage: `copilot_org_seats_data`

**Test Data:** Valid credentials

---

#### TC-ADM-044: Download Organization Seats - Pagination
**Precondition:** Organization with many seats (>100)

**Test Steps:**
1. Fill valid credentials for large organization
2. Click "Download Seats"
3. Observe data completeness

**Expected Results:**
- ✓ All pages of data are fetched
- ✓ Complete seat list is saved
- ✓ Total count matches expected number

**Test Data:** Large organization credentials

---

### Feature 9: Data Management

#### TC-ADM-045: Clear All Local Data - With Confirmation
**Precondition:** Local data exists in localStorage

**Test Steps:**
1. Ensure data exists (check data status section)
2. Click "Clear All Local Data"
3. Click "OK" in confirmation dialog

**Expected Results:**
- ✓ Confirmation dialog appears with warning message
- ✓ All localStorage keys are cleared:
  - `copilot_enterprise_metrics_data`
  - `copilot_enterprise_seats_data`
  - `enterprise_report_data`
  - `user_report_data`
  - `copilot_org_metrics_data`
  - `copilot_org_seats_data`
  - Timestamps
- ✓ Success message appears
- ✓ Data status section disappears
- ✓ All result messages are cleared

**Test Data:** Existing localStorage data

---

#### TC-ADM-046: Clear All Local Data - Cancel Confirmation
**Precondition:** Local data exists

**Test Steps:**
1. Click "Clear All Local Data"
2. Click "Cancel" in confirmation dialog

**Expected Results:**
- ✓ Dialog closes
- ✓ No data is cleared
- ✓ Data status section remains unchanged
- ✓ No changes to localStorage

**Test Data:** Existing localStorage data

---

#### TC-ADM-047: Clear All Local Data - No Data Exists
**Precondition:** No data in localStorage

**Test Steps:**
1. Ensure localStorage is empty
2. Click "Clear All Local Data"
3. Confirm action

**Expected Results:**
- ✓ Success message appears
- ✓ Message: "Local data cleared successfully"
- ✓ No errors occur
- ✓ Page state remains stable

**Test Data:** Empty localStorage

---

#### TC-ADM-048: Clear Data - Button State
**Precondition:** Admin page loaded

**Test Steps:**
1. Observe "Clear All Local Data" button state in various scenarios

**Expected Results:**
- ✓ Button is enabled when not in demo mode
- ✓ Button is disabled in demo mode
- ✓ Button is disabled during download operations (loading state)
- ✓ Button has red color indicating destructive action

**Test Data:** Various application states

---

### Feature 10: Demo Mode Behavior

#### TC-ADM-049: Demo Mode - All Controls Disabled
**Precondition:** Demo mode enabled (`VITE_DEMO_MODE=true`)

**Test Steps:**
1. Load admin page in demo mode
2. Attempt to interact with each input and button

**Expected Results:**
- ✓ All text inputs are disabled
- ✓ All date inputs are disabled
- ✓ All download buttons are disabled
- ✓ All upload buttons are disabled
- ✓ Clear data button is disabled
- ✓ Cursor shows "not-allowed" on disabled elements
- ✓ Visual opacity indicates disabled state

**Test Data:** Demo mode configuration

---

#### TC-ADM-050: Demo Mode - View Configuration Display
**Precondition:** Demo mode enabled with pre-configured values

**Test Steps:**
1. Set environment variables for demo org and dates
2. Load admin page
3. Observe displayed values

**Expected Results:**
- ✓ Pre-configured values are visible in form fields
- ✓ Fields are displayed but not editable
- ✓ Token field shows placeholder but no actual token
- ✓ Data status may show demo data information

**Test Data:** Environment variables set

---

#### TC-ADM-051: Demo Mode - Documentation Accessibility
**Precondition:** Demo mode enabled

**Test Steps:**
1. Load admin page in demo mode
2. Scroll to documentation section
3. Click external documentation link

**Expected Results:**
- ✓ Documentation section is visible and readable
- ✓ External link works correctly
- ✓ Link opens in new tab

**Test Data:** None

---

### Feature 11: UI State Management

#### TC-ADM-052: Multiple Result Messages
**Precondition:** Multiple download operations completed

**Test Steps:**
1. Download enterprise metrics (success)
2. Download enterprise seats (success)
3. Download 28-day report (success)
4. Observe all result messages

**Expected Results:**
- ✓ Each result message appears in its own section
- ✓ Messages are color-coded by data type
- ✓ All messages are visible simultaneously
- ✓ Each message shows appropriate success information

**Test Data:** Valid credentials

---

#### TC-ADM-053: Result Message Persistence
**Precondition:** Result message displayed

**Test Steps:**
1. Perform successful download
2. Observe success message
3. Change form input
4. Observe message behavior

**Expected Results:**
- ✓ Success message remains visible after download
- ✓ Message persists when editing form
- ✓ Message clears when attempting new download

**Test Data:** Valid credentials

---

#### TC-ADM-054: Loading State - Button Interaction
**Precondition:** Download in progress

**Test Steps:**
1. Click "Download Metrics"
2. During loading, attempt to click same or different buttons

**Expected Results:**
- ✓ Clicked button shows "Downloading..." text
- ✓ Clicked button cannot be clicked again
- ✓ Other buttons' states depend on `loading` global state
- ✓ No duplicate API calls initiated

**Test Data:** Valid credentials

---

#### TC-ADM-055: Data Status Updates
**Precondition:** No initial data

**Test Steps:**
1. Perform successful download
2. Observe data status section appearance
3. Perform another download
4. Observe data status updates

**Expected Results:**
- ✓ Data status section appears after first download
- ✓ Counts and date ranges update correctly
- ✓ Last saved timestamp updates
- ✓ Multiple data types shown if available

**Test Data:** Valid credentials

---

### Feature 12: Configuration Persistence

#### TC-ADM-056: Configuration Saved After Download
**Precondition:** First time user, no saved config

**Test Steps:**
1. Fill form with: org, token, dates, team_slug
2. Click "Download Metrics"
3. Wait for success
4. Refresh page
5. Observe form fields

**Expected Results:**
- ✓ Organization name is restored
- ✓ Date fields are restored
- ✓ Team slug is restored
- ✓ Token field is empty (security)
- ✓ localStorage contains config (check with DevTools)

**Test Data:** 
```json
{
  "org": "test-org",
  "since": "2025-10-01",
  "until": "2025-11-01",
  "team_slug": "engineering"
}
```

---

#### TC-ADM-057: Token Not Persisted
**Precondition:** Successful download with token

**Test Steps:**
1. Perform download with token
2. Open browser DevTools → Application → Local Storage
3. Check `copilot_api_config` key

**Expected Results:**
- ✓ Config is saved to localStorage
- ✓ Token field is NOT present in saved config
- ✓ Only non-sensitive fields are persisted

**Test Data:** Any valid token

---

#### TC-ADM-058: Configuration Override
**Precondition:** Saved configuration exists

**Test Steps:**
1. Load page with saved config
2. Change organization name
3. Perform new download
4. Refresh page

**Expected Results:**
- ✓ New organization name is saved
- ✓ Old organization name is replaced
- ✓ Other fields remain unchanged if not edited

**Test Data:** Different organization names

---

---

## Validation Rules

### Input Validation Summary

| Field | Required | Format | Validation |
|-------|----------|--------|------------|
| Enterprise | Yes | Text | Non-empty string |
| Personal Access Token | Yes | Text | Starts with `ghp_` or `github_pat_` |
| Team Slug | No | Text | Any string |
| Since Date | No | Date | YYYY-MM-DD format, < Until Date |
| Until Date | No | Date | YYYY-MM-DD format, > Since Date |

### API Response Validation

#### Successful Response
- HTTP Status: 200
- Content-Type: application/json
- Body: Array of metrics objects or seats objects

#### Error Responses
| Status Code | Meaning | Common Causes |
|-------------|---------|---------------|
| 400 | Bad Request | Invalid parameters |
| 401 | Unauthorized | Invalid/expired token, wrong permissions |
| 403 | Forbidden | Insufficient permissions, API access disabled |
| 404 | Not Found | Organization doesn't exist, Copilot not enabled |
| 422 | Unprocessable Entity | Invalid date format, invalid date range |
| 429 | Rate Limit Exceeded | Too many requests |
| 500 | Server Error | GitHub API internal error |

### Data Format Validation

#### Enterprise/Organization Metrics
```json
[
  {
    "date": "2025-10-01",
    "total_suggestions_count": 1000,
    "total_acceptances_count": 750,
    "total_lines_suggested": 5000,
    "total_lines_accepted": 3500,
    "total_active_users": 50,
    ...
  }
]
```

#### Seats Data
```json
{
  "total_seats": 100,
  "seats": [
    {
      "assignee": {
        "login": "username",
        "id": 12345
      },
      "created_at": "2025-01-01T00:00:00Z",
      "last_activity_at": "2025-10-31T23:59:59Z",
      ...
    }
  ]
}
```

#### 28-Day Report
```json
{
  "data": {
    "report_start_day": "2025-10-01",
    "report_end_day": "2025-10-27",
    "day_totals": [
      {
        "day": "2025-10-01",
        "total_active_users": 45,
        "total_engaged_users": 40,
        ...
      }
    ]
  }
}
```

#### User 28-Day Report (NDJSON)
```
{"user_id":"123","day":"2025-10-01","user_login":"user1",...}
{"user_id":"123","day":"2025-10-02","user_login":"user1",...}
```

---

## Error Scenarios

### Critical Error Scenarios

#### ERR-001: Network Connection Lost During Download
**Trigger:** Disconnect internet during API call

**Expected Behavior:**
- Error message displayed
- No partial data saved
- Button returns to enabled state
- User can retry download

---

#### ERR-002: Browser Crashes During Data Save
**Trigger:** Close browser/tab during localStorage write

**Expected Behavior:**
- On reload, either all data saved or none saved (atomic)
- No corrupted data in localStorage
- User can retry download

---

#### ERR-003: LocalStorage Quota Exceeded
**Trigger:** Download very large dataset

**Expected Behavior:**
- Error message: "Storage quota exceeded"
- Suggestion to clear old data
- Data is not saved
- Button returns to enabled state

---

#### ERR-004: LocalStorage Disabled
**Trigger:** Browser privacy mode or localStorage disabled

**Expected Behavior:**
- Warning message on page load
- Download functionality may work but data won't persist
- Clear error explanation to user

---

#### ERR-005: Malformed API Response
**Trigger:** GitHub API returns unexpected format

**Expected Behavior:**
- Error message displayed
- Parse error caught and handled
- No application crash
- No corrupted data saved

---

### Edge Cases

#### EDGE-001: Empty Response from API
**Scenario:** Valid request but no data in date range

**Expected Behavior:**
- Success message with 0 records
- Or informational message: "No data available for date range"
- No data saved or empty array saved

---

#### EDGE-002: Very Large Dataset
**Scenario:** Download returns thousands of records

**Expected Behavior:**
- All data processed correctly
- UI remains responsive
- Download completes within reasonable time
- Data successfully saved

---

#### EDGE-003: Special Characters in Organization Name
**Scenario:** Org name with spaces, dashes, underscores

**Expected Behavior:**
- Characters accepted
- API call uses proper encoding
- Download succeeds if org name is valid

**Test Data:** `my-org`, `my_org`, `my org` (if allowed by GitHub)

---

#### EDGE-004: Date Range Spanning Months/Years
**Scenario:** Since: 2025-01-01, Until: 2025-12-31

**Expected Behavior:**
- Full year of data requested
- API handles pagination if needed
- All data returned and saved

---

#### EDGE-005: Simultaneous Users
**Scenario:** Multiple tabs/users with same credentials

**Expected Behavior:**
- Each tab operates independently
- Downloads succeed in each tab
- LocalStorage may be overwritten by last save

---

---

## Data Flow Testing

### Data Flow Diagram

```
User Input → Validation → API Request → API Response → Data Transformation → LocalStorage → UI Update
     ↓                                                                              ↓
   Error ←──────────────────────────────────────────────────────────────────── Success Message
```

### Flow Test Cases

#### FLOW-001: Complete Success Flow
**Steps:**
1. User enters valid credentials
2. Validation passes
3. API request sent
4. GitHub API responds with data
5. Data transformed to expected format
6. Data saved to localStorage
7. Success message displayed
8. Data status section updated
9. Configuration saved (without token)

**Verification Points:**
- Check console for debug logs
- Verify localStorage keys using DevTools
- Confirm timestamp is set
- Verify data structure in localStorage

---

#### FLOW-002: Complete Error Flow
**Steps:**
1. User enters invalid credentials
2. Validation passes format check
3. API request sent
4. GitHub API responds with error
5. Error caught and parsed
6. Error message displayed
7. No data saved
8. Button returns to enabled state

**Verification Points:**
- Error message contains status code
- Error message contains helpful information
- LocalStorage unchanged
- UI returns to idle state

---

#### FLOW-003: Validation Error Flow
**Steps:**
1. User enters invalid format data
2. Validation fails
3. Validation errors displayed
4. No API request sent
5. User corrects input
6. Validation errors clear
7. User submits again
8. Validation passes
9. API request proceeds

**Verification Points:**
- No network requests when validation fails
- Error messages clear on input change
- Form remains editable

---

#### FLOW-004: Upload File Flow
**Steps:**
1. User clicks "Upload Report File"
2. File picker opens
3. User selects JSON file
4. File is read by FileReader
5. JSON is parsed
6. Data structure validated
7. Data saved to localStorage
8. Success message displayed
9. Data status section updated

**Verification Points:**
- File is read completely
- Parsing handles large files
- Invalid files rejected gracefully
- UI updates immediately after save

---

---

## UI/UX Testing

### Visual Testing

#### VIS-001: Layout Consistency
**Test:** Navigate admin page on different screen sizes

**Expected:**
- ✓ Responsive design works on desktop (1920x1080)
- ✓ Works on tablet (768x1024)
- ✓ Works on mobile (375x667)
- ✓ All elements visible without horizontal scroll
- ✓ Buttons stack appropriately on small screens

---

#### VIS-002: Color Coding
**Test:** Observe result message colors

**Expected:**
- ✓ Enterprise Metrics: Blue (success) / Red (error)
- ✓ Enterprise Seats: Blue (success) / Red (error)
- ✓ 28-Day Report: Purple (success) / Red (error)
- ✓ User Report: Indigo (success) / Red (error)
- ✓ Organization Metrics: Green (success) / Red (error)
- ✓ Organization Seats: Green (success) / Red (error)

---

#### VIS-003: Accessibility - Color Contrast
**Test:** Use accessibility tools to check contrast

**Expected:**
- ✓ All text meets WCAG AA standards (4.5:1 for normal text)
- ✓ Button text is readable
- ✓ Error messages have sufficient contrast

---

#### VIS-004: Accessibility - Keyboard Navigation
**Test:** Navigate page using only keyboard

**Expected:**
- ✓ Tab order is logical
- ✓ All interactive elements are reachable
- ✓ Focus indicators are visible
- ✓ Enter key activates buttons
- ✓ Escape key cancels file picker

---

#### VIS-005: Loading Indicators
**Test:** Observe visual feedback during operations

**Expected:**
- ✓ Button text changes during loading
- ✓ Button cursor changes to not-allowed when disabled
- ✓ Clear visual distinction between enabled/disabled states

---

### Usability Testing

#### USE-001: First-Time User Experience
**Scenario:** New user visits admin page

**Evaluation Points:**
- Is purpose of page clear?
- Are required fields obvious?
- Is error feedback helpful?
- Are next steps clear after download?
- Is documentation easily accessible?

---

#### USE-002: Error Recovery
**Scenario:** User encounters error

**Evaluation Points:**
- Is error message understandable?
- Are corrective actions suggested?
- Can user easily retry?
- Is error persistent or dismissible?

---

#### USE-003: Success Feedback
**Scenario:** User completes successful download

**Evaluation Points:**
- Is success clearly communicated?
- Is next action obvious?
- Can user verify data was saved?
- Is timestamp visible and clear?

---

---

## Security Testing

### Security Test Cases

#### SEC-001: Token Masking
**Test:** Enter token in field

**Verification:**
- ✓ Token characters are masked
- ✓ Token not visible in DOM (inspect element)
- ✓ Token not visible in screenshots
- ✓ Token not logged to console

---

#### SEC-002: Token Storage
**Test:** Perform download and check localStorage

**Verification:**
- ✓ Token is NOT saved to localStorage
- ✓ Token is NOT saved in cookies
- ✓ Token is NOT saved in session storage
- ✓ Only non-sensitive config is persisted

---

#### SEC-003: Token in Network Traffic
**Test:** Monitor network requests during download

**Verification:**
- ✓ Token is sent only in Authorization header
- ✓ Token is not in URL parameters
- ✓ HTTPS is used for API calls
- ✓ Token is not logged in browser DevTools Network tab (except in headers)

---

#### SEC-004: XSS Prevention
**Test:** Enter malicious scripts in form fields

**Test Data:** `<script>alert('XSS')</script>`, `<img src=x onerror=alert('XSS')>`

**Verification:**
- ✓ Scripts are not executed
- ✓ Input is sanitized or escaped
- ✓ No JavaScript injection possible

---

#### SEC-005: Data Validation - Injection Attacks
**Test:** Enter special characters and SQL-like syntax

**Test Data:** `'; DROP TABLE users;--`, `admin' OR '1'='1`

**Verification:**
- ✓ Input is validated
- ✓ Special characters handled safely
- ✓ No injection possible (though this is client-side, backend must also validate)

---

#### SEC-006: CORS Configuration
**Test:** Observe API call behavior

**Verification:**
- ✓ CORS errors handled gracefully
- ✓ User-friendly error messages
- ✓ No security bypass attempts suggested

---

#### SEC-007: Demo Mode Security
**Test:** Attempt to bypass demo mode restrictions

**Verification:**
- ✓ Cannot edit fields by manipulating DOM
- ✓ Cannot submit form by calling JS functions
- ✓ Server-side checks prevent unauthorized access (if applicable)

---

---

## Test Data

### Valid Test Data

#### Organization/Enterprise Names
- `microsoft`
- `github`
- `google`
- `my-test-org`
- `test_organization`

#### Valid Token Formats
- `ghp_1234567890abcdefghijklmnopqrstuvwx`
- `github_pat_11ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789`

#### Valid Date Ranges
- Since: `2025-10-01`, Until: `2025-10-31` (1 month)
- Since: `2025-10-01`, Until: `2025-10-27` (28 days)
- Since: `2025-01-01`, Until: `2025-12-31` (1 year)

#### Valid Team Slugs
- `engineering`
- `qa-team`
- `platform-engineering`
- `frontend-devs`

---

### Invalid Test Data

#### Invalid Organization Names
- `` (empty string)
- `   ` (whitespace only)
- `org with invalid chars!@#`

#### Invalid Tokens
- `` (empty)
- `abc123xyz` (wrong format)
- `token_invalid` (wrong prefix)
- `ghp_short` (too short)

#### Invalid Date Formats
- `10/01/2025` (MM/DD/YYYY)
- `2025/10/01` (slashes instead of dashes)
- `01-10-2025` (DD-MM-YYYY)
- `2025-13-01` (invalid month)
- `2025-02-30` (invalid day)
- `invalid` (non-date string)

#### Invalid Date Ranges
- Since: `2025-11-01`, Until: `2025-10-01` (since > until)
- Since: `2025-12-31`, Until: `2025-01-01` (reversed)

---

### Sample JSON Files for Upload Testing

#### Valid 28-Day Report JSON
```json
{
  "data": {
    "report_start_day": "2025-10-01",
    "report_end_day": "2025-10-27",
    "day_totals": [
      {
        "day": "2025-10-01",
        "total_active_users": 45,
        "total_engaged_users": 40,
        "copilot_ide_code_completions": {
          "total_engaged_users": 38
        },
        "copilot_ide_chat": {
          "total_engaged_users": 25
        },
        "copilot_dotcom_chat": {
          "total_engaged_users": 15
        },
        "copilot_dotcom_pull_requests": {
          "total_engaged_users": 10
        }
      }
    ]
  }
}
```

#### Invalid 28-Day Report JSON (missing day_totals)
```json
{
  "data": {
    "report_start_day": "2025-10-01",
    "report_end_day": "2025-10-27"
  }
}
```

#### Valid User 28-Day Report NDJSON
```
{"user_id":"12345","day":"2025-10-01","user_login":"user1","total_chat_turns":50,"total_chat_insertion_events":30,"total_pr_summaries_created":5}
{"user_id":"12345","day":"2025-10-02","user_login":"user1","total_chat_turns":45,"total_chat_insertion_events":25,"total_pr_summaries_created":3}
{"user_id":"67890","day":"2025-10-01","user_login":"user2","total_chat_turns":60,"total_chat_insertion_events":40,"total_pr_summaries_created":7}
```

#### Invalid User 28-Day Report (missing required fields)
```
{"user_id":"12345","user_login":"user1"}
{"day":"2025-10-01","user_login":"user2"}
```

---

## Test Execution Guidelines

### Pre-Test Setup
1. Clear browser cache and localStorage
2. Verify network connectivity
3. Prepare valid and invalid test credentials
4. Prepare sample JSON/NDJSON files
5. Document browser version and OS

### Test Execution Order
1. Start with positive test cases (happy paths)
2. Then execute negative test cases (error scenarios)
3. Then execute edge cases
4. Finally, execute security and performance tests

### Test Recording
- Record test execution date and time
- Note browser and version
- Capture screenshots of failures
- Save console logs for errors
- Document any deviations from expected results

### Pass/Fail Criteria
- **Pass:** All expected results achieved, no unexpected behavior
- **Fail:** Any expected result not achieved, or unexpected error occurs
- **Blocked:** Test cannot be executed due to dependency failure
- **Skipped:** Test intentionally not executed (with reason)

### Bug Reporting
When a test fails, report:
1. Test Case ID
2. Steps to reproduce
3. Expected result
4. Actual result
5. Screenshots/videos
6. Console errors
7. Network requests (if applicable)
8. Environment details

---

## Appendix

### API Endpoints Reference

#### Enterprise Metrics
```
GET /enterprises/{enterprise}/copilot/metrics
GET /enterprises/{enterprise}/team/{team_slug}/copilot/metrics
```

#### Enterprise Seats
```
GET /enterprises/{enterprise}/copilot/billing/seats
```

#### Enterprise 28-Day Report
```
GET /enterprises/{enterprise}/copilot/metrics/28d_report
```

#### Enterprise User 28-Day Report
```
GET /enterprises/{enterprise}/copilot/metrics/user/28d_report
```

#### Organization Metrics
```
GET /orgs/{org}/copilot/metrics
GET /orgs/{org}/teams/{team_slug}/copilot/metrics
```

#### Organization Seats
```
GET /orgs/{org}/copilot/billing/seats
```

---

### localStorage Keys Reference

| Key | Content | Type |
|-----|---------|------|
| `copilot_api_config` | API configuration (without token) | Object |
| `copilot_enterprise_metrics_data` | Enterprise metrics | Array |
| `copilot_enterprise_metrics_data_timestamp` | Timestamp | String (ISO) |
| `copilot_enterprise_seats_data` | Enterprise seats | Object |
| `copilot_enterprise_seats_data_timestamp` | Timestamp | String (ISO) |
| `enterprise_report_data` | 28-day report | Object |
| `enterprise_report_data_timestamp` | Timestamp | String (ISO) |
| `user_report_data` | User 28-day report | Object |
| `user_report_data_timestamp` | Timestamp | String (ISO) |
| `copilot_org_metrics_data` | Organization metrics | Array |
| `copilot_org_metrics_data_timestamp` | Timestamp | String (ISO) |
| `copilot_org_seats_data` | Organization seats | Object |
| `copilot_org_seats_data_timestamp` | Timestamp | String (ISO) |

---

### GitHub Token Scopes

| Scope | Description | Required For |
|-------|-------------|--------------|
| `manage_billing:copilot` | Access Copilot billing data | Enterprise/Org metrics and seats |
| `read:org` | Read organization data | Organization metrics |
| `read:enterprise` | Read enterprise data | Enterprise metrics |

---

### Troubleshooting Common Issues

#### Issue: "No Data Available"
**Cause:** Data not downloaded yet
**Solution:** Go to Admin page and download data

#### Issue: "401 Unauthorized"
**Cause:** Invalid/expired token
**Solution:** Generate new token with correct scopes

#### Issue: "403 Forbidden"
**Cause:** Insufficient permissions
**Solution:** Verify you're an org owner and have correct scopes

#### Issue: "404 Not Found"
**Cause:** Invalid org name or Copilot not enabled
**Solution:** Check org name and Copilot enablement

#### Issue: Demo Mode Active
**Cause:** `VITE_DEMO_MODE=true` in environment
**Solution:** Remove environment variable or set to `false`

---

**End of Document**

---

## Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | November 2025 | Test Documentation Team | Initial release |

---

## Feedback and Updates

For feedback or updates to this test guide, please contact the development team or create an issue in the project repository.
