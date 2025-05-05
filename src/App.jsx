import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Dot,
} from "recharts";


function App() {

  const data = [
    {
      name: "Page A",
      uv: 4000,
      pv: 2400,
      amt: 2400,
    },
    {
      name: "Page B",
      uv: 3000,
      pv: 1398,
      amt: 2210,
    },
    {
      name: "Page C",
      uv: 2000,
      pv: 9800,
      amt: 2290,
    },
    {
      name: "Page D",
      uv: 2780,
      pv: 3908,
      amt: 2000,
    },
    {
      name: "Page E",
      uv: 1890,
      pv: 4800,
      amt: 2181,
    },
    {
      name: "Page F",
      uv: 2390,
      pv: 3800,
      amt: 2500,
    },
    {
      name: "Page G",
      uv: 3490,
      pv: 4300,
      amt: 2100,
    },
  ];

  let newData = data.map(item => ({
    ...item,
    zUv: calculateZScore(data, item.uv, 'uv'),
    zPv: calculateZScore(data, item.pv, 'pv')
  }))


  return (
    <div style={{ maxWidth: '1000px', margin: 'auto', display: 'flex', justifyContent: 'center', height: '100vh', alignItems: 'center' }}>
      <LineChart
        width={1000}
        height={500}
        data={newData}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey="pv"
          stroke="#8884d8"
          dot={<CustomizedDot dataKey="pv" />}
          activeDot={{ r: 8 }}
          shape={<CustomizedLine dataKey="pv" />}
        />
        <Line
          type="monotone"
          dataKey="uv"
          dot={<CustomizedDot dataKey="uv" />}
          stroke="#82ca9d"
          shape={<CustomizedLine dataKey="uv" />}
        />
      </LineChart>
    </div>
  );
}

export default App;

const CustomizedDot = (props) => {
  const { cx, cy, stroke, payload, dataKey } = props;
  const zScore = dataKey === 'pv' ? payload.zPv : payload.zUv;
  const fill = Math.abs(zScore) > 1 ? '#ff0000' : '#ffffff';

  return (
    <Dot
      cx={cx}
      cy={cy}
      r={5}
      stroke={stroke}
      strokeWidth={2}
      fill={fill}
    />
  );
};

const CustomizedLine = (props) => {
  const { points, stroke, dataKey } = props;
  const pathElements = [];

  for (let i = 0; i < points.length - 1; i++) {
    const start = points[i];
    const end = points[i + 1];
    const startZ = dataKey === 'pv' ? start.payload.zPv : start.payload.zUv;
    const endZ = dataKey === 'pv' ? end.payload.zPv : end.payload.zUv;
    const isHighlighted = Math.abs(startZ) > 1 || Math.abs(endZ) > 1;

    pathElements.push(
      <path
        key={`line-${i}`}
        d={`M${start.x},${start.y}L${end.x},${end.y}`}
        stroke={isHighlighted ? '#ff0000' : stroke}
        strokeWidth={2}
        fill="none"
      />
    );
  }

  return <g>{pathElements}</g>;
};



function calculateZScore(data, value, nameParams) {
  const mean = data.reduce((sum, x) => sum + x[nameParams], 0) / data.length;
  const squaredDifferences = data.map(x => Math.pow(x[nameParams] - mean, 2));
  const variance = squaredDifferences.reduce((sum, x) => sum + x, 0) / data.length;
  const stdDev = Math.sqrt(variance);
  return ((value - mean) / stdDev).toFixed(2)
}