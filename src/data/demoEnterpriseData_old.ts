// Demo data for Enterprise metrics - used across all demo pages
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
          models: [
            {
              name: 'default',
              languages: [
                { name: 'JavaScript', total_code_suggestions: 3885, total_code_acceptances: 1088, total_code_lines_suggested: 31080, total_code_lines_accepted: 8704, total_engaged_users: 62 },
                { name: 'Python', total_code_suggestions: 3438, total_code_acceptances: 962, total_code_lines_suggested: 27504, total_code_lines_accepted: 7696, total_engaged_users: 55 },
                { name: 'TypeScript', total_code_suggestions: 3045, total_code_acceptances: 853, total_code_lines_suggested: 24360, total_code_lines_accepted: 6824, total_engaged_users: 50 },
                { name: 'Java', total_code_suggestions: 2378, total_code_acceptances: 666, total_code_lines_suggested: 19024, total_code_lines_accepted: 5328, total_engaged_users: 38 },
                { name: 'C#', total_code_suggestions: 1979, total_code_acceptances: 554, total_code_lines_suggested: 15832, total_code_lines_accepted: 4432, total_engaged_users: 32 }
              ]
            }
          ]
        },
        { 
          name: 'jetbrains', 
          total_engaged_users: 22,
          models: [
            {
              name: 'default',
              languages: [
                { name: 'Java', total_code_suggestions: 594, total_code_acceptances: 166, total_code_lines_suggested: 4752, total_code_lines_accepted: 1328, total_engaged_users: 10 },
                { name: 'Go', total_code_suggestions: 1285, total_code_acceptances: 360, total_code_lines_suggested: 10280, total_code_lines_accepted: 2880, total_engaged_users: 21 },
                { name: 'Ruby', total_code_suggestions: 1007, total_code_acceptances: 282, total_code_lines_suggested: 8056, total_code_lines_accepted: 2256, total_engaged_users: 16 },
                { name: 'PHP', total_code_suggestions: 886, total_code_acceptances: 248, total_code_lines_suggested: 7088, total_code_lines_accepted: 1984, total_engaged_users: 14 }
              ]
            }
          ]
        },
        { 
          name: 'vim', 
          total_engaged_users: 8,
          models: [
            {
              name: 'default',
              languages: [
                { name: 'C++', total_code_suggestions: 786, total_code_acceptances: 220, total_code_lines_suggested: 6288, total_code_lines_accepted: 1760, total_engaged_users: 13 },
                { name: 'Rust', total_code_suggestions: 587, total_code_acceptances: 164, total_code_lines_suggested: 4696, total_code_lines_accepted: 1312, total_engaged_users: 10 },
                { name: 'C#', total_code_suggestions: 297, total_code_acceptances: 83, total_code_lines_suggested: 2376, total_code_lines_accepted: 664, total_engaged_users: 5 }
              ]
            }
          ]
        }
      ]
    },
    copilot_ide_chat: {
      total_engaged_users: 87,
      editors: [
        {
          name: 'vscode',
          models: [
            {
              name: 'gpt-4',
              total_chats: 245,
              total_chat_copy_events: 89,
              total_chat_insertion_events: 134,
              total_engaged_users: 85
            }
          ]
        },
        {
          name: 'jetbrains',
          models: [
            {
              name: 'gpt-4',
              total_chats: 48,
              total_chat_copy_events: 17,
              total_chat_insertion_events: 26,
              total_engaged_users: 18
            }
          ]
        }
      ]
    },
    copilot_dotcom_chat: {
      total_engaged_users: 45
    },
    copilot_dotcom_pull_requests: {
      total_engaged_users: 23
    }
  },
  {
    date: '2025-10-16',
    total_active_users: 145,
    total_engaged_users: 132,
    copilot_ide_code_completions: {
      total_engaged_users: 128,
      editors: [
        { name: 'vscode', total_engaged_users: 98, total_code_suggestions: 14700, total_code_acceptances: 4116, total_code_lines_suggested: 117600, total_code_lines_accepted: 32928 },
        { name: 'jetbrains', total_engaged_users: 22, total_code_suggestions: 3300, total_code_acceptances: 924, total_code_lines_suggested: 26400, total_code_lines_accepted: 7392 },
        { name: 'vim', total_engaged_users: 8, total_code_suggestions: 1200, total_code_acceptances: 336, total_code_lines_suggested: 9600, total_code_lines_accepted: 2688 }
      ],
      languages: [
        { name: 'JavaScript', total_code_suggestions: 5012, total_code_acceptances: 1403, total_engaged_users: 80 },
        { name: 'Python', total_code_suggestions: 4436, total_code_acceptances: 1242, total_engaged_users: 71 },
        { name: 'TypeScript', total_code_suggestions: 3928, total_code_acceptances: 1100, total_engaged_users: 64 },
        { name: 'Java', total_code_suggestions: 3067, total_code_acceptances: 859, total_engaged_users: 49 },
        { name: 'C#', total_code_suggestions: 2553, total_code_acceptances: 715, total_engaged_users: 41 },
        { name: 'Go', total_code_suggestions: 2211, total_code_acceptances: 619, total_engaged_users: 36 },
        { name: 'Ruby', total_code_suggestions: 1733, total_code_acceptances: 485, total_engaged_users: 28 },
        { name: 'PHP', total_code_suggestions: 1523, total_code_acceptances: 426, total_engaged_users: 25 },
        { name: 'C++', total_code_suggestions: 1352, total_code_acceptances: 379, total_engaged_users: 22 },
        { name: 'Rust', total_code_suggestions: 1010, total_code_acceptances: 283, total_engaged_users: 17 }
      ]
    },
    copilot_ide_chat: {
      total_engaged_users: 91,
      editors: [
        {
          name: 'vscode',
          models: [
            {
              name: 'gpt-4',
              total_chats: 267,
              total_chat_copy_events: 95,
              total_chat_insertion_events: 145,
              total_engaged_users: 88
            }
          ]
        },
        {
          name: 'jetbrains',
          models: [
            {
              name: 'gpt-4',
              total_chats: 52,
              total_chat_copy_events: 19,
              total_chat_insertion_events: 28,
              total_engaged_users: 19
            }
          ]
        }
      ]
    },
    copilot_dotcom_chat: {
      total_engaged_users: 48
    },
    copilot_dotcom_pull_requests: {
      total_engaged_users: 25
    }
  },
  {
    date: '2025-10-17',
    total_active_users: 148,
    total_engaged_users: 135,
    copilot_ide_code_completions: {
      total_engaged_users: 131,
      editors: [
        { name: 'vscode', total_engaged_users: 101, total_code_suggestions: 15150, total_code_acceptances: 4242, total_code_lines_suggested: 121200, total_code_lines_accepted: 33936 },
        { name: 'jetbrains', total_engaged_users: 22, total_code_suggestions: 3300, total_code_acceptances: 924, total_code_lines_suggested: 26400, total_code_lines_accepted: 7392 },
        { name: 'vim', total_engaged_users: 8, total_code_suggestions: 1200, total_code_acceptances: 336, total_code_lines_suggested: 9600, total_code_lines_accepted: 2688 }
      ],
      languages: [
        { name: 'JavaScript', total_code_suggestions: 5168, total_code_acceptances: 1447, total_engaged_users: 82 },
        { name: 'Python', total_code_suggestions: 4574, total_code_acceptances: 1281, total_engaged_users: 73 },
        { name: 'TypeScript', total_code_suggestions: 4050, total_code_acceptances: 1134, total_engaged_users: 66 },
        { name: 'Java', total_code_suggestions: 3162, total_code_acceptances: 885, total_engaged_users: 51 },
        { name: 'C#', total_code_suggestions: 2632, total_code_acceptances: 737, total_engaged_users: 42 },
        { name: 'Go', total_code_suggestions: 2280, total_code_acceptances: 638, total_engaged_users: 37 },
        { name: 'Ruby', total_code_suggestions: 1787, total_code_acceptances: 500, total_engaged_users: 29 },
        { name: 'PHP', total_code_suggestions: 1570, total_code_acceptances: 440, total_engaged_users: 26 },
        { name: 'C++', total_code_suggestions: 1394, total_code_acceptances: 390, total_engaged_users: 23 },
        { name: 'Rust', total_code_suggestions: 1042, total_code_acceptances: 292, total_engaged_users: 18 }
      ]
    },
    copilot_ide_chat: {
      total_engaged_users: 94,
      editors: [
        {
          name: 'vscode',
          models: [
            {
              name: 'gpt-4',
              total_chats: 289,
              total_chat_copy_events: 102,
              total_chat_insertion_events: 156,
              total_engaged_users: 91
            }
          ]
        },
        {
          name: 'jetbrains',
          models: [
            {
              name: 'gpt-4',
              total_chats: 56,
              total_chat_copy_events: 20,
              total_chat_insertion_events: 30,
              total_engaged_users: 20
            }
          ]
        }
      ]
    },
    copilot_dotcom_chat: {
      total_engaged_users: 51
    },
    copilot_dotcom_pull_requests: {
      total_engaged_users: 27
    }
  },
  {
    date: '2025-10-18',
    total_active_users: 138,
    total_engaged_users: 124,
    copilot_ide_code_completions: {
      total_engaged_users: 120,
      editors: [
        { name: 'vscode', total_engaged_users: 92, total_code_suggestions: 13800, total_code_acceptances: 3864, total_code_lines_suggested: 110400, total_code_lines_accepted: 30912 },
        { name: 'jetbrains', total_engaged_users: 20, total_code_suggestions: 3000, total_code_acceptances: 840, total_code_lines_suggested: 24000, total_code_lines_accepted: 6720 },
        { name: 'vim', total_engaged_users: 8, total_code_suggestions: 1200, total_code_acceptances: 336, total_code_lines_suggested: 9600, total_code_lines_accepted: 2688 }
      ],
      languages: [
        { name: 'JavaScript', total_code_suggestions: 4712, total_code_acceptances: 1319, total_engaged_users: 75 },
        { name: 'Python', total_code_suggestions: 4172, total_code_acceptances: 1168, total_engaged_users: 67 },
        { name: 'TypeScript', total_code_suggestions: 3694, total_code_acceptances: 1034, total_engaged_users: 60 },
        { name: 'Java', total_code_suggestions: 2884, total_code_acceptances: 807, total_engaged_users: 46 },
        { name: 'C#', total_code_suggestions: 2401, total_code_acceptances: 672, total_engaged_users: 39 },
        { name: 'Go', total_code_suggestions: 2080, total_code_acceptances: 582, total_engaged_users: 34 },
        { name: 'Ruby', total_code_suggestions: 1630, total_code_acceptances: 456, total_engaged_users: 26 },
        { name: 'PHP', total_code_suggestions: 1432, total_code_acceptances: 401, total_engaged_users: 23 },
        { name: 'C++', total_code_suggestions: 1271, total_code_acceptances: 356, total_engaged_users: 21 },
        { name: 'Rust', total_code_suggestions: 950, total_code_acceptances: 266, total_engaged_users: 15 }
      ]
    },
    copilot_ide_chat: {
      total_engaged_users: 83,
      editors: [
        {
          name: 'vscode',
          models: [
            {
              name: 'gpt-4',
              total_chats: 234,
              total_chat_copy_events: 84,
              total_chat_insertion_events: 128,
              total_engaged_users: 81
            }
          ]
        },
        {
          name: 'jetbrains',
          models: [
            {
              name: 'gpt-4',
              total_chats: 45,
              total_chat_copy_events: 16,
              total_chat_insertion_events: 24,
              total_engaged_users: 17
            }
          ]
        }
      ]
    },
    copilot_dotcom_chat: {
      total_engaged_users: 42
    },
    copilot_dotcom_pull_requests: {
      total_engaged_users: 21
    }
  },
  {
    date: '2025-10-21',
    total_active_users: 151,
    total_engaged_users: 138,
    copilot_ide_code_completions: {
      total_engaged_users: 134,
      editors: [
        { name: 'vscode', total_engaged_users: 103, total_code_suggestions: 15450, total_code_acceptances: 4326, total_code_lines_suggested: 123600, total_code_lines_accepted: 34608 },
        { name: 'jetbrains', total_engaged_users: 23, total_code_suggestions: 3450, total_code_acceptances: 966, total_code_lines_suggested: 27600, total_code_lines_accepted: 7728 },
        { name: 'vim', total_engaged_users: 8, total_code_suggestions: 1200, total_code_acceptances: 336, total_code_lines_suggested: 9600, total_code_lines_accepted: 2688 }
      ],
      languages: [
        { name: 'JavaScript', total_code_suggestions: 5262, total_code_acceptances: 1473, total_engaged_users: 84 },
        { name: 'Python', total_code_suggestions: 4658, total_code_acceptances: 1304, total_engaged_users: 75 },
        { name: 'TypeScript', total_code_suggestions: 4122, total_code_acceptances: 1154, total_engaged_users: 67 },
        { name: 'Java', total_code_suggestions: 3219, total_code_acceptances: 901, total_engaged_users: 52 },
        { name: 'C#', total_code_suggestions: 2680, total_code_acceptances: 750, total_engaged_users: 43 },
        { name: 'Go', total_code_suggestions: 2322, total_code_acceptances: 650, total_engaged_users: 38 },
        { name: 'Ruby', total_code_suggestions: 1819, total_code_acceptances: 509, total_engaged_users: 29 },
        { name: 'PHP', total_code_suggestions: 1598, total_code_acceptances: 447, total_engaged_users: 26 },
        { name: 'C++', total_code_suggestions: 1419, total_code_acceptances: 397, total_engaged_users: 23 },
        { name: 'Rust', total_code_suggestions: 1060, total_code_acceptances: 297, total_engaged_users: 18 }
      ]
    },
    copilot_ide_chat: {
      total_engaged_users: 97,
      editors: [
        {
          name: 'vscode',
          models: [
            {
              name: 'gpt-4',
              total_chats: 298,
              total_chat_copy_events: 108,
              total_chat_insertion_events: 162,
              total_engaged_users: 94
            }
          ]
        },
        {
          name: 'jetbrains',
          models: [
            {
              name: 'gpt-4',
              total_chats: 58,
              total_chat_copy_events: 21,
              total_chat_insertion_events: 31,
              total_engaged_users: 21
            }
          ]
        }
      ]
    },
    copilot_dotcom_chat: {
      total_engaged_users: 53
    },
    copilot_dotcom_pull_requests: {
      total_engaged_users: 28
    }
  },
  {
    date: '2025-10-22',
    total_active_users: 154,
    total_engaged_users: 141,
    copilot_ide_code_completions: {
      total_engaged_users: 137,
      editors: [
        { name: 'vscode', total_engaged_users: 106, total_code_suggestions: 15900, total_code_acceptances: 4452, total_code_lines_suggested: 127200, total_code_lines_accepted: 35616 },
        { name: 'jetbrains', total_engaged_users: 23, total_code_suggestions: 3450, total_code_acceptances: 966, total_code_lines_suggested: 27600, total_code_lines_accepted: 7728 },
        { name: 'vim', total_engaged_users: 8, total_code_suggestions: 1200, total_code_acceptances: 336, total_code_lines_suggested: 9600, total_code_lines_accepted: 2688 }
      ],
      languages: [
        { name: 'JavaScript', total_code_suggestions: 5418, total_code_acceptances: 1517, total_engaged_users: 86 },
        { name: 'Python', total_code_suggestions: 4796, total_code_acceptances: 1343, total_engaged_users: 77 },
        { name: 'TypeScript', total_code_suggestions: 4244, total_code_acceptances: 1188, total_engaged_users: 69 },
        { name: 'Java', total_code_suggestions: 3314, total_code_acceptances: 928, total_engaged_users: 53 },
        { name: 'C#', total_code_suggestions: 2759, total_code_acceptances: 773, total_engaged_users: 44 },
        { name: 'Go', total_code_suggestions: 2391, total_code_acceptances: 669, total_engaged_users: 39 },
        { name: 'Ruby', total_code_suggestions: 1873, total_code_acceptances: 524, total_engaged_users: 30 },
        { name: 'PHP', total_code_suggestions: 1645, total_code_acceptances: 461, total_engaged_users: 27 },
        { name: 'C++', total_code_suggestions: 1461, total_code_acceptances: 409, total_engaged_users: 24 },
        { name: 'Rust', total_code_suggestions: 1092, total_code_acceptances: 306, total_engaged_users: 19 }
      ]
    },
    copilot_ide_chat: {
      total_engaged_users: 100,
      editors: [
        {
          name: 'vscode',
          models: [
            {
              name: 'gpt-4',
              total_chats: 312,
              total_chat_copy_events: 114,
              total_chat_insertion_events: 171,
              total_engaged_users: 97
            }
          ]
        },
        {
          name: 'jetbrains',
          models: [
            {
              name: 'gpt-4',
              total_chats: 61,
              total_chat_copy_events: 22,
              total_chat_insertion_events: 33,
              total_engaged_users: 22
            }
          ]
        }
      ]
    },
    copilot_dotcom_chat: {
      total_engaged_users: 56
    },
    copilot_dotcom_pull_requests: {
      total_engaged_users: 30
    }
  },
  {
    date: '2025-10-23',
    total_active_users: 157,
    total_engaged_users: 144,
    copilot_ide_code_completions: {
      total_engaged_users: 140,
      editors: [
        { name: 'vscode', total_engaged_users: 108, total_code_suggestions: 16200, total_code_acceptances: 4536, total_code_lines_suggested: 129600, total_code_lines_accepted: 36288 },
        { name: 'jetbrains', total_engaged_users: 24, total_code_suggestions: 3600, total_code_acceptances: 1008, total_code_lines_suggested: 28800, total_code_lines_accepted: 8064 },
        { name: 'vim', total_engaged_users: 8, total_code_suggestions: 1200, total_code_acceptances: 336, total_code_lines_suggested: 9600, total_code_lines_accepted: 2688 }
      ],
      languages: [
        { name: 'JavaScript', total_code_suggestions: 5524, total_code_acceptances: 1547, total_engaged_users: 88 },
        { name: 'Python', total_code_suggestions: 4890, total_code_acceptances: 1369, total_engaged_users: 78 },
        { name: 'TypeScript', total_code_suggestions: 4326, total_code_acceptances: 1211, total_engaged_users: 70 },
        { name: 'Java', total_code_suggestions: 3378, total_code_acceptances: 946, total_engaged_users: 54 },
        { name: 'C#', total_code_suggestions: 2812, total_code_acceptances: 787, total_engaged_users: 45 },
        { name: 'Go', total_code_suggestions: 2437, total_code_acceptances: 682, total_engaged_users: 39 },
        { name: 'Ruby', total_code_suggestions: 1909, total_code_acceptances: 535, total_engaged_users: 31 },
        { name: 'PHP', total_code_suggestions: 1677, total_code_acceptances: 470, total_engaged_users: 27 },
        { name: 'C++', total_code_suggestions: 1489, total_code_acceptances: 417, total_engaged_users: 24 },
        { name: 'Rust', total_code_suggestions: 1113, total_code_acceptances: 312, total_engaged_users: 19 }
      ]
    },
    copilot_ide_chat: {
      total_engaged_users: 103,
      editors: [
        {
          name: 'vscode',
          models: [
            {
              name: 'gpt-4',
              total_chats: 326,
              total_chat_copy_events: 120,
              total_chat_insertion_events: 178,
              total_engaged_users: 100
            }
          ]
        },
        {
          name: 'jetbrains',
          models: [
            {
              name: 'gpt-4',
              total_chats: 64,
              total_chat_copy_events: 23,
              total_chat_insertion_events: 34,
              total_engaged_users: 23
            }
          ]
        }
      ]
    },
    copilot_dotcom_chat: {
      total_engaged_users: 58
    },
    copilot_dotcom_pull_requests: {
      total_engaged_users: 31
    }
  },
  {
    date: '2025-10-24',
    total_active_users: 160,
    total_engaged_users: 147,
    copilot_ide_code_completions: {
      total_engaged_users: 143,
      editors: [
        { name: 'vscode', total_engaged_users: 111, total_code_suggestions: 16650, total_code_acceptances: 4662, total_code_lines_suggested: 133200, total_code_lines_accepted: 37296 },
        { name: 'jetbrains', total_engaged_users: 24, total_code_suggestions: 3600, total_code_acceptances: 1008, total_code_lines_suggested: 28800, total_code_lines_accepted: 8064 },
        { name: 'vim', total_engaged_users: 8, total_code_suggestions: 1200, total_code_acceptances: 336, total_code_lines_suggested: 9600, total_code_lines_accepted: 2688 }
      ],
      languages: [
        { name: 'JavaScript', total_code_suggestions: 5680, total_code_acceptances: 1590, total_engaged_users: 90 },
        { name: 'Python', total_code_suggestions: 5028, total_code_acceptances: 1408, total_engaged_users: 80 },
        { name: 'TypeScript', total_code_suggestions: 4448, total_code_acceptances: 1245, total_engaged_users: 72 },
        { name: 'Java', total_code_suggestions: 3473, total_code_acceptances: 972, total_engaged_users: 56 },
        { name: 'C#', total_code_suggestions: 2891, total_code_acceptances: 810, total_engaged_users: 46 },
        { name: 'Go', total_code_suggestions: 2506, total_code_acceptances: 702, total_engaged_users: 40 },
        { name: 'Ruby', total_code_suggestions: 1963, total_code_acceptances: 550, total_engaged_users: 32 },
        { name: 'PHP', total_code_suggestions: 1724, total_code_acceptances: 483, total_engaged_users: 28 },
        { name: 'C++', total_code_suggestions: 1531, total_code_acceptances: 429, total_engaged_users: 25 },
        { name: 'Rust', total_code_suggestions: 1145, total_code_acceptances: 321, total_engaged_users: 20 }
      ]
    },
    copilot_ide_chat: {
      total_engaged_users: 106,
      editors: [
        {
          name: 'vscode',
          models: [
            {
              name: 'gpt-4',
              total_chats: 340,
              total_chat_copy_events: 126,
              total_chat_insertion_events: 186,
              total_engaged_users: 103
            }
          ]
        },
        {
          name: 'jetbrains',
          models: [
            {
              name: 'gpt-4',
              total_chats: 67,
              total_chat_copy_events: 24,
              total_chat_insertion_events: 36,
              total_engaged_users: 24
            }
          ]
        }
      ]
    },
    copilot_dotcom_chat: {
      total_engaged_users: 61
    },
    copilot_dotcom_pull_requests: {
      total_engaged_users: 33
    }
  },
  {
    date: '2025-10-25',
    total_active_users: 149,
    total_engaged_users: 136,
    copilot_ide_code_completions: {
      total_engaged_users: 132,
      editors: [
        { name: 'vscode', total_engaged_users: 102, total_code_suggestions: 15300, total_code_acceptances: 4284, total_code_lines_suggested: 122400, total_code_lines_accepted: 34272 },
        { name: 'jetbrains', total_engaged_users: 22, total_code_suggestions: 3300, total_code_acceptances: 924, total_code_lines_suggested: 26400, total_code_lines_accepted: 7392 },
        { name: 'vim', total_engaged_users: 8, total_code_suggestions: 1200, total_code_acceptances: 336, total_code_lines_suggested: 9600, total_code_lines_accepted: 2688 }
      ],
      languages: [
        { name: 'JavaScript', total_code_suggestions: 5106, total_code_acceptances: 1430, total_engaged_users: 81 },
        { name: 'Python', total_code_suggestions: 4520, total_code_acceptances: 1266, total_engaged_users: 72 },
        { name: 'TypeScript', total_code_suggestions: 4000, total_code_acceptances: 1120, total_engaged_users: 65 },
        { name: 'Java', total_code_suggestions: 3124, total_code_acceptances: 875, total_engaged_users: 50 },
        { name: 'C#', total_code_suggestions: 2601, total_code_acceptances: 728, total_engaged_users: 42 },
        { name: 'Go', total_code_suggestions: 2254, total_code_acceptances: 631, total_engaged_users: 36 },
        { name: 'Ruby', total_code_suggestions: 1766, total_code_acceptances: 495, total_engaged_users: 28 },
        { name: 'PHP', total_code_suggestions: 1551, total_code_acceptances: 434, total_engaged_users: 25 },
        { name: 'C++', total_code_suggestions: 1377, total_code_acceptances: 386, total_engaged_users: 22 },
        { name: 'Rust', total_code_suggestions: 1029, total_code_acceptances: 288, total_engaged_users: 17 }
      ]
    },
    copilot_ide_chat: {
      total_engaged_users: 95,
      editors: [
        {
          name: 'vscode',
          models: [
            {
              name: 'gpt-4',
              total_chats: 287,
              total_chat_copy_events: 103,
              total_chat_insertion_events: 157,
              total_engaged_users: 92
            }
          ]
        },
        {
          name: 'jetbrains',
          models: [
            {
              name: 'gpt-4',
              total_chats: 56,
              total_chat_copy_events: 20,
              total_chat_insertion_events: 30,
              total_engaged_users: 20
            }
          ]
        }
      ]
    },
    copilot_dotcom_chat: {
      total_engaged_users: 52
    },
    copilot_dotcom_pull_requests: {
      total_engaged_users: 28
    }
  },
  {
    date: '2025-10-28',
    total_active_users: 163,
    total_engaged_users: 150,
    copilot_ide_code_completions: {
      total_engaged_users: 146,
      editors: [
        { name: 'vscode', total_engaged_users: 113, total_code_suggestions: 16950, total_code_acceptances: 4746, total_code_lines_suggested: 135600, total_code_lines_accepted: 37968 },
        { name: 'jetbrains', total_engaged_users: 25, total_code_suggestions: 3750, total_code_acceptances: 1050, total_code_lines_suggested: 30000, total_code_lines_accepted: 8400 },
        { name: 'vim', total_engaged_users: 8, total_code_suggestions: 1200, total_code_acceptances: 336, total_code_lines_suggested: 9600, total_code_lines_accepted: 2688 }
      ],
      languages: [
        { name: 'JavaScript', total_code_suggestions: 5774, total_code_acceptances: 1617, total_engaged_users: 92 },
        { name: 'Python', total_code_suggestions: 5112, total_code_acceptances: 1431, total_engaged_users: 81 },
        { name: 'TypeScript', total_code_suggestions: 4524, total_code_acceptances: 1267, total_engaged_users: 73 },
        { name: 'Java', total_code_suggestions: 3535, total_code_acceptances: 990, total_engaged_users: 57 },
        { name: 'C#', total_code_suggestions: 2943, total_code_acceptances: 824, total_engaged_users: 47 },
        { name: 'Go', total_code_suggestions: 2551, total_code_acceptances: 714, total_engaged_users: 41 },
        { name: 'Ruby', total_code_suggestions: 1999, total_code_acceptances: 560, total_engaged_users: 32 },
        { name: 'PHP', total_code_suggestions: 1756, total_code_acceptances: 492, total_engaged_users: 28 },
        { name: 'C++', total_code_suggestions: 1559, total_code_acceptances: 437, total_engaged_users: 25 },
        { name: 'Rust', total_code_suggestions: 1166, total_code_acceptances: 327, total_engaged_users: 20 }
      ]
    },
    copilot_ide_chat: {
      total_engaged_users: 109,
      editors: [
        {
          name: 'vscode',
          models: [
            {
              name: 'gpt-4',
              total_chats: 354,
              total_chat_copy_events: 132,
              total_chat_insertion_events: 194,
              total_engaged_users: 106
            }
          ]
        },
        {
          name: 'jetbrains',
          models: [
            {
              name: 'gpt-4',
              total_chats: 70,
              total_chat_copy_events: 25,
              total_chat_insertion_events: 38,
              total_engaged_users: 25
            }
          ]
        }
      ]
    },
    copilot_dotcom_chat: {
      total_engaged_users: 64
    },
    copilot_dotcom_pull_requests: {
      total_engaged_users: 35
    }
  }
]

export const demoDateRange = {
  from: '2025-10-15',
  to: '2025-10-28'
}
