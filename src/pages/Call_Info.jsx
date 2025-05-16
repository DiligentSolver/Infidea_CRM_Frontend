import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  MdPerson,
  MdSource,
  MdPhone,
  MdLocationOn,
  MdMessage,
  MdWork,
  MdSchool,
  MdTimer,
  MdAccessTime,
  MdNotes,
  MdShare,
  MdBusinessCenter,
  MdWifiCalling3,
  MdLocationCity,
  MdWatch,
  MdPublic,
  MdOutlineWhatsapp,
  MdError,
  MdRefresh,
  MdComment,
  MdTask
} from "react-icons/md";
import { FaSave } from "react-icons/fa";
import { IoCashOutline } from "react-icons/io5";
import EmployeeServices from "@/services/EmployeeServices";
import { notifySuccess, notifyError } from "@/utils/toast";
import Loader from "../components/sprinkleLoader/Loader";
import { useLocation } from "react-router";
import ProcessSelector from "@/components/common/ProcessSelector";
import { 
  companyOptions as lineupCompanyOptions, 
  callStatusOptions,
  noticePeriodOptions,
  shiftPreferenceOptions, 
  communicationOptions,
  sourceOptions,
  experienceOptions,
  relocationOptions,
  getProcessesByCompany
} from "@/utils/optionsData";

