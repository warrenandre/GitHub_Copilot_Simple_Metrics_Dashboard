import { ResponsivePie } from '@nivo/pie'
import { ChartData } from '../types/metrics'

interface PieChartProps {
  data: ChartData[]
  title: string
}

const PieChart = ({ data, title }: PieChartProps) => {
  return (
    <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
      <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>
      <div className="h-80">
        <ResponsivePie
          data={data}
          margin={{ top: 20, right: 80, bottom: 80, left: 80 }}
          innerRadius={0.5}
          padAngle={0.7}
          cornerRadius={3}
          activeOuterRadiusOffset={8}
          borderWidth={1}
          borderColor={{
            from: 'color',
            modifiers: [['darker', 0.2]],
          }}
          arcLinkLabelsSkipAngle={10}
          arcLinkLabelsTextColor="#cbd5e1"
          arcLinkLabelsThickness={2}
          arcLinkLabelsColor={{ from: 'color' }}
          arcLabelsSkipAngle={10}
          arcLabelsTextColor={{
            from: 'color',
            modifiers: [['darker', 2]],
          }}
          legends={[
            {
              anchor: 'bottom',
              direction: 'row',
              justify: false,
              translateX: 0,
              translateY: 56,
              itemsSpacing: 0,
              itemWidth: 100,
              itemHeight: 18,
              itemTextColor: '#cbd5e1',
              itemDirection: 'left-to-right',
              itemOpacity: 1,
              symbolSize: 18,
              symbolShape: 'circle',
            },
          ]}
          theme={{
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

export default PieChart
