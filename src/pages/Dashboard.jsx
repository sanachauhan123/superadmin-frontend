import React, { useEffect,useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { Box, Toolbar, Grid, Card, Typography, Avatar } from '@mui/material';
import Sidebar from '../components/Sidebar';
import Logout from './Logout';
import Restaurants from './Restaurants';
import Admins from './Admins';
import StoreIcon from '@mui/icons-material/Store';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import PeopleIcon from '@mui/icons-material/People';
import InsightsIcon from '@mui/icons-material/Insights';
import { BarChart } from '@mui/x-charts';
import axios from 'axios';
import API_BASE_URL from '../config';


function getLast6MonthsLabels() {
  const months = [];
  const date = new Date();

  for (let i = 5; i >= 0; i--) {
    const d = new Date(date.getFullYear(), date.getMonth() - i, 1);
    const label = d.toLocaleString('default', { month: 'short', year: 'numeric' });
    months.push(label); // e.g., "Mar 2025"
  }

  return months;
}

function countRegistrationsByMonth(data) {
  const labels = getLast6MonthsLabels();
  const monthCounts = {};

  // Initialize all months to 0
  labels.forEach((label) => {
    monthCounts[label] = 0;
  });

  data.forEach((item) => {
    const date = new Date(item.createdAt);
    const label = date.toLocaleString('default', { month: 'short', year: 'numeric' });
    if (monthCounts[label] !== undefined) {
      monthCounts[label]++;
    }
  });

  return {
    labels: Object.keys(monthCounts),
    counts: Object.values(monthCounts),
  };
}

const DashboardHome = () => {
  const [restaurantCount, setRestaurantCount] = useState(0);
  const [adminCount,setAdminCount] = useState(0);
  const [data, setData] = useState([]);
  const [newregistration,setNewRegistrationsThisMonth] = useState(0)
  const { labels, counts } = countRegistrationsByMonth(data);
  const [orders, setOrders] = useState([]);

  const stats = [
  { label: 'Restaurants', count: restaurantCount, icon: <StoreIcon />, color: '#42a5f5' },
  { label: 'Admins', count: adminCount, icon: <AdminPanelSettingsIcon />, color: '#66bb6a' },
  { label: 'New\nUsers', count: newregistration, icon: <PeopleIcon />, color: '#ffa726' },
  { label: 'Total\nSales', count: orders, icon: <InsightsIcon />, color: '#ab47bc' }
];

  useEffect(() => {
  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token'); // Make sure token is set

      const res = await axios.get(`${API_BASE_URL}/restaurants`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // console.log(res.data.data);
      setRestaurantCount(res.data.data.length);
      setData(res.data.data);

      // New Registrations This Month
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

      const newThisMonth = res.data.data.filter((r) => {
        const createdAt = new Date(r.createdAt);
        return createdAt >= startOfMonth;
      });

      setNewRegistrationsThisMonth(newThisMonth.length);

      const result = await axios.get(`${API_BASE_URL}/admin`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      //console.log(result.data);
      setAdminCount(result.data.data.length);
      
    } catch (err) {
      console.error('Error fetching data:', err);
    }
  };

  fetchData();
}, []);


  useEffect(() => {
    const token = localStorage.getItem('token');
    const fetchOrders = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/orders`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
        setOrders(res.data.data.length || []); // adjust depending on your response shape
        console.log('📦 Orders:', res.data.data);
      } catch (error) {
        console.error('Failed to fetch orders:', error);
      }
    };

    fetchOrders();
  }, []);

useEffect(() => {
  const token = localStorage.getItem('token');
    const fetchRegistrations = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/restaurants`);
        const restaurants = res.data.data;

        // Get current date and initialize 6 months with count 0
        const now = new Date();
        const monthMap = [];

        for (let i = 5; i >= 0; i--) {
          const monthDate = subMonths(now, i);
          monthMap.push({
            month: format(monthDate, 'MMM yyyy'),
            count: 0,
            date: startOfMonth(monthDate),
          });
        }

        // Count restaurants per month
        restaurants.forEach((rest) => {
          const createdAt = new Date(rest.createdAt);
          monthMap.forEach((entry) => {
            const nextMonth = subMonths(entry.date, -1);
            if (isAfter(createdAt, entry.date) && !isAfter(createdAt, nextMonth)) {
              entry.count += 1;
            }
          });
        });

        // Remove the `date` field before setting chart data
        setData(monthMap.map(({ month, count }) => ({ month, count })));

      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };

    fetchRegistrations();
  }, []);


  return (
    <Box>
      <Typography variant="h5" fontWeight="bold" mb={1}>
        Welcome to Super Admin Panel
      </Typography>
      <Typography variant="body1" color="text.secondary">
        Overview of system statistics and insights
      </Typography>

      {/* Stats Cards */}
   <Grid container spacing={3} sx={{ mt: 3 }}>
  {stats.map((stat, index) => (
    <Grid item xs={12} sm={6} md={3} key={index}>
      <Card
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: 170,
          borderRadius: 3,
          boxShadow: 2,
          textAlign: 'center',
          py: 2,
          transition: 'transform 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: 6,
          },
        }}
      >
        {/* Icon */}
        <Avatar
          sx={{
            bgcolor: stat.color,
            width: 56,
            height: 56,
            mb: 1.5,
          }}
        >
          {React.cloneElement(stat.icon, { fontSize: 'medium' })}
        </Avatar>

        {/* Label in two lines */}
        <Box
          sx={{
            minHeight: 36,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Typography
            variant="subtitle2"
            color="text.secondary"
            sx={{
              fontSize: 14,
              whiteSpace: 'pre-line',
              lineHeight: 1.2,
            }}
          >
            {stat.label}
          </Typography>
        </Box>

        {/* Count */}
        <Typography variant="h6" fontWeight="bold">
          {stat.count}
        </Typography>
      </Card>
    </Grid>
  ))}
</Grid>



      {/* Chart Section */}
      <Box sx={{ mt: 5 }}>
        <Typography variant="h6" gutterBottom>
          Restaurant Registrations (Last 6 Months)
        </Typography>
        {/* <BarChart
          xAxis={[{ scaleType: 'band', data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'] }]}
          series={[{ data: [2, 4, 6, 3, 5, 7], label: 'Restaurants' }]}
          width={600}
          height={300}
        /> */}
        <BarChart
        xAxis={[{ scaleType: 'band', data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'] }]}
        series={[{ data: counts, label: 'Restaurants' }]}
        width={600}
        height={300}
      />
      </Box>
    </Box>
  );
};

const Dashboard = () => {
  const navigate = useNavigate();

  const handleSelect = (menu) => {
    navigate(`/dashboard/${menu}`);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar onSelect={handleSelect} />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Routes>
          <Route path="" element={<DashboardHome />} />
          <Route path="restaurants" element={<Restaurants />} />
          <Route path="admins" element={<Admins />} />
          <Route path="logout" element={<Logout />} />
        </Routes>
      </Box>
    </Box>
  );
};

export default Dashboard;
