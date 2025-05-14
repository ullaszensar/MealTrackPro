import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate, getStatusClass, getFormattedStatusText } from "@/lib/utils";
import { MealSubmissionWithCounts } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";

type MealHistoryTableProps = {
  submissions: MealSubmissionWithCounts[];
  isLoading: boolean;
  showStatus?: boolean;
  onStatusChange?: (id: number, status: string) => void;
};

export function MealHistoryTable({ 
  submissions, 
  isLoading,
  showStatus = false,
  onStatusChange
}: MealHistoryTableProps) {
  const [page, setPage] = useState(1);
  const pageSize = 5;
  
  // Filter and sort submissions
  const sortedSubmissions = [...submissions].sort((a, b) => 
    new Date(b.mealDate).getTime() - new Date(a.mealDate).getTime()
  );
  
  const paginatedSubmissions = sortedSubmissions.slice(
    (page - 1) * pageSize,
    page * pageSize
  );
  
  const totalPages = Math.ceil(sortedSubmissions.length / pageSize);
  
  return (
    <div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-muted">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Date</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Breakfast</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Lunch</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Dinner</th>
              {showStatus && (
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {isLoading ? (
              Array(3).fill(0).map((_, idx) => (
                <tr key={idx}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Skeleton className="h-5 w-24" />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Skeleton className="h-5 w-20" />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Skeleton className="h-5 w-20" />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Skeleton className="h-5 w-20" />
                  </td>
                  {showStatus && (
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Skeleton className="h-5 w-16" />
                    </td>
                  )}
                </tr>
              ))
            ) : paginatedSubmissions.length === 0 ? (
              <tr>
                <td colSpan={showStatus ? 5 : 4} className="px-6 py-4 text-center text-sm text-gray-500">
                  No submissions found
                </td>
              </tr>
            ) : (
              paginatedSubmissions.map(submission => {
                const breakfast = submission.counts.find(c => c.mealType === 'breakfast');
                const lunch = submission.counts.find(c => c.mealType === 'lunch');
                const dinner = submission.counts.find(c => c.mealType === 'dinner');
                
                return (
                  <tr key={submission.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(submission.mealDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {breakfast ? `A: ${breakfast.adultCount}, C: ${breakfast.childCount}` : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {lunch ? `A: ${lunch.adultCount}, C: ${lunch.childCount}` : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {dinner ? `A: ${dinner.adultCount}, C: ${dinner.childCount}` : 'N/A'}
                    </td>
                    {showStatus && (
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge className={getStatusClass(submission.status)}>
                          {getFormattedStatusText(submission.status)}
                        </Badge>
                      </td>
                    )}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      {submissions.length > pageSize && (
        <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200">
          <div className="text-sm text-gray-700">
            Showing {(page - 1) * pageSize + 1} to {Math.min(page * pageSize, submissions.length)} of {submissions.length} submissions
          </div>
          
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setPage(p => Math.max(p - 1, 1))}
              disabled={page === 1}
            >
              Previous
            </Button>
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setPage(p => Math.min(p + 1, totalPages))}
              disabled={page === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
