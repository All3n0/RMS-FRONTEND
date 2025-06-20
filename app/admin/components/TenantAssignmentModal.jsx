import React, { useState } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const TenantAssignmentModal = ({ show, onHide, onSubmit, unit }) => {
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        date_of_birth: null,
        emergency_contact_name: '',
        emergency_contact_number: '',
        move_in_date: null,
        lease_start: null,
        lease_end: null,
        payment_due_day: 1,
        admin_id: 1, // This should come from auth context in real app
        use_existing: false,
        tenant_id: ''
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
            date_of_birth: formData.date_of_birth?.toISOString().split('T')[0],
            move_in_date: formData.move_in_date?.toISOString().split('T')[0],
            lease_start: formData.lease_start?.toISOString().split('T')[0],
            lease_end: formData.lease_end?.toISOString().split('T')[0],
            admin_id: parseInt(formData.admin_id)
        };
        onSubmit(data);
    };

    return (
        <Modal show={show} onHide={onHide} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Assign Tenant to Unit {unit.unit_number}</Modal.Title>
            </Modal.Header>
            <Form onSubmit={handleSubmit}>
                <Modal.Body>
                    <Form.Group className="mb-3">
                        <Form.Check
                            type="switch"
                            id="use-existing"
                            label="Use existing tenant"
                            checked={formData.use_existing}
                            onChange={(e) => setFormData(prev => ({ ...prev, use_existing: e.target.checked }))}
                        />
                    </Form.Group>
                    
                    {formData.use_existing ? (
                        <Form.Group className="mb-3">
                            <Form.Label>Tenant ID</Form.Label>
                            <Form.Control
                                type="text"
                                name="tenant_id"
                                value={formData.tenant_id}
                                onChange={handleChange}
                                placeholder="Enter tenant ID"
                            />
                        </Form.Group>
                    ) : (
                        <>
                            <div className="row">
                                <div className="col-md-6">
                                    <Form.Group className="mb-3">
                                        <Form.Label>First Name</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="first_name"
                                            value={formData.first_name}
                                            onChange={handleChange}
                                            required
                                        />
                                    </Form.Group>
                                </div>
                                <div className="col-md-6">
                                    <Form.Group className="mb-3">
                                        <Form.Label>Last Name</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="last_name"
                                            value={formData.last_name}
                                            onChange={handleChange}
                                            required
                                        />
                                    </Form.Group>
                                </div>
                            </div>
                            
                            <div className="row">
                                <div className="col-md-6">
                                    <Form.Group className="mb-3">
                                        <Form.Label>Email</Form.Label>
                                        <Form.Control
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                        />
                                    </Form.Group>
                                </div>
                                <div className="col-md-6">
                                    <Form.Group className="mb-3">
                                        <Form.Label>Phone</Form.Label>
                                        <Form.Control
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            required
                                        />
                                    </Form.Group>
                                </div>
                            </div>
                            
                            <Form.Group className="mb-3">
                                <Form.Label>Date of Birth</Form.Label>
                                <DatePicker
                                    selected={formData.date_of_birth}
                                    onChange={(date) => handleDateChange(date, 'date_of_birth')}
                                    className="form-control"
                                    dateFormat="yyyy-MM-dd"
                                    required
                                />
                            </Form.Group>
                            
                            <div className="row">
                                <div className="col-md-6">
                                    <Form.Group className="mb-3">
                                        <Form.Label>Emergency Contact Name</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="emergency_contact_name"
                                            value={formData.emergency_contact_name}
                                            onChange={handleChange}
                                            required
                                        />
                                    </Form.Group>
                                </div>
                                <div className="col-md-6">
                                    <Form.Group className="mb-3">
                                        <Form.Label>Emergency Contact Number</Form.Label>
                                        <Form.Control
                                            type="tel"
                                            name="emergency_contact_number"
                                            value={formData.emergency_contact_number}
                                            onChange={handleChange}
                                            required
                                        />
                                    </Form.Group>
                                </div>
                            </div>
                        </>
                    )}
                    
                    <Form.Group className="mb-3">
                        <Form.Label>Move In Date</Form.Label>
                        <DatePicker
                            selected={formData.move_in_date}
                            onChange={(date) => handleDateChange(date, 'move_in_date')}
                            className="form-control"
                            dateFormat="yyyy-MM-dd"
                            required
                        />
                    </Form.Group>
                    
                    <div className="row">
                        <div className="col-md-6">
                            <Form.Group className="mb-3">
                                <Form.Label>Lease Start Date</Form.Label>
                                <DatePicker
                                    selected={formData.lease_start}
                                    onChange={(date) => handleDateChange(date, 'lease_start')}
                                    className="form-control"
                                    dateFormat="yyyy-MM-dd"
                                    required
                                />
                            </Form.Group>
                        </div>
                        <div className="col-md-6">
                            <Form.Group className="mb-3">
                                <Form.Label>Lease End Date</Form.Label>
                                <DatePicker
                                    selected={formData.lease_end}
                                    onChange={(date) => handleDateChange(date, 'lease_end')}
                                    className="form-control"
                                    dateFormat="yyyy-MM-dd"
                                    required
                                />
                            </Form.Group>
                        </div>
                    </div>
                    
                    <Form.Group className="mb-3">
                        <Form.Label>Payment Due Day (of month)</Form.Label>
                        <Form.Control
                            type="number"
                            name="payment_due_day"
                            value={formData.payment_due_day}
                            onChange={handleChange}
                            min="1"
                            max="28"
                            required
                        />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={onHide}>
                        Close
                    </Button>
                    <Button variant="primary" type="submit">
                        Assign Tenant
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
};

export default TenantAssignmentModal;