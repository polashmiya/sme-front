import { Route } from "react-router-dom";
import EmployeeLanding from "./features/employee/pages/Landing";
import ItemProfileLanding from "./features/itemProfile/pages/Landing";
import CustomerProfileLanding from "./features/customerProfile/pages/Landing";
import SupplierProfileLanding from "./features/supplierProfile/pages/Landing";
import OfferSetupLanding from "./features/offerSetup/pages/Landing";
import CustomerPriceLanding from "./features/customerPriceSetup/pages/Landing";
import StandardPriceLanding from "./features/standardPriceSetup/pages/Landing";
import EmployeeCreate from "./features/employee/pages/Create";
import ItemProfileCreate from "./features/itemProfile/pages/Create";
import CustomerProfileCreate from "./features/customerProfile/pages/Create";
import SupplierProfileCreate from "./features/supplierProfile/pages/Create";
import OfferSetupCreate from "./features/offerSetup/pages/Create";
import CustomerPriceCreate from "./features/customerPriceSetup/pages/Create";
import StandardPriceCreate from "./features/standardPriceSetup/pages/Create";

const pages = [
  {
    key: "configuration.employee.employee",
    path: "/configuration/employee",
    component: <EmployeeLanding />,
  },
  {
    key: "configuration.employee.addEmployee",
    path: "/configuration/employee/add",
    component: <EmployeeCreate />,
  },

  {
    key: "configuration.itemProfile",
    path: "/configuration/item-profile",
    component: <ItemProfileLanding />,
  },
  {
    key: "configuration.itemProfile.addItem",
    path: "/configuration/item-profile/add",
    component: <ItemProfileCreate />,
  },
  {
    key: "configuration.customerProfile",
    path: "/configuration/customer-profile",
    component: <CustomerProfileLanding />,
  },
  {
    key: "configuration.customerProfile.addCustomer",
    path: "/configuration/customer-profile/add",
    component: <CustomerProfileCreate />,
  },
  {
    key: "configuration.supplierProfile",
    path: "/configuration/supplier-profile",
    component: <SupplierProfileLanding />,
  },
  {
    key: "configuration.supplierProfile.addSupplier",
    path: "/configuration/supplier-profile/add",
    component: <SupplierProfileCreate />,
  },
  {
    key: "configuration.offerSetup",
    path: "/configuration/offer-setup",
    component: <OfferSetupLanding />,
  },
  {
    key: "configuration.offerSetup.addOffer",
    path: "/configuration/offer-setup/add",
    component: <OfferSetupCreate />,
  },
  {
    key: "configuration.customerPrice",
    path: "/configuration/customer-price",
    component: <CustomerPriceLanding />,
  },
  {
    key: "configuration.customerPrice.addCustomerPrice",
    path: "/configuration/customer-price/add",
    component: <CustomerPriceCreate />,
  },
  {
    key: "configuration.standardPrice",
    path: "/configuration/standard-price",
    component: <StandardPriceLanding />,
  },
  {
    key: "configuration.standardPrice.addStandardPrice",
    path: "/configuration/standard-price/add",
    component: <StandardPriceCreate />,
  },
];

const ConfigurationPages = pages.map((p) => (
  <Route key={p.path} path={p.path} element={p.component} />
));

export default ConfigurationPages;
