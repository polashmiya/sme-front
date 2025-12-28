import { Route } from "react-router-dom";
import EmployeeLanding from "./features/employee/pages/Landing";
import ItemProfileLanding from "./features/itemProfile/pages/Landing";
import CustomerProfileLanding from "./features/customerProfile/pages/Landing";
import SupplierProfileLanding from "./features/supplierProfile/pages/Landing";
import OfferSetupLanding from "./features/offerSetup/pages/Landing";
import CustomerPriceLanding from "./features/customerPriceSetup/pages/Landing";
import StandardPriceLanding from "./features/standardPriceSetup/pages/Landing";
import EmployeeCreate from "./features/employee/pages/Create";

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
    key: "configuration.customerProfile",
    path: "/configuration/customer-profile",
    component: <CustomerProfileLanding />,
  },
  {
    key: "configuration.supplierProfile",
    path: "/configuration/supplier-profile",
    component: <SupplierProfileLanding />,
  },
  {
    key: "configuration.offerSetup",
    path: "/configuration/offer-setup",
    component: <OfferSetupLanding />,
  },
  {
    key: "configuration.customerPrice",
    path: "/configuration/customer-price",
    component: <CustomerPriceLanding />,
  },
  {
    key: "configuration.standardPrice",
    path: "/configuration/standard-price",
    component: <StandardPriceLanding />,
  },
];

const ConfigurationPages = pages.map((p) => (
  <Route key={p.path} path={p.path} element={p.component} />
));

export default ConfigurationPages;
