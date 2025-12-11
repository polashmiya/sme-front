import { Routes, Route } from "react-router-dom";
import DashboardPage from "../modules/DashboardPage";
import MoreMenusPage from "../common/MoreMenusPage";
import PurchaseSubMenuPage from "../common/PurchaseSubMenuPage";
import SalesSubMenuPage from "../common/SalesSubMenuPage";
import AccountSubMenuPage from "../common/AccountSubMenuPage";
import InventorySubMenuPage from "../common/InventorySubMenuPage";
import ConfigurationSubMenuPage from "../common/ConfigurationSubMenuPage";
import PurchasePages from "../modules/purchase/PurchasePages";
import SalesPages from "../modules/sales/SalesPages";
import AccountPages from "../modules/account/AccountPages";
import ConfigurationPages from "../modules/configuration/ConfigurationPages";
import InventoryPages from "../modules/inventory/InventoryPages";
// import AccountPages from "../pages/account";
// import InventoryPages from "../pages/inventory";
// import ConfigurationPages from "../pages/configuration";
import ApprovalPage from "../modules/ApprovalPage";
import PurchaseOrderApproval from "../modules/approval/PurchaseOrderApproval";
import PurchasePaymentApproval from "../modules/approval/PurchasePaymentApproval";
import PurchaseReturnApproval from "../modules/approval/PurchaseReturnApproval";
import SalesOrderApproval from "../modules/approval/SalesOrderApproval";
import SalesCollectionApproval from "../modules/approval/SalesCollectionApproval";
import SalesReturnApproval from "../modules/approval/SalesReturnApproval";
import AccountJournalApproval from "../modules/approval/AccountJournalApproval";
import ExpenseAdvanceApproval from "../modules/approval/ExpenseAdvanceApproval";
import StockAdjustmentApproval from "../modules/approval/StockAdjustmentApproval";
import SignInPage from "../modules/auth/SignInPage";
import SignUpPage from "../modules/auth/SignUpPage";
import Protected from "./Protected";
import LayoutShell from "../layout/LayoutShell";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/auth/sign-in" element={<SignInPage />} />
      <Route path="/auth/sign-up" element={<SignUpPage />} />
      <Route element={<Protected />}>
        <Route element={<LayoutShell />}>
          <Route path="/" element={<DashboardPage />} />
          {/* Mobile Purchase SubMenu route */}
          <Route path="/purchase" element={<PurchaseSubMenuPage />} />
          {/* Mobile Sales SubMenu route */}
          <Route path="/sales" element={<SalesSubMenuPage />} />
          <Route path="/account" element={<AccountSubMenuPage />} />
          <Route path="/inventory" element={<InventorySubMenuPage />} />
          <Route path="/configuration" element={<ConfigurationSubMenuPage />} />
          {PurchasePages}
          {SalesPages}
          {AccountPages}
          {ConfigurationPages}
          {InventoryPages}
          <Route path="/approval" element={<ApprovalPage />} />
          <Route
            path="/approval/purchase-order"
            element={<PurchaseOrderApproval />}
          />
          <Route
            path="/approval/purchase-payment"
            element={<PurchasePaymentApproval />}
          />
          <Route
            path="/approval/purchase-return"
            element={<PurchaseReturnApproval />}
          />
          <Route
            path="/approval/sales-order"
            element={<SalesOrderApproval />}
          />
          <Route
            path="/approval/sales-collection"
            element={<SalesCollectionApproval />}
          />
          <Route
            path="/approval/sales-return"
            element={<SalesReturnApproval />}
          />
          <Route
            path="/approval/account-journal"
            element={<AccountJournalApproval />}
          />
          <Route
            path="/approval/expense-advance"
            element={<ExpenseAdvanceApproval />}
          />
          <Route
            path="/approval/stock-adjustment"
            element={<StockAdjustmentApproval />}
          />
          {/* Mobile More Menus route */}
          <Route path="/more-menus" element={<MoreMenusPage />} />
        </Route>
      </Route>
    </Routes>
  );
}
