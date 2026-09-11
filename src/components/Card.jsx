export default function Card({ children, className = '' }) {
  return (
    <div className={`bg-card rounded-lg shadow-sm border border-border p-6 ${className}`}>
      {children}
    </div>
  );
}

