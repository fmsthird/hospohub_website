import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";
import { CASE_CATEGORIES, CASE_STATUSES } from "../../data/staffRoles";
import { groupCases } from "../../utils/staffDataHelpers";
import { Panel, Empty } from "./StaffUI";
const palette = {
  text: '#475569',
  grid: '#e2e8f0',
  surface: '#ffffff',
  series: ['#008fc9', '#b7791f', '#0d9488', '#8b76c4', '#e06d71', '#64748b'],
};
const tooltipStyle = (palette) => ({
  backgroundColor: palette.surface,
  border: `1px solid ${palette.grid}`,
  color: palette.text,
  borderRadius: 8,
});
export function ReceivedChart({
  rows,
  title = "Applications received",
  period = "Last 30 days",
}) {
  const colours = palette.series;
  const total = rows.reduce(
    (sum, row) =>
      sum + CASE_CATEGORIES.reduce((count, key) => count + row[key], 0),
    0,
  );
  return (
    <Panel title={title}>
      <p className="-mt-2 mb-3 text-xs text-slate-500">
        {period} · {total} applications
      </p>
      {!total ? (
        <Empty>No report data for this period.</Empty>
      ) : (
        <div
          className="h-72 min-w-0"
          role="img"
          aria-label={`${title}: ${total} applications in ${period}`}
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={rows}
              margin={{ left: -25, right: 10, top: 10 }}
              accessibilityLayer
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke={palette.grid}
              />
              <XAxis
                dataKey="date"
                tickFormatter={(value) => value.slice(5)}
                minTickGap={35}
                tick={{ fontSize: 11, fill: palette.text }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                allowDecimals={false}
                tick={{ fontSize: 11, fill: palette.text }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={tooltipStyle(palette)}
                labelStyle={{ color: palette.text }}
                itemStyle={{ color: palette.text }}
              />
              <Legend
                wrapperStyle={{
                  fontSize: 11,
                  paddingTop: 16,
                  color: palette.text,
                }}
                formatter={(value) => (
                  <span style={{ color: palette.text }}>{value}</span>
                )}
              />
              {CASE_CATEGORIES.map((category, index) => (
                <Line
                  key={category}
                  type="monotone"
                  dataKey={category}
                  stroke={colours[index]}
                  strokeWidth={2.5}
                  dot={false}
                  isAnimationActive={false}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
      <details className="mt-3 text-xs text-slate-500">
        <summary className="cursor-pointer">View chart data</summary>
        <div className="mt-2 max-h-48 overflow-auto">
          <table className="w-full text-left">
            <thead>
              <tr>
                <th>Date</th>
                {CASE_CATEGORIES.map((category) => (
                  <th key={category}>{category}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.date}>
                  <td>{row.date}</td>
                  {CASE_CATEGORIES.map((category) => (
                    <td key={category}>{row[category]}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </Panel>
  );
}
export function StatusChart({ cases, title = "Application status" }) {
  const colours = palette.series;
  const rows = groupCases(cases, "status", CASE_STATUSES);
  return (
    <Panel title={title}>
      {cases.length ? (
        <div
          className="relative h-52"
          role="img"
          aria-label={`Application statuses, ${cases.length} total`}
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={rows}
                dataKey="value"
                nameKey="name"
                innerRadius={61}
                outerRadius={84}
                paddingAngle={2}
                stroke={palette.surface}
                isAnimationActive={false}
              >
                {rows.map((row, index) => (
                  <Cell key={row.name} fill={colours[index]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={tooltipStyle(palette)}
                itemStyle={{ color: palette.text }}
              />
            </PieChart>
          </ResponsiveContainer>
          <span className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <strong className="text-2xl">{cases.length}</strong>
            <span className="text-xs text-slate-500">
              applications
            </span>
          </span>
        </div>
      ) : (
        <Empty>No report data.</Empty>
      )}
      <ul className="mt-3 space-y-2">
        {rows.map((row, index) => (
          <li key={row.name} className="flex items-center gap-2 text-xs">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: colours[index] }}
            />
            <span className="text-slate-500">
              {row.name}
            </span>
            <strong className="ml-auto">{row.value}</strong>
          </li>
        ))}
      </ul>
    </Panel>
  );
}
export function CountChart({ title, rows }) {
  const colours = palette.series;
  return (
    <Panel title={title}>
      {rows.some((row) => row.value > 0) ? (
        <div
          className="h-56"
          role="img"
          aria-label={`${title}: ${rows.map((row) => `${row.name} ${row.value}`).join(", ")}`}
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={rows}
              margin={{ left: -20, bottom: 15 }}
              accessibilityLayer
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke={palette.grid}
              />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 10, fill: palette.text }}
                stroke={palette.grid}
                interval={0}
                tickFormatter={(value) =>
                  value.length > 18 ? `${value.slice(0, 16)}…` : value
                }
              />
              <YAxis
                allowDecimals={false}
                tick={{ fontSize: 11, fill: palette.text }}
                stroke={palette.grid}
              />
              <Tooltip
                contentStyle={tooltipStyle(palette)}
                labelStyle={{ color: palette.text }}
                itemStyle={{ color: palette.text }}
                cursor={{ fill: palette.grid, opacity: 0.3 }}
              />
              <Bar
                dataKey="value"
                name="Applications"
                radius={[4, 4, 0, 0]}
                isAnimationActive={false}
              >
                {rows.map((row, index) => (
                  <Cell key={row.name} fill={colours[index % colours.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <Empty>No report data.</Empty>
      )}
      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
        {rows.map((row) => (
          <span key={row.name}>
            {row.name}:{" "}
            <strong className="text-slate-700">
              {row.value}
            </strong>
          </span>
        ))}
      </div>
    </Panel>
  );
}
