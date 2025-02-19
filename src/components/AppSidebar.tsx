
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Link } from "react-router-dom";
import { UserCircle, Users, Headset, Store } from "lucide-react";

export function AppSidebar() {
  return (
    <>
      <SidebarTrigger className="fixed top-4 left-4 z-50" />
      <Sidebar defaultOpen={false}>
        <SidebarHeader className="border-b border-border px-6 py-4">
          <h2 className="text-lg font-semibold">EcoScanner</h2>
        </SidebarHeader>
        
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Profile</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link to="/profile">
                      <UserCircle />
                      <span>My Profile</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link to="/seller/register">
                      <Store />
                      <span>Become a Seller</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupLabel>Help & Support</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link to="/support">
                      <Headset />
                      <span>Customer Care</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <div className="px-4 py-2 text-sm text-muted-foreground">
                  <p>Call us: +91 902-147-8902</p>
                  <p>Email: ecohelp.care@gmail.com</p>
                </div>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="border-t border-border p-4">
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Founders</h3>
            <ul className="text-sm space-y-2 text-muted-foreground">
              <li>Asmita Bag</li>
              <li>Saloni Simlote</li>
              <li>Safal Goyal</li>
            </ul>
          </div>
        </SidebarFooter>
      </Sidebar>
    </>
  );
}
