import './DashBoard.css';
import { useEffect, useState } from 'react';
import AddTransactionForm from './AddTransactionForm';
import { supabase } from '../config/supabase';
import { 
  Plus, 
  TrendingUp, 
  TrendingDown, 
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  PiggyBank,
  CreditCard,
  BarChart3,
  RefreshCw
} from 'lucide-react';

function Dashboard() {
  const [saving, setSaving] = useState(0);
  const [income, setIncome] = useState(0);
  const [expence, setExpence] = useState(0);
  const [addTransaction, setAddTransaction] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  // Calculate percentage changes (you can modify these based on previous period data)
  const savingChange = 1.2;
  const incomeChange = -0.5;
  const expenseChange = 0.8;

  const handleAddTransaction = () => {
    setAddTransaction(!addTransaction);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const fetchSummary = async (showLoading = true) => {
    if (showLoading) setLoading(true);
    setError(null);
    
    const id = localStorage.getItem('user_id');
    if (!id) {
      setError('User ID not found');
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .schema('fintrack')
        .from('user_financial_summary')
        .select('*')
        .eq('user_id', id)
        .single();

      if (error) {
        throw new Error(error.message);
      }

      if (data) {
        setSaving(data.total_saving || 0);
        setIncome(data.total_income || 0);
        setExpence(data.total_expense || 0);
      }
    } catch (err) {
      console.error('Error fetching financial summary:', err);
      setError('Failed to load financial data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchSummary(false);
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  const handleSubmit = () => {
    console.log('Form submitted!');
    setAddTransaction(false);
    // Refresh data after adding transaction
    fetchSummary(false);
  };

  const netWorth = income - expence;
  const savingsRate = income > 0 ? ((saving / income) * 100).toFixed(1) : 0;

  if (error && !refreshing) {
    return (
      <div className="dashboard">
        <div className="dashboard-header">
          <h1>Dashboard</h1>
          <button className="add-button" onClick={handleRefresh}>
            <RefreshCw size={16} />
            Retry
          </button>
        </div>
        <div className="card error">
          <p className="card-title">Error</p>
          <p className="card-value">{error}</p>
          <button onClick={handleRefresh} className="card-change positive">
            Click to retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
      </div>

      <p className="subtitle">Here's an overview of your financial status</p>

      {/* Quick Stats Section */}
      <div className="quick-stats">
        <div className="quick-stat">
          <div className="quick-stat-value">{formatCurrency(netWorth)}</div>
          <div className="quick-stat-label">Net Worth</div>
        </div>
        <div className="quick-stat">
          <div className="quick-stat-value">{savingsRate}%</div>
          <div className="quick-stat-label">Savings Rate</div>
        </div>
        <div className="quick-stat">
          <div className="quick-stat-value">
            {income > 0 ? ((expence / income) * 100).toFixed(0) : 0}%
          </div>
          <div className="quick-stat-label">Expense Ratio</div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="dashboard-actions">
        <button className="action-button primary" onClick={handleAddTransaction}>
          <Plus size={18} />
          Quick Add
        </button>
        <button className="action-button" onClick={handleRefresh}>
          <RefreshCw size={18} className={refreshing ? 'animate-spin' : ''} />
          {refreshing ? 'Refreshing...' : 'Refresh'}
        </button>
        <button className="action-button">
          <BarChart3 size={18} />
          View Reports
        </button>
      </div>

      {addTransaction && <AddTransactionForm onSubmit={handleSubmit} />}

      <div className={`cards ${addTransaction ? 'faded' : ''}`}>
        <div className={`card ${loading ? 'loading' : ''}`}>
          <div className="card-title">
            <PiggyBank size={18} style={{ display: 'inline', marginRight: '0.5rem' }} />
            Total Savings
          </div>
          <div className="card-value">
            {loading ? '...' : formatCurrency(saving)}
          </div>
          <div className={`card-change ${savingChange >= 0 ? 'positive' : 'negative'}`}>
            {savingChange >= 0 ? (
              <ArrowUpRight size={16} />
            ) : (
              <ArrowDownRight size={16} />
            )}
            {Math.abs(savingChange)}% from last month
          </div>
        </div>

        <div className={`card ${loading ? 'loading' : ''}`}>
          <div className="card-title">
            <TrendingUp size={18} style={{ display: 'inline', marginRight: '0.5rem' }} />
            Total Income
          </div>
          <div className="card-value">
            {loading ? '...' : formatCurrency(income)}
          </div>
          <div className={`card-change ${incomeChange >= 0 ? 'positive' : 'negative'}`}>
            {incomeChange >= 0 ? (
              <ArrowUpRight size={16} />
            ) : (
              <ArrowDownRight size={16} />
            )}
            {Math.abs(incomeChange)}% from last month
          </div>
        </div>

        <div className={`card ${loading ? 'loading' : ''}`}>
          <div className="card-title">
            <CreditCard size={18} style={{ display: 'inline', marginRight: '0.5rem' }} />
            Total Expenses
          </div>
          <div className="card-value">
            {loading ? '...' : formatCurrency(expence)}
          </div>
          <div className={`card-change ${expenseChange >= 0 ? 'negative' : 'positive'}`}>
            {expenseChange >= 0 ? (
              <ArrowUpRight size={16} />
            ) : (
              <ArrowDownRight size={16} />
            )}
            {Math.abs(expenseChange)}% from last month
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;