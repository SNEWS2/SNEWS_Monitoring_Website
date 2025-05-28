import React, { useState } from 'react';
import { Box, Table, TableBody, TableCell, TableHead, TableRow, TableSortLabel, Typography, Button, Select, MenuItem } from '@mui/material';
import { Message } from '../types';
import { SelectChangeEvent } from '@mui/material';

interface TableViewProps {
  messages: Message[];
}

const TableView: React.FC<TableViewProps> = ({ messages }) => {
  const [order, setOrder] = useState<'asc' | 'desc'>('desc');
  const [orderBy, setOrderBy] = useState<keyof Message>('received_time_utc');
  const [page, setPage] = useState(0);
  const [selectedDetector, setSelectedDetector] = useState<string>('All');
  const rowsPerPage = 10;

  const handleSort = (property: keyof Message) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleFilterChange = (event: SelectChangeEvent) => {
    setSelectedDetector(event.target.value as string);
    setPage(0); // Reset to the first page when filtering
  };

  const filteredMessages = messages.filter((message) => {
    return selectedDetector === 'All' || message.detector_name === selectedDetector;
  });

  const sortedMessages = [...filteredMessages].sort((a, b) => {
    const aValue = a[orderBy];
    const bValue = b[orderBy];

    if (orderBy === 'detector_name') {
      return order === 'asc'
        ? (aValue as string).localeCompare(bValue as string)
        : (bValue as string).localeCompare(aValue as string);
    }

    if (orderBy === 'received_time_utc' || orderBy === 'neutrino_time_utc') {
      const aTime = aValue ? new Date(aValue as string).getTime() : 0;
      const bTime = bValue ? new Date(bValue as string).getTime() : 0;
      return order === 'asc' ? aTime - bTime : bTime - aTime;
    }

    if (orderBy === 'p_val') {
      return order === 'asc'
        ? (aValue as number) - (bValue as number)
        : (bValue as number) - (aValue as number);
    }

    if (orderBy === 'is_test') {
      return order === 'asc'
        ? Number(aValue) - Number(bValue)
        : Number(bValue) - Number(aValue);
    }

    return 0;
  });

  const paginatedMessages = sortedMessages.slice(
    page * rowsPerPage,
    (page + 1) * rowsPerPage
  );

  const handleLoadMore = () => {
    setPage((prevPage) => prevPage + 1);
  };

  const handleLoadPrevious = () => {
    setPage((prevPage) => Math.max(prevPage - 1, 0));
  };

  const uniqueDetectors = Array.from(new Set(messages.map((msg) => msg.detector_name)));

  if (messages.length === 0) {
    return (
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Typography color="text.secondary">No messages available</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Select
          value={selectedDetector}
          onChange={handleFilterChange}
          displayEmpty
          sx={{ minWidth: 200 }}
        >
          <MenuItem value="All">All Detectors</MenuItem>
          {uniqueDetectors.map((detector) => (
            <MenuItem key={detector} value={detector}>
              {detector}
            </MenuItem>
          ))}
        </Select>
      </Box>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              <TableSortLabel
                active={orderBy === 'detector_name'}
                direction={orderBy === 'detector_name' ? order : 'asc'}
                onClick={() => handleSort('detector_name')}
              >
                Detector Name
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={orderBy === 'received_time_utc'}
                direction={orderBy === 'received_time_utc' ? order : 'asc'}
                onClick={() => handleSort('received_time_utc')}
              >
                Received Time
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={orderBy === 'neutrino_time_utc'}
                direction={orderBy === 'neutrino_time_utc' ? order : 'asc'}
                onClick={() => handleSort('neutrino_time_utc')}
              >
                Neutrino Time
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={orderBy === 'p_val'}
                direction={orderBy === 'p_val' ? order : 'asc'}
                onClick={() => handleSort('p_val')}
              >
                p-value
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={orderBy === 'is_test'}
                direction={orderBy === 'is_test' ? order : 'asc'}
                onClick={() => handleSort('is_test')}
              >
                Test Message
              </TableSortLabel>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {paginatedMessages.map((message) => (
            <TableRow key={message.id}>
              <TableCell>{message.detector_name}</TableCell>
              <TableCell>{message.received_time_utc}</TableCell>
              <TableCell>{message.neutrino_time_utc || 'N/A'}</TableCell>
              <TableCell>{message.p_val !== undefined ? message.p_val : 'N/A'}</TableCell>
              <TableCell>{message.is_test ? 'Yes' : 'No'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Box sx={{ textAlign: 'center', mt: 2 }}>
        <Button
          variant="contained"
          onClick={handleLoadPrevious}
          disabled={page === 0}
          sx={{ mr: 2 }}
        >
          Load Previous
        </Button>
        <Button
          variant="contained"
          onClick={handleLoadMore}
          disabled={sortedMessages.length <= (page + 1) * rowsPerPage}
        >
          Load More
        </Button>
      </Box>
    </Box>
  );
};

export default TableView;