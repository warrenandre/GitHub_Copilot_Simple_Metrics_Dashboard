import { ResponsiveLine } from '@nivo/line'
import { LineChartData } from '../types/metrics'
import { useTheme } from '../contexts/ThemeContext'

interface LineChartProps {
  data: LineChartData[]
  title: string
}

const LineChart = ({ data, title }: LineChartProps) => {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <div className="bg-slate-800 dark:bg-slate-800 light:bg-white rounded-lg p-6 border border-slate-700 dark:border-slate-700 light:border-gray-200">
      <h3 className="text-lg font-semibold text-white dark:text-white light:text-gray-900 mb-4">{title}</h3>
      <div className="h-80">
        <ResponsiveLine
          data={data}
          margin={{ top: 20, right: 110, bottom: 50, left: 60 }}
          xScale={{ type: 'point' }}
          yScale={{
            type: 'linear',
            min: 'auto',
            max: 'auto',
            stacked: false,
            reverse: false,
          }}
          curve="cardinal"
          axisTop={null}
          axisRight={null}
          axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: -45,
            legend: 'Date',
            legendOffset: 45,
            legendPosition: 'middle',
          }}
          axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'Count',
            legendOffset: -50,
            legendPosition: 'middle',
          }}
          pointSize={8}
          pointColor={{ theme: 'background' }}
          pointBorderWidth={2}
          pointBorderColor={{ from: 'serieColor' }}
          pointLabelYOffset={-12}
          useMesh={true}
          enableArea={true}
          areaOpacity={0.1}
          legends={[
            {
              anchor: 'bottom-right',
              direction: 'column',
              justify: false,
              translateX: 100,
              translateY: 0,
              itemsSpacing: 0,
              itemDirection: 'left-to-right',
              itemWidth: 80,
              itemHeight: 20,
              itemOpacity: 0.75,
              symbolSize: 12,
              symbolShape: 'circle',
              symbolBorderColor: 'rgba(0, 0, 0, .5)',
            },
          ]}
          theme={{
            axis: {
              ticks: {
                text: {
                  fill: isDark ? '#94a3b8' : '#64748b',
                },
              },
              legend: {
                text: {
                  fill: isDark ? '#cbd5e1' : '#475569',
                  fontSize: 12,
                },
              },
            },
            grid: {
              line: {
                stroke: isDark ? '#334155' : '#e2e8f0',
                strokeWidth: 1,
              },
            },
            legends: {
              text: {
                fill: isDark ? '#cbd5e1' : '#475569',
              },
            },
            tooltip: {
              container: {
                background: isDark ? '#1e293b' : '#ffffff',
                color: isDark ? '#fff' : '#1e293b',
                fontSize: 12,
                borderRadius: '4px',
                boxShadow: '0 3px 9px rgba(0, 0, 0, 0.5)',
              },
            },
          }}
        />
      </div>
    </div>
  )
}

export default LineChart
