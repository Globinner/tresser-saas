"use client"

import { useSearchParams } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProfileSettings } from "./profile-settings"
import { ShopSettings } from "./shop-settings"
import { BookingSettings } from "./booking-settings"
import { ReminderSettings } from "./reminder-settings"
import { User, Store, Globe, Bell } from "lucide-react"
import type { User as SupabaseUser } from "@supabase/supabase-js"

interface Profile {
  id: string
  full_name: string | null
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
      <TabsList className="bg-secondary/50 flex-wrap h-auto p-1">
        <TabsTrigger value="profile" className="flex items-center gap-2">
          <User className="w-4 h-4" />
          <span className="hidden sm:inline">Profile</span>
        </TabsTrigger>
        {profile?.role === "owner" && (
          <>
            <TabsTrigger value="shop" className="flex items-center gap-2">
              <Store className="w-4 h-4" />
              <span className="hidden sm:inline">Shop</span>
            </TabsTrigger>
            <TabsTrigger value="booking" className="flex items-center gap-2">
              <Globe className="w-4 h-4" />
              <span className="hidden sm:inline">Online Booking</span>
            </TabsTrigger>
            <TabsTrigger value="reminders" className="flex items-center gap-2">
              <Bell className="w-4 h-4" />
              <span className="hidden sm:inline">Reminders</span>
            </TabsTrigger>
          </>
        )}
      </TabsList>

      <TabsContent value="profile">
        <ProfileSettings user={user} profile={profile} />
      </TabsContent>

      {profile?.role === "owner" && profile?.shops && (
        <>
          <TabsContent value="shop">
            <ShopSettings shop={profile.shops} />
          </TabsContent>
          <TabsContent value="booking">
            <BookingSettings shopId={profile.shop_id!} />
          </TabsContent>
          <TabsContent value="reminders">
            <ReminderSettings shopId={profile.shop_id!} />
          </TabsContent>
        </>
      )}
    </Tabs>
  )
}
