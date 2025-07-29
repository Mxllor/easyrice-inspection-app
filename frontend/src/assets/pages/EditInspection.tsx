import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { dateFormFormat, dateInputFormFormat, getFormCurrentDate } from '../utils/dateFormat';



interface InspectionForm {
  id: string;
  note: string;
  price: number;
  samplingPoint: string[];
  samplingDate: string;
}

const TextField = ({ label, value, onChange, placeholder, type = "text", ...props }: any) => (
  <div className="mb-6">
    <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
      {...props}
    />
  </div>
);

const FormControlLabel = ({ control, label }: any) => (
  <label className="flex items-center cursor-pointer">
    {control}
    <span className="ml-2 text-gray-700 font-medium select-none">{label}</span>
  </label>
);

const Checkbox = ({ checked, onChange, ...props }: any) => (
  <input
    type="checkbox"
    checked={checked}
    onChange={(e) => onChange(e.target.checked)}
    className="h-5 w-5 text-blue-600 border-2 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
    {...props}
  />
);

const Button = ({ variant, onClick, children, sx, ...props }: any) => {
  const baseClasses = "px-6 py-2 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";
  const variantClasses = variant === 'contained' 
    ? "bg-green-600 text-white hover:bg-green-700 focus:ring-green-500" 
    : "border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 focus:ring-gray-500";
  
  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${variantClasses}`}
      {...props}
    >
      {children}
    </button>
  );
};

const Paper = ({ children, sx, ...props }: any) => (
  <div className="bg-white rounded-lg shadow-lg p-8" {...props}>
    {children}
  </div>
);

const Box = ({ children, sx, ...props }: any) => (
  <div className={sx || ""} {...props}>
    {children}
  </div>
);

const Typography = ({ variant, children, sx, ...props }: any) => {
  const variantClasses: any = {
    h4: "text-2xl font-bold",
    h6: "text-lg font-semibold",
    body1: "text-base"
  };
  
  return (
    <div className={`${variantClasses[variant] || ""} ${sx || ""}`} {...props}>
      {children}
    </div>
  );
};

const FormGroup = ({ children, sx, ...props }: any) => (
  <div className={`flex flex-wrap gap-6 ${sx || ""}`} {...props}>
    {children}
  </div>
);

export default function EditInspectionForm() {
  const navigate = useNavigate();
  const { id } = useParams<{id: string}>();
  const [formData, setFormData] = useState<InspectionForm>({
    id: '',
    note: '',
    price: 0,
    samplingPoint: [],
    samplingDate: new Date().toISOString()
  });

  useEffect(() => {
    if (!id) return;
    const loadInspectionData = async (id: string) => {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/history/${id}`);
      if (response.status === 200 && response.data) {
        const data : any = response.data;
        setFormData({
          id: data.id,
          note: data.note,
          price: data.price,
          samplingPoint:data.samplingPoint,
          samplingDate: data.samplingDate
        })
      } else {
        alert("Something went wrong");
      }
    };
    loadInspectionData(id);
  },[id]);

  const handleInputChange = (field: keyof InspectionForm, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSamplingPointChange = (point: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      samplingPoint: checked ? [...prev.samplingPoint, point] : prev.samplingPoint.filter((p: string) => p !== point)
    }));
  };

  const handleCancel = () => {
    setFormData({
        id: '',
        note: '',
        price: 0,
        samplingPoint: [],
        samplingDate: new Date().toISOString()
      })
    navigate(-1);
  };

  const handleSubmit = async() => {
    await updateHistory(formData)
  };

  const updateHistory = async (data: any) => {
    try {
      const response = await axios.put(`${import.meta.env.VITE_API_BASE_URL}/api/history/${data.id}`, {
        note: data.note,
        price: data.price,
        samplingPoint: data.samplingPoint,
        samplingDate: data.samplingDate ?dateFormFormat(data.samplingDate) : getFormCurrentDate()
      });
      if (response.status === 200) {
        setFormData({
          id: '',
          note: '',
          price: 0,
          samplingPoint: [],
          samplingDate: new Date().toISOString()
        })
        navigate(-1);
      } else {
        alert("Something went wrong. Can't update history");
      }
    } catch (error) {
      console.error('Could not update history:', error);
      navigate(-1);
    }
    
  };

  return (
    <Box sx="min-h-screen bg-gray-50 py-8">
      {/* Header */}
      <Box sx="text-center mb-8">
            <Typography variant="h4" sx="text-gray-800">
              Edit Inspection ID : {formData.id}
            </Typography>
          </Box>
      <Box sx="max-w-2xl mx-auto">
          
        <Paper>
          {/* Form Fields */}
          <Box sx="space-y-6">
            <TextField
              label="Note"
              value={formData.note}
              onChange={(value: string) => handleInputChange('note', value)}
              placeholder="Enter note"
            />

            <TextField
              label="Price"
              type="number"
              value={formData.price}
              onChange={(value: string) => handleInputChange('price', value)}
              placeholder="Enter price"
            />

            {/* Sampling Point */}
            <Box>
              <Typography variant="body1" sx="block text-sm font-medium text-gray-700 mb-3">
                Sampling Point
              </Typography>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.samplingPoint.includes('Front End')}
                      onChange={(checked: boolean) => handleSamplingPointChange('Front End', checked)}
                    />
                  }
                  label="Front End"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.samplingPoint.includes('Back End')}
                      onChange={(checked: boolean) => handleSamplingPointChange('Back End', checked)}
                    />
                  }
                  label="Back End"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.samplingPoint.includes('Other')}
                      onChange={(checked: boolean) => handleSamplingPointChange('Other', checked)}
                    />
                  }
                  label="Other"
                />
              </FormGroup>
            </Box>

            {/* Date/Time of Sampling */}
            <Box>
              <Typography variant="body1" sx="block text-sm font-medium text-gray-700 mb-2">
                Date/Time of Sampling
              </Typography>
              <div className="relative">
                <input
                  type="datetime-local"
                  value={dateInputFormFormat(formData.samplingDate)}
                  onChange={(e) => handleInputChange('samplingDate', e.target.value)}
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                />
              </div>
            </Box>
          </Box>

          {/* Action Buttons */}
          <Box sx="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-200">
            <Button variant="outlined" onClick={handleCancel}>
              Cancel
            </Button>
            <Button variant="contained" onClick={handleSubmit}>
              Submit
            </Button>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}