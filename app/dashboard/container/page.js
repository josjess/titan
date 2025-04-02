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
  const [containers, setContainers] = useState([]);
  const [formData, setFormData] = useState({
    container: "",
    loading_date: "",
    arrival_date: "",
    consignee: "",
    invoice_id: "",
    quantity: "",
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
    const fetchContainers = async () => {
      try {
        const res = await fetch("/api/containers", {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to fetch containers");
        const data = await res.json();
        setContainers(data);
      } catch (err) {
        setError(err.message);
      }
    };
    if (user) fetchContainers();
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
        quantity: formData.quantity ? Number(formData.quantity) : 0,
        // Convert empty strings to null
        invoice_id: formData.invoice_id || null,
        consignee: formData.consignee || null,
      };
  
      const response = await fetch("/api/containers", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });
  
      if (!response.ok) throw new Error("Failed to add container");
  
      const newContainer = await response.json();
      setContainers([...containers, newContainer]);
      setFormData({
        container: "",
        loading_date: "",
        arrival_date: "",
        consignee: "",
        invoice_id: "",
        quantity: "",
      });
      setSuccess("Container added successfully");
    } catch (error) {
      setError(error.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`/api/containers/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) throw new Error("Failed to delete container");

      setContainers(containers.filter((container) => container._id !== id));
      setSuccess("Container deleted successfully");
    } catch (error) {
      setError(error.message);
    }
  };

  const printContainer = (container) => {
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head>
          <title>Container Details</title>
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
          <h2>Container Details</h2>
          <table>
            <tr><th>Container</th><td>${container.container}</td></tr>
            <tr><th>Loading Date</th><td>${new Date(container.loading_date).toLocaleDateString("en-GB")}</td></tr>
            <tr><th>Arrival Date</th><td>${new Date(container.arrival_date).toLocaleDateString("en-GB")}</td></tr>
            <tr><th>Consignee</th><td>${container.consignee}</td></tr>
            <tr><th>Invoice</th><td>${container.invoice_id}</td></tr>
            <tr><th>Quantity</th><td>${container.quantity}</td></tr>
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
            Container Management
          </Typography>

          <form onSubmit={handleSubmit}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={6} md={2}>
                <TextField
                  label="Container"
                  name="container"
                  value={formData.container}
                  onChange={handleChange}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6} md={2}>
                <TextField
                  label="Loading Date"
                  name="loading_date"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  value={formData.loading_date}
                  onChange={handleChange}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6} md={2}>
                <TextField
                  label="Arrival Date"
                  name="arrival_date"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  value={formData.arrival_date}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6} md={2}>
                <TextField
                  label="Consignee"
                  name="consignee"
                  value={formData.consignee}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6} md={2}>
                <TextField
                  label="Invoice"
                  name="invoice_id"
                  value={formData.invoice_id}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6} md={2}>
                <TextField
                  label="Quantity"
                  name="quantity"
                  type="number"
                  value={formData.quantity}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <Button type="submit" variant="contained" color="primary">
                  Add Container
                </Button>
              </Grid>
            </Grid>
          </form>

          <TableContainer component={Paper} sx={{ mt: 4 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Container</TableCell>
                  <TableCell>Loading Date</TableCell>
                  <TableCell>Arrival Date</TableCell>
                  <TableCell>Consignee</TableCell>
                  <TableCell>Invoice</TableCell>
                  <TableCell>Quantity</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {containers.length > 0 ? (
                  containers.map((container) => (
                    <TableRow key={container._id}>
                      <TableCell>{container.container}</TableCell>
                      <TableCell>{formatDate(container.loading_date)}</TableCell>
                      <TableCell>{formatDate(container.arrival_date)}</TableCell>
                      <TableCell>{container.consignee}</TableCell>
                      <TableCell>{container.invoice_id}</TableCell>
                      <TableCell>{container.quantity}</TableCell>
                      <TableCell>
                        <IconButton onClick={() => printContainer(container)}>
                          <PrintIcon />
                        </IconButton>
                        <IconButton>
                          <EditIcon />
                        </IconButton>
                        <IconButton onClick={() => handleDelete(container._id)}>
                          <DeleteIcon color="error" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      No containers found
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