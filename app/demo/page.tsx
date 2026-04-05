"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useLanguage } from "@/lib/i18n/language-context"
import { LanguageSwitcher } from "@/components/language-switcher"
import { 
  Calendar, Users, DollarSign, Clock, Scissors, Package, 
  Bell, Camera, BarChart3, CheckCircle, Play, UserPlus,
  FlaskConical, ArrowLeft, TrendingUp, AlertTriangle,
  LayoutDashboard, UsersRound, Settings, Phone, Mail,
  ChevronRight, ChevronLeft, X, Plus, Search, TrendingDown, Star
} from "lucide-react"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  AreaChart,
  Area
} from "recharts"

// Demo data - comprehensive for realistic experience
const demoClientsEn = [
  { 
  id: 1,
  name: "Marcus Johnson",
  phone: "(555) 123-4567",
  email: "marcus.j@email.com",
  visits: 24,
  lastVisit: "2 days ago",
  totalSpent: 1250,
  avatar: "/images/features/clients.jpg",
  notes: "Regular customer, always on time",
  preferences: ["Low Fade", "Scissors only", "Certain gels"],
  preferredBarber: "Mike",
    visitHistory: [
      { date: "Mar 15, 2026", service: "Fade", barber: "Mike", price: 30 },
      { date: "Feb 28, 2026", service: "Fade + Beard", barber: "Mike", price: 45 },
      { date: "Feb 10, 2026", service: "Fade", barber: "Mike", price: 30 },
    ],
    photos: [
      { before: "/images/features/photos.jpg", after: "/images/features/photos.jpg", date: "Mar 15, 2026" },
      { before: "/images/features/photos.jpg", after: "/images/features/photos.jpg", date: "Feb 28, 2026" },
    ]
  },
  { 
    id: 2, 
    name: "David Chen", 
    phone: "(555) 234-5678",
    email: "david.chen@email.com",
    visits: 18, 
    lastVisit: "1 week ago", 
    totalSpent: 890,
    notes: "Likes classic cuts, always on time",
    preferences: ["Taper", "Clippers only", "Hot towel"],
    preferredBarber: "Sarah",
    visitHistory: [
      { date: "Mar 10, 2026", service: "Classic Haircut", barber: "Sarah", price: 25 },
      { date: "Feb 20, 2026", service: "Classic Haircut", barber: "Sarah", price: 25 },
    ],
    photos: []
  },
  { 
    id: 3, 
    name: "Alex Thompson", 
    phone: "(555) 345-6789",
    email: "alex.t@email.com",
    visits: 32, 
    lastVisit: "Yesterday", 
    totalSpent: 2100,
    notes: "Regular color client - gray coverage",
    preferences: ["Scissors only", "Sensitive scalp", "Hair dye"],
    preferredBarber: "Sarah",
    hasChemistry: true,
    visitHistory: [
      { date: "Mar 17, 2026", service: "Hair Color", barber: "Sarah", price: 60 },
      { date: "Feb 15, 2026", service: "Hair Color", barber: "Sarah", price: 60 },
      { date: "Jan 20, 2026", service: "Hair Color + Cut", barber: "Sarah", price: 85 },
    ],
    photos: [
      { before: "/images/features/photos.jpg", after: "/images/features/photos.jpg", date: "Mar 17, 2026" },
    ],
    chemistry: [
      { 
        date: "Mar 17, 2026",
        colorBrand: "Wella Koleston",
        formula: "6/0 + 7/1",
        developer: "20 vol",
        ratio: "1:1",
        processingTime: "35 min",
        notes: "Gray coverage, natural result"
      },
      { 
        date: "Feb 15, 2026",
        colorBrand: "Wella Koleston", 
        formula: "6/0 + 6/1",
        developer: "20 vol",
        ratio: "1:1",
        processingTime: "30 min",
        notes: "First color service, patch test done"
      },
    ]
  },
  { 
    id: 4, 
    name: "James Williams", 
    phone: "(555) 456-7890",
    email: "james.w@email.com",
    visits: 15, 
    lastVisit: "3 days ago", 
    totalSpent: 720,
    notes: "Prefers appointments early morning",
    preferences: ["Buzz Cut", "Clippers only", "Line up"],
    preferredBarber: "Mike",
    visitHistory: [
      { date: "Mar 14, 2026", service: "Buzz Cut", barber: "Mike", price: 20 },
    ],
    photos: []
  },
  { 
    id: 5, 
    name: "Michael Rodriguez", 
    phone: "(555) 567-8901",
    email: "m.rodriguez@email.com",
    visits: 28, 
    lastVisit: "Today", 
    totalSpent: 1580,
    notes: "VIP client, always tips well",
    preferences: ["Mid Fade", "Both", "Beard trim", "Hot towel"],
    preferredBarber: "Mike",
    visitHistory: [
      { date: "Mar 18, 2026", service: "Hair & Beard Combo", barber: "Mike", price: 40 },
      { date: "Mar 1, 2026", service: "Hair & Beard Combo", barber: "Mike", price: 40 },
    ],
    photos: [
      { before: "/images/features/photos.jpg", after: "/images/features/photos.jpg", date: "Mar 18, 2026" },
    ]
  },
]

const demoClientsHe = [
  { 
    id: 1,
    name: "יוסי כהן",
    phone: "054-123-4567",
    email: "yossi.k@email.com",
    visits: 24,
    lastVisit: "לפני יומיים",
    totalSpent: 1250,
    avatar: "/images/features/clients.jpg",
    notes: "לקוח קבוע, תמיד בזמן",
    preferences: ["פייד נמוך", "מספריים בלבד", "ג׳לים מסוימים"],
    preferredBarber: "מייק",
    visitHistory: [
      { date: "15 מרץ, 2026", service: "פייד", barber: "מייק", price: 30 },
      { date: "28 פבר, 2026", service: "פייד + זקן", barber: "מייק", price: 45 },
      { date: "10 פבר, 2026", service: "פייד", barber: "מייק", price: 30 },
    ],
    photos: [
      { before: "/images/features/photos.jpg", after: "/images/features/photos.jpg", date: "15 מרץ, 2026" },
      { before: "/images/features/photos.jpg", after: "/images/features/photos.jpg", date: "28 פבר, 2026" },
    ]
  },
  { 
    id: 2, 
    name: "דוד לוי", 
    phone: "052-234-5678",
    email: "david.l@email.com",
    visits: 18, 
    lastVisit: "לפני שבוע", 
    totalSpent: 890,
    notes: "אוהב תספורות קלאסיות, תמיד בזמן",
    preferences: ["טייפר", "מכונה בלבד", "מגבת חמה"],
    preferredBarber: "שרה",
    visitHistory: [
      { date: "10 מרץ, 2026", service: "תספורת קלאסית", barber: "שרה", price: 25 },
      { date: "20 פבר, 2026", service: "תספורת קלאסית", barber: "שרה", price: 25 },
    ],
    photos: []
  },
  { 
    id: 3, 
    name: "אבי מזרחי", 
    phone: "050-345-6789",
    email: "avi.m@email.com",
    visits: 32, 
    lastVisit: "אתמול", 
    totalSpent: 2100,
    notes: "לקוח צביעה קבוע - כיסוי שיער לבן",
    preferences: ["מספריים בלבד", "קרקפת רגישה", "צבע שיער"],
    preferredBarber: "שרה",
    hasChemistry: true,
    visitHistory: [
      { date: "17 מרץ, 2026", service: "צביעת שיער", barber: "שרה", price: 60 },
      { date: "15 ������בר, 2026", service: "צביעת שיער", barber: "שרה", price: 60 },
      { date: "20 ינו, 2026", service: "צביעה + תספורת", barber: "שרה", price: 85 },
    ],
    photos: [
      { before: "/images/features/photos.jpg", after: "/images/features/photos.jpg", date: "17 מרץ, 2026" },
    ],
    chemistry: [
      { 
        date: "17 מרץ, 2026",
        colorBrand: "Wella Koleston",
        formula: "6/0 + 7/1",
        developer: "20 vol",
        ratio: "1:1",
        processingTime: "35 דק׳",
        notes: "כיסוי שיער לבן, תוצאה טבעית"
      },
      { 
        date: "15 פבר, 2026",
        colorBrand: "Wella Koleston", 
        formula: "6/0 + 6/1",
        developer: "20 vol",
        ratio: "1:1",
        processingTime: "30 דק׳",
        notes: "צביעה ראשונה, בדיקת רגישות בוצעה"
      },
    ]
  },
  { 
    id: 4, 
    name: "משה פרץ", 
    phone: "053-456-7890",
    email: "moshe.p@email.com",
    visits: 15, 
    lastVisit: "לפני 3 ימים", 
    totalSpent: 720,
    notes: "מעדיף תורים בבוקר מוקדם",
    preferences: ["באז קאט", "מכונה בלבד", "קו"],
    preferredBarber: "מייק",
    visitHistory: [
      { date: "14 מרץ, 2026", service: "באז קאט", barber: "מייק", price: 20 },
    ],
    photos: []
  },
  { 
    id: 5, 
    name: "רון ביטון", 
    phone: "058-567-8901",
    email: "ron.b@email.com",
    visits: 28, 
    lastVisit: "היום", 
    totalSpent: 1580,
    notes: "לקוח VIP, תמיד משאיר טיפ",
    preferences: ["פייד בינוני", "שניהם", "זקן", "מגבת חמה"],
    preferredBarber: "מייק",
    visitHistory: [
      { date: "18 מרץ, 2026", service: "שיער + זקן", barber: "מייק", price: 40 },
      { date: "1 מרץ, 2026", service: "שיער + זקן", barber: "מייק", price: 40 },
    ],
    photos: [
      { before: "/images/features/photos.jpg", after: "/images/features/photos.jpg", date: "18 מרץ, 2026" },
    ]
  },
]

