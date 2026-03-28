import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';

interface FunnelData {
  step: string;
  count: number;
}

interface RecruitmentFunnelProps {
  data: FunnelData[];
  loading?: boolean;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export default function RecruitmentFunnel({ data, loading }: RecruitmentFunnelProps) {
  if (loading) return <div className="loading-placeholder">加载中...</div>;

  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          layout="vertical"
          data={data}
          margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={false} />
          <XAxis type="number" hide />
          <YAxis 
            dataKey="step" 
            type="category" 
            width={80}
            tick={{ fontSize: 12 }}
          />
          <Tooltip 
            formatter={(value: number) => [`${value} 人`, '人数']}
            cursor={{ fill: 'rgba(0,0,0,0.05)' }}
          />
          <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={30}>
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
