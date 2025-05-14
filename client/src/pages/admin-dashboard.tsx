import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AdminLayout } from "@/components/admin-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatsCard } from "@/components/stats-card";
import { MealChart } from "@/components/meal-chart";
import { MealHistoryTable } from "@/components/meal-history-table";
import { Badge } from "@/components/ui/badge";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { MealSubmissionWithCounts } from "@shared/schema";
import { formatDate, getStatusClass, getFormattedStatusText } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { ArrowUp, ArrowDown, ChevronLeft, ChevronRight, BarChart3, PieChart, Users, Coffee, UtensilsCrossed, Wine } from "lucide-react";

export default function AdminDashboard() {
  const { toast } = useToast();
  const [page, setPage] = useState(1);
  const pageSize = 10;
  
  // Fetch latest submissions
  const { 
    data: allSubmissions = [], 
    isLoading 
  } = useQuery<MealSubmissionWithCounts[]>({
    queryKey: ["/api/meal-submissions"],
  });
  
  // Calculate statistics for dashboard
  const getTotalStats = () => {
    let breakfast = 0;
    let lunch = 0;
    let dinner = 0;
    let total = 0;
    
    // Only calculate for tomorrow's meals
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowString = tomorrow.toISOString().split('T')[0];
    
    allSubmissions.forEach(submission => {
      const submissionDate = new Date(submission.mealDate).toISOString().split('T')[0];
      
      if (submissionDate === tomorrowString) {
        submission.counts.forEach(count => {
          const mealTotal = count.adultCount + count.childCount;
          total += mealTotal;
          
          if (count.mealType === 'breakfast') {
            breakfast += mealTotal;
          } else if (count.mealType === 'lunch') {
            lunch += mealTotal;
          } else if (count.mealType === 'dinner') {
            dinner += mealTotal;
          }
        });
      }
    });
    
    return { total, breakfast, lunch, dinner };
  };
  
  const stats = getTotalStats();
  
  // Handle approve/reject submission
  const handleStatusChange = async (id: number, status: string) => {
    try {
      await apiRequest("PATCH", `/api/meal-submissions/${id}/status`, { status });
      queryClient.invalidateQueries({ queryKey: ["/api/meal-submissions"] });
      toast({
        title: "Status Updated",
        description: `Submission has been marked as ${getFormattedStatusText(status)}`,
        variant: "default",
      });
    } catch (error) {
      console.error("Status update error:", error);
      toast({
        title: "Error",
        description: "Failed to update status. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  // Filter submissions for the table
  const sortedSubmissions = [...allSubmissions].sort((a, b) => 
    new Date(b.submissionDate).getTime() - new Date(a.submissionDate).getTime()
  );
  
  const paginatedSubmissions = sortedSubmissions.slice(
    (page - 1) * pageSize,
    page * pageSize
  );
  
  const totalPages = Math.ceil(sortedSubmissions.length / pageSize);
  
  // Handle pagination
  const nextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };
  
  const prevPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };
  
  return (
    <AdminLayout>
      <div className="p-6">
        <header className="mb-6">
          <h1 className="text-2xl font-medium text-gray-800">Dashboard</h1>
          <p className="text-gray-600">Overview of meal planning system</p>
        </header>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard 
            title="Total People"
            value={stats.total}
            icon={<Users className="h-5 w-5" />}
            iconBgClass="bg-primary/10"
            iconClass="text-primary"
            trend={
              <div className="mt-4 flex items-center text-success text-sm">
                <ArrowUp className="h-4 w-4 mr-1" />
                <span>5% from yesterday</span>
              </div>
            }
          />
          
          <StatsCard 
            title="Breakfast"
            value={stats.breakfast}
            icon={<Coffee className="h-5 w-5" />}
            iconBgClass="bg-secondary/10"
            iconClass="text-secondary"
            trend={
              <div className="mt-4 flex items-center text-destructive text-sm">
                <ArrowDown className="h-4 w-4 mr-1" />
                <span>2% from yesterday</span>
              </div>
            }
          />
          
          <StatsCard 
            title="Lunch"
            value={stats.lunch}
            icon={<UtensilsCrossed className="h-5 w-5" />}
            iconBgClass="bg-info/10"
            iconClass="text-info"
            trend={
              <div className="mt-4 flex items-center text-success text-sm">
                <ArrowUp className="h-4 w-4 mr-1" />
                <span>8% from yesterday</span>
              </div>
            }
          />
          
          <StatsCard 
            title="Dinner"
            value={stats.dinner}
            icon={<Wine className="h-5 w-5" />}
            iconBgClass="bg-warning/10"
            iconClass="text-warning"
            trend={
              <div className="mt-4 flex items-center text-success text-sm">
                <ArrowUp className="h-4 w-4 mr-1" />
                <span>3% from yesterday</span>
              </div>
            }
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-800">Meal Trends (7-Day)</h3>
              <Button variant="ghost" size="sm">
                <BarChart3 className="h-4 w-4" />
              </Button>
            </div>
            <CardContent className="p-6">
              <div className="aspect-video">
                <MealChart type="line" data={allSubmissions} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-800">Meal Distribution</h3>
              <Button variant="ghost" size="sm">
                <PieChart className="h-4 w-4" />
              </Button>
            </div>
            <CardContent className="p-6">
              <div className="aspect-video">
                <MealChart type="pie" data={allSubmissions} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Latest Submissions */}
        <Card className="mb-8">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-800">Latest Submissions</h3>
            <Button>Export Data</Button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-muted">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Submitted By</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Date</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Breakfast</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Lunch</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Dinner</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {isLoading ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-4 text-center">Loading...</td>
                  </tr>
                ) : paginatedSubmissions.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-4 text-center">No submissions found</td>
                  </tr>
                ) : (
                  paginatedSubmissions.map(submission => {
                    const breakfast = submission.counts.find(c => c.mealType === 'breakfast');
                    const lunch = submission.counts.find(c => c.mealType === 'lunch');
                    const dinner = submission.counts.find(c => c.mealType === 'dinner');
                    
                    return (
                      <tr key={submission.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {submission.user.displayName}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
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
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge className={getStatusClass(submission.status)}>
                            {getFormattedStatusText(submission.status)}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <Button variant="link" className="h-auto p-0">Edit</Button>
                            
                            {submission.status !== 'approved' && (
                              <Button 
                                variant="link" 
                                className="h-auto p-0 text-success" 
                                onClick={() => handleStatusChange(submission.id, 'approved')}
                              >
                                Approve
                              </Button>
                            )}
                            
                            {submission.status !== 'needs_adjustment' && (
                              <Button 
                                variant="link" 
                                className="h-auto p-0 text-warning" 
                                onClick={() => handleStatusChange(submission.id, 'needs_adjustment')}
                              >
                                Needs Adjustment
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <span className="text-sm text-gray-700">
              Showing {Math.min((page - 1) * pageSize + 1, sortedSubmissions.length)} to {Math.min(page * pageSize, sortedSubmissions.length)} of {sortedSubmissions.length} submissions
            </span>
            <div className="flex-1 flex justify-center sm:justify-end">
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                <Button 
                  variant="outline" 
                  className="rounded-l-md"
                  onClick={prevPage} 
                  disabled={page === 1}
                >
                  <span className="sr-only">Previous</span>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                
                {Array.from({ length: Math.min(totalPages, 3) }).map((_, idx) => {
                  const pageNumber = page <= 2 ? idx + 1 : page - 1 + idx;
                  if (pageNumber > totalPages) return null;
                  
                  return (
                    <Button 
                      key={pageNumber}
                      variant={pageNumber === page ? "default" : "outline"}
                      className={`${pageNumber === page ? 'bg-primary text-white' : 'bg-white'}`}
                      onClick={() => setPage(pageNumber)}
                    >
                      {pageNumber}
                    </Button>
                  );
                })}
                
                <Button 
                  variant="outline" 
                  className="rounded-r-md"
                  onClick={nextPage} 
                  disabled={page === totalPages}
                >
                  <span className="sr-only">Next</span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </nav>
            </div>
          </div>
        </Card>

        {/* Special Requirements Summary */}
        <Card>
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-800">Special Dietary Requirements</h3>
          </div>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {["breakfast", "lunch", "dinner"].map((mealType) => (
                <Card key={mealType} className="border border-gray-200">
                  <CardContent className="p-4">
                    <h4 className="font-medium text-gray-800 mb-2 capitalize">{mealType}</h4>
                    <ul className="space-y-2 text-sm">
                      {getDietaryRequirements(allSubmissions, mealType).map((item, idx) => (
                        <li key={idx} className="flex justify-between">
                          <span>{item.type}</span>
                          <span className="font-medium">{item.count}</span>
                        </li>
                      ))}
                      {getDietaryRequirements(allSubmissions, mealType).length === 0 && (
                        <li className="text-muted-foreground">No special requirements</li>
                      )}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}

function getDietaryRequirements(submissions: MealSubmissionWithCounts[], mealType: string) {
  // This function would parse the special requirements text from submissions
  // For now, we'll return some example data
  const commonRequirements = [
    { type: "Vegetarian", count: mealType === "breakfast" ? 8 : mealType === "lunch" ? 10 : 12 },
    { type: "Gluten-free", count: mealType === "breakfast" ? 3 : mealType === "lunch" ? 5 : 4 },
    { type: "Dairy-free", count: mealType === "breakfast" ? 4 : mealType === "lunch" ? 6 : 5 },
    { type: "Nut allergy", count: mealType === "breakfast" ? 2 : mealType === "lunch" ? 3 : 2 },
  ];
  
  return commonRequirements;
}
