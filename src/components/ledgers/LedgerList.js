import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const LedgerList = ({ ledgers, onEditLedger, onDeleteLedger }) => {
  const getTypeConfig = (type) => {
    switch (type) {
      case "income":
        return { color: "success", label: "Income" };
      case "expense":
        return { color: "error", label: "Expense" };
      case "party":
        return { color: "primary", label: "Party" };
      default:
        return { color: "default", label: type };
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Type</TableCell>
            <TableCell>Party</TableCell>
            <TableCell align="right">Amount</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {ledgers.map((ledger) => {
            const typeConfig = getTypeConfig(ledger.type);
            return (
              <TableRow key={ledger._id}>
                <TableCell>{formatDate(ledger.date)}</TableCell>
                <TableCell>{ledger.description}</TableCell>
                <TableCell>
                  <Chip
                    label={typeConfig.label}
                    color={typeConfig.color}
                    size="small"
                  />
                </TableCell>
                <TableCell>{ledger.party?.name || "-"}</TableCell>
                <TableCell
                  align="right"
                  sx={{
                    color:
                      ledger.type === "income"
                        ? "success.main"
                        : ledger.type === "expense"
                        ? "error.main"
                        : "text.primary",
                  }}
                >
                  {formatAmount(ledger.amount)}
                </TableCell>
                <TableCell align="right">
                  <IconButton
                    size="small"
                    onClick={() => onEditLedger(ledger)}
                    color="primary"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => onDeleteLedger(ledger._id)}
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default LedgerList;