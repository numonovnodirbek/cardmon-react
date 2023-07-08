import React from "react";
import { Button, Card } from "react-bootstrap";
import './ExpenseCard.scss'
const ExpenseCard = ({
  price,
  category,
  description,
  selectExpense,
  editExpense,
  id,
  date,
  time,
}) => {
  return (
    <Card>
      <Card.Body>
        <Card.Title className="d-flex justify-content-between">
          <span>{price}</span>
          <span>
            {date}, {time}
          </span>
        </Card.Title>
        <Card.Subtitle className="mb-2 text-muted">{category}</Card.Subtitle>
        <Card.Text>{description}</Card.Text>
     <div className="event-btns">
     <Button variant="primary" onClick={() => editExpense(id)}>
          Edit
        </Button>
        <Button variant="danger" onClick={() => selectExpense(id)}>
          Delete
        </Button>
     </div>
      </Card.Body>
    </Card>
  );
};

export default ExpenseCard;
