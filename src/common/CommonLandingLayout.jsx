import React from "react";
import Header from "./Header";
import SearchInput from "./SearchInput";
import Button from "./Button";
import Table from "./Table";
import Pagination from "./Pagination";
import Card from "./Card";

/**
 * CommonLandingLayout
 * Props:
 * - title: string
 * - headerButtons: array of { label, onClick, ... }
 * - showSearch: boolean
 * - onSearch: function
 * - searchPlaceholder: string
 * - filters: React node or array of filter configs
 * - onFilterChange: function
 * - tableColumns: array
 * - tableData: array
 * - tableActions: array of { label, onClick, ... }
 * - pagination: { currentPage, totalPages, onPageChange }
 */
const CommonLandingLayout = ({
  title,
  headerButtons = [],
  showSearch = false,
  onSearch,
  searchPlaceholder = "Search...",
  filters,
  onFilterChange,
  tableColumns = [],
  tableData = [],
  tableActions = [],
  pagination = {},
}) => {
  return (
    <div className="common-landing-layout flex flex-col">
      {/* Header Section */}
      <div className="flex flex-col gap-2">
        <Header title={title} right={<>{showSearch && (
            <SearchInput
              placeholder={searchPlaceholder}
              onSearch={onSearch}
            />
          )}
          {headerButtons.map((btn, idx) => (
            <Button key={idx} {...btn} />
          ))}</>}/>
       
      </div>

      {/* Filter Section */}
      {filters && (
        <Card>
          {typeof filters === "function"
            ? filters({ onChange: onFilterChange })
            : Array.isArray(filters)
            ? filters.map((FilterComp, idx) => (
                <FilterComp key={idx} onChange={onFilterChange} />
              ))
            : filters}
        </Card>
      )}

      {/* Table Section */}
        <Table columns={tableColumns} data={tableData} actions={tableActions} />

      {/* Pagination Section */}
      {pagination && (
        <div className="pagination-section flex justify-center mt-3">
          <Pagination
            current={pagination.current || 1}
            total={pagination.total || 1}
            pageSize={pagination.pageSize || 10}
            onChange={pagination.onChange}
            className={pagination.className || ""}
            showTotal={pagination.showTotal !== undefined ? pagination.showTotal : true}
            pageSizeOptions={pagination.pageSizeOptions || [10, 20, 50, 100, 500, 1000]}
            onPageSizeChange={pagination.onPageSizeChange}
          />
        </div>
      )}
    </div>
  );
};

export default CommonLandingLayout;
