// LabBillSummary.jsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { fetchLabBillSummary } from "../../../features/labBill/LabBillSlice";
import ReactDOMServer from "react-dom/server";
import PrintLabBillSummary from "./PrintLabBillSummary";
import {
  Box,
  Typography,
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Avatar,
  LinearProgress,
  TextField,
  InputAdornment,
  IconButton,
  Tooltip,
  Alert,
} from "@mui/material";
import {
  Search as SearchIcon,
  Print as PrintIcon,
  Refresh as RefreshIcon,
  Female as FemaleIcon,
  Male as MaleIcon,
  CalendarToday as CalendarIcon,
  Assignment as ReportIcon,
} from "@mui/icons-material";
import { format, parseISO, isValid } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { styled } from "@mui/material/styles";

const StyledCard = styled(Card)(() => ({
  background: "rgba(255, 255, 255, 0.9)",
  backdropFilter: "blur(10px)",
  borderRadius: "16px",
  border: "1px solid rgba(0, 150, 137, 0.2)",
  boxShadow: "0 8px 32px rgba(0, 150, 137, 0.15)",
}));

const StyledTableContainer = styled(TableContainer)(() => ({
  background: "transparent",
  borderRadius: "12px",
  overflow: "hidden",
}));

const LabBillSummary = () => {
  const dispatch = useDispatch();
  const { labBillSummary, status, error } = useSelector((state) => state.labBill);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchParams] = useSearchParams();
  const urlStartDate = searchParams.get("startDate");
  const urlEndDate = searchParams.get("endDate");
  const [dateRange, setDateRange] = useState({ startDate: null, endDate: null });

  useEffect(() => {
    let start, end;
    const today = new Date();

    // Validate and parse URL date parameters
    if (urlStartDate && isValid(parseISO(urlStartDate))) {
      start = parseISO(urlStartDate);
      end = urlEndDate && isValid(parseISO(urlEndDate)) ? parseISO(urlEndDate) : start;
    } else {
      // Fallback to current date if parameters are invalid or missing
      start = today;
      end = today;
    }

    setDateRange({ startDate: start, endDate: end });
    dispatch(
      fetchLabBillSummary({
        startDate: format(start, "yyyy-MM-dd"),
        endDate: format(end, "yyyy-MM-dd"),
      })
    );
  }, [dispatch, urlStartDate, urlEndDate]);

  // Extract test names from selectedTests array
  const getTestNames = (bill) => {
        if (bill.selectedTests && Array.isArray(bill.selectedTests)) {
        return bill.selectedTests.map(test => 
            test.testDetails?.testName || test.testDetails?.testCode || "Unknown Test"
        ).join(", ");
        }else if(bill.templateName){
            return bill.templateName
        }
    return "No tests";
  };

  // Filter bills based on search term
  const filteredData = labBillSummary?.filter(
    (bill) =>
      bill.patientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bill.patient_Detail?.patient_Name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bill.patientMRNO?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bill.patient_Detail?.patient_MRNo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      getTestNames(bill)?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString) => {
    try {
      return format(parseISO(dateString), "MMM dd, yyyy hh:mm a");
    } catch {
      return dateString || "Invalid Date";
    }
  };

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return alert("Please allow popups for printing");

    const printContent = ReactDOMServer.renderToString(
      <PrintLabBillSummary
        bills={filteredData}
        dateRange={{
          startDate: dateRange.startDate ? format(dateRange.startDate, "yyyy-MM-dd") : null,
          endDate: dateRange.endDate ? format(dateRange.endDate, "yyyy-MM-dd") : null,
        }}
      />
    );

    printWindow.document.write(`
      <!DOCTYPE html><html><head><title>Lab Bill Summary</title></head>
      <body>${printContent}</body></html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: "bold", color: "#009689" }}>
          Lab Bill Summary
        </Typography>
        <Box sx={{ display: "flex", gap: 2 }}>
          <TextField
            placeholder="Search by name, MR No, or test"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: "#009689" }} />
                </InputAdornment>
              ),
            }}
            sx={{ minWidth: 300 }}
          />
          <Tooltip title="Print Summary">
            <IconButton onClick={handlePrint} sx={{ color: "#009689" }}>
              <PrintIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Refresh Data">
            <IconButton
              onClick={() =>
                dispatch(
                  fetchLabBillSummary({
                    startDate: format(dateRange.startDate, "yyyy-MM-dd"),
                    endDate: format(dateRange.endDate, "yyyy-MM-dd"),
                  })
                )
              }
              sx={{ color: "#009689" }}
            >
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {status === "loading" && <LinearProgress sx={{ mb: 2 }} />}

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {filteredData?.length === 0 && status !== "loading" && (
        <Alert severity="info" sx={{ mb: 2 }}>
          No bills found for the selected date range.
        </Alert>
      )}

      <StyledCard>
        <StyledTableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>MR No.</TableCell>
                <TableCell>Patient</TableCell>
                <TableCell>Tests</TableCell>
                <TableCell>Total</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <AnimatePresence>
                {filteredData?.map((bill) => (
                  <motion.tr
                    key={bill._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <TableCell>{bill.patientMRNO || bill.patient_Detail?.patient_MRNo || "N/A"}</TableCell>
                    <TableCell>
                      <Avatar sx={{ mr: 1, bgcolor: "#009689" }}>
                        {(bill.sex || bill.patient_Detail?.patient_Gender) === "Female" ? <FemaleIcon /> : <MaleIcon />}
                      </Avatar>
                      {bill.patientName || bill.patient_Detail?.patient_Name || "Unknown"}
                    </TableCell>
                    <TableCell>
                      <ReportIcon sx={{ mr: 1, color: "#009689" }} />
                      {getTestNames(bill)}
                    </TableCell>
                    <TableCell>Rs. {(bill.totalAmount || 0).toLocaleString()}</TableCell>
                    <TableCell>
                      <Chip
                        label={bill.paymentStatus || "Unknown"}
                        size="small"
                        color={
                          bill.paymentStatus === "Paid" || bill.paymentStatus === "paid" ? "success" : "warning"
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <CalendarIcon sx={{ mr: 1, color: "#009689" }} />
                      {formatDate(bill.date || bill.createdAt)}
                    </TableCell>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </TableBody>
          </Table>
        </StyledTableContainer>
      </StyledCard>
    </Box>
  );
};

export default LabBillSummary;  