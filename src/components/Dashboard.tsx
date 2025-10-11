import { useState, useMemo, useEffect } from 'react';
import { Search, LogOut, CheckCircle, XCircle, Clock } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import DashboardHeader from './DashboardHeader';
import RequestCard, { StudentRequest } from './RequestCard';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '@/lib/utils';

const Dashboard = () => {
  const [requests, setRequests] = useState<StudentRequest[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [processingIds, setProcessingIds] = useState<Set<string>>(new Set());
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [teacherName, setTeacherName] = useState('');
  const [isFadingOut, setIsFadingOut] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem('teacherRegister')) {
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    const storedName = localStorage.getItem('teacherName');
    setTeacherName(storedName || '');
  }, []);

  useEffect(() => {
    // Fetch from backend API
    Promise.all([
      fetch(`${API_URL}/api/pending`).then(res => res.json()),
      fetch(`${API_URL}/api/acchistoryids`).then(res => res.json()),
      fetch(`${API_URL}/api/rejhistoryids`).then(res => res.json())
    ])
    .then(([pendingData, approvedData, rejectedData]) => {
      // Inject status into each dataset
      const pending = pendingData.map((d: any) => ({ ...d, status: 'pending' }));
      const approved = approvedData.map((d: any) => ({ ...d, status: 'approved' }));
      const rejected = rejectedData.map((d: any) => ({ ...d, status: 'rejected' }));
      
      setRequests([...pending, ...approved, ...rejected]);
    })
    .catch(error => console.error('Error fetching requests:', error));
  }, []);

  const filteredRequests = useMemo(() => {
    return requests.filter(request => {
      const matchesSearch = (request.name || '').toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || ((request.status || '').toLowerCase() === statusFilter);
      return matchesSearch && matchesStatus;
    });
  }, [requests, searchTerm, statusFilter]);

  const pendingRequests = filteredRequests.filter(r => r.status === 'pending');
  const approvedRequests = filteredRequests.filter(r => r.status === 'approved');
  const rejectedRequests = filteredRequests.filter(r => r.status === 'rejected');

  const handleStatusUpdate = async (id: string, newStatus: 'approved' | 'rejected') => {
    setProcessingIds(prev => new Set(prev).add(id));

    try {
      const res = await fetch(`${API_URL}/api/requests/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error("Failed to update");

      // Remove from current view
      setRequests(prev => prev.filter(req => req._id !== id));

      toast({
        title: `Request ${newStatus === 'approved' ? 'Approved' : 'Rejected'}`,
        description: `Student ID card request has been ${newStatus}.`,
      });
    } catch (error) {
      console.error(error);
    }

    setProcessingIds(prev => {
      const newSet = new Set(prev);
      newSet.delete(id);
      return newSet;
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('teacherName');
    localStorage.removeItem('teacherRegister');
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
    setIsFadingOut(true);
    setTimeout(() => navigate('/login'), 1200);
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 transition-opacity duration-700 ${isFadingOut ? 'opacity-0' : 'opacity-100'}`}>
      <DashboardHeader
        teacherName={`Dr. ${teacherName}`}
        onLogout={handleLogout}
        onMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        isMobileMenuOpen={isMobileMenuOpen}
      />

      <div className="container mx-auto px-2 sm:px-4 lg:px-8 py-4 sm:py-8">
        {/* Search and Filter */}
        <Card className="glass-card border-white/30 mb-6 sm:mb-8">
          <CardContent className="p-3 sm:p-6">
            <div className="flex flex-col md:flex-row gap-3 sm:gap-4">
            <div className="flex-1 relative min-w-0 w-full sm:w-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/70 border-white/30 focus:bg-white text-sm h-10 sm:h-12 w-full"
              />
            </div>
            <div className="flex gap-1 sm:gap-2 flex-wrap justify-start sm:justify-normal mt-2 sm:mt-0">
              {['all','pending','approved','rejected'].map(status => (
                <Button
                  key={status}
                  variant={statusFilter === status ? 'default' : 'outline'}
                  onClick={() => setStatusFilter(status)}
                  className={
                    statusFilter === status 
                      ? (status === 'approved' ? 'bg-green-600 hover:bg-green-700 text-white' :
                         status === 'rejected' ? 'bg-red-600 hover:bg-red-700 text-white' :
                         status === 'pending' ? 'bg-yellow-600 hover:bg-yellow-700 text-white' :
                         'bg-royal-blue hover:bg-blue-700 text-white')
                      : 'bg-white/70 hover:bg-white/90'
                  }
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </Button>
              ))}
            </div>
            </div>
          </CardContent>
        </Card>

        {/* Request Tabs */}
        <Tabs defaultValue="pending" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-white/70 mb-6">
            <TabsTrigger value="pending">Pending ({pendingRequests.length})</TabsTrigger>
            <TabsTrigger value="approved">Approved ({approvedRequests.length})</TabsTrigger>
            <TabsTrigger value="rejected">Rejected ({rejectedRequests.length})</TabsTrigger>
          </TabsList>

          {[
            { value: 'pending', list: pendingRequests, icon: <Clock className="w-16 h-16 text-gray-400 mx-auto mb-4" /> },
            { value: 'approved', list: approvedRequests, icon: <CheckCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" /> },
            { value: 'rejected', list: rejectedRequests, icon: <XCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" /> },
          ].map(({ value, list, icon }) => (
            <TabsContent value={value} key={value} className="space-y-6">
              {list.length > 0 ? (
                list.map((request) => (
                  <RequestCard
                    key={request._id}
                    request={request}
                    onApprove={(id) => handleStatusUpdate(id, 'approved')}
                    onReject={(id) => handleStatusUpdate(id, 'rejected')}
                    isProcessing={processingIds.has(request._id)}
                  />
                ))
              ) : (
                <Card className="glass-card border-white/30">
                  <CardContent className="text-center py-12">
                    {icon}
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No {value} Requests</h3>
                    <p className="text-gray-600">
                      {value.charAt(0).toUpperCase() + value.slice(1)} requests will appear here.
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
