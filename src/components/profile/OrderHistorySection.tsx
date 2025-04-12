
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ShoppingBag, Clock, Check, AlertTriangle } from "lucide-react";
import { formatINR } from "@/utils/currency";

interface OrderItem {
  product_id: string;
  title: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  user_id: string;
  total_amount: number;
  items: OrderItem[];
  created_at: string;
  updated_at: string;
  status: string;
  payment_method?: string;
  tracking_number?: string;
  estimated_delivery?: string;
}

const OrderHistorySection = () => {
  const { toast } = useToast();
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  
  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user) {
        return [];
      }

      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', session.session.user.id)
        .order('created_at', { ascending: false });
      
      if (error) {
        toast({
          title: "Error fetching orders",
          description: error.message,
          variant: "destructive",
        });
        return [];
      }
      
      return data as Order[];
    }
  });

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { variant: string; icon: JSX.Element }> = {
      "pending": { 
        variant: "outline", 
        icon: <Clock className="h-3 w-3 mr-1" />
      },
      "processing": { 
        variant: "secondary", 
        icon: <Clock className="h-3 w-3 mr-1" />
      },
      "shipped": { 
        variant: "default", 
        icon: <ShoppingBag className="h-3 w-3 mr-1" />
      },
      "delivered": { 
        variant: "success", 
        icon: <Check className="h-3 w-3 mr-1" />
      },
      "cancelled": { 
        variant: "destructive", 
        icon: <AlertTriangle className="h-3 w-3 mr-1" />
      }
    };

    const badgeInfo = statusMap[status.toLowerCase()] || { 
      variant: "outline", 
      icon: <Clock className="h-3 w-3 mr-1" />
    };

    return (
      <Badge 
        variant={badgeInfo.variant as any} 
        className="flex items-center justify-center"
      >
        {badgeInfo.icon}
        <span className="capitalize">{status}</span>
      </Badge>
    );
  };

  const handleToggleOrderDetails = (orderId: string) => {
    if (selectedOrder === orderId) {
      setSelectedOrder(null);
    } else {
      setSelectedOrder(orderId);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Order History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-10 bg-gray-200 rounded-md w-3/4"></div>
            <div className="h-28 bg-gray-200 rounded-md"></div>
            <div className="h-28 bg-gray-200 rounded-md"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShoppingBag className="h-5 w-5" />
          Order History
        </CardTitle>
      </CardHeader>
      <CardContent>
        {orders.length === 0 ? (
          <div className="text-center py-10">
            <ShoppingBag className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500">You haven't placed any orders yet.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="border rounded-lg overflow-hidden">
                <div 
                  className="flex justify-between items-center p-4 cursor-pointer hover:bg-gray-50"
                  onClick={() => handleToggleOrderDetails(order.id)}
                >
                  <div>
                    <p className="text-sm text-gray-500 mb-1">
                      Order #{order.id.substring(0, 8)}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(order.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <p className="font-semibold">{formatINR(order.total_amount)}</p>
                    {getStatusBadge(order.status)}
                  </div>
                </div>
                
                {selectedOrder === order.id && (
                  <div className="p-4 bg-gray-50 border-t">
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium mb-2">Order Items</h4>
                        <div className="space-y-2">
                          {order.items.map((item, index) => (
                            <div key={index} className="flex justify-between text-sm">
                              <div>
                                <span className="font-medium">{item.title}</span>
                                <span className="text-gray-500 ml-2">x{item.quantity}</span>
                              </div>
                              <span>{formatINR(item.price * item.quantity)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Payment Method</span>
                          <span className="capitalize">{order.payment_method || "Not specified"}</span>
                        </div>
                        
                        {order.tracking_number && (
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Tracking Number</span>
                            <span>{order.tracking_number}</span>
                          </div>
                        )}
                        
                        {order.estimated_delivery && (
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Estimated Delivery</span>
                            <span>{new Date(order.estimated_delivery).toLocaleDateString()}</span>
                          </div>
                        )}
                        
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Status</span>
                          <span className="capitalize">{order.status}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default OrderHistorySection;
