"use client";

import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { useRouter } from "next/navigation";

export default function Header() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove token from storage
    router.push("/login"); // Redirect to login page
  };

  return (
    <AppBar position="fixed">
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        {/* Left Side - Company Name */}
        <Typography variant="h6">Titan Shippers</Typography>

        {/* Right Side - Logout Button */}
        <Box>
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
