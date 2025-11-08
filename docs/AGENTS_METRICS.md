# GitHub Copilot Agents Metrics

## Quick Start

### Downloading Agents Data

1. Navigate to **Admin** page in the dashboard
2. Configure your enterprise credentials:
   - Enterprise name
   - Personal Access Token (with required scopes)
   - Date range (optional)
3. Click **"Download Agents Data"** button
4. Data will be:
   - Saved to browser localStorage
   - Downloaded as JSON file: `copilot-agents-{enterprise}-{date}.json`

### API Endpoint

```
GET /enterprises/{enterprise}/copilot/agents
```

**Note**: This endpoint may be in beta or limited availability. If you receive a 404 error, the agents API may not be enabled for your enterprise yet.

## What You'll Get

### Agent Metrics Include:

- **Agent Information**
  - Slug (unique identifier)
  - Name and description
  - Publisher details
  - Installation count

- **Engagement Metrics**
  - Total users engaged with each agent
  - Total chat interactions
  - Code insertion events (suggestions used)
  - Code copy events (suggestions referenced)

- **Temporal Data**
  - Daily breakdown of metrics
  - Trend analysis over time

## Key Metrics to Watch

### 1. Agent Adoption Rate
**What it tells you**: How many users have discovered and installed agents

**Healthy signals:**
- ✅ Growing installation counts
- ✅ Multiple agents being installed
- ✅ Consistent week-over-week growth

**Warning signs:**
- ⚠️ Zero or very low installations
- ⚠️ Declining installation trends
- ⚠️ Single agent dominance

### 2. Agent Engagement
**What it tells you**: How actively users interact with agents

**Healthy signals:**
- ✅ 5+ chats per user per agent
- ✅ Daily consistent usage
- ✅ Growing chat counts

**Warning signs:**
- ⚠️ Installed but not used
- ⚠️ Declining chat interactions
- ⚠️ One-time usage patterns

### 3. Code Integration Rate
**What it tells you**: How often agent suggestions are actually used

**Calculation**: `(Insertion Events + Copy Events) / Total Chats`

**Healthy signals:**
- ✅ >40% integration rate
- ✅ High insertion events (direct use)
- ✅ Growing over time

**Warning signs:**
- ⚠️ <20% integration rate
- ⚠️ High chats but low insertions
- ⚠️ Copy events without insertions (reference only)

## Common Scenarios & Actions

### Scenario 1: No Agents Usage

**Possible Causes:**
- Users don't know agents exist
- Agents not discoverable in IDE
- No internal promotion

**Recommended Actions:**
1. Run agent discovery workshops
2. Create internal agent catalog
3. Send regular tips about agents
4. Share success stories

### Scenario 2: One Agent Dominates

**Possible Causes:**
- Other agents not well-promoted
- Default agent convenience
- Other agents unclear value

**Recommended Actions:**
1. Highlight underutilized agents
2. Create agent pairing guides
3. Show specific use cases per agent
4. Encourage exploration

### Scenario 3: High Chats, Low Insertions

**Possible Causes:**
- Agent suggestions not matching needs
- Quality concerns
- Code style mismatches

**Recommended Actions:**
1. Gather user feedback
2. Review agent configurations
3. Provide better prompting training
4. Check agent versions

### Scenario 4: Declining Usage

**Possible Causes:**
- Initial novelty wore off
- Not providing real value
- Workflow friction
- Better alternatives found

**Recommended Actions:**
1. Survey users about experience
2. Identify specific pain points
3. Provide advanced training
4. Review agent fit for workflows

## Data Structure

### JSON Format

