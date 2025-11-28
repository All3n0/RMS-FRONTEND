'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { styled } from '@mui/material/styles';
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
  Divider,
  Alert,
  Card,
  CardContent,
  alpha,
  Fade,
  Zoom,
  Slide,
  useTheme,
  useMediaQuery
} from '@mui/material';

import { 
  Check as CheckIcon, 
  Close as CloseIcon,
  Search, 
  FilterAlt, 
  Clear, 
  Receipt, 
  ExpandMore, 
  ExpandLess,
  TrendingUp,
  Paid,
  Schedule,
  AccountBalance,
  Visibility,
  ArrowUpward,
  ArrowDownward,
  MonetizationOn,
  Home,
  Payment,
  CalendarToday,
  EventAvailable,
  CheckCircle,
  Error as ErrorIcon,
  Info as InfoIcon,
  ReceiptLong
} from '@mui/icons-material';

import { DatePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import Cookies from 'js-cookie';

// Enhanced styled components with premium theme
const GradientCard = styled(Paper)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
  color: 'white',
  borderRadius: '20px',
  padding: theme.spacing(3),
  boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '4px',
    background: 'linear-gradient(90deg, #FF6B6B, #4ECDC4, #45B7D1, #96CEB4, #FFD93D)',
  }
}));

const PremiumRadialContainer = styled('div')(({ theme }) => ({
  position: 'relative',
  width: '180px',
  height: '180px',
  margin: '0 auto',
  [theme.breakpoints.down('md')]: {
    width: '160px',
    height: '160px',
  },
  [theme.breakpoints.down('sm')]: {
    width: '140px',
    height: '140px',
  }
}));

const PremiumOuterProgress = styled('div')(({ theme, percentage }) => ({
  position: 'absolute',
  width: '100%',
  height: '100%',
  borderRadius: '50%',
  background: `conic-gradient(
    from 0deg,
    #667eea 0deg,
    #764ba2 ${percentage * 3.6}deg,
    ${alpha(theme.palette.primary.main, 0.15)} ${percentage * 3.6}deg,
    ${alpha(theme.palette.primary.main, 0.15)} 360deg
  )`,
  transition: 'all 2s cubic-bezier(0.4, 0, 0.2, 1)',
  '&::before': {
    content: '""',
    position: 'absolute',
    inset: '6px',
    borderRadius: '50%',
    background: 'linear-gradient(145deg, #ffffff, #f0f0f0)',
    boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.1)',
    zIndex: 1,
  }
}));

const PremiumInnerProgress = styled('div')(({ theme, percentage }) => ({
  position: 'absolute',
  width: '140px',
  height: '140px',
  top: '20px',
  left: '20px',
  borderRadius: '50%',
  background: `conic-gradient(
    from 180deg,
    #4ECDC4 0deg,
    #44A08D ${percentage * 3.6}deg,
    ${alpha('#4ECDC4', 0.15)} ${percentage * 3.6}deg,
    ${alpha('#4ECDC4', 0.15)} 360deg
  )`,
  transition: 'all 2s cubic-bezier(0.4, 0, 0.2, 1) 0.3s',
  zIndex: 2,
  '&::before': {
    content: '""',
    position: 'absolute',
    inset: '6px',
    borderRadius: '50%',
    background: 'linear-gradient(145deg, #ffffff, #f8fafc)',
    boxShadow: 'inset 0 1px 6px rgba(0,0,0,0.08)',
    zIndex: 3,
  },
  [theme.breakpoints.down('md')]: {
    width: '120px',
    height: '120px',
    top: '20px',
    left: '20px',
  },
  [theme.breakpoints.down('sm')]: {
    width: '100px',
    height: '100px',
    top: '20px',
    left: '20px',
  }
}));

const PremiumRadialCenter = styled('div')(({ theme }) => ({
  position: 'absolute',
  width: '100px',
  height: '100px',
  top: '40px',
  left: '40px',
  borderRadius: '50%',
  background: 'linear-gradient(145deg, #ffffff, #f8fafc)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
  zIndex: 4,
  border: '1px solid rgba(255,255,255,0.8)',
  [theme.breakpoints.down('md')]: {
    width: '80px',
    height: '80px',
    top: '40px',
    left: '40px',
  },
  [theme.breakpoints.down('sm')]: {
    width: '70px',
    height: '70px',
    top: '35px',
    left: '35px',
  }
}));

