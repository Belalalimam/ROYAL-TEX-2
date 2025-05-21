import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Chip,
  CircularProgress,
  useTheme
} from '@mui/material';
import {
  LocalShipping,
  Favorite,
  ShoppingBag,
  Star,
  LocalOffer,
  Timeline
} from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux";
import { getUserProfile } from './redux/apiCalls/profileApiCalls'
import { getUserProfileOrder } from './redux/apiCalls/orderApiCalls'
import { Link } from 'react-router-dom';

const UserDashboard = () => {
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const { like } = useSelector((state) => state.like);
  const { item = { items: [] } } = useSelector(state => state.cart) || {};
  const cart = item?.items || [];
  const { user } = useSelector((state) => state.auth);
  const recentOrders = useSelector((state) => state.orders.item);

  useEffect(() => {
    setLoading(false);
    dispatch(getUserProfile(user._id))
    dispatch(getUserProfileOrder())
  }, [user._id]);

  const ii = recentOrders.item;

  useEffect(() => {
    console.log(ii);
  }, []);







  const userStats = [
    { title: 'My Orders', value: cart?.length, icon: <ShoppingBag />, color: '#FF6B6B' },
    { title: 'Wishlist', value: like?.length, icon: <Favorite />, color: '#4ECDC4' },
    { title: 'Reward Points', value: '2,456', icon: <Star />, color: '#FFD93D' },
    { title: 'Coupons', value: '6', icon: <LocalOffer />, color: '#6C5CE7' }
  ];

  // const recentOrders = [
  //   { id: 1, product: 'Nike Air Max', status: 'Delivered', date: '2023-12-01', price: '$129.99' },
  //   { id: 2, product: 'Apple Watch', status: 'In Transit', date: '2023-11-28', price: '$399.99' },
  //   { id: 3, product: 'Sony Headphones', status: 'Processing', date: '2023-11-25', price: '$199.99' }
  // ];

  const activityData = [
    { date: 'Jan', amount: 450, orders: 5, savings: 50 },
    { date: 'Feb', amount: 680, orders: 8, savings: 85 },
    { date: 'Mar', amount: 890, orders: 12, savings: 120 },
    { date: 'Apr', amount: 750, orders: 9, savings: 95 },
    { date: 'May', amount: 1200, orders: 15, savings: 180 },
    { date: 'Jun', amount: 980, orders: 11, savings: 145 },
    { date: 'Jul', amount: 1500, orders: 18, savings: 220 },
    { date: 'Aug', amount: 1350, orders: 16, savings: 200 },
    { date: 'Sep', amount: 1150, orders: 14, savings: 170 },
    { date: 'Oct', amount: 1680, orders: 20, savings: 250 },
    { date: 'Nov', amount: 1890, orders: 22, savings: 280 },
    { date: 'Dec', amount: 2100, orders: 25, savings: 320 }
  ];


  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered': return '#4ECDC4';
      case 'In Transit': return '#FFD93D';
      case 'Processing': return '#FF6B6B';
      default: return '#6C5CE7';
    }
  };

  if (loading) {
    return (
      <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
      }}>
        <CircularProgress sx={{ color: '#6C5CE7' }} />
      </Box>
    );
  }

  return (
    <Box sx={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      py: 4
    }}>
      <Container maxWidth="xl">
        <Typography variant="h4" sx={{
          mb: 4,
          color: '#2C3E50',
          fontWeight: 'bold',
          textAlign: 'center'
        }}>
          Welcome back, {user?.fullname || 'User'}
        </Typography>

        <Grid container spacing={3}>
          {userStats.map((stat, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card sx={{
                height: '100%',
                borderRadius: '16px',
                boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                transition: 'transform 0.3s',
                '&:hover': {
                  transform: 'translateY(-5px)'
                }
              }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar sx={{ bgcolor: stat.color, mr: 2 }}>{stat.icon}</Avatar>
                    <Typography variant="h6" color="text.secondary">
                      {stat.title}
                    </Typography>
                  </Box>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', color: stat.color }}>
                    {stat.value}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}

          <Grid item xs={12} md={8}>
            <Paper sx={{
              p: 3,
              height: '400px',
              borderRadius: '16px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
            }}>
              <Typography variant="h6" gutterBottom sx={{ color: '#2C3E50' }}>
                Shopping Activity
              </Typography>
              <ResponsiveContainer width="100%" height="90%">
                <LineChart data={activityData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                  <XAxis dataKey="date" stroke="#2C3E50" />
                  <YAxis stroke="#2C3E50" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#fff',
                      borderRadius: '8px',
                      border: 'none',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="amount"
                    stroke="#6C5CE7"
                    strokeWidth={2}
                    dot={{ fill: '#6C5CE7' }}
                    name="Spending ($)"
                  />
                  <Line
                    type="monotone"
                    dataKey="orders"
                    stroke="#FF6B6B"
                    strokeWidth={2}
                    dot={{ fill: '#FF6B6B' }}
                    name="Orders"
                  />
                  <Line
                    type="monotone"
                    dataKey="savings"
                    stroke="#4ECDC4"
                    strokeWidth={2}
                    dot={{ fill: '#4ECDC4' }}
                    name="Savings ($)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper sx={{
              p: 3,
              height: '400px',
              borderRadius: '16px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
              overflow: 'auto'
            }}>
              <Typography variant="h6" gutterBottom sx={{ color: '#2C3E50' }}>
                Recent Orders
              </Typography>
              <List>
                <div className="user-profile">
                  <h2>My Orders</h2>

                  {recentOrders.length === 0 ? (
                    <p>You haven't placed any orders yet.</p>
                  ) : (
                    <div className="orders-list">
                      {recentOrders.map(order => (
                        <div key={order._id} className="order-card">
                          <div className="order-header">
                            <h3>Order #{order._id.substring(0, 8)}</h3>
                            <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                            <p>Status: <span className={`status-${order.status}`}>{order.status}</span></p>
                            <p>Total: ${order.totalAmount.toFixed(2)}</p>
                          </div>

                          <div className="order-items-preview">
                            <h4>Items:</h4>
                            <ul>
                              {order.items.map((item, index) => (
                                <li key={index}>
                                  {item.name} x {item.quantity} - ${item.productPrice.toFixed(2)} each
                                </li>
                              ))}
                            </ul>
                          </div>

                          <Link to={`/orders/${order._id}`} className="view-details-btn">
                            View Order Details
                          </Link>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </List>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default UserDashboard;
