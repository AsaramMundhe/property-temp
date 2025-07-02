import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Helmet } from "react-helmet";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/lib/api";
import { 
  Building, 
  Users, 
  Eye, 
  TrendingUp,
  Plus,
  Edit,
  Trash2,
  Phone,
  Mail,
  LogOut,
  MapPin,
  Calendar,
  Bed,
  Square
} from "lucide-react";

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { admin, logout, isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("overview");

  // Redirect if not authenticated
  if (!isAuthenticated) {
    setLocation("/admin/login");
    return null;
  }

  // Fetch dashboard stats
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/admin/stats"],
    queryFn: () => api.getDashboardStats(),
  });

  // Fetch properties
  const { data: propertiesData, isLoading: propertiesLoading } = useQuery({
    queryKey: ["/api/admin/properties"],
    queryFn: () => api.getAdminProperties({ page: 1, limit: 10, sortBy: "createdAt", sortOrder: "desc" }),
  });

  // Fetch leads
  const { data: leadsData, isLoading: leadsLoading } = useQuery({
    queryKey: ["/api/admin/leads"],
    queryFn: () => api.getAdminLeads(1, 10),
  });

  // Update lead status mutation
  const updateLeadMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) =>
      api.updateLead(id, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/leads"] });
      toast({
        title: "Lead Updated",
        description: "Lead status has been updated successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update lead status.",
        variant: "destructive",
      });
    },
  });

  // Delete property mutation
  const deletePropertyMutation = useMutation({
    mutationFn: (id: number) => api.deleteProperty(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/properties"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
      toast({
        title: "Property Deleted",
        description: "Property has been deleted successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Delete Failed",
        description: error.message || "Failed to delete property.",
        variant: "destructive",
      });
    },
  });

  const handleLogout = () => {
    logout();
    setLocation("/admin/login");
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
  };

  const formatPrice = (price: string) => {
    const num = parseFloat(price);
    if (num >= 10000000) {
      return `₹${(num / 10000000).toFixed(1)} Cr`;
    } else if (num >= 100000) {
      return `₹${(num / 100000).toFixed(1)} L`;
    }
    return `₹${num.toLocaleString()}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <>
      <Helmet>
        <title>Admin Dashboard - PropertyHub</title>
        <meta name="description" content="PropertyHub admin dashboard for managing properties and leads" />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-4">
                <Building className="h-8 w-8 text-blue-600" />
                <div>
                  <h1 className="text-xl font-bold text-gray-900">PropertyHub Admin</h1>
                  <p className="text-sm text-gray-500">Welcome back, {admin?.username}</p>
                </div>
              </div>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="properties">Properties</TabsTrigger>
              <TabsTrigger value="leads">Leads</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-2xl font-bold text-gray-900">
                          {statsLoading ? "..." : stats?.totalProperties || 0}
                        </div>
                        <div className="text-gray-600">Total Properties</div>
                      </div>
                      <div className="bg-blue-100 p-3 rounded-lg">
                        <Building className="h-6 w-6 text-blue-600" />
                      </div>
                    </div>
                    <div className="mt-4 flex items-center">
                      <span className="text-green-600 text-sm font-medium">+12%</span>
                      <span className="text-gray-500 text-sm ml-1">from last month</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-2xl font-bold text-gray-900">
                          {statsLoading ? "..." : stats?.totalLeads || 0}
                        </div>
                        <div className="text-gray-600">Total Leads</div>
                      </div>
                      <div className="bg-green-100 p-3 rounded-lg">
                        <Users className="h-6 w-6 text-green-600" />
                      </div>
                    </div>
                    <div className="mt-4 flex items-center">
                      <span className="text-green-600 text-sm font-medium">+24%</span>
                      <span className="text-gray-500 text-sm ml-1">from last month</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-2xl font-bold text-gray-900">
                          {statsLoading ? "..." : stats?.activeListings || 0}
                        </div>
                        <div className="text-gray-600">Active Listings</div>
                      </div>
                      <div className="bg-yellow-100 p-3 rounded-lg">
                        <Eye className="h-6 w-6 text-yellow-600" />
                      </div>
                    </div>
                    <div className="mt-4 flex items-center">
                      <span className="text-green-600 text-sm font-medium">+8%</span>
                      <span className="text-gray-500 text-sm ml-1">from last month</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-2xl font-bold text-gray-900">
                          {statsLoading ? "..." : `${(stats?.monthlyViews || 0) / 1000}K`}
                        </div>
                        <div className="text-gray-600">Monthly Views</div>
                      </div>
                      <div className="bg-purple-100 p-3 rounded-lg">
                        <TrendingUp className="h-6 w-6 text-purple-600" />
                      </div>
                    </div>
                    <div className="mt-4 flex items-center">
                      <span className="text-green-600 text-sm font-medium">+18%</span>
                      <span className="text-gray-500 text-sm ml-1">from last month</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Properties */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      Recent Properties
                      <Button size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Property
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {propertiesLoading ? (
                        <div className="text-center py-4">Loading...</div>
                      ) : propertiesData?.properties?.length === 0 ? (
                        <div className="text-center py-4 text-gray-500">No properties found</div>
                      ) : (
                        propertiesData?.properties?.slice(0, 3).map((property) => (
                          <div key={property.id} className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="flex items-center space-x-4">
                              <img
                                src={property.featuredImageUrl || "/api/placeholder/80/60"}
                                alt={property.title}
                                className="w-16 h-12 object-cover rounded-lg"
                              />
                              <div>
                                <div className="font-medium text-gray-900">{property.title}</div>
                                <div className="text-sm text-gray-600 flex items-center">
                                  <MapPin className="h-3 w-3 mr-1" />
                                  {property.location}, {property.city}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Badge variant={property.isActive ? "default" : "secondary"}>
                                {property.isActive ? "Active" : "Inactive"}
                              </Badge>
                              <Button size="sm" variant="ghost">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Leads */}
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Leads</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {leadsLoading ? (
                        <div className="text-center py-4">Loading...</div>
                      ) : leadsData?.leads?.length === 0 ? (
                        <div className="text-center py-4 text-gray-500">No leads found</div>
                      ) : (
                        leadsData?.leads?.slice(0, 3).map((lead) => (
                          <div key={lead.id} className="flex items-center justify-between p-4 border rounded-lg">
                            <div>
                              <div className="font-medium text-gray-900">{lead.name}</div>
                              <div className="text-sm text-gray-600">{lead.email}</div>
                              <div className="text-xs text-gray-500">{formatDate(lead.createdAt!)}</div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Badge variant="outline">{lead.status}</Badge>
                              <Button size="sm" variant="ghost">
                                <Phone className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="ghost">
                                <Mail className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Properties Tab */}
            <TabsContent value="properties" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Property Management
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Add New Property
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {propertiesLoading ? (
                    <div className="text-center py-8">Loading properties...</div>
                  ) : propertiesData?.properties?.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">No properties found</div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Property</TableHead>
                          <TableHead>Location</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Price</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Views</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {propertiesData?.properties?.map((property) => (
                          <TableRow key={property.id}>
                            <TableCell>
                              <div className="flex items-center space-x-3">
                                <img
                                  src={property.featuredImageUrl || "/api/placeholder/60/45"}
                                  alt={property.title}
                                  className="w-12 h-9 object-cover rounded"
                                />
                                <div>
                                  <div className="font-medium">{property.title}</div>
                                  <div className="text-sm text-gray-500 flex items-center">
                                    <Bed className="h-3 w-3 mr-1" />
                                    {property.bhkType} • 
                                    <Square className="h-3 w-3 mx-1" />
                                    {property.area} sq ft
                                  </div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="text-sm">
                                <div>{property.location}</div>
                                <div className="text-gray-500">{property.city}</div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">{property.propertyType}</Badge>
                            </TableCell>
                            <TableCell className="font-medium">
                              {formatPrice(property.price)}
                            </TableCell>
                            <TableCell>
                              <Badge variant={property.isActive ? "default" : "secondary"}>
                                {property.isActive ? "Active" : "Inactive"}
                              </Badge>
                            </TableCell>
                            <TableCell>{property.viewCount || 0}</TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                <Button size="sm" variant="ghost">
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="ghost"
                                  onClick={() => deletePropertyMutation.mutate(property.id)}
                                  disabled={deletePropertyMutation.isPending}
                                >
                                  <Trash2 className="h-4 w-4 text-red-500" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Leads Tab */}
            <TabsContent value="leads" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Lead Management</CardTitle>
                </CardHeader>
                <CardContent>
                  {leadsLoading ? (
                    <div className="text-center py-8">Loading leads...</div>
                  ) : leadsData?.leads?.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">No leads found</div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Contact</TableHead>
                          <TableHead>Property Interest</TableHead>
                          <TableHead>Message</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {leadsData?.leads?.map((lead) => (
                          <TableRow key={lead.id}>
                            <TableCell>
                              <div>
                                <div className="font-medium">{lead.name}</div>
                                <div className="text-sm text-gray-500">{lead.email}</div>
                                <div className="text-sm text-gray-500">{lead.phone}</div>
                              </div>
                            </TableCell>
                            <TableCell>
                              {lead.propertyId ? (
                                <div className="text-sm">
                                  <div>Property ID: {lead.propertyId}</div>
                                </div>
                              ) : (
                                <span className="text-gray-400">General inquiry</span>
                              )}
                            </TableCell>
                            <TableCell>
                              <div className="max-w-xs truncate text-sm">
                                {lead.message || "No message"}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Select 
                                value={lead.status} 
                                onValueChange={(value) => 
                                  updateLeadMutation.mutate({ id: lead.id, status: value })
                                }
                              >
                                <SelectTrigger className="w-32">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="new">New</SelectItem>
                                  <SelectItem value="contacted">Contacted</SelectItem>
                                  <SelectItem value="qualified">Qualified</SelectItem>
                                  <SelectItem value="closed">Closed</SelectItem>
                                </SelectContent>
                              </Select>
                            </TableCell>
                            <TableCell className="text-sm">
                              {formatDate(lead.createdAt!)}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                <Button size="sm" variant="outline" asChild>
                                  <a href={`tel:${lead.phone}`}>
                                    <Phone className="h-4 w-4" />
                                  </a>
                                </Button>
                                <Button size="sm" variant="outline" asChild>
                                  <a href={`mailto:${lead.email}`}>
                                    <Mail className="h-4 w-4" />
                                  </a>
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
}
