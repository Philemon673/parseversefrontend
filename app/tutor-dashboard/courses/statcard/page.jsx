export default function StatCard({ label, value, growth, growthColor, icon: IconComponent, iconBg, iconColor }) {
  return (
    <div className="flex-1 bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-4 flex items-center justify-between">
      <div>
        <p className="text-gray-400 text-xs font-medium">{label}</p>
        <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        {growth && (
          <p className={`text-xs font-semibold mt-0.5 ${growthColor}`}>
            {growth}
          </p>
        )}
      </div>
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${iconBg}`}>
        <IconComponent className={`w-7 h-7 ${iconColor}`} />
      </div>
    </div>
  );
}
