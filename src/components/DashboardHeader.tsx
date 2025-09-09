import { useState } from 'react';
import { LogOut, Menu, X, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

interface DashboardHeaderProps {
  teacherName: string; 
  onLogout: () => void; 
  onMenuToggle?: () => void; 
  isMobileMenuOpen?: boolean;
}

const DashboardHeader = ({ 
  teacherName, 
  onLogout, 
  onMenuToggle, 
  isMobileMenuOpen = false 
}: DashboardHeaderProps) => {
  return (
    <header className="gradient-bg shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gold rounded-full flex items-center justify-center">
                <span className="text-royal-blue font-bold text-lg">ID</span>
              </div>
              <h1 className="text-white font-bold text-xl">
                Sona College of Technology
              </h1>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <div className="flex items-center space-x-3 text-white">
              <Avatar className="w-8 h-8">
                <AvatarImage src="/placeholder-avatar.jpg" alt={teacherName} />
                <AvatarFallback className="bg-gold text-royal-blue font-medium">
                  {teacherName.split(' ').map(n => n[0]).join('').toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="font-medium">Welcome, {teacherName}</span>
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={onLogout}
              className="bg-white/10 border-white/30 text-white hover:bg-white/20 hover:text-white transition-all duration-200"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={onMenuToggle}
              className="text-white hover:bg-white/20"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-white/20 py-4 animate-slide-up">
            <div className="flex flex-col space-y-4">
              <div className="flex items-center space-x-3 text-white px-2">
                <Avatar className="w-8 h-8">
                  <AvatarImage src="/placeholder-avatar.jpg" alt={teacherName} />
                  <AvatarFallback className="bg-gold text-royal-blue font-medium">
                    {teacherName.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="font-medium">{teacherName}</span>
              </div>
              
              <Button
                variant="outline"
                onClick={onLogout}
                className="bg-white/10 border-white/30 text-white hover:bg-white/20 hover:text-white mx-2"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default DashboardHeader;
