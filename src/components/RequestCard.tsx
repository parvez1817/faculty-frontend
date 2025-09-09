import { useState } from 'react';
import { Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

export interface StudentRequest {
  _id: string;
  registerNumber: string;
  name: string;
  dob: string;
  department: string;
  year: string;
  section: string;
  libraryCode: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  photoUrl: string;
}

interface RequestCardProps {
  request: StudentRequest;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  isProcessing?: boolean;
}

const RequestCard = ({ request, onApprove, onReject, isProcessing = false }: RequestCardProps) => {
  const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  return (
    <Card className="glass-card hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border-white/30 w-full max-w-full">
      <CardContent className="p-3 sm:p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          {/* Student Info Section */}
          <div className="flex flex-col sm:flex-row sm:items-start space-y-3 sm:space-y-0 sm:space-x-4 w-full">
            {/* Photo */}
            <div className="flex-shrink-0 flex justify-center sm:block">
              <Avatar className="w-16 h-16 ring-2 ring-white/30 cursor-pointer hover:ring-gold transition-all duration-200">
                <AvatarImage
                  src={request.photoUrl}
                  alt={request.name}
                  onClick={() => setIsImageModalOpen(true)}
                />
                <AvatarFallback className="bg-royal-blue text-white font-semibold text-lg">
                  {request.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>

            {/* Details */}
            <div className="flex-1 min-w-0 w-full">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">
                  {request.name}
                </h3>
                <Badge className={`${getStatusColor(request.status)} border`}>
                  {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                </Badge>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 sm:gap-2 text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3">
                <div><strong>Name:</strong> {request.name}</div>
                <div><strong>Register Number:</strong> {request.registerNumber}</div>
                <div><strong>DOB:</strong> {request.dob}</div>
                <div><strong>Department:</strong> {request.department}</div>
                <div><strong>Year:</strong> {request.year}</div>
                <div><strong>Section:</strong> {request.section}</div>
                <div><strong>Library Code:</strong> {request.libraryCode}</div>
                <div className="sm:col-span-2"><strong>Reason:</strong> {request.reason}</div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          {request.status === 'pending' && (
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 lg:flex-col lg:space-y-2 lg:space-x-0 w-full sm:w-auto">
              {/* Approve Confirmation Dialog */}
              <Dialog open={isApproveDialogOpen} onOpenChange={setIsApproveDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    onClick={() => setIsApproveDialogOpen(true)}
                    disabled={isProcessing}
                    className="bg-gold hover:bg-yellow-500 text-royal-blue font-medium px-4 sm:px-6 py-2 text-xs sm:text-base transition-all duration-200 hover:shadow-lg hover:scale-105 w-full sm:w-auto"
                  >
                    <Check className="w-4 h-4 mr-2" />
                    Approve
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle className="text-lg font-semibold text-center mb-4">
                      I hope You have verified with the respective Student to avoid any Malpractice or Inconvenience.
                    </DialogTitle>
                  </DialogHeader>
                  <div className="flex justify-center mt-6">
                    <Button
                      onClick={() => {
                        setIsApproveDialogOpen(false);
                        onApprove(request._id);
                      }}
                      className="bg-gold hover:bg-yellow-500 text-royal-blue font-semibold px-6 sm:px-8 py-2 text-xs sm:text-base"
                    >
                      Yes
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
              <Button
                variant="outline"
                onClick={() => {
                  onReject(request._id); // Calls parent handler (which should PATCH to /api/requests/:id/status with rejected)
                }}
                disabled={isProcessing}
                className="border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400 px-4 sm:px-6 py-2 text-xs sm:text-base transition-all duration-200 hover:shadow-lg hover:scale-105 w-full sm:w-auto"
              >
                <X className="w-4 h-4 mr-2" />
                Reject
              </Button>
            </div>
          )}
        </div>

        {/* Image Modal */}
        <Dialog open={isImageModalOpen} onOpenChange={setIsImageModalOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{request.name} - ID Photo</DialogTitle>
            </DialogHeader>
            <div className="flex justify-center">
              <img
                src={request.photoUrl}
                alt={request.name}
                className="max-w-full h-auto rounded-lg shadow-lg object-contain"
              />
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default RequestCard;
