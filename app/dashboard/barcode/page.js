"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import JsBarcode from "jsbarcode";
import Layout from "@/components/Layout";
import {
  Container,
  Box,
  Typography,
  Button,
  TextField,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Skeleton,
} from "@mui/material";

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [barcodeList, setBarcodeList] = useState([]);
  const [formData, setFormData] = useState({
    
    ean13_barcode: "",
   
    status: "",
  });

  const barcodeRef = useRef(null);

  // Check authentication
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

  // Fetch existing barcodes
  useEffect(() => {
    const fetchBarcodes = async () => {
      const res = await fetch("/api/barcode");
      const data = await res.json();
      setBarcodeList(data);
    };
    fetchBarcodes();
  }, []);

  // Generate a valid EAN-13 barcode number
  const generateEAN13 = () => {
    // Start with 12 random digits (first digit + 11 digits)
    let baseBarcode = Math.floor(Math.random() * 9) + 1; // First digit (1-9)
    baseBarcode += Math.floor(Math.random() * 100000000000).toString().padStart(11, '0'); // Next 11 digits
    
    // Calculate check digit
    let sum = 0;
    for (let i = 0; i < 12; i++) {
      const digit = parseInt(baseBarcode[i]);
      sum += digit * (i % 2 === 0 ? 1 : 3); // Alternate weights 1 and 3
    }
    
    const checkDigit = (10 - (sum % 10)) % 10;
    return baseBarcode + checkDigit; // 13 digits total
  };
  

  const handleGenerateBarcode = () => {
    const newBarcode = generateEAN13(); // This now generates all 13 digits correctly
    setFormData({ 
      ...formData, 
      ean13_barcode: newBarcode, 
      status: "Active"
    });
  
    setTimeout(() => {
      if (barcodeRef.current) {
        JsBarcode(barcodeRef.current, newBarcode, {
          format: "EAN13",
          lineColor: "#000",
          width: 2,
          height: 50,
          displayValue: true,
        });
      }
    }, 100);
  };
  
  const [selectedBarcode, setSelectedBarcode] = useState(null);

const handleSelectBarcode = (barcode) => {
  setSelectedBarcode(barcode);
};

const handlePrintSelectedBarcode = () => {
  if (!selectedBarcode) return;

  const printWindow = window.open("", "_blank");
  if (!printWindow) return;

  printWindow.document.write(`
    <html>
      <head>
        <title>Print Barcode</title>
        <style>
          body { text-align: center; font-family: Arial, sans-serif; }
          svg { margin-top: 20px; }
        </style>
      </head>
      <body>
        <h2>EAN-13 Barcode</h2>
        <svg id="barcode"></svg>
        <script src="https://cdn.jsdelivr.net/npm/jsbarcode@3.11.0/dist/JsBarcode.all.min.js"></script>
        <script>
          JsBarcode("#barcode", "${selectedBarcode.ean13_barcode}", {
            format: "EAN13",
            lineColor: "#000",
            width: 2,
            height: 50,
            displayValue: true
          });

          window.onload = function() {
            window.print();
            setTimeout(() => window.close(), 500);
          };
        </script>
      </body>
    </html>
  `);

  printWindow.document.close();
};

  const handlePrintBarcode = () => {
    if (!barcodeRef.current) return;
  
    // Create a new window
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
  
    // Write HTML content into the new window
    printWindow.document.write(`
      <html>
        <head>
          <title>Print Barcode</title>
          <style>
            body { text-align: center; font-family: Arial, sans-serif; }
            svg { margin-top: 20px; }
          </style>
        </head>
        <body>
          <h2>EAN-13 Barcode</h2>
          ${barcodeRef.current.outerHTML}
          <script>
            window.onload = function() {
              window.print();
              setTimeout(() => window.close(), 500); // Close after printing
            };
          </script>
        </body>
      </html>
    `);
  
    printWindow.document.close();
  };
  

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);

    // API call to save barcode
    try {
      const res = await fetch("/api/barcode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to add barcode");

      const newBarcode = await res.json();
      setBarcodeList([...barcodeList, newBarcode]); // Update table with new barcode
    } catch (error) {
      console.error("Error adding barcode:", error);
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
      <Box >
        <Typography variant="h4" gutterBottom>
          Barcode Management
        </Typography>

        {/* Barcode Form */}
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2} alignItems="center">
            
            <Grid item xs={12} sm={3}>
            <TextField
  label="Barcode"
  name="ean13_barcode"
  fullWidth
  value={formData.ean13_barcode || ""}
  onChange={handleChange}
/>

            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField label="Status" name="status" fullWidth value={formData.status} onChange={handleChange} />
            </Grid>
            <Grid item xs={12} sm={3}>
              <Button variant="contained" color="secondary" fullWidth onClick={handleGenerateBarcode}>
                Generate Barcode
              </Button>
            </Grid>
            <Grid item xs={12} sm={3}>
              <Button type="submit" variant="contained" color="primary" fullWidth>
                Add Barcode
              </Button>
            </Grid>
          </Grid>
        </form>

        {/* Display Barcode */}
<Box mt={3} textAlign="center">
  {formData.ean13_barcode && (
    <>
      <Typography variant="h6">Generated Barcode:</Typography>
      <svg ref={barcodeRef}></svg>

      {/* Print Barcode Button */}
      <Button 
        variant="contained" 
        color="primary" 
        sx={{ mt: 2 }} 
        onClick={handlePrintBarcode}
      >
        Print Barcode
      </Button>
    </>
  )}
</Box>


        {/* Barcode Table */}
        <TableContainer component={Paper} sx={{ mt: 4 }}>
          <Table>
            <TableHead>
              <TableRow>
              <TableCell>Select</TableCell>
                <TableCell>ID</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Barcode</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {barcodeList.map((barcode, index) => (
                <TableRow key={index}>
                  <TableCell>
            <input
              type="checkbox"
              checked={selectedBarcode?.ean13_barcode === barcode.ean13_barcode}
              onChange={() => handleSelectBarcode(barcode)}
            />
          </TableCell>
                  <TableCell>{barcode.id}</TableCell>
                  <TableCell>
                    {barcode.date ? new Date(barcode.date).toLocaleDateString("en-GB") : "N/A"}
                  </TableCell>
                  <TableCell>{barcode.ean13_barcode}</TableCell>
                  <TableCell>{barcode.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Print Selected Barcode Button */}
<Box textAlign="center" mt={2}>
  {selectedBarcode && (
    <Button 
      variant="contained" 
      color="primary" 
      onClick={handlePrintSelectedBarcode}
    >
      Print Selected Barcode
    </Button>
  )}
</Box>

        
      </Box>
    </Layout>
  );
}
