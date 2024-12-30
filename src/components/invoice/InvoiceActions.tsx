import React from "react";
import { Button } from "@/components/ui/button";
import { Check, Edit, Eye, RefreshCcw } from "lucide-react";
import { Link } from "react-router-dom";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";

interface InvoiceActionsProps {
  invoice: {
    id: string;
    status: string;
  };
  onMarkAsPaid: (id: string) => void;
  onMarkAsUnpaid: (id: string) => void;
}

export const InvoiceActions: React.FC<InvoiceActionsProps> = ({
  invoice,
  onMarkAsPaid,
  onMarkAsUnpaid,
}) => {
  return (
    <div className="flex gap-2">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="icon" asChild>
              <Link to={`/invoices/${invoice.id}`}>
                <Eye className="h-4 w-4" />
              </Link>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>View Invoice</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="icon" asChild>
              <Link to={`/invoices/${invoice.id}/edit`}>
                <Edit className="h-4 w-4" />
              </Link>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Edit Invoice</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {invoice.status === 'unpaid' ? (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => onMarkAsPaid(invoice.id)}
              >
                <Check className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Mark as Paid</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ) : (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => onMarkAsUnpaid(invoice.id)}
              >
                <RefreshCcw className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Mark as Unpaid</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );
};