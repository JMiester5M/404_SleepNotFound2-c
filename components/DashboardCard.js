// DashboardCard component - displays a stat card on the home page
export default function DashboardCard({ title, value, color = "#333" }) {
  return (
    <div className="dashboard-card">
      <h2 className="card-value" style={{ color }}>{value}</h2>
      <p className="card-title">{title}</p>
    </div>
  );
}
