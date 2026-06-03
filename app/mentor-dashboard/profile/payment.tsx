"use client";

import { useState, useMemo } from "react";
import { DollarSign, TrendingUp, Clock, Hash, ChevronDown, X, Check, Plus } from "lucide-react";

/* ─── Types ──────────────────────────────────────────────────────────────── */
type TxStatus = "Completed" | "Paid" | "Pending";
type TxType   = "Session Payment" | "Payout to Bank" | "Refund";

interface Transaction {
  id: number;
  date: string;
  description: TxType;
  session: string;
  amount: number;
  status: TxStatus;
}

const statusStyles: Record<TxStatus, string> = {
  Completed: "bg-green-50 text-green-600",
  Paid:      "bg-blue-50  text-blue-600",
  Pending:   "bg-yellow-50 text-yellow-600",
};

const TX_TYPES: TxType[]     = ["Session Payment", "Payout to Bank", "Refund"];
const TX_STATUSES: TxStatus[] = ["Completed", "Paid", "Pending"];
const ITEMS_PER_PAGE = 5;

const initTransactions: Transaction[] = [
  { id: 1,  date: "18 May 2024", description: "Session Payment", session: "Sarah Ahmed (Mathematics)",       amount:  60,   status: "Completed" },
  { id: 2,  date: "17 May 2024", description: "Session Payment", session: "Rafiq Islam (Physics)",           amount:  60,   status: "Completed" },
  { id: 3,  date: "16 May 2024", description: "Payout to Bank",  session: "Bank **** 1234",                  amount: -300,  status: "Paid"      },
  { id: 4,  date: "15 May 2024", description: "Session Payment", session: "Nusrat Jahan (Computer Science)", amount:  60,   status: "Completed" },
  { id: 5,  date: "14 May 2024", description: "Session Payment", session: "Imtiaz Hasan (Mathematics)",      amount:  60,   status: "Completed" },
  { id: 6,  date: "13 May 2024", description: "Session Payment", session: "Sarah Ahmed (Physics)",           amount:  60,   status: "Completed" },
  { id: 7,  date: "12 May 2024", description: "Payout to Bank",  session: "Bank **** 1234",                  amount: -200,  status: "Paid"      },
  { id: 8,  date: "10 May 2024", description: "Session Payment", session: "Rafiq Islam (Mathematics)",       amount:  60,   status: "Pending"   },
  { id: 9,  date: "08 May 2024", description: "Refund",          session: "Rahim Hossain",                   amount: -60,   status: "Completed" },
  { id: 10, date: "06 May 2024", description: "Session Payment", session: "Imtiaz Hasan (Physics)",          amount:  60,   status: "Completed" },
];

