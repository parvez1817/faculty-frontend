import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { UserCheck, IdCard } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { API_URL } from '@/lib/utils';

const LoginPage = () => {
  const [name, setName] = useState('');
  const [registerNumber, setRegisterNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !registerNumber.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Check if faculty ID exists in the database
      const response = await fetch(`${API_URL}/api/check-faculty/${registerNumber}`);
      const data = await response.json();

      if (!data.valid) {
        toast({
          title: "Invalid Faculty ID",
          description: "Wrong ID",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      // If faculty ID is valid, proceed with login
      // Store teacher info in localStorage for now
      localStorage.setItem('teacherName', name);
      localStorage.setItem('teacherRegister', registerNumber);

      toast({
        title: "Login Successful",
        description: `Welcome, ${name}!`,
      });

      navigate('/dashboard');
    } catch (error) {
      console.error('Error checking faculty ID:', error);
      toast({
        title: "Error",
        description: "Unable to verify faculty ID. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            
            <h1 className="text-3xl font-bold text-white font-poppins drop-shadow-lg">Sona College of Technology</h1>
          </div>
          <p className="text-white/90 text-lg font-medium drop-shadow-md">Teachers don’t just teach , they shape the future.</p>
        </div>

        {/* Login Form */}
        <Card className="glass-card border-white/30 shadow-2xl">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-2xl font-semibold text-black flex items-center justify-center gap-2 drop-shadow-md">
              <UserCheck className="h-6 w-6 text-gold" />
              Teacher Login
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-black font-semibold text-base drop-shadow-sm">
                  Full Name
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-white/90 border-black text-black placeholder:text-gray-600 focus:border-gold focus:ring-gold/50 h-12 text-base font-medium backdrop-blur-sm"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="register" className="text-black font-semibold text-base drop-shadow-sm">
                  Faculty ID
                </Label>
                <Input
                  id="register"
                  type="text"
                  placeholder="Enter your faculty id"
                  value={registerNumber}
                  onChange={(e) => setRegisterNumber(e.target.value)}
                  className="bg-white/90 border-black text-black placeholder:text-gray-600 focus:border-gold focus:ring-gold/50 h-12 text-base font-medium backdrop-blur-sm"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-gold text-black hover:bg-gold/90 font-bold h-12 transition-all duration-200 text-base shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                    Logging in...
                  </div>
                ) : (
                  'Login'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-white/80 text-sm font-medium drop-shadow-sm">
            Digital ID Card Request Management System
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
