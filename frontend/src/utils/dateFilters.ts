import { DateRangeType } from '../components/DateRangeFilter'

interface MetricsDataWithDate {
  date: string
  [key: string]: any
}

/**
 * Filters metrics data based on the selected date range
 */
export const filterDataByDateRange = <T extends MetricsDataWithDate>(
  data: T[],
  rangeType: DateRangeType
): T[] => {
  if (rangeType === 'all' || data.length === 0) {
    return data
  }

  const sortedData = [...data].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  )

  const latestDate = new Date(sortedData[0].date)
  let cutoffDate: Date

  switch (rangeType) {
    case 'daily':
      // Last 24 hours (1 day)
      cutoffDate = new Date(latestDate)
      cutoffDate.setDate(cutoffDate.getDate() - 1)
      break

    case 'weekly':
      // Last 7 days
      cutoffDate = new Date(latestDate)
      cutoffDate.setDate(cutoffDate.getDate() - 7)
      break

    case 'monthly':
      // Last 30 days
      cutoffDate = new Date(latestDate)
      cutoffDate.setDate(cutoffDate.getDate() - 30)
      break

    default:
      return data
  }

  return sortedData.filter(item => new Date(item.date) >= cutoffDate)
}

/**
 * Aggregates data by week
 */
export const aggregateByWeek = <T extends MetricsDataWithDate>(
  data: T[]
): T[] => {
  if (data.length === 0) return []

  const weekMap = new Map<string, T[]>()

  data.forEach(item => {
    const date = new Date(item.date)
    const weekStart = new Date(date)
    weekStart.setDate(date.getDate() - date.getDay()) // Start of week (Sunday)
    const weekKey = weekStart.toISOString().split('T')[0]

    if (!weekMap.has(weekKey)) {
      weekMap.set(weekKey, [])
    }
    weekMap.get(weekKey)!.push(item)
  })

  // Aggregate each week's data
  const aggregated: T[] = []
  weekMap.forEach((weekData, weekStart) => {
    const aggregatedItem = { ...weekData[0] } as any
    aggregatedItem.date = weekStart

    // Sum numeric fields
    Object.keys(weekData[0]).forEach(key => {
      if (key !== 'date' && typeof weekData[0][key] === 'number') {
        aggregatedItem[key] = weekData.reduce((sum, item) => sum + (item[key] || 0), 0)
      }
    })

    aggregated.push(aggregatedItem as T)
  })

  return aggregated.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
}

/**
 * Aggregates data by month
 */
export const aggregateByMonth = <T extends MetricsDataWithDate>(
  data: T[]
): T[] => {
  if (data.length === 0) return []

  const monthMap = new Map<string, T[]>()

  data.forEach(item => {
    const date = new Date(item.date)
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-01`

    if (!monthMap.has(monthKey)) {
      monthMap.set(monthKey, [])
    }
    monthMap.get(monthKey)!.push(item)
  })

  // Aggregate each month's data
  const aggregated: T[] = []
  monthMap.forEach((monthData, monthStart) => {
    const aggregatedItem = { ...monthData[0] } as any
    aggregatedItem.date = monthStart

    // Sum numeric fields
    Object.keys(monthData[0]).forEach(key => {
      if (key !== 'date' && typeof monthData[0][key] === 'number') {
        aggregatedItem[key] = monthData.reduce((sum, item) => sum + (item[key] || 0), 0)
      }
    })

    aggregated.push(aggregatedItem as T)
  })

  return aggregated.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
}

/**
 * Formats date label based on range type
 */
export const formatDateLabel = (date: string, rangeType: DateRangeType): string => {
  const d = new Date(date)
  
  switch (rangeType) {
    case 'daily':
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    
    case 'weekly':
      const weekEnd = new Date(d)
      weekEnd.setDate(d.getDate() + 6)
      return `${d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${weekEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
    
    case 'monthly':
      return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short' })
    
    default:
      return date.substring(5) // MM-DD format
  }
}
