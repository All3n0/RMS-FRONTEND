import React, { useState } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const LeaseEndModal = ({ show, onHide, onSubmit, lease }) => {
    const [endDate, setEndDate] = useState(new Date());

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(endDate.toISOString().split('T')[0]);
    };

    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title>End Lease #{lease.lease_id}</Modal.Title>
            </Modal.Header>
            <Form onSubmit={handleSubmit}>
                <Modal.Body>
                    <Form.Group className="mb-3">
                        <Form.Label>End Date</Form.Label>
                        <DatePicker
                            selected={endDate}
                            onChange={setEndDate}
                            className="form-control"
                            dateFormat="yyyy-MM-dd"
                            minDate={new Date()}
                            required
                        />
                    </Form.Group>
                    
                    <div className="alert alert-warning">
                        <strong>Warning!</strong> Ending this lease will mark the unit as vacant. 
                        This action cannot be undone.
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={onHide}>
                        Cancel
                    </Button>
                    <Button variant="danger" type="submit">
                        End Lease
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
};

export default LeaseEndModal;