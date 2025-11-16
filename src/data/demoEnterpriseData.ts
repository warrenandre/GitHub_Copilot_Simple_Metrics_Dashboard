// Demo data for Enterprise metrics - restructured to match live API format
// Structure: editors -> models -> languages

const generateLanguageData = (baseMultiplier: number) => {
  return [
    { name: 'JavaScript', total_code_suggestions: Math.round(3885 * baseMultiplier), total_code_acceptances: Math.round(1088 * baseMultiplier), total_code_lines_suggested: Math.round(31080 * baseMultiplier), total_code_lines_accepted: Math.round(8704 * baseMultiplier), total_engaged_users: Math.round(62 * baseMultiplier) },
    { name: 'Python', total_code_suggestions: Math.round(3438 * baseMultiplier), total_code_acceptances: Math.round(962 * baseMultiplier), total_code_lines_suggested: Math.round(27504 * baseMultiplier), total_code_lines_accepted: Math.round(7696 * baseMultiplier), total_engaged_users: Math.round(55 * baseMultiplier) },
    { name: 'TypeScript', total_code_suggestions: Math.round(3045 * baseMultiplier), total_code_acceptances: Math.round(853 * baseMultiplier), total_code_lines_suggested: Math.round(24360 * baseMultiplier), total_code_lines_accepted: Math.round(6824 * baseMultiplier), total_engaged_users: Math.round(50 * baseMultiplier) },
    { name: 'Java', total_code_suggestions: Math.round(2378 * baseMultiplier), total_code_acceptances: Math.round(666 * baseMultiplier), total_code_lines_suggested: Math.round(19024 * baseMultiplier), total_code_lines_accepted: Math.round(5328 * baseMultiplier), total_engaged_users: Math.round(38 * baseMultiplier) },
    { name: 'C#', total_code_suggestions: Math.round(1979 * baseMultiplier), total_code_acceptances: Math.round(554 * baseMultiplier), total_code_lines_suggested: Math.round(15832 * baseMultiplier), total_code_lines_accepted: Math.round(4432 * baseMultiplier), total_engaged_users: Math.round(32 * baseMultiplier) },
    { name: 'Go', total_code_suggestions: Math.round(1285 * baseMultiplier), total_code_acceptances: Math.round(360 * baseMultiplier), total_code_lines_suggested: Math.round(10280 * baseMultiplier), total_code_lines_accepted: Math.round(2880 * baseMultiplier), total_engaged_users: Math.round(21 * baseMultiplier) },
    { name: 'Ruby', total_code_suggestions: Math.round(1007 * baseMultiplier), total_code_acceptances: Math.round(282 * baseMultiplier), total_code_lines_suggested: Math.round(8056 * baseMultiplier), total_code_lines_accepted: Math.round(2256 * baseMultiplier), total_engaged_users: Math.round(16 * baseMultiplier) },
    { name: 'PHP', total_code_suggestions: Math.round(886 * baseMultiplier), total_code_acceptances: Math.round(248 * baseMultiplier), total_code_lines_suggested: Math.round(7088 * baseMultiplier), total_code_lines_accepted: Math.round(1984 * baseMultiplier), total_engaged_users: Math.round(14 * baseMultiplier) },
    { name: 'C++', total_code_suggestions: Math.round(786 * baseMultiplier), total_code_acceptances: Math.round(220 * baseMultiplier), total_code_lines_suggested: Math.round(6288 * baseMultiplier), total_code_lines_accepted: Math.round(1760 * baseMultiplier), total_engaged_users: Math.round(13 * baseMultiplier) },
    { name: 'Rust', total_code_suggestions: Math.round(587 * baseMultiplier), total_code_acceptances: Math.round(164 * baseMultiplier), total_code_lines_suggested: Math.round(4696 * baseMultiplier), total_code_lines_accepted: Math.round(1312 * baseMultiplier), total_engaged_users: Math.round(10 * baseMultiplier) }
  ]
}

