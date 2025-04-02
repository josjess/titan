"use client";

import React, { useState } from "react";
import { Drawer, List, ListItemButton, ListItemText, Collapse, AppBar, Toolbar, Typography, IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import PeopleIcon from "@mui/icons-material/People";
import ReceiptIcon from "@mui/icons-material/Receipt";
import QrCodeIcon from "@mui/icons-material/QrCode";
import Dns from '@mui/icons-material/Dns';
import LocalShippingIcon from "@mui/icons-material/LocalShipping";

const drawerWidth = 240; // Sidebar width when open

export default function Layout({ children }: { children: React.ReactNode }) {

  const [openDrawer, setOpenDrawer] = useState(true);
  const [openSetup, setOpenSetup] = useState(false);

  return (
    <div style={{ display: "flex" }}>
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
            marginTop: "64px", // Move Sidebar down to avoid overlap with the AppBar
            height: "calc(100vh - 64px)", // Ensure it fits properly
          },
        }}
      >
        <List>
          <ListItemButton onClick={() => setOpenDrawer(!openDrawer)}>
            <ListItemText primary={openDrawer ? "Titan Shippers" : "T"} />
          </ListItemButton>
          <ListItemButton>
            <Dns />
            <ListItemText primary="DashBoard" sx={{ marginLeft: 2 }} />
          </ListItemButton>
          <ListItemButton>
            <ReceiptIcon />
            <ListItemText primary="Invoice" sx={{ marginLeft: 2 }} />
          </ListItemButton>
          <ListItemButton>
            <QrCodeIcon />
            <ListItemText primary="Barcode" sx={{ marginLeft: 2 }} />
          </ListItemButton>
          <ListItemButton>
            <LocalShippingIcon />
            <ListItemText primary="Container" sx={{ marginLeft: 2 }} />
          </ListItemButton>
          <ListItemButton onClick={() => setOpenSetup(!openSetup)}>
            <PeopleIcon />
            <ListItemText primary="Setup" sx={{ marginLeft: 2 }} />
            {openSetup ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Collapse in={openSetup} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItemButton sx={{ pl: 4 }}>
                <ListItemText primary="Users" />
              </ListItemButton>
              <ListItemButton sx={{ pl: 4 }}>
                <ListItemText primary="New User" />
              </ListItemButton>
            </List>
          </Collapse>
        </List>
      </Drawer>

      {/* Main Content */}
      <div style={{ flexGrow: 1 }}>
        {/* Header */}
        <AppBar position="static">
          <Toolbar>
            <IconButton edge="start" color="inherit" aria-label="menu" onClick={() => setOpenDrawer(!openDrawer)}>
              <MenuIcon />
            </IconButton>
            <Typography variant="h6">Titan Shippers Dashboard</Typography>
          </Toolbar>
        </AppBar>

        {/* Page Content */}
        <div style={{ padding: 20 }}>{children}</div>
      </div>
    </div>
  );
}
