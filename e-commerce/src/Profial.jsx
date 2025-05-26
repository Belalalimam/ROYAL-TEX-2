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
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  CardMedia,
} from '@mui/material';
import {
  LocalShipping,
  Favorite,
  ShoppingBag,
  Star,
  LocalOffer,
  Timeline
} from '@mui/icons-material';
import CloseIcon from "@mui/icons-material/Close";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useSelector, useDispatch } from "react-redux";
import { getUserProfile } from './redux/apiCalls/profileApiCalls';
import { getUserProfileOrder } from './redux/apiCalls/orderApiCalls';
import { fetchProduct } from './redux/apiCalls/productApiCalls'
import { useNavigate } from 'react-router-dom';


const CategoryModal = ({ order, orderProducts, loading, open, onClose, handleCardClick }) => {
  if (!order) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{ sx: { width: '900px', height: '600px', margin: '20px' } }}
    >
      <DialogTitle sx={{ m: 0, }} className="flex items-center">
        <Typography variant="h5" sx={{ m: 0, fontSize: { xs: '1.1rem', sm: '0.9rem' }, fontWeight: 600 }}>
          Order Details - {order.items?.length || 0} Item{(order.items?.length || 0) > 1 ? 's' : ''}
        </Typography>
        <IconButton
          onClick={onClose}
          sx={{ position: 'absolute', right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent
        sx={{ 
          p: 2, 
          display: 'flex', 
          flexDirection: 'column',
          maxHeight: '500px',
          overflowY: 'auto'
        }}
      >
        {/* Order Summary */}
        <Box sx={{ mb: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
          <Typography variant="h6" sx={{ mb: 1, color: '#052659' }}>
            Order Summary
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography variant="body2">
                <strong>Order Date:</strong> {new Date(order.createdAt).toLocaleDateString()}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2">
                <strong>Status:</strong> {order.status || 'Processing'}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2">
                <strong>Payment Method:</strong> {order.paymentMethod || 'Card'}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2">
                <strong>Total Amount:</strong> ${order.totalAmount || '0.00'}
              </Typography>
            </Grid>
          </Grid>
        </Box>

        {/* Products List */}
        <Typography variant="h6" sx={{ mb: 2, color: '#052659' }}>
          Products in this Order
        </Typography>
        
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: 2,
            maxHeight: '300px',
            overflowY: 'auto',
            pr: 1
          }}>
            {orderProducts.map((item, index) => {
              const product = item.productDetails || item.productId || item;
              
              return (
                <Card 
                  key={index}
                  sx={{ 
                    cursor: 'pointer',
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'scale(1.02)',
                      boxShadow: 3
                    }
                  }}
                  onClick={() => handleCardClick(product)}
                >
                  <CardContent sx={{ p: 2 }}>
                    <Box sx={{ 
                      display: 'flex', 
                      gap: 2, 
                      flexDirection: { xs: 'column', sm: 'row' } 
                    }}>
                      {/* Product Image */}
                      <Box sx={{ width: { xs: '100%', sm: '150px' }, height: '120px' }}>
                        <CardMedia
                          component="img"
                          src={product?.productImage?.url || '/placeholder-image.jpg'}
                          alt={product?.productName || 'Product'}
                          sx={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            borderRadius: 1,
                            backgroundColor: 'grey.100'
                          }}
                        />
                      </Box>
                      
                      {/* Product Details */}
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="h6" sx={{ mb: 1, fontSize: '1.1rem' }}>
                          {product?.productName || 'Product Name'}
                        </Typography>
                        
                        <Grid container spacing={1}>
                          <Grid item xs={12} sm={6}>
                            <Typography variant="body2" sx={{ fontSize: '0.9rem' }}>
                              <span style={{ color: "#052659", fontWeight: 'bold' }}>Description:</span> 
                              {product?.productDescription || 'N/A'}
                            </Typography>
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <Typography variant="body2" sx={{ fontSize: '0.9rem' }}>
                              <span style={{ color: "#052659", fontWeight: 'bold' }}>Category:</span> 
                              {product?.productCategory || 'N/A'}
                            </Typography>
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <Typography variant="body2" sx={{ fontSize: '0.9rem' }}>
                              <span style={{ color: "#052659", fontWeight: 'bold' }}>Color:</span> 
                              {product?.productColor || 'N/A'}
                            </Typography>
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <Typography variant="body2" sx={{ fontSize: '0.9rem' }}>
                              <span style={{ color: "#052659", fontWeight: 'bold' }}>Size:</span> 
                              {product?.productCategorySize || 'N/A'}
                            </Typography>
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <Typography variant="body2" sx={{ fontSize: '0.9rem' }}>
                              <span style={{ color: "#052659", fontWeight: 'bold' }}>Quantity:</span> 
                              {item.quantity || 1}
                            </Typography>
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <Typography variant="body2" sx={{ fontSize: '0.9rem', fontWeight: 'bold' }}>
                              <span style={{ color: "#052659" }}>Price:</span> 
                              ${item.productPrice || item.price || '0.00'}
                            </Typography>
                          </Grid>
                        </Grid>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              );
            })}
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};



