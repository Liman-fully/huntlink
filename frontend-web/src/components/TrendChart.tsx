import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

interface TrendData {
  month: string;
  candidates: number;
  interviews: number;
}

interface TrendChartProps {
  data: TrendData[];
  loading?: boolean;
}

export default function TrendChart({ data, loading }: TrendChartProps) {
  if (loading) return <div className="loading-placeholder">加载中...</div>;

  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis 
            dataKey="month" 
            tick={{ fontSize: 12 }}
            axisLine={false}
          />
          <YAxis 
            tick={{ fontSize: 12 }}
            axisLine={false}
          />
          <Tooltip />
          <Legend iconType="circle" />
          <Line 
            type="monotone" 
            dataKey="candidates" 
            name="新增候选人"
            stroke="#165DFF" 
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
          <Line 
            type="monotone" 
            dataKey="interviews" 
            name="安排面试"
            stroke="#27C346" 
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
