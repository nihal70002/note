import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const emptyForm = {
  title: '',
  category: 'Printing',
  amount: '',
  notes: '',
  expenseDate: new Date().toISOString().split('T')[0],
};

const Expenses = () => {
  const { token } = useAuth();
  const [form, setForm] = useState(emptyForm);
  const [expenses, setExpenses] = useState([]);
  const [totals, setTotals] = useState({ totalRevenue: 0, totalExpenses: 0, netProfit: 0 });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const formatINR = (value) => `₹${Number(value || 0).toFixed(2)}`;

  const categoryOptions = useMemo(() => ([
    'Printing',
    'Website Maintenance',
    'Cover Design',
    'Packaging',
    'Shipping',
    'Marketing',
    'Other',
  ]), []);

  const fetchExpenses = async () => {
    try {
      const response = await fetch('http://localhost:5009/api/admin/expenses', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) return;
      const data = await response.json();
      setExpenses(data.items || []);
      setTotals({
        totalRevenue: data.totals?.totalRevenue || 0,
        totalExpenses: data.totals?.totalExpenses || 0,
        netProfit: data.totals?.netProfit || 0,
      });
    } catch (error) {
      console.error('Failed to fetch expenses:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, [token]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage('');
    setSaving(true);

    try {
      const response = await fetch('http://localhost:5009/api/admin/expenses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: form.title,
          category: form.category,
          amount: Number(form.amount),
          notes: form.notes,
          expenseDate: form.expenseDate,
        }),
      });

      if (response.ok) {
        setForm(emptyForm);
        setMessage('Expense added successfully.');
        await fetchExpenses();
      } else {
        const error = await response.json();
        setMessage(error.message || 'Could not save expense.');
      }
    } catch (error) {
      console.error('Failed to save expense:', error);
      setMessage('Could not save expense.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-taupe p-8">Loading expenses...</div>;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="font-serif text-2xl sm:text-3xl text-ink">Expenses & Profit</h1>
        <p className="text-sm text-taupe mt-1">Track printing, maintenance, design and other business costs.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-paper border border-taupe/10 p-5 rounded-sm">
          <p className="text-xs uppercase tracking-widest text-taupe">Revenue</p>
          <p className="font-serif text-2xl text-ink mt-2">{formatINR(totals.totalRevenue)}</p>
        </div>
        <div className="bg-paper border border-taupe/10 p-5 rounded-sm">
          <p className="text-xs uppercase tracking-widest text-taupe">Expenses</p>
          <p className="font-serif text-2xl text-red-600 mt-2">{formatINR(totals.totalExpenses)}</p>
        </div>
        <div className="bg-paper border border-taupe/10 p-5 rounded-sm">
          <p className="text-xs uppercase tracking-widest text-taupe">Net Profit</p>
          <p className={`font-serif text-2xl mt-2 ${totals.netProfit >= 0 ? 'text-green-700' : 'text-red-600'}`}>
            {formatINR(totals.netProfit)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <form onSubmit={handleSubmit} className="bg-paper border border-taupe/10 rounded-sm p-5 space-y-4">
          <h2 className="font-serif text-xl text-ink">Add Expense</h2>
          <input
            required
            value={form.title}
            onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
            placeholder="Expense title"
            className="w-full border border-taupe/20 px-3 py-2 rounded-sm text-sm bg-transparent"
          />
          <select
            value={form.category}
            onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))}
            className="w-full border border-taupe/20 px-3 py-2 rounded-sm text-sm bg-transparent"
          >
            {categoryOptions.map((category) => <option key={category} value={category}>{category}</option>)}
          </select>
          <input
            required
            min="0.01"
            step="0.01"
            type="number"
            value={form.amount}
            onChange={(e) => setForm((prev) => ({ ...prev, amount: e.target.value }))}
            placeholder="Amount in INR"
            className="w-full border border-taupe/20 px-3 py-2 rounded-sm text-sm bg-transparent"
          />
          <input
            type="date"
            value={form.expenseDate}
            onChange={(e) => setForm((prev) => ({ ...prev, expenseDate: e.target.value }))}
            className="w-full border border-taupe/20 px-3 py-2 rounded-sm text-sm bg-transparent"
          />
          <textarea
            value={form.notes}
            onChange={(e) => setForm((prev) => ({ ...prev, notes: e.target.value }))}
            placeholder="Notes (optional)"
            rows={3}
            className="w-full border border-taupe/20 px-3 py-2 rounded-sm text-sm bg-transparent"
          />
          <button
            type="submit"
            disabled={saving}
            className="w-full px-4 py-2.5 bg-ink text-paper rounded-sm hover:bg-ink/90 transition-colors disabled:opacity-70"
          >
            {saving ? 'Saving...' : 'Add Expense'}
          </button>
          {message && <p className="text-sm text-taupe">{message}</p>}
        </form>

        <div className="lg:col-span-2 bg-paper border border-taupe/10 rounded-sm overflow-hidden">
          <div className="p-4 border-b border-taupe/10">
            <h2 className="font-serif text-xl text-ink">Recent Expenses</h2>
          </div>
          {expenses.length === 0 ? (
            <div className="p-6 text-sm text-taupe">No expenses added yet.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left min-w-[640px]">
                <thead>
                  <tr className="bg-cream/40 text-xs uppercase tracking-widest text-taupe border-b border-taupe/10">
                    <th className="p-4 font-medium">Date</th>
                    <th className="p-4 font-medium">Title</th>
                    <th className="p-4 font-medium">Category</th>
                    <th className="p-4 font-medium">Notes</th>
                    <th className="p-4 font-medium text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-taupe/10">
                  {expenses.map((expense) => (
                    <tr key={expense.id}>
                      <td className="p-4 text-sm text-ink">{new Date(expense.expenseDate).toLocaleDateString('en-IN')}</td>
                      <td className="p-4 text-sm text-ink font-medium">{expense.title}</td>
                      <td className="p-4 text-sm text-taupe">{expense.category}</td>
                      <td className="p-4 text-sm text-taupe">{expense.notes || '-'}</td>
                      <td className="p-4 text-sm text-right text-red-600">{formatINR(expense.amount)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Expenses;
