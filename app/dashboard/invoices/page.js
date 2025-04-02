"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Layout from "@/components/Layout";
import {
  Container,
  Box,
  Typography,
  Button,
  TextField,
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
  InputAdornment,
} from "@mui/material";
import PrintIcon from "@mui/icons-material/Print";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SearchIcon from "@mui/icons-material/Search";

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [invoices, setInvoices] = useState([]);
  const [search, setSearch] = useState("");
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
      fetchInvoices();
    }
  }, [user]);

  const fetchInvoices = async () => {
    try {
      const res = await fetch("/api/invoices", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch invoices");
      const data = await res.json();
      setInvoices(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const filteredInvoices = invoices.filter((inv) =>
    [inv.client_name, inv.phone_number, inv.reference_number]
      .some((field) => field?.toLowerCase().includes(search.toLowerCase()))
  );
  
  const printInvoice = (inv) => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return alert("Please allow pop-ups for this site.");

    printWindow.document.write(`
      <html>
        <head>
          <title>Invoice #${inv.invoice_number}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .invoice-container { width: 80%; margin: auto; padding: 20px; border: 1px solid #ddd; }
            .invoice-header { text-align: center; margin-bottom: 20px; }
            .invoice-header h1 { margin: 0; }
            .invoice-details { width: 100%; margin-bottom: 20px; border-collapse: collapse; }
            .invoice-details th, .invoice-details td { padding: 8px; text-align: left; border: 1px solid #ddd; }
            .invoice-footer { margin-top: 20px; text-align: center; font-size: 14px; }
            @media print {
              @page { size: auto; margin: 10mm; }
              button { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="invoice-container">
            <div class="invoice-header">
              <h1>Company Name</h1>
              <p>123 Business Street, City, Country</p>
              <p>Email: info@company.com | Phone: +123 456 7890</p>
            </div>
            
            <h2>Invoice #${inv.invoice_number}</h2>

            <table class="invoice-details">
              <tr><th>Invoice Date:</th><td>${new Date(inv.invoice_date).toLocaleDateString("en-GB")}</td></tr>
              <tr><th>Client Name:</th><td>${inv.client_name || "N/A"}</td></tr>
              <tr><th>Phone Number:</th><td>${inv.phone_number || "N/A"}</td></tr>
              <tr><th>Shipping Company:</th><td>${inv.shipping_company || "N/A"}</td></tr>
              <tr><th>Shipping Option:</th><td>${inv.shipping_option || "N/A"}</td></tr>
              <tr><th>Total Amount:</th><td>${inv.total || "0.00"}</td></tr>
              <tr><th>Amount Paid:</th><td>${inv.paid || "0.00"}</td></tr>
              <tr><th>Balance Due:</th><td>${inv.balance || "0.00"}</td></tr>
              <tr><th>Receiver Name:</th><td>${inv.receiver_name || "N/A"}</td></tr>
              <tr><th>Receiver Contact:</th><td>${inv.receiver_contact || "N/A"}</td></tr>
              <tr><th>Reference Number:</th><td>${inv.reference_number || "N/A"}</td></tr>
              <tr><th>Remarks:</th><td>${inv.remarks || "N/A"}</td></tr>
            </table>

            <div class="invoice-footer">
              <p>Thank you for your business!</p>
            </div>

          </div>
          <script>
            window.onload = function() {
              window.print();
              setTimeout(() => window.close(), 1000);
            };
          </script>
        </body>
      </html>
    `);

    printWindow.document.close();
};

  
  

  return (
    <Layout>
      <Container>
        <Box display="flex" justifyContent="space-between" alignItems="center" mt={3} mb={2}>
          <Typography variant="h4">Invoice Management</Typography>
          <Button variant="contained" color="primary" onClick={() => router.push("/dashboard/invoices/add-invoice")}>Add Invoice</Button>
        </Box>

        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search "
          value={search}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ mb: 3 }}
        />

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Invoice Number</TableCell>
                <TableCell>Client Name</TableCell>
                <TableCell>Phone Number</TableCell>
                <TableCell>Address</TableCell>
                <TableCell>Package</TableCell>
                <TableCell>Total</TableCell>
                <TableCell>Paid</TableCell>
                <TableCell>Balance</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredInvoices.map((inv) => (
                <TableRow key={inv._id}>
                  <TableCell>{inv.invoice_number}</TableCell>
                  <TableCell>{inv.client_name}</TableCell>
                  <TableCell>{inv.phone_number}</TableCell>
                  <TableCell>{inv.address}</TableCell>
                  <TableCell>{inv.package}</TableCell>
                  <TableCell>{inv.total}</TableCell>
                  <TableCell>{inv.paid}</TableCell>
                  <TableCell>{inv.balance}</TableCell>
                  <TableCell>
                  <IconButton onClick={() => printInvoice(inv)}> <PrintIcon /> </IconButton>
               <IconButton color="secondary" onClick={() => console.log("Edit", inv)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton color="error" onClick={() => console.log("Delete", inv._id)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError("")}> 
          <Alert severity="error" onClose={() => setError("")}>{error}</Alert>
        </Snackbar>
        <Snackbar open={!!success} autoHideDuration={6000} onClose={() => setSuccess("")}> 
          <Alert severity="success" onClose={() => setSuccess("")}>{success}</Alert>
        </Snackbar>
      </Container>
    </Layout>
  );
}
