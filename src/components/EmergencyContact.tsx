import { Phone, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const EMERGENCY_NUMBER = "108"; // India's National Emergency Number
const EMERGENCY_TEL = "tel:108";

export default function EmergencyContact() {
  return (
    <TooltipProvider>
      <div className="fixed bottom-6 left-6 z-40">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              asChild
              size="lg"
              className="bg-red-600 hover:bg-red-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 rounded-full h-14 w-14 p-0"
            >
              <a href={EMERGENCY_TEL} className="flex items-center justify-center">
                <Phone className="h-6 w-6" />
              </a>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right" className="bg-red-600 text-white border-red-600">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              <div className="text-sm">
                <div className="font-semibold">Emergency Helpline</div>
                <div>Click to call: {EMERGENCY_NUMBER}</div>
              </div>
            </div>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}
