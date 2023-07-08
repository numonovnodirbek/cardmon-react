import React, { useState, useEffect } from "react";
import {
  Modal,
  Button,
  Form,
  InputGroup,
  Accordion,
  Badge,
} from "react-bootstrap";
import "./Cardmon.scss";
import { categories as categoriesData } from "../data/categories.js";
import Footer from "../components/Footer";
import ExpenseCard from "../components/ExpenseCard";
import { getCurrentDate, getCurrentMonth, getCurrentTime } from "../utils/date";
import { EXPENSES, DEBTS } from "../const";
import { v4 as uuidv4 } from "uuid";
import useModal from "../hooks/useModal";
import DebtCard from "../components/DebtCard";
const initialExpense = {
  price: "",
  category: "1",
  description: "",
  date: getCurrentDate(),
  time: getCurrentTime(),
};
const initialDebt = {
  price: "",
  category: "1",
  description: "",
  date: getCurrentDate(),
  time: getCurrentTime(),
};

const Cardmon = () => {
  const [active, setActive] = useState(1);
  const [show, handleShow, handleClose] = useModal();
  const [confirmShow, handleConfirmShow, handleConfirmClose] = useModal();
  const [categories, setCategories] = useState([]);
  const [expenses, setExpenses] = useState(
    JSON.parse(localStorage.getItem(EXPENSES)) || []
  );
  const [debts, setDebts] = useState(
    JSON.parse(localStorage.getItem(DEBTS)) || []
  );
  const [month, setMonth] = useState(getCurrentMonth());
  const [expense, setExpense] = useState(initialExpense);
  const [debt, setDebt] = useState(initialDebt);
  const [selected, setSelected] = useState(null);
  useEffect(() => {
    setCategories(categoriesData);
  }, []);
  const handleChange = (e) => {
    setExpense({ ...expense, [e.target.name]: e.target.value });
    setDebt({ ...debt, [e.target.name]: e.target.value });
  };
  const addExpense = (e) => {
    e.preventDefault();
    let newExpenses;
    if (selected) {
      newExpenses = expenses.map((ex) => {
        if (ex.id === selected) {
          return expense;
        } else {
          return ex;
        }
      });
    } else {
      newExpenses = [
        ...expenses,
        {
          id: uuidv4(),
          ...expense,
        },
      ];
    }
    handleClose();
    setExpenses(newExpenses);
    localStorage.setItem(EXPENSES, JSON.stringify(newExpenses));
  };
  const addDebt = (e) => {
    e.preventDefault();
    let newDebts;
    if (selected) {
      newDebts = debts.map((d) => {
        if (d.id === selected) {
          return debt;
        } else {
          return d;
        }
      });
    } else {
      newDebts = [
        ...debts,
        {
          id: uuidv4(),
          ...debt,
        },
      ];
    }
    handleClose();
    setDebts(newDebts);
    localStorage.setItem(DEBTS, JSON.stringify(newDebts));
  };
  const selectExpense = (id) => {
    handleConfirmShow();
    setSelected(id);
  };

  const selectDebt = (id) => {
    handleConfirmShow();
    setSelected(id);
  };

  const deleteExpense = () => {
    let newExpenses = expenses.filter((ex) => ex.id !== selected);
    handleConfirmClose();
    setExpenses(newExpenses);
    localStorage.setItem(EXPENSES, JSON.stringify(newExpenses));
  };

  const deleteDebt = () => {
    let newDebts = debts.filter((d) => d.id !== selected);
    handleConfirmClose();
    setDebts(newDebts);
    localStorage.setItem(DEBTS, JSON.stringify(newDebts));
  };

  const editExpense = (id) => {
    handleShow();
    setSelected(id);
    let findedExpense = expenses.find((ex) => ex.id === id);
    setExpense(findedExpense);
  };

  const editDebt = (id) => {
    handleShow();
    setSelected(id);
    let findedDebt = debts.find((d) => d.id === id);
    setDebt(findedDebt);
  };

  const handleMonth = (e) => {
    setMonth(e.target.value);
  };
  const openModal = () => {
    handleShow();
    setSelected(null);
    setExpense(initialExpense);
    setDebt(initialDebt);
  };

  const handleTab = (id) => {
    setActive(id);
  };
  const accordionItem = (item, i) => {
    const filteredExpenses = expenses.filter(
      (ex) => ex.category === item.id && ex.date.slice(0, -3) === month
    );
    return (
      <Accordion.Item className="accordion-border-radius" key={item.id} eventKey={i}>
        <Accordion.Header as="div" className="d-flex accordion-border-radius justify-content-between">
          <h4>
            {item.name} <Badge bg="primary">{filteredExpenses.length}</Badge>
          </h4>
          <span>
            {filteredExpenses.reduce((acc, ex) => acc + +ex.price, 0)}
          </span>
        </Accordion.Header>
        <Accordion.Body>
          {filteredExpenses.map((item) => (
            <div key={item.id} className="my-2">
              <ExpenseCard
                {...item}
                category={categories.find((c) => c.id === item.category)?.name}
                selectExpense={selectExpense}
                editExpense={editExpense}
              />
            </div>
          ))}
        </Accordion.Body>
      </Accordion.Item>
    );
  };

  const debtAccordionItem = (item, i) => {
    const filteredDebts = debts.filter(
      (d) => d.category === item.id && d.date.slice(0, -3) === month
    );
    return (
      <Accordion.Item className="accordion-border-radius" key={item.id} eventKey={i}>
        <Accordion.Header as="div" className="d-flex justify-content-between">
          <h4>
            {item.name} <Badge bg="primary">{filteredDebts.length}</Badge>
          </h4>
          <span>{filteredDebts.reduce((acc, d) => acc + +d.price, 0)}</span>
        </Accordion.Header>
        <Accordion.Body>
          {filteredDebts.map((item) => (
            <div key={item.id} className="my-2">
              <DebtCard
                {...item}
                category={categories.find((c) => c.id === item.category)?.name}
                selectDebt={selectDebt}
                editDebt={editDebt}
              />
            </div>
          ))}
        </Accordion.Body>
      </Accordion.Item>
    );
  };

  return (
    <div className="cardmon-layout vh-100 bg-light m-auto">
      <div className="cardmon-body p-3">
        <div className="mb-3">
          <Form.Control value={month} type="month" onChange={handleMonth} />
        </div>
        {active === 1 ? (
          <Accordion defaultActiveKey="0">
            {categories
              .filter((c) =>
                expenses.find(
                  (ex) => ex.category === c.id && ex.date.slice(0, -3) === month
                )
              )
              .map((item, i) => accordionItem(item, i))}
          </Accordion>
        ) : active === 2 ? (
          <Accordion defaultActiveKey="1">
            {categories
              .filter((c) =>
                debts.find(
                  (d) => d.category === c.id && d.date.slice(0, -3) === month
                )
              )
              .map((item, i) => debtAccordionItem(item, i))}
          </Accordion>
        ) : (
          ""
        )}
      </div>
      <Modal show={show} onHide={handleClose}>
        {active === 1 ? (
          <Form onSubmit={addExpense}>
            <Modal.Header closeButton>
              <Modal.Title>Xarajatlar</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form.Group className="mb-3">
                <Form.Label>Narx</Form.Label>
                <InputGroup className="mb-3">
                  <InputGroup.Text>UZS</InputGroup.Text>
                  <Form.Control
                    onChange={handleChange}
                    name="price"
                    value={expense.price}
                    aria-label="Amount (to the nearest uzs)"
                  />
                  <InputGroup.Text>.00</InputGroup.Text>
                </InputGroup>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Kategoriya</Form.Label>
                <Form.Select
                  value={expense.category}
                  onChange={handleChange}
                  name="category"
                >
                  {categories.map((item) => (
                    <option value={item.id}>{item.name}</option>
                  ))}
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Izoh</Form.Label>
                <Form.Control
                  onChange={handleChange}
                  name="description"
                  value={expense.description}
                  as="textarea"
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Sana vaqt</Form.Label>
                <div className="d-flex justify-content-between gap-2">
                  <Form.Control
                    onChange={handleChange}
                    name="date"
                    value={expense.date}
                    type="date"
                  />
                  <Form.Control
                    onChange={handleChange}
                    name="time"
                    value={expense.time}
                    type="time"
                  />
                </div>
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Yopish
              </Button>
              <Button type="submit" variant="primary">
                {selected ? "Saqlash" : "Qo'shish"}
              </Button>
            </Modal.Footer>
          </Form>
        ) : active === 2 ? (
          <Form onSubmit={addDebt}>
            <Modal.Header closeButton>
              <Modal.Title>Qarzlar</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form.Group className="mb-3">
                <Form.Label>Summasi</Form.Label>
                <InputGroup className="mb-3">
                  <InputGroup.Text>UZS</InputGroup.Text>
                  <Form.Control
                    onChange={handleChange}
                    name="price"
                    value={debt.price}
                    aria-label="Amount (to the nearest uzs)"
                  />
                  <InputGroup.Text>.00</InputGroup.Text>
                </InputGroup>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Kategoriya</Form.Label>
                <Form.Select
                  value={debt.category}
                  onChange={handleChange}
                  name="category"
                >
                  {categories.map((item) => (
                    <option value={item.id}>{item.name}</option>
                  ))}
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Izoh</Form.Label>
                <Form.Control
                  onChange={handleChange}
                  name="description"
                  value={debt.description}
                  as="textarea"
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Sana vaqt</Form.Label>
                <div className="d-flex justify-content-between gap-2">
                  <Form.Control
                    onChange={handleChange}
                    name="date"
                    value={debt.date}
                    type="date"
                  />
                  <Form.Control
                    onChange={handleChange}
                    name="time"
                    value={debt.time}
                    type="time"
                  />
                </div>
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Yopish
              </Button>
              <Button type="submit" variant="primary">
                {selected ? "Saqlash" : "Qo'shish"}
              </Button>
            </Modal.Footer>
          </Form>
        ) : (
          ""
        )}
      </Modal>
      <Modal show={confirmShow} onHide={handleConfirmClose}>
        <Modal.Header closeButton>
          <Modal.Title>Rostanam o'chirmoqchisimiz ?</Modal.Title>
        </Modal.Header>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleConfirmClose}>
            Yo'q
          </Button>
          <Button
            variant="primary"
            active={active === 1 ? true : active === 2 ? true : false}
            onClick={
              active === 1 ? deleteExpense : active === 2 ? deleteDebt : null
            }
          >
            Ha
          </Button>
        </Modal.Footer>
      </Modal>
      <Footer handleShow={openModal} handleTab={handleTab} />
    </div>
  );
};

export default Cardmon;