const PremiumStatCard = styled(Card)(({ theme, glowcolor }) => ({
  background: 'linear-gradient(135deg, #ffffff 0%, #fafbfc 100%)',
  borderRadius: '16px',
  padding: theme.spacing(2.5),
  boxShadow: `0 4px 20px ${alpha(glowcolor || theme.palette.primary.main, 0.1)}`,
  border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
  position: 'relative',
  overflow: 'hidden',
  transition: 'all 0.3s ease',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '3px',
    background: `linear-gradient(90deg, ${glowcolor || theme.palette.primary.main}, ${alpha(glowcolor || theme.palette.primary.main, 0.5)})`,
  },
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: `0 8px 30px ${alpha(glowcolor || theme.palette.primary.main, 0.15)}`,
  },
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(2),
  }
}));

const GlassStatCard = styled(Card)(({ theme }) => ({
  background: 'white',
  borderRadius: '16px',
  padding: theme.spacing(2),
  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
  border: '1px solid rgba(0,0,0,0.1)',
}));

const ActionButton = styled(Button)(({ theme, variant, glowcolor }) => ({
  borderRadius: '12px',
  textTransform: 'none',
  fontWeight: 600,
  padding: theme.spacing(1, 2),
  fontSize: '0.9rem',
  ...(variant === 'contained' && {
    background: glowcolor ? `linear-gradient(135deg, ${glowcolor}, ${alpha(glowcolor, 0.8)})` : 
               `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    '&:hover': {
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      transform: 'translateY(-1px)',
    }
  })
}));

const PremiumTableRow = styled(TableRow)(({ theme, status }) => ({
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  background: 'white',
  position: 'relative',
  // '&::before': {
  //   content: '""',
  //   position: 'absolute',
  //   left: 0,
  //   top: '50%',
  //   transform: 'translateY(-50%)',
  //   width: '3px',
  //   height: '50%',
  //   background: status === 'paid' ? 'linear-gradient(180deg, #4CAF50, #45a049)' :
  //             status === 'pending' ? 'linear-gradient(180deg, #FF9800, #F57C00)' :
  //             status === 'failed' ? 'linear-gradient(180deg, #f44336, #d32f2f)' :
  //             'linear-gradient(180deg, #2196F3, #1976D2)',
  //   borderRadius: '0 2px 2px 0',
  //   opacity: 0,
  //   transition: 'opacity 0.3s ease',
  // },
  '&:hover': {
    transform: 'translateX(4px)',
    boxShadow: '0 2px 12px rgba(0,0,0,0.1)',
    '&::before': {
      opacity: 1,
    },
    '& td': {
      background: '#f8fafc',
    }
  },
  '& td': {
    borderBottom: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
    transition: 'all 0.2s ease',
    fontWeight: 500,
  }
}));

const statusOptions = [
  { value: '', label: 'All Statuses', color: 'default' },
  { value: 'paid', label: 'Paid', color: 'success' },
  { value: 'pending', label: 'Pending', color: 'warning' },
  { value: 'failed', label: 'Failed', color: 'error' },
  { value: 'refunded', label: 'Refunded', color: 'info' },
];

export default function RentManagementPage() {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  
  const [admin, setAdmin] = useState(null);
  const [initialLoad, setInitialLoad] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [rentStats, setRentStats] = useState({
    collected: 0,
    expected: 49000,
    percentage: 0
  });
  const [availableMonths, setAvailableMonths] = useState([]);
  const [filters, setFilters] = useState({
    search: '',
    tenantName: '',
    unitName: '',
    propertyName: '',
    referenceNumber: '',
    status: '',
    month: '',
    year: '',
    startDate: null,
    endDate: null
  });
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [statsLoaded, setStatsLoaded] = useState(false);
  const [adminId, setAdminId] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const userCookie = Cookies.get('user');
        if (!userCookie) {
          router.push('/login');
          return;
        }

        const userData = JSON.parse(userCookie);
        const id = userData?.user_id;
        
        if (!id || userData.role !== 'admin') {
          router.push('/login');
          return;
        }
        
        setAdmin(userData);
        setAdminId(id);
        setInitialLoad(false);
      } catch (err) {
        console.error('Authentication error:', err);
        router.push('/login');
      }
    };

    checkAuth();
  }, [router]);

  useEffect(() => {
    if (adminId) {
      fetchPayments();
      fetchRentStats();
      fetchAvailableMonths();
    }
  }, [adminId, filters]);

  const fetchAvailableMonths = async () => {
    try {
      const response = await fetch(
        `http://127.0.0.1:5556/admin/rent-payments/${adminId}/months`,
        { 
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' }
        }
      );
      
      if (response.ok) {
        const data = await response.json();
        setAvailableMonths(data.months || []);
      }
    } catch (err) {
      console.error('Error fetching available months:', err);
    }
  };

  const updatePaymentStatus = async (paymentId, newStatus) => {
    try {
      const res = await fetch(`http://127.0.0.1:5556/admin/rent-payments/${paymentId}/status`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update status');

      alert(`✅ Payment marked as ${newStatus}`);
      fetchPayments();
      fetchRentStats();
    } catch (err) {
      console.error(err);
      alert(`❌ Error: ${err.message}`);
    }
  };

  const fetchRentStats = async () => {
    try {
      const params = new URLSearchParams();
      if (filters.month) params.append('month', filters.month.split('-')[1]);
      if (filters.year) params.append('year', filters.year);
      if (filters.startDate) params.append('start_date', dayjs(filters.startDate).format('YYYY-MM-DD'));
      if (filters.endDate) params.append('end_date', dayjs(filters.endDate).format('YYYY-MM-DD'));

      const response = await fetch(
        `http://127.0.0.1:5556/admin/rent-payments/${adminId}/stats?${params.toString()}`,
        { 
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' }
        }
      );
      
      if (response.ok) {
        const data = await response.json();
        console.log('Rent stats:', data);
        setRentStats({
          collected: data.collected || 0,
          expected: data.expected || 49000,
          percentage: data.percentage || 0
        });
        setStatsLoaded(true);
      }
    } catch (err) {
      console.error('Error fetching rent stats:', err);
    }
  };

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
      if (filters.month) params.append('month', filters.month.split('-')[1]);
      if (filters.year) params.append('year', filters.year);
      if (filters.startDate) params.append('start_date', dayjs(filters.startDate).format('YYYY-MM-DD'));
      if (filters.endDate) params.append('end_date', dayjs(filters.endDate).format('YYYY-MM-DD'));

      const response = await fetch(
        `http://127.0.0.1:5556/admin/rent-payments/${adminId}?${params.toString()}`,
        { 
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' }
        }
      );

      if (!response.ok) throw new Error(await response.text());
      const data = await response.json();
      if (data.success) setPayments(data.payments);
      else throw new Error(data.error || 'Failed to fetch payments');
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
      month: '',
      year: '',
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
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        backgroundColor: 'white'
      }}>
        <Fade in={true} timeout={1000}>
          <Box sx={{ textAlign: 'center' }}>
            <CircularProgress sx={{ color: 'primary.main', mb: 2 }} size={40} />
            <Typography variant="h6" color="text.primary">
              Loading Rent Management...
            </Typography>
          </Box>
        </Fade>
      </Box>
    );
  }

  if (!adminId) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4, backgroundColor: 'white' }}>
        <Typography color="error">Authentication failed. Redirecting to login...</Typography>
      </Box>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ 
        p: { xs: 2, md: 3 }, 
        backgroundColor: 'white',
        minHeight: '100vh'
      }}>
        <Box>
          {/* Header Section */}
          <Slide in={true} direction="down" timeout={800}>
            <Box sx={{ mb: 3 }}>
              <GradientCard>
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'flex-start',
                  flexDirection: { xs: 'column', md: 'row' },
                  gap: { xs: 2, md: 0 }
                }}>
                  <Box sx={{ position: 'relative', zIndex: 2 }}>
                    <Typography variant={isMobile ? "h5" : "h4"} sx={{ fontWeight: 700, mb: 1 }}>
                      Rent Management
                    </Typography>
                    <Typography variant={isMobile ? "body1" : "h6"} sx={{ opacity: 0.9, fontWeight: 400, mb: 1 }}>
                      Welcome back, <span style={{ fontWeight: 600 }}>{admin?.username}</span>
                    </Typography>
                    <Typography variant={isMobile ? "caption" : "body2"} sx={{ opacity: 0.8 }}>
                      Real-time financial insights and payment tracking
                    </Typography>
                  </Box>
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    gap: 1,
                    background: 'rgba(255,255,255,0.15)',
                    padding: '8px 16px',
                    borderRadius: '12px',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    mt: { xs: 1, md: 0 }
                  }}>
                    <AccountBalance sx={{ fontSize: { xs: 20, md: 24 } }} />
                    <Typography variant="body2" sx={{ display: { xs: 'none', sm: 'block' } }}>
                      Finance Hub
                    </Typography>
                  </Box>
                </Box>
              </GradientCard>
            </Box>
          </Slide>

          {/* Search Bar */}
          <Fade in={true} timeout={1000}>
            <GlassStatCard sx={{ mb: 3 }}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Search payments by tenant, unit, reference number..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                InputProps={{
                  startAdornment: <Search color="action" sx={{ mr: 1 }} />,
                  sx: { 
                    borderRadius: '12px',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(0,0,0,0.1)',
                    },
                  }
                }}
              />
            </GlassStatCard>
          </Fade>

          {/* Enhanced Rent Stats Section */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {/* Premium Radial Progress */}
            <Grid item xs={12} md={4}>
              <Zoom in={statsLoaded} timeout={1500}>
                <Box>
                  <PremiumStatCard glowcolor="#667eea" sx={{ textAlign: 'center', p: 3, height: '100%' }}>
                    <Typography variant="h6" fontWeight="700" gutterBottom sx={{ color: 'primary.main', mb: 2 }}>
                      Collection Rate
                    </Typography>
                    
                    <PremiumRadialContainer>
                      <PremiumOuterProgress percentage={rentStats.percentage} />
                      <PremiumInnerProgress percentage={rentStats.percentage} />
                      <PremiumRadialCenter>
                        <Typography variant="h4" fontWeight="800" color="primary">
                          {rentStats.percentage}%
                        </Typography>
                        <Typography variant="caption" sx={{ 
                          color: 'text.secondary',
                          fontWeight: 500,
                        }}>
                          Collected
                        </Typography>
                      </PremiumRadialCenter>
                    </PremiumRadialContainer>

                    {/* Mini stats below radial */}
                    <Grid container spacing={2} sx={{ mt: 3 }}>
                      <Grid item xs={6}>
                        <Box sx={{ textAlign: 'center' }}>
                          <ArrowUpward sx={{ color: '#4CAF50', fontSize: { xs: 18, md: 20 }, mb: 0.5 }} />
                          <Typography variant={isMobile ? "body2" : "body1"} fontWeight="600" color="success.main">
                            Ksh {rentStats.collected.toLocaleString()}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" fontWeight="500">
                            Collected
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={6}>
                        <Box sx={{ textAlign: 'center' }}>
                          <TrendingUp sx={{ color: '#2196F3', fontSize: { xs: 18, md: 20 }, mb: 0.5 }} />
                          <Typography variant={isMobile ? "body2" : "body1"} fontWeight="600" color="primary.main">
                            Ksh {rentStats.expected.toLocaleString()}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" fontWeight="500">
                            Expected
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </PremiumStatCard>
                </Box>
              </Zoom>
            </Grid>

            {/* Enhanced Stats Cards */}
            <Grid item xs={12} md={8}>
              <Grid container spacing={2} sx={{ height: '100%' }}>
                <Grid item xs={12} sm={6}>
                  <Fade in={true} timeout={1200}>
                    <PremiumStatCard glowcolor="#4CAF50" sx={{ height: { xs: 'auto', md: '100%' } }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Box sx={{ 
                          p: 1, 
                          borderRadius: '12px', 
                          background: 'linear-gradient(135deg, #4CAF50, #45a049)',
                          mr: 2,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <Paid sx={{ color: 'white', fontSize: { xs: 18, md: 20 } }} />
                        </Box>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant={isMobile ? "body2" : "body1"} fontWeight="600" color="success.main" gutterBottom>
                            Expected Rent
                          </Typography>
                          <Typography variant={isMobile ? "h6" : "h5"} fontWeight="700" color="success.main">
                            Ksh {rentStats.expected.toLocaleString()}
                          </Typography>
                        </Box>
                      </Box>
                      <Typography variant="caption" color="text.secondary">
                        Total projected revenue
                      </Typography>
                    </PremiumStatCard>
                  </Fade>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Fade in={true} timeout={1400}>
                    <PremiumStatCard glowcolor="#2196F3" sx={{ height: { xs: 'auto', md: '100%' } }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Box sx={{ 
                          p: 1, 
                          borderRadius: '12px', 
                          background: 'linear-gradient(135deg, #2196F3, #1976D2)',
                          mr: 2,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <MonetizationOn sx={{ color: 'white', fontSize: { xs: 18, md: 20 } }} />
                        </Box>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant={isMobile ? "body2" : "body1"} fontWeight="600" color="primary.main" gutterBottom>
                            Collected
                          </Typography>
                          <Typography variant={isMobile ? "h6" : "h5"} fontWeight="700" color="primary.main">
                            ${rentStats.collected.toLocaleString()}
                          </Typography>
                        </Box>
                      </Box>
                      <Typography variant="caption" color="text.secondary">
                        Processed payments
                      </Typography>
                    </PremiumStatCard>
                  </Fade>
                </Grid>

                <Grid item xs={12}>
                  <Fade in={true} timeout={1600}>
                    <PremiumStatCard glowcolor="#FF9800">
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Box sx={{ 
                          p: 1, 
                          borderRadius: '12px', 
                          background: 'linear-gradient(135deg, #FF9800, #F57C00)',
                          mr: 2,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <Schedule sx={{ color: 'white', fontSize: { xs: 18, md: 20 } }} />
                        </Box>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant={isMobile ? "body2" : "body1"} fontWeight="600" color="warning.main" gutterBottom>
                            Pending Actions
                          </Typography>
                          <Typography variant={isMobile ? "h6" : "h5"} fontWeight="700" color="warning.main">
                            {payments.filter(p => p.status === 'pending').length}
                          </Typography>
                        </Box>
                        <ActionButton 
                          variant="contained" 
                          glowcolor="#FF9800"
                          onClick={() => handleFilterChange('status', 'pending')}
                          size="small"
                          sx={{ 
                            minWidth: { xs: 'auto', sm: '100px' },
                            px: { xs: 1, sm: 2 }
                          }}
                        >
                          {isMobile ? 'Review' : 'Review All'}
                        </ActionButton>
                      </Box>
                      <Typography variant="caption" color="text.secondary">
                        Awaiting review
                      </Typography>
                    </PremiumStatCard>
                  </Fade>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          {/* Filters Section */}
          <Fade in={true} timeout={1800}>
            <Box sx={{ mb: 3 }}>
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                flexDirection: { xs: 'column', sm: 'row' },
                gap: { xs: 2, sm: 0 },
                mb: 2 
              }}>
                <ActionButton
                  startIcon={filtersOpen ? <ExpandLess /> : <ExpandMore />}
                  endIcon={<FilterAlt />}
                  onClick={() => setFiltersOpen(!filtersOpen)}
                  variant="outlined"
                  sx={{ width: { xs: '100%', sm: 'auto' } }}
                >
                  {filtersOpen ? 'Hide Filters' : 'Show Filters'}
                </ActionButton>
                
                <Box sx={{ 
                  display: 'flex', 
                  gap: 1, 
                  width: { xs: '100%', sm: 'auto' },
                  justifyContent: { xs: 'space-between', sm: 'flex-end' }
                }}>
                  <ActionButton
                    startIcon={<Clear />}
                    onClick={resetFilters}
                    variant="outlined"
                    size="small"
                    sx={{ flex: { xs: 1, sm: 'auto' } }}
                  >
                    {isMobile ? 'Clear' : 'Clear Filters'}
                  </ActionButton>
                  <ActionButton
                    startIcon={<Search />}
                    onClick={fetchPayments}
                    disabled={loading}
                    variant="contained"
                    size="small"
                    sx={{ flex: { xs: 1, sm: 'auto' } }}
                  >
                    {isMobile ? 'Search' : 'Apply Filters'}
                  </ActionButton>
                </Box>
              </Box>

              <Collapse in={filtersOpen}>
                <GlassStatCard sx={{ mb: 3 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={3}>
                      <TextField
                        fullWidth
                        label="Tenant Name"
                        size="small"
                        value={filters.tenantName}
                        onChange={(e) => handleFilterChange('tenantName', e.target.value)}
                      />
                    </Grid>
                    
                    <Grid item xs={12} sm={6} md={3}>
                      <TextField
                        fullWidth
                        label="Unit Name"
                        size="small"
                        value={filters.unitName}
                        onChange={(e) => handleFilterChange('unitName', e.target.value)}
                      />
                    </Grid>
                    
                    <Grid item xs={12} sm={6} md={3}>
                      <TextField
                        fullWidth
                        label="Property Name"
                        size="small"
                        value={filters.propertyName}
                        onChange={(e) => handleFilterChange('propertyName', e.target.value)}
                      />
                    </Grid>
                    
                    <Grid item xs={12} sm={6} md={3}>
                      <TextField
                        fullWidth
                        label="Reference Number"
                        size="small"
                        value={filters.referenceNumber}
                        onChange={(e) => handleFilterChange('referenceNumber', e.target.value)}
                      />
                    </Grid>
                    
                    <Grid item xs={12} sm={6} md={3}>
                      <FormControl fullWidth size="small">
                        <InputLabel>Status</InputLabel>
                        <Select
                          value={filters.status}
                          label="Status"
                          onChange={(e) => handleFilterChange('status', e.target.value)}
                        >
                          {statusOptions.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                              <Chip 
                                label={option.label} 
                                size="small" 
                                color={option.color}
                                variant={filters.status === option.value ? "filled" : "outlined"}
                              />
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                      <FormControl fullWidth size="small">
                        <InputLabel>Month</InputLabel>
                        <Select
                          value={filters.month}
                          label="Month"
                          onChange={(e) => handleFilterChange('month', e.target.value)}
                        >
                          <MenuItem value="">All Months</MenuItem>
                          {availableMonths.map((month) => (
                            <MenuItem key={month} value={month}>
                              {month}
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
                        renderInput={(params) => <TextField {...params} fullWidth size="small" />}
                      />
                    </Grid>
                    
                    <Grid item xs={12} sm={6} md={3}>
                      <DatePicker
                        label="End Date"
                        value={filters.endDate}
                        onChange={(date) => handleFilterChange('endDate', date)}
                        renderInput={(params) => <TextField {...params} fullWidth size="small" />}
                      />
                    </Grid>
                  </Grid>
                </GlassStatCard>
              </Collapse>
            </Box>
          </Fade>

          {/* Enhanced Results Section */}
          <Fade in={true} timeout={2000}>
            <GlassStatCard>
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                mb: 3,
                flexDirection: { xs: 'column', sm: 'row' },
                gap: { xs: 2, sm: 0 }
              }}>
                <Typography variant={isMobile ? "h6" : "h5"} sx={{ fontWeight: 700, color: 'primary.main' }}>
                  Payment Records
                </Typography>
                <Chip 
                  label={`${payments.length} records`}
                  color="primary"
                  variant="outlined"
                />
              </Box>

              <Divider sx={{ mb: 3 }} />

              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                  <CircularProgress size={40} />
                </Box>
              ) : error ? (
                <Alert 
                  severity="error" 
                  sx={{ borderRadius: '8px' }}
                >
                  {error}
                </Alert>
              ) : payments.length === 0 ? (
                <Box sx={{ 
                  p: 4, 
                  textAlign: 'center',
                  backgroundColor: 'grey.50',
                  borderRadius: '12px'
                }}>
                  <Search sx={{ fontSize: 40, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    No payments found
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Try adjusting your search criteria or filters
                  </Typography>
                </Box>
              ) : (
                <TableContainer sx={{ maxHeight: { xs: '500px', md: 'none' } }}>
  <Table sx={{ minWidth: 650 }} size={isMobile ? "small" : "medium"}>
    <TableHead>
      <TableRow sx={{ 
        backgroundColor: 'primary.main',
        '& th': { 
          fontWeight: 600, 
          color: 'white',
          fontSize: { xs: '0.75rem', sm: '0.9rem' },
          py: { xs: 1.5, sm: 2 },
          borderBottom: '2px solid',
          borderBottomColor: 'primary.dark'
        }
      }}>
        <TableCell>Tenant</TableCell>
        {!isMobile && <TableCell>Unit</TableCell>}
        {!isTablet && <TableCell>Property</TableCell>}
        <TableCell align="right">Amount</TableCell>
        {!isMobile && <TableCell>Period</TableCell>}
        <TableCell>Date</TableCell>
        <TableCell>Status</TableCell>
        <TableCell align="center">Actions</TableCell>
      </TableRow>
    </TableHead>
    
    <TableBody>
      {payments.map((payment, index) => (
        <Fade in={true} timeout={500 + (index * 100)} key={payment.payment_id}>
          <PremiumTableRow 
            status={payment.status}
            onClick={() => viewPaymentDetails(payment)}
          >
            {/* Tenant Column */}
            <TableCell>
              <Typography fontWeight="600" fontSize={isMobile ? "0.8rem" : "inherit"}>
                {payment.tenant_name}
              </Typography>
              {isMobile && (
                <Typography variant="caption" color="primary.main" display="block">
                  {payment.unit_name}
                </Typography>
              )}
            </TableCell>

            {/* Unit Column - shown on tablet and desktop */}
            {!isMobile && (
              <TableCell>
                <Typography color="primary.main" fontSize={isTablet ? "0.8rem" : "inherit"}>
                  {payment.unit_name}
                </Typography>
              </TableCell>
            )}

            {/* Property Column - shown only on desktop */}
            {!isTablet && (
              <TableCell>
                <Typography fontSize={isTablet ? "0.8rem" : "inherit"}>
                  {payment.property_name}
                </Typography>
              </TableCell>
            )}

            {/* Amount Column */}
            <TableCell align="right">
              <Typography fontWeight="700" color="success.main" fontSize={isMobile ? "0.8rem" : "inherit"}>
                Ksh {payment.amount?.toFixed(2)}
              </Typography>
            </TableCell>

            {/* Period Column - shown on tablet and desktop */}
            {!isMobile && (
              <TableCell>
                <Typography color="text.secondary" fontSize={isTablet ? "0.8rem" : "inherit"}>
                  {payment.payment_month}
                </Typography>
              </TableCell>
            )}

            {/* Date Column */}
            <TableCell>
              <Typography fontSize={isMobile ? "0.8rem" : "inherit"}>
                {payment.payment_date}
              </Typography>
            </TableCell>

            {/* Status Column */}
            <TableCell>
              <Chip
                label={payment.status}
                color={getStatusColor(payment.status)}
                size="small"
                sx={{ 
                  fontWeight: 600,
                  fontSize: { xs: '0.7rem', sm: '0.8rem' }
                }}
              />
            </TableCell>

            {/* Actions Column */}
            <TableCell align="center">
              {payment.status === 'pending' ? (
                <Box sx={{ 
                  display: 'flex', 
                  gap: 0.5, 
                  justifyContent: 'center',
                  flexDirection: { xs: 'column', sm: 'row' }
                }}>
                  <Tooltip title="Approve Payment">
                    <IconButton 
                      onClick={(e) => {
                        e.stopPropagation();
                        updatePaymentStatus(payment.payment_id, 'completed');
                      }}
                      sx={{ 
                        background: '#4CAF50',
                        color: 'white',
                        '&:hover': { background: '#45a049' }
                      }}
                      size={isMobile ? "small" : "medium"}
                    >
                      <CheckIcon fontSize={isMobile ? "small" : "small"} />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Reject Payment">
                    <IconButton 
                      onClick={(e) => {
                        e.stopPropagation();
                        updatePaymentStatus(payment.payment_id, 'rejected');
                      }}
                      sx={{ 
                        background: '#f44336',
                        color: 'white',
                        '&:hover': { background: '#d32f2f' }
                      }}
                      size={isMobile ? "small" : "medium"}
                    >
                      <CloseIcon fontSize={isMobile ? "small" : "small"} />
                    </IconButton>
                  </Tooltip>
                </Box>
              ) : (
                <Tooltip title="View Details">
                  <IconButton 
                    onClick={(e) => {
                      e.stopPropagation();
                      viewPaymentDetails(payment);
                    }}
                    sx={{ 
                      background: '#2196F3',
                      color: 'white',
                      '&:hover': { background: '#1976D2' }
                    }}
                    size={isMobile ? "small" : "medium"}
                  >
                    <Visibility fontSize={isMobile ? "small" : "small"} />
                  </IconButton>
                </Tooltip>
              )}
            </TableCell>
          </PremiumTableRow>
        </Fade>
      ))}
    </TableBody>
  </Table>
</TableContainer>
              )}
            </GlassStatCard>
          </Fade>

          {/* Payment Details Dialog */}
{/* Payment Details Dialog */}
<Dialog 
  open={detailsOpen} 
  onClose={() => setDetailsOpen(false)} 
  maxWidth="sm"
  fullWidth
  fullScreen={isMobile}
  PaperProps={{ 
    sx: { 
      borderRadius: { xs: 0, sm: '16px' },
      m: { xs: 0, sm: 2 },
      background: 'white',
      boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
    } 
  }}
>
  {/* Compact Header */}
  <DialogTitle sx={{ 
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
    color: 'white',
    fontWeight: 700,
    fontSize: '1.1rem',
    py: 2,
    textAlign: 'center'
  }}>
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
      <Receipt sx={{ fontSize: 20 }} />
      Payment Details
    </Box>
  </DialogTitle>
  
  <DialogContent sx={{ p: 0 }}>
    {selectedPayment && (
      <Box sx={{ p: 3 }}>
        {/* Compact Payment Summary */}
        <Card sx={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          borderRadius: '12px',
          p: 2,
          mb: 3,
          textAlign: 'center'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 1 }}>
            <MonetizationOn sx={{ fontSize: 24 }} />
            <Typography variant="h5" fontWeight={800}>
              Ksh {selectedPayment.amount?.toLocaleString()}
            </Typography>
          </Box>
          <Chip 
            label={selectedPayment.status.toUpperCase()} 
            size="small"
            sx={{ 
              background: 'rgba(255,255,255,0.2)',
              color: 'white',
              fontWeight: 600,
              fontSize: '0.7rem'
            }}
          />
        </Card>

        {/* Compact Details Grid */}
        <Grid container spacing={2}>
          {/* Tenant Info */}
          <Grid item xs={12}>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'flex-start', 
              gap: 2,
              p: 2,
              borderRadius: '8px',
              border: '1px solid',
              borderColor: 'grey.200',
              background: 'grey.50'
            }}>
              <AccountBalance sx={{ color: 'primary.main', fontSize: 20, mt: 0.5 }} />
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle2" fontWeight={600} color="text.primary" gutterBottom>
                  {selectedPayment.tenant_name}
                </Typography>
                <Typography variant="caption" color="text.secondary" display="block">
                  {selectedPayment.unit_name}, {selectedPayment.property_name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  ID: {selectedPayment.tenant_id}
                </Typography>
              </Box>
            </Box>
          </Grid>

          {/* Payment Details */}
          <Grid item xs={12} sm={6}>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'flex-start', 
              gap: 1.5,
              p: 2,
              borderRadius: '8px',
              border: '1px solid',
              borderColor: 'grey.200'
            }}>
              <Payment sx={{ color: 'secondary.main', fontSize: 18, mt: 0.25 }} />
              <Box>
                <Typography variant="caption" color="text.secondary" fontWeight={600} display="block">
                  Method
                </Typography>
                <Typography variant="body2" fontWeight={600} sx={{ textTransform: 'capitalize' }}>
                  {selectedPayment.payment_method?.replace('_', ' ') || 'N/A'}
                </Typography>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'flex-start', 
              gap: 1.5,
              p: 2,
              borderRadius: '8px',
              border: '1px solid',
              borderColor: 'grey.200'
            }}>
              <EventAvailable sx={{ color: 'primary.main', fontSize: 18, mt: 0.25 }} />
              <Box>
                <Typography variant="caption" color="text.secondary" fontWeight={600} display="block">
                  Date
                </Typography>
                <Typography variant="body2" fontWeight={600}>
                  {selectedPayment.payment_date}
                </Typography>
              </Box>
            </Box>
          </Grid>

          {/* Reference Number */}
          <Grid item xs={12}>
            <Box sx={{ 
              p: 2,
              borderRadius: '8px',
              border: '1px dashed',
              borderColor: 'primary.300',
              background: 'primary.50',
              textAlign: 'center'
            }}>
              <Typography variant="caption" fontWeight={700} color="primary.main" display="block" gutterBottom>
                REFERENCE NUMBER
              </Typography>
              <Typography sx={{ 
                fontFamily: 'monospace',
                fontWeight: 600,
                fontSize: '0.8rem',
                wordBreak: 'break-all',
                color: 'primary.main'
              }}>
                {selectedPayment.transaction_reference_number || 'No reference'}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>
    )}
  </DialogContent>
  
  <DialogActions sx={{ p: 2, borderTop: '1px solid', borderColor: 'grey.100' }}>
    <Button 
      onClick={() => setDetailsOpen(false)}
      variant="outlined"
      size="small"
      fullWidth={isMobile}
      sx={{
        borderRadius: '8px',
        fontSize: '0.9rem',
        fontWeight: 600,
      }}
    >
      Close
    </Button>
  </DialogActions>
</Dialog>
        </Box>
      </Box>
    </LocalizationProvider>
  );
}