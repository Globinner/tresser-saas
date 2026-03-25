"use client"

import { useSearchParams } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProfileSettings } from "./profile-settings"
import { ShopSettings } from "./shop-settings"
import { CreateShopForm } from "./create-shop-form"
import { BookingSettings } from "./booking-settings"
import { ReminderSettings } from "./reminder-settings"
import { User, Store, Globe, Bell } from "lucide-react"
import type { User as SupabaseUser } from "@supabase/supabase-js"

interface Profile {
  id: string
  full_name: string | null
  display_name: string | null
  avatar_url: string | null
  role: string
  shop_id: string | null
  shops: {
    id: string
    name: string
    address: string | null
    phone: string | null
  } | null
}

interface SettingsTabsProps {
  user: SupabaseUser
  profile: Profile | null
}

export function SettingsTabs({ user, profile }: SettingsTabsProps) {
  const searchParams = useSearchParams()
  const defaultTab = searchParams.get("tab") || "profile"

  return (
    <Tabs defaultValue={defaultTab} className="space-y-6">
      <TabsList className="bg-secondary/30 border border-primary/30 flex-wrap h-auto p-2 gap-2">
        <TabsTrigger 
          value="profile" 
          className="flex items-center gap-2 px-6 py-3 text-base font-semibold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
        >
          <User className="w-5 h-5" />
          <span>Profile</span>
        </TabsTrigger>
        {profile?.role === "owner" && (
          <>
            <TabsTrigger 
              value="shop" 
              className="flex items-center gap-2 px-6 py-3 text-base font-semibold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Store className="w-5 h-5" />
              <span>Shop</span>
            </TabsTrigger>
            <TabsTrigger 
              value="booking" 
              className="flex items-center gap-2 px-6 py-3 text-base font-semibold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Globe className="w-5 h-5" />
              <span>Online Booking</span>
            </TabsTrigger>
            <TabsTrigger 
              value="reminders" 
              className="flex items-center gap-2 px-6 py-3 text-base font-semibold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Bell className="w-5 h-5" />
              <span>Reminders</span>
            </TabsTrigger>
          </>
        )}
      </TabsList>

      <TabsContent value="profile">
        <ProfileSettings user={user} profile={profile} />
      </TabsContent>

      {profile?.role === "owner" && (
        <>
          <TabsContent value="shop">
            {profile?.shops ? (
              <ShopSettings shop={profile.shops} />
            ) : (
              <CreateShopForm userId={user.id} />
            )}
          </TabsContent>
          {profile?.shops && (
            <>
              <TabsContent value="booking">
                <BookingSettings shopId={profile.shop_id!} />
              </TabsContent>
              <TabsContent value="reminders">
                <ReminderSettings shopId={profile.shop_id!} />
              </TabsContent>
            </>
          )}
        </>
      )}
    </Tabs>
  )
}
