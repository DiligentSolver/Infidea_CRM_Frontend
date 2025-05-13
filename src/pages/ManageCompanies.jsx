import React, { useState, useEffect } from 'react';
import { IoBusinessOutline, IoImageOutline, IoAddCircleOutline, IoTrashOutline } from 'react-icons/io5';
import EmployeeServices from '@/services/EmployeeServices';
import { notifyError, notifySuccess } from '@/utils/toast';

const ManageCompanies = () => {
  // State for the list of companies
  const [companies, setCompanies] = useState([]);
  
  // State for the current company being edited
  const [currentCompany, setCurrentCompany] = useState({
    companyName: '',
    companyLogo: '',
    companyBanner: ''
  });
  
  // State for validation errors
  const [errors, setErrors] = useState({});
  
  // State for loading indicator
  const [isLoading, setIsLoading] = useState(false);
  
  // State for newly added companies
  const [newlyAddedCompanies, setNewlyAddedCompanies] = useState([]);
  
  // State to track selected companies
  const [selectedCompanies, setSelectedCompanies] = useState(new Set());
  
  // Load existing companies on component mount
  useEffect(() => {
    fetchCompanies();
  }, []);
  
  // Function to fetch existing companies
  const fetchCompanies = async () => {
    try {
      setIsLoading(true);
      const response = await EmployeeServices.getCompanies();
      setCompanies(response.companies || []);
    } catch (error) {
      notifyError(error.message || 'Failed to load companies');
      console.error('Error fetching companies:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Validate company form fields
  const validateCompanyFields = () => {
    const newErrors = {};
    
    if (!currentCompany.companyName.trim()) {
      newErrors.companyName = 'Company name is required';
    }
    
    if (!currentCompany.companyLogo.trim()) {
      newErrors.companyLogo = 'Logo URL is required';
    } else if (!isValidUrl(currentCompany.companyLogo)) {
      newErrors.companyLogo = 'Please enter a valid URL';
    }
    
    if (currentCompany.companyBanner.trim() && !isValidUrl(currentCompany.companyBanner)) {
      newErrors.companyBanner = 'Please enter a valid URL';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Validate URL format
  const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch (error) {
      return false;
    }
  };
  
  // Add a company to the local state and track newly added companies
  const handleAddCompany = () => {
    if (validateCompanyFields()) {
      const newCompany = { ...currentCompany };
      setCompanies([...companies, newCompany]);
      setNewlyAddedCompanies([...newlyAddedCompanies, newCompany]); // Track newly added company
      
      // Reset form
      setCurrentCompany({
        companyName: '',
        companyLogo: '',
        companyBanner: ''
      });
      
      notifySuccess('Company added to the list');
    }
  };
  
  // Remove a company from the local state and server
  const handleRemoveCompany = async (index) => {
    const companyToRemove = companies[index];
    
    try {
      await EmployeeServices.deleteCompany(companyToRemove._id); // Assuming the delete function takes the company ID
      const updatedCompanies = [...companies];
      updatedCompanies.splice(index, 1);
      setCompanies(updatedCompanies);
      
      notifySuccess('Company removed from the list');
    } catch (error) {
      notifyError(error.message || 'Failed to remove company');
      console.error('Error removing company:', error);
    }
  };
  
  // Save only newly added companies to the backend
  const handleSaveCompanies = async () => {
    if (newlyAddedCompanies.length === 0) {
      notifyError('Please add at least one company to save');
      return;
    }
    
    try {
      setIsLoading(true);
      await EmployeeServices.addCompany(newlyAddedCompanies); // Save only newly added companies
      notifySuccess('Companies saved successfully');
      
      // Refresh the list and reset newly added companies
      fetchCompanies();
      setNewlyAddedCompanies([]); // Clear the newly added companies after saving
    } catch (error) {
      notifyError(error.message || 'Failed to save companies');
      console.error('Error saving companies:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle form input changes
  const handleInputChange = (field, value) => {
    setCurrentCompany({ ...currentCompany, [field]: value });
    
    // Clear error for this field if it exists
    if (errors[field]) {
      const updatedErrors = { ...errors };
      delete updatedErrors[field];
      setErrors(updatedErrors);
    }
  };
  
  // Toggle selection of a company
  const toggleSelectCompany = (index) => {
    const newSelected = new Set(selectedCompanies);
    if (newSelected.has(index)) {
      newSelected.delete(index);
    } else {
      newSelected.add(index);
    }
    setSelectedCompanies(newSelected);
  };

  // Select all companies
  const toggleSelectAll = () => {
    if (selectedCompanies.size === companies.length) {
      setSelectedCompanies(new Set()); // Deselect all
    } else {
      setSelectedCompanies(new Set(companies.map((_, index) => index))); // Select all
    }
  };

  // Remove selected companies
  const handleRemoveSelectedCompanies = async () => {
    const companiesToRemove = Array.from(selectedCompanies);
    for (const index of companiesToRemove) {
      await handleRemoveCompany(index);
    }
    setSelectedCompanies(new Set()); // Clear selection after deletion
  };
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-8">
        Manage Companies
      </h1>
      
      {/* Add Company Form */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6 mb-6 sm:mb-8">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4 sm:mb-6">
          Add New Company
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Company Name Input */}
          <div className="col-span-1 sm:col-span-2 lg:col-span-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Company Name <span className="text-red-500">*</span>
            </label>
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <IoBusinessOutline className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={currentCompany.companyName}
                onChange={(e) => handleInputChange('companyName', e.target.value)}
                className={`pl-10 w-full rounded-md border ${
                  errors.companyName ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                } bg-white dark:bg-gray-700 py-2 px-3 text-gray-700 dark:text-gray-200 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500`}
                placeholder="Enter company name"
              />
            </div>
            {errors.companyName && (
              <p className="mt-1 text-sm text-red-500">{errors.companyName}</p>
            )}
          </div>
          
          {/* Logo URL Input */}
          <div className="col-span-1 sm:col-span-2 lg:col-span-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Logo URL <span className="text-red-500">*</span>
            </label>
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <IoImageOutline className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={currentCompany.companyLogo}
                onChange={(e) => handleInputChange('companyLogo', e.target.value)}
                className={`pl-10 w-full rounded-md border ${
                  errors.companyLogo ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                } bg-white dark:bg-gray-700 py-2 px-3 text-gray-700 dark:text-gray-200 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500`}
                placeholder="Enter logo URL"
              />
            </div>
            {errors.companyLogo && (
              <p className="mt-1 text-sm text-red-500">{errors.companyLogo}</p>
            )}
          </div>
          
          {/* Banner URL Input */}
          <div className="col-span-1 sm:col-span-2 lg:col-span-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Banner URL
            </label>
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <IoImageOutline className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={currentCompany.companyBanner}
                onChange={(e) => handleInputChange('companyBanner', e.target.value)}
                className={`pl-10 w-full rounded-md border ${
                  errors.companyBanner ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                } bg-white dark:bg-gray-700 py-2 px-3 text-gray-700 dark:text-gray-200 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500`}
                placeholder="Enter banner URL (optional)"
              />
            </div>
            {errors.companyBanner && (
              <p className="mt-1 text-sm text-red-500">{errors.companyBanner}</p>
            )}
          </div>
        </div>
        
        {/* Preview Section */}
        {(currentCompany.companyLogo || currentCompany.companyBanner) && (
          <div className="mt-4 sm:mt-6 p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Preview</h3>
            <div className="flex flex-wrap gap-4">
              {currentCompany.companyLogo && (
                <div className="space-y-2">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Logo</p>
                  <div className="h-16 sm:h-20 w-16 sm:w-20 flex items-center justify-center bg-white border border-gray-200 dark:border-gray-700 rounded-md p-2">
                    <img
                      src={currentCompany.companyLogo}
                      alt="Logo preview"
                      className="h-auto w-auto max-h-[48px] sm:max-h-[64px] max-w-[48px] sm:max-w-[64px] object-contain bg-white"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/80?text=Invalid+URL';
                        e.target.onerror = null;
                      }}
                    />
                  </div>
                </div>
              )}
              
              {currentCompany.companyBanner && (
                <div className="space-y-2">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Banner</p>
                  <div className="h-16 sm:h-20 w-32 sm:w-40 flex items-center justify-center bg-white border border-gray-200 dark:border-gray-700 rounded-md p-2">
                    <img
                      src={currentCompany.companyBanner}
                      alt="Banner preview"
                      className="h-auto w-auto max-h-[48px] sm:max-h-[64px] max-w-[120px] sm:max-w-[140px] object-contain bg-white"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/160x80?text=Invalid+URL';
                        e.target.onerror = null;
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Add Button */}
        <div className="mt-4 sm:mt-6 flex justify-end">
          <button
            type="button"
            onClick={handleAddCompany}
            className="inline-flex items-center px-3 sm:px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200"
          >
            <IoAddCircleOutline className="mr-2 h-5 w-5" />
            Add to List
          </button>
        </div>
      </div>
      
      {/* Companies List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6 mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-4 mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-gray-200">
            Companies List
          </h2>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {companies.length} {companies.length === 1 ? 'company' : 'companies'} added
          </span>
        </div>

        {/* Delete Selected Button */}
        {selectedCompanies.size > 0 && (
          <div className="mt-4 sm:mt-6 flex justify-end">
            <button
              type="button"
              onClick={handleRemoveSelectedCompanies}
              className="inline-flex items-center px-3 sm:px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200 mb-2"
            >
              Delete Selected
            </button>
          </div>
        )}

        {companies.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <IoBusinessOutline className="mx-auto h-12 w-12 mb-3 opacity-50" />
            <p>No companies added yet. Add your first company above.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th scope="col" className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    <input
                      type="checkbox"
                      checked={selectedCompanies.size === companies.length}
                      onChange={toggleSelectAll}
                    />
                  </th>
                  <th scope="col" className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Company
                  </th>
                  <th scope="col" className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Logo
                  </th>
                  <th scope="col" className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Banner
                  </th>
                  <th scope="col" className="px-3 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {companies.map((company, index) => (
                  <tr key={company.id || index} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      <input
                        type="checkbox"
                        checked={selectedCompanies.has(index)}
                        onChange={() => toggleSelectCompany(index)}
                      />
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {company.companyName}
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      <div className="h-8 sm:h-10 w-8 sm:w-10 bg-white rounded-md border border-gray-200 dark:border-gray-600 flex items-center justify-center overflow-hidden">
                        <img
                          src={company.companyLogo}
                          alt={`${company.companyName} logo`}
                          className="h-auto w-auto max-h-[24px] sm:max-h-[32px] max-w-[24px] sm:max-w-[32px] object-contain bg-white"
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/40?text=Logo';
                            e.target.onerror = null;
                          }}
                        />
                      </div>
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {company.companyBanner ? (
                        <div className="h-8 sm:h-10 w-16 sm:w-20 bg-white rounded-md border border-gray-200 dark:border-gray-600 flex items-center justify-center overflow-hidden">
                          <img
                            src={company.companyBanner}
                            alt={`${company.companyName} banner`}
                            className="h-auto w-auto max-h-[24px] sm:max-h-[32px] max-w-[48px] sm:max-w-[64px] object-contain bg-white"
                            onError={(e) => {
                              e.target.src = 'https://via.placeholder.com/80x40?text=Banner';
                              e.target.onerror = null;
                            }}
                          />
                        </div>
                      ) : (
                        <span className="text-gray-400 dark:text-gray-500">Not provided</span>
                      )}
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleRemoveCompany(index)}
                        className="text-red-500 hover:text-red-700 dark:hover:text-red-400 transition-colors"
                      >
                        <IoTrashOutline className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        {/* Save Button */}
        {newlyAddedCompanies.length > 0 && (
          <div className="mt-6 flex justify-end">
            <button
              type="button"
              onClick={handleSaveCompanies}
              disabled={isLoading}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : (
                'Save All Companies'
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageCompanies; 