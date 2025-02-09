import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import AddExpense from "./pages/AddExpense";
import Income from "./pages/Income";
import EditExpense from "./pages/EditExpense";
import DeleteExpense from "./pages/DeleteExpense";
import WeeklyExpenses from "./pages/WeeklyExpenses";
import { ToastContainer } from "react-toastify";
import Logout from "./pages/Logout";

function App() {
  return (
    <BrowserRouter>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/add-expense" element={<AddExpense />} />
        <Route path="/income" element={<Income />} />
        <Route path="/weekly-expenses" element={<WeeklyExpenses />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/api/expense/edit/:id" element={<EditExpense />} />
        <Route path="/api/expense/delete/:id" element={<DeleteExpense />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
