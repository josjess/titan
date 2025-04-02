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
  const [packages, setPackages] = useState([]);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({
    date_received: "",
    tracking_no: "",
    num_packages: "",
    name: "",
    remarks: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/auth/verify", { credentials: "include" });
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
    if (user) {
      fetchPackages();
    }
  }, [user]);

  const fetchPackages = async () => {
    try {
      const res = await fetch("/api/packages", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch packages");
      const data = await res.json();
      setPackages(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const method = editId ? "PUT" : "POST";
      const url = editId ? `/api/packages/${editId}` : "/api/packages";
      const response = await fetch(url, {
        method,
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to save package");

      setSuccess(editId ? "Package updated successfully" : "Package added successfully");
      fetchPackages();
      setFormData({ date_received: "", tracking_no: "", num_packages: "", name: "", remarks: "" });
      setEditId(null);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleEdit = (pkg) => {
    setEditId(pkg._id);
    setFormData({
      id: pkg.id,
      date_received: pkg.date_received,
      tracking_no: pkg.tracking_no,
      num_packages: pkg.num_packages,
      name: pkg.name,
      remarks: pkg.remarks,
    });
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString("en-GB");
    } catch {
      return "Invalid Date";
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`/api/packages/${id}`, { method: "DELETE", credentials: "include" });
      if (!response.ok) throw new Error("Failed to delete package");
      setSuccess("Package deleted successfully");
      fetchPackages();
    } catch (error) {
      setError(error.message);
    }
  };

  if (loading) {
    return (
      <Layout>
        <Box sx={{ padding: "80px 20px" }}>
          <Container>
            <Skeleton variant="rectangular" width="100%" height={400} />
          </Container>
        </Box>
      </Layout>
    );
  }

  return (
    <Layout>
      <Box>
        <Container>
          <Typography variant="h4">Package Management</Typography>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={2}>
                <TextField label="Date received" name="date_received" type="date" InputLabelProps={{ shrink: true }} value={formData.date_received} onChange={handleChange} fullWidth required />
              </Grid>
              <Grid item xs={12} sm={6} md={2}>
                <TextField label="Tracking No" name="tracking_no" type="number" value={formData.tracking_no} onChange={handleChange} fullWidth required />
              </Grid>
              <Grid item xs={12} sm={6} md={2}>
                <TextField label="Number of Packages" name="num_packages" type="number" value={formData.num_packages} onChange={handleChange} fullWidth />
              </Grid>
              <Grid item xs={12} sm={6} md={2}>
                <TextField label="Name" name="name" value={formData.name} onChange={handleChange} fullWidth required />
              </Grid>
              <Grid item xs={12} sm={6} md={2}>
                <TextField label="Remarks" name="remarks" value={formData.remarks} onChange={handleChange} fullWidth />
              </Grid>
              <Grid item xs={12}>
                <Button type="submit" variant="contained" color="primary">
                  {editId ? "Update Package" : "Add Package"}
                </Button>
              </Grid>
            </Grid>
          </form>

          <TableContainer component={Paper} sx={{ mt: 4 }}>
            <Table>
              <TableHead>
              <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Date Received</TableCell>
                  <TableCell>Tracking Number</TableCell>
                  <TableCell>Number Of Packages</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Remarks</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                
              {packages.map((pkg) => (
                    <TableRow key={pkg._id}>
                      <TableCell>{pkg.id}</TableCell>
                      <TableCell>{formatDate(pkg.date_received)}</TableCell>
                      <TableCell>{pkg.tracking_no}</TableCell>
                      <TableCell>{pkg.num_packages || "N/A"}</TableCell>
                      <TableCell>{pkg.name || "N/A"}</TableCell>
                      <TableCell>{pkg.remarks}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => printcustomer(pkg)}> <PrintIcon /> </IconButton>
                      <IconButton onClick={() => handleEdit(pkg)}><EditIcon /></IconButton>
                      <IconButton onClick={() => handleDelete(pkg._id)}><DeleteIcon color="error" /></IconButton>
                    </TableCell>
                  </TableRow>
                ))}
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