const demoAppointmentsHe = [
  { id: 1, clientId: "demo-client-1", client: "יוסי כהן", service: "פייד", time: "09:00", status: "confirmed", barber: "מיכאל", price: 110 },
  { id: 2, clientId: "demo-client-2", client: "דוד לוי", service: "תספורת קלאסית", time: "10:30", status: "confirmed", barber: "מיכאל", price: 90 },
  { id: 3, clientId: "demo-client-3", client: "משה פרץ", service: "עיצוב זקן", time: "11:00", status: "pending", barber: "שרה", price: 50 },
  { id: 4, clientId: "demo-client-4", client: "אבי מזרחי", service: "צביעת שיער", time: "14:00", status: "confirmed", barber: "שרה", price: 220 },
  { id: 5, clientId: "demo-client-5", client: "רון ביטון", service: "שיער + זקן", time: "15:30", status: "confirmed", barber: "מיכאל", price: 140 },
]

const demoQueueHe = [
  { id: 1, name: "עומר דהן", service: "פייד", waitTime: 15, addedAt: "10:45", status: "waiting" },
  { id: 2, name: "איתי שמעון", service: "זקן", waitTime: 30, addedAt: "10:30", status: "waiting" },
  { id: 3, name: "נועם אברהם", service: "תספורת קלאסית", waitTime: 45, addedAt: "10:15", status: "waiting" },
]

const demoServicesEn = [
  { id: 1, name: "Classic Haircut", price: 25, duration: 30, category: "Haircuts", active: true },
  { id: 2, name: "Fade", price: 30, duration: 45, category: "Haircuts", active: true },
  { id: 3, name: "Buzz Cut", price: 20, duration: 20, category: "Haircuts", active: true },
  { id: 4, name: "Kids Cut", price: 18, duration: 25, category: "Haircuts", active: true },
  { id: 5, name: "Beard Trim", price: 15, duration: 15, category: "Beard", active: true },
  { id: 6, name: "Beard Shave", price: 20, duration: 20, category: "Beard", active: true },
  { id: 7, name: "Hair Color", price: 60, duration: 90, category: "Color", active: true },
  { id: 8, name: "Highlights", price: 80, duration: 120, category: "Color", active: true },
  { id: 9, name: "Hair & Beard Combo", price: 40, duration: 50, category: "Combos", active: true },
]

const demoServicesHe = [
  { id: 1, name: "תספורת קלאסית", price: 90, duration: 30, category: "תספורות", active: true },
  { id: 2, name: "פייד", price: 110, duration: 45, category: "תספורות", active: true },
  { id: 3, name: "באז קאט", price: 70, duration: 20, category: "תספורות", active: true },
  { id: 4, name: "תספורת ילדים", price: 65, duration: 25, category: "תספורות", active: true },
  { id: 5, name: "עיצוב זקן", price: 50, duration: 15, category: "זקן", active: true },
  { id: 6, name: "גילוח זקן", price: 70, duration: 20, category: "זקן", active: true },
  { id: 7, name: "צביעת שיער", price: 220, duration: 90, category: "צבע", active: true },
  { id: 8, name: "גוונים", price: 280, duration: 120, category: "צבע", active: true },
  { id: 9, name: "שיער + זקן", price: 140, duration: 50, category: "חבילות", active: true },
]

const demoAppointmentsEn = [
  { id: 1, clientId: "demo-client-1", client: "Marcus Johnson", service: "Fade", time: "09:00", status: "confirmed", barber: "Mike", price: 30 },
  { id: 2, clientId: "demo-client-2", client: "David Chen", service: "Classic Haircut", time: "10:30", status: "confirmed", barber: "Mike", price: 25 },
  { id: 3, clientId: "demo-client-3", client: "James Williams", service: "Beard Trim", time: "11:00", status: "pending", barber: "Sarah", price: 15 },
  { id: 4, clientId: "demo-client-4", client: "Alex Thompson", service: "Hair Color", time: "14:00", status: "confirmed", barber: "Sarah", price: 60 },
  { id: 5, clientId: "demo-client-5", client: "Michael Rodriguez", service: "Hair & Beard Combo", time: "15:30", status: "confirmed", barber: "Mike", price: 40 },
]

const demoQueueEn = [
  { id: 1, name: "John Smith", service: "Fade", waitTime: 15, addedAt: "10:45 AM", status: "waiting" },
  { id: 2, name: "Robert Brown", service: "Beard Trim", waitTime: 30, addedAt: "10:30 AM", status: "waiting" },
  { id: 3, name: "Chris Davis", service: "Classic Haircut", waitTime: 45, addedAt: "10:15 AM", status: "waiting" },
]

const demoInventoryEn = [
  { id: 1, name: "Premium Pomade", stock: 24, minStock: 10, category: "Hair Products", price: 18, sku: "HP-001" },
  { id: 2, name: "Hair Gel Strong Hold", stock: 18, minStock: 10, category: "Hair Products", price: 12, sku: "HP-002" },
  { id: 3, name: "Beard Oil Premium", stock: 3, minStock: 5, category: "Beard Products", price: 22, sku: "BP-001", lowStock: true },
  { id: 4, name: "Shampoo Professional", stock: 12, minStock: 8, category: "Hair Products", price: 15, sku: "HP-003" },
  { id: 5, name: "Hair Color - Black 1N", stock: 8, minStock: 5, category: "Color", price: 25, sku: "CL-001" },
  { id: 6, name: "Developer 20 Vol", stock: 2, minStock: 5, category: "Color", price: 12, sku: "CL-002", lowStock: true },
  { id: 7, name: "Clipper Blades #1", stock: 6, minStock: 4, category: "Tools", price: 35, sku: "TL-001" },
  { id: 8, name: "Neck Strips (Box)", stock: 150, minStock: 50, category: "Consumables", price: 8, sku: "CN-001" },
  { id: 9, name: "Disinfectant Spray", stock: 4, minStock: 3, category: "Consumables", price: 12, sku: "CN-002" },
  { id: 10, name: "Styling Wax", stock: 15, minStock: 8, category: "Hair Products", price: 16, sku: "HP-004" },
]

const demoInventoryHe = [
  { id: 1, name: "פומייד פרימיום", stock: 24, minStock: 10, category: "מוצרי שיער", price: 65, sku: "HP-001" },
  { id: 2, name: "ג׳ל חזק", stock: 18, minStock: 10, category: "מוצרי שיער", price: 45, sku: "HP-002" },
  { id: 3, name: "שמן זקן פרימיום", stock: 3, minStock: 5, category: "מוצרי זקן", price: 80, sku: "BP-001", lowStock: true },
  { id: 4, name: "שמפו מקצועי", stock: 12, minStock: 8, category: "מוצרי ש����ער", price: 55, sku: "HP-003" },
  { id: 5, name: "צבע שיער - שחור 1N", stock: 8, minStock: 5, category: "צבע", price: 90, sku: "CL-001" },
  { id: 6, name: "מפתח 20 וול", stock: 2, minStock: 5, category: "צבע", price: 45, sku: "CL-002", lowStock: true },
  { id: 7, name: "סכיני מכונה #1", stock: 6, minStock: 4, category: "כלים", price: 120, sku: "TL-001" },
  { id: 8, name: "רצועות צוואר (קופסה)", stock: 150, minStock: 50, category: "מתכלים", price: 30, sku: "CN-001" },
  { id: 9, name: "ספריי חיטוי", stock: 4, minStock: 3, category: "מתכלים", price: 45, sku: "CN-002" },
  { id: 10, name: "ווקס עיצוב", stock: 15, minStock: 8, category: "מוצרי שיער", price: 60, sku: "HP-004" },
]

const revenueDataEn = [
  { day: "Mon", revenue: 520, appointments: 12 },
  { day: "Tue", revenue: 650, appointments: 15 },
  { day: "Wed", revenue: 480, appointments: 11 },
  { day: "Thu", revenue: 720, appointments: 18 },
  { day: "Fri", revenue: 850, appointments: 22 },
  { day: "Sat", revenue: 920, appointments: 25 },
  { day: "Sun", revenue: 610, appointments: 14 },
]

const revenueDataHe = [
  { day: "ראשון", revenue: 1850, appointments: 12 },
  { day: "שני", revenue: 2300, appointments: 15 },
  { day: "שלישי", revenue: 1700, appointments: 11 },
  { day: "רביעי", revenue: 2550, appointments: 18 },
  { day: "חמישי", revenue: 3020, appointments: 22 },
  { day: "שישי", revenue: 3280, appointments: 25 },
  { day: "שבת", revenue: 0, appointments: 0 },
]

// Last week revenue data
const lastWeekRevenueDataEn = [
  { day: "Mon", revenue: 440, appointments: 10 },
  { day: "Tue", revenue: 570, appointments: 13 },
  { day: "Wed", revenue: 410, appointments: 9 },
  { day: "Thu", revenue: 640, appointments: 16 },
  { day: "Fri", revenue: 780, appointments: 20 },
  { day: "Sat", revenue: 820, appointments: 22 },
  { day: "Sun", revenue: 530, appointments: 12 },
]

