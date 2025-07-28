
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { dateFormFormat, getCurrentDate } from '../utils/dateFormat';
import { useNavigate } from 'react-router-dom';

interface InspectionFormData {
  name: string;
  standard: string;
  uploadFile: File | null;
  note: string;
  price: number;
  samplingPoint: {
    frontEnd: boolean;
    backEnd: boolean;
    other: boolean;
  };
  dateTimeOfSampling: string;
}

interface StandardData {
    id: string;
    name: string;
    createDate: string;
    standardData: StandardDataItem[];
}

interface StandardDataItem {
  key: string;
  name: string;
  minLength: number;
  maxLength: number;
  shape: string[];
  conditionMin: string;
  conditionMax: string;
}

interface GrainData {
  length: number;
  weight: number;
  shape: string;
  type: string;
}

interface RiceAnalysisData {
  requestID: string;
  imageURL: string;
  grains: GrainData[];
}
function Create() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState<InspectionFormData>({
        name: '',
        standard: '',
        uploadFile: null,
        note: '',
        price: 0,
        samplingPoint: {
        frontEnd: false,
        backEnd: false,
        other: false,
        },
        dateTimeOfSampling: getCurrentDate(),
    });

    const [standardData, setStandardData] = useState<any>({
        data: []
    });
    const [fileError, setFileError] = useState<string>('');
    const [uploadFile, setUploadFile] = useState<File | null>(null);
    const [jsonData, setJsonData] = useState<any>(null);
    const [isProcessing, setIsProcessing] = useState<boolean>(false);
    const samplingPointLabels = {
        frontEnd: "Front End",
        backEnd: "Back End", 
        other: "Other"
    } as const;
    const loadStandardData = async () => {
        try {
        const response = await axios.get('http://localhost:3000/api/standard');
        if (response.status !== 200) {
            alert("Something went wrong");
        }
        setStandardData(response.data);
        } catch (error) {
        console.error('Error fetching standard data:', error);
        }
    }
    useEffect(() => {
        loadStandardData();
    }, [])

    const handleInputChange = (field: keyof InspectionFormData) => (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        setFormData(prev => ({
        ...prev,
        [field]: field === 'price' ? Number(event.target.value) : event.target.value
        }));
    };

    const handleCheckboxChange = (point: keyof InspectionFormData['samplingPoint']) => (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setFormData(prev => ({
        ...prev,
        samplingPoint: {
            ...prev.samplingPoint,
            [point]: event.target.checked
        }
        }));
    };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setFileError('');
    setJsonData(null);
    setIsProcessing(false);

    if (!file) {
      return;
    }
    if (file.type !== 'application/json' && !file.name.endsWith('.json')) {
      setFileError('Please upload a valid JSON file');
      return;
    }
    try {
      setIsProcessing(true);
      
      // Read file as text
      const fileContent = await readFileAsText(file);
      
      // Parse JSON
      const parsedData = JSON.parse(fileContent);

      if (!validateRiceAnalysisData(parsedData)) {
        throw new Error('Invalid data structure');
      }

      setJsonData(parsedData);
      setUploadFile(file);
      console.log('JSON data loaded:', parsedData);
      
    } catch (error) {
      setFileError('Invalid JSON file format or unable to read file');
      console.error('JSON parsing error:', error);
    } finally {
      setIsProcessing(false);
    }
    console.log(isProcessing);
    
  };

  const readFileAsText = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result;
        if (typeof result === 'string') {
          resolve(result);
        } else {
          reject(new Error('Failed to read file as text'));
        }
      };
      reader.onerror = () => reject(new Error('File reading failed'));
      reader.readAsText(file);
    });
  };

    const validateRiceAnalysisData = (data: any): data is RiceAnalysisData => {
    if (!data || typeof data !== 'object') {
      return false;
    }

    // Check required fields
    if (!data.requestID || typeof data.requestID !== 'string') {
      throw new Error('Missing or invalid requestID');
    }

    if (!data.imageURL || typeof data.imageURL !== 'string') {
      throw new Error('Missing or invalid imageURL');
    }

    if (!data.grains || !Array.isArray(data.grains)) {
      throw new Error('Missing or invalid grains array');
    }

    // Validate each grain
    for (let i = 0; i < data.grains.length; i++) {
      const grain = data.grains[i];
      
      if (!grain || typeof grain !== 'object') {
        throw new Error(`Invalid grain data at index ${i}`);
      }

      if (typeof grain.length !== 'number' || grain.length <= 0) {
        throw new Error(`Invalid length at grain ${i}`);
      }

      if (typeof grain.weight !== 'number' || grain.weight <= 0) {
        throw new Error(`Invalid weight at grain ${i}`);
      }

    //   if (!['wholegrain', 'broken'].includes(grain.shape)) {
    //     throw new Error(`Invalid shape at grain ${i}. Must be 'wholegrain' or 'broken'`);
    //   }

    //   if (!['white', 'chalky', 'yellow'].includes(grain.type)) {
    //     throw new Error(`Invalid type at grain ${i}. Must be 'white', 'chalky', or 'yellow'`);
    //   }
    }

    return true;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    console.log("submit");
    event.preventDefault();
    const samplingPoint = Object.entries(formData.samplingPoint).filter(([_, value]) => value === true).map(([key]) => samplingPointLabels[key as keyof typeof samplingPointLabels]);
    const result = await computingJsonData(jsonData, formData.standard);
    const createData = {
        "name": formData.name,
        "standardID": formData.standard,
        "note": formData.note,
        "price": formData.price,
        "samplingPoint":  samplingPoint,
        "samplingDate": dateFormFormat(formData.dateTimeOfSampling),
        ...result
    }
    console.log(createData);
    
    await createHistory(createData);
    // handleCancel();
  };

  const createHistory = async (data: any) => {
    try {
      const response: any = await axios.post('http://localhost:3000/api/history', data);
      if (response.status !== 200) {
        alert("Something went wrong");
      } else {
        handleCancel();
        navigate('/inspection/' + response.data.id);
      }
      
    } catch (error) {
      console.error('Error fetching standard data:', error);
    }
  }
  const handleCancel = () => {
    setFormData({
      name: '',
      standard: '',
      uploadFile: null,
      note: '',
      price: 0,
      samplingPoint: {
        frontEnd: false,
        backEnd: false,
        other: false,
      },
      dateTimeOfSampling: getCurrentDate(),
    });
    setUploadFile(null);
    setFileError('');
  };

  const computingJsonData = async (data: any, standardID: string) => {
    console.log("computingJsonData...");
    
    if (data && standardID) {
        
        const composition: any = [];
        const defectRice: any = [
            {
                defectRiceType: "yellow",
                value: 0
            },
            {
                defectRiceType: "paddy",
                value: 0
            },
            {
                defectRiceType: "damaged",
                value: 0
            },
            {
                defectRiceType: "glutinous",
                value: 0
            },
            {
                defectRiceType: "chalky",
                value: 0
            },
            {
                defectRiceType: "red",
                value: 0
            }
        ];
        const imageLink = data.imageURL;
        const totalSample = data.grains.length;
        const standard = standardData?.data.find((item: any) => item.id === standardID);
        data?.grains.forEach((grain: any) => {
            for (const std of standard.standardData){
                const shapeMatch = std.shape.includes(grain.shape);
                let minConditionMatch = true;
                let maxConditionMatch = true;

                if (std.conditionMin === "GT") {
                    minConditionMatch = grain.length > std.minLength;
                } else if (std.conditionMin === "GE") {
                    minConditionMatch = grain.length >= std.minLength;
                }

                if (std.conditionMax === "LT") {
                    maxConditionMatch = grain.length < std.maxLength;
                } else if (std.conditionMax === "LE") {
                    maxConditionMatch = grain.length <= std.maxLength;
                }
                
                if (shapeMatch && minConditionMatch && maxConditionMatch) {
                    if (composition.find((item: any) => item.standardKey === std.key)) {
                        composition.find((item: any) => item.standardKey === std.key).value += 1;
                    } else {
                        composition.push({ standardKey: std.key, value: 0 });
                    }
                }
            }
            if (grain.type !== "white") {
                if (grain.type === "damaged" || grain.type === "damage") {
                    defectRice.find((item: any) => item.defectRiceType === "damaged").value += 1;
                } else {
                    if (defectRice.find((item: any) => item.defectRiceType === grain.type)) {
                        defectRice.find((item: any) => item.defectRiceType === grain.type).value += 1;
                    }
                }
            }

        })
        composition.map((item: any) => (item.value = (item.value / totalSample)));
        defectRice.map((item: any) => (item.value = (item.value / totalSample)));
        return {
            imageLink: imageLink,
            totalSample: totalSample,
            composition: composition,
            defectRice: defectRice
        }
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white">
      <div className="bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Create Inspection
        </h1>
        <form onSubmit={handleSubmit} >
        <div className="space-y-6">
            {/* Name Field */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                Name<span className="text-red-500">*</span>
                </label>
                <input
                type="text"
                placeholder="Inspection name"
                value={formData.name}
                onChange={handleInputChange('name')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                />
            </div>

            {/* Standard Field */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                Standard<span className="text-red-500">*</span>
                </label>
                <div className="relative">
                <select
                    value={formData.standard}
                    onChange={handleInputChange('standard')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                    required
                >
                    <option value="" disabled>
                    Please Select Standard
                    </option>
                    {standardData?.data.map((standard: StandardData) => (
                    <option key={standard.id} value={standard.id}>
                        {standard.name}
                    </option>
                    ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
                </div>
            </div>

            {/* Upload File */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload File
                </label>
                <div className="relative">
                <input
                    type="file"
                    accept=".json,application/json"
                    onChange={handleFileUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    disabled={isProcessing}
                />
                
                <div className={`w-full px-3 py-2 border border-gray-300 rounded-md cursor-pointer transition-colors ${
                    isProcessing 
                    ? 'bg-gray-200 text-gray-400' 
                    : uploadFile 
                        ? 'bg-green-50 text-green-700 border-green-300'
                        : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                    }`}>
                    {isProcessing 
                    ? 'Processing...' 
                    : uploadFile
                        ? `✓ ${uploadFile.name}` 
                        : 'raw1.json'
                    }
                </div>
                </div>
                {fileError && (
                <div className="mt-2 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
                    {fileError}
                </div>
                )}
            </div>

            {/* Note Field */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                Note
                </label>
                <textarea
                placeholder="Note"
                value={formData.note}
                onChange={handleInputChange('note')}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
                />
            </div>

            {/* Price Field */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                Price
                </label>
                <input
                type="number"
                value={formData.price}
                onChange={handleInputChange('price')}
                min={0}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
            </div>

            {/* Sampling Point */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                Sampling Point
                </label>
                <div className="flex flex-wrap gap-6">
                <label className="flex items-center">
                    <input
                    type="checkbox"
                    checked={formData.samplingPoint.frontEnd}
                    onChange={handleCheckboxChange('frontEnd')}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Front End</span>
                </label>
                <label className="flex items-center">
                    <input
                    type="checkbox"
                    checked={formData.samplingPoint.backEnd}
                    onChange={handleCheckboxChange('backEnd')}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Back End</span>
                </label>
                <label className="flex items-center">
                    <input
                    type="checkbox"
                    checked={formData.samplingPoint.other}
                    onChange={handleCheckboxChange('other')}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Other</span>
                </label>
                </div>
            </div>

            {/* Date/Time of Sampling */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                Date/Time of Sampling
                </label>
                <input
                type="datetime-local"
                value={formData.dateTimeOfSampling}
                onChange={handleInputChange('dateTimeOfSampling')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 justify-end pt-6">
                <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-colors"
                >
                Cancel
                </button>
                <button
                type="submit"
                // onClick={handleSubmit}
                className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                >
                Submit
                </button>
            </div>
        </div>
        </form>
      </div>
    </div>
  );
}

export default Create