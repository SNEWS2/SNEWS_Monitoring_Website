import React, { useEffect, useState } from 'react';
import { Box, Container, Typography, Paper } from '@mui/material';
import axios from 'axios';
import { format, parseISO } from 'date-fns';
import MessageTimeline from './components/MessageTimeline';
import { Message } from './types';

const API_BASE_URL = 'http://localhost:8000/api';

function App() {
  const [sigTierMessages, setSigTierMessages] = useState<Message[]>([]);
  const [timeTierMessages, setTimeTierMessages] = useState<Message[]>([]);
  const [coincidenceTierMessages, setCoincidenceTierMessages] = useState<Message[]>([]);
  const [heartbeatMessages, setHeartbeatMessages] = useState<Message[]>([]);

  const fetchMessages = async () => {
    try {
      const [sigTier, timeTier, coincidenceTier, heartbeat] = await Promise.all([
        axios.get<Message[]>(`${API_BASE_URL}/messages/sig-tier`),
        axios.get<Message[]>(`${API_BASE_URL}/messages/time-tier`),
        axios.get<Message[]>(`${API_BASE_URL}/messages/coincidence-tier`),
        axios.get<Message[]>(`${API_BASE_URL}/messages/heartbeat`),
      ]);

      setSigTierMessages(sigTier.data);
      setTimeTierMessages(timeTier.data);
      setCoincidenceTierMessages(coincidenceTier.data);
      setHeartbeatMessages(heartbeat.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 30000); // Fetch every 30 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <Container maxWidth="xl">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          SNEWS Message Monitor
        </Typography>
        
        <Paper sx={{ p: 2, mb: 2 }}>
          <Typography variant="h6" gutterBottom>
            Significance Tier Messages
          </Typography>
          <MessageTimeline messages={sigTierMessages} />
        </Paper>

        <Paper sx={{ p: 2, mb: 2 }}>
          <Typography variant="h6" gutterBottom>
            Time Tier Messages
          </Typography>
          <MessageTimeline messages={timeTierMessages} />
        </Paper>

        <Paper sx={{ p: 2, mb: 2 }}>
          <Typography variant="h6" gutterBottom>
            Coincidence Tier Messages
          </Typography>
          <MessageTimeline messages={coincidenceTierMessages} />
        </Paper>

        <Paper sx={{ p: 2, mb: 2 }}>
          <Typography variant="h6" gutterBottom>
            Heartbeat Messages
          </Typography>
          <MessageTimeline messages={heartbeatMessages} />
        </Paper>
      </Box>
    </Container>
  );
}

export default App; 