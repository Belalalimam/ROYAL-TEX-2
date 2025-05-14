import React, { useState } from 'react';
import {
  Container,
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Divider,
  TextField,
  Paper,
  Stepper,
  Step,
  StepLabel,
  CircularProgress,
  Snackbar,
  Alert
} from "@mui/material";
import Grid from "@mui/material/Grid";
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';
import { useDispatch } from 'react-redux';
import {checkoutCart} from '../../../redux/apiCalls/cartApiCalls';

export default function Checkout() {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const dispatch = useDispatch();
  

  const steps = ['Shipping Information', 'Review Order', 'Payment'];

  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      setLoading(true);
      // Simulate API call
      setTimeout(() => {
        setLoading(false);
        setSuccess(true);
      }, 2000);
    } else {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleCloseSnackbar = () => {
    setSuccess(false);
  };

  const handlePlaceOrder = () => {
    dispatch(checkoutCart())
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }} style={{widht:'100%'}} className='checkout'>
      {/* <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center" fontWeight="bold" color="primary">
          Checkout
        </Typography>

        <Stepper activeStep={activeStep} sx={{ mb: 4, mt: 2 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Divider sx={{ mb: 4 }} />

        {activeStep === 0 && (
          <Box>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <LocationOnIcon color="primary" sx={{ mr: 1 }} />
              Shipping Details
            </Typography>

            <Grid container spacing={3}>
              <Grid xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  variant="outlined"
                  margin="normal"
                />
              </Grid>

              <Grid xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  variant="outlined"
                  margin="normal"
                />
              </Grid>

              <Grid xs={12}>
                <TextField
                  required
                  fullWidth
                  id="phone"
                  label="Phone Number"
                  variant="outlined"
                  margin="normal"
                  InputProps={{
                    startAdornment: <PhoneIcon color="action" sx={{ mr: 1 }} />,
                  }}
                />
              </Grid>

              <Grid xs={12}>
                <TextField
                  required
                  fullWidth
                  id="address"
                  label="Street Address"
                  variant="outlined"
                  margin="normal"
                />
              </Grid>

              <Grid xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="postalCode"
                  label="Postal Code"
                  variant="outlined"
                  margin="normal"
                />
              </Grid>

              <Grid xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="city"
                  label="City"
                  variant="outlined"
                  margin="normal"
                />
              </Grid>

              <Grid xs={12}>
                <TextField
                  required
                  fullWidth
                  id="country"
                  label="Country"
                  variant="outlined"
                  margin="normal"
                />
              </Grid>
            </Grid>
          </Box>
        )}

        {activeStep === 1 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Review Your Order
            </Typography>
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="body1">Order summary would appear here</Typography>
              </CardContent>
            </Card>
          </Box>
        )}

        {activeStep === 2 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Payment Method
            </Typography>
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="body1">Payment options would appear here</Typography>
              </CardContent>
            </Card>
          </Box>
        )}

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
          <Button
            variant="outlined"
            disabled={activeStep === 0}
            onClick={handleBack}
          >
            Back
          </Button>

          <Button
            variant="contained"
            color="primary"
            onClick={handleNext}
            endIcon={activeStep === steps.length - 1 ? <ShoppingCartCheckoutIcon /> : null}
            disabled={loading}
          >
            {loading ? (
              <CircularProgress size={24} />
            ) : activeStep === steps.length - 1 ? (
              'Place Order'
            ) : (
              'Continue'
            )}
          </Button>
        </Box>
      </Paper>

      <Snackbar open={success} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          Order placed successfully!
        </Alert>
      </Snackbar> */}
      <Button onClick={handlePlaceOrder}>checkout</Button>
    </Container>
  );
}
