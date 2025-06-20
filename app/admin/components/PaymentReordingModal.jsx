import React, { useState } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const PaymentRecordingModal = ({ show, onHide, onSubmit, lease }) => {
    const [formData, setFormData] = useState({
        payment_date: new Date(),
        amount: lease.monthly_rent,
        payment_method: 'cash',
        transaction_reference: '',
        period_start: new Date(),
        period_end: new Date(new Date().setMonth(new Date().getMonth() + 1)),
        admin_id: 1 // Should come from auth context
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleDateChange = (date, field) => {
        setFormData(prev => ({ ...prev, [field]: date }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const data = {
            ...formData,
            payment_date: formData.payment_date.toISOString().split('T')[0],
            period_start: formData.period_start.toISOString().split('T')[0],
            period_end: formData.period_end.toISOString().split('T')[0],
            amount: parseFloat(formData.amount),
            admin_id: parseInt(formData.admin_id)
        };
        onSubmit(data);
    };

    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title>Record Payment for Lease #{lease.lease_id}</Modal.Title>
            </Modal.Header>
            <Form onSubmit={handleSubmit}>
                <Modal.Body>
                    <Form.Group className="mb-3">
                        <Form.Label>Payment Date</Form.Label>
                        <DatePicker
                            selected={formData.payment_date}
                            onChange={(date) => handleDateChange(date, 'payment_date')}
                            className="form-control"
                            dateFormat="yyyy-MM-dd"
                            required
                        />
                    </Form.Group>
                    
                    <Form.Group className="mb-3">
                        <Form.Label>Amount</Form.Label>
                        <Form.Control
                            type="number"
                            name="amount"
                            value={formData.amount}
                            onChange={handleChange}
                            step="0.01"
                            min="0"
                            required
                        />
                    </Form.Group>
                    
                    <Form.Group className="mb-3">
                        <Form.Label>Payment Method</Form.Label>
                        <Form.Select
                            name="payment_method"
                            value={formData.payment_method}
                            onChange={handleChange}
                            required
                        >
                            <option value="cash">Cash</option>
                            <option value="check">Check</option>
                            <option value="bank_transfer">Bank Transfer</option>
                            <option value="credit_card">Credit Card</option>
                            <option value="mobile_payment">Mobile Payment</option>
                        </Form.Select>
                    </Form.Group>
                    
                    <Form.Group className="mb-3">
                        <Form.Label>Transaction Reference</Form.Label>
                        <Form.Control
                            type="text"
                            name="transaction_reference"
                            value={formData.transaction_reference}
                            onChange={handleChange}
                            placeholder="Optional"
                        />
                    </Form.Group>
                    
                    <div className="row">
                        <div className="col-md-6">
                            <Form.Group className="mb-3">
                                <Form.Label>Period Start</Form.Label>
                                <DatePicker
                                    selected={formData.period_start}
                                    onChange={(date) => handleDateChange(date, 'period_start')}
                                    className="form-control"
                                    dateFormat="yyyy-MM-dd"
                                    required
                                />
                            </Form.Group>
                        </div>
                        <div className="col-md-6">
                            <Form.Group className="mb-3">
                                <Form.Label>Period End</Form.Label>
                                <DatePicker
                                    selected={formData.period_end}
                                    onChange={(date) => handleDateChange(date, 'period_end')}
                                    className="form-control"
                                    dateFormat="yyyy-MM-dd"
                                    required
                                />
                            </Form.Group>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={onHide}>
                        Cancel
                    </Button>
                    <Button variant="primary" type="submit">
                        Record Payment
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
};

export default PaymentRecordingModal;