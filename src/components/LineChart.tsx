import { ResponsiveLine } from '@nivo/line'
import { LineChartData } from '../types/metrics'

interface LineChartProps {
  data: LineChartData[]
  title: string
}

const LineChart = ({ data, title }: LineChartProps) => {
  return (
    <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
      <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>
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
                  fill: '#94a3b8',
                },
              },
              legend: {
                text: {
                  fill: '#cbd5e1',
                  fontSize: 12,
                },
              },
            },
            grid: {
              line: {
                stroke: '#334155',
                strokeWidth: 1,
              },
            },
            legends: {
              text: {
                fill: '#cbd5e1',
              },
            },
            tooltip: {
              container: {
                background: '#1e293b',
                color: '#fff',
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