/* ─── Add Transaction Modal ──────────────────────────────────────────────── */
function AddTxModal({ onSave, onClose }: { onSave: (t: Omit<Transaction, "id">) => void; onClose: () => void }) {
  const [date, setDate]            = useState("");
  const [desc, setDesc]            = useState<TxType>("Session Payment");
  const [session, setSession]      = useState("");
  const [amount, setAmount]        = useState("");
  const [status, setStatus]        = useState<TxStatus>("Completed");
  const [error, setError]          = useState("");

  const handleSave = () => {
    const amt = parseFloat(amount);
    if (!date.trim() || !session.trim() || isNaN(amt)) {
      setError("Date, session/description, and a valid amount are required.");
      return;
    }
    onSave({ date: date.trim(), description: desc, session: session.trim(), amount: amt, status });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-[440px] flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-gray-800">Add Transaction</h3>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-100 text-gray-400"><X className="w-4 h-4" /></button>
        </div>
        <div className="flex flex-col gap-3">
          <div className="flex gap-3">
            <div className="flex-1 flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-700">Date</label>
              <input value={date} onChange={(e) => { setDate(e.target.value); setError(""); }} placeholder="e.g. 18 May 2024" className="px-3 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-400" />
            </div>
            <div className="flex-1 flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-700">Type</label>
              <select value={desc} onChange={(e) => setDesc(e.target.value as TxType)} className="px-3 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white">
                {TX_TYPES.map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-gray-700">Session / Description</label>
            <input value={session} onChange={(e) => { setSession(e.target.value); setError(""); }} placeholder="e.g. Sarah Ahmed (Mathematics)" className="px-3 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-400" />
          </div>
          <div className="flex gap-3">
            <div className="flex-1 flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-700">Amount ($) — use negative for payouts</label>
              <input type="number" value={amount} onChange={(e) => { setAmount(e.target.value); setError(""); }} placeholder="e.g. 60 or -300" className="px-3 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-400" />
            </div>
            <div className="flex-1 flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-700">Status</label>
              <select value={status} onChange={(e) => setStatus(e.target.value as TxStatus)} className="px-3 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white">
                {TX_STATUSES.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>
          {error && <p className="text-xs text-red-500">{error}</p>}
        </div>
        <div className="flex gap-2 justify-end">
          <button onClick={onClose} className="px-4 py-2 rounded-xl border border-gray-200 text-gray-600 text-xs font-semibold hover:bg-gray-50 transition">Cancel</button>
          <button onClick={handleSave} className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 transition">
            <Check className="w-3.5 h-3.5" /> Add
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Main ───────────────────────────────────────────────────────────────── */
let txIdCounter = initTransactions.length + 1;

export default function PaymentTab() {
  const [transactions, setTransactions] = useState<Transaction[]>(initTransactions);
  const [page, setPage]                 = useState(1);
  const [filterStatus, setFilterStatus] = useState<TxStatus | "All">("All");
  const [filterType,   setFilterType]   = useState<TxType | "All">("All");
  const [showAddModal, setShowAddModal] = useState(false);

  /* Derived stats from actual transaction data */
  const stats = useMemo(() => {
    const income = transactions.filter((t) => t.amount > 0).reduce((s, t) => s + t.amount, 0);
    const pending = transactions.filter((t) => t.status === "Pending" && t.amount > 0).reduce((s, t) => s + t.amount, 0);
    const sessions = transactions.filter((t) => t.description === "Session Payment").length;
    // crude "this month" — last 5 income records
    const thisMonth = transactions.filter((t) => t.amount > 0).slice(0, 5).reduce((s, t) => s + t.amount, 0);
    return { income, pending, sessions, thisMonth };
  }, [transactions]);

  const statsCards = [
    { icon: <DollarSign className="w-4 h-4 text-indigo-500" />, bg: "bg-indigo-50", label: "Total Earnings",  value: `$${stats.income.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,   sub: "All time" },
    { icon: <TrendingUp  className="w-4 h-4 text-green-500" />, bg: "bg-green-50",  label: "This Month",     value: `$${stats.thisMonth.toFixed(2)}`,   sub: "Recent sessions" },
    { icon: <Clock       className="w-4 h-4 text-orange-400"/>, bg: "bg-orange-50", label: "Pending Payout", value: `$${stats.pending.toFixed(2)}`,     sub: "Awaiting payment" },
    { icon: <Hash        className="w-4 h-4 text-purple-500"/>, bg: "bg-purple-50", label: "Total Sessions", value: String(stats.sessions),              sub: "All time" },
  ];

  const addTransaction = (t: Omit<Transaction, "id">) => {
    setTransactions((prev) => [{ id: txIdCounter++, ...t }, ...prev]);
    setShowAddModal(false);
    setPage(1);
  };

  const updateTxStatus = (id: number, status: TxStatus) =>
    setTransactions((prev) => prev.map((t) => (t.id === id ? { ...t, status } : t)));

  const deleteTx = (id: number) =>
    setTransactions((prev) => prev.filter((t) => t.id !== id));

  const filtered = transactions.filter((t) => {
    const matchS = filterStatus === "All" || t.status === filterStatus;
    const matchT = filterType   === "All" || t.description === filterType;
    return matchS && matchT;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const curPage    = Math.min(page, totalPages);
  const paginated  = filtered.slice((curPage - 1) * ITEMS_PER_PAGE, curPage * ITEMS_PER_PAGE);

  return (
    <>
      {showAddModal && <AddTxModal onSave={addTransaction} onClose={() => setShowAddModal(false)} />}

      <div className="flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-sm font-bold text-gray-800">Earnings Overview</h3>
            <p className="text-xs text-gray-400 mt-0.5">Track your earnings and payment history</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 transition shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" /> Withdrawals
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-3">
          {statsCards.map(({ icon, bg, label, value, sub }) => (
            <div key={label} className="border border-gray-100 rounded-2xl p-3 bg-white flex flex-col gap-2">
              <div className={`w-8 h-8 rounded-xl ${bg} flex items-center justify-center`}>{icon}</div>
              <div>
                <p className="text-xs text-gray-400">{label}</p>
                <p className="text-base font-bold text-gray-800 leading-tight">{value}</p>
                <p className="text-[10px] text-gray-400">{sub}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Transactions */}
        <div className="border border-gray-100 rounded-2xl p-4 bg-white">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-bold text-gray-800">Recent Transactions</h4>
            <div className="flex items-center gap-2">
              {/* Status filter */}
              <div className="relative">
                <select
                  value={filterStatus}
                  onChange={(e) => { setFilterStatus(e.target.value as TxStatus | "All"); setPage(1); }}
                  className="appearance-none pl-3 pr-7 py-1.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white text-gray-600"
                >
                  <option value="All">All Status</option>
                  {TX_STATUSES.map((s) => <option key={s}>{s}</option>)}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none" />
              </div>
              {/* Type filter */}
              <div className="relative">
                <select
                  value={filterType}
                  onChange={(e) => { setFilterType(e.target.value as TxType | "All"); setPage(1); }}
                  className="appearance-none pl-3 pr-7 py-1.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white text-gray-600"
                >
                  <option value="All">All Types</option>
                  {TX_TYPES.map((t) => <option key={t}>{t}</option>)}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {paginated.length === 0 ? (
            <div className="py-8 text-center text-xs text-gray-400">No transactions found.</div>
          ) : (
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left pb-2 text-gray-400 font-semibold">Date</th>
                  <th className="text-left pb-2 text-gray-400 font-semibold">Description</th>
                  <th className="text-left pb-2 text-gray-400 font-semibold">Session / Student</th>
                  <th className="text-left pb-2 text-gray-400 font-semibold">Amount</th>
                  <th className="text-left pb-2 text-gray-400 font-semibold">Status</th>
                  <th className="text-left pb-2 text-gray-400 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((t) => (
                  <tr key={t.id} className="border-b border-gray-50 last:border-b-0 hover:bg-gray-50/50 transition">
                    <td className="py-2.5 text-gray-500">{t.date}</td>
                    <td className="py-2.5 text-gray-700 font-medium">{t.description}</td>
                    <td className="py-2.5 text-gray-500">{t.session}</td>
                    <td className={`py-2.5 font-semibold ${t.amount < 0 ? "text-red-500" : "text-green-600"}`}>
                      {t.amount < 0 ? `-$${Math.abs(t.amount).toFixed(2)}` : `+$${t.amount.toFixed(2)}`}
                    </td>
                    <td className="py-2.5">
                      <select
                        value={t.status}
                        onChange={(e) => updateTxStatus(t.id, e.target.value as TxStatus)}
                        className={`text-[10px] font-semibold rounded-full px-2 py-0.5 border-0 focus:outline-none focus:ring-1 focus:ring-indigo-400 cursor-pointer ${statusStyles[t.status]}`}
                      >
                        {TX_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                    <td className="py-2.5">
                      <button
                        onClick={() => deleteTx(t.id)}
                        className="p-1 rounded-lg hover:bg-red-50 text-red-400 transition"
                        title="Delete"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* Pagination */}
          <div className="flex items-center justify-between mt-3 text-xs text-gray-400 pt-3 border-t border-gray-50">
            <span>
              Showing {filtered.length === 0 ? 0 : (curPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(curPage * ITEMS_PER_PAGE, filtered.length)} of {filtered.length}
            </span>
            <div className="flex items-center gap-1">
              <button
                disabled={curPage === 1}
                onClick={() => setPage((p) => p - 1)}
                className="w-6 h-6 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 disabled:opacity-40"
              >‹</button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-6 h-6 rounded-lg text-xs font-medium transition ${p === curPage ? "bg-indigo-600 text-white" : "border border-gray-200 text-gray-500 hover:bg-gray-50"}`}
                >{p}</button>
              ))}
              <button
                disabled={curPage === totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="w-6 h-6 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 disabled:opacity-40"
              >›</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}