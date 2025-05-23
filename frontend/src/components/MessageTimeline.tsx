import React, { useMemo, useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import TimelineView from './TimelineView';
import TableView from './TableView';
import { Message } from '../types';

interface MessageTimelineProps {
  messages: Message[];
}

const MessageTimeline: React.FC<MessageTimelineProps> = ({ messages }) => {
  const [view, setView] = useState<'timeline' | 'list'>('timeline');

  const toggleView = () => {
    setView((prevView) => (prevView === 'timeline' ? 'list' : 'timeline'));
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <Button variant="contained" onClick={toggleView}>
          Switch to {view === 'timeline' ? 'List' : 'Timeline'} View
        </Button>
      </Box>
      {view === 'timeline' ? (
        <TimelineView messages={messages} />
      ) : (
        <TableView messages={messages} />
      )}
    </Box>
  );
};

export default MessageTimeline;