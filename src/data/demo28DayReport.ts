// Demo data for 28-Day Report - comprehensive sample data
export const demo28DayReportData = {
  report_start_day: '2025-10-01',
  report_end_day: '2025-10-28',
  enterprise_id: 'demo-enterprise-001',
  created_at: '2025-10-29T08:00:00Z',
  day_totals: [
    {
      day: '2025-10-01',
      enterprise_id: 'demo-enterprise-001',
      daily_active_users: 142,
      weekly_active_users: 156,
      monthly_active_users: 165,
      monthly_active_chat_users: 98,
      monthly_active_agent_users: 45,
      user_initiated_interaction_count: 1245,
      code_generation_activity_count: 3456,
      code_acceptance_activity_count: 892,
      totals_by_ide: [
        {
          ide: 'vscode',
          user_initiated_interaction_count: 945,
          code_generation_activity_count: 2678,
          code_acceptance_activity_count: 712,
          loc_suggested_to_add_sum: 12450,
          loc_suggested_to_delete_sum: 2340,
          loc_added_sum: 8920,
          loc_deleted_sum: 1670
        },
        {
          ide: 'jetbrains',
          user_initiated_interaction_count: 245,
          code_generation_activity_count: 678,
          code_acceptance_activity_count: 145,
          loc_suggested_to_add_sum: 3240,
          loc_suggested_to_delete_sum: 580,
          loc_added_sum: 2210,
          loc_deleted_sum: 410
        },
        {
          ide: 'vim',
          user_initiated_interaction_count: 55,
          code_generation_activity_count: 100,
          code_acceptance_activity_count: 35,
          loc_suggested_to_add_sum: 580,
          loc_suggested_to_delete_sum: 95,
          loc_added_sum: 450,
          loc_deleted_sum: 75
        }
      ],
      totals_by_feature: [
        {
          feature: 'code_completion',
          user_initiated_interaction_count: 945,
          code_generation_activity_count: 2890,
          code_acceptance_activity_count: 745,
          loc_suggested_to_add_sum: 13450,
          loc_suggested_to_delete_sum: 2560,
          loc_added_sum: 9680,
          loc_deleted_sum: 1820
        },
        {
          feature: 'copilot_chat',
          user_initiated_interaction_count: 300,
          code_generation_activity_count: 566,
          code_acceptance_activity_count: 147,
          loc_suggested_to_add_sum: 2820,
          loc_suggested_to_delete_sum: 455,
          loc_added_sum: 1900,
          loc_deleted_sum: 335
        }
      ],
      totals_by_language_feature: [
        {
          language: 'typescript',
          feature: 'code_completion',
          code_generation_activity_count: 1245,
          code_acceptance_activity_count: 324,
          loc_suggested_to_add_sum: 5680,
          loc_suggested_to_delete_sum: 1120,
          loc_added_sum: 4120,
          loc_deleted_sum: 780
        },
        {
          language: 'python',
          feature: 'code_completion',
          code_generation_activity_count: 987,
          code_acceptance_activity_count: 256,
          loc_suggested_to_add_sum: 4560,
          loc_suggested_to_delete_sum: 890,
          loc_added_sum: 3240,
          loc_deleted_sum: 650
        },
        {
          language: 'javascript',
          feature: 'code_completion',
          code_generation_activity_count: 658,
          code_acceptance_activity_count: 165,
          loc_suggested_to_add_sum: 3210,
          loc_suggested_to_delete_sum: 550,
          loc_added_sum: 2320,
          loc_deleted_sum: 390
        }
      ],
      totals_by_language_model: [
        {
          language: 'typescript',
          model: 'gpt-4',
          code_generation_activity_count: 845,
          code_acceptance_activity_count: 220,
          loc_suggested_to_add_sum: 3890,
          loc_suggested_to_delete_sum: 760,
          loc_added_sum: 2840,
          loc_deleted_sum: 530
        },
        {
          language: 'python',
          model: 'gpt-4',
          code_generation_activity_count: 687,
          code_acceptance_activity_count: 178,
          loc_suggested_to_add_sum: 3120,
          loc_suggested_to_delete_sum: 610,
          loc_added_sum: 2230,
          loc_deleted_sum: 450
        }
      ],
      totals_by_model_feature: [
        {
          model: 'gpt-4',
          feature: 'code_completion',
          user_initiated_interaction_count: 645,
          code_generation_activity_count: 1987,
          code_acceptance_activity_count: 512,
          loc_suggested_to_add_sum: 9240,
          loc_suggested_to_delete_sum: 1760,
          loc_added_sum: 6650,
          loc_deleted_sum: 1250
        },
        {
          model: 'gpt-3.5-turbo',
          feature: 'code_completion',
          user_initiated_interaction_count: 300,
          code_generation_activity_count: 903,
          code_acceptance_activity_count: 233,
          loc_suggested_to_add_sum: 4210,
          loc_suggested_to_delete_sum: 800,
          loc_added_sum: 3030,
          loc_deleted_sum: 570
        }
      ],
      loc_suggested_to_add_sum: 16270,
      loc_suggested_to_delete_sum: 3015,
      loc_added_sum: 11580,
      loc_deleted_sum: 2155
    },
    {
      day: '2025-10-02',
      enterprise_id: 'demo-enterprise-001',
      daily_active_users: 148,
      weekly_active_users: 158,
      monthly_active_users: 165,
      monthly_active_chat_users: 100,
      monthly_active_agent_users: 46,
      user_initiated_interaction_count: 1312,
      code_generation_activity_count: 3621,
      code_acceptance_activity_count: 935,
      totals_by_ide: [
        {
          ide: 'vscode',
          user_initiated_interaction_count: 995,
          code_generation_activity_count: 2810,
          code_acceptance_activity_count: 748,
          loc_suggested_to_add_sum: 13050,
          loc_suggested_to_delete_sum: 2450,
          loc_added_sum: 9340,
          loc_deleted_sum: 1750
        },
        {
          ide: 'jetbrains',
          user_initiated_interaction_count: 258,
          code_generation_activity_count: 711,
          code_acceptance_activity_count: 152,
          loc_suggested_to_add_sum: 3400,
          loc_suggested_to_delete_sum: 610,
          loc_added_sum: 2320,
          loc_deleted_sum: 430
        },
        {
          ide: 'vim',
          user_initiated_interaction_count: 59,
          code_generation_activity_count: 100,
          code_acceptance_activity_count: 35,
          loc_suggested_to_add_sum: 610,
          loc_suggested_to_delete_sum: 100,
          loc_added_sum: 470,
          loc_deleted_sum: 80
        }
      ],
      totals_by_feature: [
        {
          feature: 'code_completion',
          user_initiated_interaction_count: 992,
          code_generation_activity_count: 3030,
          code_acceptance_activity_count: 782,
          loc_suggested_to_add_sum: 14100,
          loc_suggested_to_delete_sum: 2680,
          loc_added_sum: 10150,
          loc_deleted_sum: 1910
        },
        {
          feature: 'copilot_chat',
          user_initiated_interaction_count: 320,
          code_generation_activity_count: 591,
          code_acceptance_activity_count: 153,
          loc_suggested_to_add_sum: 2960,
          loc_suggested_to_delete_sum: 480,
          loc_added_sum: 1980,
          loc_deleted_sum: 350
        }
      ],
      totals_by_language_feature: [
        {
          language: 'typescript',
          feature: 'code_completion',
          code_generation_activity_count: 1305,
          code_acceptance_activity_count: 340,
          loc_suggested_to_add_sum: 5950,
          loc_suggested_to_delete_sum: 1175,
          loc_added_sum: 4320,
          loc_deleted_sum: 820
        },
        {
          language: 'python',
          feature: 'code_completion',
          code_generation_activity_count: 1035,
          code_acceptance_activity_count: 268,
          loc_suggested_to_add_sum: 4780,
          loc_suggested_to_delete_sum: 935,
          loc_added_sum: 3400,
          loc_deleted_sum: 680
        },
        {
          language: 'javascript',
          feature: 'code_completion',
          code_generation_activity_count: 690,
          code_acceptance_activity_count: 174,
          loc_suggested_to_add_sum: 3370,
          loc_suggested_to_delete_sum: 570,
          loc_added_sum: 2430,
          loc_deleted_sum: 410
        }
      ],
      totals_by_language_model: [
        {
          language: 'typescript',
          model: 'gpt-4',
          code_generation_activity_count: 887,
          code_acceptance_activity_count: 231,
          loc_suggested_to_add_sum: 4080,
          loc_suggested_to_delete_sum: 800,
          loc_added_sum: 2980,
          loc_deleted_sum: 560
        },
        {
          language: 'python',
          model: 'gpt-4',
          code_generation_activity_count: 720,
          code_acceptance_activity_count: 187,
          loc_suggested_to_add_sum: 3270,
          loc_suggested_to_delete_sum: 640,
          loc_added_sum: 2340,
          loc_deleted_sum: 470
        }
      ],
      totals_by_model_feature: [
        {
          model: 'gpt-4',
          feature: 'code_completion',
          user_initiated_interaction_count: 677,
          code_generation_activity_count: 2085,
          code_acceptance_activity_count: 537,
          loc_suggested_to_add_sum: 9690,
          loc_suggested_to_delete_sum: 1845,
          loc_added_sum: 6980,
          loc_deleted_sum: 1310
        },
        {
          model: 'gpt-3.5-turbo',
          feature: 'code_completion',
          user_initiated_interaction_count: 315,
          code_generation_activity_count: 945,
          code_acceptance_activity_count: 245,
          loc_suggested_to_add_sum: 4410,
          loc_suggested_to_delete_sum: 835,
          loc_added_sum: 3170,
          loc_deleted_sum: 600
        }
      ],
      loc_suggested_to_add_sum: 17060,
      loc_suggested_to_delete_sum: 3160,
      loc_added_sum: 12130,
      loc_deleted_sum: 2260
    },
    // Generate remaining 26 days with slight variations
    ...Array.from({ length: 26 }, (_, i) => {
      const dayNum = i + 3
      const date = `2025-10-${dayNum.toString().padStart(2, '0')}`
      const baseUsers = 142 + Math.floor(Math.random() * 15)
      const variance = 0.9 + Math.random() * 0.2
      
      return {
        day: date,
        enterprise_id: 'demo-enterprise-001',
        daily_active_users: baseUsers,
        weekly_active_users: baseUsers + Math.floor(Math.random() * 20),
        monthly_active_users: 165,
        monthly_active_chat_users: 95 + Math.floor(Math.random() * 10),
        monthly_active_agent_users: 43 + Math.floor(Math.random() * 5),
        user_initiated_interaction_count: Math.floor(1245 * variance),
        code_generation_activity_count: Math.floor(3456 * variance),
        code_acceptance_activity_count: Math.floor(892 * variance),
        totals_by_ide: [
          {
            ide: 'vscode',
            user_initiated_interaction_count: Math.floor(945 * variance),
            code_generation_activity_count: Math.floor(2678 * variance),
            code_acceptance_activity_count: Math.floor(712 * variance),
            loc_suggested_to_add_sum: Math.floor(12450 * variance),
            loc_suggested_to_delete_sum: Math.floor(2340 * variance),
            loc_added_sum: Math.floor(8920 * variance),
            loc_deleted_sum: Math.floor(1670 * variance)
          },
          {
            ide: 'jetbrains',
            user_initiated_interaction_count: Math.floor(245 * variance),
            code_generation_activity_count: Math.floor(678 * variance),
            code_acceptance_activity_count: Math.floor(145 * variance),
            loc_suggested_to_add_sum: Math.floor(3240 * variance),
            loc_suggested_to_delete_sum: Math.floor(580 * variance),
            loc_added_sum: Math.floor(2210 * variance),
            loc_deleted_sum: Math.floor(410 * variance)
          },
          {
            ide: 'vim',
            user_initiated_interaction_count: Math.floor(55 * variance),
            code_generation_activity_count: Math.floor(100 * variance),
            code_acceptance_activity_count: Math.floor(35 * variance),
            loc_suggested_to_add_sum: Math.floor(580 * variance),
            loc_suggested_to_delete_sum: Math.floor(95 * variance),
            loc_added_sum: Math.floor(450 * variance),
            loc_deleted_sum: Math.floor(75 * variance)
          }
        ],
        totals_by_feature: [
          {
            feature: 'code_completion',
            user_initiated_interaction_count: Math.floor(945 * variance),
            code_generation_activity_count: Math.floor(2890 * variance),
            code_acceptance_activity_count: Math.floor(745 * variance),
            loc_suggested_to_add_sum: Math.floor(13450 * variance),
            loc_suggested_to_delete_sum: Math.floor(2560 * variance),
            loc_added_sum: Math.floor(9680 * variance),
            loc_deleted_sum: Math.floor(1820 * variance)
          },
          {
            feature: 'copilot_chat',
            user_initiated_interaction_count: Math.floor(300 * variance),
            code_generation_activity_count: Math.floor(566 * variance),
            code_acceptance_activity_count: Math.floor(147 * variance),
            loc_suggested_to_add_sum: Math.floor(2820 * variance),
            loc_suggested_to_delete_sum: Math.floor(455 * variance),
            loc_added_sum: Math.floor(1900 * variance),
            loc_deleted_sum: Math.floor(335 * variance)
          }
        ],
        totals_by_language_feature: [
          {
            language: 'typescript',
            feature: 'code_completion',
            code_generation_activity_count: Math.floor(1245 * variance),
            code_acceptance_activity_count: Math.floor(324 * variance),
            loc_suggested_to_add_sum: Math.floor(5680 * variance),
            loc_suggested_to_delete_sum: Math.floor(1120 * variance),
            loc_added_sum: Math.floor(4120 * variance),
            loc_deleted_sum: Math.floor(780 * variance)
          },
          {
            language: 'python',
            feature: 'code_completion',
            code_generation_activity_count: Math.floor(987 * variance),
            code_acceptance_activity_count: Math.floor(256 * variance),
            loc_suggested_to_add_sum: Math.floor(4560 * variance),
            loc_suggested_to_delete_sum: Math.floor(890 * variance),
            loc_added_sum: Math.floor(3240 * variance),
            loc_deleted_sum: Math.floor(650 * variance)
          },
          {
            language: 'javascript',
            feature: 'code_completion',
            code_generation_activity_count: Math.floor(658 * variance),
            code_acceptance_activity_count: Math.floor(165 * variance),
            loc_suggested_to_add_sum: Math.floor(3210 * variance),
            loc_suggested_to_delete_sum: Math.floor(550 * variance),
            loc_added_sum: Math.floor(2320 * variance),
            loc_deleted_sum: Math.floor(390 * variance)
          }
        ],
        totals_by_language_model: [
          {
            language: 'typescript',
            model: 'gpt-4',
            code_generation_activity_count: Math.floor(845 * variance),
            code_acceptance_activity_count: Math.floor(220 * variance),
            loc_suggested_to_add_sum: Math.floor(3890 * variance),
            loc_suggested_to_delete_sum: Math.floor(760 * variance),
            loc_added_sum: Math.floor(2840 * variance),
            loc_deleted_sum: Math.floor(530 * variance)
          },
          {
            language: 'python',
            model: 'gpt-4',
            code_generation_activity_count: Math.floor(687 * variance),
            code_acceptance_activity_count: Math.floor(178 * variance),
            loc_suggested_to_add_sum: Math.floor(3120 * variance),
            loc_suggested_to_delete_sum: Math.floor(610 * variance),
            loc_added_sum: Math.floor(2230 * variance),
            loc_deleted_sum: Math.floor(450 * variance)
          }
        ],
        totals_by_model_feature: [
          {
            model: 'gpt-4',
            feature: 'code_completion',
            user_initiated_interaction_count: Math.floor(645 * variance),
            code_generation_activity_count: Math.floor(1987 * variance),
            code_acceptance_activity_count: Math.floor(512 * variance),
            loc_suggested_to_add_sum: Math.floor(9240 * variance),
            loc_suggested_to_delete_sum: Math.floor(1760 * variance),
            loc_added_sum: Math.floor(6650 * variance),
            loc_deleted_sum: Math.floor(1250 * variance)
          },
          {
            model: 'gpt-3.5-turbo',
            feature: 'code_completion',
            user_initiated_interaction_count: Math.floor(300 * variance),
            code_generation_activity_count: Math.floor(903 * variance),
            code_acceptance_activity_count: Math.floor(233 * variance),
            loc_suggested_to_add_sum: Math.floor(4210 * variance),
            loc_suggested_to_delete_sum: Math.floor(800 * variance),
            loc_added_sum: Math.floor(3030 * variance),
            loc_deleted_sum: Math.floor(570 * variance)
          }
        ],
        loc_suggested_to_add_sum: Math.floor(16270 * variance),
        loc_suggested_to_delete_sum: Math.floor(3015 * variance),
        loc_added_sum: Math.floor(11580 * variance),
        loc_deleted_sum: Math.floor(2155 * variance)
      }
    })
  ]
}
