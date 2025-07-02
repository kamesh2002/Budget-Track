import React, { useEffect, useState } from 'react';
import AddTransactionForm from './AddTransactionForm';
import './Transactions.css';
import { supabase } from '../config/supabase';

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [addTransaction, setAddTransaction] = useState(false);
  const [selectedTab, setSelectedTab] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile screen
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const fetchTransactions = async () => {
    setIsLoading(true);
    const user_id = localStorage.getItem('user_id');

    try {
      const { data, error } = await supabase
        .schema('fintrack')
        .from('transactions')
        .select(`
          id,
          transaction_date,
          description,
          amount,
          type,
          category:category_id (name)
        `)
        .eq('user_id', user_id)
        .order('transaction_date', { ascending: false });

      if (error) {
        console.error("Error fetching transactions:", error.message);
      } else {
        setTransactions(data || []);
      }
    } catch (err) {
      console.error("Unexpected error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleAddTransaction = () => {
    setAddTransaction(prev => !prev);
  };

  const handleSubmit = async (data) => {
    console.log("Form submitted!", data);
    await fetchTransactions(); 
    setAddTransaction(false);
  };

  const handleTabChange = (tab) => {
    setSelectedTab(tab);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredTransactions = transactions.filter(txn => {
    const matchesTab = selectedTab === 'All' || 
      (selectedTab === 'Income' && txn.type === 'income') ||
      (selectedTab === 'Expenses' && txn.type === 'expense');
    
    const matchesSearch = !searchTerm || 
      txn.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      txn.category?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesTab && matchesSearch;
  });

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatAmount = (amount, type) => {
    const formattedAmount = Math.abs(amount).toFixed(2);
    if (type === 'income') return `+₹${formattedAmount}`;
    if (type === 'expense') return `-₹${formattedAmount}`;
    return `+₹${formattedAmount}`;
  };

  const renderMobileCard = (txn) => (
    <div key={txn.id} className={`transaction-card ${txn.type}`}>
      <div className="card-header">
        <span className="card-date">{formatDate(txn.transaction_date)}</span>
        <span className={`card-amount ${txn.type}-amount`}>
          {formatAmount(txn.amount, txn.type)}
        </span>
      </div>
      <div className="card-description">{txn.description}</div>
      <div className="card-footer">
        <span className="card-category">{txn.category?.name || 'Unknown'}</span>
        <span className="status">{txn.status || 'Completed'}</span>
      </div>
    </div>
  );

  const renderDesktopTable = () => (
    <div className="table-container">
      <table className="transactions-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Category</th>
            <th>Description</th>
            <th>Amount</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {filteredTransactions.map((txn) => (
            <tr key={txn.id}>
              <td>{formatDate(txn.transaction_date)}</td>
              <td>{txn.category?.name || 'Unknown'}</td>
              <td>{txn.description}</td>
              <td className={`${txn.type}-amount`}>
                {formatAmount(txn.amount, txn.type)}
              </td>
              <td><span className="status">{txn.status || 'Completed'}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderEmptyState = () => (
    <div className="empty-state">
      <h3>No transactions found</h3>
      <p>
        {searchTerm 
          ? `No transactions match "${searchTerm}"`
          : selectedTab === 'All' 
            ? "You haven't made any transactions yet."
            : `No ${selectedTab.toLowerCase()} transactions found.`
        }
      </p>
    </div>
  );

  if (isLoading) {
    return (
      <div className="transactions-container">
        <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
          <div style={{ 
            fontSize: '1.25rem', 
            color: '#6b7280',
            marginBottom: '0.5rem'
          }}>
            Loading transactions...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="transactions-container">
      <h1 className="title">Transactions</h1>

      <div className="top-bar">
        <input 
          type="text" 
          placeholder="Search transactions..." 
          className="search-input"
          value={searchTerm}
          onChange={handleSearchChange}
          autoComplete="off"
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck="false"
        />
        <button 
          className="new-transaction" 
          onClick={handleAddTransaction}
          style={{
            backgroundColor: addTransaction ? '#dc2626' : '#3b82f6'
          }}
        >
          {addTransaction ? 'Cancel' : 'New Transaction'}
        </button>
      </div>

      {addTransaction && <AddTransactionForm onSubmit={handleSubmit} />}

      <div className="tabs">
        {['All', 'Income', 'Expenses'].map(tab => (
          <span
            key={tab}
            className={`tab ${selectedTab === tab ? 'active' : ''}`}
            onClick={() => handleTabChange(tab)}
          >
            {tab}
          </span>
        ))}
      </div>

      {filteredTransactions.length === 0 ? (
        renderEmptyState()
      ) : (
        <>
          {/* Desktop Table View */}
          {!isMobile && renderDesktopTable()}
          
          {/* Mobile Card View */}
          {isMobile && (
            <div className="mobile-card">
              {filteredTransactions.map(renderMobileCard)}
            </div>
          )}
        </>
      )}
    </div>
  );
}