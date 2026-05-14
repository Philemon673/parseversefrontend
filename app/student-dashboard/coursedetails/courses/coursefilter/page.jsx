import { Search, Filter } from "lucide-react";

export default function CourseFilters({ courseTabs, activeTab, onTabChange }) {
  return (
    <div className="bg-white flex items-center justify-between px-4 py-2 rounded-2xl border border-gray-100 shadow-sm">
      <div className="flex items-center gap-1">
        {courseTabs.map((tab) => (
          <button
            key={tab.label}
            onClick={() => onTabChange(tab.label)}
            className={
              "flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg transition " +
              (activeTab === tab.label
                ? "text-indigo-600 border-b-2 border-indigo-600"
                : "text-gray-400 hover:text-gray-600")
            }
          >
            {tab.label}
            <span className={
              "text-[10px] font-bold px-1.5 py-0.5 rounded-full " +
              (activeTab === tab.label ? "bg-indigo-100 text-indigo-600" : "bg-gray-100 text-gray-400")
            }>
              {tab.count}
            </span>
          </button>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
          <input
            type="text"
            placeholder="Search my courses..."
            className="pl-8 pr-4 py-2 rounded-xl border border-gray-200 bg-white text-xs focus:outline-none focus:ring-2 focus:ring-indigo-300 placeholder-gray-400 w-44"
          />
        </div>
        <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-gray-200 bg-white text-xs font-medium text-gray-600 hover:bg-gray-50 transition">
          <Filter className="w-3.5 h-3.5" />
          Filter
        </button>
      </div>
    </div>
  );
}