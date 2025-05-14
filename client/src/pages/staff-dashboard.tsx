import { useEffect, useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { StaffLayout } from "@/components/staff-layout";
import { getTomorrowDate } from "@/lib/utils";
import { MealForm } from "@/components/meal-form";
import { MealHistoryTable } from "@/components/meal-history-table";
import { useToast } from "@/hooks/use-toast";
import { SuccessModal } from "@/components/success-modal";
import { CreateMealSubmission } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";

export default function StaffDashboard() {
  const { toast } = useToast();
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  
  // Get meal submissions for staff
  const { data: mealSubmissions, isLoading, refetch } = useQuery({
    queryKey: ["/api/meal-submissions"],
  });

  // Create meal submission mutation
  const mutation = useMutation({
    mutationFn: async (data: CreateMealSubmission) => {
      const response = await apiRequest("POST", "/api/meal-submissions", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Meal counts have been submitted",
        variant: "default",
      });
      setIsSuccessModalOpen(true);
      refetch();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to submit meal counts. Please try again.",
        variant: "destructive",
      });
      console.error("Submit error:", error);
    },
  });

  const handleFormSubmit = (data: CreateMealSubmission) => {
    mutation.mutate(data);
  };

  const closeSuccessModal = () => {
    setIsSuccessModalOpen(false);
  };

  return (
    <StaffLayout>
      <div className="container mx-auto px-4 py-6">
        {/* Date Selection & Meal Count Form */}
        <div className="mb-6">
          <h2 className="text-xl font-medium text-gray-800 mb-4">Submit Meal Counts</h2>
          <MealForm 
            onSubmit={handleFormSubmit} 
            isSubmitting={mutation.isPending} 
            defaultDate={getTomorrowDate()}
          />
        </div>
        
        {/* Previous Submissions */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-800">Recent Submissions</h3>
          </div>
          <MealHistoryTable 
            submissions={mealSubmissions || []} 
            isLoading={isLoading}
            showStatus={true}
          />
        </div>
      </div>
      
      <SuccessModal
        isOpen={isSuccessModalOpen}
        onClose={closeSuccessModal}
        title="Submission Successful"
        description="Your meal counts have been successfully submitted."
      />
    </StaffLayout>
  );
}
