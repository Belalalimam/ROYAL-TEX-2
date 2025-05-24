import React, { useState } from 'react';
import {Button, TextField} from "@mui/material";
import { useDispatch } from 'react-redux';
import {checkoutCart} from '../../../redux/apiCalls/cartApiCalls';
import { useNavigate } from 'react-router-dom';

export default function Checkout() {

  const [formData, setFormData] = useState({ firstName: "", lastName: "", city: "", address: "", phoneNumber: "" });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(checkoutCart(formData, navigate));
  };

  return (
    <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="First Name"
            name="firstName"
            type="text"
            margin="normal"
            value={formData.firstName}
            onChange={handleChange}
          />


          <TextField
            fullWidth
            label="Last Name"
            name="lastName"
            type="text"
            margin="normal"
            value={formData.lastName}
            onChange={handleChange}

          />

          <TextField
            fullWidth
            label="City"
            name="city"
            type="text"
            margin="normal"
            value={formData.city}
            onChange={handleChange}

          />

          <TextField
            fullWidth
            label="Address"
            name="address"
            type="text"
            margin="normal"
            value={formData.address}
            onChange={handleChange}

          />

          <TextField
            fullWidth
            label="Phone Number"
            name="phoneNumber"
            type="text"
            margin="normal"
            value={formData.phoneNumber}
            onChange={handleChange}

          />
          

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Checkout
          </Button>
        </form>
  );
}
