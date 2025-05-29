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
  MdTask,
  MdClose,
  MdPeople
} from "react-icons/md";
import { FaSave } from "react-icons/fa";
import { IoCashOutline } from "react-icons/io5";
import EmployeeServices from "@/services/EmployeeServices";
import { notifySuccess, notifyError } from "@/utils/toast";
import Loader from "../components/sprinkleLoader/Loader";
import { useLocation, useNavigate } from "react-router";
import CustomSelect from "@/components/common/CustomSelect";
import { 
  companyOptions as lineupCompanyOptions, 
  callStatusOptions,
  noticePeriodOptions,
  shiftPreferenceOptions, 
  communicationOptions,
  sourceOptions,
  experienceOptions,
  relocationOptions,
  getProcessesByCompany,
  workModeOptions,
  genderOptions,
  callDurationOptions,
  passingYearOptions
} from "@/utils/optionsData";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";


function CallInfo() {
  const location = useLocation();
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const [phoneError, setPhoneError] = useState("");
  const [sameAsContact, setSameAsContact] = useState(false);
  const contactInputRef = useRef(null);
  const callSummaryRef = useRef(null);
  const candidateNameRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [duplicateInfo, setDuplicateInfo] = useState(null);
  const [checkingDuplicate, setCheckingDuplicate] = useState(false);
  const [formSavedTimestamp, setFormSavedTimestamp] = useState(null);
  
  // New state variables for dropdown data
  const [qualifications, setQualifications] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [localities, setLocalities] = useState([]);
  const [jobProfiles, setJobProfiles] = useState([]);
  const [loadingDropdownData, setLoadingDropdownData] = useState({
    qualifications: false,
    states: false,
    cities: false,
    localities: false,
    jobProfiles: false
  });

  // Add a new state for filtered process options
  const [filteredProcessOptions, setFilteredProcessOptions] = useState([{ value: "", label: "" }]);

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
    passingYear: "",
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
    lineupRemarks: "",
    walkinRemarks: "",
    workMode: ""
  });

  // Add this after your formData state initialization
  const [minDate] = useState(new Date());

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
        
        // Fetch job profiles
        setLoadingDropdownData(prev => ({ ...prev, jobProfiles: true }));
        const jobProfilesRes = await EmployeeServices.getJobProfiles();
        if (jobProfilesRes && Array.isArray(jobProfilesRes)) {
          setJobProfiles(jobProfilesRes);
        }
        setLoadingDropdownData(prev => ({ ...prev, jobProfiles: false }));
      } catch (error) {
        console.error("Error fetching dropdown data:", error);
        notifyError("Failed to load dropdown data");
        setLoadingDropdownData({
          qualifications: false,
          states: false,
          cities: false,
          localities: false,
          jobProfiles: false
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

  // Add keyboard shortcut listener for Ctrl+"
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Check for Ctrl + Quote (keyCode 222)
      if (e.ctrlKey && (e.key === '"' || e.key === "'" || e.keyCode === 222 || e.which === 222)) {
        e.preventDefault();
        if (callSummaryRef.current) {
          callSummaryRef.current.focus();
          // Optional: scroll into view if needed
          callSummaryRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
      // Add new shortcut for Ctrl + :
      if (e.ctrlKey && (e.key === ':' || e.keyCode === 186)) {
        e.preventDefault();
        if (candidateNameRef.current) {
          candidateNameRef.current.focus();
          // Optional: scroll into view if needed
          candidateNameRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    };

    // Add the event listener
    document.addEventListener('keydown', handleKeyDown);

    // Clean up the event listener
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

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
        passingYear: "",
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
        lineupRemarks: "",
        walkinRemarks: "",
        workMode: ""
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
    
    // Check if mandatory fields are required based on callStatus
    const requiresMandatoryFields = ["Lineup", "Walkin at Infidea"].includes(formData.callStatus);
    
    if (requiresMandatoryFields) {
      // Validate mandatory fields when required
      // Validate lineup fields if status is "lineup"
      if (formData.callStatus === "Lineup" && 
          (!formData.lineupCompany || !formData.lineupProcess || 
           !formData.lineupDate || !formData.interviewDate || !formData.lineupRemarks)) {
        notifyError("Please fill in all lineup fields including remarks");
        setLoading(false);
        return;
      }

      // Validate walkin date if status is "walkin"
      if (formData.callStatus === "Walkin at Infidea" && (!formData.walkinDate || !formData.walkinRemarks)) {
        notifyError("Please provide a walkin date and remarks");
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
        passingYear: formData.passingYear,
        state: formData.state,
        city: formData.city,
        salaryExpectation: formData.salaryExpectations,
        communication: formData.levelOfCommunication,
        noticePeriod: formData.noticePeriod,
        shift: formData.shiftPreference,
        relocation: formData.relocation,
        companyProfile: formData.companyProfile === "others" ? formData.customCompanyProfile : formData.companyProfile,
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
        lineupRemarks: formData.lineupRemarks,
        walkinRemarks: formData.walkinRemarks,
        workMode: formData.workMode
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
        passingYear: "",
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
        lineupRemarks: "",
        walkinRemarks: "",
        workMode: ""
      });
      setSameAsContact(false);
      
      // Clear localStorage
      localStorage.removeItem('callInfoFormData');
      localStorage.removeItem('callInfoFormTimestamp');
      setFormSavedTimestamp(null);
      
      setLoading(false);
      navigate('/call-details');
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



  // Create qualification options from API data
  const qualificationOptions = [
    { value: "", label: "" },
    ...(qualifications?.map(qual => ({ 
      value: qual.name || qual, 
      label: qual.name || qual 
    })) || [])
  ];

  // Create state options from API data
  const stateOptions = [
    { value: "", label: "" },
    ...(states?.map(state => ({ 
      value: state.name, 
      label: state.name 
    })) || [])
  ];

  // Create city options from API data
  const cityOptions = [
    { value: "", label: "" },
    ...(cities?.map(city => ({ 
      value: city.name || city, 
      label: city.name || city 
    })) || [])
  ];

  // Create locality options from API data (for Indore only)
  const localityOptions = [
    { value: "", label: "" },
    ...(localities?.map(locality => ({ 
      value: locality.name || locality, 
      label: locality.name || locality 
    })) || [])
  ];

  // Create job profile options from API data
  const jobProfileOptions = useMemo(() => [
    { value: "", label: "" },
    ...(jobProfiles?.map(profile => ({ 
      value: profile.name || profile, 
      label: profile.name || profile 
    })) || []),
    { value: "others", label: "Others" }
  ], [jobProfiles]);

  // All fields in a single flat array - rearranged as requested
  const fields = [
    { label: "Candidate's Name", key: "candidateName", icon: <MdPerson />, required: true, inputClass: "w-full" },
    { 
      label: "Contact Number", 
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
      label: "WhatsApp Number", 
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
    { label: "Sourced", key: "source", icon: <MdSource />, type: "select", options: sourceOptions, required: true, inputClass: "w-full" },
    { label: "Gender", key: "gender", icon: <MdPerson />, type: "select", options: genderOptions, required: true, inputClass: "w-full" },
    { label: "Experience", key: "experience", icon: <MdWork />, type: "select", options: experienceOptions, required: ["Lineup", "Walkin at Infidea"].includes(formData.callStatus), inputClass: "w-full" },
    { label: "Qualification", key: "qualification", icon: <MdSchool />, type: "select", options: qualificationOptions, required: ["Lineup", "Walkin at Infidea"].includes(formData.callStatus), inputClass: "w-full", loading: loadingDropdownData.qualifications },
    { 
      label: "Passing Year", 
      key: "passingYear", 
      icon: <MdSchool />, 
      type: "select",
        options: passingYearOptions,
      required: ["Lineup", "Walkin at Infidea"].includes(formData.callStatus),
      inputClass: "w-full"
    },
    { label: "State", key: "state", icon: <MdPublic />, type: "select", options: stateOptions, required: ["Lineup", "Walkin at Infidea"].includes(formData.callStatus), inputClass: "w-full", loading: loadingDropdownData.states },
    { label: "City", key: "city", icon: <MdLocationCity />, type: "select", options: cityOptions, required: true, inputClass: "w-full", loading: loadingDropdownData.cities },
    { label: "Salary Expectation", key: "salaryExpectations", icon: <IoCashOutline />, required: true, inputClass: "w-full" },
    { label: "Notice Period", key: "noticePeriod", icon: <MdTimer />, type: "select", options: noticePeriodOptions, required: true, inputClass: "w-full" },
    { label: "Shift Preference", key: "shiftPreference", icon: <MdAccessTime />, type: "select", options: shiftPreferenceOptions, required: true, inputClass: "w-full" },
    { label: "Relocation", key: "relocation", icon: <MdShare />, type: "select", options: relocationOptions, required: true, inputClass: "w-full" },
    { label: "Work Mode", key: "workMode", icon: <MdBusinessCenter />, type: "select", options: workModeOptions, required: true, inputClass: "w-full" },
    { label: "Job Profile", key: "companyProfile", icon: <MdBusinessCenter />, type: "select", options: jobProfileOptions, required: true, inputClass: "w-full", loading: loadingDropdownData.jobProfiles },
    { label: "Call Status", key: "callStatus", icon: <MdWifiCalling3 />, type: "select", options: callStatusOptions, required: true, inputClass: "w-full" },
    { 
      label: "Walkin Date", 
      key: "walkinDate", 
      icon: <MdAccessTime />, 
      type: "custom",
      required: formData.callStatus === "Walkin at Infidea",
      inputClass: "w-full",
      hidden: formData.callStatus !== "Walkin at Infidea",
      render: ({ key, label, icon, required, inputClass }) => (
        <div className="flex flex-col relative">
          <label className={`flex items-center gap-1.5 text-sm font-medium mb-1.5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            <span className="text-base">{icon}</span>
            {label}
            {required && <span className="text-red-500">*</span>}
          </label>
          <DatePicker
            selected={formData[key] ? new Date(formData[key]) : null}
            onChange={(date) => handleChange(key, date ? date.toISOString() : "")}
            minDate={minDate}
            dateFormat="dd/MM/yyyy"
            placeholderText="Select date"
            required={required}
            className={`px-2.5 py-1.5 h-9 text-sm rounded-md ${darkMode 
              ? 'border-gray-600 bg-gray-700 text-white focus:border-[#e2692c]' 
              : 'border-gray-300 bg-white text-gray-800 focus:border-[#1a5d96]'} border focus:ring-1 ${darkMode ? 'focus:ring-[#e2692c]' : 'focus:ring-[#1a5d96]'} ${inputClass}`}
          />
        </div>
      )
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
      render: ({ key, label, icon, options, required, inputClass }) => (
        <div className="flex flex-col relative">
          <label className={`flex items-center gap-1.5 text-sm font-medium mb-1.5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            <span className="text-base">{icon}</span>
            {label}
            {required && <span className="text-red-500">*</span>}
          </label>
          <div className="flex gap-2">
            <div className="flex-1">
              <CustomSelect
                label={label}
                icon={icon}
                value={formData[key]}
                onChange={(value) => handleChange(key, value)}
                options={options}
                isDisabled={loading}
                isRequired={required}
                darkMode={darkMode}
                loading={loading}
                customInput={key === "companyProfile" || key === "lineupCompany" || key === "lineupProcess"}
                customValue={
                  key === "companyProfile" ? formData.customCompanyProfile :
                  key === "lineupCompany" ? formData.customLineupCompany :
                  key === "lineupProcess" ? formData.customLineupProcess : ""
                }
                onCustomChange={(value) => {
                  if (key === "companyProfile") handleChange("customCompanyProfile", value);
                  else if (key === "lineupCompany") handleChange("customLineupCompany", value);
                  else if (key === "lineupProcess") handleChange("customLineupProcess", value);
                }}
                customPlaceholder={
                  key === "companyProfile" ? "Custom profile" :
                  key === "lineupCompany" ? "Custom company" :
                  key === "lineupProcess" ? "Custom process" : ""
                }
                hasWhatsAppButton={key === "lineupProcess" || key === "jdReferenceProcess"}
                whatsAppNumber={formData.whatsappNumber}
                processDetails={options?.find(opt => opt.value === formData[key])?.label || ''}
              />
            </div>
            {formData.whatsappNumber && (
              <button
                type="button"
                onClick={() => window.open(`https://wa.me/91${formData.whatsappNumber}?text=Process%20Details:%20${encodeURIComponent(options?.find(opt => opt.value === formData[key])?.label || '')}`)}
                className={`px-3 rounded-md ${darkMode ? 'bg-[#e2692c] hover:bg-[#d15a20]' : 'bg-[#1a5d96] hover:bg-[#154a7a]'} text-white`}
                title="Send process details on WhatsApp"
              >
                <MdOutlineWhatsapp className="text-xl" />
              </button>
            )}
          </div>
          
          {/* Custom input for "others" options */}
          {(formData.lineupCompany.toLowerCase() === "others" || formData.lineupProcess.toLowerCase() === "others") && (
            <input
              type="text"
              value={formData.customLineupProcess || ""}
              onChange={(e) => handleChange("customLineupProcess", e.target.value)}
              placeholder="Enter specific process"
              required={required && (formData.lineupCompany.toLowerCase() === "others" || formData.lineupProcess.toLowerCase() === "others")}
              disabled={loading}
              className={`mt-2 px-2.5 py-1.5 h-9 text-sm rounded-md ${darkMode 
                ? 'border-gray-600 bg-gray-700 text-white focus:border-[#e2692c]' 
                : 'border-gray-300 bg-white text-gray-800 focus:border-[#1a5d96]'} border focus:ring-1 ${darkMode ? 'focus:ring-[#e2692c]' : 'focus:ring-[#1a5d96]'} w-full ${
                  loading ? 'bg-gray-100 dark:bg-gray-600 cursor-not-allowed' : ''
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
      type: "custom",
      required: formData.callStatus === "Lineup",
      inputClass: "w-full",
      hidden: formData.callStatus !== "Lineup",
      render: ({ key, label, icon, required, inputClass }) => (
        <div className="flex flex-col relative">
          <label className={`flex items-center gap-1.5 text-sm font-medium mb-1.5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            <span className="text-base">{icon}</span>
            {label}
            {required && <span className="text-red-500">*</span>}
          </label>
          <DatePicker
            selected={formData[key] ? new Date(formData[key]) : null}
            onChange={(date) => handleChange(key, date ? date.toISOString() : "")}
            minDate={minDate}
            dateFormat="dd/MM/yyyy"
            placeholderText="Select date"
            required={required}
            className={`px-2.5 py-1.5 h-9 text-sm rounded-md ${darkMode 
              ? 'border-gray-600 bg-gray-700 text-white focus:border-[#e2692c]' 
              : 'border-gray-300 bg-white text-gray-800 focus:border-[#1a5d96]'} border focus:ring-1 ${darkMode ? 'focus:ring-[#e2692c]' : 'focus:ring-[#1a5d96]'} ${inputClass}`}
          />
        </div>
      )
    },
    { 
      label: "Interview Date", 
      key: "interviewDate", 
      icon: <MdAccessTime />, 
      type: "custom",
      required: formData.callStatus === "Lineup",
      inputClass: "w-full",
      hidden: formData.callStatus !== "Lineup",
      render: ({ key, label, icon, required, inputClass }) => (
        <div className="flex flex-col relative">
          <label className={`flex items-center gap-1.5 text-sm font-medium mb-1.5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            <span className="text-base">{icon}</span>
            {label}
            {required && <span className="text-red-500">*</span>}
          </label>
          <DatePicker
            selected={formData[key] ? new Date(formData[key]) : null}
            onChange={(date) => handleChange(key, date ? date.toISOString() : "")}
            minDate={minDate}
            dateFormat="dd/MM/yyyy"
            placeholderText="Select date"
            required={required}
            className={`px-2.5 py-1.5 h-9 text-sm rounded-md ${darkMode 
              ? 'border-gray-600 bg-gray-700 text-white focus:border-[#e2692c]' 
              : 'border-gray-300 bg-white text-gray-800 focus:border-[#1a5d96]'} border focus:ring-1 ${darkMode ? 'focus:ring-[#e2692c]' : 'focus:ring-[#1a5d96]'} ${inputClass}`}
          />
        </div>
      )
    },
    { label: "Call Duration", key: "callDuration", icon: <MdWatch />, type: "select", options: callDurationOptions, required: true, inputClass: "w-full" },
    { label: "Communication", key: "levelOfCommunication", icon: <MdMessage />, type: "select", options: communicationOptions, required: true, inputClass: "w-full" },
    { 
      label: "Company JD", 
      key: "jdReferenceCompany", 
      icon: <MdBusinessCenter />, 
      type: "select", 
      options: lineupCompanyOptions,
      required: false,
      inputClass: "w-full"
    },
    { 
      label: "Process JD", 
      key: "jdReferenceProcess", 
      icon: <MdTask />, 
      type: "custom", 
      options: filteredProcessOptions,
      required: false,
      inputClass: "w-full",
      render: ({ key, label, options, required, icon }) => (
        <div className="flex flex-col relative">
          <div className="flex gap-2">
            <div className="flex-1">
              <CustomSelect
                label={label}
                icon={icon}
                value={formData[key]}
                onChange={(value) => handleChange(key, value)}
                options={options}
                isDisabled={loading}
                isRequired={required}
                darkMode={darkMode}
                loading={loading}
                customInput={key === "companyProfile" || key === "lineupCompany" || key === "lineupProcess"}
                customValue={
                  key === "companyProfile" ? formData.customCompanyProfile :
                  key === "lineupCompany" ? formData.customLineupCompany :
                  key === "lineupProcess" ? formData.customLineupProcess : ""
                }
                onCustomChange={(value) => {
                  if (key === "companyProfile") handleChange("customCompanyProfile", value);
                  else if (key === "lineupCompany") handleChange("customLineupCompany", value);
                  else if (key === "lineupProcess") handleChange("customLineupProcess", value);
                }}
                customPlaceholder={
                  key === "companyProfile" ? "Custom profile" :
                  key === "lineupCompany" ? "Custom company" :
                  key === "lineupProcess" ? "Custom process" : ""
                }
                hasWhatsAppButton={key === "lineupProcess" || key === "jdReferenceProcess"}
                whatsAppNumber={formData.whatsappNumber}
                processDetails={options?.find(opt => opt.value === formData[key])?.label || ''}
              />
            </div>
            {formData.whatsappNumber && (
              <button
                type="button"
                onClick={() => window.open(`https://wa.me/91${formData.whatsappNumber}?text=Process%20Details:%20${encodeURIComponent(options?.find(opt => opt.value === formData[key])?.label || '')}`)}
                className={`px-3 rounded-md ${darkMode ? 'bg-[#e2692c] hover:bg-[#d15a20]' : 'bg-[#1a5d96] hover:bg-[#154a7a]'} text-white`}
                title="Send process details on WhatsApp"
              >
                <MdOutlineWhatsapp className="text-xl" />
              </button>
            )}
          </div>
        </div>
      )
    },
    
    { 
      label: "Lineup Remarks", 
      key: "lineupRemarks", 
      icon: <MdComment />, 
      type: "textarea",
      required: formData.callStatus === "Lineup",
      inputClass: "w-full",
      hidden: formData.callStatus !== "Lineup",
      span: "lg:col-span-5 md:col-span-3"
    },
    { 
      label: "Walkin Remarks", 
      key: "walkinRemarks", 
      icon: <MdComment />, 
      type: "textarea",
      required: formData.callStatus === "Walkin at Infidea",
      inputClass: "w-full",
      hidden: formData.callStatus !== "Walkin at Infidea",
      span: "lg:col-span-5 md:col-span-3"
    },
  ];

  // Show locality field only when city is Indore
  const showLocalityField = formData.city.toLowerCase() === "indore";

  const [showClientModal, setShowClientModal] = useState(false);
  const [clientData, setClientData] = useState({
    name: "",
    number: "",
    designation: "",
    companyName: ""
  });

  // Add client modal component
  const ClientModal = () => {
    const [localClientData, setLocalClientData] = useState({
      name: "",
      number: "",
      designation: "",
      companyName: ""
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setLocalClientData(prev => ({
        ...prev,
        [name]: value
      }));
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      if (isSubmitting) return;

      try {
        setIsSubmitting(true);
        // Create new client
        const response = await EmployeeServices.createClient(localClientData);
        notifySuccess(response?.message || 'Client details saved successfully');
        setShowClientModal(false);
        setLocalClientData({
          name: "",
          number: "",
          designation: "",
          companyName: ""
        });
      } catch (error) {
        notifyError(error?.response?.data?.message || 'Error saving client details');
      } finally {
        setIsSubmitting(false);
      }
    };

    const handleClose = () => {
      setShowClientModal(false);
      setLocalClientData({
        name: "",
        number: "",
        designation: "",
        companyName: ""
      });
    };

    return (
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      >
        <div 
          className={`relative w-full max-w-md p-6 rounded-lg shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}
        >
          <button
            type="button"
            onClick={handleClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <MdClose className="text-xl" />
          </button>
          
          <h2 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            Add Client Details
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Client Name *
              </label>
              <input
                type="text"
                name="name"
                required
                value={localClientData.name}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 rounded-md ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-800'
                } border focus:ring-1 focus:ring-[#1a5d96] dark:focus:ring-[#e2692c]`}
              />
            </div>
            
            <div>
              <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Contact Number *
              </label>
              <input
                type="tel"
                name="number"
                required
                pattern="[0-9]{10}"
                maxLength={10}
                value={localClientData.number}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 rounded-md ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-800'
                } border focus:ring-1 focus:ring-[#1a5d96] dark:focus:ring-[#e2692c]`}
              />
            </div>
            
            <div>
              <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Designation
              </label>
              <input
                type="text"
                name="designation"
                value={localClientData.designation}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 rounded-md ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-800'
                } border focus:ring-1 focus:ring-[#1a5d96] dark:focus:ring-[#e2692c]`}
              />
            </div>
            
            <div>
              <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Company Name
              </label>
              <input
                type="text"
                name="companyName"
                value={localClientData.companyName}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 rounded-md ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-800'
                } border focus:ring-1 focus:ring-[#1a5d96] dark:focus:ring-[#e2692c]`}
              />
            </div>
            
            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={handleClose}
                className={`px-4 py-2 rounded-md ${
                  darkMode 
                    ? 'bg-gray-700 hover:bg-gray-600 text-gray-200' 
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                }`}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-4 py-2 rounded-md text-white ${
                  darkMode ? 'bg-[#e2692c] hover:bg-[#d15a20]' : 'bg-[#1a5d96] hover:bg-[#154a7a]'
                } ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {isSubmitting ? 'Saving...' : 'Save Client'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className="px-4 py-3 dark:bg-gray-900 dark:text-gray-100 text-gray-800 overflow-hidden">
      <div className="h-full mx-auto flex flex-col">
        <div className="flex justify-between items-center mb-3">
          <h1 className="text-2xl font-bold dark:text-[#e2692c] text-[#1a5d96]">
            Call Information
          </h1>
          
          <div className="flex items-stretch gap-3">
            {formSavedTimestamp && (
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Last saved: {new Date(formSavedTimestamp).toLocaleTimeString()}
              </span>
            )}
            
            <button
              type="button"
              onClick={() => setShowClientModal(true)}
              className={`h-10 px-3 py-0 ${darkMode ? 'bg-[#e2692c] hover:bg-[#d15a20]' : 'bg-[#1a5d96] hover:bg-[#154a7a]'} text-white rounded-md text-sm flex items-center gap-1.5 transition-colors whitespace-nowrap`}
              style={{ minWidth: 'fit-content' }}
              title="Add Client"
            >
              <MdPeople className="text-base" />
              Add Client
            </button>
            
            <button
              type="button"
              onClick={resetForm}
              className={`h-10 px-3 py-0 ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} rounded-md text-sm flex items-center gap-1.5 transition-colors whitespace-nowrap`}
              style={{ minWidth: 'fit-content' }}
              title="Reset form"
            >
              <MdRefresh className="text-base" />
              Reset
            </button>
          </div>
        </div>

        {/* Show client modal when button is clicked */}
        {showClientModal && <ClientModal />}

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
                const requiresMandatoryFields = ["Lineup", "Walkin at Infidea"].includes(formData.callStatus);
                const isFieldRequired = requiresMandatoryFields ? required : (key === "candidateName" || key === "contactNumber" || key === "callStatus" || key === "callDuration");
                
                // For the locality field
                if (key === "city" && showLocalityField) {
                  return (
                    <React.Fragment key={key}>
                      <div className="flex flex-col relative">
                        <CustomSelect
                          label={label}
                          icon={icon}
                          value={formData[key]}
                          onChange={(value) => handleChange(key, value)}
                          options={options}
                          isDisabled={loading}
                          isRequired={isFieldRequired}
                          darkMode={darkMode}
                          loading={loading}
                        />
                      </div>

                      {/* Locality Field */}
                      <div className="flex flex-col">
                        <CustomSelect
                          label="Locality"
                          icon={<MdLocationOn />}
                          value={formData.locality}
                          onChange={(value) => handleChange("locality", value)}
                          options={localityOptions}
                          isDisabled={loadingDropdownData.localities}
                          isRequired={requiresMandatoryFields}
                          darkMode={darkMode}
                          loading={loadingDropdownData.localities}
                        />
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
                      <CustomSelect
                        label={label}
                        icon={icon}
                        value={formData[key]}
                        onChange={(value) => handleChange(key, value)}
                        options={options}
                        isDisabled={loading}
                        isRequired={isFieldRequired}
                        darkMode={darkMode}
                        loading={loading}
                        hasWhatsAppButton={key === "lineupProcess" || key === "jdReferenceProcess"}
                        whatsAppNumber={formData.whatsappNumber}
                        processDetails={options?.find(opt => opt.value === formData[key])?.label || ''}
                        customInput={key === "lineupProcess"}
                        customValue={key === "lineupProcess" ? formData.customLineupProcess : ""}
                        onCustomChange={(value) => key === "lineupProcess" && handleChange("customLineupProcess", value)}
                        customPlaceholder={key === "lineupProcess" ? "Custom process" : ""}
                      />
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
                        ref={callSummaryRef}
                        value={formData[key]}
                        onChange={(e) => handleChange(key, e.target.value)}
                        placeholder={`Enter ${label.toLowerCase()}...`}
                        required={isFieldRequired}
                        disabled={false}
                        className={`px-2.5 py-1.5 h-20 text-sm rounded-md ${darkMode 
                          ? 'border-gray-600 bg-gray-700 text-white focus:border-[#e2692c]' 
                          : 'border-gray-300 bg-white text-gray-800 focus:border-[#1a5d96]'} border focus:ring-1 ${darkMode ? 'focus:ring-[#e2692c]' : 'focus:ring-[#1a5d96]'} resize-none ${inputClass || ''}`}
                      />
                    </div>
                  );
                }
                
                // For regular select fields
                if (type === "select") {
                  return (
                    <CustomSelect
                      label={label}
                      icon={icon}
                      value={formData[key]}
                      onChange={(value) => handleChange(key, value)}
                      options={options}
                      isDisabled={loading}
                      isRequired={isFieldRequired}
                      darkMode={darkMode}
                      loading={loading}
                      customInput={key === "companyProfile" || key === "lineupCompany" || key === "lineupProcess"}
                      customValue={
                        key === "companyProfile" ? formData.customCompanyProfile :
                        key === "lineupCompany" ? formData.customLineupCompany :
                        key === "lineupProcess" ? formData.customLineupProcess : ""
                      }
                      onCustomChange={(value) => {
                        if (key === "companyProfile") handleChange("customCompanyProfile", value);
                        else if (key === "lineupCompany") handleChange("customLineupCompany", value);
                        else if (key === "lineupProcess") handleChange("customLineupProcess", value);
                      }}
                      customPlaceholder={
                        key === "companyProfile" ? "Custom profile" :
                        key === "lineupCompany" ? "Custom company" :
                        key === "lineupProcess" ? "Custom process" : ""
                      }
                      hasWhatsAppButton={key === "lineupProcess" || key === "jdReferenceProcess"}
                      whatsAppNumber={formData.whatsappNumber}
                      processDetails={options?.find(opt => opt.value === formData[key])?.label || ''}
                    />
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
                        <CustomSelect
                          label={label}
                          icon={icon}
                          value={formData[key]}
                          onChange={(value) => handleChange(key, value)}
                          options={options}
                          isDisabled={loading}
                          isRequired={isFieldRequired}
                          darkMode={darkMode}
                          loading={loading}
                          customInput={key === "companyProfile" || key === "lineupCompany" || key === "lineupProcess"}
                          customValue={
                            key === "companyProfile" ? formData.customCompanyProfile :
                            key === "lineupCompany" ? formData.customLineupCompany :
                            key === "lineupProcess" ? formData.customLineupProcess : ""
                          }
                          onCustomChange={(value) => {
                            if (key === "companyProfile") handleChange("customCompanyProfile", value);
                            else if (key === "lineupCompany") handleChange("customLineupCompany", value);
                            else if (key === "lineupProcess") handleChange("customLineupProcess", value);
                          }}
                          customPlaceholder={
                            key === "companyProfile" ? "Custom profile" :
                            key === "lineupCompany" ? "Custom company" :
                            key === "lineupProcess" ? "Custom process" : ""
                          }
                          hasWhatsAppButton={key === "lineupProcess" || key === "jdReferenceProcess"}
                          whatsAppNumber={formData.whatsappNumber}
                          processDetails={options?.find(opt => opt.value === formData[key])?.label || ''}
                        />
                        
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
                          disabled={disabled}
                          ref={key === "candidateName" ? candidateNameRef : undefined}
                          className={`px-2.5 py-1.5 h-9 text-sm rounded-md ${darkMode 
                            ? 'border-gray-600 bg-gray-700 text-white focus:border-[#e2692c]' 
                            : 'border-gray-300 bg-white text-gray-800 focus:border-[#1a5d96]'} border focus:ring-1 ${darkMode ? 'focus:ring-[#e2692c]' : 'focus:ring-[#1a5d96]'} ${inputClass || ''} ${
                              disabled ? 'bg-gray-100 dark:bg-gray-600 cursor-not-allowed' : ''
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
                ref={callSummaryRef}
                value={formData.callSummary}
                onChange={(e) => handleChange("callSummary", e.target.value)}
                placeholder="Enter call summary..."
                required={true}
                disabled={false}
                className={`px-2.5 py-1.5 h-20 w-full text-sm rounded-md ${darkMode 
                  ? 'border-gray-600 bg-gray-700 text-white focus:border-[#e2692c]' 
                  : 'border-gray-300 bg-white text-gray-800 focus:border-[#1a5d96]'} border focus:ring-1 ${darkMode ? 'focus:ring-[#e2692c]' : 'focus:ring-[#1a5d96]'} resize-none`}
              />
            </div>
          </div>
          
          <div className="flex flex-col gap-2 mt-3">
              <span className="text-xs ml-2 text-gray-500 dark:text-gray-400">Ctrl + : to focus on candidate name</span>
              <span className="text-xs ml-2 text-gray-500 dark:text-gray-400">Ctrl + " to focus on call summary</span>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center mt-3">
            {loading ? (
              <Loader size="30" speed="1.75" />
            ) : (
              <button
                type="submit"
                className={`px-5 py-2.5 ${darkMode ? 'bg-[#e2692c] hover:bg-[#d15a20]' : 'bg-[#1a5d96] hover:bg-[#154a7a]'} text-white rounded-md text-sm shadow-md flex items-center gap-1.5 transition-colors`}
                disabled={loading}
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
