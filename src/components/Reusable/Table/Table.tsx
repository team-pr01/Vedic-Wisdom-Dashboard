/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef, useState } from "react";
import { ICONS } from "../../../assets";
import { filterData } from "../../../constants/filterData";
import NoData from "../NoData/NoData";
import LogoLoader from "../../Shared/LogoLoader/LogoLoader";
import { Pencil, Trash2 } from "lucide-react";

export type TableHead = {
  key: string;
  label: string;
  className?: string;
};

export type TableAction<T> = {
  label: any;
  onClick: (row: T) => void;
  icon?: React.ReactNode;
};

type Props<T extends Record<string, any>> = {
  title?: string;
  description?: string;
  theads: TableHead[];
  data: T[];
  actions?: TableAction<T>[];
  onEditItem?: (row: any) => any;
  onDeleteItem?: (row: any) => any;
  totalPages?: number;
  currentPage?: number;
  onPageChange?: (page: number) => void;
  isLoading?: boolean;
  onSearch?: (q: string) => void;
  selectedCity?: string | null;
  setSelectedCity?: React.Dispatch<React.SetStateAction<string>>;
  selectedArea?: string | null;
  setSelectedArea?: React.Dispatch<React.SetStateAction<string>>;
  areaOptions?: string[];
  setAreaOptions?: React.Dispatch<React.SetStateAction<string[]>>;
  limit: number;
  setLimit: React.Dispatch<React.SetStateAction<number>>;
  children?: React.ReactNode;
  className?: string;
};

