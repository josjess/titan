'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Layout from "@/components/Layout";
import { Container, Box, Typography, Button, Skeleton } from '@mui/material';

type User = {
  email: string;
};

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/auth/verify', {
          credentials: 'include',
          cache: 'no-store',
        });

        if (!res.ok) throw new Error('Not authenticated');

        const data = await res.json();
        setUser(data.user);
      } catch (error) {
        router.replace('/login');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
      alert('Logout failed. Please try again.');
    }
  };

  if (loading) {
    return (
      <Layout>
        <Box sx={{ marginLeft: '240px', padding: '80px 20px' }}>
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
      <Box sx={{ marginLeft: '240px', padding: '80px 20px' }}>
        <Container>
          <Typography variant="h4" gutterBottom>
            Dashboard
          </Typography>

          <Typography variant="h6">Welcome, {user.email}</Typography>

          <Button
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
            onClick={handleLogout}
          >
            Logout
          </Button>
        </Container>
      </Box>
    </Layout>
  );
}
