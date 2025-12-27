import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

const resources = {
  en: {
    translation: {
      appName: '<span style="color:#8C57FF;font-weight:bold;">CORE</span>LIUM ERP',
      dashboard: {
        filters: {
          dateRange: 'Date Range',
          today: 'Today',
          thisWeek: 'This Week',
          thisMonth: 'This Month',
          last3Months: 'Last 3 Months',
          thisYear: 'This Year',
          branch: 'Branch',
        },
        kpis: {
          totalSales: 'Total Sales',
          totalPurchases: 'Total Purchases',
          totalCollection: 'Total Collection',
          outstandingReceivable: 'Outstanding Receivable',
          outstandingPayable: 'Outstanding Payable',
          grossProfit: 'Gross Profit Margin',
          stockValue: 'Total Stock Value',
          expenses: 'Expenses (Month)',
        },
        charts: {
          salesVsPurchase: 'Sales vs Purchase (Last 6 Months)',
          topSellingItems: 'Top 5 Selling Items',
          topCustomers: 'Top 5 Customers by Sales',
          topSuppliers: 'Top 5 Suppliers by Purchase',
          expenseBreakdown: 'Expense Breakdown by Category',
          cashFlow: 'Cash Flow Overview',
        },
        lists: {
          pendingApprovals: 'Pending Approvals',
          recentInvoices: 'Recent Invoices',
          recentPurchases: 'Recent Purchases',
          lowStock: 'Low Stock Items',
          upcomingPayments: 'Upcoming Payments / Dues',
        },
      },
      auth: {
        signIn: 'Sign In',
        signUp: 'Sign Up',
        signOut: 'Sign Out',
        email: 'Email',
        password: 'Password',
        name: 'Name',
      },
      common: {
        search: 'Search',
        actions: 'Actions',
        print: 'Print',
        download: 'Download',
        save: 'Save',
        cancel: 'Cancel',
      },
      menu: {
        dashboard: 'Dashboard',
        purchase: 'Purchase',
        sales: 'Sales',
        account: 'Account',
        inventory: 'Inventory',
        configuration: 'Configuration',
        approval: 'Approval',
      },
      purchase: {
        dashboard: 'Purchase Dashboard',
        order: 'Purchase Order',
        receive: 'Purchase Receive',
        return: 'Purchase Return',
        payment: 'Purchase Payment',
        report: 'Purchase Report',
        dash: {
          filters: {
            dateRange: 'Date Range',
            supplier: 'Supplier',
            category: 'Category',
            branch: 'Branch',
          },
          kpis: {
            totalPOs: 'Total Purchase Orders',
            received: 'Received Orders',
            pending: 'Pending Orders',
            returns: 'Purchase Returns',
            spend: 'Total Spend',
            duePayments: 'Pending Payments',
            lowStock: 'Low Stock Alerts',
            leadTime: 'Avg. Lead Time',
          },
          charts: {
            trend: 'Purchase Trend (Last 6 Months)',
            topSuppliers: 'Top Suppliers by Spend',
            returnRatio: 'Purchase vs Return Ratio',
            pendingByDate: 'Pending Delivery by Date',
            spendByCategory: 'Spend by Category',
          },
          lists: {
            approvals: 'Pending Approvals',
            recentPOs: 'Recently Created POs',
            lowStock: 'Low Stock Items',
            pendingDeliveries: 'Pending Supplier Deliveries',
            duePayments: 'Due Payments to Suppliers',
            returnRequests: 'Purchase Return Requests',
          },
          actions: {
            createPO: 'Create PO',
            receivePO: 'Receive PO',
            returnItems: 'Return Items',
          }
        }
      },
      sales: {
        dashboard: 'Sales Dashboard',
        order: 'Sales Order',
        delivery: 'Sales Delivery',
        return: 'Sales Return',
        collection: 'Sales Collection',
        report: 'Sales Report',
        dash: {
          filters: {
            dateRange: 'Date Range',
            branch: 'Branch',
            salesperson: 'Salesperson',
            customerGroup: 'Customer Group',
          },
          kpis: {
            totalSales: 'Total Sales',
            totalOrders: 'Total Orders',
            delivered: 'Delivered Orders',
            pending: 'Pending Orders',
            returns: 'Sales Returns',
            collections: 'Collections Received',
            receivables: 'Outstanding Receivables',
            lowStockImpact: 'Low Stock Impact',
          },
          charts: {
            trend: 'Sales Trend (Last 6 Months)',
            topItems: 'Top Selling Items',
            topCustomers: 'Top Customers by Sales',
            deliveryStatus: 'Delivery Status Overview',
            receivableAging: 'Receivable Aging',
          },
          lists: {
            approvals: 'Pending Approvals',
            recentOrders: 'Recent Orders',
            pendingDeliveries: 'Pending Deliveries',
            recentReturns: 'Recent Returns',
            overdueReceivables: 'Overdue Receivables',
            topHighlights: 'Top Customers / Items',
          },
          actions: {
            createOrder: 'Create Sales Order',
            recordCollection: 'Record Collection',
            processReturn: 'Process Return',
          }
        }
      },
      account: {
        dashboard: 'Account Dashboard',
        coa: 'Chart Of Accounts',
        journal: 'Accounting Journal',
        expense: 'Expense/Advance',
        financial: 'Financial Report',
        other: 'Other Report',
        dash: {
          filters: {
            dateRange: 'Date Range',
            branch: 'Branch',
            accountType: 'Account Type',
            category: 'Category',
          },
          kpis: {
            cashBank: 'Total Cash / Bank Balance',
            receivables: 'Total Receivables',
            payables: 'Total Payables',
            expenses: 'Total Expenses (Month)',
            overdueReceivables: 'Overdue Receivables',
            upcomingPayments: 'Upcoming Payments (7 days)',
            netProfit: 'Net Profit (Month)',
            budgetSpend: 'Budget vs Spend',
          },
          charts: {
            revenueVsExpense: 'Monthly Revenue vs Expenses',
            receivableAging: 'Receivable Aging',
            payableAging: 'Payables Aging',
            expenseBreakdown: 'Expense Breakdown by Category',
            profitMargin: 'Profit Margin Trend',
            cashFlow: 'Cash Flow Overview',
          },
          lists: {
            approvals: 'Pending Approvals',
            recentPayments: 'Recent Payments Made',
            recentCollections: 'Recent Collections',
            overdueReceivables: 'Overdue Receivables',
            recentExpenses: 'Recent Expenses',
            budgetAlerts: 'Budget Alerts',
          },
          actions: {
            addJournal: 'Add Journal Entry',
            recordPayment: 'Record Payment',
            recordCollection: 'Record Collection',
            addExpense: 'Add Expense',
          }
        }
      },
      inventory: {
        dashboard: 'Inventory Dashboard',
        adjustment: 'Stock Adjustment',
        reports: 'Inventory Reports',
        dash: {
          filters: {
            dateRange: 'Date Range',
            warehouse: 'Warehouse',
            category: 'Category',
            itemType: 'Item Type',
            supplier: 'Supplier',
          },
          kpis: {
            totalItems: 'Total Stock Items',
            totalValue: 'Total Stock Value',
            stockInMonth: 'Stock In (Month)',
            stockOutMonth: 'Stock Out (Month)',
            lowStockItems: 'Low Stock Items',
            overstockItems: 'Overstock Items',
            adjustments: 'Stock Adjustments',
            turnoverRatio: 'Inventory Turnover Ratio',
          },
          charts: {
            stockInVsOut: 'Stock In vs Stock Out (Last 6 Months)',
            valueByCategory: 'Stock Value by Category',
            topItemsByValue: 'Top 10 Items by Stock Value',
            lowStockTrend: 'Low Stock Trend',
            warehouseStockValue: 'Warehouse-wise Stock Value',
            movementTrend: 'Stock Movement (In/Out/Transfer)',
          },
          lists: {
            lowStockAlerts: 'Low Stock Alerts',
            overstockAlerts: 'Overstock Alerts',
            nearExpiryItems: 'Near Expiry Items',
            recentAdjustments: 'Recent Stock Adjustments',
            recentTransfers: 'Recent Transfers',
            slowMovingItems: 'Top Slow-Moving Items',
          },
          actions: {
            adjustStock: 'Adjust Stock',
            addItem: 'Add New Item',
            transferStock: 'Transfer Stock',
            stockReport: 'View Stock Report',
          }
        }
      },
      configuration: {
        employee: 'Employee',
        itemProfile: 'Item Profile',
        customerProfile: 'Customer Profile',
        supplierProfile: 'Supplier Profile',
        offerSetup: 'Offer Setup',
        customerPrice: 'Customer Price Setup',
        standardPrice: 'Standard Price Setup',
      },
    },
  },
  bn: {
    translation: {
      appName: 'এসএমই সল্যুশনস',
      dashboard: {
        filters: {
          dateRange: 'তারিখ সীমা',
          today: 'আজ',
          thisWeek: 'এই সপ্তাহ',
          thisMonth: 'এই মাস',
          last3Months: 'শেষ ৩ মাস',
          thisYear: 'এই বছর',
          branch: 'শাখা',
        },
        kpis: {
          totalSales: 'মোট বিক্রয়',
          totalPurchases: 'মোট ক্রয়',
          totalCollection: 'মোট সংগ্রহ',
          outstandingReceivable: 'বকেয়া পাওনা',
          outstandingPayable: 'বকেয়া পরিশোধযোগ্য',
          grossProfit: 'গ্রস প্রফিট মার্জিন',
          stockValue: 'মোট স্টক মূল্য',
          expenses: 'ব্যয় (মাস)',
        },
        charts: {
          salesVsPurchase: 'বিক্রয় বনাম ক্রয় (শেষ ৬ মাস)',
          topSellingItems: 'শীর্ষ ৫ বিক্রিত আইটেম',
          topCustomers: 'শীর্ষ ৫ গ্রাহক (বিক্রয়)',
          topSuppliers: 'শীর্ষ ৫ সরবরাহকারী (ক্রয়)',
          expenseBreakdown: 'ব্যয়ের বিভাগভিত্তিক বিবরণ',
          cashFlow: 'ক্যাশ ফ্লো ওভারভিউ',
        },
        lists: {
          pendingApprovals: 'অপেক্ষমাণ অনুমোদন',
          recentInvoices: 'সাম্প্রতিক ইনভয়েস',
          recentPurchases: 'সাম্প্রতিক ক্রয়',
          lowStock: 'কম স্টক আইটেম',
          upcomingPayments: 'আসন্ন পেমেন্ট/বকেয়া',
        },
      },
      auth: {
        signIn: 'সাইন ইন',
        signUp: 'সাইন আপ',
        signOut: 'সাইন আউট',
        email: 'ইমেইল',
        password: 'পাসওয়ার্ড',
        name: 'নাম',
      },
      common: {
        search: 'খুঁজুন',
        actions: 'অ্যাকশন',
        print: 'প্রিন্ট',
        download: 'ডাউনলোড',
        save: 'সেভ',
        cancel: 'বাতিল',
      },
      menu: {
        dashboard: 'ড্যাশবোর্ড',
        purchase: 'ক্রয়',
        sales: 'বিক্রয়',
        account: 'হিসাব',
        inventory: 'ইনভেন্টরি',
        configuration: 'কনফিগারেশন',
        approval: 'অনুমোদন',
      },
      purchase: {
        dashboard: 'ক্রয় ড্যাশবোর্ড',
        order: 'ক্রয় অর্ডার',
        receive: 'ক্রয় রিসিভ',
        return: 'ক্রয় রিটার্ন',
        payment: 'ক্রয় পেমেন্ট',
        report: 'ক্রয় রিপোর্ট',
        dash: {
          filters: {
            dateRange: 'তারিখ সীমা',
            supplier: 'সাপ্লায়ার',
            category: 'ক্যাটাগরি',
            branch: 'শাখা',
          },
          kpis: {
            totalPOs: 'মোট ক্রয় অর্ডার',
            received: 'রিসিভড অর্ডার',
            pending: 'অপেক্ষমাণ অর্ডার',
            returns: 'ক্রয় রিটার্ন',
            spend: 'মোট ব্যয়',
            duePayments: 'অমিমাংসিত পেমেন্ট',
            lowStock: 'লো স্টক এলার্ট',
            leadTime: 'গড় লিড টাইম',
          },
          charts: {
            trend: 'ক্রয় ট্রেন্ড (শেষ ৬ মাস)',
            topSuppliers: 'ব্যয়ে শীর্ষ সাপ্লায়ার',
            returnRatio: 'ক্রয় বনাম রিটার্ন অনুপাত',
            pendingByDate: 'তারিখভিত্তিক অপেক্ষমাণ ডেলিভারি',
            spendByCategory: 'ক্যাটাগরি অনুযায়ী ব্যয়',
          },
          lists: {
            approvals: 'অপেক্ষমাণ অনুমোদন',
            recentPOs: 'সাম্প্রতিক ক্রয় অর্ডার',
            lowStock: 'লো স্টক আইটেম',
            pendingDeliveries: 'অপেক্ষমাণ সাপ্লায়ার ডেলিভারি',
            duePayments: 'সাপ্লায়ারদের বকেয়া পেমেন্ট',
            returnRequests: 'ক্রয় রিটার্ন অনুরোধ',
          },
          actions: {
            createPO: 'অর্ডার তৈরি',
            receivePO: 'অর্ডার রিসিভ',
            returnItems: 'রিটার্ন আইটেম',
          }
        }
      },
      sales: {
        dashboard: 'বিক্রয় ড্যাশবোর্ড',
        order: 'বিক্রয় অর্ডার',
        delivery: 'বিক্রয় ডেলিভারি',
        return: 'বিক্রয় রিটার্ন',
        collection: 'বিক্রয় কালেকশন',
        report: 'বিক্রয় রিপোর্ট',
        dash: {
          filters: {
            dateRange: 'তারিখ সীমা',
            branch: 'শাখা',
            salesperson: 'সেলসপারসন',
            customerGroup: 'কাস্টমার গ্রুপ',
          },
          kpis: {
            totalSales: 'মোট বিক্রয়',
            totalOrders: 'মোট অর্ডার',
            delivered: 'ডেলিভার্ড অর্ডার',
            pending: 'অপেক্ষমাণ অর্ডার',
            returns: 'বিক্রয় রিটার্ন',
            collections: 'গ্রহণকৃত কালেকশন',
            receivables: 'বকেয়া পাওনা',
            lowStockImpact: 'লো স্টক প্রভাব',
          },
          charts: {
            trend: 'বিক্রয় ট্রেন্ড (শেষ ৬ মাস)',
            topItems: 'শীর্ষ বিক্রিত আইটেম',
            topCustomers: 'শীর্ষ গ্রাহক (বিক্রয়)',
            deliveryStatus: 'ডেলিভারি স্ট্যাটাস ওভারভিউ',
            receivableAging: 'রিসিভেবল এজিং',
          },
          lists: {
            approvals: 'অপেক্ষমাণ অনুমোদন',
            recentOrders: 'সাম্প্রতিক অর্ডার',
            pendingDeliveries: 'অপেক্ষমাণ ডেলিভারি',
            recentReturns: 'সাম্প্রতিক রিটার্ন',
            overdueReceivables: 'বকেয়া রিসিভেবল',
            topHighlights: 'শীর্ষ গ্রাহক/আইটেম',
          },
          actions: {
            createOrder: 'সেলস অর্ডার তৈরি',
            recordCollection: 'কালেকশন রেকর্ড',
            processReturn: 'রিটার্ন প্রক্রিয়া',
          }
        }
      },
      account: {
        dashboard: 'হিসাব ড্যাশবোর্ড',
        coa: 'চার্ট অফ অ্যাকাউন্টস',
        journal: 'অ্যাকাউন্টিং জার্নাল',
        expense: 'খরচ/অ্যাডভান্স',
        financial: 'ফাইন্যান্সিয়াল রিপোর্ট',
        other: 'অন্যান্য রিপোর্ট',
        dash: {
          filters: {
            dateRange: 'তারিখ সীমা',
            branch: 'শাখা',
            accountType: 'অ্যাকাউন্ট টাইপ',
            category: 'ক্যাটাগরি',
          },
          kpis: {
            cashBank: 'মোট ক্যাশ/ব্যাংক ব্যালেন্স',
            receivables: 'মোট পাওনা',
            payables: 'মোট পরিশোধযোগ্য',
            expenses: 'মোট ব্যয় (মাস)',
            overdueReceivables: 'বকেয়া পাওনা',
            upcomingPayments: 'আগামী ৭ দিনের পেমেন্ট',
            netProfit: 'নেট প্রফিট (মাস)',
            budgetSpend: 'বাজেট বনাম ব্যয়',
          },
          charts: {
            revenueVsExpense: 'মাসিক রাজস্ব বনাম ব্যয়',
            receivableAging: 'রিসিভেবল এজিং',
            payableAging: 'পেয়েবল এজিং',
            expenseBreakdown: 'বিভাগভিত্তিক ব্যয়',
            profitMargin: 'প্রফিট মার্জিন ট্রেন্ড',
            cashFlow: 'ক্যাশ ফ্লো ওভারভিউ',
          },
          lists: {
            approvals: 'অপেক্ষমাণ অনুমোদন',
            recentPayments: 'সাম্প্রতিক পেমেন্ট',
            recentCollections: 'সাম্প্রতিক কালেকশন',
            overdueReceivables: 'বকেয়া পাওনা',
            recentExpenses: 'সাম্প্রতিক ব্যয়',
            budgetAlerts: 'বাজেট এলার্ট',
          },
          actions: {
            addJournal: 'জার্নাল এন্ট্রি যোগ',
            recordPayment: 'পেমেন্ট রেকর্ড',
            recordCollection: 'কালেকশন রেকর্ড',
            addExpense: 'ব্যয় যোগ',
          }
        }
      },
      inventory: {
        dashboard: 'ইনভেন্টরি ড্যাশবোর্ড',
        adjustment: 'স্টক অ্যাডজাস্টমেন্ট',
        reports: 'ইনভেন্টরি রিপোর্ট',
        dash: {
          filters: {
            dateRange: 'তারিখ সীমা',
            warehouse: 'গুদাম/ওয়্যারহাউস',
            category: 'ক্যাটাগরি',
            itemType: 'আইটেম টাইপ',
            supplier: 'সরবরাহকারী',
          },
          kpis: {
            totalItems: 'মোট স্টক আইটেম',
            totalValue: 'মোট স্টক মূল্য',
            stockInMonth: 'স্টক ইন (মাস)',
            stockOutMonth: 'স্টক আউট (মাস)',
            lowStockItems: 'লো স্টক আইটেম',
            overstockItems: 'ওভারস্টক আইটেম',
            adjustments: 'স্টক অ্যাডজাস্টমেন্ট',
            turnoverRatio: 'ইনভেন্টরি টার্নওভার রেশিও',
          },
          charts: {
            stockInVsOut: 'স্টক ইন বনাম স্টক আউট (শেষ ৬ মাস)',
            valueByCategory: 'ক্যাটাগরি অনুযায়ী স্টক মূল্য',
            topItemsByValue: 'স্টক মূল্যে শীর্ষ ১০ আইটেম',
            lowStockTrend: 'লো স্টক ট্রেন্ড',
            warehouseStockValue: 'ওয়্যারহাউসভিত্তিক স্টক মূল্য',
            movementTrend: 'স্টক মুভমেন্ট (ইন/আউট/ট্রান্সফার)',
          },
          lists: {
            lowStockAlerts: 'লো স্টক এলার্ট',
            overstockAlerts: 'ওভারস্টক এলার্ট',
            nearExpiryItems: 'শীঘ্রই মেয়াদ শেষ আইটেম',
            recentAdjustments: 'সাম্প্রতিক স্টক অ্যাডজাস্টমেন্ট',
            recentTransfers: 'সাম্প্রতিক ট্রান্সফার',
            slowMovingItems: 'শীর্ষ স্লো-মুভিং আইটেম',
          },
          actions: {
            adjustStock: 'স্টক অ্যাডজাস্ট',
            addItem: 'নতুন আইটেম যোগ',
            transferStock: 'স্টক ট্রান্সফার',
            stockReport: 'স্টক রিপোর্ট দেখুন',
          }
        }
      },
      configuration: {
        employee: 'এমপ্লয়ি',
        itemProfile: 'আইটেম প্রোফাইল',
        customerProfile: 'কাস্টমার প্রোফাইল',
        supplierProfile: 'সাপ্লায়ার প্রোফাইল',
        offerSetup: 'অফার সেটআপ',
        customerPrice: 'কাস্টমার প্রাইস সেটআপ',
        standardPrice: 'স্ট্যান্ডার্ড প্রাইস সেটআপ',
      },
    },
  },
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: false,
    interpolation: { escapeValue: false },
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    },
  })

export default i18n
