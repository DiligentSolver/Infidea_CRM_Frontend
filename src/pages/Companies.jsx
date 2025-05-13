import {
    Card,
    Button,
    CardBody,
    Input,
    Pagination,
    Table,
    TableCell,
    TableContainer,
    TableHeader,
  } from "@windmill/react-ui";
  import React, { useState, useEffect, useContext } from "react";
  import { useTranslation } from "react-i18next";
  
  //internal import
  import CompaniesTable from "@/components/companies/companiesTable";
  import TableLoading from "@/components/preloader/TableLoading";
  import NotFound from "@/components/table/NotFound";
  import PageTitle from "@/components/Typography/PageTitle";
  import useFilter from "@/hooks/useFilter";
  import EmployeeServices from "@/services/EmployeeServices";
  import AnimatedContent from "@/components/common/AnimatedContent";
  import { SidebarContext } from "@/context/SidebarContext";
  import DownloadDataModal from "@/components/modal/DownloadDataModal";
  import { notifySuccess, notifyError } from "@/utils/toast";
  import DatePicker from "react-datepicker";  
  import { Label, Select } from "@windmill/react-ui";
  import 'react-datepicker/dist/react-datepicker.css';
  import { IoCalendarOutline, IoTrashOutline, } from "react-icons/io5";
  import { MdDownload, MdFilterList, MdResetTv } from "react-icons/md";
  import useToggleDrawer from "@/hooks/useToggleDrawer";
  import DeleteModal from "@/components/modal/DeleteModal";
  import MultipleDeleteModal from "@/components/modal/MultipleDeleteModal";
  const Companies = () => {
    const { currentPage, handleChangePage, resultsPerPage, setResultsPerPage } = useContext(SidebarContext);
    const [selectedCompanies, setSelectedCompanies] = useState([]);
    const [isDeleteLoading, setIsDeleteLoading] = useState(false);
    const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
    const [queryParams, setQueryParams] = useState({
      page: currentPage,
      limit: resultsPerPage
    });
    const [data, setData] = useState({ companies: [], totalCompanies: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { title, handleMultipleDeleteModalOpen, serviceIds, setIsCheck} = useToggleDrawer();

    const fetchData = async (params) => {
      setLoading(true);
      try {
        const result = await EmployeeServices.getRecentCompanies(params);
        setData(result);
        setError(null);
      } catch (err) {
        setError(err.message || "Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    useEffect(() => {
      fetchData(queryParams);
    }, [queryParams]);
  
    const {
      companyRef,  
      dataTable,
      serviceData,
      setSearchCompanies,
      handleSubmitCompanies,
      sortBy,
      setSortBy,
      sortOrder,
      setSortOrder,
      dateRange,
      handleDateRangeChange,
      handleDateRangeTypeChange,
      dateRangeType,
      setDateRangeType,
      setDateRange,
      handleSortChange,
    } = useFilter(data?.companies);
  
    const { t } = useTranslation();
    const handleResetField = () => {
      setSearchCompanies("");
      companyRef.current.value = "";
      setSortBy("");
      setSortOrder("asc");
      setDateRange({ startDate: null, endDate: null });
      setDateRangeType("day");
      handleSubmitCompanies();
    };

    const handleSelectCompany = (companyId) => {
      setSelectedCompanies(prevSelected => {
        if (prevSelected.includes(companyId)) {
          return prevSelected.filter(id => id !== companyId);
        } else {
          return [...prevSelected, companyId];
        }
      });
    };

    const handleSelectAll = () => {
      if (selectedCompanies.length === dataTable.length) {
        setSelectedCompanies([]);
      } else {
        setSelectedCompanies(dataTable.map(company => company._id));
      }
    };

   

    const handleDeleteSelected = async () => {
      if (selectedCompanies.length === 0) return;
      
      // Get all selected companies from the data
      const selectedCompaniesData = data.companies.filter(company => 
        selectedCompanies.includes(company._id)
      );
      
      // If no companies are found, show an error and return
      if (selectedCompaniesData.length === 0) {
        notifyError("Selected companies not found in the data");
        return;
      }

      // Create a string of company names
      const companyNames = selectedCompaniesData.map(company => company.companyName).join(", ");
      
      console.log('companyNames', title);

      handleMultipleDeleteModalOpen(selectedCompanies, companyNames);
    };

    const handleSortByField = (field) => {
      handleSortChange(field);
    };
  
    const availableColumns = [
      { key: 'companyId', label: 'Company ID' },
      { key: 'createdAt', label: 'Created On' },
      { key: 'companyName', label: 'Company Name' },
      { key: 'companyDescription', label: 'Description' },
      { key: 'companyLocation', label: 'Location' },
      { key: 'companyIndustry', label: 'Industry' },
      { key: 'companySize', label: 'Company Size' },
      { key: 'companyWebsite', label: 'Website' },
      { key: 'companyEmail', label: 'Email' },
      { key: 'companyPhone', label: 'Phone' },
      { key: 'updatedAt', label: 'Updated On' },
    ];

    const handleDownloadRequest = async (selectedColumnKeys, onlySelected) => {
      try {
        const response = await EmployeeServices.generateTempRoute();
        const baseUrl = `${import.meta.env.VITE_APP_API_BASE_URL}/admin${response.tempRoute}?type=companies`;
        
        let url = baseUrl;
        
        if (selectedColumnKeys.length > 0 && selectedColumnKeys.length < availableColumns.length) {
          url += `&columns=${selectedColumnKeys.join(',')}`;
        }
        
        if (onlySelected && selectedCompanies.length > 0) {
          url += `&companyIds=${selectedCompanies.join(',')}`;
        }
        
        window.open(url, '_blank');
        setIsDownloadModalOpen(false);
        notifySuccess("Companies download initiated successfully");
      } catch (error) {
        notifyError("Something went wrong");
      }
    };

    const sortOptions = [
      { value: "", label: "-- Select Sort Field --" },
      { value: "companyId", label: "Company ID" },
      { value: "createdAt", label: "Created On" },
      { value: "companyName", label: "Company Name" },
    ];

    const dateRangeTypeOptions = [
      { value: "day", label: "Day to Day" },
      { value: "month", label: "Month to Month" },
      { value: "year", label: "Year to Year" },
    ];

    const resultsPerPageOptions = [
      { value: 20, label: '20' },
      { value: 40, label: '40' },
      { value: 60, label: '60' },
      { value: 80, label: '80' },
      { value: 160, label: '160' },
    ]; 


    const handleResultsPerPageChange = (e) => {
      const newLimit = parseInt(e.target.value, 10);
      setResultsPerPage(newLimit);
      handleChangePage(1);
      
      setQueryParams({
        ...queryParams,
        page: 1,
        limit: newLimit
      });
    };
    
  
    return (
      <>
        <PageTitle>{t("CompaniesPage")}</PageTitle>

        <MultipleDeleteModal ids={serviceIds} title={title} />
        
        <DownloadDataModal 
          isOpen={isDownloadModalOpen}
          onClose={() => setIsDownloadModalOpen(false)}
          title="Download Companies Data"
          availableColumns={availableColumns}
          selectedItems={selectedCompanies}
          onClearSelection={() => setSelectedCompanies([])}
          onDownload={handleDownloadRequest}
          entityName="Companies"
        />
  
        <AnimatedContent>
          <Card className="min-w-0 shadow-xs overflow-visible bg-white dark:bg-gray-800 mb-5">
            <CardBody>
              <form
                onSubmit={handleSubmitCompanies}
                className="py-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
              >
                <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 relative">
                  <Label>Search By</Label>
                  <Input
                    ref={companyRef}
                    type="search"
                    name="search"
                    placeholder={t("CompaniesPageSearchPlaceholder")}
                  />
                  <button
                    type="submit"
                    className="absolute right-0 top-0 mt-5 mr-1"
                  ></button>
                </div>

                <div>
                  <Label>Sort By</Label>
                  <Select
                    className="w-full mt-1"
                    name="sortBy"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    {sortOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Select>
                </div>
                      
                <div className={sortBy ? "" : "hidden"}>
                  <Label>Sort Order</Label>
                  <Select
                    className="w-full mt-1"
                    name="sortOrder"
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                  >
                    <option value="asc">Ascending</option>
                    <option value="desc">Descending</option>
                  </Select>
                </div>

                <div>
                  <Label>Date Range</Label>
                  <Select
                    className="w-full mt-1"
                    name="dateRangeType"
                    value={dateRangeType}
                    onChange={(e) => handleDateRangeTypeChange(e.target.value)}
                  >
                    {dateRangeTypeOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Select>
                </div>

                <div>
                  <Label className="font-medium text-gray-700 dark:text-gray-300">From</Label>
                  <div className="relative">
                    <DatePicker
                      selected={dateRange.startDate}
                      onChange={(date) => handleDateRangeChange(date, dateRange.endDate)}
                      selectsStart
                      startDate={dateRange.startDate}
                      endDate={dateRange.endDate}
                      dateFormat={dateRangeType === 'year' ? 'yyyy' : dateRangeType === 'month' ? 'MMM-yyyy' : 'dd-MMM-yyyy'}
                      showMonthYearPicker={dateRangeType === 'month'}
                      showYearPicker={dateRangeType === 'year'}
                      className="w-full mt-1 p-2 pl-10 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:border-primary-400 focus:ring focus:ring-primary-200 focus:ring-opacity-50 dark:bg-gray-700 dark:text-white"
                      popperClassName="z-50"
                    />
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500 dark:text-emerald-400 mt-1">
                      <IoCalendarOutline className="size-5 text-gray-500 dark:text-emerald-400"/>
                    </div>
                  </div>
                </div>

                <div>
                  <Label className="font-medium text-gray-700 dark:text-gray-300">To</Label>
                  <div className="relative">
                    <DatePicker
                      selected={dateRange.endDate}
                      onChange={(date) => handleDateRangeChange(dateRange.startDate, date)}
                      selectsEnd
                      startDate={dateRange.startDate}
                      endDate={dateRange.endDate}
                      minDate={dateRange.startDate}
                      dateFormat={dateRangeType === 'year' ? 'yyyy' : dateRangeType === 'month' ? 'MMM-yyyy' : 'dd-MMM-yyyy'}
                      showMonthYearPicker={dateRangeType === 'month'}
                      showYearPicker={dateRangeType === 'year'}
                      className="w-full mt-1 p-2 pl-10 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:border-primary-400 focus:ring focus:ring-primary-200 focus:ring-opacity-50 dark:bg-gray-700 dark:text-white"
                      popperClassName="z-50"
                    />
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500 dark:text-emerald-400 mt-1">
                      <IoCalendarOutline className="size-5 text-gray-500 dark:text-emerald-400"/>
                    </div>
                  </div>
                </div>
                
                <div className="col-span-1 md:col-span-2 lg:col-span-3 xl:col-span-4 grid grid-cols-2 md:grid-cols-4 gap-2">
                  <Button type="submit" className="h-12 w-full bg-sky-900 hover:bg-sky-700 active:bg-sky-800 text-white">
                    <MdFilterList className="size-5 ml-2 text-white mr-2"/>
                    Filter
                  </Button>

                  <Button
                    onClick={handleResetField}
                    type="reset"
                    className="h-12 w-full bg-violet-900 hover:bg-violet-700 active:bg-violet-800 text-white"
                  >
                    <MdResetTv className="size-5 ml-2 text-white mr-2"/>
                    Reset
                  </Button>

                  <Button
                    onClick={() => setIsDownloadModalOpen(true)}
                    className="h-12 w-full bg-indigo-800 hover:bg-indigo-600 active:bg-indigo-700 text-white"
                  >
                    <MdDownload className="size-5 ml-2 text-white mr-2"/>
                    {t('DownloadCompanies')}
                  </Button>

                  <div className="w-20 justify-self-end">
                    {selectedCompanies.length > 0 && (
                      <Button
                        onClick={handleDeleteSelected}
                        disabled={isDeleteLoading}
                        className="h-12 w-full bg-red-600 hover:bg-red-700"
                      >
                        <IoTrashOutline className="mr-2 size-4"/> ({selectedCompanies.length})
                      </Button>
                    )}
                  </div>
                </div>
              </form>
            </CardBody>
          </Card>
        </AnimatedContent>
  
        {loading ? (
          <TableLoading row={12} col={6} width={190} height={20} />
        ) : error ? (
          <span className="text-center mx-auto text-red-500">{error}</span>
        ) : serviceData?.length !== 0 ? (
          <TableContainer className="mb-8">
            {dateRange.startDate && dateRange.endDate && (
              <div className="my-2 p-2">
                <span className="text-sm text-amber-900 dark:text-white font-bold">
                  Filtering by date: {dateRange.startDate.toLocaleDateString()} to {dateRange.endDate.toLocaleDateString()} 
                </span>
                <Button 
                  size="small" 
                  layout="link" 
                  onClick={() => setDateRange({ startDate: null, endDate: null })}
                  className="ml-2 text-white dark:text-white bg-sky-900 hover:bg-sky-700 active:bg-sky-800"
                >
                  Clear
                </Button>
              </div>
            )}
            <div className="flex flex-wrap justify-between items-center gap-4 pl-2 pr-2">
              <Pagination
                totalResults={data?.totalCompanies}
                resultsPerPage={resultsPerPage}
                onChange={handleChangePage}
                label="Table navigation"
              />

              <div className="flex items-center gap-2">
                <Label className="text-sm whitespace-nowrap">Results Per Page</Label>
                <Select
                  className="w-24 h-8 text-sm px-2 py-1 border border-gray-300 rounded-md"
                  name="resultsPerPage"
                  value={resultsPerPage}
                  onChange={handleResultsPerPageChange}
                >
                  {resultsPerPageOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
              </div>
            </div>
            <Table>
              <TableHeader>
                <tr className="bg-gray-700 text-white dark:bg-gray-600 dark:text-white">
                  <TableCell className="text-center">
                    <input
                      type="checkbox"
                      className="form-checkbox h-5 w-5 text-emerald-600 cursor-pointer"
                      checked={selectedCompanies.length > 0 && selectedCompanies.length === dataTable.length}
                      onChange={handleSelectAll}
                    />
                  </TableCell>
                  <TableCell 
                    className="cursor-pointer text-center"
                    onClick={() => handleSortByField("companyId")}
                  >
                    {t("CompanyId")}
                    {sortBy === "companyId" && (
                      <span className="ml-2">{sortOrder === "asc" ? "▲" : "▼"}</span>
                    )}
                  </TableCell>
                  <TableCell onClick={() => handleSortByField("createdAt")} className="text-center">
                    {t("CreatedOn")} 
                    {sortBy === "createdAt" && (
                      <span className="ml-2 text-white">{sortOrder === "asc" ? "▲" : "▼"}</span>
                    )}
                  </TableCell>
                  <TableCell onClick={() => handleSortByField("companyName")} className="text-center">
                    {t("CompanyName")} 
                    {sortBy === "companyName" && (
                      <span className="ml-2 text-white">{sortOrder === "asc" ? "▲" : "▼"}</span>
                    )}
                  </TableCell>
                
                  <TableCell className="text-center">{t("Actions")}</TableCell>
                </tr>
              </TableHeader>

              <CompaniesTable 
                companies={dataTable} 
                selectedCompanies={selectedCompanies} 
                onSelectCompany={handleSelectCompany} 
              />
            </Table>
          </TableContainer>
        ) : (
          <NotFound title="Sorry, There are no companies right now." />
        )}
      </>
    );
  };
  
  export default Companies;
