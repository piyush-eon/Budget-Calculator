import React, { useState, useEffect } from "react";
import "./App.css";
import ExpenseList from "./components/ExpenseList";
import ExpenseForm from "./components/ExpenseForm";
import Alert from "./components/Alert";
import uuid from "uuid/v4";

const initialExpenses = localStorage.getItem("expenses")
  ? JSON.parse(localStorage.getItem("expenses"))
  : [];

function App() {
  // *************** state values ******************
  const [expenses, setExpenses] = useState(initialExpenses);
  const [charge, setCharge] = useState("");
  const [amount, setAmount] = useState("");
  const [alert, setAlert] = useState({ show: false });
  const [edit, setEdit] = useState(false);
  const [id, setId] = useState(0);

  // *************** useEffect *********************
  useEffect(() => {
    console.log("we called useEffect");
    localStorage.setItem("expenses", JSON.stringify(expenses));
  }, [expenses]);
  // *************** functionality *****************

  // handle Charge
  const handleCharge = (e) => {
    console.log(`Charge : ${e.target.value}`);
    setCharge(e.target.value);
  };

  // handle Amount
  const handleAmount = (e) => {
    console.log(`Amount : ${e.target.value}`);
    setAmount(e.target.value);
  };

  // handle Alert
  const handleAlert = ({ type, text }) => {
    console.log(``);
    setAlert({ show: true, type, text });
    setTimeout(() => {
      setAlert({ show: false });
    }, 5000);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (charge !== "" && amount > 0) {
      if (edit) {
        let tempExpenses = expenses.map((item) => {
          return item.id === id ? { ...item, charge, amount } : item;
        });
        setExpenses(tempExpenses);
        setEdit(false);
        handleAlert({ type: "success", text: "item edited" });
      } else {
        const singleExpense = { id: uuid(), charge, amount };
        setExpenses([...expenses, singleExpense]); // [] since singleExpense is an array
        handleAlert({ type: "success", text: "item added" });
      }
      setCharge("");
      setAmount("");
    } else {
      handleAlert({
        type: "danger",
        text: `charge can't be empty and amount has  to be bigger than 0`,
      });
    }
  };
  // clear items
  const clearItems = () => {
    setExpenses([]);
    handleAlert({ type: "danger", text: "All items deleted" });
  };
  // handle delete
  const handleDelete = (id) => {
    let tempExpenses = expenses.filter((item) => item.id !== id);
    setExpenses(tempExpenses);
    handleAlert({ type: "danger", text: "item deleted" });
  };

  const handleEdit = (id) => {
    let expense = expenses.find((item) => item.id === id);
    let { charge, amount } = expense;
    setCharge(charge);
    setAmount(amount);
    setEdit(true);
    setId(id);
  };

  return (
    <>
      {alert.show && <Alert type={alert.type} text={alert.text} />}
      <Alert />
      <h1>BUDGET CALCULATOR</h1>
      <main className="App">
        <ExpenseForm
          charge={charge}
          amount={amount}
          handleAmount={handleAmount}
          handleCharge={handleCharge}
          handleSubmit={handleSubmit}
          edit={edit}
        />
        <ExpenseList
          expenses={expenses}
          handleDelete={handleDelete}
          handleEdit={handleEdit}
          clearItems={clearItems}
        />
      </main>
      <h1>
        Total Spending :
        <spam className="total">
          $
          {expenses.reduce((acc, curr) => {
            return (acc += parseInt(curr.amount));
          }, 0)}
        </spam>
      </h1>
    </>
  );
}

export default App;