const UserDashboard = () => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedOrderProducts, setSelectedOrderProducts] = useState([]); // New state for order products
  const [loadingOrderProducts, setLoadingOrderProducts] = useState(false); // Loading state
  const theme = useTheme();
  const Products = useSelector((state) => state.product.product);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Add this line
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

  useEffect(() => {
    dispatch(fetchProduct());
  }, []);

  const handleCardClick = (product) => {
    navigate(`/getProduct/${product._id}`);
    window.scrollTo(0, 0);
  };

  // New function to handle order click and fetch product details
  const handleOrderClick = async (order) => {
    setLoadingOrderProducts(true);
    setSelectedProduct(order);
    
    try {
      // Fetch details for each product in the order
      const productPromises = order.items.map(async (item) => {
        // Dispatch action to fetch individual product
        const productId = item.productId?._id || item.productId;
        if (productId) {
          // You might need to create a new action or use existing one
          // For now, let's find the product from the already loaded products
          const existingProduct = Products.find(p => p._id === productId);
          if (existingProduct) {
            return {
              ...item,
              productDetails: existingProduct
            };
          } else {
            // If product not found in existing products, dispatch to fetch it
            // You might need to modify your fetchProduct action to accept an ID
            // For now, return the item with available data
            return item;
          }
        }
        return item;
      });

      const productsWithDetails = await Promise.all(productPromises);
      setSelectedOrderProducts(productsWithDetails);
    } catch (error) {
      console.error('Error fetching product details:', error);
      setSelectedOrderProducts(order.items);
    } finally {
      setLoadingOrderProducts(false);
    }
  };

  const orderCount = recentOrders.length;

  const userStats = [
    { title: 'My Orders', value: orderCount > 0 ? orderCount : '0' , icon: <ShoppingBag />, color: '#FF6B6B' },
    { title: 'Wishlist', value: like?.length, icon: <Favorite />, color: '#4ECDC4' },
    { title: 'Reward Points', value: '2,456', icon: <Star />, color: '#FFD93D' },
    { title: 'Coupons', value: '6', icon: <LocalOffer />, color: '#6C5CE7' }
  ];

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

          <Grid item xs={12} md={7}>
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

          {/* <Grid item xs={12} md={4}>
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
                {recentOrders.map((order) => (
                  
                  <ListItem
                    key={order.id}
                    sx={{
                      mb: 2,
                      bgcolor: '#fff',
                      borderRadius: '12px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: '#6C5CE7' }}>
                        <LocalShipping />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={order.product}
                      secondary={
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                          <Typography variant="body2" color="text.secondary">
                            {order.date}
                          </Typography>
                          <Chip
                            label={order.status}
                            size="small"
                            sx={{
                              bgcolor: getStatusColor(order.status),
                              color: 'white'
                            }}
                          />
                          <Chip
                            label={order.paymentMethod}
                            size="small"
                            sx={{
                              bgcolor: getStatusColor(order.paymentMethod),
                              color: 'white'
                            }}
                          />
                          <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#2C3E50' }}>
                            {order.price}
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid> */}


          <Grid item xs={12} md={5}>
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
                {recentOrders && recentOrders.length > 0 ? (
                  recentOrders.map((order, index) => (
                    <ListItem
                      key={order._id || index}
                      sx={{
                        mb: 2,
                        bgcolor: '#fff',
                        borderRadius: '12px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                        cursor: 'pointer'
                      }}
                      onClick={() => handleOrderClick(order)} // Updated to use new handler
                    >
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: '#6C5CE7' }}>
                          <LocalShipping />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          // If order has items array with populated products
                          order.items && order.items.length > 0
                            ? order.items.map(item =>
                              item.name || item.productId?.title || 'Product'
                            ).join(', ')
                            : order.productName || order.product || 'Order Items'
                        }
                        secondary={
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                            <Typography variant="body2" color="text.secondary">
                              {new Date(order.createdAt || order.date).toLocaleDateString()}
                            </Typography>
                            <Chip
                              label={order.status || 'Processing'}
                              size="small"
                              sx={{
                                bgcolor: getStatusColor(order.status || 'Processing'),
                                color: 'white'
                              }}
                            />
                            <Chip
                              label={order.paymentMethod || 'Card'}
                              size="small"
                              sx={{
                                bgcolor: getStatusColor(order.paymentMethod || 'Card'),
                                color: 'white'
                              }}
                            />
                            <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#2C3E50' }}>
                              ${order.totalAmount || order.price || '0.00'}
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                  ))
                ) : (
                  <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mt: 2 }}>
                    No recent orders found
                  </Typography>
                )}
              </List>
            </Paper>
          </Grid>

        </Grid>
      </Container>

     <CategoryModal
  order={selectedProduct}
  orderProducts={selectedOrderProducts} // Pass the fetched products
  loading={loadingOrderProducts} // Pass loading state
  open={selectedProduct !== null}
  onClose={() => {
    setSelectedProduct(null);
    setSelectedOrderProducts([]); // Clear products when closing
  }}
  handleCardClick={handleCardClick}
/>

    </Box>
  );
};

export default UserDashboard;
