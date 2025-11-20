// Demo PR data for demonstration purposes - spanning 4+ months
export const demoPRData = {
  owner: 'demo-org',
  name: 'sample-project',
  fetchedAt: new Date().toISOString(),
  count: 150,
  pullRequests: [
    // Recent Open PRs
    {
      id: 1001,
      number: 45,
      title: 'Add user authentication flow',
      state: 'open' as const,
      user: {
        login: 'sarah-dev',
        avatar_url: 'https://avatars.githubusercontent.com/u/1?v=4'
      },
      created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      closed_at: null,
      merged_at: null,
      draft: false
    },
    {
      id: 1002,
      number: 44,
      title: 'Update dependencies and fix security vulnerabilities',
      state: 'open' as const,
      user: {
        login: 'dependabot[bot]',
        avatar_url: 'https://avatars.githubusercontent.com/u/2?v=4'
      },
      created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      closed_at: null,
      merged_at: null,
      draft: false
    },
    {
      id: 1003,
      number: 43,
      title: 'WIP: Refactor dashboard components',
      state: 'open' as const,
      user: {
        login: 'mike-designer',
        avatar_url: 'https://avatars.githubusercontent.com/u/3?v=4'
      },
      created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      closed_at: null,
      merged_at: null,
      draft: true
    },
    {
      id: 1004,
      number: 42,
      title: 'Add comprehensive test coverage for API endpoints',
      state: 'open' as const,
      user: {
        login: 'Copilot',
        avatar_url: 'https://avatars.githubusercontent.com/u/4?v=4'
      },
      created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      closed_at: null,
      merged_at: null,
      draft: false
    },
    // Recent Merged PRs (This Week)
    {
      id: 1005,
      number: 41,
      title: 'Fix navigation menu responsiveness',
      state: 'closed' as const,
      user: {
        login: 'sarah-dev',
        avatar_url: 'https://avatars.githubusercontent.com/u/1?v=4'
      },
      created_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      closed_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      merged_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      draft: false
    },
    {
      id: 1006,
      number: 40,
      title: 'Implement dark mode toggle',
      state: 'closed' as const,
      user: {
        login: 'alex-frontend',
        avatar_url: 'https://avatars.githubusercontent.com/u/5?v=4'
      },
      created_at: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      closed_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      merged_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      draft: false
    },
    {
      id: 1007,
      number: 39,
      title: 'Add loading states to all async operations',
      state: 'closed' as const,
      user: {
        login: 'Copilot',
        avatar_url: 'https://avatars.githubusercontent.com/u/4?v=4'
      },
      created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      closed_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      merged_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      draft: false
    },
    // Last Week Merged PRs
    {
      id: 1008,
      number: 38,
      title: 'Optimize database queries',
      state: 'closed' as const,
      user: {
        login: 'db-admin',
        avatar_url: 'https://avatars.githubusercontent.com/u/6?v=4'
      },
      created_at: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
      closed_at: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
      merged_at: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
      draft: false
    },
    {
      id: 1009,
      number: 37,
      title: 'Update API documentation',
      state: 'closed' as const,
      user: {
        login: 'tech-writer-bot',
        avatar_url: 'https://avatars.githubusercontent.com/u/7?v=4'
      },
      created_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
      closed_at: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
      merged_at: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
      draft: false
    },
    {
      id: 1010,
      number: 36,
      title: 'Add error boundary components',
      state: 'closed' as const,
      user: {
        login: 'sarah-dev',
        avatar_url: 'https://avatars.githubusercontent.com/u/1?v=4'
      },
      created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      closed_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      merged_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      draft: false
    },
    // Last Month PRs
    {
      id: 1011,
      number: 35,
      title: 'Implement caching strategy',
      state: 'closed' as const,
      user: {
        login: 'performance-team',
        avatar_url: 'https://avatars.githubusercontent.com/u/8?v=4'
      },
      created_at: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
      closed_at: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
      merged_at: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
      draft: false
    },
    {
      id: 1012,
      number: 34,
      title: 'Security audit fixes',
      state: 'closed' as const,
      user: {
        login: 'security-bot',
        avatar_url: 'https://avatars.githubusercontent.com/u/9?v=4'
      },
      created_at: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 22 * 24 * 60 * 60 * 1000).toISOString(),
      closed_at: new Date(Date.now() - 22 * 24 * 60 * 60 * 1000).toISOString(),
      merged_at: new Date(Date.now() - 22 * 24 * 60 * 60 * 1000).toISOString(),
      draft: false
    },
    {
      id: 1013,
      number: 33,
      title: 'Redesign landing page',
      state: 'closed' as const,
      user: {
        login: 'mike-designer',
        avatar_url: 'https://avatars.githubusercontent.com/u/3?v=4'
      },
      created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
      closed_at: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
      merged_at: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
      draft: false
    },
    {
      id: 1014,
      number: 32,
      title: 'Add email notifications',
      state: 'closed' as const,
      user: {
        login: 'alex-frontend',
        avatar_url: 'https://avatars.githubusercontent.com/u/5?v=4'
      },
      created_at: new Date(Date.now() - 32 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 27 * 24 * 60 * 60 * 1000).toISOString(),
      closed_at: new Date(Date.now() - 27 * 24 * 60 * 60 * 1000).toISOString(),
      merged_at: new Date(Date.now() - 27 * 24 * 60 * 60 * 1000).toISOString(),
      draft: false
    },
    // Older PRs (2 months ago)
    {
      id: 1015,
      number: 31,
      title: 'Migrate to TypeScript',
      state: 'closed' as const,
      user: {
        login: 'sarah-dev',
        avatar_url: 'https://avatars.githubusercontent.com/u/1?v=4'
      },
      created_at: new Date(Date.now() - 55 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 50 * 24 * 60 * 60 * 1000).toISOString(),
      closed_at: new Date(Date.now() - 50 * 24 * 60 * 60 * 1000).toISOString(),
      merged_at: new Date(Date.now() - 50 * 24 * 60 * 60 * 1000).toISOString(),
      draft: false
    },
    {
      id: 1016,
      number: 30,
      title: 'Setup CI/CD pipeline',
      state: 'closed' as const,
      user: {
        login: 'devops-engineer',
        avatar_url: 'https://avatars.githubusercontent.com/u/10?v=4'
      },
      created_at: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 55 * 24 * 60 * 60 * 1000).toISOString(),
      closed_at: new Date(Date.now() - 55 * 24 * 60 * 60 * 1000).toISOString(),
      merged_at: new Date(Date.now() - 55 * 24 * 60 * 60 * 1000).toISOString(),
      draft: false
    },
    {
      id: 1017,
      number: 29,
      title: 'Implement user roles and permissions',
      state: 'closed' as const,
      user: {
        login: 'Copilot',
        avatar_url: 'https://avatars.githubusercontent.com/u/4?v=4'
      },
      created_at: new Date(Date.now() - 65 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
      closed_at: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
      merged_at: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
      draft: false
    },
    // Some closed but not merged PRs
    {
      id: 1018,
      number: 28,
      title: 'Experimental feature - WebRTC integration',
      state: 'closed' as const,
      user: {
        login: 'alex-frontend',
        avatar_url: 'https://avatars.githubusercontent.com/u/5?v=4'
      },
      created_at: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      closed_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      merged_at: null,
      draft: false
    },
    {
      id: 1019,
      number: 27,
      title: 'Alternative navigation approach',
      state: 'closed' as const,
      user: {
        login: 'mike-designer',
        avatar_url: 'https://avatars.githubusercontent.com/u/3?v=4'
      },
      created_at: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      closed_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      merged_at: null,
      draft: false
    },
    // Additional PRs for richer data
    {
      id: 1020,
      number: 26,
      title: 'Add monitoring and alerting',
      state: 'closed' as const,
      user: {
        login: 'devops-engineer',
        avatar_url: 'https://avatars.githubusercontent.com/u/10?v=4'
      },
      created_at: new Date(Date.now() - 70 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 65 * 24 * 60 * 60 * 1000).toISOString(),
      closed_at: new Date(Date.now() - 65 * 24 * 60 * 60 * 1000).toISOString(),
      merged_at: new Date(Date.now() - 65 * 24 * 60 * 60 * 1000).toISOString(),
      draft: false
    },
    {
      id: 1021,
      number: 25,
      title: 'Performance improvements for large datasets',
      state: 'closed' as const,
      user: {
        login: 'performance-team',
        avatar_url: 'https://avatars.githubusercontent.com/u/8?v=4'
      },
      created_at: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString(),
      closed_at: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString(),
      merged_at: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString(),
      draft: false
    },
    {
      id: 1022,
      number: 24,
      title: 'Add internationalization support',
      state: 'closed' as const,
      user: {
        login: 'sarah-dev',
        avatar_url: 'https://avatars.githubusercontent.com/u/1?v=4'
      },
      created_at: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString(),
      closed_at: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString(),
      merged_at: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString(),
      draft: false
    },
    {
      id: 1023,
      number: 23,
      title: 'Refactor authentication module',
      state: 'closed' as const,
      user: {
        login: 'security-bot',
        avatar_url: 'https://avatars.githubusercontent.com/u/9?v=4'
      },
      created_at: new Date(Date.now() - 48 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 43 * 24 * 60 * 60 * 1000).toISOString(),
      closed_at: new Date(Date.now() - 43 * 24 * 60 * 60 * 1000).toISOString(),
      merged_at: new Date(Date.now() - 43 * 24 * 60 * 60 * 1000).toISOString(),
      draft: false
    },
    {
      id: 1024,
      number: 22,
      title: 'Update UI component library',
      state: 'closed' as const,
      user: {
        login: 'dependabot[bot]',
        avatar_url: 'https://avatars.githubusercontent.com/u/2?v=4'
      },
      created_at: new Date(Date.now() - 50 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
      closed_at: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
      merged_at: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
      draft: false
    },
    {
      id: 1025,
      number: 21,
      title: 'Add webhook integrations',
      state: 'closed' as const,
      user: {
        login: 'Copilot',
        avatar_url: 'https://avatars.githubusercontent.com/u/4?v=4'
      },
      created_at: new Date(Date.now() - 52 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 47 * 24 * 60 * 60 * 1000).toISOString(),
      closed_at: new Date(Date.now() - 47 * 24 * 60 * 60 * 1000).toISOString(),
      merged_at: new Date(Date.now() - 47 * 24 * 60 * 60 * 1000).toISOString(),
      draft: false
    },
    // Month 2 (Days 53-70)
    {
      id: 1026,
      number: 20,
      title: 'Implement dark mode toggle',
      state: 'closed' as const,
      user: {
        login: 'alex-frontend',
        avatar_url: 'https://avatars.githubusercontent.com/u/5?v=4'
      },
      created_at: new Date(Date.now() - 55 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 50 * 24 * 60 * 60 * 1000).toISOString(),
      closed_at: new Date(Date.now() - 50 * 24 * 60 * 60 * 1000).toISOString(),
      merged_at: new Date(Date.now() - 50 * 24 * 60 * 60 * 1000).toISOString(),
      draft: false
    },
    {
      id: 1027,
      number: 19,
      title: 'Fix memory leaks in chart components',
      state: 'closed' as const,
      user: {
        login: 'performance-team',
        avatar_url: 'https://avatars.githubusercontent.com/u/8?v=4'
      },
      created_at: new Date(Date.now() - 57 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 52 * 24 * 60 * 60 * 1000).toISOString(),
      closed_at: new Date(Date.now() - 52 * 24 * 60 * 60 * 1000).toISOString(),
      merged_at: new Date(Date.now() - 52 * 24 * 60 * 60 * 1000).toISOString(),
      draft: false
    },
    {
      id: 1028,
      number: 18,
      title: 'Add export to CSV functionality',
      state: 'closed' as const,
      user: {
        login: 'sarah-dev',
        avatar_url: 'https://avatars.githubusercontent.com/u/1?v=4'
      },
      created_at: new Date(Date.now() - 59 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 54 * 24 * 60 * 60 * 1000).toISOString(),
      closed_at: new Date(Date.now() - 54 * 24 * 60 * 60 * 1000).toISOString(),
      merged_at: new Date(Date.now() - 54 * 24 * 60 * 60 * 1000).toISOString(),
      draft: false
    },
    {
      id: 1029,
      number: 17,
      title: 'Update API documentation',
      state: 'closed' as const,
      user: {
        login: 'tech-writer-bot',
        avatar_url: 'https://avatars.githubusercontent.com/u/7?v=4'
      },
      created_at: new Date(Date.now() - 61 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 56 * 24 * 60 * 60 * 1000).toISOString(),
      closed_at: new Date(Date.now() - 56 * 24 * 60 * 60 * 1000).toISOString(),
      merged_at: new Date(Date.now() - 56 * 24 * 60 * 60 * 1000).toISOString(),
      draft: false
    },
    {
      id: 1030,
      number: 16,
      title: 'Improve error handling in API calls',
      state: 'closed' as const,
      user: {
        login: 'mike-designer',
        avatar_url: 'https://avatars.githubusercontent.com/u/3?v=4'
      },
      created_at: new Date(Date.now() - 63 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 58 * 24 * 60 * 60 * 1000).toISOString(),
      closed_at: new Date(Date.now() - 58 * 24 * 60 * 60 * 1000).toISOString(),
      merged_at: new Date(Date.now() - 58 * 24 * 60 * 60 * 1000).toISOString(),
      draft: false
    },
    {
      id: 1031,
      number: 15,
      title: 'Add pagination to data tables',
      state: 'closed' as const,
      user: {
        login: 'alex-frontend',
        avatar_url: 'https://avatars.githubusercontent.com/u/5?v=4'
      },
      created_at: new Date(Date.now() - 65 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
      closed_at: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
      merged_at: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
      draft: false
    },
    {
      id: 1032,
      number: 14,
      title: 'Security: Update crypto dependencies',
      state: 'closed' as const,
      user: {
        login: 'security-bot',
        avatar_url: 'https://avatars.githubusercontent.com/u/9?v=4'
      },
      created_at: new Date(Date.now() - 67 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 62 * 24 * 60 * 60 * 1000).toISOString(),
      closed_at: new Date(Date.now() - 62 * 24 * 60 * 60 * 1000).toISOString(),
      merged_at: new Date(Date.now() - 62 * 24 * 60 * 60 * 1000).toISOString(),
      draft: false
    },
    {
      id: 1033,
      number: 13,
      title: 'Optimize database queries',
      state: 'closed' as const,
      user: {
        login: 'db-admin',
        avatar_url: 'https://avatars.githubusercontent.com/u/10?v=4'
      },
      created_at: new Date(Date.now() - 69 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 64 * 24 * 60 * 60 * 1000).toISOString(),
      closed_at: new Date(Date.now() - 64 * 24 * 60 * 60 * 1000).toISOString(),
      merged_at: new Date(Date.now() - 64 * 24 * 60 * 60 * 1000).toISOString(),
      draft: false
    },
    {
      id: 1034,
      number: 12,
      title: 'Add email notification system',
      state: 'closed' as const,
      user: {
        login: 'sarah-dev',
        avatar_url: 'https://avatars.githubusercontent.com/u/1?v=4'
      },
      created_at: new Date(Date.now() - 70 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 66 * 24 * 60 * 60 * 1000).toISOString(),
      closed_at: new Date(Date.now() - 66 * 24 * 60 * 60 * 1000).toISOString(),
      merged_at: new Date(Date.now() - 66 * 24 * 60 * 60 * 1000).toISOString(),
      draft: false
    },
    {
      id: 1035,
      number: 11,
      title: 'Implement rate limiting',
      state: 'closed' as const,
      user: {
        login: 'devops-engineer',
        avatar_url: 'https://avatars.githubusercontent.com/u/11?v=4'
      },
      created_at: new Date(Date.now() - 72 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 67 * 24 * 60 * 60 * 1000).toISOString(),
      closed_at: new Date(Date.now() - 67 * 24 * 60 * 60 * 1000).toISOString(),
      merged_at: new Date(Date.now() - 67 * 24 * 60 * 60 * 1000).toISOString(),
      draft: false
    },
    {
      id: 1036,
      number: 10,
      title: 'Add user role management',
      state: 'closed' as const,
      user: {
        login: 'mike-designer',
        avatar_url: 'https://avatars.githubusercontent.com/u/3?v=4'
      },
      created_at: new Date(Date.now() - 74 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 69 * 24 * 60 * 60 * 1000).toISOString(),
      closed_at: new Date(Date.now() - 69 * 24 * 60 * 60 * 1000).toISOString(),
      merged_at: new Date(Date.now() - 69 * 24 * 60 * 60 * 1000).toISOString(),
      draft: false
    },
    {
      id: 1037,
      number: 9,
      title: 'Fix responsive layout issues',
      state: 'closed' as const,
      user: {
        login: 'alex-frontend',
        avatar_url: 'https://avatars.githubusercontent.com/u/5?v=4'
      },
      created_at: new Date(Date.now() - 76 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 71 * 24 * 60 * 60 * 1000).toISOString(),
      closed_at: new Date(Date.now() - 71 * 24 * 60 * 60 * 1000).toISOString(),
      merged_at: new Date(Date.now() - 71 * 24 * 60 * 60 * 1000).toISOString(),
      draft: false
    },
    {
      id: 1038,
      number: 8,
      title: 'Update NPM packages',
      state: 'closed' as const,
      user: {
        login: 'dependabot[bot]',
        avatar_url: 'https://avatars.githubusercontent.com/u/2?v=4'
      },
      created_at: new Date(Date.now() - 78 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 73 * 24 * 60 * 60 * 1000).toISOString(),
      closed_at: new Date(Date.now() - 73 * 24 * 60 * 60 * 1000).toISOString(),
      merged_at: new Date(Date.now() - 73 * 24 * 60 * 60 * 1000).toISOString(),
      draft: false
    },
    {
      id: 1039,
      number: 7,
      title: 'Add loading skeletons',
      state: 'closed' as const,
      user: {
        login: 'alex-frontend',
        avatar_url: 'https://avatars.githubusercontent.com/u/5?v=4'
      },
      created_at: new Date(Date.now() - 80 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 75 * 24 * 60 * 60 * 1000).toISOString(),
      closed_at: new Date(Date.now() - 75 * 24 * 60 * 60 * 1000).toISOString(),
      merged_at: new Date(Date.now() - 75 * 24 * 60 * 60 * 1000).toISOString(),
      draft: false
    },
    {
      id: 1040,
      number: 6,
      title: 'Implement caching strategy',
      state: 'closed' as const,
      user: {
        login: 'performance-team',
        avatar_url: 'https://avatars.githubusercontent.com/u/8?v=4'
      },
      created_at: new Date(Date.now() - 82 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 77 * 24 * 60 * 60 * 1000).toISOString(),
      closed_at: new Date(Date.now() - 77 * 24 * 60 * 60 * 1000).toISOString(),
      merged_at: new Date(Date.now() - 77 * 24 * 60 * 60 * 1000).toISOString(),
      draft: false
    },
    {
      id: 1041,
      number: 5,
      title: 'Add comprehensive logging',
      state: 'closed' as const,
      user: {
        login: 'devops-engineer',
        avatar_url: 'https://avatars.githubusercontent.com/u/11?v=4'
      },
      created_at: new Date(Date.now() - 84 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 79 * 24 * 60 * 60 * 1000).toISOString(),
      closed_at: new Date(Date.now() - 79 * 24 * 60 * 60 * 1000).toISOString(),
      merged_at: new Date(Date.now() - 79 * 24 * 60 * 60 * 1000).toISOString(),
      draft: false
    },
    {
      id: 1042,
      number: 4,
      title: 'Refactor API endpoints',
      state: 'closed' as const,
      user: {
        login: 'sarah-dev',
        avatar_url: 'https://avatars.githubusercontent.com/u/1?v=4'
      },
      created_at: new Date(Date.now() - 86 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 81 * 24 * 60 * 60 * 1000).toISOString(),
      closed_at: new Date(Date.now() - 81 * 24 * 60 * 60 * 1000).toISOString(),
      merged_at: new Date(Date.now() - 81 * 24 * 60 * 60 * 1000).toISOString(),
      draft: false
    },
    {
      id: 1043,
      number: 3,
      title: 'Add integration tests',
      state: 'closed' as const,
      user: {
        login: 'Copilot',
        avatar_url: 'https://avatars.githubusercontent.com/u/4?v=4'
      },
      created_at: new Date(Date.now() - 88 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 83 * 24 * 60 * 60 * 1000).toISOString(),
      closed_at: new Date(Date.now() - 83 * 24 * 60 * 60 * 1000).toISOString(),
      merged_at: new Date(Date.now() - 83 * 24 * 60 * 60 * 1000).toISOString(),
      draft: false
    },
    {
      id: 1044,
      number: 2,
      title: 'Update README with setup instructions',
      state: 'closed' as const,
      user: {
        login: 'tech-writer-bot',
        avatar_url: 'https://avatars.githubusercontent.com/u/7?v=4'
      },
      created_at: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 85 * 24 * 60 * 60 * 1000).toISOString(),
      closed_at: new Date(Date.now() - 85 * 24 * 60 * 60 * 1000).toISOString(),
      merged_at: new Date(Date.now() - 85 * 24 * 60 * 60 * 1000).toISOString(),
      draft: false
    },
    {
      id: 1045,
      number: 1,
      title: 'Initial project setup',
      state: 'closed' as const,
      user: {
        login: 'sarah-dev',
        avatar_url: 'https://avatars.githubusercontent.com/u/1?v=4'
      },
      created_at: new Date(Date.now() - 92 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 87 * 24 * 60 * 60 * 1000).toISOString(),
      closed_at: new Date(Date.now() - 87 * 24 * 60 * 60 * 1000).toISOString(),
      merged_at: new Date(Date.now() - 87 * 24 * 60 * 60 * 1000).toISOString(),
      draft: false
    },
    // Month 3+ (Days 93-150) - Additional PRs for comprehensive data
    {
      id: 1046,
      number: 101,
      title: 'Add GraphQL API support',
      state: 'closed' as const,
      user: {
        login: 'api-dev',
        avatar_url: 'https://avatars.githubusercontent.com/u/12?v=4'
      },
      created_at: new Date(Date.now() - 95 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
      closed_at: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
      merged_at: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
      draft: false
    },
    {
      id: 1047,
      number: 100,
      title: 'Implement WebSocket real-time updates',
      state: 'closed' as const,
      user: {
        login: 'backend-guru',
        avatar_url: 'https://avatars.githubusercontent.com/u/13?v=4'
      },
      created_at: new Date(Date.now() - 98 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 93 * 24 * 60 * 60 * 1000).toISOString(),
      closed_at: new Date(Date.now() - 93 * 24 * 60 * 60 * 1000).toISOString(),
      merged_at: new Date(Date.now() - 93 * 24 * 60 * 60 * 1000).toISOString(),
      draft: false
    },
    {
      id: 1048,
      number: 99,
      title: 'Add automated backup system',
      state: 'closed' as const,
      user: {
        login: 'devops-engineer',
        avatar_url: 'https://avatars.githubusercontent.com/u/11?v=4'
      },
      created_at: new Date(Date.now() - 100 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 95 * 24 * 60 * 60 * 1000).toISOString(),
      closed_at: new Date(Date.now() - 95 * 24 * 60 * 60 * 1000).toISOString(),
      merged_at: new Date(Date.now() - 95 * 24 * 60 * 60 * 1000).toISOString(),
      draft: false
    },
    {
      id: 1049,
      number: 98,
      title: 'Migrate to microservices architecture',
      state: 'closed' as const,
      user: {
        login: 'architect-lead',
        avatar_url: 'https://avatars.githubusercontent.com/u/14?v=4'
      },
      created_at: new Date(Date.now() - 103 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 98 * 24 * 60 * 60 * 1000).toISOString(),
      closed_at: new Date(Date.now() - 98 * 24 * 60 * 60 * 1000).toISOString(),
      merged_at: new Date(Date.now() - 98 * 24 * 60 * 60 * 1000).toISOString(),
      draft: false
    },
    {
      id: 1050,
      number: 97,
      title: 'Add Redis caching layer',
      state: 'closed' as const,
      user: {
        login: 'performance-team',
        avatar_url: 'https://avatars.githubusercontent.com/u/8?v=4'
      },
      created_at: new Date(Date.now() - 105 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 100 * 24 * 60 * 60 * 1000).toISOString(),
      closed_at: new Date(Date.now() - 100 * 24 * 60 * 60 * 1000).toISOString(),
      merged_at: new Date(Date.now() - 100 * 24 * 60 * 60 * 1000).toISOString(),
      draft: false
    },
    {
      id: 1051,
      number: 96,
      title: 'Implement OAuth2 authentication',
      state: 'closed' as const,
      user: {
        login: 'security-bot',
        avatar_url: 'https://avatars.githubusercontent.com/u/9?v=4'
      },
      created_at: new Date(Date.now() - 107 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 102 * 24 * 60 * 60 * 1000).toISOString(),
      closed_at: new Date(Date.now() - 102 * 24 * 60 * 60 * 1000).toISOString(),
      merged_at: new Date(Date.now() - 102 * 24 * 60 * 60 * 1000).toISOString(),
      draft: false
    },
    {
      id: 1052,
      number: 95,
      title: 'Add image optimization pipeline',
      state: 'closed' as const,
      user: {
        login: 'frontend-wizard',
        avatar_url: 'https://avatars.githubusercontent.com/u/15?v=4'
      },
      created_at: new Date(Date.now() - 110 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 105 * 24 * 60 * 60 * 1000).toISOString(),
      closed_at: new Date(Date.now() - 105 * 24 * 60 * 60 * 1000).toISOString(),
      merged_at: new Date(Date.now() - 105 * 24 * 60 * 60 * 1000).toISOString(),
      draft: false
    },
    {
      id: 1053,
      number: 94,
      title: 'Setup Docker containerization',
      state: 'closed' as const,
      user: {
        login: 'devops-engineer',
        avatar_url: 'https://avatars.githubusercontent.com/u/11?v=4'
      },
      created_at: new Date(Date.now() - 112 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 107 * 24 * 60 * 60 * 1000).toISOString(),
      closed_at: new Date(Date.now() - 107 * 24 * 60 * 60 * 1000).toISOString(),
      merged_at: new Date(Date.now() - 107 * 24 * 60 * 60 * 1000).toISOString(),
      draft: false
    },
    {
      id: 1054,
      number: 93,
      title: 'Add analytics dashboard',
      state: 'closed' as const,
      user: {
        login: 'data-analyst',
        avatar_url: 'https://avatars.githubusercontent.com/u/16?v=4'
      },
      created_at: new Date(Date.now() - 115 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 110 * 24 * 60 * 60 * 1000).toISOString(),
      closed_at: new Date(Date.now() - 110 * 24 * 60 * 60 * 1000).toISOString(),
      merged_at: new Date(Date.now() - 110 * 24 * 60 * 60 * 1000).toISOString(),
      draft: false
    },
    {
      id: 1055,
      number: 92,
      title: 'Implement server-side rendering',
      state: 'closed' as const,
      user: {
        login: 'alex-frontend',
        avatar_url: 'https://avatars.githubusercontent.com/u/5?v=4'
      },
      created_at: new Date(Date.now() - 117 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 112 * 24 * 60 * 60 * 1000).toISOString(),
      closed_at: new Date(Date.now() - 112 * 24 * 60 * 60 * 1000).toISOString(),
      merged_at: new Date(Date.now() - 112 * 24 * 60 * 60 * 1000).toISOString(),
      draft: false
    },
    {
      id: 1056,
      number: 91,
      title: 'Add payment gateway integration',
      state: 'closed' as const,
      user: {
        login: 'payment-specialist',
        avatar_url: 'https://avatars.githubusercontent.com/u/17?v=4'
      },
      created_at: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 115 * 24 * 60 * 60 * 1000).toISOString(),
      closed_at: new Date(Date.now() - 115 * 24 * 60 * 60 * 1000).toISOString(),
      merged_at: new Date(Date.now() - 115 * 24 * 60 * 60 * 1000).toISOString(),
      draft: false
    },
    {
      id: 1057,
      number: 90,
      title: 'Implement advanced search functionality',
      state: 'closed' as const,
      user: {
        login: 'search-engineer',
        avatar_url: 'https://avatars.githubusercontent.com/u/18?v=4'
      },
      created_at: new Date(Date.now() - 122 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 117 * 24 * 60 * 60 * 1000).toISOString(),
      closed_at: new Date(Date.now() - 117 * 24 * 60 * 60 * 1000).toISOString(),
      merged_at: new Date(Date.now() - 117 * 24 * 60 * 60 * 1000).toISOString(),
      draft: false
    },
    {
      id: 1058,
      number: 89,
      title: 'Add multi-language support',
      state: 'closed' as const,
      user: {
        login: 'i18n-team',
        avatar_url: 'https://avatars.githubusercontent.com/u/19?v=4'
      },
      created_at: new Date(Date.now() - 125 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString(),
      closed_at: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString(),
      merged_at: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString(),
      draft: false
    },
    {
      id: 1059,
      number: 88,
      title: 'Setup Kubernetes orchestration',
      state: 'closed' as const,
      user: {
        login: 'devops-engineer',
        avatar_url: 'https://avatars.githubusercontent.com/u/11?v=4'
      },
      created_at: new Date(Date.now() - 127 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 122 * 24 * 60 * 60 * 1000).toISOString(),
      closed_at: new Date(Date.now() - 122 * 24 * 60 * 60 * 1000).toISOString(),
      merged_at: new Date(Date.now() - 122 * 24 * 60 * 60 * 1000).toISOString(),
      draft: false
    },
    {
      id: 1060,
      number: 87,
      title: 'Add comprehensive E2E tests',
      state: 'closed' as const,
      user: {
        login: 'qa-automation',
        avatar_url: 'https://avatars.githubusercontent.com/u/20?v=4'
      },
      created_at: new Date(Date.now() - 130 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 125 * 24 * 60 * 60 * 1000).toISOString(),
      closed_at: new Date(Date.now() - 125 * 24 * 60 * 60 * 1000).toISOString(),
      merged_at: new Date(Date.now() - 125 * 24 * 60 * 60 * 1000).toISOString(),
      draft: false
    },
    {
      id: 1061,
      number: 86,
      title: 'Implement progressive web app features',
      state: 'closed' as const,
      user: {
        login: 'pwa-specialist',
        avatar_url: 'https://avatars.githubusercontent.com/u/21?v=4'
      },
      created_at: new Date(Date.now() - 132 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 127 * 24 * 60 * 60 * 1000).toISOString(),
      closed_at: new Date(Date.now() - 127 * 24 * 60 * 60 * 1000).toISOString(),
      merged_at: new Date(Date.now() - 127 * 24 * 60 * 60 * 1000).toISOString(),
      draft: false
    },
    {
      id: 1062,
      number: 85,
      title: 'Add push notification system',
      state: 'closed' as const,
      user: {
        login: 'notification-dev',
        avatar_url: 'https://avatars.githubusercontent.com/u/22?v=4'
      },
      created_at: new Date(Date.now() - 135 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 130 * 24 * 60 * 60 * 1000).toISOString(),
      closed_at: new Date(Date.now() - 130 * 24 * 60 * 60 * 1000).toISOString(),
      merged_at: new Date(Date.now() - 130 * 24 * 60 * 60 * 1000).toISOString(),
      draft: false
    },
    {
      id: 1063,
      number: 84,
      title: 'Implement data encryption at rest',
      state: 'closed' as const,
      user: {
        login: 'security-bot',
        avatar_url: 'https://avatars.githubusercontent.com/u/9?v=4'
      },
      created_at: new Date(Date.now() - 137 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 132 * 24 * 60 * 60 * 1000).toISOString(),
      closed_at: new Date(Date.now() - 132 * 24 * 60 * 60 * 1000).toISOString(),
      merged_at: new Date(Date.now() - 132 * 24 * 60 * 60 * 1000).toISOString(),
      draft: false
    },
    {
      id: 1064,
      number: 83,
      title: 'Add real-time collaboration features',
      state: 'closed' as const,
      user: {
        login: 'collab-dev',
        avatar_url: 'https://avatars.githubusercontent.com/u/23?v=4'
      },
      created_at: new Date(Date.now() - 140 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 135 * 24 * 60 * 60 * 1000).toISOString(),
      closed_at: new Date(Date.now() - 135 * 24 * 60 * 60 * 1000).toISOString(),
      merged_at: new Date(Date.now() - 135 * 24 * 60 * 60 * 1000).toISOString(),
      draft: false
    },
    {
      id: 1065,
      number: 82,
      title: 'Setup CDN for static assets',
      state: 'closed' as const,
      user: {
        login: 'devops-engineer',
        avatar_url: 'https://avatars.githubusercontent.com/u/11?v=4'
      },
      created_at: new Date(Date.now() - 142 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 137 * 24 * 60 * 60 * 1000).toISOString(),
      closed_at: new Date(Date.now() - 137 * 24 * 60 * 60 * 1000).toISOString(),
      merged_at: new Date(Date.now() - 137 * 24 * 60 * 60 * 1000).toISOString(),
      draft: false
    },
    {
      id: 1066,
      number: 81,
      title: 'Add automated performance testing',
      state: 'closed' as const,
      user: {
        login: 'performance-team',
        avatar_url: 'https://avatars.githubusercontent.com/u/8?v=4'
      },
      created_at: new Date(Date.now() - 145 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 140 * 24 * 60 * 60 * 1000).toISOString(),
      closed_at: new Date(Date.now() - 140 * 24 * 60 * 60 * 1000).toISOString(),
      merged_at: new Date(Date.now() - 140 * 24 * 60 * 60 * 1000).toISOString(),
      draft: false
    },
    {
      id: 1067,
      number: 80,
      title: 'Implement feature flags system',
      state: 'closed' as const,
      user: {
        login: 'feature-flag-admin',
        avatar_url: 'https://avatars.githubusercontent.com/u/24?v=4'
      },
      created_at: new Date(Date.now() - 147 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 142 * 24 * 60 * 60 * 1000).toISOString(),
      closed_at: new Date(Date.now() - 142 * 24 * 60 * 60 * 1000).toISOString(),
      merged_at: new Date(Date.now() - 142 * 24 * 60 * 60 * 1000).toISOString(),
      draft: false
    },
    {
      id: 1068,
      number: 79,
      title: 'Add admin dashboard',
      state: 'closed' as const,
      user: {
        login: 'admin-panel-dev',
        avatar_url: 'https://avatars.githubusercontent.com/u/25?v=4'
      },
      created_at: new Date(Date.now() - 150 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 145 * 24 * 60 * 60 * 1000).toISOString(),
      closed_at: new Date(Date.now() - 145 * 24 * 60 * 60 * 1000).toISOString(),
      merged_at: new Date(Date.now() - 145 * 24 * 60 * 60 * 1000).toISOString(),
      draft: false
    },
    // Additional bot PRs
    {
      id: 1069,
      number: 78,
      title: 'Bump webpack from 5.88.0 to 5.89.0',
      state: 'closed' as const,
      user: {
        login: 'dependabot[bot]',
        avatar_url: 'https://avatars.githubusercontent.com/u/2?v=4'
      },
      created_at: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 17 * 24 * 60 * 60 * 1000).toISOString(),
      closed_at: new Date(Date.now() - 17 * 24 * 60 * 60 * 1000).toISOString(),
      merged_at: new Date(Date.now() - 17 * 24 * 60 * 60 * 1000).toISOString(),
      draft: false
    },
    {
      id: 1070,
      number: 77,
      title: 'Bump axios from 1.6.0 to 1.6.2',
      state: 'closed' as const,
      user: {
        login: 'dependabot[bot]',
        avatar_url: 'https://avatars.githubusercontent.com/u/2?v=4'
      },
      created_at: new Date(Date.now() - 23 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 22 * 24 * 60 * 60 * 1000).toISOString(),
      closed_at: new Date(Date.now() - 22 * 24 * 60 * 60 * 1000).toISOString(),
      merged_at: new Date(Date.now() - 22 * 24 * 60 * 60 * 1000).toISOString(),
      draft: false
    },
    {
      id: 1071,
      number: 76,
      title: 'Update ESLint configuration',
      state: 'closed' as const,
      user: {
        login: 'renovate[bot]',
        avatar_url: 'https://avatars.githubusercontent.com/u/26?v=4'
      },
      created_at: new Date(Date.now() - 38 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 37 * 24 * 60 * 60 * 1000).toISOString(),
      closed_at: new Date(Date.now() - 37 * 24 * 60 * 60 * 1000).toISOString(),
      merged_at: new Date(Date.now() - 37 * 24 * 60 * 60 * 1000).toISOString(),
      draft: false
    },
    {
      id: 1072,
      number: 75,
      title: 'Copilot: Optimize render performance',
      state: 'closed' as const,
      user: {
        login: 'Copilot',
        avatar_url: 'https://avatars.githubusercontent.com/u/4?v=4'
      },
      created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
      closed_at: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
      merged_at: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
      draft: false
    },
    {
      id: 1073,
      number: 74,
      title: 'Copilot: Add input validation helpers',
      state: 'closed' as const,
      user: {
        login: 'Copilot',
        avatar_url: 'https://avatars.githubusercontent.com/u/4?v=4'
      },
      created_at: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      closed_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      merged_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      draft: false
    },
    {
      id: 1074,
      number: 73,
      title: 'Bump react-router-dom to v6.20.0',
      state: 'closed' as const,
      user: {
        login: 'renovate[bot]',
        avatar_url: 'https://avatars.githubusercontent.com/u/26?v=4'
      },
      created_at: new Date(Date.now() - 42 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 41 * 24 * 60 * 60 * 1000).toISOString(),
      closed_at: new Date(Date.now() - 41 * 24 * 60 * 60 * 1000).toISOString(),
      merged_at: new Date(Date.now() - 41 * 24 * 60 * 60 * 1000).toISOString(),
      draft: false
    },
    {
      id: 1075,
      number: 72,
      title: 'Security: Update crypto-js dependency',
      state: 'closed' as const,
      user: {
        login: 'dependabot[bot]',
        avatar_url: 'https://avatars.githubusercontent.com/u/2?v=4'
      },
      created_at: new Date(Date.now() - 58 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 57 * 24 * 60 * 60 * 1000).toISOString(),
      closed_at: new Date(Date.now() - 57 * 24 * 60 * 60 * 1000).toISOString(),
      merged_at: new Date(Date.now() - 57 * 24 * 60 * 60 * 1000).toISOString(),
      draft: false
    },
    // Week 1 (Days 1-7) - Adding more recent activity
    {
      id: 1076,
      number: 71,
      title: 'Fix button alignment on mobile',
      state: 'closed' as const,
      user: {
        login: 'mobile-dev',
        avatar_url: 'https://avatars.githubusercontent.com/u/27?v=4'
      },
      created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      closed_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      merged_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      draft: false
    },
    {
      id: 1077,
      number: 70,
      title: 'Update documentation for new API endpoints',
      state: 'closed' as const,
      user: {
        login: 'tech-writer-bot',
        avatar_url: 'https://avatars.githubusercontent.com/u/7?v=4'
      },
      created_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      closed_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      merged_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      draft: false
    },
    {
      id: 1078,
      number: 69,
      title: 'Add retry logic for failed API calls',
      state: 'closed' as const,
      user: {
        login: 'backend-guru',
        avatar_url: 'https://avatars.githubusercontent.com/u/13?v=4'
      },
      created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
      closed_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
      merged_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
      draft: false
    },
    {
      id: 1079,
      number: 68,
      title: 'Improve form validation messages',
      state: 'closed' as const,
      user: {
        login: 'ux-designer',
        avatar_url: 'https://avatars.githubusercontent.com/u/28?v=4'
      },
      created_at: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      closed_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      merged_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      draft: false
    },
    {
      id: 1080,
      number: 67,
      title: 'Add unit tests for authentication module',
      state: 'closed' as const,
      user: {
        login: 'qa-automation',
        avatar_url: 'https://avatars.githubusercontent.com/u/20?v=4'
      },
      created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
      closed_at: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
      merged_at: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
      draft: false
    },
    // Week 2 (Days 8-14) - More activity
    {
      id: 1081,
      number: 66,
      title: 'Refactor state management',
      state: 'closed' as const,
      user: {
        login: 'alex-frontend',
        avatar_url: 'https://avatars.githubusercontent.com/u/5?v=4'
      },
      created_at: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
      closed_at: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
      merged_at: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
      draft: false
    },
    {
      id: 1082,
      number: 65,
      title: 'Add accessibility improvements',
      state: 'closed' as const,
      user: {
        login: 'a11y-specialist',
        avatar_url: 'https://avatars.githubusercontent.com/u/29?v=4'
      },
      created_at: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      closed_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      merged_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      draft: false
    },
    {
      id: 1083,
      number: 64,
      title: 'Fix memory leak in data fetching',
      state: 'closed' as const,
      user: {
        login: 'performance-team',
        avatar_url: 'https://avatars.githubusercontent.com/u/8?v=4'
      },
      created_at: new Date(Date.now() - 13 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000).toISOString(),
      closed_at: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000).toISOString(),
      merged_at: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000).toISOString(),
      draft: false
    },
    {
      id: 1084,
      number: 63,
      title: 'Update dependency: lodash to v4.17.21',
      state: 'closed' as const,
      user: {
        login: 'renovate[bot]',
        avatar_url: 'https://avatars.githubusercontent.com/u/26?v=4'
      },
      created_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
      closed_at: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
      merged_at: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
      draft: false
    },
    // Week 3 (Days 15-21) - Steady progress
    {
      id: 1085,
      number: 62,
      title: 'Implement lazy loading for images',
      state: 'closed' as const,
      user: {
        login: 'frontend-wizard',
        avatar_url: 'https://avatars.githubusercontent.com/u/15?v=4'
      },
      created_at: new Date(Date.now() - 17 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      closed_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      merged_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      draft: false
    },
    {
      id: 1086,
      number: 61,
      title: 'Add custom hooks for data fetching',
      state: 'closed' as const,
      user: {
        login: 'sarah-dev',
        avatar_url: 'https://avatars.githubusercontent.com/u/1?v=4'
      },
      created_at: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 16 * 24 * 60 * 60 * 1000).toISOString(),
      closed_at: new Date(Date.now() - 16 * 24 * 60 * 60 * 1000).toISOString(),
      merged_at: new Date(Date.now() - 16 * 24 * 60 * 60 * 1000).toISOString(),
      draft: false
    },
    {
      id: 1087,
      number: 60,
      title: 'Fix timezone display issues',
      state: 'closed' as const,
      user: {
        login: 'datetime-expert',
        avatar_url: 'https://avatars.githubusercontent.com/u/30?v=4'
      },
      created_at: new Date(Date.now() - 19 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 17 * 24 * 60 * 60 * 1000).toISOString(),
      closed_at: new Date(Date.now() - 17 * 24 * 60 * 60 * 1000).toISOString(),
      merged_at: new Date(Date.now() - 17 * 24 * 60 * 60 * 1000).toISOString(),
      draft: false
    },
    {
      id: 1088,
      number: 59,
      title: 'Add CSV export functionality',
      state: 'closed' as const,
      user: {
        login: 'data-analyst',
        avatar_url: 'https://avatars.githubusercontent.com/u/16?v=4'
      },
      created_at: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString(),
      closed_at: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString(),
      merged_at: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString(),
      draft: false
    },
    {
      id: 1089,
      number: 58,
      title: 'Optimize SQL queries',
      state: 'closed' as const,
      user: {
        login: 'db-admin',
        avatar_url: 'https://avatars.githubusercontent.com/u/6?v=4'
      },
      created_at: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 19 * 24 * 60 * 60 * 1000).toISOString(),
      closed_at: new Date(Date.now() - 19 * 24 * 60 * 60 * 1000).toISOString(),
      merged_at: new Date(Date.now() - 19 * 24 * 60 * 60 * 1000).toISOString(),
      draft: false
    },
    // Week 4 (Days 22-28) - Month 1 wrap-up
    {
      id: 1090,
      number: 57,
      title: 'Add filter functionality to dashboard',
      state: 'closed' as const,
      user: {
        login: 'mike-designer',
        avatar_url: 'https://avatars.githubusercontent.com/u/3?v=4'
      },
      created_at: new Date(Date.now() - 24 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 22 * 24 * 60 * 60 * 1000).toISOString(),
      closed_at: new Date(Date.now() - 22 * 24 * 60 * 60 * 1000).toISOString(),
      merged_at: new Date(Date.now() - 22 * 24 * 60 * 60 * 1000).toISOString(),
      draft: false
    },
    {
      id: 1091,
      number: 56,
      title: 'Implement session management',
      state: 'closed' as const,
      user: {
        login: 'security-bot',
        avatar_url: 'https://avatars.githubusercontent.com/u/9?v=4'
      },
      created_at: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 23 * 24 * 60 * 60 * 1000).toISOString(),
      closed_at: new Date(Date.now() - 23 * 24 * 60 * 60 * 1000).toISOString(),
      merged_at: new Date(Date.now() - 23 * 24 * 60 * 60 * 1000).toISOString(),
      draft: false
    },
    {
      id: 1092,
      number: 55,
      title: 'Add tooltip components',
      state: 'closed' as const,
      user: {
        login: 'ui-library-team',
        avatar_url: 'https://avatars.githubusercontent.com/u/31?v=4'
      },
      created_at: new Date(Date.now() - 26 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 24 * 24 * 60 * 60 * 1000).toISOString(),
      closed_at: new Date(Date.now() - 24 * 24 * 60 * 60 * 1000).toISOString(),
      merged_at: new Date(Date.now() - 24 * 24 * 60 * 60 * 1000).toISOString(),
      draft: false
    },
    {
      id: 1093,
      number: 54,
      title: 'Fix cross-browser compatibility issues',
      state: 'closed' as const,
      user: {
        login: 'browser-tester',
        avatar_url: 'https://avatars.githubusercontent.com/u/32?v=4'
      },
      created_at: new Date(Date.now() - 27 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
      closed_at: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
      merged_at: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
      draft: false
    },
    {
      id: 1094,
      number: 53,
      title: 'Update React to v18.3.0',
      state: 'closed' as const,
      user: {
        login: 'dependabot[bot]',
        avatar_url: 'https://avatars.githubusercontent.com/u/2?v=4'
      },
      created_at: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 26 * 24 * 60 * 60 * 1000).toISOString(),
      closed_at: new Date(Date.now() - 26 * 24 * 60 * 60 * 1000).toISOString(),
      merged_at: new Date(Date.now() - 26 * 24 * 60 * 60 * 1000).toISOString(),
      draft: false
    },
    // Week 5 (Days 29-35) - Month 2 begins
    {
      id: 1095,
      number: 52,
      title: 'Add pagination to list views',
      state: 'closed' as const,
      user: {
        login: 'frontend-wizard',
        avatar_url: 'https://avatars.githubusercontent.com/u/15?v=4'
      },
      created_at: new Date(Date.now() - 31 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 29 * 24 * 60 * 60 * 1000).toISOString(),
      closed_at: new Date(Date.now() - 29 * 24 * 60 * 60 * 1000).toISOString(),
      merged_at: new Date(Date.now() - 29 * 24 * 60 * 60 * 1000).toISOString(),
      draft: false
    },
    {
      id: 1096,
      number: 51,
      title: 'Implement search autocomplete',
      state: 'closed' as const,
      user: {
        login: 'search-engineer',
        avatar_url: 'https://avatars.githubusercontent.com/u/18?v=4'
      },
      created_at: new Date(Date.now() - 32 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      closed_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      merged_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      draft: false
    },
    {
      id: 1097,
      number: 50,
      title: 'Add breadcrumb navigation',
      state: 'closed' as const,
      user: {
        login: 'ux-designer',
        avatar_url: 'https://avatars.githubusercontent.com/u/28?v=4'
      },
      created_at: new Date(Date.now() - 33 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 31 * 24 * 60 * 60 * 1000).toISOString(),
      closed_at: new Date(Date.now() - 31 * 24 * 60 * 60 * 1000).toISOString(),
      merged_at: new Date(Date.now() - 31 * 24 * 60 * 60 * 1000).toISOString(),
      draft: false
    },
    {
      id: 1098,
      number: 49,
      title: 'Fix API rate limiting',
      state: 'closed' as const,
      user: {
        login: 'backend-guru',
        avatar_url: 'https://avatars.githubusercontent.com/u/13?v=4'
      },
      created_at: new Date(Date.now() - 34 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 32 * 24 * 60 * 60 * 1000).toISOString(),
      closed_at: new Date(Date.now() - 32 * 24 * 60 * 60 * 1000).toISOString(),
      merged_at: new Date(Date.now() - 32 * 24 * 60 * 60 * 1000).toISOString(),
      draft: false
    },
    {
      id: 1099,
      number: 48,
      title: 'Add code splitting for better performance',
      state: 'closed' as const,
      user: {
        login: 'performance-team',
        avatar_url: 'https://avatars.githubusercontent.com/u/8?v=4'
      },
      created_at: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 33 * 24 * 60 * 60 * 1000).toISOString(),
      closed_at: new Date(Date.now() - 33 * 24 * 60 * 60 * 1000).toISOString(),
      merged_at: new Date(Date.now() - 33 * 24 * 60 * 60 * 1000).toISOString(),
      draft: false
    },
    // Week 6 (Days 36-42)
    {
      id: 1100,
      number: 47,
      title: 'Implement drag and drop functionality',
      state: 'closed' as const,
      user: {
        login: 'interaction-dev',
        avatar_url: 'https://avatars.githubusercontent.com/u/33?v=4'
      },
      created_at: new Date(Date.now() - 38 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 36 * 24 * 60 * 60 * 1000).toISOString(),
      closed_at: new Date(Date.now() - 36 * 24 * 60 * 60 * 1000).toISOString(),
      merged_at: new Date(Date.now() - 36 * 24 * 60 * 60 * 1000).toISOString(),
      draft: false
    },
    {
      id: 1101,
      number: 46,
      title: 'Add keyboard shortcuts',
      state: 'closed' as const,
      user: {
        login: 'a11y-specialist',
        avatar_url: 'https://avatars.githubusercontent.com/u/29?v=4'
      },
      created_at: new Date(Date.now() - 39 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 37 * 24 * 60 * 60 * 1000).toISOString(),
      closed_at: new Date(Date.now() - 37 * 24 * 60 * 60 * 1000).toISOString(),
      merged_at: new Date(Date.now() - 37 * 24 * 60 * 60 * 1000).toISOString(),
      draft: false
    },
    {
      id: 1102,
      number: 45,
      title: 'Fix form submission race condition',
      state: 'closed' as const,
      user: {
        login: 'sarah-dev',
        avatar_url: 'https://avatars.githubusercontent.com/u/1?v=4'
      },
      created_at: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 38 * 24 * 60 * 60 * 1000).toISOString(),
      closed_at: new Date(Date.now() - 38 * 24 * 60 * 60 * 1000).toISOString(),
      merged_at: new Date(Date.now() - 38 * 24 * 60 * 60 * 1000).toISOString(),
      draft: false
    },
    {
      id: 1103,
      number: 44,
      title: 'Update TypeScript to v5.3.0',
      state: 'closed' as const,
      user: {
        login: 'renovate[bot]',
        avatar_url: 'https://avatars.githubusercontent.com/u/26?v=4'
      },
      created_at: new Date(Date.now() - 41 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 39 * 24 * 60 * 60 * 1000).toISOString(),
      closed_at: new Date(Date.now() - 39 * 24 * 60 * 60 * 1000).toISOString(),
      merged_at: new Date(Date.now() - 39 * 24 * 60 * 60 * 1000).toISOString(),
      draft: false
    },
    {
      id: 1104,
      number: 43,
      title: 'Add modal dialog components',
      state: 'closed' as const,
      user: {
        login: 'ui-library-team',
        avatar_url: 'https://avatars.githubusercontent.com/u/31?v=4'
      },
      created_at: new Date(Date.now() - 42 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString(),
      closed_at: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString(),
      merged_at: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString(),
      draft: false
    },
    // Week 7 (Days 43-49)
    {
      id: 1105,
      number: 42,
      title: 'Implement infinite scroll',
      state: 'closed' as const,
      user: {
        login: 'alex-frontend',
        avatar_url: 'https://avatars.githubusercontent.com/u/5?v=4'
      },
      created_at: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 43 * 24 * 60 * 60 * 1000).toISOString(),
      closed_at: new Date(Date.now() - 43 * 24 * 60 * 60 * 1000).toISOString(),
      merged_at: new Date(Date.now() - 43 * 24 * 60 * 60 * 1000).toISOString(),
      draft: false
    },
    {
      id: 1106,
      number: 41,
      title: 'Add file upload progress indicator',
      state: 'closed' as const,
      user: {
        login: 'upload-specialist',
        avatar_url: 'https://avatars.githubusercontent.com/u/34?v=4'
      },
      created_at: new Date(Date.now() - 46 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 44 * 24 * 60 * 60 * 1000).toISOString(),
      closed_at: new Date(Date.now() - 44 * 24 * 60 * 60 * 1000).toISOString(),
      merged_at: new Date(Date.now() - 44 * 24 * 60 * 60 * 1000).toISOString(),
      draft: false
    },
    {
      id: 1107,
      number: 40,
      title: 'Optimize bundle size',
      state: 'closed' as const,
      user: {
        login: 'performance-team',
        avatar_url: 'https://avatars.githubusercontent.com/u/8?v=4'
      },
      created_at: new Date(Date.now() - 47 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
      closed_at: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
      merged_at: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
      draft: false
    },
    {
      id: 1108,
      number: 39,
      title: 'Add ARIA labels for screen readers',
      state: 'closed' as const,
      user: {
        login: 'a11y-specialist',
        avatar_url: 'https://avatars.githubusercontent.com/u/29?v=4'
      },
      created_at: new Date(Date.now() - 48 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 46 * 24 * 60 * 60 * 1000).toISOString(),
      closed_at: new Date(Date.now() - 46 * 24 * 60 * 60 * 1000).toISOString(),
      merged_at: new Date(Date.now() - 46 * 24 * 60 * 60 * 1000).toISOString(),
      draft: false
    },
    {
      id: 1109,
      number: 38,
      title: 'Fix date picker localization',
      state: 'closed' as const,
      user: {
        login: 'i18n-team',
        avatar_url: 'https://avatars.githubusercontent.com/u/19?v=4'
      },
      created_at: new Date(Date.now() - 49 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 47 * 24 * 60 * 60 * 1000).toISOString(),
      closed_at: new Date(Date.now() - 47 * 24 * 60 * 60 * 1000).toISOString(),
      merged_at: new Date(Date.now() - 47 * 24 * 60 * 60 * 1000).toISOString(),
      draft: false
    },
    // Week 8 (Days 50-56) - Month 2 continues
    {
      id: 1110,
      number: 37,
      title: 'Implement virtual scrolling',
      state: 'closed' as const,
      user: {
        login: 'performance-team',
        avatar_url: 'https://avatars.githubusercontent.com/u/8?v=4'
      },
      created_at: new Date(Date.now() - 52 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 50 * 24 * 60 * 60 * 1000).toISOString(),
      closed_at: new Date(Date.now() - 50 * 24 * 60 * 60 * 1000).toISOString(),
      merged_at: new Date(Date.now() - 50 * 24 * 60 * 60 * 1000).toISOString(),
      draft: false
    },
    {
      id: 1111,
      number: 36,
      title: 'Add context menu functionality',
      state: 'closed' as const,
      user: {
        login: 'interaction-dev',
        avatar_url: 'https://avatars.githubusercontent.com/u/33?v=4'
      },
      created_at: new Date(Date.now() - 53 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 51 * 24 * 60 * 60 * 1000).toISOString(),
      closed_at: new Date(Date.now() - 51 * 24 * 60 * 60 * 1000).toISOString(),
      merged_at: new Date(Date.now() - 51 * 24 * 60 * 60 * 1000).toISOString(),
      draft: false
    },
    {
      id: 1112,
      number: 35,
      title: 'Fix SSR hydration mismatch',
      state: 'closed' as const,
      user: {
        login: 'backend-guru',
        avatar_url: 'https://avatars.githubusercontent.com/u/13?v=4'
      },
      created_at: new Date(Date.now() - 54 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 52 * 24 * 60 * 60 * 1000).toISOString(),
      closed_at: new Date(Date.now() - 52 * 24 * 60 * 60 * 1000).toISOString(),
      merged_at: new Date(Date.now() - 52 * 24 * 60 * 60 * 1000).toISOString(),
      draft: false
    },
    {
      id: 1113,
      number: 34,
      title: 'Bump vite from 5.0.0 to 5.0.5',
      state: 'closed' as const,
      user: {
        login: 'dependabot[bot]',
        avatar_url: 'https://avatars.githubusercontent.com/u/2?v=4'
      },
      created_at: new Date(Date.now() - 55 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 53 * 24 * 60 * 60 * 1000).toISOString(),
      closed_at: new Date(Date.now() - 53 * 24 * 60 * 60 * 1000).toISOString(),
      merged_at: new Date(Date.now() - 53 * 24 * 60 * 60 * 1000).toISOString(),
      draft: false
    },
    {
      id: 1114,
      number: 33,
      title: 'Add snackbar notification system',
      state: 'closed' as const,
      user: {
        login: 'notification-dev',
        avatar_url: 'https://avatars.githubusercontent.com/u/22?v=4'
      },
      created_at: new Date(Date.now() - 56 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 54 * 24 * 60 * 60 * 1000).toISOString(),
      closed_at: new Date(Date.now() - 54 * 24 * 60 * 60 * 1000).toISOString(),
      merged_at: new Date(Date.now() - 54 * 24 * 60 * 60 * 1000).toISOString(),
      draft: false
    }
  ]
}