```json
{
  "metadata": {
    "enterprise": "your-enterprise",
    "downloadedAt": "2025-11-07T10:30:00Z",
    "recordCount": 30,
    "dateRange": {
      "from": "2025-10-08",
      "to": "2025-11-06"
    }
  },
  "data": [
    {
      "date": "2025-11-06",
      "total_engaged_users": 45,
      "agents": [
        {
          "slug": "github-copilot-code-review",
          "name": "Code Review Assistant",
          "description": "Helps review code and suggest improvements",
          "created_at": "2024-01-15T00:00:00Z",
          "updated_at": "2025-10-01T00:00:00Z",
          "publisher": {
            "type": "organization",
            "name": "github"
          },
          "installation_count": 150,
          "total_engaged_users": 25,
          "total_chats": 120,
          "total_chat_insertion_events": 48,
          "total_chat_copy_events": 32
        }
      ]
    }
  ]
}
```

## Integration with Core Metrics

### Progressive Adoption Model

**Level 1: Code Completions** → Basic Copilot usage  
**Level 2: Chat Features** → Interactive AI assistance  
**Level 3: Agent Adoption** → Specialized workflow automation  
**Level 4: Agent Mastery** → Multi-agent workflows

### Holistic Dashboard View

Combine agents data with core metrics for complete picture:

1. **Acceptance Rate** (Core) + **Agent Integration Rate** (Agents)
   - Shows overall trust in AI suggestions

2. **WAU Ratio** (Core) + **Agent Engagement** (Agents)
   - Indicates depth of feature adoption

3. **Chat Usage** (Core) + **Agent Chat Interactions** (Agents)
   - Reveals advanced feature progression

4. **Week-over-Week Growth** (Core) + **Agent Installation Trends** (Agents)
   - Shows adoption momentum

## Enablement Roadmap

### Month 1: Introduction
- ✅ Demo agents to teams
- ✅ Provide quick-start guides
- ✅ Set baseline metrics
- 🎯 Goal: 20% of users try an agent

### Month 2: Exploration
- ✅ Share success stories
- ✅ Create use case documentation
- ✅ Encourage experimentation
- 🎯 Goal: 40% regular agent usage

### Month 3: Integration
- ✅ Document workflows with agents
- ✅ Measure productivity gains
- ✅ Optimize based on usage
- 🎯 Goal: 60%+ workflow integration

### Ongoing: Optimization
- ✅ Track KPIs continuously
- ✅ Introduce new agents
- ✅ Consider custom agents
- 🎯 Goal: Sustained high engagement

## Troubleshooting

### Error: 404 Not Found

**Cause**: Agents API endpoint not available

**Solutions:**
- Contact GitHub support to verify availability
- Check if your enterprise has agents enabled
- Endpoint may be in beta for your plan

### Error: 403 Forbidden

**Cause**: Insufficient permissions

**Solutions:**
- Verify you're an enterprise owner
- Check token has correct scopes:
  - `manage_billing:copilot`
  - `read:org`
  - `read:enterprise`

### No Data in Response

**Cause**: No agent usage in date range

**Solutions:**
- Extend date range
- Verify agents are installed
- Check if users have telemetry enabled
- Confirm agents visible in IDE

## Best Practices

### ✅ Do:
- Download both metrics and agents data regularly
- Compare trends across multiple weeks
- Segment by team when possible
- Combine with user surveys
- Share insights with leadership
- Celebrate adoption wins

### ❌ Don't:
- Compare teams without context
- React to single-day fluctuations
- Force agent adoption without training
- Ignore user feedback
- Focus only on installation counts
- Neglect enablement efforts

## Related Documentation

- **[Metrics Insights Guide](./METRICS_INSIGHTS.md)** - Comprehensive interpretation guide including agents section
- **[API Configuration](./API_CONFIGURATION.md)** - Setup and configuration details
- **[Debugging Guide](./DEBUGGING_API.md)** - Troubleshooting API issues
- **[Data Storage](./DATA_STORAGE.md)** - Understanding local data management

## Support

For questions about:
- **API access**: Contact GitHub Enterprise support
- **Dashboard usage**: See [README.md](../README.md)
- **Data interpretation**: Review [METRICS_INSIGHTS.md](./METRICS_INSIGHTS.md)
- **Configuration issues**: Check [DEBUGGING_API.md](./DEBUGGING_API.md)
