"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AppBar,
  Toolbar,
  Button,
  Typography,
  IconButton,
  Box,
  LinearProgress,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Collapse,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import PeopleIcon from "@mui/icons-material/People";
import ReceiptIcon from "@mui/icons-material/Receipt";
import QrCodeIcon from "@mui/icons-material/QrCode";
import Dns from "@mui/icons-material/Dns";
import Settings from "@mui/icons-material/Settings";
import Public from "@mui/icons-material/Public";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";

const drawerWidth = 200;

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(true);
  const [openSetup, setOpenSetup] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setLoading(true);
    const timeout = setTimeout(() => setLoading(false), 500); // Simulate loading time
    return () => clearTimeout(timeout);
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login"); // Use Next.js navigation instead of full reload
  };

  return (
    <Box sx={{ display: "flex" }}>
      {/* Header */}
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <IconButton edge="start" color="inherit" aria-label="menu" onClick={() => setOpenDrawer(!openDrawer)}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6">Titan Shippers Dashboard</Typography>
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        </Toolbar>
        {loading && <LinearProgress color="secondary" />}
      </AppBar>

      {/* Sidebar */}
      <Drawer
        variant="permanent"
        open={openDrawer}
        sx={{
          width: openDrawer ? drawerWidth : 60,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: openDrawer ? drawerWidth : 60,
            transition: "width 0.3s",
            marginTop: "64px",
            height: "calc(100vh - 64px)",
          },
        }}
      >
        <List>
          <ListItemButton onClick={() => setOpenDrawer(!openDrawer)}>
            <ListItemText primary={openDrawer ? "Titan Shippers" : "T"} />
          </ListItemButton>
          <ListItemButton component={Link} href="/dashboard" passHref>
            <Dns />
            <ListItemText primary="Dashboard" sx={{ marginLeft: 2 }} />
          </ListItemButton>
          <ListItemButton component={Link} href="/dashboard/packages" passHref>
            <Public />
            <ListItemText primary="UPS Packages" sx={{ marginLeft: 2 }} />
          </ListItemButton>
          <ListItemButton component={Link} href="/dashboard/barcode" passHref>
            <QrCodeIcon />
            <ListItemText primary="Barcode" sx={{ marginLeft: 2 }} />
          </ListItemButton>
          <ListItemButton component={Link} href="/dashboard/clients" passHref>
            <PeopleIcon />
            <ListItemText primary="Clients" sx={{ marginLeft: 2 }} />
          </ListItemButton>
          
          <ListItemButton component={Link} href="/dashboard/invoices" passHref>
            <ReceiptIcon />
            <ListItemText primary="Invoice" sx={{ marginLeft: 2 }} />
            </ListItemButton>
          
          <ListItemButton component={Link} href="/dashboard/container" passHref>
            <LocalShippingIcon />
            <ListItemText primary="Container" sx={{ marginLeft: 2 }} />
          </ListItemButton>
          <ListItemButton onClick={() => setOpenSetup(!openSetup)}>
            <Settings />
            <ListItemText primary="Setup" sx={{ marginLeft: 2 }} />
            {openSetup ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Collapse in={openSetup} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItemButton sx={{ pl: 4 }} component={Link} href="/dashboard/users" passHref>
                <ListItemText primary="Users" />
              </ListItemButton>
              <ListItemButton sx={{ pl: 4 }} component={Link} href="/dashboard/roles" passHref>
                <ListItemText primary="Roles" />
              </ListItemButton>
            </List>
          </Collapse>
        </List>
      </Drawer>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          marginTop: "64px",
          padding: 1,
          minHeight: "calc(100vh - 64px)",
        }}
      >
        <Box sx={{ flexGrow: 1 }}>{children}</Box>

        {/* Footer */}
        <Box component="footer" sx={{ textAlign: "center", py: 2, bgcolor: "primary.main", color: "white" }}>
          <Typography variant="body2">© {new Date().getFullYear()} Titan Shippers. All Rights Reserved.</Typography>
        </Box>
      </Box>
    </Box>
  );
}
