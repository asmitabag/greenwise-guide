
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import OrderHistorySection from "@/components/profile/OrderHistorySection";
import { Leaf, ShoppingBag, Settings, LogOut } from "lucide-react";

const Profile = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("account");
  
  const { data: user } = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const { data } = await supabase.auth.getUser();
      return data.user;
    }
  });
  
  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id
  });
  
  useEffect(() => {
    // Check if user is authenticated
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        navigate("/auth");
      }
    };
    
    checkAuth();
  }, [navigate]);
  
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-eco-background p-4 sm:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-10 bg-gray-200 rounded w-1/4"></div>
            <div className="h-40 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-eco-background p-4 sm:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-eco-primary">My Profile</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="space-y-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-col items-center space-y-3">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={profile?.avatar_url || ""} />
                    <AvatarFallback>
                      {user?.email?.substring(0, 2).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-center">
                    <h3 className="font-medium">{profile?.username || user?.email}</h3>
                    <p className="text-sm text-gray-500">{user?.email}</p>
                  </div>
                  <div className="bg-green-50 p-2 rounded-lg text-center w-full">
                    <div className="flex justify-center items-center gap-1 text-green-700">
                      <Leaf className="h-4 w-4" />
                      <span className="text-sm font-medium">
                        Eco Score: {profile?.eco_score || 0}/100
                      </span>
                    </div>
                    <p className="text-xs text-green-600 mt-1">
                      {profile?.sustainability_points || 0} sustainability points
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="flex flex-col space-y-2">
              <Button
                variant={activeTab === "account" ? "default" : "outline"}
                className={activeTab === "account" ? "bg-eco-primary" : ""}
                onClick={() => setActiveTab("account")}
              >
                <Settings className="mr-2 h-4 w-4" />
                Account
              </Button>
              <Button
                variant={activeTab === "orders" ? "default" : "outline"}
                className={activeTab === "orders" ? "bg-eco-primary" : ""}
                onClick={() => setActiveTab("orders")}
              >
                <ShoppingBag className="mr-2 h-4 w-4" />
                Orders
              </Button>
              <Button 
                variant="outline" 
                className="mt-4 border-red-200 text-red-600 hover:bg-red-50"
                onClick={handleSignOut}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
            </div>
          </div>
          
          {/* Main content */}
          <div className="md:col-span-3 space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
              <TabsContent value="account">
                <Card>
                  <CardHeader>
                    <CardTitle>Account Details</CardTitle>
                    <CardDescription>Update your personal information</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium">Username</h4>
                        <div className="border p-3 rounded-md">
                          {profile?.username || "Not set"}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium">Email</h4>
                        <div className="border p-3 rounded-md">
                          {user?.email}
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Sustainability Preferences</h4>
                      <div className="border p-4 rounded-md grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <p className="text-sm font-medium">Favorite Categories</p>
                          <div className="flex flex-wrap gap-1">
                            {profile?.preferred_categories?.map((category, index) => (
                              <span key={index} className="text-xs bg-gray-100 px-2 py-1 rounded">
                                {category}
                              </span>
                            )) || (
                              <span className="text-xs text-gray-500">No preferences set</span>
                            )}
                          </div>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium">Favorite Brands</p>
                          <div className="flex flex-wrap gap-1">
                            {profile?.favorite_brands?.map((brand, index) => (
                              <span key={index} className="text-xs bg-gray-100 px-2 py-1 rounded">
                                {brand}
                              </span>
                            )) || (
                              <span className="text-xs text-gray-500">No favorites set</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Sustainability Impact</h4>
                      <div className="border p-4 rounded-md">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">Eco Score</span>
                          <span className="text-sm font-medium text-green-600">
                            {profile?.eco_score || 0}/100
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                          <div 
                            className="bg-green-500 h-full"
                            style={{ width: `${profile?.eco_score || 0}%` }}
                          ></div>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                          Your eco-score increases as you purchase sustainable products and engage with eco-friendly features.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="orders">
                <OrderHistorySection />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
