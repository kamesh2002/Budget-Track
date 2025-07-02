import './Report.css';
import IncomeExpenseSavingOverTime from "./Chart/IncomeExpenseSavingOverTime";
import CategoryDistribution from "./Chart/CategoryDistribution";
import MonthlyIncomeExpense from "./Chart/MonthlyIncomeExpense";
import SavingsGrowth from "./Chart/SavingsGrowth";

function Reports() {
    return (
        <div className="reports-container">
            <div className="reports-header">
                <h1 className="reports-title">Financial Reports</h1>
                <p className="reports-subtitle">Your complete financial overview and analytics</p>
            </div>
            
            <div className="reports-grid">
                {/* Income, Expense & Savings Over Time Chart */}
                <div className="chart-wrapper">
                    <div className="chart-header">
                        <h3 className="chart-title">Income, Expense & Savings Over Time</h3>
                    </div>
                    <div className="chart-content">
                        <IncomeExpenseSavingOverTime />
                    </div>
                </div>

                {/* Monthly Income vs Expense Chart */}
                <div className="chart-wrapper">
                    <div className="chart-header">
                        <h3 className="chart-title">Monthly Income vs Expense</h3>
                    </div>
                    <div className="chart-content">
                        <MonthlyIncomeExpense />
                    </div>
                </div>

                {/* Category Distribution Chart */}
                <div className="chart-wrapper">
                    <div className="chart-header">
                        <h3 className="chart-title">Expense Category Distribution</h3>
                    </div>
                    <div className="chart-content">
                        <CategoryDistribution />
                    </div>
                </div>

                {/* Savings Growth Chart */}
                <div className="chart-wrapper">
                    <div className="chart-header">
                        <h3 className="chart-title">Savings Growth Tracker</h3>
                    </div>
                    <div className="chart-content">
                        <SavingsGrowth />
                    </div>
                </div>
            </div>

            {/* Summary Section */}
            <div className="reports-summary">
                <div className="summary-card">
                    <h3>Quick Insights</h3>
                    <ul>
                        <li>Track your financial trends over time</li>
                        <li>Monitor spending patterns by category</li>
                        <li>Analyze monthly income vs expenses</li>
                        <li>Watch your savings grow consistently</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default Reports;