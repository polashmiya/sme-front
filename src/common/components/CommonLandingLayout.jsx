import { useLayoutEffect, useRef, useState } from "react";
import Button from "./Button";
import Card from "./Card";
import Header from "./Header";
import Pagination from "./Pagination";
import SearchInput from "./SearchInput";
import Table from "./Table";
import { useNavigate } from "react-router-dom";
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
  pagination = {},
}) => {
  const navigate = useNavigate();
  const [filterExpanded, setFilterExpanded] = useState(window.innerWidth > 576);
  const headerRef = useRef(null);
  const filterRef = useRef(null);
  const paginationRef = useRef(null);
  const [tableMaxHeight, setTableMaxHeight] = useState(undefined);

  useLayoutEffect(() => {
    const headerHeight = headerRef.current?.offsetHeight || 0;
    const filterHeight = filterRef.current?.offsetHeight || 0;
    const paginationHeight = paginationRef.current?.offsetHeight || 0;
    const extraSpacing = 24;
    const totalOccupied =
      headerHeight + filterHeight + paginationHeight + extraSpacing;
    setTableMaxHeight(`calc(100vh - ${totalOccupied}px)`);
  }, [headerButtons, showSearch, filters, pagination]);

  return (
    <div
      className="common-landing-layout flex flex-col h-full min-h-screen bg-white sm:bg-transparent sm:h-auto sm:min-h-0"
      style={{ height: `calc(100vh - 64px - 24px)`, overflow: "hidden" }}
    >
      <div ref={headerRef} className="flex flex-col gap-2 pt-2 sm:px-0 sm:pt-0">
        <Header
          title={title}
          onBack={
            typeof window !== "undefined" && window.innerWidth <= 576
              ? () => navigate(-1)
              : undefined
          }
          right={
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              {showSearch && (
                <SearchInput
                  placeholder={searchPlaceholder}
                  onSearch={onSearch}
                  className="w-full sm:w-auto"
                />
              )}
              {headerButtons.map((btn) => (
                <Button
                  key={btn.label || btn.id}
                  {...btn}
                  className="w-full sm:w-auto"
                >
                  {btn.label}
                </Button>
              ))}
            </div>
          }
        />
      </div>

      {filters && (
        <div
          ref={filterRef}
          className="w-full sm:px-0 mt-2 "
          style={{ marginBottom: "2px" }}
        >
          <Card className="w-full">
            <div className="sm:hidden flex justify-between items-center mb-2">
              <span className="font-semibold text-base">Filters</span>
              <button
                className="text-blue-600 text-sm px-2 py-1 rounded focus:outline-none flex items-center gap-1"
                onClick={() => setFilterExpanded((prev) => !prev)}
              >
                {filterExpanded ? "Collapse" : "Expand"}
                {filterExpanded ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20 12H4"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                )}
              </button>
            </div>
            <div
              className={
                window.innerWidth > 576 ? "" : !filterExpanded ? "hidden" : ""
              }
            >
              {(() => {
                if (typeof filters === "function") {
                  return filters({ onChange: onFilterChange });
                }
                if (Array.isArray(filters)) {
                  return filters.map((FilterComp, i) => (
                    <FilterComp
                      key={FilterComp.displayName || FilterComp.name || i}
                      onChange={onFilterChange}
                    />
                  ));
                }
                return filters;
              })()}
            </div>
          </Card>
        </div>
      )}

      {/* <div className="flex-1 w-full px-2 sm:px-0"> */}
      <Table
        columns={tableColumns}
        data={tableData}
        maxHeight={tableMaxHeight}
      />
      {/* </div> */}

      {pagination && (
        <div
          ref={paginationRef}
          className="pagination-section flex justify-center mt-3 px-2 sm:px-0"
        >
          <Pagination
            current={pagination.current || 1}
            total={pagination.total || 1}
            pageSize={pagination.pageSize || 10}
            onChange={pagination.onChange}
            className={pagination.className || ""}
            showTotal={
              typeof pagination.showTotal === "boolean"
                ? pagination.showTotal
                : true
            }
            pageSizeOptions={
              pagination.pageSizeOptions || [10, 20, 50, 100, 500, 1000]
            }
            onPageSizeChange={pagination.onPageSizeChange}
          />
        </div>
      )}
    </div>
  );
};

export default CommonLandingLayout;
