import { useState } from 'react';
import './AddTransactionForm.css';
import { supabase } from '../config/supabase';

const categories = [
  { name: "Entertainment", type: "expense" },
  { name: "Side Hustle", type: "income" },
  { name: "Personal Care", type: "expense" },
  { name: "Food & Dining", type: "expense" },
  { name: "Gifts & Donations", type: "expense" },
  { name: "Groceries", type: "expense" },
  { name: "Subscriptions", type: "expense" },
  { name: "Shopping", type: "expense" },
  { name: "Emergency Fund", type: "saving" },
  { name: "Business", type: "income" },
  { name: "Rent/Mortgage", type: "expense" },
  { name: "Education Fund", type: "saving" },
  { name: "Fuel", type: "expense" },
  { name: "Vacation Fund", type: "saving" },
  { name: "Health & Medical", type: "expense" },
  { name: "Insurance", type: "expense" },
  { name: "Other Income", type: "income" },
  { name: "Other Expenses", type: "expense" },
  { name: "Freelance", type: "income" },
  { name: "Investment", type: "saving" },
  { name: "Retirement", type: "saving" },
  { name: "Transportation", type: "expense" },
  { name: "Utilities", type: "expense" },
  { name: "Salary", type: "income" },
];

function AddTransactionForm({ onSubmit }) {
  const [data, setData] = useState({
    title: '',
    amount: '',
    category: '',
    type: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const getCategoryId = async (categoryName, categoryType) => {
    const { data, error } = await supabase
      .schema('fintrack')
      .from('categories')
      .select('id')
      .match({ name: categoryName, type: categoryType })
      .single();

    if (error) {
      console.error('Error fetching category ID:', error.message);
      return null;
    }

    return data?.id;
  };

  const handleSubmit = async () => {
  if (!data.title || !data.amount || !data.category || !data.type) {
    alert('Please fill in all fields.');
    return;
  }

  const categoryId = await getCategoryId(data.category, data.type);

  if (!categoryId) {
    alert('Invalid category. Please choose a valid one.');
    return;
  }

  const user_id = localStorage.getItem("user_id");

  const { error } = await supabase
    .schema('fintrack')
    .from('transactions')
    .insert([
      {
        user_id,
        category_id: categoryId,
        amount: parseFloat(data.amount),
        description: data.title,
        type: data.type,
      },
    ]);

  if (error) {
    console.error("Error inserting transaction:", error.message);
    alert("Something went wrong while adding the transaction.");
    return;
  }

  const transaction = {
    ...data,
    category_id: categoryId
  };

  onSubmit(transaction);
  setData({ title: '', amount: '', category: '', type: '' });
};

  return (
    <div className="add-transaction-form">
      <input
        type="text"
        name="title"
        placeholder="Title"
        value={data.title}
        onChange={handleChange}
      />
      <input
        type="number"
        name="amount"
        placeholder="Amount"
        value={data.amount}
        onChange={handleChange}
        min="0.01"
        step="0.01"
      />
      <select name="type" value={data.type} onChange={handleChange}>
        <option value="">Select Type</option>
        <option value="income">Income</option>
        <option value="expense">Expense</option>
        <option value="saving">Saving</option>
      </select>
      <select name="category" value={data.category} onChange={handleChange}>
        <option value="">Select Category</option>
        {categories
          .filter((cat) => cat.type === data.type)
          .map((cat) => (
            <option key={cat.name} value={cat.name}>
              {cat.name}
            </option>
          ))}
      </select>
      <button className="submit-button" onClick={handleSubmit}>
        Submit
      </button>
    </div>
  );
}

export default AddTransactionForm;
