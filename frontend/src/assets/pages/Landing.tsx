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
  CalendarToday as CalendarIcon
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
    const totalPages = Math.ceil(data.data?.length / itemsPerPage);
    const selectedCount = data.data?.filter((item: any)=> item.selected).length;

    useEffect(() => {
        loadHistory('');
        
    },[])

    const loadHistory = async (queryString: string) => {
        try {
            setCurrentPage(1);
            const response: any = await axios.get('http://localhost:3000/api/history?' + `page=${currentPage}` + queryString);
            if (response.status !== 200) {
                alert("Something went wrong");
            }
            setData(response.data);
            console.log(response.data);
            
        } catch (error) {
            console.error('Error fetching standard data:', error);
        }
    }
    const handleSelectAll = (checked: boolean) => {
        setSelectAll(checked);
        setData(data.data?.map((item: any) => ({ ...item, selected: checked })));
    };

    const handleSelectItem = (id: string, checked: boolean) => {
        setData(data.data?.map((item: any) => 
        item.id === id ? { ...item, selected: checked } : item
        ));
    };

    const handleDelete = () => {
        setData(data.data?.filter((item: any) => !item.selected));
        setSelectAll(false);
    };

    const handleClearFilter = () => {
        setSearchId('');
        setFromDate('');
        setToDate('');
    };

    const handleSearch = () => {
        // Search logic would go here
        // console.log('Searching with:', { searchId, fromDate, toDate });
        let queryString: string = '';
        if (searchId) {
            queryString = `&id=${searchId}`
        } else if (fromDate && toDate) {
            queryString = `&fromDate=${fromDate}&toDate=${toDate}`
        } else if (fromDate) {
            queryString = `&fromDate=${fromDate}`
        } else if (toDate) {
            queryString = `&toDate=${toDate}`
        } else {
            queryString = '';
        }
        console.log(queryString);
        
        loadHistory(queryString);
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
            <Table>
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
            <TableBody>
                {data.data?.map((row: any, _: any) => (
                <TableRow
                    key={row.id}
                    sx={{
                    backgroundColor: 'white',
                    '&:hover': { backgroundColor: '#f5f5f5' }
                    }}
                    onClick={() => handleRowClick(row.id)}
                >
                    <TableCell padding="checkbox">
                    <Checkbox
                        checked={row.selected}
                        onChange={(e) => handleSelectItem(row.id, e.target.checked)}
                        sx={{
                        color: 'default',
                        '&.Mui-checked': { color: '#4caf50' }
                        }}
                    />
                    </TableCell>
                    <TableCell>{dateFormat(row.createDate)}</TableCell>
                    <TableCell>{row.id}</TableCell>
                    <TableCell>{row.name}</TableCell>
                    <TableCell>{row.standardName}</TableCell>
                    <TableCell>{row.note || '-'}</TableCell>
                </TableRow>
                ))}
            </TableBody>
            </Table>
        </TableContainer>

        {/* Pagination */}
        <Box sx={{ display: 'flex'}}>
            <Typography variant="body2" sx={{ color: '#666' }}>
                {((itemsPerPage * currentPage) - itemsPerPage) + 1 } - { itemsPerPage * currentPage } of 100
            </Typography>
            <Pagination
                count={totalPages}
                page={currentPage}
                onChange={(_, page) => setCurrentPage(page)}
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