# Copilot Metrics Insights

## Overview

The dashboard now includes **Actionable Insights** based on [GitHub's official guidance for interpreting Copilot metrics](https://docs.github.com/en/copilot/reference/copilot-usage-metrics/interpret-copilot-metrics). These insights help you understand adoption patterns and identify opportunities to increase engagement across your enterprise.

## What's Included

### Insight Types

The dashboard displays context-aware insights in four categories:

1. **✅ Success** (Green) - Positive trends and healthy metrics
2. **⚠️ Warning** (Yellow) - Areas needing attention or declining trends  
3. **💡 Opportunity** (Purple) - Growth opportunities and optimization suggestions
4. **ℹ️ Info** (Blue) - General guidance and monitoring recommendations

### Key Metrics Analyzed

Based on GitHub's recommendations, the dashboard analyzes:

#### 1. **Acceptance Rate**
- **What it measures**: Percentage of suggestions accepted by developers
- **Healthy range**: 25% or higher
- **What it signals**:
  - Rising rate = Increasing trust and usefulness
  - Declining rate = Mismatched suggestions or workflow friction

#### 2. **Weekly Active User (WAU) Ratio**
- **What it measures**: Active users vs total licenses
- **Healthy range**: >60%
- **What it signals**:
  - High ratio = Strong ongoing usage
  - Low ratio = Configuration issues or enablement gaps

#### 3. **Week-over-Week Growth**
- **What it measures**: Change in daily active users
- **Healthy trend**: Sustained positive growth (>10%)
- **What it signals**:
  - Positive growth = Consistent engagement
  - Declining growth = Reduced interest or blockers

#### 4. **Chat Feature Adoption**
- **What it measures**: Chat usage per active user
- **Healthy range**: 5+ chats per user
- **What it signals**:
  - High usage = Progression beyond basic completions
  - Low usage = Lack of awareness of advanced features

#### 5. **Overall Engagement**
- **What it measures**: Suggestions per user
- **Healthy range**: 100+ suggestions per user
- **What it signals**: Active leveraging throughout workflow

## Recommendations

The insights section provides specific, actionable recommendations based on your data:

### High Adoption Scenarios
✅ **When metrics are strong:**
- Share success stories with other teams
- Document what's working well
- Maintain momentum with best practices

### Low Adoption Scenarios
⚠️ **When metrics need improvement:**
- Verify license assignment and IDE setup
- Offer team-level onboarding sessions
- Investigate blockers through feedback

### Feature Adoption Gaps
💡 **When advanced features are underutilized:**
- Share internal demos and success stories
- Highlight Chat and Agent capabilities
- Provide enablement sessions

### Declining Usage
⚠️ **When usage is dropping:**
- Check for configuration issues
- Verify IDE and extension versions
- Reach out to teams for feedback
- Address identified blockers quickly

## How to Use Insights

### For Copilot Administrators
1. **Review insights regularly** (weekly recommended)
2. **Combine with qualitative feedback** from developer surveys
3. **Act on warnings promptly** to prevent further decline
4. **Celebrate successes** to maintain momentum
5. **Share opportunities** with teams that could benefit

### For Team Leads
1. **Monitor team-specific trends** if data is available
2. **Address configuration issues** highlighted in warnings
3. **Promote advanced features** (Chat, Agent) to your team
4. **Gather feedback** to understand metrics context

### For Developers
1. **See how your usage compares** to enterprise averages
2. **Learn about advanced features** through recommendations
3. **Provide feedback** when suggestions aren't helpful
4. **Share your wins** to help others

## GitHub's Official Guidance

The insights are based on these official GitHub recommendations:

### Usage Trends Table
| Metric | What it Shows | What it Means |
|--------|---------------|---------------|
| **IDE Daily Active Users (DAU)** | Unique users who interacted with Copilot each day | Sustained DAU growth signals consistent engagement; sharp declines may indicate configuration issues or reduced interest |
| **IDE Weekly Active Users (WAU)** | Unique users active over a 7-day rolling window | A healthy WAU-to-license ratio (>60%) indicates strong ongoing usage |
| **Code Completions Acceptance Rate** | Percentage of suggestions accepted | A rising rate suggests increasing trust and usefulness; a drop may point to mismatched suggestions or workflow friction |

### Feature Adoption Guidance
| Issue | Possible Cause | Recommendation |
|-------|----------------|----------------|
| **High adoption in some teams but low in others** | Some teams may not have Copilot Chat enabled or configured correctly | Verify license assignment and IDE setup; offer team-level onboarding |
| **Steady usage but low agent adoption** | Developers may not be aware of Copilot agent features | Share internal demos or success stories |
| **Drop in DAU or acceptance rate** | Configuration issues or reduced relevance of suggestions | Encourage feedback and verify IDE and extension versions |

## Where to Find Insights

### Demo Dashboard (`/demo/overview`)
- Shows insights based on mock data
- Great for understanding what to expect
- Use for demos and training

### Live Dashboard (`/live/overview`)
- Shows insights based on your real GitHub data
- Updates with your actual metrics
- Use for actual monitoring and decision-making

## Customization

The insights component (`src/components/MetricsInsights.tsx`) is fully customizable:

```typescript
<MetricsInsights
  acceptanceRate={25.5}           // Percentage (0-100)
  activeUsers={45}                // Number of weekly active users
  totalUsers={100}                // Total licenses/seats
  suggestionCount={150000}        // Total suggestions in period
  weekOverWeekGrowth={15.3}       // Percentage change
  chatUsage={2250}                // Total chat interactions
/>
```

## Best Practices

### Regular Review Cadence
- **Daily**: Quick check of live dashboard for anomalies
- **Weekly**: Deep dive into trends and insights
- **Monthly**: Strategic review with leadership
- **Quarterly**: Compare against goals and adjust strategy

### Combining Data Sources
✅ **Do:**
- Combine dashboard insights with developer surveys
- Cross-reference with productivity metrics
- Gather qualitative feedback through retrospectives
- Use multiple data points for decisions

❌ **Don't:**
- Make decisions based solely on quantitative data
- Ignore context from team feedback
- Compare teams without considering differences
- Rush to conclusions from short-term fluctuations

### Taking Action
1. **Prioritize warnings** - Address declining metrics first
2. **Celebrate wins** - Share success stories internally
3. **Experiment and iterate** - Try different enablement approaches
4. **Measure impact** - Track changes after interventions
5. **Be patient** - Cultural change takes time

## Additional Resources

- **GitHub Official Guide**: [Interpreting Copilot Metrics](https://docs.github.com/en/copilot/reference/copilot-usage-metrics/interpret-copilot-metrics)
- **Dashboard Documentation**: [README.md](../README.md)
- **API Configuration**: [API_CONFIGURATION.md](./API_CONFIGURATION.md)
- **Debugging Guide**: [DEBUGGING_API.md](./DEBUGGING_API.md)

---

## Copilot Agents Metrics

### Overview

GitHub Copilot Agents represent the next evolution of AI-assisted development, providing specialized assistance for specific tasks and workflows. The dashboard now includes support for tracking Copilot Agents adoption and usage across your enterprise.

### What Are Copilot Agents?

Copilot Agents are specialized AI assistants that can:
- Perform specific development tasks (e.g., code reviews, documentation, testing)
- Integrate with external tools and services
- Provide domain-specific expertise
- Automate complex workflows
- Extend Copilot's capabilities beyond code completion

### Agents API Endpoint

**Endpoint**: `GET /enterprises/{enterprise}/copilot/agents`

This endpoint provides comprehensive metrics about agent usage, including:
- **Agent Identification**: Name, slug, description, publisher information
- **Engagement Metrics**: Total engaged users per agent
- **Interaction Metrics**: Total chats, insertion events, copy events
- **Adoption Trends**: Installation counts and usage over time
- **Temporal Data**: Daily breakdown of agent usage

### Key Agents Metrics

#### 1. **Agent Adoption Rate**
- **What it measures**: Percentage of users who have installed and used agents
- **Why it matters**: Indicates awareness and willingness to explore advanced features
- **Healthy range**: Growing installation count with active usage

#### 2. **Agent Engagement**
- **What it measures**: Number of users actively interacting with agents
- **What it signals**:
  - High engagement = Agents solving real problems
  - Low engagement = Need for better enablement or agent discovery

#### 3. **Chat Interactions**
- **What it measures**: Total conversations with agents
- **Why it matters**: Shows depth of agent utilization
- **Considerations**: More chats = users finding value in agent assistance

#### 4. **Code Integration Events**
- **What it measures**: 
  - **Insertion events**: Code directly inserted from agent suggestions
  - **Copy events**: Code copied from agent responses
- **Why it matters**: Indicates practical value and code quality
- **Healthy pattern**: High insertion rate shows trust in agent suggestions

#### 5. **Agent Diversity**
- **What it measures**: Variety of agents being used
- **What it signals**:
  - Wide variety = Healthy exploration and diverse needs
  - Single agent dominance = Potential opportunity to promote others
  - No usage = Enablement gap or discovery problem

### Interpreting Agents Data

#### Strong Agent Adoption Signals
✅ **Growing installation counts** across multiple agents  
✅ **High chat interaction rates** (5+ chats per user per agent)  
✅ **Increasing code insertion events** (users trusting agent suggestions)  
✅ **Diverse agent usage** (multiple agents seeing activity)  
✅ **Consistent daily engagement** (agents integrated into workflows)

#### Low Agent Adoption Signals
⚠️ **Low or zero installations** despite availability  
⚠️ **Installed but not used** (installations without interactions)  
⚠️ **High chat but low insertions** (suggestions not valuable)  
⚠️ **Single agent dominance** (users unaware of other options)  
⚠️ **Declining usage over time** (initial interest fading)

### Agents Insights & Recommendations

#### When Agents Adoption is Low

**Possible Causes:**
- Developers unaware that agents exist
- Lack of understanding of agent capabilities
- Poor agent discoverability in IDE
- Unclear value proposition
- No internal examples or success stories

**Recommendations:**
1. **Run Agent Discovery Sessions**
   - Demo each available agent's capabilities
   - Show real-world use cases
   - Provide hands-on exploration time

2. **Create Internal Documentation**
   - Agent catalog with descriptions
   - Use case examples specific to your tech stack
   - Step-by-step setup guides

3. **Promote Success Stories**
   - Share examples of time saved
   - Highlight quality improvements
   - Document productivity gains

4. **Improve Discoverability**
   - Ensure agents are visible in IDE
   - Send periodic reminders about available agents
   - Include agent tips in team communications

#### When Agent Usage is High but Insertions are Low

**Possible Causes:**
- Agent suggestions not matching code style
- Suggestions not fitting specific requirements
- Quality concerns with agent-generated code
- Users treating agents as reference only

**Recommendations:**
1. **Gather User Feedback**
   - Survey why suggestions aren't being accepted
   - Identify patterns in rejected suggestions
   - Understand specific pain points

2. **Review Agent Configuration**
   - Ensure agents have proper context
   - Check if custom models might help
   - Verify agent versions are up-to-date

3. **Provide Training**
   - Show how to give agents better prompts
   - Demonstrate effective agent interactions
   - Share tips for getting better results

#### When Single Agent Dominates

**Possible Causes:**
- Other agents not well-promoted
- Specific workflow heavily relies on one agent
- Other agents not perceived as valuable
- Default agent used without exploration

**Recommendations:**
1. **Promote Underutilized Agents**
   - Highlight specific use cases for each agent
   - Create targeted demos for specific teams
   - Show complementary agent usage patterns

2. **Create Agent Pairing Guides**
   - Document which agents work well together
   - Show workflow examples using multiple agents
   - Encourage experimentation

### Agents Data in Dashboard

#### Downloading Agents Data

1. Navigate to **Admin** page (`/admin`)
2. Configure your enterprise credentials
3. Click **"Download Agents Data"** button
4. Data saved to localStorage and downloaded as JSON file
5. File includes:
   - Daily metrics for all agents
   - Engagement statistics
   - Interaction counts
   - Adoption trends

#### Data Storage

**LocalStorage Key**: `copilot_agents_data`

**File Format**: `copilot-agents-{enterprise}-{date}.json`

**Data Structure**:
```json
{
  "metadata": {
    "enterprise": "your-enterprise",
    "downloadedAt": "2025-11-07T...",
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
          "slug": "code-review-agent",
          "name": "Code Review Assistant",
          "description": "Automated code review suggestions",
          "total_engaged_users": 25,
          "total_chats": 120,
          "total_chat_insertion_events": 45,
          "total_chat_copy_events": 30,
          "publisher": {
            "type": "organization",
            "name": "your-org"
          }
        }
      ]
    }
  ]
}
```

### Combining Metrics and Agents Data

#### Holistic Analysis

To get a complete picture of Copilot adoption:

1. **Review Core Metrics First**
   - Acceptance rates
   - Active user counts
   - Chat feature usage

2. **Layer in Agents Data**
   - Agent adoption rates
   - Specialized workflow usage
   - Advanced feature engagement

3. **Identify Patterns**
   - Do high-performing teams use more agents?
   - Are certain roles adopting agents faster?
   - Which agents correlate with higher productivity?

#### Progressive Adoption Model

**Stage 1: Code Completions**
- Focus: Basic suggestions and completions
- Metrics: Acceptance rate, active users

**Stage 2: Chat Features**
- Focus: Interactive problem-solving
- Metrics: Chat usage, WAU ratio

**Stage 3: Agent Adoption**
- Focus: Specialized, workflow-integrated AI
- Metrics: Agent installations, engagement, code integrations

**Stage 4: Agent Mastery**
- Focus: Multi-agent workflows, custom agents
- Metrics: Agent diversity, high insertion rates, sustained engagement

### Best Practices for Agents Enablement

#### Phased Rollout

1. **Phase 1: Awareness** (Week 1-2)
   - Introduce concept of agents
   - Demo 1-2 most valuable agents
   - Provide quick-start guides

2. **Phase 2: Exploration** (Week 3-4)
   - Encourage hands-on experimentation
   - Share early success stories
   - Gather initial feedback

3. **Phase 3: Integration** (Week 5-8)
   - Document workflows using agents
   - Create team-specific use cases
   - Track adoption metrics

4. **Phase 4: Optimization** (Week 9+)
   - Refine based on usage patterns
   - Introduce additional agents
   - Develop custom agents if needed

#### Success Metrics Timeline

**Month 1:**
- 20% of Copilot users have tried at least one agent
- 3+ different agents showing usage
- Positive qualitative feedback

**Month 2:**
- 40% of Copilot users regularly using agents
- 10+ agents in rotation
- Measurable productivity improvements

**Month 3:**
- 60%+ of Copilot users integrated agents into workflows
- High code insertion rates (>40%)
- Request for additional/custom agents

### Troubleshooting Agents Issues

#### No Agents Data Available

**Possible Causes:**
- Agents API endpoint not yet available for your enterprise
- API endpoint in beta/limited availability
- Insufficient permissions
- Agents feature not enabled

**Solutions:**
- Verify with GitHub support about agents API availability
- Ensure enterprise has agents feature enabled
- Check token has correct permissions
- Review API response for specific error messages

#### Agents Showing Zero Usage

**Investigation Steps:**
1. Verify agents are installed and visible in IDE
2. Check if agents require additional configuration
3. Confirm users know agents exist
4. Review any error logs from agent interactions
5. Test agents yourself to verify functionality

#### High Variability in Agent Metrics

**This is Normal When:**
- Different teams have different workflows
- Certain agents are specialized for specific tasks
- Usage follows sprint/project cycles
- Teams in different adoption stages

**Action Items:**
- Segment data by team if possible
- Look at trends rather than daily numbers
- Compare week-over-week instead of day-to-day
- Focus on overall trajectory

## Support

If you have questions about interpreting your specific metrics:
1. Review this guide and GitHub's official documentation
2. Compare your trends to the benchmarks provided
3. Gather feedback from your development teams
4. Reach out to GitHub Support for enterprise-specific guidance