// Reusable Table component
export default function Table<T extends Record<string, any>>({
  title = "",
  description = "",
  theads,
  data,
  actions = [],
  onEditItem,
  onDeleteItem,
  totalPages = 1,
  currentPage = 1,
  onPageChange,
  isLoading = false,
  onSearch,
  selectedCity,
  setSelectedCity,
  selectedArea,
  setSelectedArea,
  areaOptions,
  setAreaOptions,
  limit = 10,
  setLimit,
  children,
  className = "",
}: Props<T>) {
  const [query, setQuery] = useState("");
  const [openMenuId, setOpenMenuId] = useState<string | number | null>(null);
  const [closingMenuId, setClosingMenuId] = useState<string | number | null>(
    null,
  );
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (!openMenuId) return;

      const menu = menuRef.current;
      if (!menu) return;

      if (!menu.contains(e.target as Node)) {
        setClosingMenuId(openMenuId);
        setTimeout(() => {
          setOpenMenuId(null);
          setClosingMenuId(null);
        }, 180);
      }
    }

    function handleEsc(e: KeyboardEvent) {
      if (e.key === "Escape" && openMenuId) {
        setClosingMenuId(openMenuId);
        setTimeout(() => {
          setOpenMenuId(null);
          setClosingMenuId(null);
        }, 180);
      }
    }

    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [openMenuId]);

  useEffect(() => {
    if (!onSearch) return;
    const t = setTimeout(() => onSearch(query), 300);
    return () => clearTimeout(t);
  }, [query, onSearch]);

  const handleToggleMenu = (id: string | number) => {
    if (openMenuId === id) {
      // smooth close
      setClosingMenuId(id);
      setTimeout(() => {
        setOpenMenuId(null);
        setClosingMenuId(null);
      }, 180);
    } else {
      setOpenMenuId(id);
      setClosingMenuId(null);
    }
  };

  const goToPage = (p: number) => {
    if (!onPageChange) return;
    const page = Math.max(1, Math.min(totalPages || 1, p));
    onPageChange(page);
  };

  // For city and area/location filter
  useEffect(() => {
    if (setAreaOptions && setSelectedArea) {
      if (!selectedCity) {
        setAreaOptions([]);
        setSelectedArea(""); // reset single selected area
        return;
      }
    }

    const cityObj = filterData.cityCorporationWithLocation.find(
      (city) => city.name === selectedCity,
    );

    if (setAreaOptions) setAreaOptions(cityObj ? cityObj.locations : []);
    if (setSelectedArea) setSelectedArea("");
  }, [selectedCity]);

  const limits = [5, 10, 15, 20, 25, 30, 50, 100, 200, 500, 1000];

  return (
    <div
      className={`w-full bg-white border border-neutral-55 rounded-xl shadow-sm p-4 font-Inter ${className}`}
    >
      <div className="flex flex-col lg:flex-row items-start justify-between gap-4 mb-4">
        <div>
          {title && <h3 className="text-xl font-semibold">{title}</h3>}
          {description && (
            <p className="text-sm text-slate-500">{description}</p>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {onSearch && (
            <div>
              <input
                placeholder="Search..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="input input-sm px-3 py-2 border border-neutral-55/60 focus:border-primary-10 transition duration-300 focus:outline-none rounded-md text-sm shadow-sm w-56"
                aria-label="Search table"
              />
            </div>
          )}

          <select
            value={limit}
            onChange={(e) => setLimit(Number(e.target.value))}
            className="input input-sm px-3 py-2 border border-neutral-55/60 focus:border-primary-10 transition duration-300 focus:outline-none rounded-md text-sm shadow-sm cursor-pointer"
          >
            <option value="">Limit/Page</option>
            {limits?.map((limit) => (
              <option key={limit} value={limit}>
                {limit}
              </option>
            ))}
          </select>

          {selectedCity && (
            <select
              value={selectedCity}
              onChange={(e) =>
                setSelectedCity && setSelectedCity(e.target.value)
              }
              className="input input-sm px-3 py-2 border border-neutral-55/60 focus:border-primary-10 transition duration-300 focus:outline-none rounded-md text-sm shadow-sm cursor-pointer"
            >
              <option value="">Select City</option>
              {filterData.cityCorporationWithLocation.map((city) => (
                <option key={city.name} value={city.name}>
                  {city.name}
                </option>
              ))}
            </select>
          )}

          {selectedArea && (
            <select
              value={selectedArea}
              onChange={(e) =>
                setSelectedArea && setSelectedArea(e.target.value)
              }
              disabled={(areaOptions?.length ?? 0) === 0}
              className="input input-sm px-3 py-2 border border-neutral-55/60 focus:border-primary-10 transition duration-300 focus:outline-none rounded-md text-sm shadow-sm cursor-pointer"
            >
              <option value="">Select Area</option>
              {areaOptions?.map((area: string) => (
                <option key={area} value={area}>
                  {area}
                </option>
              ))}
            </select>
          )}

          {children && children}
        </div>
      </div>

      <div className="relative">
        {/* Loader overlay */}
        {isLoading && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/80">
            <LogoLoader />
          </div>
        )}

        <div className="overflow-x-auto rounded-md min-h-[300px]">
          <table className="min-w-full table-auto border-collapse">
            <thead className="sticky top-0 bg-white">
              <tr>
                {theads.map((th) => (
                  <th
                    key={th.key}
                    className={`p-3 text-left text-sm font-medium text-slate-600 ${
                      th.className ?? ""
                    } whitespace-nowrap border-b border-neutral-55/90`}
                  >
                    {th.label}
                  </th>
                ))}
                {actions.length > 0 && (
                  <th className="p-3 text-right text-sm font-medium text-slate-600 whitespace-nowrap border-b border-neutral-55/60">
                    Actions
                  </th>
                )}
              </tr>
            </thead>

            <tbody className="bg-white">
              {!isLoading && data.length === 0 && (
                <tr>
                  <td colSpan={theads.length + (actions.length ? 1 : 0)}>
                    <NoData />
                  </td>
                </tr>
              )}

              {data.map((row, idx) => {
                const rowId = (row.id ?? row._id ?? idx) as string | number;
                return (
                  <tr
                    key={rowId}
                    className="hover:bg-slate-50/50 transition-colors"
                  >
                    {theads.map((th) => {
                      const cellValue = row[th.key as keyof typeof row];
                      return (
                        <td
                          key={String(th.key)}
                          className="p-3 text-sm align-top whitespace-nowrap border-b border-neutral-55/60 max-w-xs overflow-hidden text-ellipsis"
                        >
                          {React.isValidElement(cellValue)
                            ? cellValue
                            : String(cellValue ?? "")}
                        </td>
                      );
                    })}

                    <td className="p-3 text-sm border-b border-neutral-55/60 relative text-right">
                      <div className="inline-block relative">
                        <button
                          onClick={() => handleToggleMenu(rowId)}
                          className="cursor-pointer"
                          aria-expanded={openMenuId === rowId}
                          aria-controls={`menu-${rowId}`}
                        >
                          <img
                            src={ICONS.threeDots}
                            alt="three-dots"
                            className="size-5"
                          />
                        </button>

                        {/* Dropdown - keep mounted for smooth transitions */}
                        <div
                          ref={openMenuId === rowId ? menuRef : null}
                          id={`menu-${rowId}`}
                          role="menu"
                          className={
                            `bg-white origin-top-right absolute right-0 mt-2 w-40 rounded-md shadow-lg transform transition-all duration-150 ease-out z-30 ` +
                            (openMenuId === rowId && closingMenuId !== rowId
                              ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
                              : openMenuId === rowId && closingMenuId === rowId
                                ? "opacity-0 scale-95 -translate-y-1 pointer-events-none"
                                : "opacity-0 scale-95 -translate-y-1 pointer-events-none")
                          }
                        >
                          <div className="py-1">
                            {onEditItem && (
                              <button
                                onClick={() => {
                                  onEditItem!(row);
                                  setClosingMenuId(rowId);
                                  setTimeout(() => {
                                    setOpenMenuId(null);
                                    setClosingMenuId(null);
                                  }, 180);
                                }}
                                className="w-full text-left px-3 py-2 text-sm hover:bg-slate-100 cursor-pointer flex items-center gap-1"
                              >
                                <Pencil className="inline mr-2 size-4" />
                                Edit
                              </button>
                            )}
                            {onDeleteItem && (
                              <button
                                onClick={() => {
                                  onDeleteItem!(row);
                                  setClosingMenuId(rowId);
                                  setTimeout(() => {
                                    setOpenMenuId(null);
                                    setClosingMenuId(null);
                                  }, 180);
                                }}
                                className="w-full text-left px-3 py-2 text-sm hover:bg-slate-100 cursor-pointer flex items-center gap-1"
                              >
                                <Trash2 className="inline mr-2 size-4" />
                                Delete
                              </button>
                            )}
                            {actions.map((act, i) => (
                              <button
                                key={i}
                                onClick={() => {
                                  act.onClick(row);
                                  setClosingMenuId(rowId);
                                  setTimeout(() => {
                                    setOpenMenuId(null);
                                    setClosingMenuId(null);
                                  }, 180);
                                }}
                                className="w-full text-left px-3 py-2 text-sm hover:bg-slate-100 cursor-pointer flex items-center gap-1"
                              >
                                {act.icon && <p>{act.icon}</p>}
                                {act.label}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="mt-3 flex justify-end items-center gap-2">
        <div className="flex items-center gap-2 text-xs lg:text-sm">
          {/* Prev Button */}
          <button
            onClick={() => goToPage((currentPage || 1) - 1)}
            disabled={currentPage <= 1}
            className={`px-3 py-1 rounded-md border border-neutral-55/60 disabled:opacity-50 disabled:cursor-not-allowed 
        ${currentPage > 1 ? "cursor-pointer bg-primary-10 text-white" : ""}`}
          >
            Prev
          </button>

          {/* Page Numbers */}
          {totalPages <= 5 ? (
            Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => goToPage(page)}
                className={`px-3 py-1 rounded-md border border-neutral-55/60 
        ${
          currentPage === page
            ? "bg-primary-10 text-white"
            : "hover:bg-primary-10 hover:text-white cursor-pointer"
        }`}
              >
                {page}
              </button>
            ))
          ) : (
            <span className="px-3 py-1 rounded-md border border-neutral-55/60">
              {currentPage} of {totalPages}
            </span>
          )}

          {/* Next Button */}
          <button
            onClick={() => goToPage((currentPage || 1) + 1)}
            disabled={currentPage >= (totalPages || 1)}
            className={`px-3 py-1 rounded-md border border-neutral-55/60 disabled:opacity-50 disabled:cursor-not-allowed 
        ${
          currentPage < totalPages
            ? "cursor-pointer bg-primary-10 text-white"
            : ""
        }`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
