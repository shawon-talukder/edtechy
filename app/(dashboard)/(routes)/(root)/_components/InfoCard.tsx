import IconBadge from "@/components/IconBadge";
import { LucideIcon } from "lucide-react";

interface InfoCardProps {
  label: string;
  icon: LucideIcon;
  numberOfItems: number;
  variant?: "default" | "success";
}

const InfoCard = ({
  icon: Icon,
  label,
  numberOfItems,
  variant,
}: InfoCardProps) => {
  return (
    <div className="border rounded-md flex items-center gap-x-2 p-3">
      <IconBadge variant={variant} icon={Icon} />
      <div>
        <p className="font-medium">{label}</p>
        <p className="text-gray-500 text-sm">
          {numberOfItems}
          {numberOfItems <= 1 ? " Course" : " Courses"}
        </p>
      </div>
    </div>
  );
};

export default InfoCard;
