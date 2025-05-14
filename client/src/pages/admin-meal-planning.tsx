import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AdminLayout } from "@/components/admin-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { formatDate, shortFormatDate, getRelativeDateString } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { MealSubmissionWithCounts } from "@shared/schema";
import { PlusCircle, CalendarDays, Edit, CheckCircle, AlertTriangle } from "lucide-react";

export default function AdminMealPlanning() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const { toast } = useToast();
  
  // Query submissions for selected date
  const formattedDate = selectedDate ? selectedDate.toISOString().split('T')[0] : '';
  const { data: submissions = [], isLoading } = useQuery<MealSubmissionWithCounts[]>({
    queryKey: ["/api/meal-submissions/date", formattedDate],
    queryFn: async () => {
      if (!formattedDate) return [];
      const res = await fetch(`/api/meal-submissions/date/${formattedDate}`);
      if (!res.ok) throw new Error("Failed to fetch submissions");
      return res.json();
    },
    enabled: !!formattedDate,
  });
  
  // Calculate totals for the selected date
  const getTotals = () => {
    let total = 0;
    let adults = 0;
    let children = 0;
    let breakfast = { total: 0, adults: 0, children: 0 };
    let lunch = { total: 0, adults: 0, children: 0 };
    let dinner = { total: 0, adults: 0, children: 0 };
    
    submissions.forEach(submission => {
      submission.counts.forEach(count => {
        adults += count.adultCount;
        children += count.childCount;
        total += count.adultCount + count.childCount;
        
        if (count.mealType === 'breakfast') {
          breakfast.adults += count.adultCount;
          breakfast.children += count.childCount;
          breakfast.total += count.adultCount + count.childCount;
        } else if (count.mealType === 'lunch') {
          lunch.adults += count.adultCount;
          lunch.children += count.childCount;
          lunch.total += count.adultCount + count.childCount;
        } else if (count.mealType === 'dinner') {
          dinner.adults += count.adultCount;
          dinner.children += count.childCount;
          dinner.total += count.adultCount + count.childCount;
        }
      });
    });
    
    return { total, adults, children, breakfast, lunch, dinner };
  };
  
  const totals = getTotals();
  
  // Handle status update
  const handleStatusChange = async (id: number, status: string) => {
    try {
      await apiRequest("PATCH", `/api/meal-submissions/${id}/status`, { status });
      queryClient.invalidateQueries({ queryKey: ["/api/meal-submissions/date", formattedDate] });
      queryClient.invalidateQueries({ queryKey: ["/api/meal-submissions"] });
      toast({
        title: "Status Updated",
        description: `Submission status has been updated successfully.`,
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
  
  return (
    <AdminLayout>
      <div className="p-6">
        <header className="mb-6">
          <h1 className="text-2xl font-medium text-gray-800">Meal Planning</h1>
          <p className="text-gray-600">Manage and adjust meal counts</p>
        </header>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Calendar & Date Selection */}
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center">
                <CalendarDays className="mr-2 h-5 w-5" />
                <span>Select Date</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md border"
              />
              
              <div className="mt-6">
                <h3 className="font-medium text-lg mb-2">Date Information</h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Selected Date:</span>
                    <span className="font-medium">{selectedDate ? formatDate(selectedDate) : 'None'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Relative:</span>
                    <span className="font-medium">{selectedDate ? getRelativeDateString(selectedDate) : 'None'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Submissions:</span>
                    <span className="font-medium">{submissions.length}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Meal Summary */}
          <Card className="md:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>
                Meal Counts: {selectedDate ? formatDate(selectedDate) : 'Select a date'}
              </CardTitle>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Manually
              </Button>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-6">
                  <p>Loading meal counts...</p>
                </div>
              ) : submissions.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-muted-foreground">No meal submissions for this date.</p>
                </div>
              ) : (
                <div>
                  {/* Summary Box */}
                  <Card className="border mb-6">
                    <CardContent className="p-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <h3 className="font-medium">Overall Totals</h3>
                          <div className="mt-2 space-y-1">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Total People:</span>
                              <span className="font-bold">{totals.total}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Adults:</span>
                              <span>{totals.adults}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Children:</span>
                              <span>{totals.children}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-3">
                          <div>
                            <h4 className="font-medium">Breakfast</h4>
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">A: {totals.breakfast.adults}, C: {totals.breakfast.children}</span>
                              <span className="font-medium">{totals.breakfast.total}</span>
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="font-medium">Lunch</h4>
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">A: {totals.lunch.adults}, C: {totals.lunch.children}</span>
                              <span className="font-medium">{totals.lunch.total}</span>
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="font-medium">Dinner</h4>
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">A: {totals.dinner.adults}, C: {totals.dinner.children}</span>
                              <span className="font-medium">{totals.dinner.total}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <h3 className="font-medium">Adjustments</h3>
                          <div className="space-y-2 mt-2">
                            <div>
                              <Label htmlFor="breakfast-adjustment" className="text-sm">Breakfast Adjust</Label>
                              <Input 
                                id="breakfast-adjustment" 
                                type="number" 
                                defaultValue="0"
                                className="h-8 mt-1"
                              />
                            </div>
                            <div>
                              <Label htmlFor="lunch-adjustment" className="text-sm">Lunch Adjust</Label>
                              <Input 
                                id="lunch-adjustment" 
                                type="number" 
                                defaultValue="0"
                                className="h-8 mt-1"
                              />
                            </div>
                            <div>
                              <Label htmlFor="dinner-adjustment" className="text-sm">Dinner Adjust</Label>
                              <Input 
                                id="dinner-adjustment" 
                                type="number" 
                                defaultValue="0"
                                className="h-8 mt-1"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Submissions List */}
                  <h3 className="font-medium text-lg mb-3">Individual Submissions</h3>
                  <div className="space-y-4">
                    {submissions.map(submission => (
                      <Card key={submission.id} className="border">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-center mb-2">
                            <div className="flex items-center">
                              <h4 className="font-medium">
                                {submission.user.displayName}
                              </h4>
                              <Badge className="ml-2 capitalize">
                                {submission.status}
                              </Badge>
                            </div>
                            <div className="flex space-x-2">
                              <Button size="sm" variant="outline" className="h-8">
                                <Edit className="mr-1 h-4 w-4" />
                                Edit
                              </Button>
                              
                              {submission.status !== 'approved' && (
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  className="h-8 text-success hover:text-success"
                                  onClick={() => handleStatusChange(submission.id, 'approved')}
                                >
                                  <CheckCircle className="mr-1 h-4 w-4" />
                                  Approve
                                </Button>
                              )}
                              
                              {submission.status !== 'needs_adjustment' && (
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  className="h-8 text-warning hover:text-warning"
                                  onClick={() => handleStatusChange(submission.id, 'needs_adjustment')}
                                >
                                  <AlertTriangle className="mr-1 h-4 w-4" />
                                  Needs Adjustment
                                </Button>
                              )}
                            </div>
                          </div>
                          
                          <Separator className="my-2" />
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
                            {submission.counts.map(count => (
                              <div key={count.id}>
                                <h5 className="font-medium capitalize">{count.mealType}</h5>
                                <div className="space-y-1 mt-1">
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">Adults:</span>
                                    <span>{count.adultCount}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">Children:</span>
                                    <span>{count.childCount}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">Total:</span>
                                    <span className="font-medium">{count.adultCount + count.childCount}</span>
                                  </div>
                                </div>
                                
                                {count.specialRequirements && (
                                  <div className="mt-2">
                                    <span className="text-sm text-muted-foreground block">Special Requirements:</span>
                                    <p className="text-sm mt-1">{count.specialRequirements}</p>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                          
                          {submission.notes && (
                            <div className="mt-3 pt-3 border-t">
                              <span className="text-sm text-muted-foreground">Notes:</span>
                              <p className="mt-1 text-sm">{submission.notes}</p>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
