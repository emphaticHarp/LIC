"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface PaginatedTableProps {
  title: string;
  description?: string;
  data: any[];
  columns: {
    key: string;
    label: string;
    render?: (value: any, row: any) => React.ReactNode;
  }[];
  itemsPerPage?: number;
  isLoading?: boolean;
}

export function PaginatedTable({
  title,
  description,
  data,
  columns,
  itemsPerPage = 10,
  isLoading = false,
}: PaginatedTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = data.slice(startIndex, endIndex);

  // Reset to page 1 when data changes
  useEffect(() => {
    setCurrentPage(1);
  }, [data]);

  const getPaginationItems = () => {
    const items = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        items.push(i);
      }
    } else {
      items.push(1);

      if (currentPage > 3) {
        items.push("...");
      }

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        if (!items.includes(i)) {
          items.push(i);
        }
      }

      if (currentPage < totalPages - 2) {
        items.push("...");
      }

      items.push(totalPages);
    }

    return items;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg sm:text-xl">{title}</CardTitle>
        {description && <CardDescription className="text-sm">{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <div className="w-full">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                {columns.map((column) => (
                  <th
                    key={column.key}
                    className="text-left py-3 px-2 sm:px-4 font-semibold text-gray-700 text-xs sm:text-sm"
                  >
                    {column.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: itemsPerPage }).map((_, idx) => (
                  <tr key={idx} className="border-b border-gray-100">
                    {columns.map((column) => (
                      <td key={column.key} className="py-3 px-2 sm:px-4">
                        <Skeleton className="h-4 w-24" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : currentData.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="py-8 px-2 sm:px-4 text-center text-gray-500">
                    No data available
                  </td>
                </tr>
              ) : (
                currentData.map((row, idx) => (
                  <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                    {columns.map((column) => (
                      <td key={column.key} className="py-3 px-2 sm:px-4 text-xs sm:text-sm truncate">
                        {column.render
                          ? column.render(row[column.key], row)
                          : row[column.key]}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-600">
              Showing {startIndex + 1} to {Math.min(endIndex, data.length)} of {data.length} results
            </p>

            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className={currentPage === 1 ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
                  />
                </PaginationItem>

                {getPaginationItems().map((page, idx) => (
                  <PaginationItem key={idx}>
                    {page === "..." ? (
                      <PaginationEllipsis />
                    ) : (
                      <PaginationLink
                        onClick={() => setCurrentPage(page as number)}
                        isActive={currentPage === page}
                        className="cursor-pointer"
                      >
                        {page}
                      </PaginationLink>
                    )}
                  </PaginationItem>
                ))}

                <PaginationItem>
                  <PaginationNext
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className={currentPage === totalPages ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
