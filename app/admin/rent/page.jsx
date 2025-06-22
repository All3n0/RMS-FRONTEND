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
  DialogActions,
  Collapse,
  Divider
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Search, FilterAlt, Clear, Receipt, ExpandMore, ExpandLess } from '@mui/icons-material';
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
  const [filtersOpen, setFiltersOpen] = useState(false);

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
        console.log(userCookie);
        if (!userCookie) {
          console.log('No user cookie found');
          router.push('/login');
          return;
        }

        const userData = JSON.parse(userCookie);
        console.log('User data:', userData);
if (!userData?.user_id) {
  console.log('User not authenticated');
  router.push('/login');
  return;
}
if (userData.role !== 'admin') {
  console.log('User is not admin');
  router.push('/login');
  return;
}
        setAdmin(userData);
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
      <Box sx={{ p: { xs: 2, md: 3 }, backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
        {/* Header Section */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 600, color: 'primary.main' }}>
            Rent Payments
          </Typography>
          <Typography variant="subtitle1" sx={{ color: 'text.secondary' }}>
            Welcome back, <span style={{ fontWeight: 500 }}>{admin.username}</span>
          </Typography>
        </Box>

        {/* Search Bar */}
        <Paper sx={{ p: 2, mb: 2, borderRadius: 2 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search payments..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            InputProps={{
              startAdornment: <Search color="action" sx={{ mr: 1 }} />,
              sx: { borderRadius: 2 }
            }}
          />
        </Paper>

        {/* Filters Toggle */}
        <Box sx={{ mb: 2 }}>
          <Button
            startIcon={filtersOpen ? <ExpandLess /> : <ExpandMore />}
            endIcon={<FilterAlt />}
            onClick={() => setFiltersOpen(!filtersOpen)}
            sx={{ textTransform: 'none' }}
          >
            {filtersOpen ? 'Hide Filters' : 'Show Filters'}
          </Button>
        </Box>

        {/* Filters Section - Collapsible */}
        <Collapse in={filtersOpen}>
          <Paper sx={{ p: 3, mb: 3, borderRadius: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={4} lg={3}>
                <TextField
                  fullWidth
                  label="Tenant Name"
                  size="small"
                  value={filters.tenantName}
                  onChange={(e) => handleFilterChange('tenantName', e.target.value)}
                />
              </Grid>
              
              <Grid item xs={12} sm={6} md={4} lg={3}>
                <TextField
                  fullWidth
                  label="Unit Name"
                  size="small"
                  value={filters.unitName}
                  onChange={(e) => handleFilterChange('unitName', e.target.value)}
                />
              </Grid>
              
              <Grid item xs={12} sm={6} md={4} lg={3}>
                <TextField
                  fullWidth
                  label="Property Name"
                  size="small"
                  value={filters.propertyName}
                  onChange={(e) => handleFilterChange('propertyName', e.target.value)}
                />
              </Grid>
              
              <Grid item xs={12} sm={6} md={4} lg={3}>
                <TextField
                  fullWidth
                  label="Reference Number"
                  size="small"
                  value={filters.referenceNumber}
                  onChange={(e) => handleFilterChange('referenceNumber', e.target.value)}
                />
              </Grid>
              
              <Grid item xs={12} sm={6} md={4} lg={3}>
                <FormControl fullWidth size="small">
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
              
              <Grid item xs={12} sm={6} md={4} lg={3}>
                <DatePicker
                  label="Start Date"
                  value={filters.startDate}
                  onChange={(date) => handleFilterChange('startDate', date)}
                  renderInput={(params) => <TextField {...params} fullWidth size="small" />}
                />
              </Grid>
              
              <Grid item xs={12} sm={6} md={4} lg={3}>
                <DatePicker
                  label="End Date"
                  value={filters.endDate}
                  onChange={(date) => handleFilterChange('endDate', date)}
                  renderInput={(params) => <TextField {...params} fullWidth size="small" />}
                />
              </Grid>
              
              <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 1 }}>
                <Button
                  variant="outlined"
                  startIcon={<Clear />}
                  onClick={resetFilters}
                  size="small"
                >
                  Clear
                </Button>
                <Button
                  variant="contained"
                  startIcon={<Search />}
                  onClick={fetchPayments}
                  disabled={loading}
                  size="small"
                >
                  Search
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Collapse>

        {/* Results Section */}
        <Paper sx={{ p: 2, borderRadius: 2 }}>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            mb: 2,
            flexDirection: { xs: 'column', sm: 'row' },
            gap: { xs: 2, sm: 0 }
          }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Payment Records
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Showing {payments.length} records
            </Typography>
          </Box>

          <Divider sx={{ mb: 3 }} />

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Box sx={{ 
              p: 3, 
              backgroundColor: 'error.light', 
              borderRadius: 2,
              display: 'flex',
              alignItems: 'center',
              gap: 2
            }}>
              <AlertCircle color="error" />
              <Typography color="error">Error: {error}</Typography>
            </Box>
          ) : payments.length === 0 ? (
            <Box sx={{ 
              p: 3, 
              textAlign: 'center',
              backgroundColor: 'action.hover',
              borderRadius: 2
            }}>
              <Typography>No payments found matching your criteria</Typography>
            </Box>
          ) : (
            <TableContainer>
              <Table sx={{ minWidth: 650 }} aria-label="payments table">
                <TableHead>
                  <TableRow sx={{ backgroundColor: 'primary.light' }}>
                    <TableCell sx={{ fontWeight: 600 }}>Tenant</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Unit</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Amount</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 600 }} align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {payments.map((payment) => (
                    <TableRow 
                      key={payment.id}
                      hover
                      sx={{ 
                        '&:last-child td, &:last-child th': { border: 0 },
                        cursor: 'pointer'
                      }}
                      onClick={() => viewPaymentDetails(payment)}
                    >
                      <TableCell>{payment.tenant_name}</TableCell>
                      <TableCell>{payment.unit_name}</TableCell>
                      <TableCell>${payment.amount?.toFixed(2)}</TableCell>
                      <TableCell>{payment.payment_date}</TableCell>
                      <TableCell>
                        <Chip
                          label={payment.status}
                          color={getStatusColor(payment.status)}
                          size="small"
                          sx={{ 
                            fontWeight: 500,
                            textTransform: 'capitalize'
                          }}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Tooltip title="View details">
                          <IconButton 
                            onClick={(e) => {
                              e.stopPropagation();
                              viewPaymentDetails(payment);
                            }}
                            size="small"
                          >
                            <Receipt fontSize="small" />
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
        <Dialog 
          open={detailsOpen} 
          onClose={() => setDetailsOpen(false)} 
          maxWidth="sm" 
          fullWidth
          PaperProps={{ sx: { borderRadius: 3 } }}
        >
          <DialogTitle sx={{ 
            backgroundColor: 'primary.main', 
            color: 'white',
            fontWeight: 600
          }}>
            Payment Details
          </DialogTitle>
          <DialogContent dividers sx={{ p: 3 }}>
            {selectedPayment && (
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="subtitle1" fontWeight={500}>Tenant Information</Typography>
                  <Typography>
                    {selectedPayment.tenant_name} (ID: {selectedPayment.tenant_id})
                  </Typography>
                </Grid>
                
                <Grid item xs={12}>
                  <Typography variant="subtitle1" fontWeight={500}>Property Information</Typography>
                  <Typography>
                    {selectedPayment.unit_name}, {selectedPayment.property_name}
                  </Typography>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" fontWeight={500}>Amount</Typography>
                  <Typography>${selectedPayment.amount?.toFixed(2)}</Typography>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" fontWeight={500}>Payment Method</Typography>
                  <Typography>{selectedPayment.payment_method || 'N/A'}</Typography>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" fontWeight={500}>Payment Date</Typography>
                  <Typography>{selectedPayment.payment_date}</Typography>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" fontWeight={500}>Status</Typography>
                  <Chip
                    label={selectedPayment.status}
                    color={getStatusColor(selectedPayment.status)}
                    size="small"
                    sx={{ fontWeight: 500 }}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <Typography variant="subtitle1" fontWeight={500}>Reference Number</Typography>
                  <Typography sx={{ 
                    fontFamily: 'monospace',
                    backgroundColor: 'action.hover',
                    p: 1,
                    borderRadius: 1
                  }}>
                    {selectedPayment.reference_number}
                  </Typography>
                </Grid>
              </Grid>
            )}
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button 
              onClick={() => setDetailsOpen(false)}
              variant="contained"
              sx={{ borderRadius: 2 }}
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </LocalizationProvider>
  );
}