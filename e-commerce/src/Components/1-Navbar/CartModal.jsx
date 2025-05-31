import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Button,
  Card,
  CardMedia,
  CardContent,
  Select,
  MenuItem,
  Divider,
  Paper,
  useTheme,
  useMediaQuery,
  IconButton,
  CircularProgress
} from "@mui/material";
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useSelector, useDispatch } from "react-redux";
import { getUserProfileCart, updateCartQuantity, deleteCartForProduct } from '../../redux/apiCalls/cartApiCalls';
import { putLikeForProduct, getUserProfileLike } from "../../redux/apiCalls/likeApiCalls";
import { useNavigate } from "react-router-dom";
import CardProucts from '../4-Products/CardProduct';
import Checkout from "./checkout/checkout";

const CartModal = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  const { user } = useSelector((state) => state.auth);
  const { like } = useSelector(state => state.like);
  const { product } = useSelector(state => state.product);
  const { item, loading: cartLoading, error } = useSelector(state => state.cart) || {};

  // Fix cart data access - handle different possible structures
  const cart = item?.items || item || [];

  // console.log("Cart data:", cart);
  // console.log("Products data:", product);
  // console.log("Full cart item:", item);

  // Improved product filtering with better error handling
  const cartProducts = React.useMemo(() => {
    if (!product || !Array.isArray(product) || !cart || !Array.isArray(cart)) {
      console.log("Missing data - product:", !!product, "cart:", !!cart);
      return [];
    }

    const filtered = product.filter(prod => {
      if (!prod || !prod._id) return false;

      const isInCart = cart.some(cartItem => {
        if (!cartItem || !cartItem.productId) return false;

        // Handle both string and object productId
        const productId = typeof cartItem.productId === 'object'
          ? cartItem.productId._id || cartItem.productId.toString()
          : cartItem.productId;

        return productId === prod._id;
      });

      return isInCart;
    });

    console.log("Filtered cart products:", filtered);
    return filtered;
  }, [product, cart]);

  const handleRemoveFromCart = (productId) => {
    dispatch(deleteCartForProduct(productId));
  };

  const getQuantityForProduct = (productId) => {
    if (!cart || !Array.isArray(cart)) return 1;

    const cartItem = cart.find(item => {
      if (!item || !item.productId) return false;

      // Handle both string and object productId
      const itemProductId = typeof item.productId === 'object'
        ? item.productId._id || item.productId.toString()
        : item.productId;

      return itemProductId === productId;
    });

    return cartItem ? cartItem.quantity : 1;
  };

  const handleQuantityChange = async (productId, newQuantity) => {
    const quantity = parseInt(newQuantity);
    console.log("Changing quantity for product:", productId, "to:", quantity);

    if (quantity <= 0 || isNaN(quantity)) {
      console.error("Invalid quantity:", newQuantity);
      return;
    }

    const cartItem = cart.find(item => {
      const itemProductId = typeof item.productId === 'object'
        ? item.productId._id || item.productId.toString()
        : item.productId;
      return itemProductId === productId;
    });

    if (!cartItem) {
      console.error("Cart item not found for product:", productId);
      return;
    }

    const itemId = cartItem._id;
    console.log("Updating cart item:", itemId, "with quantity:", quantity);

    try {
      await dispatch(updateCartQuantity(itemId, quantity));
      // إعادة تحميل السلة بعد التحديث
      await dispatch(getUserProfileCart());
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  const toggleFavorite = (productId) => {
    dispatch(putLikeForProduct(productId));
  };

  const handleCardClick = (product) => {
    navigate(`/getProduct/${product._id}`);
  };

  const isProductLiked = (productId) => {
    return like?.some(item => item.productId === productId);
  };

  // useEffect لتحميل البيانات عند تحميل المكون
  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        setIsLoggedIn(true);
        setLoading(true);
        try {
          await dispatch(getUserProfileCart());
          await dispatch(getUserProfileLike(user._id));
        } catch (error) {
          console.error("Error fetching cart data:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, dispatch]);

  // useEffect لإعادة تحميل السلة عند تغيير البيانات
  useEffect(() => {
    if (user && !loading) {
      dispatch(getUserProfileCart());
    }
  }, [user, dispatch, loading]);

  // Show loading state
  if (loading || cartLoading) {
    return (
      <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '400px'
      }}>
        <CircularProgress />
      </Box>
    );
  }

  // Show error state
  if (error) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography color="error">
          Error loading cart: {error}
        </Typography>
        <Button
          variant="contained"
          onClick={() => dispatch(getUserProfileCart())}
          sx={{ mt: 2 }}
        >
          Retry
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ backgroundColor: theme.palette.background.default, py: 4 }}>
      <Container maxWidth="xl">
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{
            fontWeight: 600,
            mb: 3,
            textAlign: { xs: 'center', md: 'left' }
          }}
        >
          Your Shopping Cart ({cart.length} items)
        </Typography>

        {cart.length > 0 && cartProducts.length > 0 ? (
          <Grid container spacing={3}>
            <Grid item xs={12} md={7}>
              <Paper
                elevation={2}
                sx={{
                  p: { xs: 1, sm: 2 },
                  borderRadius: 2,
                  overflow: 'hidden'
                }}
              >
                {cartProducts.map((product, index) => (
                  <React.Fragment key={product._id}>
                    <Card
                      sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', sm: 'row' },
                        border: 'none',
                        boxShadow: 'none',
                        p: 1
                      }}
                    >
                      <CardMedia
                        component="img"
                        sx={{
                          width: { xs: '100%', sm: '180px' },
                          height: { xs: '200px', sm: '180px' },
                          objectFit: 'contain',
                          borderRadius: 1,
                          cursor: 'pointer',
                          transition: 'transform 0.3s',
                          '&:hover': {
                            transform: 'scale(1.05)'
                          }
                        }}
                        image={product.productImage?.url || '/placeholder-image.jpg'}
                        alt={product.productName}
                        onClick={() => handleCardClick(product)}
                      />

                      <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        width: '100%',
                        p: { xs: 1, sm: 2 }
                      }}>
                        <Box>
                          <Typography
                            variant="h6"
                            sx={{
                              fontWeight: 600,
                              fontSize: { xs: '1rem', sm: '1.1rem' },
                              mb: 1,
                              cursor: 'pointer',
                              '&:hover': { color: theme.palette.primary.main }
                            }}
                            onClick={() => handleCardClick(product)}
                          >
                            {product.productName}
                          </Typography>

                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mb: 1 }}
                          >
                            Category: {product.productCategory}
                          </Typography>

                          <Typography
                            variant="h6"
                            color="primary"
                            sx={{
                              fontWeight: 600,
                              mb: 2
                            }}
                          >
                            ${product.productPrice}
                          </Typography>
                        </Box>

                        <Box sx={{
                          display: 'flex',
                          flexDirection: { xs: 'column', sm: 'row' },
                          alignItems: { xs: 'flex-start', sm: 'center' },
                          justifyContent: 'space-between',
                          gap: 2,
                          mt: { xs: 2, sm: 0 }
                        }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="body2">Quantity:</Typography>
                            <Select
                              value={getQuantityForProduct(product._id)}
                              onChange={(e) => handleQuantityChange(product._id, e.target.value)}
                              size="small"
                              sx={{ minWidth: 70 }}
                            >
                              {[1, 2, 3, 4, 5].map((num) => (
                                <MenuItem key={num} value={num}>{num}</MenuItem>
                              ))}
                            </Select>
                          </Box>

                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <IconButton
                              color={isProductLiked(product._id) ? "error" : "default"}
                              onClick={() => toggleFavorite(product._id)}
                              size="small"
                              sx={{ border: '1px solid #e0e0e0' }}
                            >
                              {isProductLiked(product._id) ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                            </IconButton>

                            <Button
                              variant="outlined"
                              color="error"
                              size="small"
                              onClick={() => handleRemoveFromCart(product._id)}
                              startIcon={<DeleteOutlineIcon />}
                            >
                              {isMobile ? '' : 'Remove'}
                            </Button>
                          </Box>
                        </Box>
                      </Box>
                    </Card>
                    {index < cartProducts.length - 1 && <Divider sx={{ my: 2 }} />}
                  </React.Fragment>
                ))}
              </Paper>
            </Grid>

            <Grid item xs={12} md={5}>
              <div style={{ width: '100%' }}>
                <Checkout />
              </div>
            </Grid>
          </Grid>
        ) : (
          <Paper
            elevation={2}
            sx={{
              p: 4,
              textAlign: 'center',
              borderRadius: 2,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 3
            }}
          >
            <ShoppingCartIcon sx={{ fontSize: 80, color: 'text.secondary', opacity: 0.7 }} />

            <Typography variant="h5" component="h2" gutterBottom>
              {isLoggedIn ? "Your Cart is Empty" : "Your Cart is Empty"}
            </Typography>

            <Typography variant="body1" color="text.secondary" paragraph>
              {isLoggedIn
                ? "Looks like you haven't added any products to your cart yet."
                : "Sign in to view your cart or add items to it."}
            </Typography>

            <Box sx={{ mt: 2 }}>
              {isLoggedIn ? (
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  onClick={() => navigate('/')}
                >
                  Browse Products
                </Button>
              ) : (
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => navigate('/login')}
                  >
                    Sign In
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => navigate('/products')}
                  >
                    Browse Products
                  </Button>
                </Box>
              )}
            </Box>
          </Paper>
        )}

        {cartProducts.length === 0 && (
          <Box sx={{ mt: 6 }}>
            <CardProucts name={'Recommended Products'} />
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default CartModal;
