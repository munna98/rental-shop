import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  TextField,
  MenuItem,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Menu,
} from "@mui/material";
import { useRouter } from "next/router";
import DeliveryStatusChip from "@/components/DeliveryStatusChip";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import RefreshIcon from "@mui/icons-material/Refresh";
import EventIcon from "@mui/icons-material/Event";
import PersonIcon from "@mui/icons-material/Person";
import InventoryIcon from "@mui/icons-material/Inventory";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import { useSnackbar } from "@/hooks/useSnackbar";
import ReturnConfirmationDialog from "@/hooks/useReturnConfirmation";
import StatsCard from "@/components/rentals/StatsCard";

const RentalsPage = () => {
  const router = useRouter();
  const [rentedItems, setRentedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [deliveryStatusFilter, setDeliveryStatusFilter] = useState("all");
  const [stats, setStats] = useState({
    totalRented: 0,
    returningSoon: 0,
    overdue: 0,
    weddingDatePassed: 0,
  });
  const [returnDialog, setReturnDialog] = useState({
    open: false,
    item: null,
  });

  const [deliveryMenu, setDeliveryMenu] = useState({
    anchorEl: null,
    item: null,
  });

  const { showSnackbar, SnackbarComponent } = useSnackbar();

  const handleDeliveryStatusClick = (event, item) => {
    setDeliveryMenu({
      anchorEl: event.currentTarget,
      item: item,
    });
  };

  const handleDeliveryMenuClose = () => {
    setDeliveryMenu({
      anchorEl: null,
      item: null,
    });
  };

  const updateDeliveryStatus = async (newStatus) => {
    try {
      const response = await fetch("/api/invoices/update-delivery-status", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subItemId: deliveryMenu.item.id,
          newDeliveryStatus: newStatus,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update delivery status");
      }

      showSnackbar(`Delivery status updated to ${newStatus}`, "success");
      fetchRentedItems();
    } catch (error) {
      console.error("Error updating delivery status:", error);
      showSnackbar(error.message || "Error updating delivery status", "error");
    }
    handleDeliveryMenuClose();
  };

  const fetchRentedItems = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/invoices");
      const invoices = await response.json();

      // Only include items with status "Rented"
      const items = invoices.flatMap((invoice) =>
        invoice.items
          .filter((item) => item.status === "Rented") // Filter for rented items only
          .map((item) => ({
            id: item.item._id,
            customer: invoice.customer.name,
            item: item.item.name,
            code: item.item.code,
            deliveryDate: new Date(invoice.deliveryDate)
              .toISOString()
              .split("T")[0],
            weddingDate: new Date(invoice.weddingDate)
              .toISOString()
              .split("T")[0],
            status: item.status,
            deliveryStatus: item.deliveryStatus, // Use item's delivery status from invoice
            invoiceId: invoice._id,
            invoiceNumber: invoice.invoiceNumber,
          }))
      );

      const today = new Date();
      const stats = {
        totalRented: items.length,
        returningSoon: items.filter((item) => {
          const deliveryDate = new Date(item.deliveryDate);
          const daysUntilReturn = Math.ceil(
            (deliveryDate - today) / (1000 * 60 * 60 * 24)
          );
          return daysUntilReturn <= 7 && daysUntilReturn > 0;
        }).length,
        overdue: items.filter(
          (item) =>
            new Date(item.deliveryDate) < today &&
            item.deliveryStatus !== "Delivered"
        ).length,
        weddingDatePassed: items.filter(
          (item) => new Date(item.weddingDate) < today
        ).length,
      };

      setRentedItems(items);
      setStats(stats);
    } catch (error) {
      console.error("Error fetching rented items:", error);
      showSnackbar("Error fetching rental data", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRentedItems();
  }, []);

  const handleReturn = async (item) => {
    try {
      // First, fetch the current item data
      const getResponse = await fetch(`/api/sub-items/${item.id}`);
      if (!getResponse.ok) {
        throw new Error("Failed to fetch item details");
      }
      const currentItem = await getResponse.json();

      // Start a batch of status updates
      const updates = [];

      // 1. Update SubItem status
      const subItemUpdate = fetch(`/api/sub-items/${item.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: currentItem.name,
          code: currentItem.code,
          rentRate: currentItem.rentRate,
          description: currentItem.description,
          image: currentItem.image,
          status: "Available",
        }),
      });
      updates.push(subItemUpdate);

      // 2. Update Invoice item status
      const invoiceUpdate = fetch(`/api/invoices/update-item-status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subItemId: item.id,
          newStatus: "Available",
        }),
      });
      updates.push(invoiceUpdate);

      // Wait for both updates to complete
      const results = await Promise.all(updates);

      // Check if both updates were successful
      if (!results.every((response) => response.ok)) {
        throw new Error("Failed to update one or more statuses");
      }

      showSnackbar("Item returned successfully", "success");
      fetchRentedItems();
    } catch (error) {
      console.error("Error returning item:", error);
      showSnackbar(error.message || "Error returning item", "error");
    }
    setReturnDialog({ open: false, item: null });
  };

  const filteredItems = rentedItems.filter((item) => {
    const matchesSearch =
      item.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.item.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.code.toLowerCase().includes(searchTerm.toLowerCase());

    const today = new Date();
    const deliveryDate = new Date(item.deliveryDate);
    const daysUntilReturn = Math.ceil(
      (deliveryDate - today) / (1000 * 60 * 60 * 24)
    );

    // Match return status filter
    let matchesReturnStatus = true;
    if (filterStatus === "returningSoon") {
      matchesReturnStatus = daysUntilReturn <= 7 && daysUntilReturn > 0;
    } else if (filterStatus === "overdue") {
      matchesReturnStatus = deliveryDate < today;
    }

    // Match delivery status filter
    let matchesDeliveryStatus = true;
    if (deliveryStatusFilter !== "all") {
      matchesDeliveryStatus = item.deliveryStatus === deliveryStatusFilter;
    }

    return matchesSearch && matchesReturnStatus && matchesDeliveryStatus;
  });

  return (
    <Box sx={{ padding: 4, maxWidth: 1200, margin: "0 auto" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Typography variant="h4" gutterBottom>
          Current Rentals
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => router.push("/invoicing")}
        >
          Rent Now
        </Button>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={3}>
          <StatsCard
            icon={InventoryIcon}
            value={stats.totalRented}
            label="Total Rented"
            iconColor="primary.main"
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <StatsCard
            icon={EventIcon}
            value={stats.returningSoon}
            label="Returning Soon"
            iconColor="warning.main"
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <StatsCard
            icon={PersonIcon}
            value={stats.overdue}
            label="Late Delivery"
            iconColor="error.main"
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <StatsCard
            icon={EventIcon}
            value={stats.weddingDatePassed}
            label="Wedding Date Passed"
            iconColor="warning.main"
          />
        </Grid>
      </Grid>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search by customer, item, or code"
            InputProps={{
              startAdornment: (
                <SearchIcon sx={{ mr: 1, color: "text.secondary" }} />
              ),
            }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            select
            fullWidth
            variant="outlined"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            InputProps={{
              startAdornment: (
                <FilterListIcon sx={{ mr: 1, color: "text.secondary" }} />
              ),
            }}
          >
            <MenuItem value="all">All Return Status</MenuItem>
            <MenuItem value="returningSoon">Returning Soon</MenuItem>
            <MenuItem value="overdue">Overdue</MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            select
            fullWidth
            variant="outlined"
            value={deliveryStatusFilter}
            onChange={(e) => setDeliveryStatusFilter(e.target.value)}
            InputProps={{
              startAdornment: (
                <FilterListIcon sx={{ mr: 1, color: "text.secondary" }} />
              ),
            }}
          >
            <MenuItem value="all">All Delivery Status</MenuItem>
            <MenuItem value="Pending">Pending</MenuItem>
            <MenuItem value="Delivered">Delivered</MenuItem>
            <MenuItem value="Overdue">Overdue</MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Button
            fullWidth
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={fetchRentedItems}
          >
            Refresh
          </Button>
        </Grid>
      </Grid>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Customer</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Item</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Code</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Delivery Date</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Wedding Date</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Delivery Status</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : filteredItems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  No items found
                </TableCell>
              </TableRow>
            ) : (
              filteredItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.customer}</TableCell>
                  <TableCell>{item.item}</TableCell>
                  <TableCell>{item.code}</TableCell>
                  <TableCell>{item.deliveryDate}</TableCell>
                  <TableCell>{item.weddingDate}</TableCell>
                  <TableCell>
                    <DeliveryStatusChip deliveryStatus={item.deliveryStatus} />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <Button
                        variant="outlined"
                        color="primary"
                        startIcon={<AutorenewIcon />}
                        onClick={() => setReturnDialog({ open: true, item })}
                      >
                        Return
                      </Button>
                      <Button
                        variant="outlined"
                        color="secondary"
                        startIcon={<LocalShippingIcon />}
                        onClick={(e) => handleDeliveryStatusClick(e, item)}
                      >
                        Delivery
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Menu
        anchorEl={deliveryMenu.anchorEl}
        open={Boolean(deliveryMenu.anchorEl)}
        onClose={handleDeliveryMenuClose}
      >
        <MenuItem onClick={() => updateDeliveryStatus("Pending")}>
          Set as Pending
        </MenuItem>
        <MenuItem onClick={() => updateDeliveryStatus("Delivered")}>
          Set as Delivered
        </MenuItem>
        <MenuItem onClick={() => updateDeliveryStatus("Overdue")}>
          Set as Overdue
        </MenuItem>
      </Menu>

      <ReturnConfirmationDialog
        open={returnDialog.open}
        onClose={() => setReturnDialog({ open: false, item: null })}
        onConfirm={() => handleReturn(returnDialog.item)}
        item={returnDialog.item}
      />

      <SnackbarComponent />
    </Box>
  );
};

export default RentalsPage;
