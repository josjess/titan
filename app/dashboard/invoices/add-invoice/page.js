"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Layout from "@/components/Layout";
import {
  Container,
  TextField,
  Button,
  Typography,
  Grid,
  Snackbar,
  Alert,
  Box,
  Paper,
  Divider,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
} from "@mui/material";
import {
  Save as SaveIcon,
  ArrowBack as ArrowBackIcon,
  CalendarToday as CalendarIcon,
  LocalShipping as ShippingIcon,
  AttachMoney as MoneyIcon,
  Person as PersonIcon,
  Phone as PhoneIcon,
  Home as HomeIcon,
  Inventory as PackageIcon,
  Assignment as AssignmentIcon,
  Description as RemarksIcon,
} from "@mui/icons-material";

export default function AddInvoicePage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    shipping_company: "",
    shipping_option: "",
    invoice_number: "",
    invoice_date: "",
    client_name: "",
    phone_number: "",
    address: "",
    package: "",
    packagetype: "",
    date_picked: "",
    date_dispatched: "",
    total: "",
    paid: "",
    balance: "",
    deliveries: "",
    receiver_name: "",
    receiver_contact: "",
    reference_number: "",
    remarks: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const shippingCompanies = ["Titan Impex LLC", "James Express", "Titan Shippers"];
  const shippingOptions = ["Air", "Ship", "Other"];
  const packagetype = ["Box", "Pcs", "Ltrs"];


   // Generate reference number based on shipping option
   const generateReferenceNumber = (shippingOption) => {
    const prefixMap = {
      "Ship": "S",
      "Air": "A",
      "Road": "R",
      "Rail": "L"
    };
    
    const prefix = prefixMap[shippingOption] || "";
    const randomNum = Math.floor(100 + Math.random() * 900); // Generates 3-digit number
    
    return `${prefix}${randomNum}`;
  };


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Auto-generate reference number when shipping option changes
    if (name === "shipping_option" && value) {
      const refNumber = generateReferenceNumber(value);
      setFormData(prev => ({
        ...prev,
        reference_number: refNumber
      }));
    }
  };
    

  const calculateBalance = () => {
    const total = parseFloat(formData.total) || 0;
    const paid = parseFloat(formData.paid) || 0;
    return (total - paid).toFixed(2);
  };

  useEffect(() => {
    if (formData.total || formData.paid) {
      setFormData(prev => ({
        ...prev,
        balance: calculateBalance()
      }));
    }
  }, [formData.total, formData.paid]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch("/api/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to add invoice");

      setSuccess("Invoice added successfully");
      setTimeout(() => {
        router.push("/dashboard/invoices");
      }, 1500);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <Container maxWidth="lg">
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
          <IconButton onClick={() => router.push("/dashboard/invoices")} color="primary">
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" component="h1" sx={{ fontWeight: "bold" }}>
            Create New Invoice
          </Typography>
          <Box sx={{ width: 40 }} />
        </Box>

        <Paper sx={{ padding: 4, mt: 2, mb: 2 }}>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={1}>
              {/* Shipping Information Section */}
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ mb: 2, display: "flex", alignItems: "center" }}>
                  <ShippingIcon sx={{ mr: 1 }} />
                  Shipping Information
                </Typography>
                <Divider sx={{ mb: 1 }} />
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Shipping Company</InputLabel>
                  <Select
                    value={formData.shipping_company}
                    label="Shipping Company"
                    name="shipping_company"
                    onChange={handleChange}
                    required
                  >
                    {shippingCompanies.map((company) => (
                      <MenuItem key={company} value={company}>
                        {company}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Shipping Option</InputLabel>
                  <Select
                    value={formData.shipping_option}
                    label="Shipping Option"
                    name="shipping_option"
                    onChange={handleChange}
                    required
                  >
                    {shippingOptions.map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  fullWidth
                  label="Deliveries"
                  name="deliveries"
                  value={formData.deliveries}
                  onChange={handleChange}
                />
              </Grid>

              {/* Invoice Information Section */}
              <Grid item xs={12} sx={{ mt: 2 }}>
                <Typography variant="h6" sx={{ mb: 2, display: "flex", alignItems: "center" }}>
                  <AssignmentIcon sx={{ mr: 1 }} />
                  Invoice Information
                </Typography>
                <Divider sx={{ mb: 1 }} />
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  fullWidth
                  label="Invoice Number"
                  name="invoice_number"
                  value={formData.invoice_number}
                  onChange={handleChange}
                  required
                />
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  fullWidth
                  label="Invoice Date"
                  name="invoice_date"
                  type="date"
                  value={formData.invoice_date}
                  onChange={handleChange}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  fullWidth
                  label="Reference Number"
                  name="reference_number"
                  value={formData.reference_number}
                  onChange={handleChange}
                  InputProps={{
                    readOnly: true, // Make it read-only since it's auto-generated
                    startAdornment: (
                      <InputAdornment position="start">
                        <AssignmentIcon />
                      </InputAdornment>
                    ),
                }}
                />
              </Grid>

              {/* Client Information Section */}
              <Grid item xs={12} sx={{ mt: 2 }}>
                <Typography variant="h6" sx={{ mb: 2, display: "flex", alignItems: "center" }}>
                  <PersonIcon sx={{ mr: 1 }} />
                  Client Information
                </Typography>
                <Divider sx={{ mb: 1 }} />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Client Name"
                  name="client_name"
                  value={formData.client_name}
                  onChange={handleChange}
                  required
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleChange}
                  type="tel"
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  multiline
                  rows={2}
                />
              </Grid>

              {/* Receiver Information Section */}
              <Grid item xs={12} sx={{ mt: 2 }}>
                
                <Divider sx={{ mb: 1 }} />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Receiver Name"
                  name="receiver_name"
                  value={formData.client_name}
                  onChange={handleChange}
                  required
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Receiver Number"
                  name="receiver_contact"
                  value={formData.phone_number}
                  onChange={handleChange}
                  type="tel"
                />
              </Grid>

              

              {/* Package Information Section */}
              <Grid item xs={12} sx={{ mt: 2 }}>
                <Typography variant="h6" sx={{ mb: 2, display: "flex", alignItems: "center" }}>
                  <PackageIcon sx={{ mr: 1 }} />
                  Package Information
                </Typography>
                <Divider sx={{ mb: 1 }} />
              </Grid>

              <Grid item xs={12} sm={3} md={3}>
                <TextField
                  fullWidth
                  label="Quantity"
                  name="package"
                  type="Number"
                  value={formData.package}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={12} sm={3} md={3}>
              <FormControl fullWidth>
                  <InputLabel>Package Type</InputLabel>
                  <Select
                    value={formData.package_type}
                    label="Package Type"
                    name="package_type"
                    onChange={handleChange}
                    required
                  >
                    {packagetype.map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  label="Date Picked"
                  name="date_picked"
                  type="date"
                  value={formData.date_picked}
                  onChange={handleChange}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  label="Date Dispatched"
                  name="date_dispatched"
                  type="date"
                  value={formData.date_dispatched}
                  onChange={handleChange}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>

              {/* Financial Information Section */}
              <Grid item xs={12} sx={{ mt: 2 }}>
                <Typography variant="h6" sx={{ mb: 2, display: "flex", alignItems: "center" }}>
                  <MoneyIcon sx={{ mr: 1 }} />
                  Financial Information
                </Typography>
                <Divider sx={{ mb: 1}} />
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Total Amount"
                  name="total"
                  value={formData.total}
                  onChange={handleChange}
                  type="number"
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Amount Paid"
                  name="paid"
                  value={formData.paid}
                  onChange={handleChange}
                  type="number"
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Balance"
                  name="balance"
                  value={formData.balance}
                  onChange={handleChange}
                  type="number"
                  disabled
                />
              </Grid>

              {/* Submit Button */}
              <Grid item xs={12} sx={{ mt: 3 }}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                  startIcon={<SaveIcon />}
                  disabled={loading}
                  fullWidth
                  sx={{ py: 2 }}
                >
                  {loading ? "Saving Invoice..." : "Save Invoice"}
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>

        <Snackbar
          open={!!error}
          autoHideDuration={6000}
          onClose={() => setError("")}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert severity="error" onClose={() => setError("")} sx={{ width: "100%" }}>
            {error}
          </Alert>
        </Snackbar>

        <Snackbar
          open={!!success}
          autoHideDuration={6000}
          onClose={() => setSuccess("")}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert severity="success" onClose={() => setSuccess("")} sx={{ width: "100%" }}>
            {success}
          </Alert>
        </Snackbar>
      </Container>
    </Layout>
  );
}