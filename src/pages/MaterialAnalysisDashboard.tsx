
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardHeader, CardContent, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Leaf, Recycle, Droplets, Shield, Award, Box } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import MaterialAnalysis from '@/components/MaterialAnalysis';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface MaterialStats {
  total_materials: number;
  avg_eco_score: number;
  avg_carbon_footprint: number;
  avg_water_usage: number;
  avg_recyclability: number;
  avg_biodegradability: number;
  top_materials: { name: string; count: number }[];
  best_brands: { name: string; avg_score: number }[];
}

interface Certification {
  id: string;
  name: string;
  issuing_body: string;
  description: string;
}

const MaterialAnalysisDashboard = () => {
  const [materialStats, setMaterialStats] = useState<MaterialStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [activeTab, setActiveTab] = useState('overview');
  const { toast } = useToast();

  useEffect(() => {
    fetchMaterialStats();
    fetchCertifications();
    fetchTopProducts();
  }, []);

  const fetchMaterialStats = async () => {
    try {
      setLoading(true);
      
      // Fetch material analysis stats
      const { data: materials, error: materialsError } = await supabase
        .from('material_analysis')
        .select('*');
      
      if (materialsError) throw materialsError;
      
      // Fetch products for brand information
      const { data: products, error: productsError } = await supabase
        .from('products')
        .select('id, brand, sustainability_score');
        
      if (productsError) throw productsError;
      
      if (materials && materials.length > 0) {
        // Calculate statistics
        const totalMaterials = materials.length;
        const avgEcoScore = materials.reduce((sum, item) => sum + item.eco_score, 0) / totalMaterials;
        const avgCarbonFootprint = materials.reduce((sum, item) => sum + (item.carbon_footprint || 0), 0) / totalMaterials;
        const avgWaterUsage = materials.reduce((sum, item) => sum + (item.water_usage || 0), 0) / totalMaterials;
        const avgRecyclability = materials.reduce((sum, item) => sum + (item.recyclability_rating || 0), 0) / totalMaterials;
        const avgBiodegradability = materials.reduce((sum, item) => sum + (item.biodegradability_rating || 0), 0) / totalMaterials;
        
        // Get top materials
        const materialCounts: Record<string, number> = {};
        materials.forEach(material => {
          materialCounts[material.material_name] = (materialCounts[material.material_name] || 0) + 1;
        });
        
        const topMaterials = Object.entries(materialCounts)
          .map(([name, count]) => ({ name, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 5);
        
        // Get best brands
        const brandScores: Record<string, { total: number, count: number }> = {};
        products.forEach(product => {
          if (!brandScores[product.brand]) {
            brandScores[product.brand] = { total: 0, count: 0 };
          }
          brandScores[product.brand].total += product.sustainability_score;
          brandScores[product.brand].count += 1;
        });
        
        const bestBrands = Object.entries(brandScores)
          .map(([name, { total, count }]) => ({ 
            name, 
            avg_score: total / count 
          }))
          .sort((a, b) => b.avg_score - a.avg_score)
          .slice(0, 5);
        
        setMaterialStats({
          total_materials: totalMaterials,
          avg_eco_score: avgEcoScore,
          avg_carbon_footprint: avgCarbonFootprint,
          avg_water_usage: avgWaterUsage,
          avg_recyclability: avgRecyclability,
          avg_biodegradability: avgBiodegradability,
          top_materials: topMaterials,
          best_brands: bestBrands
        });
      }
    } catch (error: any) {
      toast({
        title: 'Error fetching material stats',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchCertifications = async () => {
    try {
      const { data, error } = await supabase
        .from('material_certifications')
        .select('*')
        .order('name');
      
      if (error) throw error;
      
      if (data) {
        setCertifications(data);
      }
    } catch (error: any) {
      toast({
        title: 'Error fetching certifications',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const fetchTopProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('sustainability_score', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      
      if (data) {
        setFilteredProducts(data);
      }
    } catch (error: any) {
      toast({
        title: 'Error fetching products',
        description: error.message,
        variant: 'destructive',
      });
    }
  };
  
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      fetchTopProducts();
      return;
    }
    
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .or(`title.ilike.%${searchQuery}%,brand.ilike.%${searchQuery}%,category.ilike.%${searchQuery}%`)
        .order('sustainability_score', { ascending: false });
      
      if (error) throw error;
      
      setFilteredProducts(data || []);
    } catch (error: any) {
      toast({
        title: 'Error searching products',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading material analysis data...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-eco-secondary mb-2">Material Analysis Dashboard</h1>
          <p className="text-gray-600">Comprehensive insights on sustainable materials and their environmental impact</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-3 mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="certifications">Certifications</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {materialStats && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center">
                        <Leaf className="mr-2 text-green-500" />
                        Sustainability Overview
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium">Average Eco Score</span>
                            <span className="text-sm font-medium">{materialStats.avg_eco_score.toFixed(1)}/10</span>
                          </div>
                          <Progress value={materialStats.avg_eco_score * 10} className="h-2" />
                        </div>
                        <div className="pt-4 grid grid-cols-2 gap-4">
                          <div>
                            <span className="text-sm text-gray-500">Total Materials</span>
                            <p className="text-xl font-bold">{materialStats.total_materials}</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center">
                        <Droplets className="mr-2 text-blue-500" />
                        Environmental Impact
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <span className="text-sm font-medium">Avg. Carbon Footprint</span>
                          <p className="text-xl font-bold">{materialStats.avg_carbon_footprint.toFixed(1)} kg CO2</p>
                        </div>
                        <div>
                          <span className="text-sm font-medium">Avg. Water Usage</span>
                          <p className="text-xl font-bold">{materialStats.avg_water_usage.toFixed(1)} L</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center">
                        <Recycle className="mr-2 text-eco-primary" />
                        Recyclability Metrics
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium">Avg. Recyclability</span>
                            <span className="text-sm font-medium">{materialStats.avg_recyclability.toFixed(1)}/10</span>
                          </div>
                          <Progress value={materialStats.avg_recyclability * 10} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium">Avg. Biodegradability</span>
                            <span className="text-sm font-medium">{materialStats.avg_biodegradability.toFixed(1)}/10</span>
                          </div>
                          <Progress value={materialStats.avg_biodegradability * 10} className="h-2" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Top Materials</CardTitle>
                      <CardDescription>Most commonly used sustainable materials</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {materialStats.top_materials.map((material, index) => (
                          <div key={index} className="flex justify-between items-center">
                            <span>{material.name}</span>
                            <Badge variant="outline">{material.count} products</Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Top Sustainable Brands</CardTitle>
                      <CardDescription>Brands with highest eco scores</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {materialStats.best_brands.map((brand, index) => (
                          <div key={index} className="flex justify-between items-center">
                            <span>{brand.name}</span>
                            <div className="flex items-center">
                              <span className="mr-2">{brand.avg_score.toFixed(1)}</span>
                              <Progress value={brand.avg_score * 10} className="w-20 h-2" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </>
            )}
          </TabsContent>

          <TabsContent value="products" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Product Material Analysis</CardTitle>
                <CardDescription>Search for products to view their material composition</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2 mb-6">
                  <div className="flex-1">
                    <Input
                      placeholder="Search by product name, brand or category..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Button onClick={handleSearch}>Search</Button>
                </div>

                <div className="space-y-8">
                  {filteredProducts.length > 0 ? (
                    filteredProducts.map((product) => (
                      <div key={product.id} className="border rounded-lg p-4">
                        <div className="flex flex-col md:flex-row gap-4 mb-4">
                          {product.image_url && (
                            <div className="w-full md:w-1/4">
                              <img 
                                src={product.image_url} 
                                alt={product.title} 
                                className="w-full h-40 object-cover rounded-md"
                              />
                            </div>
                          )}
                          <div className="flex-1">
                            <h3 className="text-xl font-semibold">{product.title}</h3>
                            <p className="text-sm text-gray-500">{product.brand}</p>
                            <div className="flex items-center mt-2">
                              <Badge className="bg-eco-primary text-white">
                                Eco Score: {product.sustainability_score}/10
                              </Badge>
                              <span className="ml-4">${product.price}</span>
                            </div>
                            <p className="mt-2">{product.description}</p>
                            <div className="flex flex-wrap gap-2 mt-2">
                              {product.eco_features?.map((feature: string, idx: number) => (
                                <Badge key={idx} variant="outline">
                                  {feature}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-4">
                          <Label className="font-medium mb-2 block">Material Analysis</Label>
                          <MaterialAnalysis productId={product.id} />
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <Box className="mx-auto h-12 w-12 text-gray-400" />
                      <h3 className="mt-2 text-sm font-semibold text-gray-900">No products found</h3>
                      <p className="mt-1 text-sm text-gray-500">Try different search terms or browse our top sustainable products.</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="certifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Sustainability Certifications</CardTitle>
                <CardDescription>Learn about eco-friendly certifications and standards</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {certifications.map((cert) => (
                    <Card key={cert.id} className="border">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-lg">{cert.name}</CardTitle>
                          <Shield className="h-5 w-5 text-eco-primary" />
                        </div>
                        <CardDescription>{cert.issuing_body}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm">{cert.description}</p>
                      </CardContent>
                      <CardFooter className="pt-0">
                        <Badge variant="outline" className="flex items-center">
                          <Award className="h-3.5 w-3.5 mr-1" />
                          Verified Certification
                        </Badge>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default MaterialAnalysisDashboard;
