import { ResponsiveBar } from '@nivo/bar'

interface BarChartProps {
  data: any[]
  keys: string[]
  indexBy: string
  title: string
}

const BarChart = ({ data, keys, indexBy, title }: BarChartProps) => {
  return (
    <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
      <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>
      <div className="h-80">
        <ResponsiveBar
          data={data}
          keys={keys}
          indexBy={indexBy}
          margin={{ top: 20, right: 130, bottom: 50, left: 60 }}
          padding={0.3}
          valueScale={{ type: 'linear' }}
          indexScale={{ type: 'band', round: true }}
          colors={{ scheme: 'nivo' }}
          borderColor={{
            from: 'color',
            modifiers: [['darker', 1.6]],
          }}
          axisTop={null}
          axisRight={null}
          axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: -45,
            legend: indexBy,
            legendPosition: 'middle',
            legendOffset: 45,
          }}
          axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'Users',
            legendPosition: 'middle',
            legendOffset: -50,
          }}
          labelSkipWidth={12}
          labelSkipHeight={12}
          labelTextColor={{
            from: 'color',
            modifiers: [['darker', 1.6]],
          }}
          legends={[
            {
              dataFrom: 'keys',
              anchor: 'bottom-right',
              direction: 'column',
              justify: false,
              translateX: 120,
              translateY: 0,
              itemsSpacing: 2,
              itemWidth: 100,
              itemHeight: 20,
              itemDirection: 'left-to-right',
              itemOpacity: 0.85,
              symbolSize: 20,
            },
          ]}
          role="application"
          ariaLabel="Bar chart"
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

export default BarChart
