
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import type { User } from '@supabase/supabase-js';
import type { Json } from '@/integrations/supabase/types';

interface NotificationSettings {
  email_notifications: boolean;
  product_updates: boolean;
  sustainability_tips: boolean;
}

interface UserPreferences {
  preferred_categories: string[];
  favorite_brands: string[];
}

const Profile = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [sustainabilityPoints, setSustainabilityPoints] = useState(0);
  const [notifications, setNotifications] = useState<NotificationSettings>({
    email_notifications: true,
    product_updates: true,
    sustainability_tips: true,
  });
  const [preferences, setPreferences] = useState<UserPreferences>({
    preferred_categories: [],
    favorite_brands: [],
  });
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/auth');
        return;
      }
      setUser(session.user);
      fetchProfile(session.user.id);
    };

    getSession();
  }, [navigate]);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('username, avatar_url, sustainability_points, notification_settings, preferences, preferred_categories, favorite_brands')
        .eq('id', userId)
        .single();

      if (error) throw error;

      if (data) {
        setUsername(data.username || '');
        setAvatarUrl(data.avatar_url || '');
        setSustainabilityPoints(data.sustainability_points || 0);
        
        // Handle notification settings with proper type casting
        const defaultNotifications: NotificationSettings = {
          email_notifications: true,
          product_updates: true,
          sustainability_tips: true,
        };
        
        // Parse the notification settings from JSON if it exists
        const notificationData = data.notification_settings as Json;
        if (notificationData && typeof notificationData === 'object' && !Array.isArray(notificationData)) {
          setNotifications({
            ...defaultNotifications,
            email_notifications: Boolean(notificationData.email_notifications ?? true),
            product_updates: Boolean(notificationData.product_updates ?? true),
            sustainability_tips: Boolean(notificationData.sustainability_tips ?? true),
          });
        } else {
          setNotifications(defaultNotifications);
        }
        
        // Set preferences with proper defaults
        setPreferences({
          preferred_categories: data.preferred_categories || [],
          favorite_brands: data.favorite_brands || [],
        });
      }
    } catch (error: any) {
      toast({
        title: 'Error fetching profile',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      // Convert notification settings to a JSON-compatible object
      const notificationSettingsJson: Record<string, boolean> = {
        email_notifications: notifications.email_notifications,
        product_updates: notifications.product_updates,
        sustainability_tips: notifications.sustainability_tips,
      };
      
      // Convert preferences to a JSON-compatible object
      const preferencesJson = {
        preferred_categories: preferences.preferred_categories,
        favorite_brands: preferences.favorite_brands,
      };
      
      const { error } = await supabase
        .from('profiles')
        .update({
          username,
          avatar_url: avatarUrl,
          notification_settings: notificationSettingsJson,
          preferences: preferencesJson,
          preferred_categories: preferences.preferred_categories,
          favorite_brands: preferences.favorite_brands,
        })
        .eq('id', user.id);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Profile updated successfully!',
      });
    } catch (error: any) {
      toast({
        title: 'Error updating profile',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate('/auth');
    } catch (error: any) {
      toast({
        title: 'Error signing out',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Profile Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-6">
              <div>
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="avatar">Avatar URL</Label>
                <Input
                  id="avatar"
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sustainability Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-medium">
              Sustainability Points: {sustainabilityPoints}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notification Preferences</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="email_notifications">Email Notifications</Label>
                <Switch
                  id="email_notifications"
                  checked={notifications.email_notifications}
                  onCheckedChange={(checked) =>
                    setNotifications(prev => ({ ...prev, email_notifications: checked }))
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="product_updates">Product Updates</Label>
                <Switch
                  id="product_updates"
                  checked={notifications.product_updates}
                  onCheckedChange={(checked) =>
                    setNotifications(prev => ({ ...prev, product_updates: checked }))
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="sustainability_tips">Sustainability Tips</Label>
                <Switch
                  id="sustainability_tips"
                  checked={notifications.sustainability_tips}
                  onCheckedChange={(checked) =>
                    setNotifications(prev => ({ ...prev, sustainability_tips: checked }))
                  }
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button
            onClick={updateProfile}
            disabled={loading}
            className="flex-1"
          >
            {loading ? 'Saving...' : 'Update Profile'}
          </Button>

          <Button
            onClick={handleSignOut}
            variant="outline"
            className="flex-1"
          >
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
