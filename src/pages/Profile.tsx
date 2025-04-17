
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import OrderHistorySection from "@/components/profile/OrderHistorySection";
import { Leaf, ShoppingBag, Settings, LogOut, Home } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Profile = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("account");
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const { data: user } = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const { data } = await supabase.auth.getUser();
      return data.user;
    }
  });
  
  const { data: profile, isLoading, refetch: refetchProfile } = useQuery({
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
  
  // Fetch purchase history to calculate eco score
  const { data: purchases, isSuccess: purchasesLoaded } = useQuery({
    queryKey: ['purchases', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('purchases')
        .select('*, products:product_id(sustainability_score)')
        .eq('user_id', user.id);
      
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id
  });
  
  // Calculate and update eco score based on purchase history - improved
  useEffect(() => {
    const updateEcoScore = async () => {
      if (!user?.id || !purchasesLoaded || !profile) return;
      
      console.log("Updating eco score based on purchases:", purchases);
      
      // Calculate average sustainability score from purchases
      let totalScore = 0;
      let totalItems = 0;
      
      // Make sure purchases exists and has elements
      if (purchases && purchases.length > 0) {
        purchases.forEach(purchase => {
          if (purchase.products?.sustainability_score) {
            const score = Number(purchase.products.sustainability_score);
            const quantity = Number(purchase.quantity);
            
            if (!isNaN(score) && !isNaN(quantity)) {
              totalScore += score * quantity;
              totalItems += quantity;
            }
          }
        });
      }
      
      // Calculate new eco score (10-100 scale)
      let averageScore = totalItems > 0 ? Math.round((totalScore / totalItems) * 10) : 0;
      
      // Ensure score is at least 10 if there are purchases
      if (totalItems > 0 && averageScore < 10) {
        averageScore = 10;
      }
      
      console.log("Calculated eco score:", {
        totalScore,
        totalItems,
        averageScore,
        currentScore: profile.eco_score
      });
      
      // Update user profile with new eco score
      if (averageScore > 0 && (profile.eco_score === 0 || averageScore > profile.eco_score)) {
        const sustainabilityPoints = totalItems * 5; // 5 points per item purchased
        
        console.log("Updating profile with new score:", averageScore, "and points:", sustainabilityPoints);
        
        const { error } = await supabase
          .from('profiles')
          .update({
            eco_score: averageScore,
            sustainability_points: sustainabilityPoints
          })
          .eq('id', user.id);
        
        if (error) {
          console.error("Error updating eco score:", error);
          toast({
            title: "Error",
            description: "Failed to update sustainability score",
            variant: "destructive"
          });
        } else {
          // Force refetch profile to show updated score
          queryClient.invalidateQueries({ queryKey: ['profile', user.id] });
          
          toast({
            title: "Profile Updated",
            description: "Your sustainability score has been updated based on your purchases",
          });
        }
      }
    };
    
    updateEcoScore();
  }, [user?.id, purchases, profile, purchasesLoaded, queryClient, toast]);
  
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
  
  // Force score to be number type and handle edge cases
  const ecoScore = profile?.eco_score ? Number(profile.eco_score) : 0;
  const sustainabilityPoints = profile?.sustainability_points ? Number(profile.sustainability_points) : 0;
  
  return (
    <div className="min-h-screen bg-eco-background p-4 sm:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-eco-primary">My Profile</h1>
          <Link to="/">
            <Button variant="outline" className="flex items-center gap-2">
              <Home size={18} />
              <span>Back to Home</span>
            </Button>
          </Link>
        </div>
        
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
                        Eco Score: {ecoScore}/100
                      </span>
                    </div>
                    <p className="text-xs text-green-600 mt-1">
                      {sustainabilityPoints} sustainability points
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
                            {ecoScore}/100
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                          <div 
                            className="bg-green-500 h-full"
                            style={{ width: `${ecoScore}%` }}
                          ></div>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                          Your eco-score increases as you purchase sustainable products and engage with eco-friendly features.
                        </p>
                        
                        {/* Purchase summary */}
                        {purchases && purchases.length > 0 && (
                          <div className="mt-4 pt-4 border-t">
                            <p className="text-sm font-medium mb-2">Purchase Impact</p>
                            <div className="text-xs text-gray-700">
                              <p>You've purchased {purchases.length} sustainable products!</p>
                              <p className="mt-1">Each eco-friendly purchase contributes to your sustainability score.</p>
                              {purchases.length > 0 && ecoScore === 0 && (
                                <Button
                                  onClick={() => refetchProfile()}
                                  className="mt-2 text-xs bg-green-600 hover:bg-green-700 text-white"
                                  size="sm"
                                >
                                  Refresh Score
                                </Button>
                              )}
                            </div>
                          </div>
                        )}
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