function CallInfo() {
  const location = useLocation();
  const [darkMode, setDarkMode] = useState(false);
  const [phoneError, setPhoneError] = useState("");
  const [sameAsContact, setSameAsContact] = useState(false);
  const contactInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [duplicateInfo, setDuplicateInfo] = useState(null);
  const [checkingDuplicate, setCheckingDuplicate] = useState(false);
  const [formSavedTimestamp, setFormSavedTimestamp] = useState(null);
  
  // New state variables for dropdown data
  const [qualifications, setQualifications] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [localities, setLocalities] = useState([]);
  const [loadingDropdownData, setLoadingDropdownData] = useState({
    qualifications: false,
    states: false,
    cities: false,
    localities: false
  });

  // Add a new state for filtered process options
  const [filteredProcessOptions, setFilteredProcessOptions] = useState([{ value: "", label: "Select Process" }]);

  // Move formData declaration here, before any useEffects that reference it
  const [formData, setFormData] = useState({
    candidateName: "",
    source: "",
    gender: "",
    contactNumber: "",
    whatsappNumber: "",
    sameAsContact: false,
    experience: "",
    qualification: "",
    state: "",
    city: "",
    locality: "",
    salaryExpectations: "",
    levelOfCommunication: "",
    noticePeriod: "",
    shiftPreference: "",
    relocation: "",
    companyProfile: "",
    customCompanyProfile: "",
    callStatus: "",
    callSummary: "",
    callDuration: "",
    jdReferenceCompany: "",
    jdReferenceProcess: "",
    lineupCompany: "",
    customLineupCompany: "",
    lineupProcess: "",
    customLineupProcess: "",
    lineupDate: "",
    interviewDate: "",
    walkinDate: "",
    remarks: ""
  });

  // Prefill contact number if redirected from duplicity check
  useEffect(() => {
    if (location.state && location.state.prefillNumber) {
      setFormData(prev => ({ ...prev, contactNumber: location.state.prefillNumber }));
    }
  }, [location.state]);

  // Load form data from localStorage on component mount
  useEffect(() => {
    const savedForm = localStorage.getItem('callInfoFormData');
    const savedTimestamp = localStorage.getItem('callInfoFormTimestamp');
    
    if (savedForm && savedTimestamp) {
      const parsedTimestamp = parseInt(savedTimestamp, 10);
      const currentTime = new Date().getTime();
      
      // Check if saved data is less than 2 hours old (7200000 ms)
      if (currentTime - parsedTimestamp < 7200000) {
        try {
          setFormData(JSON.parse(savedForm));
          setSameAsContact(JSON.parse(savedForm).sameAsContact || false);
          setFormSavedTimestamp(parsedTimestamp);
        } catch (error) {
          console.error("Error parsing saved form data:", error);
        }
      } else {
        // Clear expired data
        localStorage.removeItem('callInfoFormData');
        localStorage.removeItem('callInfoFormTimestamp');
      }
    }
  }, []);

  // Save form data to localStorage whenever it changes
  useEffect(() => {
    // Don't save if form is empty (initial load)
    if (formData.candidateName || formData.contactNumber) {
      const timestamp = new Date().getTime();
      localStorage.setItem('callInfoFormData', JSON.stringify(formData));
      localStorage.setItem('callInfoFormTimestamp', timestamp.toString());
      setFormSavedTimestamp(timestamp);
    }
  }, [formData]);

  // Check for user's preferred theme and watch for changes
  useEffect(() => {
    // Initial theme setup
    const updateThemeState = () => {
      const isDark = localStorage.theme === 'dark' || 
        (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
      setDarkMode(isDark);
    };

    // Update on mount
    updateThemeState();

    // Listen for theme changes
    const handleStorageChange = (e) => {
      if (e.key === 'theme') {
        updateThemeState();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Additional event listener for theme changes from other components
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class' && 
            mutation.target === document.documentElement) {
          updateThemeState();
        }
      });
    });
    
    observer.observe(document.documentElement, { attributes: true });

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      observer.disconnect();
    };
  }, []);

  // Fetch qualifications, states on component mount
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // Fetch qualifications
        setLoadingDropdownData(prev => ({ ...prev, qualifications: true }));
        const qualificationsRes = await EmployeeServices.getQualifications();
        if (qualificationsRes && Array.isArray(qualificationsRes)) {
          setQualifications(qualificationsRes);
        }
        setLoadingDropdownData(prev => ({ ...prev, qualifications: false }));

        // Fetch states
        setLoadingDropdownData(prev => ({ ...prev, states: true }));
        const statesRes = await EmployeeServices.getStates();
        if (statesRes && Array.isArray(statesRes)) {
          setStates(statesRes);
        }
        setLoadingDropdownData(prev => ({ ...prev, states: false }));
      } catch (error) {
        console.error("Error fetching dropdown data:", error);
        notifyError("Failed to load dropdown data");
        setLoadingDropdownData({
          qualifications: false,
          states: false,
          cities: false,
          localities: false
        });
      }
    };

    fetchInitialData();
  }, []);

  // Fetch cities when state changes
  useEffect(() => {
    const fetchCities = async () => {
      if (!formData.state) {
        setCities([]);
        return;
      }

      try {
        setLoadingDropdownData(prev => ({ ...prev, cities: true }));
        
        // Find the state code by looking up the selected state name in the states array
        const selectedState = states.find(state => state.name === formData.state);
        const stateCode = selectedState ? selectedState.code : formData.state;

        const citiesRes = await EmployeeServices.getCities(stateCode);
        if (citiesRes && Array.isArray(citiesRes)) {
          setCities(citiesRes);
        }
        setLoadingDropdownData(prev => ({ ...prev, cities: false }));
      } catch (error) {
        console.error("Error fetching cities:", error);
        notifyError("Failed to load cities");
        setCities([]);
        setLoadingDropdownData(prev => ({ ...prev, cities: false }));
      }
    };

    fetchCities();
  }, [formData.state, states]);

  // Fetch localities when city is set to Indore
  useEffect(() => {
    const fetchLocalities = async () => {
      if (formData.city.toLowerCase() !== "indore") {
        setLocalities([]);
        return;
      }

      try {
        setLoadingDropdownData(prev => ({ ...prev, localities: true }));
        const localitiesRes = await EmployeeServices.getLocalities();
        if (localitiesRes && Array.isArray(localitiesRes)) {
          setLocalities(localitiesRes);
        }
        setLoadingDropdownData(prev => ({ ...prev, localities: false }));
      } catch (error) {
        console.error("Error fetching localities:", error);
        notifyError("Failed to load localities");
        setLocalities([]);
        setLoadingDropdownData(prev => ({ ...prev, localities: false }));
      }
    };

    fetchLocalities();
  }, [formData.city]);

  // Add useEffect to update process options when company changes
  useEffect(() => {
    setFilteredProcessOptions(getProcessesByCompany(formData.lineupCompany));
    
    // Reset process selection when company changes (unless it's already a valid option)
    if (formData.lineupProcess && !getProcessesByCompany(formData.lineupCompany).some(p => p.value === formData.lineupProcess)) {
      setFormData(prev => ({ ...prev, lineupProcess: "" }));
    }
  }, [formData.lineupCompany]);

  // Add another useEffect to update process options when JD reference company changes
  useEffect(() => {
    setFilteredProcessOptions(getProcessesByCompany(formData.jdReferenceCompany || formData.lineupCompany));
    
    // Reset process selection when company changes (unless it's already a valid option)
    if (formData.jdReferenceProcess && !getProcessesByCompany(formData.jdReferenceCompany).some(p => p.value === formData.jdReferenceProcess)) {
      setFormData(prev => ({ ...prev, jdReferenceProcess: "" }));
    }
  }, [formData.jdReferenceCompany, formData.lineupCompany]);

  const handleChange = (field, value) => {
    if (field === "contactNumber") {
      // Validate phone number length
      if (value.length > 0 && value.length !== 10) {
        setPhoneError(`Phone number must be 10 digits. Current: ${value.length}`);
        setDuplicateInfo(null);
      } else {
        setPhoneError("");
        
        // Check for duplicate when mobile number is exactly 10 digits
        if (value.length === 10) {
          checkDuplicateMobile(value);
        } else {
          setDuplicateInfo(null);
        }
      }
      
      // Update WhatsApp number if checkbox is checked
      if (sameAsContact) {
        setFormData(prev => ({ ...prev, [field]: value, whatsappNumber: value }));
        return;
      }
    }
    
    if (field === "state") {
      // When state changes, reset city and locality
      setFormData(prev => ({ 
        ...prev, 
        [field]: value,
        city: "",
        locality: "" 
      }));
      return;
    }
    
    if (field === "city") {
      // If city changed and not Indore, clear the locality
      if (value.toLowerCase() !== "indore") {
        setFormData(prev => ({ ...prev, [field]: value, locality: "" }));
      } else {
        setFormData(prev => ({ ...prev, [field]: value }));
      }
      return;
    }
    
    // If lineup company is changed
    if (field === "lineupCompany") {
      if (value.toLowerCase() === "others") {
        // When others is selected, set both company and process to others
        setFormData(prev => ({ 
          ...prev, 
          [field]: value,
          lineupProcess: "others"
          // Don't clear custom fields anymore
        }));
      } else {
        // When a specific company is selected
        setFormData(prev => ({ 
          ...prev, 
          [field]: value,
          // Only clear if process is not others
          ...(prev.lineupProcess.toLowerCase() !== "others" ? { customLineupCompany: "", customLineupProcess: "" } : {})
        }));
      }
      return;
    }
    
    // If lineup process is changed
    if (field === "lineupProcess") {
      if (value.toLowerCase() === "others") {
        // When others is selected for process
        setFormData(prev => ({ 
          ...prev, 
          [field]: value
          // Don't clear custom fields anymore
        }));
      } else {
        // When a specific process is selected
        setFormData(prev => ({ 
          ...prev, 
          [field]: value,
          // Only clear if company is not others
          ...(prev.lineupCompany.toLowerCase() !== "others" ? { customLineupProcess: "" } : {})
        }));
      }
      return;
    }
    
    // If company profile is changed
    if (field === "companyProfile") {
      if (value.toLowerCase() === "others") {
        // When others is selected, clear the custom profile field to ensure it's filled in newly
        setFormData(prev => ({ 
          ...prev, 
          [field]: value,
          customCompanyProfile: ""
        }));
      } else {
        // When a specific profile is selected, clear the custom profile field
        setFormData(prev => ({ 
          ...prev, 
          [field]: value,
          customCompanyProfile: ""
        }));
      }
      return;
    }
    
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSameAsContactChange = (e) => {
    const isChecked = e.target.checked;
    setSameAsContact(isChecked);
    
    if (isChecked) {
      // Copy contact number to WhatsApp number
      setFormData(prev => ({ 
        ...prev, 
        sameAsContact: true,
        whatsappNumber: prev.contactNumber
      }));
    } else {
      // Clear the WhatsApp number when unchecked
      setFormData(prev => ({ 
        ...prev, 
        sameAsContact: false,
        whatsappNumber: ""
      }));
    }
  };

  // Reset form function
  const resetForm = () => {
    if (window.confirm("Are you sure you want to reset the form? All data will be lost.")) {
      setFormData({
        candidateName: "",
        source: "",
        gender: "",
        contactNumber: "",
        whatsappNumber: "",
        sameAsContact: false,
        experience: "",
        qualification: "",
        state: "",
        city: "",
        locality: "",
        salaryExpectations: "",
        levelOfCommunication: "",
        noticePeriod: "",
        shiftPreference: "",
        relocation: "",
        companyProfile: "",
        customCompanyProfile: "",
        callStatus: "",
        callSummary: "",
        callDuration: "",
        jdReferenceCompany: "",
        jdReferenceProcess: "",
        lineupCompany: "",
        customLineupCompany: "",
        lineupProcess: "",
        customLineupProcess: "",
        lineupDate: "",
        interviewDate: "",
        walkinDate: "",
        remarks: ""
      });
      setSameAsContact(false);
      setDuplicateInfo(null);
      setPhoneError("");
      
      // Clear localStorage
      localStorage.removeItem('callInfoFormData');
      localStorage.removeItem('callInfoFormTimestamp');
      setFormSavedTimestamp(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Prevent submission if duplicate is detected
    if (duplicateInfo !== null) {
      notifyError("Cannot submit duplicate entry");
      return;
    }
    
    // Check if mandatory fields are required based on callStatus
    const requiresMandatoryFields = ["Lineup", "Walkin at Infidea", "Not Aligned Anywhere"].includes(formData.callStatus);
    
    if (requiresMandatoryFields) {
      // Validate mandatory fields when required
      // Validate lineup fields if status is "lineup"
      if (formData.callStatus === "Lineup" && 
          (!formData.lineupCompany || !formData.lineupProcess || 
           !formData.lineupDate || !formData.interviewDate || !formData.remarks)) {
        notifyError("Please fill in all lineup fields including remarks");
        setLoading(false);
        return;
      }

      // Validate walkin date if status is "walkin"
      if (formData.callStatus === "Walkin at Infidea" && (!formData.walkinDate || !formData.remarks)) {
        notifyError("Please provide a walkin date and remarks");
        setLoading(false);
        return;
      }
      
      // For "Not Aligned Anywhere", ensure call summary is provided
      if (formData.callStatus === "Not Aligned Anywhere" && !formData.callSummary) {
        notifyError("Please provide a call summary");
        setLoading(false);
        return;
      }
    }
    
    setLoading(true);
    try {
      // Prepare candidate data for API
      const candidateData = {
        name: formData.candidateName,
        mobileNo: formData.contactNumber,
        whatsappNo: formData.whatsappNumber,
        source: formData.source,
        gender: formData.gender,
        experience: formData.experience,
        qualification: formData.qualification,
        state: formData.state,
        city: formData.city,
        salaryExpectation: formData.salaryExpectations,
        communication: formData.levelOfCommunication,
        noticePeriod: formData.noticePeriod,
        shift: formData.shiftPreference,
        relocation: formData.relocation,
        companyProfile: formData.companyProfile,
        callStatus: formData.callStatus,
        callDuration: formData.callDuration,
        callSummary: formData.callSummary,
        locality: formData.locality,
        lineupCompany: formData.lineupCompany === "others" ? formData.customLineupCompany : formData.lineupCompany,
        customCompanyProfile: formData.customCompanyProfile,
        customLineupCompany: formData.customLineupCompany,
        lineupProcess: formData.lineupProcess === "others" ? formData.customLineupProcess : formData.lineupProcess,
        customLineupProcess: formData.customLineupProcess,
        lineupDate: formData.lineupDate,
        interviewDate: formData.interviewDate,
        walkinDate: formData.walkinDate,
        remarks: formData.remarks
      };
      // Call API
      const response = await EmployeeServices.createCandidateData(candidateData);
      notifySuccess(response?.message||response?.error);

      // Reset form data after submission
      setFormData({
        candidateName: "",
        source: "",
        gender: "",
        contactNumber: "",
        whatsappNumber: "",
        sameAsContact: false,
        experience: "",
        qualification: "",
        state: "",
        city: "",
        locality: "",
        salaryExpectations: "",
        levelOfCommunication: "",
        noticePeriod: "",
        shiftPreference: "",
        relocation: "",
        companyProfile: "",
        callStatus: "",
        callSummary: "",
        callDuration: "",
        jdReferenceCompany: "",
        jdReferenceProcess: "",
        lineupCompany: "",
        customLineupCompany: "",
        lineupProcess: "",
        customLineupProcess: "",
        lineupDate: "",
        interviewDate: "",
        walkinDate: "",
        remarks: ""
      });
      setSameAsContact(false);
      
      // Clear localStorage
      localStorage.removeItem('callInfoFormData');
      localStorage.removeItem('callInfoFormTimestamp');
      setFormSavedTimestamp(null);
      
      setLoading(false);
      window.location.href = '/call-details';
    } catch (error) {
      notifyError(error?.response?.data?.message|| "Failed to submit candidate data");
      setLoading(false);
    }
  };

  // Add a function to check for duplicate mobile numbers
  const checkDuplicateMobile = async (mobileNumber) => {
    try {
      setCheckingDuplicate(true);
      const response = await EmployeeServices.checkDuplicityOfCandidateData(mobileNumber);
      
      if (response && response.isDuplicate === true) {
        const timeInfo = response.remainingTime ? response.remainingTime : `${response.remainingDays} days`;
        setDuplicateInfo({
          registeredBy: response.registeredBy,
          remainingDays: timeInfo
        });
      } else {
        setDuplicateInfo(null);
      }
    } catch (error) {
      console.error("Error checking mobile number duplicity:", error);
    } finally {
      setCheckingDuplicate(false);
    }
  };

  // Generate call duration options
  const callDurationOptions = Array.from({ length: 30 }, (_, i) => ({
    value: `${i + 1}`, 
    label: `${i + 1} ${i === 0 ? 'Minute' : 'Minutes'}`
  }));
  callDurationOptions.unshift({ value: "", label: "Select Duration" });

  // Create qualification options from API data
  const qualificationOptions = [
    { value: "", label: "Select Qualification" },
    ...(qualifications?.map(qual => ({ 
      value: qual.name || qual, 
      label: qual.name || qual 
    })) || [])
  ];

  // Create state options from API data
  const stateOptions = [
    { value: "", label: "Select State" },
    ...(states?.map(state => ({ 
      value: state.name, 
      label: state.name 
    })) || [])
  ];

  // Create city options from API data
  const cityOptions = [
    { value: "", label: "Select City" },
    ...(cities?.map(city => ({ 
      value: city.name || city, 
      label: city.name || city 
    })) || [])
  ];

  // Create locality options from API data (for Indore only)
  const localityOptions = [
    { value: "", label: "Select Locality" },
    ...(localities?.map(locality => ({ 
      value: locality.name || locality, 
      label: locality.name || locality 
    })) || [])
  ];

  // All fields in a single flat array - rearranged as requested
  const fields = [
    { label: "Candidate's Name", key: "candidateName", icon: <MdPerson />, required: true, inputClass: "w-full" },
    { 
      label: "Mobile No.", 
      key: "contactNumber", 
      icon: <MdPhone />, 
      type: "tel", 
      pattern: "[0-9]{10}", 
      maxLength: 10, 
      required: true, 
      inputClass: "w-full", 
      ref: contactInputRef,
    },
    { 
      label: "WhatsApp No.", 
      key: "whatsappNumber", 
      icon: <MdOutlineWhatsapp />, 
      type: "tel", 
      pattern: "[0-9]{10}", 
      maxLength: 10, 
      required: !sameAsContact, 
      inputClass: "w-full",
      disabled: sameAsContact,
      hasCheckbox: true,
      checkboxLabel: "Same as previous field"
    },
    { label: "Source", key: "source", icon: <MdSource />, type: "select", options: sourceOptions, required: true, inputClass: "w-full" },
    { label: "Gender", key: "gender", icon: <MdPerson />, type: "select", options: [
      { value: "", label: "Select Gender" },
      { value: "Male", label: "Male" },
      { value: "Female", label: "Female" },
      { value: "Others", label: "Others" }
    ], required: true, inputClass: "w-full" },
    { label: "Experience", key: "experience", icon: <MdWork />, type: "select", options: experienceOptions, required: true, inputClass: "w-full" },
    { label: "Qualification", key: "qualification", icon: <MdSchool />, type: "select", options: qualificationOptions, required: true, inputClass: "w-full", loading: loadingDropdownData.qualifications },
    { label: "State", key: "state", icon: <MdPublic />, type: "select", options: stateOptions, required: true, inputClass: "w-full", loading: loadingDropdownData.states },
    { label: "City", key: "city", icon: <MdLocationCity />, type: "select", options: cityOptions, required: true, inputClass: "w-full", loading: loadingDropdownData.cities },
    { label: "Salary Expectation", key: "salaryExpectations", icon: <IoCashOutline />, required: true, inputClass: "w-full" },
    { label: "Communication", key: "levelOfCommunication", icon: <MdMessage />, type: "select", options: communicationOptions, required: true, inputClass: "w-full" },
    { label: "Notice Period", key: "noticePeriod", icon: <MdTimer />, type: "select", options: noticePeriodOptions, required: true, inputClass: "w-full" },
    { label: "Shift Preference", key: "shiftPreference", icon: <MdAccessTime />, type: "select", options: shiftPreferenceOptions, required: true, inputClass: "w-full" },
    { label: "Relocation", key: "relocation", icon: <MdShare />, type: "select", options: relocationOptions, required: true, inputClass: "w-full" },
    { label: "Company/Profile", key: "companyProfile", icon: <MdBusinessCenter />, required: true, inputClass: "w-full" },
    { label: "Call Status", key: "callStatus", icon: <MdWifiCalling3 />, type: "select", options: callStatusOptions, required: true, inputClass: "w-full" },
    { 
      label: "Walkin Date", 
      key: "walkinDate", 
      icon: <MdAccessTime />, 
      type: "date",
      required: formData.callStatus === "Walkin at Infidea",
      inputClass: "w-full",
      hidden: formData.callStatus !== "Walkin at Infidea" 
    },
    { 
      label: "Lineup Company", 
      key: "lineupCompany", 
      icon: <MdBusinessCenter />, 
      type: "select", 
      options: lineupCompanyOptions,
      required: formData.callStatus === "Lineup",
      inputClass: "w-full",
      hidden: formData.callStatus !== "Lineup" 
    },
    { 
      label: "Lineup Process", 
      key: "lineupProcess", 
      icon: <MdTask />, 
      type: "custom", 
      options: filteredProcessOptions,
      required: formData.callStatus === "Lineup",
      inputClass: "w-full",
      hidden: formData.callStatus !== "Lineup",
      render: ({ key, label, options, required, inputClass }) => (
        <div className="flex flex-col relative">
          <ProcessSelector
            name={key}
            value={formData[key] || ""}
            onChange={(e) => handleChange(key, e.target.value)}
            options={options}
            required={required}
            disabled={loading || duplicateInfo !== null}
            className={`px-2.5 py-1.5 h-9 text-sm rounded-md ${darkMode 
              ? 'border-gray-600 bg-gray-700 text-white focus:border-[#e2692c]' 
              : 'border-gray-300 bg-white text-gray-800 focus:border-[#1a5d96]'} border focus:ring-1 ${darkMode ? 'focus:ring-[#e2692c]' : 'focus:ring-[#1a5d96]'} ${inputClass} ${
                (loading || duplicateInfo !== null) ? 'cursor-not-allowed opacity-70' : ''
              }`}
            showInfoButton={true}
            phoneNumber={formData.whatsappNumber}
          />
          
          {/* Custom input for "others" options */}
          {(formData.lineupCompany.toLowerCase() === "others" || formData.lineupProcess.toLowerCase() === "others") && (
            <input
              type="text"
              value={formData.customLineupProcess || ""}
              onChange={(e) => handleChange("customLineupProcess", e.target.value)}
              placeholder="Enter specific process"
              required={required && (formData.lineupCompany.toLowerCase() === "others" || formData.lineupProcess.toLowerCase() === "others")}
              disabled={loading || duplicateInfo !== null}
              className={`mt-2 px-2.5 py-1.5 h-9 text-sm rounded-md ${darkMode 
                ? 'border-gray-600 bg-gray-700 text-white focus:border-[#e2692c]' 
                : 'border-gray-300 bg-white text-gray-800 focus:border-[#1a5d96]'} border focus:ring-1 ${darkMode ? 'focus:ring-[#e2692c]' : 'focus:ring-[#1a5d96]'} w-full ${
                  (loading || duplicateInfo !== null) ? 'bg-gray-100 dark:bg-gray-600 cursor-not-allowed' : ''
                }`}
            />
          )}
        </div>
      )
    },
    { 
      label: "Lineup Date", 
      key: "lineupDate", 
      icon: <MdAccessTime />, 
      type: "date",
      required: formData.callStatus === "Lineup",
      inputClass: "w-full",
      hidden: formData.callStatus !== "Lineup" 
    },
    { 
      label: "Interview Date", 
      key: "interviewDate", 
      icon: <MdAccessTime />, 
      type: "date",
      required: formData.callStatus === "Lineup",
      inputClass: "w-full",
      hidden: formData.callStatus !== "Lineup" 
    },
    { label: "Call Duration", key: "callDuration", icon: <MdWatch />, type: "select", options: callDurationOptions, required: true, inputClass: "w-full" },
    { 
      label: "JD Reference - Company", 
      key: "jdReferenceCompany", 
      icon: <MdBusinessCenter />, 
      type: "select", 
      options: lineupCompanyOptions,
      required: false,
      inputClass: "w-full"
    },
    { 
      label: "JD Reference - Process", 
      key: "jdReferenceProcess", 
      icon: <MdTask />, 
      type: "custom", 
      options: filteredProcessOptions,
      required: false,
      inputClass: "w-full",
      render: ({ key, label, options, required, inputClass }) => (
        <div className="flex flex-col relative">
          <label className={`flex items-center gap-1.5 text-sm font-medium mb-1.5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            <span className="text-base"><MdTask /></span>
            {label}
            {required && <span className="text-red-500">*</span>}
          </label>
          <ProcessSelector
            name={key}
            value={formData[key] || ""}
            onChange={(e) => handleChange(key, e.target.value)}
            options={options}
            required={required}
            disabled={loading || duplicateInfo !== null}
            className={`px-2.5 py-1.5 h-9 text-sm rounded-md ${darkMode 
              ? 'border-gray-600 bg-gray-700 text-white focus:border-[#e2692c]' 
              : 'border-gray-300 bg-white text-gray-800 focus:border-[#1a5d96]'} border focus:ring-1 ${darkMode ? 'focus:ring-[#e2692c]' : 'focus:ring-[#1a5d96]'} ${inputClass} ${
                (loading || duplicateInfo !== null) ? 'cursor-not-allowed opacity-70' : ''
              }`}
            showInfoButton={true}
            phoneNumber={formData.whatsappNumber}
          />
        </div>
      )
    },
    { 
      label: "Remarks", 
      key: "remarks", 
      icon: <MdComment />, 
      type: "textarea",
      required: formData.callStatus === "Lineup" || formData.callStatus === "Walkin at Infidea",
      inputClass: "w-full",
      hidden: formData.callStatus !== "Lineup" && formData.callStatus !== "Walkin at Infidea",
      span: "lg:col-span-5 md:col-span-3"
    },
  ];

  // Show locality field only when city is Indore
  const showLocalityField = formData.city.toLowerCase() === "indore";

  return (
    <div className="px-4 py-3 dark:bg-gray-900 dark:text-gray-100 text-gray-800 overflow-hidden">
      <div className="h-full mx-auto flex flex-col">
        <div className="flex justify-between items-center mb-3">
          <h1 className="text-2xl font-bold dark:text-[#e2692c] text-[#1a5d96]">
            Call Information
          </h1>
          
          <div className="flex items-center gap-3">
            {formSavedTimestamp && (
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Last saved: {new Date(formSavedTimestamp).toLocaleTimeString()}
              </span>
            )}
            
            <button
              type="button"
              onClick={resetForm}
              className={`px-3 py-1.5 ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} rounded-md text-sm flex items-center gap-1.5 transition-colors`}
              title="Reset form"
            >
              <MdRefresh className="text-base" />
              Reset
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-auto">
          {/* All fields in a grid layout */}
          <div className="rounded-lg p-4 shadow-md border dark:bg-gray-800 dark:border-gray-700">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-x-4 gap-y-3">
              {fields.map(({ label, key, type, icon, inputClass, options, required, pattern, maxLength, ref, hasCheckbox, checkboxLabel, disabled, hidden, loading, span, render }) => {
                // Skip rendering if the field should be hidden
                if (hidden) {
                  return null;
                }
                
                // Check if the field is required based on call status
                const requiresMandatoryFields = ["Lineup", "Walkin at Infidea", "Not Aligned Anywhere"].includes(formData.callStatus);
                const isFieldRequired = requiresMandatoryFields ? required : (key === "candidateName" || key === "contactNumber" || key === "callStatus");
                
                // Insert locality field right after city field when city is Indore
                if (key === "city" && showLocalityField) {
                  return (
                    <React.Fragment key={key}>
                      <div className="flex flex-col relative">
                        <label className="flex items-center gap-1.5 text-sm font-medium mb-1.5 dark:text-gray-300 text-gray-700">
                          <span className="text-base">{icon}</span>
                          {label}
                          {isFieldRequired && <span className="text-red-500">*</span>}
                        </label>
                        {type === "select" ? (
                          <select
                            value={formData[key]}
                            onChange={(e) => handleChange(key, e.target.value)}
                            required={isFieldRequired}
                            disabled={loading || duplicateInfo !== null}
                            className={`px-2.5 py-1.5 h-9 text-sm rounded-md ${darkMode 
                              ? 'border-gray-600 bg-gray-700 text-white focus:border-[#e2692c]' 
                              : 'border-gray-300 bg-white text-gray-800 focus:border-[#1a5d96]'} border focus:ring-1 ${darkMode ? 'focus:ring-[#e2692c]' : 'focus:ring-[#1a5d96]'} ${inputClass} ${
                                (loading || duplicateInfo !== null) ? 'cursor-not-allowed opacity-70' : ''
                              }`}
                          >
                            {options && options.map(option => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <input
                            type={type || "text"}
                            value={formData[key]}
                            onChange={(e) => handleChange(key, e.target.value)}
                            placeholder={label}
                            required={isFieldRequired}
                            pattern={pattern}
                            maxLength={maxLength}
                            ref={ref}
                            disabled={disabled || duplicateInfo !== null}
                            className={`px-2.5 py-1.5 h-9 text-sm rounded-md ${darkMode 
                              ? 'border-gray-600 bg-gray-700 text-white focus:border-[#e2692c]' 
                              : 'border-gray-300 bg-white text-gray-800 focus:border-[#1a5d96]'} border focus:ring-1 ${darkMode ? 'focus:ring-[#e2692c]' : 'focus:ring-[#1a5d96]'} ${inputClass} ${
                                disabled || duplicateInfo !== null ? 'bg-gray-100 dark:bg-gray-600 cursor-not-allowed' : ''
                              } ${(key === "contactNumber" && duplicateInfo !== null) ? 'border-red-500 dark:border-red-500' : ''}`}
                          />
                        )}
                      </div>
                      
                      {/* Show validation error for contact number */}
                      {key === "contactNumber" && phoneError && (
                        <div className="text-xs text-red-500 mt-1">{phoneError}</div>
                      )}
                      
                      {/* Locality Field as Dropdown */}
                      <div className="flex flex-col">
                        <label className={`flex items-center gap-1.5 text-sm font-medium mb-1.5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          <span className="text-base"><MdLocationOn /></span>
                          Locality
                          {requiresMandatoryFields && <span className="text-red-500">*</span>}
                        </label>
                        <select
                          value={formData.locality}
                          onChange={(e) => handleChange("locality", e.target.value)}
                          required={requiresMandatoryFields}
                          disabled={loadingDropdownData.localities || duplicateInfo !== null}
                          className={`px-2.5 py-1.5 h-9 text-sm rounded-md ${darkMode 
                            ? 'border-gray-600 bg-gray-700 text-white focus:border-[#e2692c]' 
                            : 'border-gray-300 bg-white text-gray-800 focus:border-[#1a5d96]'} border focus:ring-1 ${darkMode ? 'focus:ring-[#e2692c]' : 'focus:ring-[#1a5d96]'} w-full ${
                              (loadingDropdownData.localities || duplicateInfo !== null) ? 'cursor-wait opacity-70' : ''
                            }`}
                        >
                          {localityOptions.map(option => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </React.Fragment>
                  );
                }
                
                // Skip locality field as it's handled separately
                if (key === "locality") return null;
                
                // Use custom render function if provided
                if (type === "custom" && render) {
                  return (
                    <div key={key} className={span || ""}>
                      {render({ key, label, options, required, inputClass })}
                    </div>
                  );
                }
                
                // Special handling for textarea type (remarks)
                if (type === "textarea") {
                  return (
                    <div key={key} className={`flex flex-col relative ${span || ""}`}>
                      <label className={`flex items-center gap-1.5 text-sm font-medium mb-1.5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        <span className="text-base">{icon}</span>
                        {label}
                        {isFieldRequired && <span className="text-red-500">*</span>}
                      </label>
                      <textarea
                        value={formData[key]}
                        onChange={(e) => handleChange(key, e.target.value)}
                        placeholder={`Enter ${label.toLowerCase()}...`}
                        required={isFieldRequired}
                        disabled={duplicateInfo !== null}
                        className={`px-2.5 py-1.5 h-20 text-sm rounded-md ${darkMode 
                          ? 'border-gray-600 bg-gray-700 text-white focus:border-[#e2692c]' 
                          : 'border-gray-300 bg-white text-gray-800 focus:border-[#1a5d96]'} border focus:ring-1 ${darkMode ? 'focus:ring-[#e2692c]' : 'focus:ring-[#1a5d96]'} resize-none ${
                            duplicateInfo !== null ? 'bg-gray-100 dark:bg-gray-600 cursor-not-allowed' : ''
                          } ${inputClass}`}
                      />
                    </div>
                  );
                }
                
                return (
                  <div key={key} className="flex flex-col relative">
                    <label className={`flex items-center gap-1.5 text-sm font-medium mb-1.5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      <span className="text-base">{icon}</span>
                      {label}
                      {isFieldRequired && <span className="text-red-500">*</span>}
                    </label>
                    
                    {type === "select" ? (
                      <>
                        <select
                          value={formData[key]}
                          onChange={(e) => handleChange(key, e.target.value)}
                          required={isFieldRequired}
                          disabled={loading || duplicateInfo !== null}
                          className={`px-2.5 py-1.5 h-9 text-sm rounded-md ${darkMode 
                            ? 'border-gray-600 bg-gray-700 text-white focus:border-[#e2692c]' 
                            : 'border-gray-300 bg-white text-gray-800 focus:border-[#1a5d96]'} border focus:ring-1 ${darkMode ? 'focus:ring-[#e2692c]' : 'focus:ring-[#1a5d96]'} ${inputClass} ${
                              (loading || duplicateInfo !== null) ? 'cursor-not-allowed opacity-70' : ''
                            }`}
                        >
                          {options && options.map(option => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                        
                        {/* Custom inputs for "others" options */}
                        {key === "lineupCompany" && (formData.lineupCompany.toLowerCase() === "others" || formData.lineupProcess.toLowerCase() === "others") && (
                          <input
                            type="text"
                            value={formData.customLineupCompany || ""}
                            onChange={(e) => handleChange("customLineupCompany", e.target.value)}
                            placeholder="Custom company"
                            required={isFieldRequired && formData.lineupCompany.toLowerCase() === "others"}
                            className={`mt-1.5 px-2.5 py-1.5 h-9 text-sm rounded-md ${darkMode 
                              ? 'border-gray-600 bg-gray-700 text-white focus:border-[#e2692c]' 
                              : 'border-gray-300 bg-white text-gray-800 focus:border-[#1a5d96]'} border focus:ring-1 ${darkMode ? 'focus:ring-[#e2692c]' : 'focus:ring-[#1a5d96]'} w-full`}
                          />
                        )}
                        
                        {key === "lineupProcess" && (formData.lineupCompany.toLowerCase() === "others" || formData.lineupProcess.toLowerCase() === "others") && (
                          <input
                            type="text"
                            value={formData.customLineupProcess || ""}
                            onChange={(e) => handleChange("customLineupProcess", e.target.value)}
                            placeholder="Custom process"
                            required={isFieldRequired && formData.lineupProcess.toLowerCase() === "others"}
                            className={`mt-1.5 px-2.5 py-1.5 h-9 text-sm rounded-md ${darkMode 
                              ? 'border-gray-600 bg-gray-700 text-white focus:border-[#e2692c]' 
                              : 'border-gray-300 bg-white text-gray-800 focus:border-[#1a5d96]'} border focus:ring-1 ${darkMode ? 'focus:ring-[#e2692c]' : 'focus:ring-[#1a5d96]'} w-full`}
                          />
                        )}
                        
                        {key === "companyProfile" && formData.companyProfile === "others" && (
                          <input
                            type="text"
                            value={formData.customCompanyProfile || ""}
                            onChange={(e) => handleChange("customCompanyProfile", e.target.value)}
                            placeholder="Custom profile"
                            required={isFieldRequired && formData.companyProfile === "others"}
                            className={`mt-1.5 px-2.5 py-1.5 h-9 text-sm rounded-md ${darkMode 
                              ? 'border-gray-600 bg-gray-700 text-white focus:border-[#e2692c]' 
                              : 'border-gray-300 bg-white text-gray-800 focus:border-[#1a5d96]'} border focus:ring-1 ${darkMode ? 'focus:ring-[#e2692c]' : 'focus:ring-[#1a5d96]'} w-full`}
                          />
                        )}
                      </>
                    ) : (
                      <>
                        <input
                          type={type || "text"}
                          value={formData[key]}
                          onChange={(e) => handleChange(key, e.target.value)}
                          placeholder={label}
                          required={key === "whatsappNumber" ? (!sameAsContact && isFieldRequired) : isFieldRequired}
                          pattern={pattern}
                          maxLength={maxLength}
                          disabled={disabled || duplicateInfo !== null}
                          className={`px-2.5 py-1.5 h-9 text-sm rounded-md ${darkMode 
                            ? 'border-gray-600 bg-gray-700 text-white focus:border-[#e2692c]' 
                            : 'border-gray-300 bg-white text-gray-800 focus:border-[#1a5d96]'} border focus:ring-1 ${darkMode ? 'focus:ring-[#e2692c]' : 'focus:ring-[#1a5d96]'} ${inputClass} ${
                              disabled || duplicateInfo !== null ? 'bg-gray-100 dark:bg-gray-600 cursor-not-allowed' : ''
                            } ${(key === "contactNumber" && duplicateInfo !== null) ? 'border-red-500 dark:border-red-500' : ''}`}
                        />
                        
                        {/* Show duplicate info for contact number */}
                        {key === "contactNumber" && duplicateInfo !== null && (
                          <div className="text-xs text-red-500 mt-1 flex items-center">
                            <MdError className="mr-1" />
                            <span>
                              Duplicate entry: Registered by {duplicateInfo.registeredBy || 'someone'} 
                              {duplicateInfo.remainingDays !== undefined ? 
                                ` ${duplicateInfo.remainingDays} remaining` : 
                                ''}
                            </span>
                          </div>
                        )}
                        
                        {/* Show validation error for contact number */}
                        {key === "contactNumber" && phoneError && !duplicateInfo && (
                          <div className="text-xs text-red-500 mt-1">{phoneError}</div>
                        )}

                        {/* Show loading indicator while checking for duplicates */}
                        {key === "contactNumber" && checkingDuplicate && (
                          <div className="text-xs text-blue-500 mt-1">Checking number...</div>
                        )}
                        
                        {/* Checkbox for copying contact number to WhatsApp */}
                        {hasCheckbox && (
                          <div className="mt-0.5">
                            <label
                              className="flex items-center gap-1.5 text-xs cursor-pointer"
                              tabIndex={0}
                              onKeyDown={e => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                  e.preventDefault();
                                  handleSameAsContactChange({
                                    target: { checked: !sameAsContact }
                                  });
                                }
                              }}
                            >
                              <input
                                type="checkbox"
                                checked={sameAsContact}
                                onChange={handleSameAsContactChange}
                                className={`rounded h-3.5 w-3.5 ${darkMode ? 'text-[#e2692c] focus:ring-[#e2692c]' : 'text-[#1a5d96] focus:ring-[#1a5d96]'}`}
                              />
                              <span className="text-xs">{checkboxLabel}</span>
                            </label>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Call Summary Field */}
            <div className="mt-3 grid grid-cols-1">
              <label className={`flex items-center gap-1.5 text-sm font-medium mb-1.5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                <span className="text-base"><MdNotes /></span>
                Call Summary
                <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.callSummary}
                onChange={(e) => handleChange("callSummary", e.target.value)}
                placeholder="Enter call summary..."
                required={true}
                disabled={duplicateInfo !== null}
                className={`px-2.5 py-1.5 h-20 w-full text-sm rounded-md ${darkMode 
                  ? 'border-gray-600 bg-gray-700 text-white focus:border-[#e2692c]' 
                  : 'border-gray-300 bg-white text-gray-800 focus:border-[#1a5d96]'} border focus:ring-1 ${darkMode ? 'focus:ring-[#e2692c]' : 'focus:ring-[#1a5d96]'} resize-none ${
                    duplicateInfo !== null ? 'bg-gray-100 dark:bg-gray-600 cursor-not-allowed' : ''
                  }`}
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center mt-3">
            {loading ? (
              <Loader size="30" speed="1.75" />
            ) : (
              <button
                type="submit"
                className={`px-5 py-2.5 ${darkMode ? 'bg-[#e2692c] hover:bg-[#d15a20]' : 'bg-[#1a5d96] hover:bg-[#154a7a]'} text-white rounded-md text-sm shadow-md flex items-center gap-1.5 transition-colors`}
                disabled={loading || duplicateInfo !== null}
              >
                <FaSave className="text-base" />
                Submit
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
export default CallInfo;
