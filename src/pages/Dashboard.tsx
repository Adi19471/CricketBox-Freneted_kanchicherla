import { useAuth } from '@/context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Mail, Phone, Calendar, UserCog } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/50">
      <Navbar />
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Welcome Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-display font-bold bg-gradient-cta bg-clip-text text-transparent mb-4">
              Welcome back, {user.name}!
            </h1>
            <p className="text-xl text-muted-foreground max-w-md mx-auto">
              Manage your profile and book your next cricket session.
            </p>
          </div>

          {/* User Profile Card */}
          <Card className="glass-effect mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <User className="h-6 w-6" />
                Profile Details
              </CardTitle>
              <CardDescription>Your account information</CardDescription>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-6 p-0">
              <div className="space-y-4 p-6 border-b md:border-r md:border-b-0">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} />
                    <AvatarFallback className="bg-gradient-cta text-primary-foreground text-2xl font-bold">
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-2xl font-bold">{user.name}</h3>
                    <p className="text-muted-foreground">{user.role}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-3 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{user.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{user.phoneNumber}</span>
                  </div>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <Button onClick={() => navigate('/booking')} className="w-full bg-gradient-cta">
                  <Calendar className="mr-2 h-4 w-4" />
                  Book Now
                </Button>
                <Button variant="outline" className="w-full">
                  <UserCog className="mr-2 h-4 w-4" />
                  Edit Profile
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats Placeholder */}
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="glass-effect">
              <CardHeader className="pb-3">
                <CardTitle className="text-2xl font-bold text-primary">0</CardTitle>
                <CardDescription>Upcoming Bookings</CardDescription>
              </CardHeader>
            </Card>
            <Card className="glass-effect">
              <CardHeader className="pb-3">
                <CardTitle className="text-2xl font-bold text-primary">0</CardTitle>
                <CardDescription>Past Sessions</CardDescription>
              </CardHeader>
            </Card>
            <Card className="glass-effect">
              <CardHeader className="pb-3">
                <CardTitle className="text-2xl font-bold text-primary">{new Date().getFullYear()}</CardTitle>
                <CardDescription>Member Since</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;

