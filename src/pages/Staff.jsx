import {
  Button,
  Card,
  CardBody,
  Input,
  Pagination,
  Select,
  Table,
  TableCell,
  TableContainer,
  TableFooter,
  TableHeader,
} from "@windmill/react-ui";
import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { FiPlus } from "react-icons/fi";
import 'react-datepicker/dist/react-datepicker.css';
import { Label } from "@windmill/react-ui";
import { MdFilterList, MdResetTv } from "react-icons/md";

//internal import

import useAsync from "@/hooks/useAsync";
import useFilter from "@/hooks/useFilter";
import MainDrawer from "@/components/drawer/MainDrawer";
import StaffDrawer from "@/components/drawer/StaffDrawer";
import TableLoading from "@/components/preloader/TableLoading";
import StaffTable from "@/components/staff/StaffTable";
import NotFound from "@/components/table/NotFound";
import PageTitle from "@/components/Typography/PageTitle";
import { AdminContext } from "@/context/AdminContext";
import { SidebarContext } from "@/context/SidebarContext";
import EmployeeServices from "@/services/EmployeeServices";
import AnimatedContent from "@/components/common/AnimatedContent";

const Staff = () => {
  const { state } = useContext(AdminContext);
  const { adminInfo } = state;
  const { toggleDrawer, lang } = useContext(SidebarContext);

  const { data, loading, error } = useAsync(() =>
    EmployeeServices.getAllStaff({ email: adminInfo.email })
  );

  const {
    userRef,
    setSearchUser,
    setRole,
    totalResults,
    resultsPerPage,
    dataTable,
    serviceData,
    handleChangePage,
    handleSubmitUser,
    sortBy,
    sortOrder,
    setSortBy,
    setSortOrder,
  } = useFilter(data?.admins);

  const { t } = useTranslation();

  const sortOptions = [
    { label: "--Select Sort By--", value: "" },
    { label: "Name", value: "name.en" },
    { label: "Email", value: "email" },
    { label: "Role", value: "role" },
    { label: "Status", value: "status" },
    { label: "Joining Date", value: "joiningDate" },
  ];

  // handle reset filed
  const handleResetField = () => {
    setRole("");
    setSearchUser("");
    userRef.current.value = "";
    setSortBy("");
    setSortOrder("");
  };

  return (
    <>
      <PageTitle>{t("StaffPageTitle")} </PageTitle>
      <MainDrawer>
        <StaffDrawer />
      </MainDrawer>

      <AnimatedContent>
        <Card className="min-w-0 shadow-xs overflow-visible bg-white dark:bg-gray-800 mb-5">
          <CardBody>
            <form
              onSubmit={handleSubmitUser}
              className="py-3 grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6 xl:gap-6"
            >
              {/* First Row */}
              <div className="flex-grow-0 md:flex-grow lg:flex-grow xl:flex-grow">
                <Input
                  ref={userRef}
                  type="search"
                  name="search"
                  placeholder={t("StaffSearchBy")}
                />
                <button
                  type="submit"
                  className="absolute right-0 top-0 mt-5 mr-1"
                ></button>
              </div>
              <div className="flex-grow-0 md:flex-grow lg:flex-grow xl:flex-grow">
                <Select onChange={(e) => setRole(e.target.value)}>
                  <option value="All" defaultValue hidden>
                    {t("StaffRole")}
                  </option>
                  <option value="Admin">{t("StaffRoleAdmin")}</option>
                  <option value="Cashier">{t("SelectCashiers")}</option>
                  <option value="Super Admin">{t("SelectSuperAdmin")}</option>
                </Select>
              </div>

              {/* Second Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 col-span-1 md:col-span-2">
                {/* Sort Controls */}
                <div className="grid grid-cols-2 gap-2">
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
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-2">
                  <Button type="submit" className="h-12 w-full text-white bg-sky-900 hover:bg-sky-700 active:bg-sky-800">
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
                </div>
              </div>

              {/* Add Staff Button */}
              <div className="col-span-1 md:col-span-2">
                <div className="w-full md:w-56 lg:w-56 xl:w-56">
                  <Button
                    onClick={toggleDrawer}
                    className="w-full rounded-md h-12 bg-rose-900 hover:bg-rose-700 active:bg-rose-800"
                  >
                    <span className="mr-3">
                      <FiPlus />
                    </span>
                    {t("AddStaff")}
                  </Button>
                </div>
              </div>
            </form>
          </CardBody>
        </Card>
      </AnimatedContent>

      {loading ? (
        // <Loading loading={loading} />
        <TableLoading row={12} col={7} width={163} height={20} />
      ) : error ? (
        <span className="text-center mx-auto text-red-500">{error}</span>
      ) : serviceData?.length !== 0 ? (
        <TableContainer className="mb-8 rounded-b-lg">
          <Table>
            <TableHeader>
              <tr>
                <TableCell>{t("StaffNameTbl")}</TableCell>
                <TableCell>{t("StaffEmailTbl")}</TableCell>
                <TableCell>{t("StaffContactTbl")}</TableCell>
                <TableCell>{t("StaffJoiningDateTbl")}</TableCell>
                <TableCell>{t("StaffRoleTbl")}</TableCell>
                <TableCell className="text-center">
                  {t("OderStatusTbl")}
                </TableCell>
                <TableCell className="text-center">
                  {t("PublishedTbl")}
                </TableCell>

                <TableCell className="text-center">
                  {t("StaffActionsTbl")}
                </TableCell>
              </tr>
            </TableHeader>
            <StaffTable staffs={dataTable} lang={lang} />
          </Table>
          <TableFooter>
            <Pagination
              totalResults={totalResults}
              resultsPerPage={resultsPerPage}
              onChange={handleChangePage}
              label="Table navigation"
            />
          </TableFooter>
        </TableContainer>
      ) : (
        <NotFound title="Sorry, There are no staff right now." />
      )}
    </>
  );
};

export default Staff;
