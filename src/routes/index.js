import { lazy } from "react";

// use lazy for better code splitting
const Dashboard = lazy(() => import("@/pages/Dashboard"));
const Staff = lazy(() => import("@/pages/Staff"));
const Applicants = lazy(() => import("@/pages/Applicants"));
const Users = lazy(() => import("@/pages/Users"));
const JobSeeker = lazy(() => import("@/pages/User"));
const Jobs = lazy(() => import("@/pages/Jobs"));
const Job = lazy(() => import("@/pages/Job"));
const PostJob = lazy(() => import("@/pages/PostJob"));
const ManageCompanies = lazy(() => import("@/pages/ManageCompanies"));
const Companies = lazy(() => import("@/pages/Companies"));
// const Setting = lazy(() => import("@/pages/Setting"));
const Page404 = lazy(() => import("@/pages/404"));
const EditProfile = lazy(() => import("@/pages/EditProfile"));
const Languages = lazy(() => import("@/pages/Languages"));
const Setting = lazy(() => import("@/pages/Setting"));
const Notifications = lazy(() => import("@/pages/Notifications"));
const CallInfo = lazy(() => import("@/pages/Call_Info"));
const CallDetails = lazy(() => import("@/pages/CallDetails"));
const Joinings = lazy(() => import("@/pages/Joinings"));
const Lineups = lazy(() => import("@/pages/Lineups"));
const Walkins = lazy(() => import("@/pages/Walkins"));
const Activities = lazy(() => import("@/pages/Activities"));
const Leaves = lazy(() => import("@/pages/Leaves"));

/*
//  * ⚠ These are internal routes!
//  * They will be rendered inside the app, using the default `containers/Layout`.
//  * If you want to add a route to, let's say, a landing page, you should add
//  * it to the `App`'s router, exactly like `Login`, `CreateAccount` and other pages
//  * are routed.
//  *
//  * If you're looking for the links rendered in the SidebarContent, go to
//  * `routes/sidebar.js`
 */

const routes = [
  {
    path: "/dashboard",
    component: Dashboard,
  },
  {
    path: "/languages",
    component: Languages,
  },
  {
    path: "/users",
    component: Users,
  },
  {
    path: "/jobseeker/:id",
    component: JobSeeker,
  },
  {
    path: "/job/:id",
    component: Job,
  },
  {
    path: "/our-staff",
    component: Staff,
  },
  {
    path: "/companies",
    component: Companies,
  },
  {
    path: "/manage-companies",
    component: ManageCompanies,
  },
  {
    path: "/jobs",
    component: Jobs,
  },
  {
    path: "/post-job",
    component: PostJob,
  },
  {
    path: "/applicants",
    component: Applicants,
  },
  {
    path: "/activities",
    component: Activities,
  },
  {
    path: "/leaves",
    component: Leaves,
  },
  {
    path: "/404",
    component: Page404,
  },
  {
    path: "/edit-profile",
    component: EditProfile,
  },
  {
    path: "/notifications",
    component: Notifications,
  },
  {
    path: "/call-info",
    component: CallInfo,
  },
  {
    path: "/call-details",
    component: CallDetails,
  },
  {
    path: "/joinings",
    component: Joinings,
  },
  {
    path: "/lineups",
    component: Lineups,
  },
  {
    path: "/walkins",
    component: Walkins,
  },
];

const routeAccessList = [
  // {
  //   label: "Root",
  //   value: "/",
  // },
  { label: "Dashboard", value: "dashboard" },
  { label: "Products", value: "products" },
  { label: "Categories", value: "categories" },
  { label: "Attributes", value: "attributes" },
  { label: "Coupons", value: "coupons" },
  { label: "Users", value: "users" },
  { label: "Applicants", value: "applicants" },
  { label: "Orders", value: "orders" },
  { label: "Staff", value: "our-staff" },
  { label: "Settings", value: "settings" },
  { label: "Languages", value: "languages" },
  { label: "Currencies", value: "currencies" },
  { label: "ViewStore", value: "store" },
  { label: "StoreCustomization", value: "customization" },
  { label: "StoreSettings", value: "store-settings" },
  { label: "Product Details", value: "product" },
  { label: "Order Invoice", value: "order" },
  { label: "Edit Profile", value: "edit-profile" },
  { label: "Post a Job", value: "post-job" },
  { label: "Companies", value: "companies" },
  { label: "Manage Companies", value: "manage-companies" },
  {
    label: "JobSeeker",
    value: "jobseeker",
  },
  {
    label: "Job",
    value: "job",
  },
  { label: "Notification", value: "notifications" },
  { label: "Coming Soon", value: "coming-soon" },
  { label: "Jobs", value: "jobs" },
  { label: "Call Info", value: "call-info" },
  { label: "Call Details", value: "call-details" },
  { label: "Joinings", value: "joinings" },
  { label: "Lineups", value: "lineups" },
  { label: "Walkins", value: "walkins" },
  { label: "Activities", value: "activities" },
  { label: "Leaves", value: "leaves" },
];

export { routeAccessList, routes };