const lastWeekRevenueDataHe = [
  { day: "ראשון", revenue: 1580, appointments: 10 },
  { day: "שני", revenue: 2050, appointments: 13 },
  { day: "שלישי", revenue: 1480, appointments: 9 },
  { day: "רביעי", revenue: 2300, appointments: 16 },
  { day: "חמישי", revenue: 2800, appointments: 20 },
  { day: "שישי", revenue: 2950, appointments: 22 },
  { day: "שבת", revenue: 0, appointments: 0 },
]

// Navigation keys mapped to translation keys
const navigationItems = [
  { key: "dashboard", id: "dashboard", icon: LayoutDashboard },
  { key: "appointments", id: "appointments", icon: Calendar },
  { key: "queue", id: "queue", icon: UsersRound },
  { key: "clients", id: "clients", icon: Users },
  { key: "team", id: "team", icon: UsersRound },
  { key: "services", id: "services", icon: Scissors },
  { key: "inventory", id: "inventory", icon: Package },
  { key: "analytics", id: "analytics", icon: BarChart3 },
  { key: "photos", id: "photos", icon: Camera },
  { key: "settings", id: "settings", icon: Settings },
]

// Demo team data
const demoTeamEn = [
  {
    id: 1,
    name: "Mike Rodriguez",
    role: "Senior Barber",
    email: "mike@primecutsbarbershop.com",
    phone: "(555) 111-2222",
    avatar: "/images/features/clients.jpg",
    status: "working",
    schedule: "Mon-Sat 9AM-6PM",
    appointments: 156,
    revenue: 8450,
    rating: 4.9,
    specialties: ["Fades", "Designs", "Beard Shaping"],
    currentClient: "Marcus Johnson",
    joinDate: "Jan 2023",
  },
  {
    id: 2,
    name: "Sarah Kim",
    role: "Colorist & Stylist",
    email: "sarah@primecutsbarbershop.com",
    phone: "(555) 222-3333",
    avatar: "/images/features/clients.jpg",
    status: "available",
    schedule: "Tue-Sat 10AM-7PM",
    appointments: 142,
    revenue: 7820,
    rating: 4.8,
    specialties: ["Hair Color", "Highlights", "Classic Cuts"],
    currentClient: null,
    joinDate: "Mar 2023",
  },
  {
    id: 3,
    name: "James Wilson",
    role: "Barber",
    email: "james@primecutsbarbershop.com",
    phone: "(555) 333-4444",
    avatar: "/images/features/clients.jpg",
    status: "break",
    schedule: "Mon-Fri 9AM-5PM",
    appointments: 98,
    revenue: 4680,
    rating: 4.7,
    specialties: ["Buzz Cuts", "Kids Cuts", "Beard Trim"],
    currentClient: null,
    joinDate: "Jun 2023",
  },
  {
    id: 4,
    name: "David Park",
    role: "Junior Barber",
    email: "david@primecutsbarbershop.com",
    phone: "(555) 444-5555",
    avatar: "/images/features/clients.jpg",
    status: "off",
    schedule: "Wed-Sun 11AM-8PM",
    appointments: 64,
    revenue: 2890,
    rating: 4.5,
    specialties: ["Classic Cuts", "Fades"],
    currentClient: null,
    joinDate: "Dec 2023",
  },
]

const demoTeamHe = [
  {
    id: 1,
    name: "מיכאל כהן",
    role: "ספר בכיר",
    email: "michael@mispara.co.il",
    phone: "054-111-2222",
    avatar: "/images/features/clients.jpg",
    status: "working",
    schedule: "א׳-ה׳ 09:00-18:00",
    appointments: 156,
    revenue: 30200,
    rating: 4.9,
    specialties: ["פיידים", "עיצובים", "עיצוב זקן"],
    currentClient: "יוסי כהן",
    joinDate: "ינו׳ 2023",
  },
  {
    id: 2,
    name: "שרה לוי",
    role: "קולוריסטית ומעצבת",
    email: "sarah@mispara.co.il",
    phone: "052-222-3333",
    avatar: "/images/features/clients.jpg",
    status: "available",
    schedule: "א׳-ה׳ 10:00-19:00",
    appointments: 142,
    revenue: 27800,
    rating: 4.8,
    specialties: ["צביעת שיער", "גוונים", "תספורות קלאסיות"],
    currentClient: null,
    joinDate: "מרץ 2023",
  },
  {
    id: 3,
    name: "יעקב מזרחי",
    role: "ספר",
    email: "yakov@mispara.co.il",
    phone: "050-333-4444",
    avatar: "/images/features/clients.jpg",
    status: "break",
    schedule: "א׳-ה׳ 09:00-17:00",
    appointments: 98,
    revenue: 16680,
    rating: 4.7,
    specialties: ["באז קאט", "תספורות ילדים", "עיצוב זקן"],
    currentClient: null,
    joinDate: "יוני 2023",
  },
  {
    id: 4,
    name: "דוד אברהם",
    role: "ספר זוטר",
    email: "david@mispara.co.il",
    phone: "053-444-5555",
    avatar: "/images/features/clients.jpg",
    status: "off",
    schedule: "א׳-ו׳ 11:00-20:00",
    appointments: 64,
    revenue: 10290,
    rating: 4.5,
    specialties: ["תספורות קלאסיות", "פיידים"],
    currentClient: null,
    joinDate: "דצמ׳ 2023",
  },
]

// Available preferences options
const PREFERENCE_OPTIONS_EN = {
  styles: ["Low Fade", "Mid Fade", "High Fade", "Skin Fade", "Taper", "Buzz Cut", "Pompadour"],
  cutting: ["Scissors only", "Clippers only", "Both"],
  allergies: ["Hair dye", "Bleach", "Latex", "Certain gels", "Fragrances"],
  other: ["Sensitive scalp", "Thinning hair", "Beard trim", "Hot towel", "Line up"]
}

const PREFERENCE_OPTIONS_HE = {
  styles: ["פייד נמוך", "פייד בינוני", "פייד גבוה", "סקין פייד", "טייפר", "באז קאט", "פומפדור"],
  cutting: ["מספריים בלבד", "מכונה בלבד", "ש��יהם"],
  allergies: ["צבע שיער", "הבהרה", "לטקס", "ג׳לים מסוימים", "בשמים"],
  other: ["קרקפת רגישה", "שיער דליל", "עיצוב זקן", "מגבת חמה", "קו"]
}

// Demo barbers/team
const demoBarbersEn = ["Mike", "Sarah", "Carlos", "Emma"]
const demoBarbersHe = ["מיכאל", "שרה", "יעקב", "דוד"]

