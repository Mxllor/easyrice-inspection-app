import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Card,
  CardMedia,
  Container
} from '@mui/material';
import { styled } from '@mui/material/styles';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { dateFormat } from '../utils/dateFormat';
import { formatNumber, formatPercentage } from '../utils/formatNumber';

// Styled components
const StyledContainer = styled(Container)(({ theme }) => ({
  backgroundColor: '#f5f5f5',
  minHeight: '100vh',
  paddingTop: theme.spacing(3),
  paddingBottom: theme.spacing(3)
}));

const StyledTableCell = styled(TableCell)(() => ({
  fontWeight: 'bold',
  backgroundColor: '#f8f9fa',
  color: '#495057',
  fontSize: '13px'
}));

const InfoCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(1.5, 2),
  marginBottom: theme.spacing(1.5),
  boxShadow: 'none'
}));

const TotalRow = styled(TableRow)(() => ({
  backgroundColor: '#f8f9fa',
  '& td': {
    fontWeight: 'bold'
  }
}));

// Interfaces

interface CompositionItem {
  substandard: {
    key: string;
    name: string;
  },
  value: number
}

interface DefectItem {
  defectRiceType: string;
  value: number;
}
function Inspection() {
    const navigate = useNavigate();
    const { id } = useParams<{id: string}>();
    const [inspectionData, setInspectionData] = useState<any>({});
    const loadInspectionData = async (id: string) => {
      try {
         const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/history/${id}`);
        if (response.status === 200 && response.data) {
            await setInspectionData(response.data);
        } 
      } catch (error) {
          console.log("Error", error);
          navigate('/');
      }
    };
    useEffect(() => {
        if (!id) return;
        loadInspectionData(id);
    },[id])

    const LengthConditionLabel = (substandard: any) => {
        return (
          `${substandard.minLength} - ${substandard.maxLength}`
        );
    }


  return (
    <StyledContainer maxWidth="lg">
      <Typography 
        variant="h4" 
        component="h1" 
        textAlign="center" 
        fontWeight="bold" 
        mb={4}
      >
        Inspection
      </Typography>

      <Box display="flex" gap={3}>
        {/* Image Section */}
        <Box sx={{ flexShrink: 0 }}>
          <Card sx={{ width: 280 }}>
            <CardMedia
              component="div"
              sx={{
                height: 320,
                backgroundColor: '#000',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white'
              }}
            >   
              { inspectionData.imageLink 
              ? 
              <img src={inspectionData.imageLink} alt="Rice Sample" style={{ maxWidth: '100%', maxHeight: '100%' }} /> 
              : 
              <Box textAlign="center">
                <Typography variant="body2">
                  Rice Image
                </Typography>
              </Box>
              }
            </CardMedia>
          </Card>
          
          <Box display="flex" gap={1} justifyContent="center" mt={1.5}>
            <Button variant="outlined" size="small" onClick={() => {navigate("/")}}>
              Back
            </Button>
            <Button variant="contained" size="small" color="success" onClick={() => {navigate(`/inspection/${inspectionData.id}/edit`)}}>
              Edit
            </Button>
          </Box>
        </Box>

        {/* Right Side Content */}
        <Box sx={{ flex: 1 }}>
          {/* Information Section */}
          <Box mb={3}>
            <InfoCard>
              <Box display="flex">
                <Box flex="column" width={1/2}>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Create Date - Time
                    </Typography>
                    <Typography variant="body2" fontWeight="500">
                      { dateFormat(inspectionData.createDate) }
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Standard:
                    </Typography>
                    <Typography variant="body2" fontWeight="500">
                      { inspectionData.standardName }
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Update Date - Time:
                    </Typography>
                    <Typography variant="body2" fontWeight="500">
                      { dateFormat(inspectionData.updateDate) }
                    </Typography>
                  </Box>
                </Box>
                <Box flex="column" width={1/2}>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Inspection ID:
                    </Typography>
                    <Typography variant="body2" fontWeight="500">
                      { inspectionData.id }
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Total Sample:
                    </Typography>
                    <Typography variant="body2" fontWeight="500">
                      { formatNumber(inspectionData.totalSample ?? 0) } Kernal
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </InfoCard>

            <InfoCard>
              <Box display="flex">
                <Box flex="column" width={1/2}>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Note
                    </Typography>
                    <Typography variant="body2" fontWeight="500">
                      { inspectionData.note }
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Date/Time of Sampling
                    </Typography>
                    <Typography variant="body2" fontWeight="500">
                      { dateFormat(inspectionData.samplingDate) }
                    </Typography>
                  </Box>
                </Box>
                <Box flex="column" width={1/2}>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Price
                    </Typography>
                    <Typography variant="body2" fontWeight="500">
                      { formatNumber(inspectionData.price ?? 0) }
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Sampling Point
                    </Typography>
                    <Typography variant="body2" fontWeight="500">
                      {inspectionData.samplingPoint?.length > 0 ? inspectionData.samplingPoint.join(', ') : '-' }
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </InfoCard>
          </Box>

          {/* Composition Section */}
          <Paper sx={{ p: 2, mb: 2, boxShadow: 'none' }}>
            <Typography variant="h6" fontWeight="bold" mb={1.5}>
              Composition
            </Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <StyledTableCell>Name</StyledTableCell>
                    <StyledTableCell align="right">Length</StyledTableCell>
                    <StyledTableCell align="right">Actual</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {inspectionData.standardData?.map((row: CompositionItem, index: number) => (
                    <TableRow key={index}>
                      <TableCell sx={{ fontSize: '13px' }}>
                        {row.substandard.name}
                      </TableCell>
                      <TableCell align="right" sx={{ fontSize: '13px' }}>
                        { LengthConditionLabel(row.substandard) }
                      </TableCell>
                      <TableCell align="right" sx={{ fontSize: '13px' }}>
                        {row.value >= 0 ? formatPercentage(row.value * 100)  : 'N/A'} %
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>

          {/* Defect Rice Section */}
          <Paper sx={{ p: 2 , boxShadow: 'none'}}>
            <Typography variant="h6" fontWeight="bold" mb={1.5}>
              Defect Rice
            </Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <StyledTableCell>Name</StyledTableCell>
                    <StyledTableCell align="right">Actual</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                    {inspectionData.defectRice?.map((row: DefectItem, index: number) => (
                        <TableRow key={index}>
                            <TableCell sx={{ fontSize: '13px' }}>
                            {row.defectRiceType}
                            </TableCell>
                            <TableCell align="right" sx={{ fontSize: '13px' }}>
                            {row.value >= 0 ? formatPercentage(row.value * 100) : 'N/A'} %
                            </TableCell>
                      </TableRow>
                    ))}
                    <TotalRow>
                        <TableCell sx={{ fontSize: '13px' }}>
                            Total
                        </TableCell>
                        <TableCell align="right" sx={{ fontSize: '13px' }}>
                            {formatPercentage(inspectionData.defectRice?.reduce((acc: any, cur: any) => acc + cur.value, 0) * 100) || 'N/A'} %
                        </TableCell>
                    </TotalRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Box>
      </Box>
    </StyledContainer>
    );
}

export default Inspection