
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { formatCurrency } from "@/utils/currency";
import { Truck, Package, ArrowUpDown, RefreshCw } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface OrderItem {
  product_id: string;
  quantity: number;
  price: number;
  title: string;
  image_url?: string;
}

interface Order {
  id: string;
  user_id: string;
  total_amount: number;
  items: OrderItem[];
  created_at: string;
  updated_at: string;
  status: string;
  payment_method: string;
  tracking_number?: string;
  estimated_delivery?: string;
}

const OrderHistorySection = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  
  const { data: orders, isLoading, error } = useQuery({
    queryKey: ['user-orders'],
    queryFn: async () => {
      const { data: user } = await supabase.auth.getUser();
      
      if (!user.user) {
        throw new Error("User not authenticated");
      }
      
      // Fetch orders with type assertion to deal with TypeScript error
      const { data, error } = await (supabase
        .from('orders' as any)
        .select('*')
        .eq('user_id', user.user.id)
        .order('created_at', { ascending: false }));
      
      if (error) throw error;
      return data as Order[];
    }
  });
  
  // Filter orders based on active tab
  const filteredOrders = orders?.filter(order => {
    if (activeTab === "all") return true;
    return order.status === activeTab;
  });
  
  const getOrderStatusIcon = (status: string) => {
    switch (status) {
      case 'processing':
        return <RefreshCw className="h-4 w-4 text-blue-500" />;
      case 'shipped':
        return <Truck className="h-4 w-4 text-green-500" />;
      case 'delivered':
        return <Package className="h-4 w-4 text-green-700" />;
      case 'returned':
        return <ArrowUpDown className="h-4 w-4 text-red-500" />;
      default:
        return <RefreshCw className="h-4 w-4 text-gray-500" />;
    }
  };
  
  const getOrderStatusBadge = (status: string) => {
    switch (status) {
      case 'processing':
        return <Badge variant="outline" className="border-blue-500 text-blue-700">Processing</Badge>;
      case 'shipped':
        return <Badge variant="outline" className="border-green-500 text-green-700">Shipped</Badge>;
      case 'delivered':
        return <Badge className="bg-green-500">Delivered</Badge>;
      case 'returned':
        return <Badge variant="outline" className="border-red-500 text-red-700">Returned</Badge>;
      default:
        return <Badge variant="outline">Pending</Badge>;
    }
  };
  
  const handleReturnOrder = async (orderId: string) => {
    // In a real app, this would initiate a return process
    try {
      const { error } = await (supabase
        .from('orders' as any)
        .update({ status: 'returned' })
        .eq('id', orderId));
        
      if (error) throw error;
      
      // Optimistic UI update
      // To properly refresh the data, you should use queryClient.invalidateQueries(['user-orders'])
    } catch (error) {
      console.error("Failed to return order:", error);
    }
  };
  
  const trackOrder = (orderId: string) => {
    // Toggle order tracking details
    setSelectedOrder(selectedOrder === orderId ? null : orderId);
  };
  
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Order History</CardTitle>
          <CardDescription>Track and manage your purchases</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-28 w-full" />
            <Skeleton className="h-28 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Order History</CardTitle>
          <CardDescription>Track and manage your purchases</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-red-50 p-4 rounded-md text-red-600">
            Error loading orders. Please refresh and try again.
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Order History</CardTitle>
        <CardDescription>Track and manage your purchases</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid grid-cols-5 w-full">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="processing">Processing</TabsTrigger>
            <TabsTrigger value="shipped">Shipped</TabsTrigger>
            <TabsTrigger value="delivered">Delivered</TabsTrigger>
            <TabsTrigger value="returned">Returned</TabsTrigger>
          </TabsList>
          
          <TabsContent value={activeTab} className="space-y-4">
            {filteredOrders && filteredOrders.length > 0 ? (
              <Accordion type="single" collapsible className="space-y-4">
                {filteredOrders.map((order) => (
                  <AccordionItem 
                    key={order.id} 
                    value={order.id}
                    className="border border-gray-200 rounded-md px-4 overflow-hidden"
                  >
                    <div className="flex items-center justify-between py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          {getOrderStatusIcon(order.status)}
                          <p className="text-sm font-medium">
                            Order #{order.id.substring(0, 8)}
                          </p>
                        </div>
                        <p className="text-xs text-gray-500">
                          {new Date(order.created_at).toLocaleDateString()} • 
                          {formatCurrency(order.total_amount, "INR")}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {getOrderStatusBadge(order.status)}
                        <AccordionTrigger className="ml-2" />
                      </div>
                    </div>
                    
                    <AccordionContent className="pb-4 space-y-4">
                      <div className="space-y-3">
                        <h4 className="font-medium text-sm">Order Items</h4>
                        <div className="divide-y border rounded-md">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="p-3 flex justify-between items-center">
                              <div className="flex items-center gap-3">
                                {item.image_url ? (
                                  <img 
                                    src={item.image_url} 
                                    alt={item.title} 
                                    className="w-12 h-12 object-cover rounded"
                                  />
                                ) : (
                                  <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                                    <Package className="h-6 w-6 text-gray-400" />
                                  </div>
                                )}
                                <div>
                                  <p className="font-medium text-sm">{item.title}</p>
                                  <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                                </div>
                              </div>
                              <p className="font-medium">
                                {formatCurrency(item.price * item.quantity, "INR")}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      {/* Order tracking */}
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <h4 className="font-medium text-sm">Delivery Status</h4>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => trackOrder(order.id)}
                          >
                            {selectedOrder === order.id ? "Hide Details" : "Track Order"}
                          </Button>
                        </div>
                        
                        {selectedOrder === order.id && (
                          <div className="border rounded-md p-4 space-y-4">
                            <div className="flex justify-between">
                              <div>
                                <p className="text-xs text-gray-500">Tracking Number</p>
                                <p className="font-medium">
                                  {order.tracking_number || `ECO-${order.id.substring(0, 10)}`}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500 text-right">Estimated Delivery</p>
                                <p className="font-medium">
                                  {order.estimated_delivery || 
                                    new Date(
                                      new Date(order.created_at).getTime() + 7 * 24 * 60 * 60 * 1000
                                    ).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            
                            <div className="relative">
                              <div className="absolute top-0 left-3 bottom-0 w-0.5 bg-gray-200"></div>
                              <div className="space-y-6 relative">
                                <div className="flex items-center gap-3">
                                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${order.status !== 'pending' ? 'bg-green-500' : 'bg-gray-300'}`}>
                                    <div className="w-2 h-2 bg-white rounded-full"></div>
                                  </div>
                                  <div>
                                    <p className="font-medium text-sm">Order Placed</p>
                                    <p className="text-xs text-gray-500">
                                      {new Date(order.created_at).toLocaleDateString()}
                                    </p>
                                  </div>
                                </div>
                                
                                <div className="flex items-center gap-3">
                                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${order.status === 'processing' || order.status === 'shipped' || order.status === 'delivered' ? 'bg-green-500' : 'bg-gray-300'}`}>
                                    <div className="w-2 h-2 bg-white rounded-full"></div>
                                  </div>
                                  <div>
                                    <p className="font-medium text-sm">Processing</p>
                                    <p className="text-xs text-gray-500">
                                      {order.status === 'processing' || order.status === 'shipped' || order.status === 'delivered' ? 
                                        new Date(new Date(order.created_at).getTime() + 1 * 24 * 60 * 60 * 1000).toLocaleDateString() : 
                                        'Pending'}
                                    </p>
                                  </div>
                                </div>
                                
                                <div className="flex items-center gap-3">
                                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${order.status === 'shipped' || order.status === 'delivered' ? 'bg-green-500' : 'bg-gray-300'}`}>
                                    <div className="w-2 h-2 bg-white rounded-full"></div>
                                  </div>
                                  <div>
                                    <p className="font-medium text-sm">Shipped</p>
                                    <p className="text-xs text-gray-500">
                                      {order.status === 'shipped' || order.status === 'delivered' ? 
                                        new Date(new Date(order.created_at).getTime() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString() : 
                                        'Pending'}
                                    </p>
                                  </div>
                                </div>
                                
                                <div className="flex items-center gap-3">
                                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${order.status === 'delivered' ? 'bg-green-500' : 'bg-gray-300'}`}>
                                    <div className="w-2 h-2 bg-white rounded-full"></div>
                                  </div>
                                  <div>
                                    <p className="font-medium text-sm">Delivered</p>
                                    <p className="text-xs text-gray-500">
                                      {order.status === 'delivered' ? 
                                        new Date(new Date(order.created_at).getTime() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString() : 
                                        'Pending'}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {/* Order actions */}
                      <div className="flex justify-end pt-2">
                        {order.status !== 'returned' && order.status !== 'processing' && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleReturnOrder(order.id)}
                          >
                            Return Order
                          </Button>
                        )}
                        {order.status === 'returned' && (
                          <Badge variant="outline" className="border-red-500 text-red-700">
                            Return Processed
                          </Badge>
                        )}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            ) : (
              <div className="text-center py-10 border rounded-md">
                <Package className="w-10 h-10 mx-auto text-gray-400 mb-2" />
                <p className="text-gray-500">No orders found</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default OrderHistorySection;
