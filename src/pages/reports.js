import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Card,
  CardContent,
  CardHeader,
  Divider,
  IconButton
} from '@mui/material';
import {
  EventNote,
  Inventory,
  AttachMoney,
  BusinessCenter,
  People,
  TrendingUp
} from '@mui/icons-material';

const ReportsPage = () => {
  const [timeRange, setTimeRange] = useState('30');

  return (
    <Box sx={{ padding: 4, maxWidth: 1200, margin: '0 auto' }}>
      {/* Header Section */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1">
          Reports Dashboard
        </Typography>
        
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Time Period</InputLabel>
          <Select
            value={timeRange}
            label="Time Period"
            onChange={(e) => setTimeRange(e.target.value)}
          >
            <MenuItem value={7}>Last 7 Days</MenuItem>
            <MenuItem value={30}>Last 30 Days</MenuItem>
            <MenuItem value={90}>Last 90 Days</MenuItem>
            <MenuItem value="custom">Custom Range</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Reports Grid */}
      <Grid container spacing={3}>
        {/* Rental Overview */}
        <Grid item xs={12} md={6} lg={4}>
          <Paper elevation={3}>
            <Card>
              <CardHeader
                avatar={<EventNote color="primary" />}
                title="Rental Overview"
                action={
                  <IconButton>
                    <TrendingUp />
                  </IconButton>
                }
              />
              <Divider />
              <CardContent>
                <Typography variant="body2" component="div">
                  • Total Rentals by Event Type
                  <br />
                  • Upcoming vs Completed Events
                  <br />
                  • Peak Season Analysis
                  <br />
                  • Average Rental Duration
                </Typography>
              </CardContent>
            </Card>
          </Paper>
        </Grid>

        {/* Inventory Analytics */}
        <Grid item xs={12} md={6} lg={4}>
          <Paper elevation={3}>
            <Card>
              <CardHeader
                avatar={<Inventory color="primary" />}
                title="Inventory Analytics"
                action={
                  <IconButton>
                    <TrendingUp />
                  </IconButton>
                }
              />
              <Divider />
              <CardContent>
                <Typography variant="body2" component="div">
                  • Most Rented Items
                  <br />
                  • Item Availability Status
                  <br />
                  • Maintenance Schedule
                  <br />
                  • Damaged/Lost Items
                </Typography>
              </CardContent>
            </Card>
          </Paper>
        </Grid>

        {/* Financial Reports */}
        <Grid item xs={12} md={6} lg={4}>
          <Paper elevation={3}>
            <Card>
              <CardHeader
                avatar={<AttachMoney color="primary" />}
                title="Financial Reports"
                action={
                  <IconButton>
                    <TrendingUp />
                  </IconButton>
                }
              />
              <Divider />
              <CardContent>
                <Typography variant="body2" component="div">
                  • Revenue Analysis
                  <br />
                  • Outstanding Payments
                  <br />
                  • Deposit Status
                  <br />
                  • Refund History
                </Typography>
              </CardContent>
            </Card>
          </Paper>
        </Grid>

        {/* Package Performance */}
        <Grid item xs={12} md={6} lg={4}>
          <Paper elevation={3}>
            <Card>
              <CardHeader
                avatar={<BusinessCenter color="primary" />}
                title="Package Performance"
                action={
                  <IconButton>
                    <TrendingUp />
                  </IconButton>
                }
              />
              <Divider />
              <CardContent>
                <Typography variant="body2" component="div">
                  • Popular Packages
                  <br />
                  • Custom vs Standard Packages
                  <br />
                  • Package Modifications
                  <br />
                  • Add-on Analysis
                </Typography>
              </CardContent>
            </Card>
          </Paper>
        </Grid>

        {/* Customer Insights */}
        <Grid item xs={12} md={6} lg={4}>
          <Paper elevation={3}>
            <Card>
              <CardHeader
                avatar={<People color="primary" />}
                title="Customer Insights"
                action={
                  <IconButton>
                    <TrendingUp />
                  </IconButton>
                }
              />
              <Divider />
              <CardContent>
                <Typography variant="body2" component="div">
                  • Customer Demographics
                  <br />
                  • Repeat Customers
                  <br />
                  • Satisfaction Ratings
                  <br />
                  • Referral Sources
                </Typography>
              </CardContent>
            </Card>
          </Paper>
        </Grid>

        {/* Operational Metrics */}
        <Grid item xs={12} md={6} lg={4}>
          <Paper elevation={3}>
            <Card>
              <CardHeader
                avatar={<TrendingUp color="primary" />}
                title="Operational Metrics"
                action={
                  <IconButton>
                    <TrendingUp />
                  </IconButton>
                }
              />
              <Divider />
              <CardContent>
                <Typography variant="body2" component="div">
                  • Delivery Performance
                  <br />
                  • Setup Time Analysis
                  <br />
                  • Staff Allocation
                  <br />
                  • Equipment Utilization
                </Typography>
              </CardContent>
            </Card>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ReportsPage;