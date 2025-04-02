"use client";

import React, { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Skeleton,
  CircularProgress,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface UserFormData extends Omit<User, "id"> {
  password: string;
}

export default function UsersPage() {
  const router = useRouter();
  const [authChecked, setAuthChecked] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const { register, handleSubmit, reset } = useForm<UserFormData>();
  const [users, setUsers] = useState<User[]>([]);
  const [contentLoading, setContentLoading] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/auth/verify', {
          credentials: 'include',
          cache: 'no-store'
        });

        if (!res.ok) throw new Error('Not authenticated');
        
        const data = await res.json();
        setUser(data.user);
        setAuthChecked(true);
      } catch (error) {
        router.replace('/login');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  useEffect(() => {
    if (!authChecked) return;

    const fetchUsers = async () => {
      try {
        const res = await fetch('/api/users', {
          credentials: 'include',
          cache: 'no-store'
        });
        
        if (!res.ok) throw new Error('Failed to fetch users');
        
        const data = await res.json();
        setUsers(data);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setContentLoading(false);
      }
    };

    fetchUsers();
  }, [authChecked]);

  const onSubmit = async (data: UserFormData) => {
    try {
      const response = await fetch("/api/users", {
        method: "POST",
        credentials: 'include',
        headers: { 
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const newUser = await response.json();
        setUsers([...users, newUser]);
        reset();
      }
    } catch (error) {
      console.error("Error adding user:", error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/users/${id}`, {
        method: "DELETE",
        credentials: 'include',
        headers: { 
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        setUsers(users.filter((user) => user.id !== id));
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  if (loading) {
    return (
      <Layout>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <CircularProgress />
        </Box>
      </Layout>
    );
  }

  if (!authChecked || !user) {
    return null;
  }

  return (
    <Layout>
      <Container>
        <Typography variant="h4" sx={{ mt: 3, mb: 2 }}>
          Manage Users
        </Typography>

        {contentLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6">Add New User</Typography>
              <form onSubmit={handleSubmit(onSubmit)}>
                <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                  <TextField 
                    label="Name" 
                    {...register("name", { required: true })} 
                    fullWidth 
                  />
                  <TextField 
                    label="Email" 
                    type="email" 
                    {...register("email", { required: true })} 
                    fullWidth 
                  />
                  <TextField 
                    label="Role" 
                    {...register("role", { required: true })} 
                    fullWidth 
                  />
                  <TextField 
                    label="Password" 
                    type="password" 
                    {...register("password", { required: true })} 
                    fullWidth 
                  />
                </Box>
                <Button type="submit" variant="contained">
                  Add User
                </Button>
              </form>
            </Paper>

            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Role</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.role}</TableCell>
                      <TableCell>
                        <IconButton color="primary">
                          <EditIcon />
                        </IconButton>
                        <IconButton 
                          color="error" 
                          onClick={() => handleDelete(user.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}
      </Container>
    </Layout>
  );
}