import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AdminLayout } from "@/components/admin-layout";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MealChart } from "@/components/meal-chart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDate, calculateTotalPeople, shortFormatDate } from "@/lib/utils";
import { MealSubmissionWithCounts } from "@shared/schema";
import { BarChart3, LineChart, PieChart, DownloadCloud, FileCog, Search } from "lucide-react";

export default function AdminReports() {
  const [startDate, setStartDate] = useState<string>(() => {
    const date = new Date();
    date.setDate(date.getDate() - 30);
    return date.toISOString().split('T')[0];
  });
  
  const [endDate, setEndDate] = useState<string>(() => {
    const date = new Date();
    return date.toISOString().split('T')[0];
  });
  
  // Fetch report data
  const { data: reportData = [], isLoading } = useQuery<MealSubmissionWithCounts[]>({
    queryKey: ["/api/reports/range", startDate, endDate],
    queryFn: async () => {
      const res = await fetch(`/api/reports/range?start=${startDate}&end=${endDate}`);
      if (!res.ok) throw new Error("Failed to fetch report data");
      return res.json();
    },
    enabled: !!startDate && !!endDate,
  });
  
  // Generate summary data
  const generateSummary = () => {
    // Group submissions by date
    const dateMap = new Map<string, any>();
    
    reportData.forEach(submission => {
      const date = new Date(submission.mealDate).toISOString().split('T')[0];
      
      if (!dateMap.has(date)) {
        dateMap.set(date, {
          date,
          breakfast: { adults: 0, children: 0, total: 0 },
          lunch: { adults: 0, children: 0, total: 0 },
          dinner: { adults: 0, children: 0, total: 0 },
          total: { adults: 0, children: 0, total: 0 },
        });
      }
      
      const dateData = dateMap.get(date);
      
      submission.counts.forEach(count => {
        if (count.mealType === 'breakfast') {
          dateData.breakfast.adults += count.adultCount;
          dateData.breakfast.children += count.childCount;
          dateData.breakfast.total += count.adultCount + count.childCount;
        } else if (count.mealType === 'lunch') {
          dateData.lunch.adults += count.adultCount;
          dateData.lunch.children += count.childCount;
          dateData.lunch.total += count.adultCount + count.childCount;
        } else if (count.mealType === 'dinner') {
          dateData.dinner.adults += count.adultCount;
          dateData.dinner.children += count.childCount;
          dateData.dinner.total += count.adultCount + count.childCount;
        }
        
        dateData.total.adults += count.adultCount;
        dateData.total.children += count.childCount;
        dateData.total.total += count.adultCount + count.childCount;
      });
    });
    
    // Convert to array and sort by date
    return Array.from(dateMap.values()).sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  };
  
  const summaryData = generateSummary();
  
  // Calculate overall totals
  const calculateOverallTotals = () => {
    let totalAdults = 0;
    let totalChildren = 0;
    let totalMeals = 0;
    let breakfastTotal = 0;
    let lunchTotal = 0;
    let dinnerTotal = 0;
    
    summaryData.forEach(day => {
      totalAdults += day.total.adults;
      totalChildren += day.total.children;
      totalMeals += day.total.total;
      breakfastTotal += day.breakfast.total;
      lunchTotal += day.lunch.total;
      dinnerTotal += day.dinner.total;
    });
    
    return {
      adults: totalAdults,
      children: totalChildren,
      meals: totalMeals,
      breakfast: breakfastTotal,
      lunch: lunchTotal,
      dinner: dinnerTotal,
      avgPerDay: summaryData.length ? Math.round(totalMeals / summaryData.length) : 0,
    };
  };
  
  const totals = calculateOverallTotals();
  
  return (
    <AdminLayout>
      <div className="p-6">
        <header className="mb-6">
          <h1 className="text-2xl font-medium text-gray-800">Reports</h1>
          <p className="text-gray-600">Analyze and export meal planning data</p>
        </header>
        
        {/* Date Range Selection */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Date Range Selection</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start-date">Start Date</Label>
                <Input 
                  id="start-date" 
                  type="date" 
                  value={startDate} 
                  onChange={(e) => setStartDate(e.target.value)} 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="end-date">End Date</Label>
                <Input 
                  id="end-date" 
                  type="date" 
                  value={endDate} 
                  onChange={(e) => setEndDate(e.target.value)} 
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline">Reset</Button>
            <Button className="gap-2">
              <Search className="h-4 w-4" />
              Generate Report
            </Button>
          </CardFooter>
        </Card>
        
        {/* Report Summary */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Report Summary</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-6">
                <p>Loading report data...</p>
              </div>
            ) : reportData.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-muted-foreground">No data available for the selected date range.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border">
                  <CardHeader className="py-4">
                    <CardTitle className="text-lg">Total Meals</CardTitle>
                  </CardHeader>
                  <CardContent className="py-2">
                    <div className="text-3xl font-bold">{totals.meals}</div>
                    <p className="text-muted-foreground mt-1">
                      {totals.adults} adults, {totals.children} children
                    </p>
                  </CardContent>
                  <CardFooter className="py-4 text-sm text-muted-foreground">
                    Average {totals.avgPerDay} meals per day
                  </CardFooter>
                </Card>
                
                <Card className="border">
                  <CardHeader className="py-4">
                    <CardTitle className="text-lg">Meal Distribution</CardTitle>
                  </CardHeader>
                  <CardContent className="py-2">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Breakfast</span>
                        <span className="font-medium">{totals.breakfast}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Lunch</span>
                        <span className="font-medium">{totals.lunch}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Dinner</span>
                        <span className="font-medium">{totals.dinner}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="py-4 text-sm text-muted-foreground">
                    For period {formatDate(startDate)} - {formatDate(endDate)}
                  </CardFooter>
                </Card>
                
                <Card className="border">
                  <CardHeader className="py-4">
                    <CardTitle className="text-lg">Export Options</CardTitle>
                  </CardHeader>
                  <CardContent className="py-2 space-y-2">
                    <Button variant="outline" className="w-full justify-start gap-2">
                      <DownloadCloud className="h-4 w-4" />
                      Export as CSV
                    </Button>
                    <Button variant="outline" className="w-full justify-start gap-2">
                      <FileCog className="h-4 w-4" />
                      Generate PDF Report
                    </Button>
                  </CardContent>
                  <CardFooter className="py-4 text-sm text-muted-foreground">
                    Data can be exported in multiple formats
                  </CardFooter>
                </Card>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Charts and Tables */}
        <Tabs defaultValue="charts">
          <TabsList className="mb-4">
            <TabsTrigger value="charts" className="gap-2">
              <BarChart3 className="h-4 w-4" />
              Charts
            </TabsTrigger>
            <TabsTrigger value="table" className="gap-2">
              <LineChart className="h-4 w-4" />
              Tabular Data
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="charts">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="mr-2 h-5 w-5" />
                    Meal Counts by Date
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="aspect-video">
                    <MealChart type="bar" data={reportData} />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <PieChart className="mr-2 h-5 w-5" />
                    Meal Type Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="aspect-video">
                    <MealChart type="pie" data={reportData} />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <LineChart className="mr-2 h-5 w-5" />
                    Meal Trend Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div style={{ height: "300px" }}>
                    <MealChart type="line" data={reportData} />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="table">
            <Card>
              <CardHeader>
                <CardTitle>Daily Meal Counts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Breakfast</TableHead>
                        <TableHead>Lunch</TableHead>
                        <TableHead>Dinner</TableHead>
                        <TableHead>Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {isLoading ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center">
                            Loading...
                          </TableCell>
                        </TableRow>
                      ) : summaryData.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center">
                            No data available
                          </TableCell>
                        </TableRow>
                      ) : (
                        summaryData.map((day, index) => (
                          <TableRow key={index}>
                            <TableCell>{shortFormatDate(day.date)}</TableCell>
                            <TableCell>
                              <div>
                                <div>Total: <span className="font-medium">{day.breakfast.total}</span></div>
                                <div className="text-sm text-muted-foreground">
                                  (A: {day.breakfast.adults}, C: {day.breakfast.children})
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div>
                                <div>Total: <span className="font-medium">{day.lunch.total}</span></div>
                                <div className="text-sm text-muted-foreground">
                                  (A: {day.lunch.adults}, C: {day.lunch.children})
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div>
                                <div>Total: <span className="font-medium">{day.dinner.total}</span></div>
                                <div className="text-sm text-muted-foreground">
                                  (A: {day.dinner.adults}, C: {day.dinner.children})
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="font-bold">
                              {day.total.total}
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="text-sm text-muted-foreground">
                  Showing {summaryData.length} days of data
                </div>
                <Button variant="outline" className="gap-2">
                  <DownloadCloud className="h-4 w-4" />
                  Export Table
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
