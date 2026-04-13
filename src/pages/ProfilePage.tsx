import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { useQuery } from '@tanstack/react-query';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Mail, Phone, Users, Calendar, CreditCard, Loader2, AlertCircle } from 'lucide-react';
import api from '@/lib/api';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface Booking {
  id: number;
  bookingId: string;
  date: string;
  slots: Array<{
    id: string;
    time: string;
    price: number;
  }>;
  status: 'upcoming' | 'confirmed' | 'cancelled' | 'completed';
  totalAmount: number;
  createdAt: string;
}

const ProfilePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const bookingsQuery = useQuery({
    queryKey: ['user-bookings', user?.id],
    queryFn: async (): Promise<Booking[]> => {
      if (!user) throw new Error('No user');
      const response = await api.get(`/bookings?userId=${user.id}`);
      return response.data; // assume array of bookings
    },
    enabled: !!user,
  });

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'upcoming':
        return <Badge variant="default">Upcoming</Badge>;
      case 'confirmed':
        return <Badge variant="secondary">Confirmed</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Cancelled</Badge>;
      case 'completed':
        return <Badge className="bg-green-500">Completed</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/50">
      <Navbar />
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-display font-bold bg-gradient-cta bg-clip-text text-transparent mb-4">
              Your Profile
            </h1>
            <p className="text-xl text-muted-foreground max-w-md mx-auto">
              Manage your account and view booking history.
            </p>
          </motion.div>

          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="profile">
                <User className="mr-2 h-4 w-4" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="bookings">
                <Users className="mr-2 h-4 w-4" />
                Bookings
              </TabsTrigger>
            </TabsList>
            <TabsContent value="profile">
              {/* Profile Card */}
              <Card className="glass-effect">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <User className="h-6 w-6" />
                    Account Details
                  </CardTitle>
                  <CardDescription>Personal information</CardDescription>
                </CardHeader>
                <CardContent className="grid md:grid-cols-2 gap-8 p-0">
                  <div className="space-y-6 p-8">
                    <div className="flex items-center gap-6">
                      <Avatar className="h-24 w-24">
                        <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} />
                        <AvatarFallback className="bg-gradient-cta text-primary-foreground text-3xl font-bold">
                          {user.name.split(' ').map(n => n[0].toUpperCase()).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h2 className="text-3xl font-bold text-foreground">{user.name}</h2>
                        <Badge className="mt-2 text-lg px-4 py-1.5 font-semibold" variant={user.role === 'admin' ? 'destructive' : 'default'}>
                          {user.role}
                        </Badge>
                      </div>
                    </div>
                    <div className="space-y-4 pt-4 border-t">
                      <div className="flex items-center gap-3 text-sm">
                        <Mail className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        <span className="font-medium">{user.email}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <Phone className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        <span className="font-medium">{user.phoneNumber}</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-8 space-y-4 md:border-l">
                    <Button onClick={() => navigate('/booking')} className="w-full bg-gradient-cta h-14">
                      <Calendar className="mr-2 h-5 w-5" />
                      Book New Session
                    </Button>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <Button variant="outline" className="h-12">Edit Profile</Button>
                      <Button variant="outline" className="h-12 bg-muted text-muted-foreground">Download Invoice</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="bookings">
              {/* Bookings Table */}
              <Card className="glass-effect">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Users className="h-6 w-6" />
                    Booking History
                  </CardTitle>
                  <CardDescription>Your past, current and upcoming bookings</CardDescription>
                </CardHeader>
                <CardContent>
                  {bookingsQuery.isLoading ? (
                    <div className="flex flex-col items-center justify-center py-16">
                      <Loader2 className="h-8 w-8 animate-spin mb-4" />
                      <p className="text-muted-foreground">Loading your bookings...</p>
                    </div>
                  ) : bookingsQuery.isError ? (
                    <div className="flex flex-col items-center justify-center py-16 text-destructive">
                      <AlertCircle className="h-12 w-12 mb-4" />
                      <p>Failed to load bookings. Please try again.</p>
                      <Button variant="outline" onClick={() => bookingsQuery.refetch()} className="mt-4">
                        Retry
                      </Button>
                    </div>
                  ) : bookingsQuery.data && bookingsQuery.data.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                      <Users className="h-16 w-16 text-muted-foreground mb-6 opacity-50" />
                      <h3 className="text-2xl font-bold mb-2 text-muted-foreground">No bookings yet</h3>
                      <p className="text-muted-foreground mb-8 max-w-md">Your booking history will appear here once you make your first reservation.</p>
                      <Button onClick={() => navigate('/booking')} size="lg" className="bg-gradient-cta">
                        Book Your First Session
                      </Button>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Slots</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Amount</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {bookingsQuery.data?.map((booking: Booking) => (
                            <TableRow key={booking.id}>
                              <TableCell className="font-medium">
                                {format(new Date(booking.date), 'MMM dd, yyyy')}
                              </TableCell>
                              <TableCell>
                                <div className="flex flex-col gap-1">
                                  {booking.slots.map(slot => (
                                    <span key={slot.id} className="text-sm text-muted-foreground">
                                      {slot.time}
                                    </span>
                                  ))}
                                </div>
                              </TableCell>
                              <TableCell>{getStatusBadge(booking.status)}</TableCell>
                              <TableCell className="text-right font-mono text-lg font-bold text-primary">
                                ₹{booking.totalAmount.toLocaleString()}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProfilePage;

