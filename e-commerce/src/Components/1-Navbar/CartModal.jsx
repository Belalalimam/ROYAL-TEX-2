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
  IconButton
} from "@mui/material";
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useSelector, useDispatch } from "react-redux";
import { getUserProfileCart, putCartForProduct, deleteCartForProduct } from '../../redux/apiCalls/cartApiCalls';
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

  const { user } = useSelector((state) => state.auth);
  const { like } = useSelector(state => state.like);
  const { product } = useSelector(state => state.product);
  const { item = { items: [] } } = useSelector(state => state.cart) || {};

  // console.log(product);

  const cart = item?.items || [];

  const cartProducts = product?.filter(prod =>
    cart?.some(cartItem => cartItem.productId === prod._id)
  );

  const handleRemoveFromCart = (productId) => {
    dispatch(deleteCartForProduct(productId));
  };

  const getQuantityForProduct = (productId) => {
    const cartItem = cart?.find(item => item.productId === productId);
    return cartItem ? cartItem.quantity : 1;
  };

  const handleQuantityChange = (productId, newQuantity) => {
    dispatch(putCartForProduct({ productId, quantity: newQuantity }));
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

  useEffect(() => {
    if (user) {
      setIsLoggedIn(true);
      dispatch(getUserProfileCart());
      dispatch(getUserProfileLike(user._id));
    }
  }, [user, dispatch]);

  return (
    <Box sx={{ backgroundColor: theme.palette.background.default, py: 4 }}>
      <Container maxWidth="xl" >
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
          Your Shopping Cart
        </Typography>

        {cart.length > 0 ? (
          <Grid container spacing={3}>
            <Grid item xs={12} md={7} className="">
              <Paper
                elevation={2}
                sx={{
                  p: { xs: 1, sm: 2 },
                  borderRadius: 2,
                  overflow: 'hidden'
                }}
              >
                {cartProducts?.map((product, index) => (
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
                        image={product.productImage.url}
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

            <Grid item xs={12} md={5} className="">
              <div style={{width:'100%'}} className="">
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
