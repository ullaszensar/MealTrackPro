import { useEffect, useRef } from "react";
import { Chart, registerables } from "chart.js";
import { MealSubmissionWithCounts } from "@shared/schema";

// Register all Chart.js components
Chart.register(...registerables);

type MealChartProps = {
  type: "line" | "bar" | "pie";
  data: MealSubmissionWithCounts[];
};

export function MealChart({ type, data }: MealChartProps) {
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;
    
    // Destroy previous chart if it exists
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }
    
    const ctx = chartRef.current.getContext("2d");
    if (!ctx) return;
    
    // Prepare data based on chart type
    if (type === "pie") {
      createPieChart(ctx);
    } else if (type === "bar") {
      createBarChart(ctx);
    } else if (type === "line") {
      createLineChart(ctx);
    }
    
    // Cleanup function
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [type, data]);
  
  const createPieChart = (ctx: CanvasRenderingContext2D) => {
    // Count meals by type
    let breakfast = 0;
    let lunch = 0;
    let dinner = 0;
    
    data.forEach(submission => {
      submission.counts.forEach(count => {
        const total = count.adultCount + count.childCount;
        if (count.mealType === 'breakfast') breakfast += total;
        if (count.mealType === 'lunch') lunch += total;
        if (count.mealType === 'dinner') dinner += total;
      });
    });
    
    chartInstance.current = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: ['Breakfast', 'Lunch', 'Dinner'],
        datasets: [{
          data: [breakfast, lunch, dinner],
          backgroundColor: [
            'hsl(var(--chart-1))',
            'hsl(var(--chart-2))',
            'hsl(var(--chart-3))'
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'right',
          },
          title: {
            display: true,
            text: 'Meal Type Distribution'
          }
        }
      }
    });
  };
  
  const createBarChart = (ctx: CanvasRenderingContext2D) => {
    // Group data by date
    const dateMap = new Map<string, {
      breakfast: number;
      lunch: number;
      dinner: number;
    }>();
    
    data.forEach(submission => {
      const date = new Date(submission.mealDate).toISOString().split('T')[0];
      
      if (!dateMap.has(date)) {
        dateMap.set(date, { breakfast: 0, lunch: 0, dinner: 0 });
      }
      
      const dateData = dateMap.get(date)!;
      
      submission.counts.forEach(count => {
        const total = count.adultCount + count.childCount;
        if (count.mealType === 'breakfast') dateData.breakfast += total;
        if (count.mealType === 'lunch') dateData.lunch += total;
        if (count.mealType === 'dinner') dateData.dinner += total;
      });
    });
    
    // Convert to arrays for chart
    const dates: string[] = [];
    const breakfastData: number[] = [];
    const lunchData: number[] = [];
    const dinnerData: number[] = [];
    
    // Sort by date
    const sortedDates = Array.from(dateMap.keys()).sort();
    
    sortedDates.forEach(date => {
      const data = dateMap.get(date)!;
      dates.push(new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
      breakfastData.push(data.breakfast);
      lunchData.push(data.lunch);
      dinnerData.push(data.dinner);
    });
    
    chartInstance.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: dates,
        datasets: [
          {
            label: 'Breakfast',
            data: breakfastData,
            backgroundColor: 'hsl(var(--chart-1))',
            borderColor: 'hsl(var(--chart-1))',
            borderWidth: 1
          },
          {
            label: 'Lunch',
            data: lunchData,
            backgroundColor: 'hsl(var(--chart-2))',
            borderColor: 'hsl(var(--chart-2))',
            borderWidth: 1
          },
          {
            label: 'Dinner',
            data: dinnerData,
            backgroundColor: 'hsl(var(--chart-3))',
            borderColor: 'hsl(var(--chart-3))',
            borderWidth: 1
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            stacked: false,
          },
          y: {
            stacked: false,
            beginAtZero: true
          }
        },
        plugins: {
          title: {
            display: true,
            text: 'Meal Counts by Date'
          },
          legend: {
            position: 'top',
          }
        }
      }
    });
  };
  
  const createLineChart = (ctx: CanvasRenderingContext2D) => {
    // Group data by date for trend
    const dateMap = new Map<string, {
      total: number;
      adults: number;
      children: number;
    }>();
    
    data.forEach(submission => {
      const date = new Date(submission.mealDate).toISOString().split('T')[0];
      
      if (!dateMap.has(date)) {
        dateMap.set(date, { total: 0, adults: 0, children: 0 });
      }
      
      const dateData = dateMap.get(date)!;
      
      submission.counts.forEach(count => {
        dateData.adults += count.adultCount;
        dateData.children += count.childCount;
        dateData.total += count.adultCount + count.childCount;
      });
    });
    
    // Convert to arrays for chart
    const dates: string[] = [];
    const totalData: number[] = [];
    const adultData: number[] = [];
    const childData: number[] = [];
    
    // Sort by date
    const sortedDates = Array.from(dateMap.keys()).sort();
    
    sortedDates.forEach(date => {
      const data = dateMap.get(date)!;
      dates.push(new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
      totalData.push(data.total);
      adultData.push(data.adults);
      childData.push(data.children);
    });
    
    chartInstance.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: dates,
        datasets: [
          {
            label: 'Total',
            data: totalData,
            borderColor: 'hsl(var(--chart-1))',
            backgroundColor: 'transparent',
            tension: 0.3
          },
          {
            label: 'Adults',
            data: adultData,
            borderColor: 'hsl(var(--chart-2))',
            backgroundColor: 'transparent',
            tension: 0.3
          },
          {
            label: 'Children',
            data: childData,
            borderColor: 'hsl(var(--chart-3))',
            backgroundColor: 'transparent',
            tension: 0.3
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true
          }
        },
        plugins: {
          title: {
            display: true,
            text: 'Meal Count Trends'
          },
          legend: {
            position: 'top',
          }
        }
      }
    });
  };

  return <canvas ref={chartRef} />;
}