export default function DemoPage() {
  const { t, isRTL, locale } = useLanguage()
  const isHebrew = locale === 'he'
  
  // Select locale-specific demo data
  const demoClients = isHebrew ? demoClientsHe : demoClientsEn
  const demoAppointmentsData = isHebrew ? demoAppointmentsHe : demoAppointmentsEn
  const demoQueueData = isHebrew ? demoQueueHe : demoQueueEn
  const demoBarbersList = isHebrew ? demoBarbersHe : demoBarbersEn
  const demoServices = isHebrew ? demoServicesHe : demoServicesEn
  const demoInventory = isHebrew ? demoInventoryHe : demoInventoryEn
  const revenueData = isHebrew ? revenueDataHe : revenueDataEn
  const lastWeekRevenueData = isHebrew ? lastWeekRevenueDataHe : lastWeekRevenueDataEn
  const demoTeam = isHebrew ? demoTeamHe : demoTeamEn
  const PREFERENCE_OPTIONS = isHebrew ? PREFERENCE_OPTIONS_HE : PREFERENCE_OPTIONS_EN
  const shopName = isHebrew ? "המספרה של יוסי" : "Prime Cuts Barbershop"
  const currency = isHebrew ? "₪" : "$"
  
  const [activeSection, setActiveSection] = useState("dashboard")
  const [queue, setQueue] = useState(demoQueueData)
  const [selectedClient, setSelectedClient] = useState<typeof demoClientsEn[0] | null>(null)
  const [clientTab, setClientTab] = useState<"info" | "history" | "photos" | "chemistry">("info")
  const [showAddClient, setShowAddClient] = useState(false)
  
  // New client form state
  const [newClientPrefs, setNewClientPrefs] = useState<string[]>([])
  
  // Appointments with barber assignments
  const [appointments, setAppointments] = useState(demoAppointmentsData)
  
  // Chart week toggle
  const [showLastWeek, setShowLastWeek] = useState(false)
  
  // Update data when locale changes
  useEffect(() => {
    setQueue(isHebrew ? demoQueueHe : demoQueueEn)
    setAppointments(isHebrew ? demoAppointmentsHe : demoAppointmentsEn)
  }, [isHebrew])
  
  const togglePref = (pref: string) => {
    setNewClientPrefs(prev => 
      prev.includes(pref) ? prev.filter(p => p !== pref) : [...prev, pref]
    )
  }
  
  const assignBarber = (aptId: number, barber: string) => {
    setAppointments(prev => 
      prev.map(apt => apt.id === aptId ? { ...apt, barber } : apt)
    )
  }
  
  // Get nav items with translated names
  const navigation = navigationItems.map(item => ({
    ...item,
    name: t(`demo.${item.key}`)
  }))

  const startService = (id: number) => {
    setQueue(queue.map(q => q.id === id ? { ...q, status: "in-progress" } : q))
  }

  const completeService = (id: number) => {
    setQueue(queue.filter(q => q.id !== id))
  }

  const maxRevenue = Math.max(...revenueData.map(d => d.revenue))
  const lastWeekMaxRevenue = Math.max(...lastWeekRevenueData.map(d => d.revenue))

  return (
    <div className={`min-h-screen bg-background grain ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Demo Banner */}
      <div className="bg-primary/10 border-b border-primary/20 px-4 py-2 fixed top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="bg-primary/20 text-primary border-primary">
              {t("demo.title")}
            </Badge>
            <span className="text-sm text-muted-foreground hidden sm:inline">
              {t("demo.subtitle")}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <Button variant="ghost" size="sm" asChild>
              <Link href="/">{t("demo.backToSite")}</Link>
            </Button>
            <Button size="sm" asChild>
              <Link href="/auth/signup">{t("nav.startFreeTrial")}</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className={`hidden lg:fixed lg:inset-y-0 lg:z-40 lg:flex lg:w-72 lg:flex-col pt-12 ${isRTL ? 'lg:right-0' : 'lg:left-0'}`}>
        <div className={`flex grow flex-col gap-y-5 overflow-y-auto glass-strong px-6 pb-4 ${isRTL ? 'border-l border-border' : 'border-r border-border'}`}>
          {/* Logo */}
          <div className="flex h-16 shrink-0 items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center glow-amber-soft">
              <Scissors className="w-5 h-5 text-primary" />
            </div>
            <span className="text-xl font-bold tracking-tight">Tresser</span>
          </div>

          {/* Shop name */}
          <div className="px-3 py-2 rounded-lg bg-secondary/50 border border-border">
            <p className="text-xs text-muted-foreground">{isHebrew ? "חנות הדגמה" : "Demo Shop"}</p>
            <p className="font-medium truncate">{shopName}</p>
          </div>

          {/* Navigation */}
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-1">
              {navigation.map((item) => {
                const isActive = activeSection === item.id
                return (
                  <li key={item.name}>
                    <button
                      onClick={() => {
                        setActiveSection(item.id)
                        setSelectedClient(null)
                      }}
                      className={`w-full group flex gap-x-3 rounded-lg p-3 text-sm font-medium transition-all duration-200 ${
                        isActive 
                          ? "bg-primary/20 text-primary glow-amber-soft" 
                          : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                      }`}
                    >
                      <item.icon className={`h-5 w-5 shrink-0 ${
                        isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                      }`} />
                      {item.name}
                    </button>
                  </li>
                )
              })}
            </ul>

            {/* User section */}
            <div className="mt-auto pt-4 border-t border-border">
              <div className="flex items-center gap-3 px-3 py-2">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-medium">
                  D
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{isHebrew ? "משתמש הדגמה" : "Demo User"}</p>
                  <p className="text-xs text-muted-foreground truncate">demo@blade.app</p>
                </div>
              </div>
            </div>
          </nav>
        </div>
      </div>

      {/* Mobile nav - scrollable */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-card/95 backdrop-blur-sm border-t border-border">
        <div className="flex overflow-x-auto scrollbar-hide gap-1 px-2 py-2">
          {navigation.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveSection(item.id)
                setSelectedClient(null)
              }}
              className={`flex flex-col items-center min-w-[64px] p-2 rounded-lg shrink-0 ${
                activeSection === item.id 
                  ? "text-primary bg-primary/10" 
                  : "text-muted-foreground"
              }`}
            >
              <item.icon className="h-5 w-5" />
              <span className="text-[10px] mt-1 whitespace-nowrap">{item.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main content */}
      <div className={`pt-12 pb-20 lg:pb-6 ${isRTL ? 'lg:pr-72' : 'lg:pl-72'}`}>
        <main className="p-6">
          {/* Client Detail View */}
          {selectedClient ? (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <Button variant="ghost" onClick={() => setSelectedClient(null)}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Clients
                </Button>
              </div>

              <div className="grid lg:grid-cols-3 gap-6">
                {/* Client Info Card */}
                <Card className="lg:col-span-1">
                  <CardContent className="p-6">
                    <div className="flex flex-col items-center text-center">
                      <Avatar className="h-24 w-24 mb-4">
                        <AvatarImage src={selectedClient.avatar} />
                        <AvatarFallback className="bg-primary/20 text-primary text-2xl">
                          {selectedClient.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <h2 className="text-xl font-bold">{selectedClient.name}</h2>
                      <p className="text-muted-foreground">{selectedClient.email}</p>
                      
                      <div className="flex items-center gap-2 mt-3">
                        <Button variant="outline" size="sm">
                          <Phone className="h-4 w-4 mr-1" />
                          Call
                        </Button>
                        <Button variant="outline" size="sm">
                          <Mail className="h-4 w-4 mr-1" />
                          Email
                        </Button>
                      </div>

                      <div className="grid grid-cols-3 gap-4 mt-6 w-full">
                        <div className="text-center">
                          <p className="text-2xl font-bold text-primary">{selectedClient.visits}</p>
                          <p className="text-xs text-muted-foreground">Visits</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-primary">{currency}{selectedClient.totalSpent}</p>
                          <p className="text-xs text-muted-foreground">Total Spent</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-primary">{selectedClient.lastVisit}</p>
                          <p className="text-xs text-muted-foreground">Last Visit</p>
                        </div>
                      </div>

                      {/* Preferences */}
                      {selectedClient.preferences && selectedClient.preferences.length > 0 && (
                        <div className="mt-6 p-3 bg-muted/30 rounded-lg w-full text-left">
                          <p className="text-xs text-muted-foreground mb-2">{t("demo.preferences")}</p>
                          <div className="flex flex-wrap gap-1.5">
                            {selectedClient.preferences.map((pref: string) => (
                              <Badge 
                                key={pref} 
                                variant={PREFERENCE_OPTIONS.allergies.includes(pref) ? "destructive" : "default"}
                                className="text-xs"
                              >
                                {pref}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="flex gap-3 w-full mt-3">
                        {selectedClient.preferredBarber && (
                          <div className="flex-1 p-3 bg-muted/30 rounded-lg text-left">
                            <p className="text-xs text-muted-foreground mb-1">Preferred Barber</p>
                            <p className="text-sm font-medium">{selectedClient.preferredBarber}</p>
                          </div>
                        )}
                        {selectedClient.notes && (
                          <div className="flex-1 p-3 bg-muted/30 rounded-lg text-left">
                            <p className="text-xs text-muted-foreground mb-1">Notes</p>
                            <p className="text-sm">{selectedClient.notes}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Client Details Tabs */}
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <div className="flex gap-2">
                      <Button 
                        variant={clientTab === "info" ? "default" : "outline"} 
                        size="sm"
                        onClick={() => setClientTab("info")}
                      >
                        Visit History
                      </Button>
                      <Button 
                        variant={clientTab === "photos" ? "default" : "outline"} 
                        size="sm"
                        onClick={() => setClientTab("photos")}
                      >
                        <Camera className="h-4 w-4 mr-1" />
                        Photos
                      </Button>
                      {selectedClient.hasChemistry && (
                        <Button 
                          variant={clientTab === "chemistry" ? "default" : "outline"} 
                          size="sm"
                          onClick={() => setClientTab("chemistry")}
                        >
                          <FlaskConical className="h-4 w-4 mr-1" />
                          Chemistry
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    {clientTab === "info" && (
                      <div className="space-y-3">
                        {selectedClient.visitHistory?.map((visit, i) => (
                          <div key={i} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                                <Calendar className="h-5 w-5 text-primary" />
                              </div>
                              <div>
                                <p className="font-medium">{visit.service}</p>
                                <p className="text-sm text-muted-foreground">{visit.date} - {visit.barber}</p>
                              </div>
                            </div>
                            <p className="font-bold text-primary">{currency}{visit.price}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {clientTab === "photos" && (
                      <div>
                        {selectedClient.photos && selectedClient.photos.length > 0 ? (
                          <div className="grid grid-cols-2 gap-4">
                            {selectedClient.photos.map((photo, i) => (
                              <div key={i} className="border border-border rounded-lg overflow-hidden">
                                <div className="p-2 bg-muted/30">
                                  <p className="text-xs text-muted-foreground">{photo.date}</p>
                                </div>
                                <div className="grid grid-cols-2">
                                  <div className="relative aspect-square">
                                    <Image 
                                      src={photo.before} 
                                      alt="Before" 
                                      fill 
                                      className="object-cover"
                                    />
                                    <Badge className="absolute bottom-2 left-2 text-xs">Before</Badge>
                                  </div>
                                  <div className="relative aspect-square">
                                    <Image 
                                      src={photo.after} 
                                      alt="After" 
                                      fill 
                                      className="object-cover"
                                    />
                                    <Badge className="absolute bottom-2 left-2 text-xs">After</Badge>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-12 text-muted-foreground">
                            <Camera className="h-12 w-12 mx-auto mb-4 opacity-50" />
                            <p>No photos yet</p>
                            <Button variant="outline" size="sm" className="mt-4">
                              <Plus className="h-4 w-4 mr-1" />
                              Add Photo
                            </Button>
                          </div>
                        )}
                      </div>
                    )}

                    {clientTab === "chemistry" && selectedClient.chemistry && (
                      <div className="space-y-4">
                        {selectedClient.chemistry.map((record, i) => (
                          <div key={i} className="p-4 border border-border rounded-lg">
                            <div className="flex items-center justify-between mb-3">
                              <Badge variant="outline">{record.date}</Badge>
                              <span className="text-sm text-muted-foreground">{record.colorBrand}</span>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                              <div>
                                <p className="text-xs text-muted-foreground">Formula</p>
                                <p className="font-bold text-primary">{record.formula}</p>
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground">Developer</p>
                                <p className="font-medium">{record.developer}</p>
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground">Ratio</p>
                                <p className="font-medium">{record.ratio}</p>
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground">Processing Time</p>
                                <p className="font-medium">{record.processingTime}</p>
                              </div>
                            </div>
                            {record.notes && (
                              <div className="mt-3 pt-3 border-t border-border">
                                <p className="text-sm text-muted-foreground">{record.notes}</p>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          ) : (
            <>
              {/* Dashboard */}
              {activeSection === "dashboard" && (
                <div className="space-y-6">
                  <h1 className="text-2xl font-bold">{t("demo.dashboard")}</h1>
                  
                  {/* Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Card className="bg-card border-border">
                      <CardContent className="p-6 relative">
                        <Badge className="absolute top-6 end-6 bg-green-500/20 text-green-400">+12%</Badge>
                        <div className="p-3 bg-primary/10 rounded-xl w-fit mb-4">
                          <Calendar className="h-6 w-6 text-primary" />
                        </div>
                        <p className="text-3xl font-bold">5</p>
                        <p className="text-sm text-muted-foreground">{t("demo.todaysAppointments")}</p>
                      </CardContent>
                    </Card>
                    <Card className="bg-card border-border">
                      <CardContent className="p-6 relative">
                        <Badge className="absolute top-6 end-6 bg-green-500/20 text-green-400">+8%</Badge>
                        <div className="p-3 bg-primary/10 rounded-xl w-fit mb-4">
                          <Users className="h-6 w-6 text-primary" />
                        </div>
                        <p className="text-3xl font-bold">127</p>
                        <p className="text-sm text-muted-foreground">{t("demo.totalClientsLabel")}</p>
                      </CardContent>
                    </Card>
                    <Card className="bg-card border-border">
                      <CardContent className="p-6 relative">
                        <Badge className="absolute top-6 end-6 bg-green-500/20 text-green-400">+23%</Badge>
                        <div className="p-3 bg-primary/10 rounded-xl w-fit mb-4">
                          <DollarSign className="h-6 w-6 text-primary" />
                        </div>
                        <p className="text-3xl font-bold">{isHebrew ? "₪14,700" : "$4,750"}</p>
                        <p className="text-sm text-muted-foreground">{t("demo.thisWeekRevenue")}</p>
                      </CardContent>
                    </Card>
                    <Card className="bg-card border-border">
                      <CardContent className="p-6 relative">
                        <Badge className="absolute top-6 end-6 bg-yellow-500/20 text-yellow-400">3</Badge>
                        <div className="p-3 bg-primary/10 rounded-xl w-fit mb-4">
                          <Clock className="h-6 w-6 text-primary" />
                        </div>
                        <p className="text-3xl font-bold">3</p>
                        <p className="text-sm text-muted-foreground">{t("demo.walkInsWaiting")}</p>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="grid lg:grid-cols-2 gap-6">
                    {/* Today's Schedule */}
                    <Card>
                      <CardHeader>
                        <CardTitle>{t("demo.todaysSchedule")}</CardTitle>
                        <CardDescription>{t("demo.manageAppointments")}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {appointments.map((apt) => (
                            <div key={apt.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                              <div className="flex items-center gap-3">
                                <div className="text-center min-w-[50px]">
                                  <p className="text-lg font-bold text-primary">{apt.time}</p>
                                </div>
                                <Avatar className="h-10 w-10 bg-primary/20">
                                  <AvatarFallback className="text-primary">
                                    {apt.client.split(' ').map(n => n[0]).join('')}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <button 
                                    onClick={() => setActiveSection("clients")}
                                    className="font-medium hover:text-primary transition-colors text-left"
                                  >
                                    {apt.client}
                                  </button>
                                  <p className="text-sm text-muted-foreground">{apt.service}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                {apt.barber ? (
                                  <Badge variant="outline" className="text-xs">
                                    {apt.barber}
                                  </Badge>
                                ) : (
                                  <Select onValueChange={(value) => assignBarber(apt.id, value)}>
                                    <SelectTrigger className="w-24 h-7 text-xs">
                                      <SelectValue placeholder="Assign" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {demoBarbersList.map((barber) => (
                                        <SelectItem key={barber} value={barber}>
                                          {barber}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                )}
                                <Badge variant={apt.status === "confirmed" ? "default" : "secondary"}>
                                  {isHebrew ? (apt.status === "confirmed" ? "מאושר" : "ממתין") : apt.status}
                                </Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Weekly Revenue Chart */}
                    <Card>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle>{t("demo.weeklyRevenueLabel")}</CardTitle>
                            <CardDescription>
                              {showLastWeek 
                                ? (isHebrew ? "שבוע שעבר" : "Last week") 
                                : (isHebrew ? "השבוע הנוכחי" : "Current week")}
                            </CardDescription>
                          </div>
                          <div className={`flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                            <button 
                              onClick={() => setShowLastWeek(false)}
                              className={`p-1.5 rounded-md transition-colors ${!showLastWeek ? 'bg-primary/20 text-primary' : 'hover:bg-muted text-muted-foreground hover:text-foreground'}`}
                            >
                              <ChevronLeft className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => setShowLastWeek(true)}
                              className={`p-1.5 rounded-md transition-colors ${showLastWeek ? 'bg-primary/20 text-primary' : 'hover:bg-muted text-muted-foreground hover:text-foreground'}`}
                            >
                              <ChevronRight className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {(showLastWeek ? lastWeekRevenueData : revenueData).map((data, i) => (
                            <div key={i} className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                              <span className="text-xs text-muted-foreground w-12">{data.day}</span>
                              <div className="flex-1 h-8 bg-background/50 rounded-md overflow-hidden">
                                <div 
                                  className={`h-full rounded-md transition-all duration-500 ${showLastWeek ? 'bg-muted-foreground/60' : 'bg-primary'} ${isRTL ? 'ml-auto' : ''}`}
                                  style={{ width: `${Math.max((data.revenue / (showLastWeek ? lastWeekMaxRevenue : maxRevenue)) * 100, 5)}%` }}
                                />
                              </div>
                              <span className={`text-xs font-medium w-20 font-mono ${isRTL ? 'text-left' : 'text-right'}`}>
                                {currency}{data.revenue.toLocaleString()}
                              </span>
                            </div>
                          ))}
                        </div>
                        <div className={`mt-4 pt-4 border-t border-border/30 flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                          <span className="text-sm text-muted-foreground">
                            {showLastWeek 
                              ? (isHebrew ? "סה״כ שבוע שעבר" : "Total last week")
                              : (isHebrew ? "סה״כ השבוע" : "Total this week")}
                          </span>
                          <span className={`text-xl font-bold ${showLastWeek ? 'text-muted-foreground' : 'text-primary'}`}>
                            {currency}{(showLastWeek ? lastWeekRevenueData : revenueData).reduce((sum, d) => sum + d.revenue, 0).toLocaleString()}
                          </span>
                        </div>
                        {showLastWeek && (
                          <div className={`mt-3 flex items-center gap-2 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
                            <span className="text-sm text-green-500 font-bold">+11.7%</span>
                            <span className="text-xs text-muted-foreground">{isHebrew ? "השבוע לעומת שבוע שעבר" : "this week vs last"}</span>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}

              {/* Appointments */}
              {activeSection === "appointments" && (
                <div className="space-y-6">
                  <h1 className="text-2xl font-bold">{isHebrew ? "תורים" : "Appointments"}</h1>
                  <Card>
                    <CardContent className="p-0">
                      <div className="divide-y divide-border">
                        {appointments.map((apt) => (
                          <div key={apt.id} className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors">
                            <div className="flex items-center gap-4">
                              <div className="text-center min-w-[60px]">
                                <p className="text-xl font-bold text-primary">{apt.time}</p>
                              </div>
                              <Avatar className="h-12 w-12 bg-primary/20">
                                <AvatarFallback className="text-primary font-bold">
                                  {apt.client.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-semibold">{apt.client}</p>
                                <p className="text-sm text-muted-foreground">{apt.service} - {currency}{apt.price}</p>
                                <p className="text-xs text-muted-foreground">{isHebrew ? "ספר" : "Barber"}: {apt.barber}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant={apt.status === "confirmed" ? "default" : "secondary"}>
                                {isHebrew ? (apt.status === "confirmed" ? "מאושר" : "ממתין") : apt.status}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Queue */}
              {activeSection === "queue" && (
                <div className="space-y-6">
                  <h1 className="text-2xl font-bold">{isHebrew ? "תור ממתינים" : "Walk-in Queue"}</h1>
                  <Card>
                    <CardContent className="p-0">
                      <div className="divide-y divide-border">
                        {queue.map((person) => (
                          <div key={person.id} className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                                <span className="text-primary font-bold">{person.id}</span>
                              </div>
                              <div>
                                <p className="font-semibold">{person.name}</p>
                                <p className="text-sm text-muted-foreground">{person.service}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-medium">{person.waitTime} {isHebrew ? "דק׳" : "min"}</p>
                              <p className="text-xs text-muted-foreground">{isHebrew ? "נוסף" : "Added"}: {person.addedAt}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Clients */}
              {activeSection === "clients" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">{isHebrew ? "לקוחות" : "Clients"}</h1>
                    <Button onClick={() => setShowAddClient(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      {isHebrew ? "הוסף לקוח" : "Add Client"}
                    </Button>
                  </div>
                  <Card>
                    <CardContent className="p-0">
                      <div className="divide-y divide-border">
                        {demoClients.map((client) => (
                          <div 
                            key={client.id} 
                            className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors cursor-pointer"
                            onClick={() => setSelectedClient(client)}
                          >
                            <div className="flex items-center gap-4">
                              <Avatar className="h-12 w-12 bg-primary/20">
                                <AvatarFallback className="text-primary font-bold">
                                  {client.name.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-semibold">{client.name}</p>
                                <p className="text-sm text-muted-foreground">{client.phone}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-medium">{client.visits} {isHebrew ? "ביקורים" : "visits"}</p>
                              <p className="text-xs text-muted-foreground">{isHebrew ? "אחרון" : "Last"}: {client.lastVisit}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Services */}
              {activeSection === "services" && (
                <div className="space-y-6">
                  <h1 className="text-2xl font-bold">{isHebrew ? "שירותים" : "Services"}</h1>
                  <Card>
                    <CardContent className="p-0">
                      <div className="divide-y divide-border">
                        {demoServices.map((service) => (
                          <div key={service.id} className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
                                <Scissors className="h-6 w-6 text-primary" />
                              </div>
                              <div>
                                <p className="font-semibold">{service.name}</p>
                                <p className="text-sm text-muted-foreground">{service.duration} {isHebrew ? "דק׳" : "min"} • {service.category}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-lg font-bold text-primary">{currency}{service.price}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Inventory */}
              {activeSection === "inventory" && (
                <div className="space-y-6">
                  <h1 className="text-2xl font-bold">{isHebrew ? "מלאי" : "Inventory"}</h1>
                  <Card>
                    <CardContent className="p-0">
                      <div className="divide-y divide-border">
                        {demoInventory.map((item) => (
                          <div key={item.id} className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors">
                            <div className="flex items-center gap-4">
                              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                                item.lowStock ? "bg-red-500/20" : "bg-primary/20"
                              }`}>
                                <Package className={`h-6 w-6 ${item.lowStock ? "text-red-500" : "text-primary"}`} />
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <p className="font-semibold">{item.name}</p>
                                  {item.lowStock && (
                                    <Badge variant="destructive" className="text-xs">Low Stock</Badge>
                                  )}
                                </div>
                                <p className="text-sm text-muted-foreground">{item.category} - SKU: {item.sku}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-6">
                              <div className="text-right">
                                <p className={`font-bold ${item.lowStock ? "text-red-500" : ""}`}>{item.stock}</p>
                                <p className="text-xs text-muted-foreground">in stock</p>
                              </div>
                              <div className="text-right">
                                <p className="font-medium">{currency}{item.price}</p>
                                <p className="text-xs text-muted-foreground">unit price</p>
                              </div>
                              <Button variant="outline" size="sm">
                                <Plus className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Analytics */}
              {activeSection === "analytics" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">{t("demo.analytics")}</h1>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">{t("demo.thisWeek")}</Button>
                      <Button variant="outline" size="sm">{t("demo.thisMonth")}</Button>
                      <Button size="sm">{t("demo.thisYear")}</Button>
                    </div>
                  </div>
                  
                  {/* Stats Row */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-muted-foreground">Monthly Revenue</p>
                          <DollarSign className="h-5 w-5 text-primary" />
                        </div>
                        <p className="text-3xl font-bold text-primary mt-2">$18,450</p>
                        <div className="flex items-center gap-1 text-green-400 mt-2">
                          <TrendingUp className="h-4 w-4" />
                          <span className="text-sm">+18% vs last month</span>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-muted-foreground">Total Appointments</p>
                          <Calendar className="h-5 w-5 text-primary" />
                        </div>
                        <p className="text-3xl font-bold text-primary mt-2">342</p>
                        <div className="flex items-center gap-1 text-green-400 mt-2">
                          <TrendingUp className="h-4 w-4" />
                          <span className="text-sm">+12% vs last month</span>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-muted-foreground">Avg. Ticket Value</p>
                          <Star className="h-5 w-5 text-primary" />
                        </div>
                        <p className="text-3xl font-bold text-primary mt-2">$53.94</p>
                        <div className="flex items-center gap-1 text-green-400 mt-2">
                          <TrendingUp className="h-4 w-4" />
                          <span className="text-sm">+5% vs last month</span>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-muted-foreground">New Clients</p>
                          <Users className="h-5 w-5 text-primary" />
                        </div>
                        <p className="text-3xl font-bold text-primary mt-2">28</p>
                        <div className="flex items-center gap-1 text-red-400 mt-2">
                          <TrendingDown className="h-4 w-4" />
                          <span className="text-sm">-3% vs last month</span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Charts Row */}
                  <div className="grid lg:grid-cols-2 gap-6">
                    {/* Revenue Chart - Bar */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Weekly Revenue</CardTitle>
                        <CardDescription>Revenue breakdown by day</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="h-[300px]">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={[
                              { day: "Mon", revenue: 520, appointments: 8 },
                              { day: "Tue", revenue: 650, appointments: 10 },
                              { day: "Wed", revenue: 480, appointments: 7 },
                              { day: "Thu", revenue: 720, appointments: 12 },
                              { day: "Fri", revenue: 850, appointments: 14 },
                              { day: "Sat", revenue: 920, appointments: 16 },
                              { day: "Sun", revenue: 610, appointments: 9 },
                            ]}>
                              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                              <XAxis dataKey="day" stroke="rgba(255,255,255,0.5)" fontSize={12} />
                              <YAxis stroke="rgba(255,255,255,0.5)" fontSize={12} tickFormatter={(v) => `${currency}${v}`} />
                              <Tooltip
                                contentStyle={{
                                  backgroundColor: "rgba(20, 20, 25, 0.95)",
                                  border: "1px solid rgba(255,255,255,0.1)",
                                  borderRadius: "8px",
                                  color: "#fff",
                                }}
                                formatter={(value: number, name: string) => [
name === "revenue" ? `${currency}${value}` : value,
                          name === "revenue" ? (isHebrew ? "הכנסות" : "Revenue") : (isHebrew ? "תורים" : "Appointments")
                                ]}
                              />
                              <Bar dataKey="revenue" fill="oklch(0.78 0.18 75)" radius={[4, 4, 0, 0]} />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Monthly Trend - Area Chart */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Revenue Trend</CardTitle>
                        <CardDescription>6-month revenue growth</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="h-[300px]">
                          <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={[
                              { month: "Oct", revenue: 12500, clients: 45 },
                              { month: "Nov", revenue: 14200, clients: 52 },
                              { month: "Dec", revenue: 15800, clients: 58 },
                              { month: "Jan", revenue: 13900, clients: 48 },
                              { month: "Feb", revenue: 16500, clients: 62 },
                              { month: "Mar", revenue: 18450, clients: 68 },
                            ]}>
                              <defs>
                                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="oklch(0.78 0.18 75)" stopOpacity={0.4}/>
                                  <stop offset="95%" stopColor="oklch(0.78 0.18 75)" stopOpacity={0}/>
                                </linearGradient>
                              </defs>
                              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                              <XAxis dataKey="month" stroke="rgba(255,255,255,0.5)" fontSize={12} />
                              <YAxis stroke="rgba(255,255,255,0.5)" fontSize={12} tickFormatter={(v) => `${currency}${(v/1000).toFixed(0)}k`} />
                              <Tooltip
                                contentStyle={{
                                  backgroundColor: "rgba(20, 20, 25, 0.95)",
                                  border: "1px solid rgba(255,255,255,0.1)",
                                  borderRadius: "8px",
                                  color: "#fff",
                                }}
                                formatter={(value: number, name: string) => [
name === "revenue" ? `${currency}${value.toLocaleString()}` : value,
                          name === "revenue" ? (isHebrew ? "הכנסות" : "Revenue") : (isHebrew ? "לקוחות" : "Clients")
                                ]}
                              />
                              <Area type="monotone" dataKey="revenue" stroke="oklch(0.78 0.18 75)" fillOpacity={1} fill="url(#revenueGradient)" strokeWidth={2} />
                            </AreaChart>
                          </ResponsiveContainer>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Second Charts Row */}
                  <div className="grid lg:grid-cols-3 gap-6">
                    {/* Services Breakdown - Pie Chart */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Services Breakdown</CardTitle>
                        <CardDescription>Revenue by service type</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="h-[250px]">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={[
                                  { name: "Haircuts", value: 8500, color: "oklch(0.78 0.18 75)" },
                                  { name: "Beard", value: 3200, color: "oklch(0.68 0.15 75)" },
                                  { name: "Color", value: 4100, color: "oklch(0.58 0.12 75)" },
                                  { name: "Combos", value: 2650, color: "oklch(0.48 0.09 75)" },
                                ]}
                                cx="50%"
                                cy="50%"
                                innerRadius={50}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                              >
                                {[
                                  { name: "Haircuts", value: 8500, color: "oklch(0.78 0.18 75)" },
                                  { name: "Beard", value: 3200, color: "oklch(0.68 0.15 75)" },
                                  { name: "Color", value: 4100, color: "oklch(0.58 0.12 75)" },
                                  { name: "Combos", value: 2650, color: "oklch(0.48 0.09 75)" },
                                ].map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                              </Pie>
                              <Tooltip
                                contentStyle={{
                                  backgroundColor: "rgba(20, 20, 25, 0.95)",
                                  border: "1px solid rgba(255,255,255,0.1)",
                                  borderRadius: "8px",
                                  color: "#fff",
                                }}
                                formatter={(value: number) => [`${currency}${value.toLocaleString()}`, isHebrew ? "הכנסות" : "Revenue"]}
                              />
                              <Legend />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Top Services List */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Top Services</CardTitle>
                        <CardDescription>{isHebrew ? "שירותים מובילים" : "Best performing services"}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {(isHebrew ? [
                            { name: "פייד", bookings: 145, revenue: 15500, growth: 12 },
                            { name: "תספורת קלאסית", bookings: 98, revenue: 8800, growth: 8 },
                            { name: "שיער + זקן", bookings: 67, revenue: 9400, growth: 22 },
                            { name: "צביעת שיער", bookings: 42, revenue: 9200, growth: 15 },
                            { name: "עיצוב זקן", bookings: 54, revenue: 2700, growth: -5 },
                          ] : [
                            { name: "Fade", bookings: 145, revenue: 4350, growth: 12 },
                            { name: "Classic Haircut", bookings: 98, revenue: 2450, growth: 8 },
                            { name: "Hair & Beard Combo", bookings: 67, revenue: 2680, growth: 22 },
                            { name: "Hair Color", bookings: 42, revenue: 2520, growth: 15 },
                            { name: "Beard Trim", bookings: 54, revenue: 810, growth: -5 },
                          ]).map((service, i) => (
                            <div key={i} className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
                                  {i + 1}
                                </div>
                                <div>
                                  <p className="font-medium">{service.name}</p>
                                  <p className="text-sm text-muted-foreground">{service.bookings} {isHebrew ? "הזמנות" : "bookings"}</p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="font-bold text-primary">{currency}{service.revenue}</p>
                                <p className={`text-xs ${service.growth >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                  {service.growth >= 0 ? '+' : ''}{service.growth}%
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Peak Hours */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Peak Hours</CardTitle>
                        <CardDescription>Busiest times of day</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="h-[250px]">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart layout="vertical" data={[
                              { hour: "9-10 AM", bookings: 8 },
                              { hour: "10-11 AM", bookings: 12 },
                              { hour: "11-12 PM", bookings: 15 },
                              { hour: "12-1 PM", bookings: 10 },
                              { hour: "1-2 PM", bookings: 14 },
                              { hour: "2-3 PM", bookings: 18 },
                              { hour: "3-4 PM", bookings: 22 },
                              { hour: "4-5 PM", bookings: 16 },
                            ]}>
                              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                              <XAxis type="number" stroke="rgba(255,255,255,0.5)" fontSize={12} />
                              <YAxis dataKey="hour" type="category" stroke="rgba(255,255,255,0.5)" fontSize={11} width={70} />
                              <Tooltip
                                contentStyle={{
                                  backgroundColor: "rgba(20, 20, 25, 0.95)",
                                  border: "1px solid rgba(255,255,255,0.1)",
                                  borderRadius: "8px",
                                  color: "#fff",
                                }}
                                formatter={(value: number) => [value, "Bookings"]}
                              />
                              <Bar dataKey="bookings" fill="oklch(0.78 0.18 75)" radius={[0, 4, 4, 0]} />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Barber Performance */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Barber Performance</CardTitle>
                      <CardDescription>Individual performance metrics</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b border-border">
                              <th className={`${isRTL ? 'text-right' : 'text-left'} py-3 px-4 font-medium`}>{isHebrew ? "ספר" : "Barber"}</th>
                              <th className={`${isRTL ? 'text-right' : 'text-left'} py-3 px-4 font-medium`}>{isHebrew ? "תורים" : "Appointments"}</th>
                              <th className={`${isRTL ? 'text-right' : 'text-left'} py-3 px-4 font-medium`}>{isHebrew ? "הכנסות" : "Revenue"}</th>
                              <th className={`${isRTL ? 'text-right' : 'text-left'} py-3 px-4 font-medium`}>{isHebrew ? "דירוג" : "Avg. Rating"}</th>
                              <th className={`${isRTL ? 'text-right' : 'text-left'} py-3 px-4 font-medium`}>{isHebrew ? "אי-הגעות" : "No-shows"}</th>
                              <th className={`${isRTL ? 'text-right' : 'text-left'} py-3 px-4 font-medium`}>{isHebrew ? "צמיחה" : "Growth"}</th>
                            </tr>
                          </thead>
                          <tbody>
                            {(isHebrew ? [
                              { name: "מיכאל כהן", appointments: 156, revenue: 30200, rating: 4.9, noShows: 3, growth: 15 },
                              { name: "שרה לוי", appointments: 142, revenue: 27800, rating: 4.8, noShows: 5, growth: 12 },
                              { name: "יעקב מזרחי", appointments: 98, revenue: 16680, rating: 4.7, noShows: 8, growth: -3 },
                            ] : [
                              { name: "Mike Rodriguez", appointments: 156, revenue: 8450, rating: 4.9, noShows: 3, growth: 15 },
                              { name: "Sarah Kim", appointments: 142, revenue: 7820, rating: 4.8, noShows: 5, growth: 12 },
                              { name: "James Wilson", appointments: 98, revenue: 4680, rating: 4.7, noShows: 8, growth: -3 },
                            ]).map((barber, i) => (
                              <tr key={i} className="border-b border-border/50 hover:bg-muted/30">
                                <td className="py-3 px-4">
                                  <div className="flex items-center gap-3">
                                    <Avatar className="h-8 w-8 bg-primary/20">
                                      <AvatarFallback className="text-primary text-xs">
                                        {barber.name.split(' ').map(n => n[0]).join('')}
                                      </AvatarFallback>
                                    </Avatar>
                                    <span className="font-medium">{barber.name}</span>
                                  </div>
                                </td>
                                <td className="py-3 px-4">{barber.appointments}</td>
                                <td className="py-3 px-4 font-bold text-primary">{currency}{barber.revenue.toLocaleString()}</td>
                                <td className="py-3 px-4">
                                  <div className="flex items-center gap-1">
                                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                                    {barber.rating}
                                  </div>
                                </td>
                                <td className="py-3 px-4 text-muted-foreground">{barber.noShows}</td>
                                <td className="py-3 px-4">
                                  <span className={`flex items-center gap-1 ${barber.growth >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                    {barber.growth >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                                    {barber.growth >= 0 ? '+' : ''}{barber.growth}%
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Photos */}
              {activeSection === "photos" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Photo Gallery</h1>
                    <Button>
                      <Camera className="h-4 w-4 mr-2" />
                      Add Photos
                    </Button>
                  </div>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {demoClients.filter(c => c.photos && c.photos.length > 0).flatMap(client => 
                      client.photos!.map((photo, i) => (
                        <Card key={`${client.id}-${i}`} className="overflow-hidden">
                          <div className="p-3 border-b border-border flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="bg-primary/20 text-primary text-xs">
                                {client.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm font-medium">{client.name}</p>
                              <p className="text-xs text-muted-foreground">{photo.date}</p>
                            </div>
                          </div>
                          <div className="grid grid-cols-2">
                            <div className="relative aspect-square">
                              <Image src={photo.before} alt="Before" fill className="object-cover" />
                              <Badge className="absolute bottom-2 left-2 text-xs">Before</Badge>
                            </div>
                            <div className="relative aspect-square">
                              <Image src={photo.after} alt="After" fill className="object-cover" />
                              <Badge className="absolute bottom-2 left-2 text-xs">After</Badge>
                            </div>
                          </div>
                        </Card>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* Team */}
              {activeSection === "team" && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <h1 className="text-2xl font-bold">{t("demo.teamManagement")}</h1>
                    <Button>
                      <Plus className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                      {t("demo.addTeamMember")}
                    </Button>
                  </div>

                  {/* Team Stats */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card>
                      <CardContent className="p-4">
                        <p className="text-sm text-muted-foreground">{t("demo.totalTeam")}</p>
                        <p className="text-2xl font-bold text-primary">4</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <p className="text-sm text-muted-foreground">{t("demo.workingNow")}</p>
                        <p className="text-2xl font-bold text-green-400">1</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <p className="text-sm text-muted-foreground">{t("demo.available")}</p>
                        <p className="text-2xl font-bold text-blue-400">1</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <p className="text-sm text-muted-foreground">{t("demo.onBreakOff")}</p>
                        <p className="text-2xl font-bold text-muted-foreground">2</p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Team Grid */}
                  <div className="grid md:grid-cols-2 gap-6">
                    {demoTeam.map((member) => (
                      <Card key={member.id} className="overflow-hidden">
                        <CardContent className="p-0">
                          <div className="flex flex-col sm:flex-row">
                            {/* Member Info */}
                            <div className="p-6 flex-1">
                              <div className="flex items-start gap-4">
                                <Avatar className="h-16 w-16">
                                  <AvatarImage src={member.avatar} />
                                  <AvatarFallback className="bg-primary/20 text-primary text-xl">
                                    {member.name.split(' ').map(n => n[0]).join('')}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <h3 className="font-semibold text-lg">{member.name}</h3>
                                    <Badge 
                                      variant="outline"
                                      className={
                                        member.status === "working" ? "bg-green-500/20 text-green-400 border-green-500/50" :
                                        member.status === "available" ? "bg-blue-500/20 text-blue-400 border-blue-500/50" :
                                        member.status === "break" ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/50" :
                                        "bg-muted text-muted-foreground"
                                      }
                                    >
                                      {member.status === "working" ? "Working" :
                                       member.status === "available" ? "Available" :
                                       member.status === "break" ? "On Break" : "Off Today"}
                                    </Badge>
                                  </div>
                                  <p className="text-sm text-muted-foreground">{member.role}</p>
                                  <p className="text-xs text-muted-foreground mt-1">{member.schedule}</p>
                                  
                                  {member.currentClient && (
                                    <div className="mt-2 p-2 bg-green-500/10 rounded-lg border border-green-500/20">
                                      <p className="text-xs text-green-400">Currently with: {member.currentClient}</p>
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* Specialties */}
                              <div className="mt-4 flex flex-wrap gap-2">
                                {member.specialties.map((spec, i) => (
                                  <Badge key={i} variant="secondary" className="text-xs">
                                    {spec}
                                  </Badge>
                                ))}
                              </div>

                              {/* Stats */}
                              <div className="mt-4 grid grid-cols-3 gap-4 pt-4 border-t border-border">
                                <div>
                                  <p className="text-lg font-bold text-primary">{member.appointments}</p>
                                  <p className="text-xs text-muted-foreground">Appointments</p>
                                </div>
                                <div>
                                  <p className="text-lg font-bold text-primary">{currency}{member.revenue.toLocaleString()}</p>
                                  <p className="text-xs text-muted-foreground">Revenue</p>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                                  <p className="text-lg font-bold">{member.rating}</p>
                                </div>
                              </div>

                              {/* Actions */}
                              <div className="mt-4 flex gap-2">
                                <Button variant="outline" size="sm" className="flex-1">
                                  <Calendar className="h-4 w-4 mr-1" />
                                  Schedule
                                </Button>
                                <Button variant="outline" size="sm" className="flex-1">
                                  <Phone className="h-4 w-4 mr-1" />
                                  Contact
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {/* Weekly Schedule Overview */}
                  <Card>
                    <CardHeader>
                      <CardTitle>{t("demo.weeklySchedule")}</CardTitle>
                      <CardDescription>{t("demo.teamAvailability")}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="overflow-x-auto">
                        <table className="w-full min-w-[600px]">
                          <thead>
                            <tr className="border-b border-border">
                              <th className="text-left py-3 px-4 font-medium">Team Member</th>
                              <th className="text-center py-3 px-2 font-medium">Mon</th>
                              <th className="text-center py-3 px-2 font-medium">Tue</th>
                              <th className="text-center py-3 px-2 font-medium">Wed</th>
                              <th className="text-center py-3 px-2 font-medium">Thu</th>
                              <th className="text-center py-3 px-2 font-medium">Fri</th>
                              <th className="text-center py-3 px-2 font-medium">Sat</th>
                              <th className="text-center py-3 px-2 font-medium">Sun</th>
                            </tr>
                          </thead>
                          <tbody>
                            {[
                              { name: "Mike R.", schedule: [true, true, true, true, true, true, false] },
                              { name: "Sarah K.", schedule: [false, true, true, true, true, true, false] },
                              { name: "James W.", schedule: [true, true, true, true, true, false, false] },
                              { name: "David P.", schedule: [false, false, true, true, true, true, true] },
                            ].map((member, i) => (
                              <tr key={i} className="border-b border-border/50">
                                <td className="py-3 px-4 font-medium">{member.name}</td>
                                {member.schedule.map((working, j) => (
                                  <td key={j} className="text-center py-3 px-2">
                                    <div className={`w-6 h-6 mx-auto rounded-full ${working ? 'bg-green-500/30' : 'bg-muted'}`}>
                                      {working && <CheckCircle className="h-6 w-6 text-green-500" />}
                                    </div>
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Settings */}
              {activeSection === "settings" && (
                <div className="space-y-6">
                  <h1 className="text-2xl font-bold">{t("demo.settings")}</h1>
                  <div className="grid md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>{t("demo.shopInfo")}</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <label className="text-sm text-muted-foreground">{t("demo.shopName")}</label>
                          <Input value={shopName} disabled />
                        </div>
                        <div>
                          <label className="text-sm text-muted-foreground">{t("demo.address")}</label>
                          <Input value="123 Main Street, New York, NY" disabled />
                        </div>
                        <div>
                          <label className="text-sm text-muted-foreground">{t("demo.phone")}</label>
                          <Input value="(555) 123-4567" disabled />
                        </div>
                        <div>
                          <label className="text-sm text-muted-foreground">{t("demo.email")}</label>
                          <Input value="info@primecuts.com" disabled />
                        </div>
                        <div>
                          <label className="text-sm text-muted-foreground">Phone</label>
                          <Input value="(555) 000-1234" disabled />
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle>{t("demo.businessHours")}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {["Mon", "Tue", "Wed", "Thu", "Fri"].map(day => (
                            <div key={day} className="flex items-center justify-between py-2 border-b border-border">
                              <span>{day}</span>
                              <span className="text-muted-foreground">9:00 AM - 7:00 PM</span>
                            </div>
                          ))}
                          <div className="flex items-center justify-between py-2 border-b border-border">
                            <span>Sat</span>
                            <span className="text-muted-foreground">9:00 AM - 5:00 PM</span>
                          </div>
                          <div className="flex items-center justify-between py-2">
                            <span>Sun</span>
                            <span className="text-muted-foreground">Closed</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {/* Add Client Dialog */}
      <Dialog open={showAddClient} onOpenChange={(open) => {
        setShowAddClient(open)
        if (!open) setNewClientPrefs([])
      }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t("demo.addClient")}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <label className="text-sm font-medium">{t("demo.firstName")}</label>
                <Input placeholder="John" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">{t("demo.lastName")}</label>
                <Input placeholder="Doe" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">{t("demo.phone")}</label>
              <Input placeholder="(555) 123-4567" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">{t("demo.email")}</label>
              <Input placeholder="john@example.com" type="email" />
            </div>
            <div className="space-y-3">
              <label className="text-sm font-medium">{t("demo.preferences")}</label>
              
              {/* Haircut Styles */}
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Haircut Styles</p>
                <div className="flex flex-wrap gap-1.5">
                  {PREFERENCE_OPTIONS.styles.map((pref) => (
                    <Badge 
                      key={pref} 
                      variant={newClientPrefs.includes(pref) ? "default" : "outline"} 
                      className={`cursor-pointer text-xs ${newClientPrefs.includes(pref) ? "bg-primary" : "hover:bg-primary/20"}`}
                      onClick={() => togglePref(pref)}
                    >
                      {pref}
                    </Badge>
                  ))}
                </div>
              </div>
              
              {/* Cutting Preference */}
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Cutting Method</p>
                <div className="flex flex-wrap gap-1.5">
                  {PREFERENCE_OPTIONS.cutting.map((pref) => (
                    <Badge 
                      key={pref} 
                      variant={newClientPrefs.includes(pref) ? "default" : "outline"} 
                      className={`cursor-pointer text-xs ${newClientPrefs.includes(pref) ? "bg-primary" : "hover:bg-primary/20"}`}
                      onClick={() => togglePref(pref)}
                    >
                      {pref}
                    </Badge>
                  ))}
                </div>
              </div>
              
              {/* Allergies */}
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground text-destructive">Allergies / Sensitivities</p>
                <div className="flex flex-wrap gap-1.5">
                  {PREFERENCE_OPTIONS.allergies.map((pref) => (
                    <Badge 
                      key={pref} 
                      variant={newClientPrefs.includes(pref) ? "destructive" : "outline"} 
                      className={`cursor-pointer text-xs ${newClientPrefs.includes(pref) ? "" : "hover:bg-destructive/20"}`}
                      onClick={() => togglePref(pref)}
                    >
                      {pref}
                    </Badge>
                  ))}
                </div>
              </div>
              
              {/* Other */}
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Other</p>
                <div className="flex flex-wrap gap-1.5">
                  {PREFERENCE_OPTIONS.other.map((pref) => (
                    <Badge 
                      key={pref} 
                      variant={newClientPrefs.includes(pref) ? "default" : "outline"} 
                      className={`cursor-pointer text-xs ${newClientPrefs.includes(pref) ? "bg-secondary text-secondary-foreground" : "hover:bg-secondary/50"}`}
                      onClick={() => togglePref(pref)}
                    >
                      {pref}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setShowAddClient(false)}>
                {t("demo.cancel")}
              </Button>
              <Button onClick={() => setShowAddClient(false)}>
                {t("demo.save")}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
