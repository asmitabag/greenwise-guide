
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { Badge } from '@/components/ui/badge';
import { formatCurrency, formatINR, convertToINR } from '@/utils/currency';
import { Skeleton } from '@/components/ui/skeleton';
import { ShoppingBag, Calendar, Truck } from 'lucide-react';

interface OrderItem {
  product_id: string;
  title: string;
  quantity: number;
  price: number;
  image_url?: string;
}

interface Order {
  id: string;
  created_at: string;
  user_id: string;
  total_amount: number;
  items: OrderItem[];
  status: string;
  payment_method: string;
  updated_at: string;
}

const OrderHistorySection = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [currency, setCurrency] = useState<'USD' | 'INR'>('USD');

  useEffect(() => {
    const fetchOrders = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return;
      
      try {
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        // Convert the JSON items field to proper OrderItem[] type
        const ordersWithTypedItems = data.map(order => ({
          ...order,
          items: (typeof order.items === 'string' ? JSON.parse(order.items) : order.items) as OrderItem[]
        }));
        
        setOrders(ordersWithTypedItems as Order[]);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrders();
  }, []);
  
  const formatOrderDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatPrice = (price: number) => {
    return currency === 'INR' ? formatINR(convertToINR(price)) : formatCurrency(price);
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Order History</CardTitle>
          <CardDescription>View your past orders</CardDescription>
        </CardHeader>
        <CardContent>
          {[1, 2].map((i) => (
            <div key={i} className="mb-6">
              <div className="flex justify-between mb-2">
                <Skeleton className="h-6 w-1/3" />
                <Skeleton className="h-6 w-1/4" />
              </div>
              <Skeleton className="h-32 w-full" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Order History</CardTitle>
            <CardDescription>View your past orders</CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm">Currency:</span>
            <div className="flex border rounded-md overflow-hidden">
              <button
                onClick={() => setCurrency('USD')}
                className={`px-3 py-1 text-sm ${currency === 'USD' ? 'bg-eco-primary text-white' : 'bg-gray-100'}`}
              >
                USD
              </button>
              <button
                onClick={() => setCurrency('INR')}
                className={`px-3 py-1 text-sm ${currency === 'INR' ? 'bg-eco-primary text-white' : 'bg-gray-100'}`}
              >
                INR
              </button>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {orders.length === 0 ? (
          <div className="text-center py-8">
            <ShoppingBag className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No orders yet</h3>
            <p className="mt-1 text-sm text-gray-500">
              Your order history will appear here once you've made a purchase.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="border rounded-lg overflow-hidden">
                <div className="bg-gray-50 px-4 py-3 border-b flex flex-col sm:flex-row justify-between">
                  <div className="flex items-center space-x-2 mb-2 sm:mb-0">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium">
                      Order placed: {formatOrderDate(order.created_at)}
                    </span>
                  </div>
                  <div className="flex space-x-3">
                    <div>
                      <span className="text-xs text-gray-500">Order ID:</span>
                      <span className="text-sm ml-1">{order.id.substring(0, 8)}</span>
                    </div>
                    <Badge className={getStatusColor(order.status)}>
                      {order.status}
                    </Badge>
                  </div>
                </div>
                
                <div className="p-4">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex items-center py-3 border-b last:border-0">
                      {item.image_url ? (
                        <img 
                          src={item.image_url} 
                          alt={item.title} 
                          className="w-16 h-16 object-cover rounded mr-4"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-gray-200 rounded mr-4 flex items-center justify-center">
                          <ShoppingBag className="h-6 w-6 text-gray-400" />
                        </div>
                      )}
                      <div className="flex-1">
                        <h4 className="font-medium">{item.title}</h4>
                        <div className="flex justify-between mt-1">
                          <span className="text-sm text-gray-500">Qty: {item.quantity}</span>
                          <span className="font-medium">{formatPrice(item.price)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  <div className="flex justify-between items-center mt-4 pt-2 border-t">
                    <div className="flex items-center text-sm text-gray-500">
                      <Truck className="h-4 w-4 mr-1" />
                      {order.status === 'completed' ? 'Delivered' : 'Estimated delivery in 3-5 business days'}
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-gray-500">Total Amount:</div>
                      <div className="text-lg font-bold">{formatPrice(order.total_amount)}</div>
                      <div className="text-xs text-gray-500">{order.payment_method}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default OrderHistorySection;
