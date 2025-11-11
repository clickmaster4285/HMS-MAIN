// src/pages/radiology/RadiologyPanel.jsx
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  fetchAllRadiologyReports,
  fetchAvailableTemplates,
} from '../../features/Radiology/RadiologySlice';
import {
  Box,
  Button,
  TextField,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  CircularProgress,
  Grid,
  IconButton,
  Collapse,
  Chip,
  Avatar,
  InputAdornment,
  TableFooter,
  TablePagination,
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {
  FiEye,
  FiFilter,
  FiX,
  FiSearch,
  FiPlus,
  FiUser,
  FiCalendar,
  FiChevronLeft,
  FiChevronRight,
} from 'react-icons/fi';
import { format } from 'date-fns';
import doctorList from '../../utils/doctors';
import { motion } from 'framer-motion';
// at the top of the file
import { FlaskConical } from 'lucide-react';
import { Pencil } from 'lucide-react';
const RadiologyPanel = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { reports, templates, isLoading, isError, error } = useSelector(
    (state) => state.radiology
  );

  const { user } = useSelector((state) => state.auth);
  const isRadiology = user?.user_Access === 'Radiology';
  const isAdmin = user?.user_Access === 'Admin';
  const basePath = isRadiology ? '/radiology' : isAdmin ? '/admin' : '/lab';

  // Summary date picker (popover)
  const [showSummaryDatePicker, setShowSummaryDatePicker] = useState(false);
  const [summaryDates, setSummaryDates] = useState({
    startDate: new Date(),
    endDate: null,
  });

  // Pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Filters
  const [filters, setFilters] = useState({
    searchTerm: '',
    gender: '',
    doctor: '',
    fromDate: null,
    toDate: null,
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    dispatch(fetchAllRadiologyReports());
    dispatch(fetchAvailableTemplates());
  }, [dispatch]);

  const handleChangePage = (_e, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (e) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    setPage(0);
  };
  const handleDateFilterChange = (name, value) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
    setPage(0);
  };
  // Helper (put near your component)
  const capFirst = (str) => {
    const s = String(str || '')
      .replace(/\.html$/i, '')
      .replace(/-/g, ' ')
      .trim();
    return s ? s[0].toUpperCase() + s.slice(1) : '';
  };

  const resetFilters = () => {
    setFilters({
      searchTerm: '',
      gender: '',
      doctor: '',
      fromDate: null,
      toDate: null,
    });
    setPage(0);
  };
  const mode = 'edit';
  const formatDateCell = (dateString) => {
    const d = new Date(dateString);
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };
  const formatTemplateName = (name) =>
    Array.isArray(name)
      ? name
          .map((n) => String(n).replace('.html', '').replace(/-/g, ' '))
          .join(', ')
      : typeof name === 'string'
      ? name.replace('.html', '').replace(/-/g, ' ')
      : 'N/A';

  const filteredReports = (reports?.reports || []).filter((report) => {
    const term = filters.searchTerm?.toLowerCase();
    if (term) {
      const match =
        report.patientMRNO?.toLowerCase().includes(term) ||
        report.patientName?.toLowerCase().includes(term) ||
        (report.patientCNIC &&
          String(report.patientCNIC).includes(filters.searchTerm));
      if (!match) return false;
    }
    if (filters.gender && report.sex !== filters.gender) return false;
    if (filters.doctor && report.referBy !== filters.doctor) return false;

    const reportDate = new Date(report.date);
    if (filters.fromDate && reportDate < new Date(filters.fromDate))
      return false;
    if (filters.toDate && reportDate > new Date(filters.toDate)) return false;
    return true;
  });

  const paginatedReports = filteredReports.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Box sx={{ padding: 3, backgroundColor: '#f9fafb', minHeight: '100vh' }}>
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 4,
        }}
      >
        <Typography
          variant="h4"
          component="h2"
          sx={{ color: '#111827', fontWeight: 700, letterSpacing: '-0.5px' }}
        >
          Radiology Reports
        </Typography>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            variant="outlined"
            size="small"
            placeholder="Search reports..."
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <FiSearch color="#6b7280" />
                </InputAdornment>
              ),
              sx: {
                borderRadius: '8px',
                backgroundColor: 'white',
                width: '280px',
              },
            }}
            name="searchTerm"
            value={filters.searchTerm}
            onChange={handleFilterChange}
          />

          <Button
            variant="outlined"
            onClick={() => setShowFilters(!showFilters)}
            startIcon={<FiFilter />}
            sx={{
              borderRadius: '8px',
              borderColor: '#e5e7eb',
              color: '#374151',
              textTransform: 'none',
              px: 2,
              '&:hover': {
                borderColor: '#d1d5db',
                backgroundColor: 'rgba(0,0,0,0.08)',
              },
            }}
          >
            Filters
          </Button>

          <motion.div className="relative">
            <Button
              variant="contained"
              onClick={() => setShowSummaryDatePicker(!showSummaryDatePicker)}
              sx={{
                borderRadius: '8px',
                backgroundColor: 'gray',
                color: 'white',
                textTransform: 'none',
                px: 3,
                mx: 1,
                boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                '&:hover': {
                  backgroundColor: '#004B44',
                  boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                },
              }}
            >
              Summary
            </Button>

            {/* Summary date picker popover */}
            {showSummaryDatePicker && (
              <Box
                sx={{
                  position: 'absolute',
                  zIndex: 1300,
                  right: 0,
                  mt: 1,
                  backgroundColor: 'white',
                  border: '1px solid #e0e0e0',
                  borderRadius: '8px',
                  boxShadow: '0px 5px 15px rgba(0, 0, 0, 0.1)',
                  p: 2,
                }}
              >
                <DatePicker
                  selectsRange
                  startDate={summaryDates.startDate}
                  endDate={summaryDates.endDate}
                  onChange={([start, end]) =>
                    setSummaryDates({ startDate: start, endDate: end })
                  }
                  inline
                />
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    gap: 1,
                    mt: 2,
                  }}
                >
                  <Button
                    onClick={() => setShowSummaryDatePicker(false)}
                    variant="outlined"
                    size="small"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => {
                      const { startDate, endDate } = summaryDates;
                      const fmt = (d) => format(d, 'yyyy-MM-dd');
                      if (startDate && endDate) {
                        navigate(
                          `${basePath}/radiology-summer/${fmt(startDate)}_${fmt(
                            endDate
                          )}`
                        );
                      } else if (startDate) {
                        navigate(
                          `${basePath}/radiology-summer/${fmt(startDate)}`
                        );
                      } else {
                        alert('Please select at least one date.');
                      }
                      setShowSummaryDatePicker(false);
                    }}
                    variant="contained"
                    size="small"
                    sx={{ backgroundColor: '#009689' }}
                  >
                    Download
                  </Button>
                </Box>
              </Box>
            )}

            {/* New Report now routes to a page */}
            {isRadiology || (
              <Button
                variant="contained"
                onClick={() => navigate(`${basePath}/RadiologyForm`)}
                startIcon={<FiPlus />}
                sx={{
                  borderRadius: '8px',
                  backgroundColor: '#009689',
                  color: 'white',
                  textTransform: 'none',
                  px: 3,
                  boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                  '&:hover': {
                    backgroundColor: '#004B44',
                    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                  },
                }}
              >
                New Report
              </Button>
            )}
          </motion.div>
        </Box>
      </Box>

      {/* Filters */}
      <Collapse in={showFilters}>
        <Paper
          sx={{
            p: 3,
            mb: 3,
            borderRadius: '12px',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
            border: '1px solid #e5e7eb',
          }}
        >
          <Grid container spacing={3}>
            <Grid item xs="auto">
              <TextField
                fullWidth
                size="small"
                label="Gender"
                name="gender"
                select
                value={filters.gender}
                onChange={handleFilterChange}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
              >
                <MenuItem value="">All Genders</MenuItem>
                <MenuItem value="Male">Male</MenuItem>
                <MenuItem value="Female">Female</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs="auto">
              <TextField
                fullWidth
                size="small"
                label="Referred By"
                name="doctor"
                select
                value={filters.doctor}
                onChange={handleFilterChange}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
              >
                <MenuItem value="">All Doctors</MenuItem>
                {doctorList.map((d, i) => (
                  <MenuItem key={i} value={d}>
                    {d}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  selected={filters.fromDate}
                  onChange={(val) => handleDateFilterChange('fromDate', val)}
                  customInput={
                    <TextField
                      fullWidth
                      size="small"
                      label="From Date"
                      sx={{
                        '& .MuiOutlinedInput-root': { borderRadius: '8px' },
                      }}
                    />
                  }
                />
              </LocalizationProvider>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  selected={filters.toDate}
                  onChange={(val) => handleDateFilterChange('toDate', val)}
                  customInput={
                    <TextField
                      fullWidth
                      size="small"
                      label="To Date"
                      sx={{
                        '& .MuiOutlinedInput-root': { borderRadius: '8px' },
                      }}
                    />
                  }
                />
              </LocalizationProvider>
            </Grid>

            <Grid
              item
              xs={12}
              sx={{ display: 'flex', justifyContent: 'flex-end' }}
            >
              <Button
                onClick={resetFilters}
                startIcon={<FiX />}
                sx={{
                  color: '#6b7280',
                  textTransform: 'none',
                  '&:hover': { color: '#4f46e5' },
                }}
              >
                Clear Filters
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Collapse>

      {/* Loading / Error */}
      {isLoading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
          <CircularProgress sx={{ color: '#4f46e5' }} />
        </Box>
      )}
      {isError && (
        <Box
          sx={{
            backgroundColor: '#009689',
            color: 'black',
            p: 2,
            borderRadius: '8px',
            mb: 3,
          }}
        >
          <Typography>{error}</Typography>
        </Box>
      )}

      {/* Table */}
      <Paper
        sx={{
          borderRadius: '12px',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
          overflow: 'hidden',
          border: '1px solid #e5e7eb',
        }}
      >
        <TableContainer>
          <Table>
            <TableHead sx={{ backgroundColor: '#f9fafb' }}>
              <TableRow>
                {[
                  'Patient',
                  'MRN',
                  'Details',
                  'Procedure',
                  'Referred By',
                  'Date',
                  'Actions',
                ].map((h) => (
                  <TableCell
                    key={h}
                    sx={{
                      color: '#374151',
                      fontWeight: 600,
                      borderBottom: '1px solid #e5e7eb',
                    }}
                  >
                    {h}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedReports.length ? (
                paginatedReports.map((report) => (
                  <TableRow
                    key={report._id}
                    hover
                    sx={{
                      '&:last-child td': { borderBottom: 0 },
                      '&:hover': { backgroundColor: '#f9fafb' },
                    }}
                  >
                    <TableCell>
                      <Box
                        sx={{ display: 'flex', alignItems: 'center', gap: 2 }}
                      >
                        <Avatar
                          sx={{ backgroundColor: '#009689', color: 'white' }}
                        >
                          {(report.patientName || '')
                            .split(' ')
                            .map((n) => n[0])
                            .join('')
                            .toUpperCase()}
                        </Avatar>
                        <Box>
                          <Typography sx={{ fontWeight: 500 }}>
                            {report.patientName}
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#6b7280' }}>
                            {report.sex || 'N/A'},{' '}
                            {report.age
                              ? new Date(report.age).toLocaleDateString('en-US')
                              : 'N/A'}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>

                    <TableCell>
                      <Chip
                        label={report.patientMRNO}
                        size="small"
                        sx={{
                          backgroundColor: '#009689',
                          color: 'white',
                          fontWeight: 500,
                        }}
                      />
                    </TableCell>

                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Chip
                          icon={<FiUser size={14} />}
                          label={report.sex || 'N/A'}
                          size="small"
                          variant="outlined"
                          sx={{ borderColor: '#e5e7eb' }}
                        />
                      </Box>
                    </TableCell>

                    {/* teemplate name */}

                    <TableCell>
                      {report.studies?.length > 0 ? (
                        <>
                          {report.studies.slice(0, 2).map((s, idx) => (
                            <div
                              key={s._id || idx}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 6,
                              }}
                            >
                              <FlaskConical
                                size={14}
                                className="text-primary-600"
                              />
                              <Typography sx={{ fontWeight: 500 }}>
                                {capFirst(formatTemplateName(s.templateName))}
                              </Typography>
                            </div>
                          ))}

                          {report.studies.length > 2 && (
                            <Typography
                              sx={{
                                color: '#6b7280',
                                fontSize: 13,
                                marginTop: 1,
                              }}
                            >
                              +{report.studies.length - 2} more
                            </Typography>
                          )}
                        </>
                      ) : (
                        <Typography sx={{ color: '#9ca3af' }}>N/A</Typography>
                      )}
                    </TableCell>

                    <TableCell>
                      <Typography>
                        {report.studies?.[1]?.referBy?.trim() || 'N/A'}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Box
                        sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                      >
                        <FiCalendar color="#9ca3af" size={16} />
                        <Typography sx={{ color: '#6b7280' }}>
                          {formatDateCell(report.date)}
                        </Typography>
                      </Box>
                    </TableCell>

                    <TableCell>
                      <div className="flex">
                        <Button
                          onClick={() => {
                            if (isRadiology)
                              navigate(
                                `/radiology/RediologyPatientDetail/${report._id}`
                              );
                            else if (isAdmin)
                              navigate(
                                `/admin/RediologyPatientDetail/${report._id}`
                              );
                            else
                              navigate(
                                `/lab/RediologyPatientDetail/${report._id}`
                              );
                          }}
                          startIcon={<FiEye size={18} />}
                          sx={{
                            color: 'black',
                            textTransform: 'none',
                            '&:hover': {
                              backgroundColor: 'rgba(79,70,229,0.04)',
                              color: '#004B44',
                            },
                          }}
                        >
                          View
                        </Button>

                        {isRadiology || (
                          <Button
                            onClick={() =>
                              navigate(
                                `${basePath}/RadiologyForm?mode=edit&id=${report._id}`
                              )
                            }
                          >
                            <Pencil className="w-4 h-4 text-primary-600" />
                            <span className="ml-2 text-primary-600">Edit</span>
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 1,
                      }}
                    >
                      <FiSearch size={48} color="#d1d5db" />
                      <Typography variant="h6" sx={{ color: '#6b7280' }}>
                        No reports found
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#9ca3af' }}>
                        Try adjusting your search or filter criteria
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>

            <TableFooter>
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25]}
                  colSpan={7}
                  count={filteredReports.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  ActionsComponent={({
                    onPageChange,
                    page,
                    count,
                    rowsPerPage,
                  }) => (
                    <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
                      <IconButton
                        onClick={() => onPageChange(null, page - 1)}
                        disabled={page === 0}
                        aria-label="previous page"
                      >
                        <FiChevronLeft />
                      </IconButton>
                      <IconButton
                        onClick={() => onPageChange(null, page + 1)}
                        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                        aria-label="next page"
                      >
                        <FiChevronRight />
                      </IconButton>
                    </Box>
                  )}
                />
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default RadiologyPanel;
