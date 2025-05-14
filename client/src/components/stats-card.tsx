import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type StatsCardProps = {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  iconBgClass: string;
  iconClass: string;
  trend?: React.ReactNode;
};

export function StatsCard({
  title,
  value,
  icon,
  iconBgClass,
  iconClass,
  trend,
}: StatsCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center">
          <div className={cn("rounded-full p-3 mr-4", iconBgClass)}>
            <div className={iconClass}>{icon}</div>
          </div>
          <div>
            <p className="text-gray-500 text-sm">{title}</p>
            <p className="text-2xl font-medium text-gray-800">{value}</p>
          </div>
        </div>
        {trend && trend}
      </CardContent>
    </Card>
  );
}
