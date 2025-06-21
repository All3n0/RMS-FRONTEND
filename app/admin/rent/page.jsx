'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Paper,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  CircularProgress,
  Chip,
  Grid,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Search, FilterAlt, Clear, Receipt } from '@mui/icons-material';
import dayjs from 'dayjs';
import Cookies from 'js-cookie';

const statusOptions = [
  { value: '', label: 'All Statuses' },
  { value: 'paid', label: 'Paid' },
  { value: 'pending', label: 'Pending' },
  { value: 'failed', label: 'Failed' },
  { value: 'refunded', label: 'Refunded' },
];

export default function RentManagementPage() {
  const router = useRouter();
  const [admin, setAdmin] = useState(null);
  const [initialLoad, setInitialLoad] = useState(true);

  // Filter states
  const [filters, setFilters] = useState({
    search: '',
    tenantName: '',
    unitName: '',
    propertyName: '',
    referenceNumber: '',
    status: '',
    startDate: null,
    endDate: null
  });

  // Data states
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const userCookie = Cookies.get('user');
        if (!userCookie) {
          router.push('/login');
          return;
        }

        const userData = JSON.parse(userCookie);
        if (userData?.user?.role !== 'admin') {
          router.push('/login');
          return;
        }

        setAdmin(userData.user);
        setInitialLoad(false);
      } catch (err) {
        console.error('Authentication error:', err);
        router.push('/login');
      }
    };

    checkAuth();
  }, [router]);

  // Fetch payments when filters change or admin is set
  useEffect(() => {
    if (admin?.user_id) {
      fetchPayments();
    }
  }, [admin, filters]);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (filters.search) params.append('search', filters.search);
      if (filters.tenantName) params.append('tenant_name', filters.tenantName);
      if (filters.unitName) params.append('unit_name', filters.unitName);
      if (filters.propertyName) params.append('property_name', filters.propertyName);
      if (filters.referenceNumber) params.append('reference_number', filters.referenceNumber);
      if (filters.status) params.append('status', filters.status);
      if (filters.startDate) params.append('start_date', dayjs(filters.startDate).format('YYYY-MM-DD'));
      if (filters.endDate) params.append('end_date', dayjs(filters.endDate).format('YYYY-MM-DD'));

      const response = await fetch(
        `http://127.0.0.1:5556/admin/rent-payments/${admin.user_id}?${params.toString()}`,
        { 
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        setPayments(data.payments);
      } else {
        throw new Error(data.error || 'Failed to fetch payments');
      }
    } catch (err) {
      setError(err.message);
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const resetFilters = () => {
    setFilters({
      search: '',
      tenantName: '',
      unitName: '',
      propertyName: '',
      referenceNumber: '',
      status: '',
      startDate: null,
      endDate: null
    });
  };

  const viewPaymentDetails = (payment) => {
    setSelectedPayment(payment);
    setDetailsOpen(true);
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'paid': return 'success';
      case 'pending': return 'warning';
      case 'failed': return 'error';
      case 'refunded': return 'info';
      default: return 'default';
    }
  };

  if (initialLoad) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!admin) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <Typography color="error">Authentication failed. Redirecting to login...</Typography>
      </Box>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Rent Payments Management
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          Welcome, {admin.username} ({admin.email})
        </Typography>

        {/* Filters Section */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Filters
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Search"
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                InputProps={{ endAdornment: <Search color="action" /> }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="Tenant Name"
                value={filters.tenantName}
                onChange={(e) => handleFilterChange('tenantName', e.target.value)}
              />
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="Unit Name"
                value={filters.unitName}
                onChange={(e) => handleFilterChange('unitName', e.target.value)}
              />
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="Property Name"
                value={filters.propertyName}
                onChange={(e) => handleFilterChange('propertyName', e.target.value)}
              />
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="Reference Number"
                value={filters.referenceNumber}
                onChange={(e) => handleFilterChange('referenceNumber', e.target.value)}
              />
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={filters.status}
                  label="Status"
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                >
                  {statusOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <DatePicker
                label="Start Date"
                value={filters.startDate}
                onChange={(date) => handleFilterChange('startDate', date)}
                renderInput={(params) => <TextField fullWidth {...params} />}
              />
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <DatePicker
                label="End Date"
                value={filters.endDate}
                onChange={(date) => handleFilterChange('endDate', date)}
                renderInput={(params) => <TextField fullWidth {...params} />}
              />
            </Grid>
            
            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
              <Button
                variant="outlined"
                startIcon={<Clear />}
                onClick={resetFilters}
              >
                Reset
              </Button>
              <Button
                variant="contained"
                startIcon={<FilterAlt />}
                onClick={fetchPayments}
                disabled={loading}
              >
                Apply Filters
              </Button>
            </Grid>
          </Grid>
        </Paper>

        {/* Results Section */}
        <Paper sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">Payment Records</Typography>
            <Typography variant="body2" color="text.secondary">
              {payments.length} records found
            </Typography>
          </Box>

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Typography color="error" sx={{ p: 2 }}>Error: {error}</Typography>
          ) : payments.length === 0 ? (
            <Typography sx={{ p: 2 }}>No payments found</Typography>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Tenant</TableCell>
                    <TableCell>Unit</TableCell>
                    <TableCell>Property</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Payment Date</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {payments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell>{payment.tenant_name}</TableCell>
                      <TableCell>{payment.unit_name}</TableCell>
                      <TableCell>{payment.property_name}</TableCell>
                      <TableCell>${payment.amount?.toFixed(2)}</TableCell>
                      <TableCell>{payment.payment_date}</TableCell>
                      <TableCell>
                        <Chip
                          label={payment.status}
                          color={getStatusColor(payment.status)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Tooltip title="View Details">
                          <IconButton onClick={() => viewPaymentDetails(payment)}>
                            <Receipt color="primary" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>

        {/* Payment Details Dialog */}
        <Dialog open={detailsOpen} onClose={() => setDetailsOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Payment Details</DialogTitle>
          <DialogContent dividers>
            {selectedPayment && (
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="subtitle1">Tenant</Typography>
                  <Typography>
                    {selectedPayment.tenant_name} (ID: {selectedPayment.tenant_id})
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle1">Property</Typography>
                  <Typography>
                    {selectedPayment.unit_name}, {selectedPayment.property_name}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle1">Amount</Typography>
                  <Typography>${selectedPayment.amount?.toFixed(2)}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle1">Method</Typography>
                  <Typography>{selectedPayment.payment_method || 'N/A'}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle1">Date</Typography>
                  <Typography>{selectedPayment.payment_date}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle1">Status</Typography>
                  <Chip
                    label={selectedPayment.status}
                    color={getStatusColor(selectedPayment.status)}
                    size="small"
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle1">Reference</Typography>
                  <Typography sx={{ fontFamily: 'monospace' }}>
                    {selectedPayment.reference_number}
                  </Typography>
                </Grid>
              </Grid>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDetailsOpen(false)}>Close</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </LocalizationProvider>
  );
}