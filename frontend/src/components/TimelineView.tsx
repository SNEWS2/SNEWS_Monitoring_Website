import React, { useMemo } from 'react';
import { Box, Tooltip, Typography } from '@mui/material';
import { format, parseISO, differenceInSeconds } from 'date-fns';
import { Message } from '../types';

interface TimelineViewProps {
  messages: Message[];
}

const TimelineView: React.FC<TimelineViewProps> = ({ messages }) => {
  const timelineData = useMemo(() => {
    if (messages.length === 0) return null;

    const sortedMessages = [...messages].sort((a, b) =>
      parseISO(a.received_time_utc).getTime() - parseISO(b.received_time_utc).getTime()
    );

    const startTime = parseISO(sortedMessages[0].received_time_utc);
    const endTime = parseISO(sortedMessages[sortedMessages.length - 1].received_time_utc);
    const totalSeconds = differenceInSeconds(endTime, startTime);

    return {
      startTime,
      endTime,
      totalSeconds,
      messages: sortedMessages.map(msg => ({
        ...msg,
        position: (differenceInSeconds(parseISO(msg.received_time_utc), startTime) / totalSeconds) * 100
      }))
    };
  }, [messages]);

  const detectorColors: Record<string, string> = {
  Baksan: 'red',
  Borexino: 'orange',
  'DS-20K': 'yellow',
  DUNE: 'cyan',
  HALO: 'pink',
  'HALO-1kT': 'purple',
  'Hyper-K': 'blue',
  IceCube: 'teal',
  JUNO: 'green',
  KM3NeT: 'lime',
  KamLAND: 'amber',
  LVD: 'brown',
  LZ: 'indigo',
  MicroBooNe: 'violet',
  NOvA: 'magenta',
  'PandaX-4T': 'gold',
  SBND: 'primary.main',
  'SNO+': 'secondary.main',
  'Super-K': 'error.main',
  XENONnT: 'success.main',
  default: 'grey.500',
};

  const getDotColor = (detectorName: string) => {
    return detectorColors[detectorName] || detectorColors.default;
  };

  if (!timelineData) {
    return (
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Typography color="text.secondary">No messages available</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ position: 'relative', height: 60, bgcolor: 'grey.100', borderRadius: 1 }}>
      <Box sx={{ position: 'absolute', width: '100%', display: 'flex', justifyContent: 'space-between', px: 1 }}>
        <Typography variant="caption">
          {format(timelineData.startTime, 'HH:mm:ss')}
        </Typography>
        <Typography variant="caption">
          {format(timelineData.endTime, 'HH:mm:ss')}
        </Typography>
      </Box>
      {timelineData.messages.map((message) => (
        <Tooltip
          key={message.id}
          title={
            <Box>
              <Typography variant="subtitle2">{message.detector_name}</Typography>
              <Typography variant="body2">
                Received: {format(parseISO(message.received_time_utc), 'HH:mm:ss.SSS')}
              </Typography>
              {message.neutrino_time_utc && (
                <Typography variant="body2">
                  Neutrino: {format(parseISO(message.neutrino_time_utc), 'HH:mm:ss.SSS')}
                </Typography>
              )}
              {message.p_val !== undefined && (
                <Typography variant="body2">p-value: {message.p_val}</Typography>
              )}
              {message.is_test && (
                <Typography variant="body2" color="warning.main">Test Message</Typography>
              )}
            </Box>
          }
        >
          <Box
            sx={{
              position: 'absolute',
              left: `${message.position}%`,
              top: '50%',
              transform: 'translate(-50%, -50%)',
              width: 8,
              height: 8,
              borderRadius: '50%',
              bgcolor: getDotColor(message.detector_name),
              cursor: 'pointer',
              '&:hover': {
                transform: 'translate(-50%, -50%) scale(1.2)',
              },
            }}
          />
        </Tooltip>
      ))}
    </Box>
  );
};

export default TimelineView;
