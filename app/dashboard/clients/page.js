"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Layout from "@/components/Layout";
import {
  Container,
  Box,
  Typography,
  Button,
  Skeleton,
  TextField,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Snackbar,
  Alert,
} from "@mui/material";
import PrintIcon from "@mui/icons-material/Print";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [customers, setcustomers] = useState([]);
  const [formData, setFormData] = useState({
    customer_name: "",
    mobile_number: "",
    location: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/auth/verify", {
          credentials: "include",
          cache: "no-store",
        });

        if (!res.ok) throw new Error("Not authenticated");

        const data = await res.json();
        setUser(data.user);
      } catch (error) {
        router.replace("/login");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  useEffect(() => {
    const fetchcustomers = async () => {
      try {
        const res = await fetch("/api/customers", {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to fetch customers");
        const data = await res.json();
        setcustomers(data);
      } catch (err) {
        setError(err.message);
      }
    };
    if (user) fetchcustomers();
  }, [user]);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      router.push("/login");
      router.refresh();
    } catch (error) {
      setError("Logout failed");
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSend = {
        ...formData,
      };

      const response = await fetch("/api/customers", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) throw new Error("Failed to add customer");

      const newcustomer = await response.json();
      setcustomers([...customers, newcustomer]);
      setFormData({
        customer_name: "",
    mobile_number: "",
    location: "",
      });
      setSuccess("customer added successfully");
    } catch (error) {
      setError(error.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`/api/customers/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) throw new Error("Failed to delete customer");

      setcustomers(customers.filter((pkg) => pkg._id !== id));
      setSuccess("customer deleted successfully");
    } catch (error) {
      setError(error.message);
    }
  };

  const printcustomer = (pkg) => {
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head>
          <title>Client Details</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            table { border-collapse: collapse; width: 100%; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
            @media print {
              @page { size: auto; margin: 5mm; }
              button { display: none; }
            }
          </style>
        </head>
        <body>
          <h2>customer Details</h2>
          <table>
            <tr><th>customer</th><td>${pkg.mobile_number}</td></tr>
           <tr><th>tracking_no</th><td>${pkg.customer_name || "N/A"}</td></tr>
            <tr><th>num_customers</th><td>${pkg.location || "N/A"}</td></tr>
          </table>
          <button onclick="window.print()">Print</button>
          <script>
            setTimeout(() => { window.print(); }, 500);
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString("en-GB");
    } catch {
      return "Invalid Date";
    }
  };

  if (loading) {
    return (
      <Layout>
        <Box sx={{ marginLeft: "240px", padding: "80px 20px" }}>
          <Container>
            <Skeleton variant="rectangular" width="100%" height={400} />
          </Container>
        </Box>
      </Layout>
    );
  }

  if (!user) return null;

  return (
    <Layout>
      <Box>
        <Container>
          <Typography variant="h4" gutterBottom>
            Clients Management
          </Typography>

          <form onSubmit={handleSubmit}>
            <Grid container spacing={2} alignItems="center">
              
              <Grid item xs={12} sm={6} md={2}>
                <TextField
                  label="Mobile Number "
                  name="mobile_number"
                  type="number"
                  value={formData.mobile_number }
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
              
              <Grid item xs={12} sm={6} md={2}>
                <TextField
                  label="Customers Name"
                  name="customer_name"
                  type="Text"
                  value={formData.customer_name}
                  onChange={handleChange}
                  fullWidth
                  inputProps={{ min: 0 }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={2}>
                <TextField
                  label="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6} md={2}>
                <TextField
                  label="Address"
                  name="Address"
                  value={formData.address}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <Button type="submit" variant="contained" color="primary">
                  Add Customers
                </Button>
              </Grid>
            </Grid>
          </form>

          <TableContainer component={Paper} sx={{ mt: 4 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Mobile Number</TableCell>
                  <TableCell>Customers Name</TableCell>
                  <TableCell>Location</TableCell>
                  <TableCell>Address</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {customers.length > 0 ? (
                  customers.map((pkg) => (
                    <TableRow key={pkg._id}>
                      <TableCell>{pkg.id}</TableCell>
                      <TableCell>{pkg.mobile_number}</TableCell>
                      <TableCell>{pkg.customer_name || "N/A"}</TableCell>
                      <TableCell>{pkg.location || "N/A"}</TableCell>
                      <TableCell>{pkg.address}</TableCell>
                      <TableCell>
                        <IconButton onClick={() => printcustomer(pkg)}>
                          <PrintIcon />
                        </IconButton>
                        <IconButton>
                          <EditIcon />
                        </IconButton>
                        <IconButton onClick={() => handleDelete(pkg.id)}>
                          <DeleteIcon color="error" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      No Clients found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          
        </Container>
      </Box>

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError("")}
      >
        <Alert severity="error" onClose={() => setError("")}>
          {error}
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!success}
        autoHideDuration={6000}
        onClose={() => setSuccess("")}
      >
        <Alert severity="success" onClose={() => setSuccess("")}>
          {success}
        </Alert>
      </Snackbar>
    </Layout>
  );
}