export const demoEnterpriseMetrics = [
  {
    date: '2025-10-15',
    total_active_users: 142,
    total_engaged_users: 128,
    copilot_ide_code_completions: {
      total_engaged_users: 125,
      editors: [
        { 
          name: 'vscode', 
          total_engaged_users: 95,
          models: [{ name: 'default', languages: generateLanguageData(1.0) }]
        },
        { 
          name: 'jetbrains', 
          total_engaged_users: 22,
          models: [{ name: 'default', languages: generateLanguageData(0.23) }]
        },
        { 
          name: 'vim', 
          total_engaged_users: 8,
          models: [{ name: 'default', languages: generateLanguageData(0.08) }]
        }
      ]
    },
    copilot_ide_chat: {
      total_engaged_users: 87,
      editors: [
        { name: 'vscode', models: [{ name: 'gpt-4', total_chats: 245, total_chat_copy_events: 89, total_chat_insertion_events: 134, total_engaged_users: 85 }] },
        { name: 'jetbrains', models: [{ name: 'gpt-4', total_chats: 48, total_chat_copy_events: 17, total_chat_insertion_events: 26, total_engaged_users: 18 }] }
      ]
    },
    copilot_dotcom_chat: { total_engaged_users: 45 },
    copilot_dotcom_pull_requests: { total_engaged_users: 23 }
  },
  {
    date: '2025-10-16',
    total_active_users: 145,
    total_engaged_users: 132,
    copilot_ide_code_completions: {
      total_engaged_users: 128,
      editors: [
        { name: 'vscode', total_engaged_users: 98, models: [{ name: 'default', languages: generateLanguageData(1.03) }] },
        { name: 'jetbrains', total_engaged_users: 22, models: [{ name: 'default', languages: generateLanguageData(0.23) }] },
        { name: 'vim', total_engaged_users: 8, models: [{ name: 'default', languages: generateLanguageData(0.08) }] }
      ]
    },
    copilot_ide_chat: {
      total_engaged_users: 91,
      editors: [
        { name: 'vscode', models: [{ name: 'gpt-4', total_chats: 267, total_chat_copy_events: 95, total_chat_insertion_events: 145, total_engaged_users: 88 }] },
        { name: 'jetbrains', models: [{ name: 'gpt-4', total_chats: 52, total_chat_copy_events: 19, total_chat_insertion_events: 28, total_engaged_users: 19 }] }
      ]
    },
    copilot_dotcom_chat: { total_engaged_users: 48 },
    copilot_dotcom_pull_requests: { total_engaged_users: 25 }
  },
  {
    date: '2025-10-17',
    total_active_users: 148,
    total_engaged_users: 135,
    copilot_ide_code_completions: {
      total_engaged_users: 131,
      editors: [
        { name: 'vscode', total_engaged_users: 101, models: [{ name: 'default', languages: generateLanguageData(1.06) }] },
        { name: 'jetbrains', total_engaged_users: 22, models: [{ name: 'default', languages: generateLanguageData(0.23) }] },
        { name: 'vim', total_engaged_users: 8, models: [{ name: 'default', languages: generateLanguageData(0.08) }] }
      ]
    },
    copilot_ide_chat: {
      total_engaged_users: 94,
      editors: [
        { name: 'vscode', models: [{ name: 'gpt-4', total_chats: 289, total_chat_copy_events: 102, total_chat_insertion_events: 156, total_engaged_users: 91 }] },
        { name: 'jetbrains', models: [{ name: 'gpt-4', total_chats: 56, total_chat_copy_events: 20, total_chat_insertion_events: 30, total_engaged_users: 20 }] }
      ]
    },
    copilot_dotcom_chat: { total_engaged_users: 51 },
    copilot_dotcom_pull_requests: { total_engaged_users: 27 }
  },
  {
    date: '2025-10-18',
    total_active_users: 138,
    total_engaged_users: 124,
    copilot_ide_code_completions: {
      total_engaged_users: 120,
      editors: [
        { name: 'vscode', total_engaged_users: 92, models: [{ name: 'default', languages: generateLanguageData(0.97) }] },
        { name: 'jetbrains', total_engaged_users: 20, models: [{ name: 'default', languages: generateLanguageData(0.21) }] },
        { name: 'vim', total_engaged_users: 8, models: [{ name: 'default', languages: generateLanguageData(0.08) }] }
      ]
    },
    copilot_ide_chat: {
      total_engaged_users: 83,
      editors: [
        { name: 'vscode', models: [{ name: 'gpt-4', total_chats: 234, total_chat_copy_events: 84, total_chat_insertion_events: 128, total_engaged_users: 81 }] },
        { name: 'jetbrains', models: [{ name: 'gpt-4', total_chats: 45, total_chat_copy_events: 16, total_chat_insertion_events: 24, total_engaged_users: 17 }] }
      ]
    },
    copilot_dotcom_chat: { total_engaged_users: 42 },
    copilot_dotcom_pull_requests: { total_engaged_users: 21 }
  },
  {
    date: '2025-10-21',
    total_active_users: 151,
    total_engaged_users: 138,
    copilot_ide_code_completions: {
      total_engaged_users: 134,
      editors: [
        { name: 'vscode', total_engaged_users: 103, models: [{ name: 'default', languages: generateLanguageData(1.08) }] },
        { name: 'jetbrains', total_engaged_users: 23, models: [{ name: 'default', languages: generateLanguageData(0.24) }] },
        { name: 'vim', total_engaged_users: 8, models: [{ name: 'default', languages: generateLanguageData(0.08) }] }
      ]
    },
    copilot_ide_chat: {
      total_engaged_users: 97,
      editors: [
        { name: 'vscode', models: [{ name: 'gpt-4', total_chats: 298, total_chat_copy_events: 108, total_chat_insertion_events: 162, total_engaged_users: 94 }] },
        { name: 'jetbrains', models: [{ name: 'gpt-4', total_chats: 58, total_chat_copy_events: 21, total_chat_insertion_events: 31, total_engaged_users: 21 }] }
      ]
    },
    copilot_dotcom_chat: { total_engaged_users: 53 },
    copilot_dotcom_pull_requests: { total_engaged_users: 28 }
  },
  {
    date: '2025-10-22',
    total_active_users: 154,
    total_engaged_users: 141,
    copilot_ide_code_completions: {
      total_engaged_users: 137,
      editors: [
        { name: 'vscode', total_engaged_users: 106, models: [{ name: 'default', languages: generateLanguageData(1.11) }] },
        { name: 'jetbrains', total_engaged_users: 23, models: [{ name: 'default', languages: generateLanguageData(0.24) }] },
        { name: 'vim', total_engaged_users: 8, models: [{ name: 'default', languages: generateLanguageData(0.08) }] }
      ]
    },
    copilot_ide_chat: {
      total_engaged_users: 100,
      editors: [
        { name: 'vscode', models: [{ name: 'gpt-4', total_chats: 312, total_chat_copy_events: 114, total_chat_insertion_events: 171, total_engaged_users: 97 }] },
        { name: 'jetbrains', models: [{ name: 'gpt-4', total_chats: 61, total_chat_copy_events: 22, total_chat_insertion_events: 33, total_engaged_users: 22 }] }
      ]
    },
    copilot_dotcom_chat: { total_engaged_users: 56 },
    copilot_dotcom_pull_requests: { total_engaged_users: 30 }
  },
  {
    date: '2025-10-23',
    total_active_users: 157,
    total_engaged_users: 144,
    copilot_ide_code_completions: {
      total_engaged_users: 140,
      editors: [
        { name: 'vscode', total_engaged_users: 108, models: [{ name: 'default', languages: generateLanguageData(1.14) }] },
        { name: 'jetbrains', total_engaged_users: 24, models: [{ name: 'default', languages: generateLanguageData(0.25) }] },
        { name: 'vim', total_engaged_users: 8, models: [{ name: 'default', languages: generateLanguageData(0.08) }] }
      ]
    },
    copilot_ide_chat: {
      total_engaged_users: 103,
      editors: [
        { name: 'vscode', models: [{ name: 'gpt-4', total_chats: 326, total_chat_copy_events: 120, total_chat_insertion_events: 178, total_engaged_users: 100 }] },
        { name: 'jetbrains', models: [{ name: 'gpt-4', total_chats: 64, total_chat_copy_events: 23, total_chat_insertion_events: 34, total_engaged_users: 23 }] }
      ]
    },
    copilot_dotcom_chat: { total_engaged_users: 58 },
    copilot_dotcom_pull_requests: { total_engaged_users: 31 }
  },
  {
    date: '2025-10-24',
    total_active_users: 160,
    total_engaged_users: 147,
    copilot_ide_code_completions: {
      total_engaged_users: 143,
      editors: [
        { name: 'vscode', total_engaged_users: 111, models: [{ name: 'default', languages: generateLanguageData(1.17) }] },
        { name: 'jetbrains', total_engaged_users: 24, models: [{ name: 'default', languages: generateLanguageData(0.25) }] },
        { name: 'vim', total_engaged_users: 8, models: [{ name: 'default', languages: generateLanguageData(0.08) }] }
      ]
    },
    copilot_ide_chat: {
      total_engaged_users: 106,
      editors: [
        { name: 'vscode', models: [{ name: 'gpt-4', total_chats: 340, total_chat_copy_events: 126, total_chat_insertion_events: 186, total_engaged_users: 103 }] },
        { name: 'jetbrains', models: [{ name: 'gpt-4', total_chats: 67, total_chat_copy_events: 24, total_chat_insertion_events: 36, total_engaged_users: 24 }] }
      ]
    },
    copilot_dotcom_chat: { total_engaged_users: 61 },
    copilot_dotcom_pull_requests: { total_engaged_users: 33 }
  },
  {
    date: '2025-10-25',
    total_active_users: 149,
    total_engaged_users: 136,
    copilot_ide_code_completions: {
      total_engaged_users: 132,
      editors: [
        { name: 'vscode', total_engaged_users: 102, models: [{ name: 'default', languages: generateLanguageData(1.07) }] },
        { name: 'jetbrains', total_engaged_users: 22, models: [{ name: 'default', languages: generateLanguageData(0.23) }] },
        { name: 'vim', total_engaged_users: 8, models: [{ name: 'default', languages: generateLanguageData(0.08) }] }
      ]
    },
    copilot_ide_chat: {
      total_engaged_users: 95,
      editors: [
        { name: 'vscode', models: [{ name: 'gpt-4', total_chats: 287, total_chat_copy_events: 103, total_chat_insertion_events: 157, total_engaged_users: 92 }] },
        { name: 'jetbrains', models: [{ name: 'gpt-4', total_chats: 56, total_chat_copy_events: 20, total_chat_insertion_events: 30, total_engaged_users: 20 }] }
      ]
    },
    copilot_dotcom_chat: { total_engaged_users: 52 },
    copilot_dotcom_pull_requests: { total_engaged_users: 28 }
  },
  {
    date: '2025-10-28',
    total_active_users: 163,
    total_engaged_users: 150,
    copilot_ide_code_completions: {
      total_engaged_users: 146,
      editors: [
        { name: 'vscode', total_engaged_users: 113, models: [{ name: 'default', languages: generateLanguageData(1.19) }] },
        { name: 'jetbrains', total_engaged_users: 25, models: [{ name: 'default', languages: generateLanguageData(0.26) }] },
        { name: 'vim', total_engaged_users: 8, models: [{ name: 'default', languages: generateLanguageData(0.08) }] }
      ]
    },
    copilot_ide_chat: {
      total_engaged_users: 109,
      editors: [
        { name: 'vscode', models: [{ name: 'gpt-4', total_chats: 354, total_chat_copy_events: 132, total_chat_insertion_events: 194, total_engaged_users: 106 }] },
        { name: 'jetbrains', models: [{ name: 'gpt-4', total_chats: 70, total_chat_copy_events: 25, total_chat_insertion_events: 38, total_engaged_users: 25 }] }
      ]
    },
    copilot_dotcom_chat: { total_engaged_users: 64 },
    copilot_dotcom_pull_requests: { total_engaged_users: 35 }
  }
]

export const demoDateRange = {
  from: '2025-10-15',
  to: '2025-10-28'
}
