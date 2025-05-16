import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createMealSubmissionSchema, type CreateMealSubmission } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

type MealFormProps = {
  onSubmit: (data: CreateMealSubmission) => void;
  isSubmitting: boolean;
  defaultDate: string;
};

export function MealForm({ onSubmit, isSubmitting, defaultDate }: MealFormProps) {
  const { toast } = useToast();
  
  // Set up form with validation schema
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateMealSubmission>({
    resolver: zodResolver(createMealSubmissionSchema),
    defaultValues: {
      mealDate: defaultDate,
      breakfast: {
        adultCount: 0,
        childCount: 0,
        specialRequirements: "",
      },
      lunch: {
        adultCount: 0,
        childCount: 0,
        specialRequirements: "",
      },
      tea: {
        adultCount: 0,
        childCount: 0,
        specialRequirements: "",
      },
      dinner: {
        adultCount: 0,
        childCount: 0,
        specialRequirements: "",
      },
      supper: {
        adultCount: 0,
        childCount: 0,
        specialRequirements: "",
      },
      notes: "",
    },
  });
  
  const onFormSubmit = (data: CreateMealSubmission) => {
    // Validate the date is for tomorrow or later
    const selectedDate = new Date(data.mealDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate <= today) {
      toast({
        title: "Invalid Date",
        description: "Please select tomorrow or a future date for meal planning.",
        variant: "destructive",
      });
      return;
    }
    
    onSubmit(data);
  };
  
  return (
    <div className="bg-white rounded-lg shadow mb-6">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-800">Meal Counts</h3>
      </div>
      <div className="p-6">
        <form onSubmit={handleSubmit(onFormSubmit)}>
          {/* Date Selection */}
          <div className="bg-white rounded-lg mb-6">
            <Label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="mealDate">
              Select Date for Meal Planning
            </Label>
            <Input
              type="date"
              id="mealDate"
              {...register("mealDate")}
              min={defaultDate}
              className="w-full"
            />
            {errors.mealDate && (
              <p className="text-sm text-destructive mt-1">{errors.mealDate.message}</p>
            )}
            <p className="text-sm text-gray-600 mt-2">
              Please submit counts for meals. After 10 PM, you can only submit for the day after tomorrow or later.
              You can only make one submission per day.
            </p>
          </div>
          
          {/* Breakfast Section */}
          <div className="mb-6 pb-6 border-b border-gray-200">
            <h4 className="text-md font-medium text-gray-800 mb-4">Breakfast</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <Label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="breakfast.adultCount">
                  Adult Count
                </Label>
                <Input
                  type="number"
                  id="breakfast.adultCount"
                  min="0"
                  {...register("breakfast.adultCount", { valueAsNumber: true })}
                />
                {errors.breakfast?.adultCount && (
                  <p className="text-sm text-destructive mt-1">{errors.breakfast.adultCount.message}</p>
                )}
              </div>
              
              <div>
                <Label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="breakfast.childCount">
                  Child Count
                </Label>
                <Input
                  type="number"
                  id="breakfast.childCount"
                  min="0"
                  {...register("breakfast.childCount", { valueAsNumber: true })}
                />
                {errors.breakfast?.childCount && (
                  <p className="text-sm text-destructive mt-1">{errors.breakfast.childCount.message}</p>
                )}
              </div>
            </div>
            
            <div>
              <Label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="breakfast.specialRequirements">
                Special Dietary Requirements
              </Label>
              <Textarea
                id="breakfast.specialRequirements"
                rows={2}
                placeholder="e.g., 2 vegetarian, 1 gluten-free"
                {...register("breakfast.specialRequirements")}
              />
            </div>
          </div>
          
          {/* Lunch Section */}
          <div className="mb-6 pb-6 border-b border-gray-200">
            <h4 className="text-md font-medium text-gray-800 mb-4">Lunch</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <Label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="lunch.adultCount">
                  Adult Count
                </Label>
                <Input
                  type="number"
                  id="lunch.adultCount"
                  min="0"
                  {...register("lunch.adultCount", { valueAsNumber: true })}
                />
                {errors.lunch?.adultCount && (
                  <p className="text-sm text-destructive mt-1">{errors.lunch.adultCount.message}</p>
                )}
              </div>
              
              <div>
                <Label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="lunch.childCount">
                  Child Count
                </Label>
                <Input
                  type="number"
                  id="lunch.childCount"
                  min="0"
                  {...register("lunch.childCount", { valueAsNumber: true })}
                />
                {errors.lunch?.childCount && (
                  <p className="text-sm text-destructive mt-1">{errors.lunch.childCount.message}</p>
                )}
              </div>
            </div>
            
            <div>
              <Label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="lunch.specialRequirements">
                Special Dietary Requirements
              </Label>
              <Textarea
                id="lunch.specialRequirements"
                rows={2}
                placeholder="e.g., 2 vegetarian, 1 gluten-free"
                {...register("lunch.specialRequirements")}
              />
            </div>
          </div>
          
          {/* Tea Section */}
          <div className="mb-6 pb-6 border-b border-gray-200">
            <h4 className="text-md font-medium text-gray-800 mb-4">Tea</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <Label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="tea.adultCount">
                  Adult Count
                </Label>
                <Input
                  type="number"
                  id="tea.adultCount"
                  min="0"
                  {...register("tea.adultCount", { valueAsNumber: true })}
                />
                {errors.tea?.adultCount && (
                  <p className="text-sm text-destructive mt-1">{errors.tea.adultCount.message}</p>
                )}
              </div>
              
              <div>
                <Label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="tea.childCount">
                  Child Count
                </Label>
                <Input
                  type="number"
                  id="tea.childCount"
                  min="0"
                  {...register("tea.childCount", { valueAsNumber: true })}
                />
                {errors.tea?.childCount && (
                  <p className="text-sm text-destructive mt-1">{errors.tea.childCount.message}</p>
                )}
              </div>
            </div>
            
            <div>
              <Label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="tea.specialRequirements">
                Special Dietary Requirements
              </Label>
              <Textarea
                id="tea.specialRequirements"
                rows={2}
                placeholder="e.g., 2 vegetarian, 1 gluten-free"
                {...register("tea.specialRequirements")}
              />
            </div>
          </div>
          
          {/* Dinner Section */}
          <div className="mb-6 pb-6 border-b border-gray-200">
            <h4 className="text-md font-medium text-gray-800 mb-4">Dinner</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <Label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="dinner.adultCount">
                  Adult Count
                </Label>
                <Input
                  type="number"
                  id="dinner.adultCount"
                  min="0"
                  {...register("dinner.adultCount", { valueAsNumber: true })}
                />
                {errors.dinner?.adultCount && (
                  <p className="text-sm text-destructive mt-1">{errors.dinner.adultCount.message}</p>
                )}
              </div>
              
              <div>
                <Label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="dinner.childCount">
                  Child Count
                </Label>
                <Input
                  type="number"
                  id="dinner.childCount"
                  min="0"
                  {...register("dinner.childCount", { valueAsNumber: true })}
                />
                {errors.dinner?.childCount && (
                  <p className="text-sm text-destructive mt-1">{errors.dinner.childCount.message}</p>
                )}
              </div>
            </div>
            
            <div>
              <Label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="dinner.specialRequirements">
                Special Dietary Requirements
              </Label>
              <Textarea
                id="dinner.specialRequirements"
                rows={2}
                placeholder="e.g., 2 vegetarian, 1 gluten-free"
                {...register("dinner.specialRequirements")}
              />
            </div>
          </div>
          
          {/* Supper Section */}
          <div className="mb-6 pb-6 border-b border-gray-200">
            <h4 className="text-md font-medium text-gray-800 mb-4">Supper</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <Label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="supper.adultCount">
                  Adult Count
                </Label>
                <Input
                  type="number"
                  id="supper.adultCount"
                  min="0"
                  {...register("supper.adultCount", { valueAsNumber: true })}
                />
                {errors.supper?.adultCount && (
                  <p className="text-sm text-destructive mt-1">{errors.supper.adultCount.message}</p>
                )}
              </div>
              
              <div>
                <Label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="supper.childCount">
                  Child Count
                </Label>
                <Input
                  type="number"
                  id="supper.childCount"
                  min="0"
                  {...register("supper.childCount", { valueAsNumber: true })}
                />
                {errors.supper?.childCount && (
                  <p className="text-sm text-destructive mt-1">{errors.supper.childCount.message}</p>
                )}
              </div>
            </div>
            
            <div>
              <Label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="supper.specialRequirements">
                Special Dietary Requirements
              </Label>
              <Textarea
                id="supper.specialRequirements"
                rows={2}
                placeholder="e.g., 2 vegetarian, 1 gluten-free"
                {...register("supper.specialRequirements")}
              />
            </div>
          </div>
          
          <div>
            <Label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="notes">
              Additional Notes
            </Label>
            <Textarea
              id="notes"
              rows={3}
              placeholder="Any extra information about tomorrow's meal requirements"
              {...register("notes")}
            />
          </div>
          
          <div className="mt-6 flex justify-end">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit Meal Counts"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
