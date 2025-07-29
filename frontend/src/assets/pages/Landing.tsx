import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  Typography,
  Pagination,
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import axios from 'axios';
import { dateFormat } from '../utils/dateFormat';
import { useNavigate } from 'react-router-dom';
interface InspectionData {
    data: {
        id: string;
        name: string;
        standardName: string;
        note: string;
        createDate: string;
    }
}

function Landing() {
    const navigate = useNavigate();
    const [data, setData] = useState<InspectionData | any>({});
    const [searchId, setSearchId] = useState('');
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectAll, setSelectAll] = useState(false);
    const itemsPerPage = 10;
    const [queryString, setQueryString] = useState(`?page=${currentPage}&limit=${itemsPerPage}`);
    const [refreshKey, setRefreshKey] = useState(0);
    const [itemSelected, setItemSelected] = useState<string[]>([]);
    
    const selectedCount = itemSelected.length;

    useEffect(() => {
        loadHistory(`?page=${currentPage}&limit=${itemsPerPage}`);
    },[])

    useEffect(() => {
        loadHistory(queryString);
    },[queryString, currentPage])

    const loadHistory = async (query: string) => {
        try {
            const response: any = await axios.get('http://localhost:3000/api/history' + query);
            if (response.status !== 200) {
                alert("Something went wrong");
            }
            response.data.data?.map((item: any) => item.selected = false);
            setData(response.data);
            setRefreshKey((prevKey) => prevKey + 1);
            
        } catch (error) {
            console.error('Error fetching standard data:', error);
        }
    }
    const handleSelectAll = (checked: boolean) => {
        setSelectAll(checked);
        setItemSelected(() => {
            if (checked) {
                return data.data?.map((item: any) => item.id);
            } else {
                return [];
            }
        })
    };

    const handleSelectItem = (id: string, checked: boolean) => {
        setItemSelected((prevItemSelected: any) => {
            if (checked) {
                return [...prevItemSelected, id];
            } else {
                return prevItemSelected.filter((item: any) => item !== id);
            }
        })
    };

    const handleDelete = async () => {
        itemSelected.map(async (id: string) => {
            try {
                const response = await axios.delete(`http://localhost:3000/api/history/${id}`);
                if (response.status !== 200) {
                    alert("Something went wrong");
                }
            } catch (error) {
                console.error('Error deleting standard data:', error);
            }
        })
        setSelectAll(false);
        setItemSelected([]);
        navigate(0)
    };

    const handleClearFilter = () => {
        setSearchId('');
        setFromDate('');
        setToDate('');
        loadHistory(`?page=${currentPage}&limit=${itemsPerPage}`);
    };

    const handleSearch = () => {
        setCurrentPage(1);
        let query: string = '';
        if (searchId) {
            query = `?page=${1}&limit=${itemsPerPage}&id=${searchId}`
            setQueryString(query);
        } else if (fromDate && toDate) {
            query = `?page=${1}&limit=${itemsPerPage}&fromDate=${fromDate}&toDate=${toDate}`
            setQueryString(query);
        } else if (fromDate) {
            query = `?page=${1}&limit=${itemsPerPage}&fromDate=${fromDate}`
            setQueryString(query);
        } else if (toDate) {
            query = `?page=${1}&limit=${itemsPerPage}&toDate=${toDate}`
            setQueryString(query);
        } else {
            query = `?page=${1}&limit=${itemsPerPage}`;
            setQueryString(query);
        }
        loadHistory(query);
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        let query: string = '';
        if (searchId) {
            query = `?page=${page}&limit=${itemsPerPage}&id=${searchId}`
            setQueryString(query);
        } else if (fromDate && toDate) {
            query = `?page=${page}&limit=${itemsPerPage}&fromDate=${fromDate}&toDate=${toDate}`
            setQueryString(query);
        } else if (fromDate) {
            query = `?page=${page}&limit=${itemsPerPage}&fromDate=${fromDate}`
            setQueryString(query);
        } else if (toDate) {
            query = `?page=${page}&limit=${itemsPerPage}&toDate=${toDate}`
            setQueryString(query);
        } else {
            query = `?page=${page}&limit=${itemsPerPage}`;
            setQueryString(query);
        }
        loadHistory(query);
    };

    const handleRowClick = (id: string) => {
        navigate(`/inspection/${id}`);
    };

    return (
        <Box sx={{ p: 3, backgroundColor: '#ffffff', minHeight: '100vh' }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'end', alignItems: 'center', mb: 3 }}>
            <Button
                variant="contained"
                startIcon={<AddIcon />}
                sx={{
                    backgroundColor: '#1F7B44',
                    '&:hover': { backgroundColor: '#45a049' },
                    textTransform: 'none',
                    fontWeight: 'bold'
                }}
                onClick={() => navigate('/create')}
            >
                Create Inspection
            </Button>
        </Box>

        {/* Filters */}
        <Paper sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <TextField
                    fullWidth
                    label="ID"
                    placeholder="Search with ID"
                    value={searchId}
                    onChange={(e) => setSearchId(e.target.value)}
                    size="small"
                    sx={{ minWidth: 200 }}
                />
                
                <TextField
                    fullWidth
                    label="Form Date"
                    placeholder="Please select Form Date"
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                    size="small"
                    type="datetime-local"
                    InputLabelProps={{ shrink: true }}
                    sx={{ minWidth: 220 }}
                />
                
                <TextField
                    fullWidth
                    label="To Date"
                    placeholder="Please select To Date"
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                    size="small"
                    type="datetime-local"
                    InputLabelProps={{ shrink: true }}
                    sx={{ minWidth: 220 }}
                />
            </Box>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, mt: 2 }}>
                <Button
                    variant="text"
                    onClick={handleClearFilter}
                    sx={{ color: '#f44336', textTransform: 'none' }}
                >
                    Clear Filter
                </Button>
                <Button
                    variant="contained"
                    startIcon={<SearchIcon />}
                    onClick={handleSearch}
                    sx={{
                    backgroundColor: '#1F7B44',
                    '&:hover': { backgroundColor: '#45a049' },
                    textTransform: 'none'
                    }}
                >
                    Search
                </Button>
            </Box>
        </Paper>

        {/* Delete Button */}
        {selectedCount > 0 && (
            <Box sx={{ mb: 2 }}>
            <Button
                variant="outlined"
                startIcon={<DeleteIcon />}
                onClick={handleDelete}
                sx={{
                color: '#f44336',
                borderColor: '#f44336',
                '&:hover': {
                    backgroundColor: '#ffebee',
                    borderColor: '#f44336'
                },
                textTransform: 'none'
                }}
            >
                Delete
            </Button>
            <Typography variant="body2" sx={{ ml: 2, display: 'inline', color: '#666' }}>
                Select Items: {selectedCount} Item{selectedCount !== 1 ? 's' : ''}
            </Typography>
            </Box>
        )}

        {/* Table */}
        <TableContainer component={Paper} sx={{ mb: 3 }}>
            <Table key={refreshKey + 1}>
            <TableHead>
                <TableRow sx={{ backgroundColor: '#1F7B44' }}>
                <TableCell padding="checkbox">
                    <Checkbox
                    checked={selectAll}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    sx={{ color: 'white', '&.Mui-checked': { color: 'white' } }}
                    />
                </TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>
                    Create Date - Time
                </TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>
                    Inspection ID
                </TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>
                    Name
                </TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>
                    Standard
                </TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>
                    Note
                </TableCell>
                </TableRow>
            </TableHead>
            <TableBody key={currentPage}>
                {data.data?.map((row: any, _: any) => (
                <TableRow
                    key={row.id}
                    sx={{
                    backgroundColor: 'white',
                    '&:hover': { backgroundColor: '#f5f5f5' }
                    }}
                >
                    <TableCell padding="checkbox">
                        <Checkbox
                            checked={itemSelected?.includes(row.id)}
                            onChange={(e) => {
                                handleSelectItem(row.id, e.target.checked);
                            }}
                            sx={{
                            color: 'default',
                            '&.Mui-checked': { color: '#4caf50' }
                            }}
                        />
                        {row.selected && "true"}
                    </TableCell>
                    <TableCell onClick={() => handleRowClick(row.id)}>{dateFormat(row.createDate)}</TableCell>
                    <TableCell onClick={() => handleRowClick(row.id)}>{row.id}</TableCell>
                    <TableCell onClick={() => handleRowClick(row.id)}>{row.name}</TableCell>
                    <TableCell onClick={() => handleRowClick(row.id)}>{row.standardName}</TableCell>
                    <TableCell onClick={() => handleRowClick(row.id)}>{row.note || '-'}</TableCell>
                </TableRow>
                ))}
            </TableBody>
            </Table>
        </TableContainer>

        {/* Pagination */}
        <Box sx={{ display: 'flex'}} key={refreshKey}>
            <Typography variant="body2" sx={{ color: '#666' }}>
                {((data.limit * data.currentPage) - data.limit) + 1 } - { data.lastPage ? data.totalItems : data.limit * data.currentPage } of {data.totalItems}
            </Typography>
            <Pagination
                count={data.totalPages === 1 ? 1 : data.totalPages}
                page={data.totalPages === 1 ? 1 : currentPage}
                onChange={(_, page) => handlePageChange(page) }
                color="primary"
                sx={{
                    '& .MuiPaginationItem-root': {
                    '&.Mui-selected': {
                        backgroundColor: '#4caf50',
                        '&:hover': { backgroundColor: '#45a049' }
                    }
                    }
                }}
            />
        </Box>
        </Box>
    );
}

export default Landing