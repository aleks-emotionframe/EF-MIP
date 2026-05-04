import { Activity, Heart, Users, Eye } from "lucide-react"

export interface CustomerDashboardData {
  stats: { label: string; value: string; change: string; trend: "up" | "down"; icon: any; bg: string; iconColor: string }[]
  visitorData: { name: string; besucher: number; neueFollower: number; engagement: number }[]
  reachData: { name: string; online: number; offline: number }[]
  satisfactionData: { name: string; value: number; color: string }[]
  targetData: { subject: string; ist: number; ziel: number }[]
  topContent: { rank: number; title: string; platform: string; engagement: string; trend: number }[]
  platformData: { name: string; value: number; color: string }[]
  engagementBarData: { name: string; likes: number; kommentare: number; shares: number }[]
}

const CUSTOMER_DATA: Record<string, CustomerDashboardData> = {
  "1": {
    stats: [
      { label: "Gesamt-Reichweite", value: "48.2K", change: "+12%", trend: "up", icon: Eye, bg: "bg-[#00CEC9]/10", iconColor: "text-[#00CEC9]" },
      { label: "Interaktionen", value: "3.840", change: "+8%", trend: "up", icon: Heart, bg: "bg-[#6C5CE7]/10", iconColor: "text-[#6C5CE7]" },
      { label: "Neue Follower", value: "642", change: "+24%", trend: "up", icon: Users, bg: "bg-[#00B894]/10", iconColor: "text-[#00B894]" },
      { label: "Aktive Kampagnen", value: "8", change: "-2", trend: "down", icon: Activity, bg: "bg-[#F97316]/10", iconColor: "text-[#F97316]" },
    ],
    visitorData: [
      { name: "Jan", besucher: 1200, neueFollower: 340, engagement: 890 },
      { name: "Feb", besucher: 1450, neueFollower: 420, engagement: 1020 },
      { name: "Mär", besucher: 1380, neueFollower: 380, engagement: 950 },
      { name: "Apr", besucher: 1680, neueFollower: 510, engagement: 1180 },
      { name: "Mai", besucher: 1520, neueFollower: 460, engagement: 1090 },
      { name: "Jun", besucher: 1890, neueFollower: 580, engagement: 1340 },
      { name: "Jul", besucher: 2100, neueFollower: 640, engagement: 1520 },
    ],
    reachData: [
      { name: "Mo", online: 420, offline: 180 },
      { name: "Di", online: 380, offline: 220 },
      { name: "Mi", online: 510, offline: 190 },
      { name: "Do", online: 460, offline: 240 },
      { name: "Fr", online: 620, offline: 310 },
      { name: "Sa", online: 340, offline: 150 },
      { name: "So", online: 280, offline: 120 },
    ],
    satisfactionData: [
      { name: "Zufrieden", value: 68, color: "#00CEC9" },
      { name: "Neutral", value: 22, color: "#6C5CE7" },
      { name: "Unzufrieden", value: 10, color: "#F97316" },
    ],
    targetData: [
      { subject: "Reichweite", ist: 78, ziel: 90 },
      { subject: "Engagement", ist: 86, ziel: 80 },
      { subject: "Follower", ist: 65, ziel: 85 },
      { subject: "Content", ist: 92, ziel: 75 },
      { subject: "Conversions", ist: 58, ziel: 70 },
    ],
    topContent: [
      { rank: 1, title: "LinkedIn: DevOps Best Practices", platform: "LinkedIn", engagement: "12.4K", trend: 48 },
      { rank: 2, title: "Blog: Cloud Migration Guide", platform: "Website", engagement: "8.2K", trend: 32 },
      { rank: 3, title: "Twitter: Product Launch Thread", platform: "Twitter", engagement: "6.8K", trend: -5 },
      { rank: 4, title: "Instagram: Team Culture Post", platform: "Instagram", engagement: "4.1K", trend: 15 },
    ],
    platformData: [
      { name: "LinkedIn", value: 42, color: "#0A66C2" },
      { name: "Twitter", value: 25, color: "#1DA1F2" },
      { name: "Instagram", value: 18, color: "#E4405F" },
      { name: "YouTube", value: 10, color: "#FF0000" },
      { name: "Facebook", value: 5, color: "#1877F2" },
    ],
    engagementBarData: [
      { name: "Wo 1", likes: 420, kommentare: 180, shares: 90 },
      { name: "Wo 2", likes: 380, kommentare: 210, shares: 120 },
      { name: "Wo 3", likes: 510, kommentare: 240, shares: 95 },
      { name: "Wo 4", likes: 460, kommentare: 190, shares: 140 },
    ],
  },

  "2": {
    stats: [
      { label: "Gesamt-Reichweite", value: "127.5K", change: "+34%", trend: "up", icon: Eye, bg: "bg-[#00CEC9]/10", iconColor: "text-[#00CEC9]" },
      { label: "Interaktionen", value: "18.920", change: "+22%", trend: "up", icon: Heart, bg: "bg-[#6C5CE7]/10", iconColor: "text-[#6C5CE7]" },
      { label: "Neue Follower", value: "2.341", change: "+41%", trend: "up", icon: Users, bg: "bg-[#00B894]/10", iconColor: "text-[#00B894]" },
      { label: "Aktive Kampagnen", value: "14", change: "+3", trend: "up", icon: Activity, bg: "bg-[#F97316]/10", iconColor: "text-[#F97316]" },
    ],
    visitorData: [
      { name: "Jan", besucher: 4200, neueFollower: 1340, engagement: 3890 },
      { name: "Feb", besucher: 5450, neueFollower: 1620, engagement: 4520 },
      { name: "Mär", besucher: 6100, neueFollower: 1880, engagement: 5150 },
      { name: "Apr", besucher: 5800, neueFollower: 1710, engagement: 4880 },
      { name: "Mai", besucher: 7200, neueFollower: 2160, engagement: 6090 },
      { name: "Jun", besucher: 8900, neueFollower: 2580, engagement: 7340 },
      { name: "Jul", besucher: 9500, neueFollower: 2810, engagement: 7920 },
    ],
    reachData: [
      { name: "Mo", online: 1420, offline: 380 },
      { name: "Di", online: 1180, offline: 420 },
      { name: "Mi", online: 1510, offline: 390 },
      { name: "Do", online: 1360, offline: 440 },
      { name: "Fr", online: 1820, offline: 510 },
      { name: "Sa", online: 2340, offline: 650 },
      { name: "So", online: 1980, offline: 520 },
    ],
    satisfactionData: [
      { name: "Zufrieden", value: 82, color: "#00CEC9" },
      { name: "Neutral", value: 13, color: "#6C5CE7" },
      { name: "Unzufrieden", value: 5, color: "#F97316" },
    ],
    targetData: [
      { subject: "Reichweite", ist: 95, ziel: 80 },
      { subject: "Engagement", ist: 88, ziel: 75 },
      { subject: "Follower", ist: 92, ziel: 85 },
      { subject: "Content", ist: 78, ziel: 90 },
      { subject: "Conversions", ist: 71, ziel: 65 },
    ],
    topContent: [
      { rank: 1, title: "Instagram Reel: Sommerkollektion", platform: "Instagram", engagement: "45.2K", trend: 67 },
      { rank: 2, title: "TikTok: Styling-Tipps #OOTD", platform: "TikTok", engagement: "32.8K", trend: 89 },
      { rank: 3, title: "Instagram Story: Flash Sale", platform: "Instagram", engagement: "28.1K", trend: 12 },
      { rank: 4, title: "Facebook: Gewinnspiel Herbst", platform: "Facebook", engagement: "15.4K", trend: -8 },
    ],
    platformData: [
      { name: "Instagram", value: 45, color: "#E4405F" },
      { name: "TikTok", value: 28, color: "#00CEC9" },
      { name: "Facebook", value: 15, color: "#1877F2" },
      { name: "Pinterest", value: 8, color: "#BD081C" },
      { name: "YouTube", value: 4, color: "#FF0000" },
    ],
    engagementBarData: [
      { name: "Wo 1", likes: 2420, kommentare: 890, shares: 540 },
      { name: "Wo 2", likes: 2180, kommentare: 1010, shares: 620 },
      { name: "Wo 3", likes: 3510, kommentare: 1240, shares: 780 },
      { name: "Wo 4", likes: 2860, kommentare: 990, shares: 640 },
    ],
  },

  "3": {
    stats: [
      { label: "Gesamt-Reichweite", value: "15.8K", change: "+6%", trend: "up", icon: Eye, bg: "bg-[#00CEC9]/10", iconColor: "text-[#00CEC9]" },
      { label: "Interaktionen", value: "1.290", change: "-3%", trend: "down", icon: Heart, bg: "bg-[#6C5CE7]/10", iconColor: "text-[#6C5CE7]" },
      { label: "Neue Follower", value: "187", change: "+9%", trend: "up", icon: Users, bg: "bg-[#00B894]/10", iconColor: "text-[#00B894]" },
      { label: "Aktive Kampagnen", value: "3", change: "+1", trend: "up", icon: Activity, bg: "bg-[#F97316]/10", iconColor: "text-[#F97316]" },
    ],
    visitorData: [
      { name: "Jan", besucher: 620, neueFollower: 85, engagement: 340 },
      { name: "Feb", besucher: 580, neueFollower: 72, engagement: 290 },
      { name: "Mär", besucher: 710, neueFollower: 98, engagement: 420 },
      { name: "Apr", besucher: 890, neueFollower: 130, engagement: 580 },
      { name: "Mai", besucher: 950, neueFollower: 145, engagement: 620 },
      { name: "Jun", besucher: 1120, neueFollower: 168, engagement: 740 },
      { name: "Jul", besucher: 1080, neueFollower: 155, engagement: 690 },
    ],
    reachData: [
      { name: "Mo", online: 180, offline: 90 },
      { name: "Di", online: 220, offline: 110 },
      { name: "Mi", online: 260, offline: 130 },
      { name: "Do", online: 310, offline: 160 },
      { name: "Fr", online: 480, offline: 290 },
      { name: "Sa", online: 520, offline: 340 },
      { name: "So", online: 390, offline: 210 },
    ],
    satisfactionData: [
      { name: "Zufrieden", value: 74, color: "#00CEC9" },
      { name: "Neutral", value: 18, color: "#6C5CE7" },
      { name: "Unzufrieden", value: 8, color: "#F97316" },
    ],
    targetData: [
      { subject: "Reichweite", ist: 52, ziel: 70 },
      { subject: "Engagement", ist: 68, ziel: 60 },
      { subject: "Follower", ist: 41, ziel: 65 },
      { subject: "Content", ist: 55, ziel: 80 },
      { subject: "Conversions", ist: 73, ziel: 50 },
    ],
    topContent: [
      { rank: 1, title: "Instagram: Tagesgericht Donnerstag", platform: "Instagram", engagement: "2.1K", trend: 28 },
      { rank: 2, title: "Facebook: Brunch-Event Einladung", platform: "Facebook", engagement: "1.8K", trend: 42 },
      { rank: 3, title: "Google Post: Neue Speisekarte", platform: "Google", engagement: "1.2K", trend: 15 },
      { rank: 4, title: "Instagram: Koch behind the scenes", platform: "Instagram", engagement: "980", trend: -12 },
    ],
    platformData: [
      { name: "Facebook", value: 38, color: "#1877F2" },
      { name: "Instagram", value: 32, color: "#E4405F" },
      { name: "Google", value: 20, color: "#4285F4" },
      { name: "TripAdvisor", value: 7, color: "#00AF87" },
      { name: "TikTok", value: 3, color: "#00CEC9" },
    ],
    engagementBarData: [
      { name: "Wo 1", likes: 180, kommentare: 65, shares: 22 },
      { name: "Wo 2", likes: 210, kommentare: 78, shares: 31 },
      { name: "Wo 3", likes: 195, kommentare: 82, shares: 28 },
      { name: "Wo 4", likes: 240, kommentare: 95, shares: 35 },
    ],
  },

  "4": {
    stats: [
      { label: "Gesamt-Reichweite", value: "72.1K", change: "+18%", trend: "up", icon: Eye, bg: "bg-[#00CEC9]/10", iconColor: "text-[#00CEC9]" },
      { label: "Interaktionen", value: "8.450", change: "+15%", trend: "up", icon: Heart, bg: "bg-[#6C5CE7]/10", iconColor: "text-[#6C5CE7]" },
      { label: "Neue Follower", value: "1.120", change: "+28%", trend: "up", icon: Users, bg: "bg-[#00B894]/10", iconColor: "text-[#00B894]" },
      { label: "Aktive Kampagnen", value: "6", change: "0", trend: "up", icon: Activity, bg: "bg-[#F97316]/10", iconColor: "text-[#F97316]" },
    ],
    visitorData: [
      { name: "Jan", besucher: 980, neueFollower: 210, engagement: 520 },
      { name: "Feb", besucher: 1120, neueFollower: 280, engagement: 640 },
      { name: "Mär", besucher: 2450, neueFollower: 520, engagement: 1380 },
      { name: "Apr", besucher: 3800, neueFollower: 890, engagement: 2240 },
      { name: "Mai", besucher: 4200, neueFollower: 980, engagement: 2680 },
      { name: "Jun", besucher: 5100, neueFollower: 1120, engagement: 3100 },
      { name: "Jul", besucher: 4800, neueFollower: 1050, engagement: 2890 },
    ],
    reachData: [
      { name: "Mo", online: 520, offline: 180 },
      { name: "Di", online: 480, offline: 210 },
      { name: "Mi", online: 610, offline: 240 },
      { name: "Do", online: 580, offline: 220 },
      { name: "Fr", online: 750, offline: 320 },
      { name: "Sa", online: 920, offline: 450 },
      { name: "So", online: 680, offline: 310 },
    ],
    satisfactionData: [
      { name: "Zufrieden", value: 78, color: "#00CEC9" },
      { name: "Neutral", value: 15, color: "#6C5CE7" },
      { name: "Unzufrieden", value: 7, color: "#F97316" },
    ],
    targetData: [
      { subject: "Reichweite", ist: 82, ziel: 75 },
      { subject: "Engagement", ist: 74, ziel: 80 },
      { subject: "Follower", ist: 88, ziel: 70 },
      { subject: "Content", ist: 60, ziel: 85 },
      { subject: "Conversions", ist: 65, ziel: 60 },
    ],
    topContent: [
      { rank: 1, title: "YouTube: Schweiz in 4K Drohnenflug", platform: "YouTube", engagement: "28.5K", trend: 72 },
      { rank: 2, title: "Instagram Reel: Jungfrau Sonnenaufgang", platform: "Instagram", engagement: "19.2K", trend: 45 },
      { rank: 3, title: "TikTok: 3 Geheimtipps Luzern", platform: "TikTok", engagement: "14.8K", trend: 58 },
      { rank: 4, title: "Blog: Wanderrouten Frühling 2026", platform: "Website", engagement: "6.3K", trend: 18 },
    ],
    platformData: [
      { name: "Instagram", value: 35, color: "#E4405F" },
      { name: "YouTube", value: 28, color: "#FF0000" },
      { name: "TikTok", value: 18, color: "#00CEC9" },
      { name: "Facebook", value: 12, color: "#1877F2" },
      { name: "Pinterest", value: 7, color: "#BD081C" },
    ],
    engagementBarData: [
      { name: "Wo 1", likes: 920, kommentare: 380, shares: 290 },
      { name: "Wo 2", likes: 1080, kommentare: 420, shares: 340 },
      { name: "Wo 3", likes: 1240, kommentare: 510, shares: 380 },
      { name: "Wo 4", likes: 1150, kommentare: 460, shares: 310 },
    ],
  },

  "5": {
    stats: [
      { label: "Gesamt-Reichweite", value: "31.4K", change: "+5%", trend: "up", icon: Eye, bg: "bg-[#00CEC9]/10", iconColor: "text-[#00CEC9]" },
      { label: "Interaktionen", value: "2.180", change: "-1%", trend: "down", icon: Heart, bg: "bg-[#6C5CE7]/10", iconColor: "text-[#6C5CE7]" },
      { label: "Neue Follower", value: "318", change: "+7%", trend: "up", icon: Users, bg: "bg-[#00B894]/10", iconColor: "text-[#00B894]" },
      { label: "Aktive Kampagnen", value: "4", change: "+1", trend: "up", icon: Activity, bg: "bg-[#F97316]/10", iconColor: "text-[#F97316]" },
    ],
    visitorData: [
      { name: "Jan", besucher: 2100, neueFollower: 180, engagement: 420 },
      { name: "Feb", besucher: 2250, neueFollower: 195, engagement: 460 },
      { name: "Mär", besucher: 2180, neueFollower: 190, engagement: 440 },
      { name: "Apr", besucher: 2400, neueFollower: 210, engagement: 480 },
      { name: "Mai", besucher: 2350, neueFollower: 205, engagement: 470 },
      { name: "Jun", besucher: 2600, neueFollower: 240, engagement: 520 },
      { name: "Jul", besucher: 2550, neueFollower: 230, engagement: 510 },
    ],
    reachData: [
      { name: "Mo", online: 380, offline: 60 },
      { name: "Di", online: 420, offline: 80 },
      { name: "Mi", online: 450, offline: 70 },
      { name: "Do", online: 410, offline: 90 },
      { name: "Fr", online: 390, offline: 65 },
      { name: "Sa", online: 180, offline: 20 },
      { name: "So", online: 140, offline: 15 },
    ],
    satisfactionData: [
      { name: "Zufrieden", value: 58, color: "#00CEC9" },
      { name: "Neutral", value: 30, color: "#6C5CE7" },
      { name: "Unzufrieden", value: 12, color: "#F97316" },
    ],
    targetData: [
      { subject: "Reichweite", ist: 62, ziel: 80 },
      { subject: "Engagement", ist: 45, ziel: 70 },
      { subject: "Follower", ist: 55, ziel: 75 },
      { subject: "Content", ist: 70, ziel: 85 },
      { subject: "Conversions", ist: 82, ziel: 60 },
    ],
    topContent: [
      { rank: 1, title: "LinkedIn: Marktanalyse Q1 2026", platform: "LinkedIn", engagement: "5.8K", trend: 22 },
      { rank: 2, title: "LinkedIn: Investmenttipps KMU", platform: "LinkedIn", engagement: "4.2K", trend: 15 },
      { rank: 3, title: "Newsletter: Zinsupdate April", platform: "E-Mail", engagement: "3.1K", trend: 8 },
      { rank: 4, title: "Blog: Steueroptimierung 2026", platform: "Website", engagement: "2.4K", trend: -3 },
    ],
    platformData: [
      { name: "LinkedIn", value: 62, color: "#0A66C2" },
      { name: "Xing", value: 18, color: "#006567" },
      { name: "Facebook", value: 10, color: "#1877F2" },
      { name: "Twitter", value: 7, color: "#1DA1F2" },
      { name: "Instagram", value: 3, color: "#E4405F" },
    ],
    engagementBarData: [
      { name: "Wo 1", likes: 280, kommentare: 120, shares: 85 },
      { name: "Wo 2", likes: 310, kommentare: 135, shares: 92 },
      { name: "Wo 3", likes: 290, kommentare: 140, shares: 88 },
      { name: "Wo 4", likes: 320, kommentare: 155, shares: 95 },
    ],
  },

  "ef": {
    stats: [
      { label: "Gesamt-Reichweite", value: "89.4K", change: "+19%", trend: "up", icon: Eye, bg: "bg-[#00CEC9]/10", iconColor: "text-[#00CEC9]" },
      { label: "Interaktionen", value: "12.680", change: "+14%", trend: "up", icon: Heart, bg: "bg-[#6C5CE7]/10", iconColor: "text-[#6C5CE7]" },
      { label: "Neue Follower", value: "1.890", change: "+31%", trend: "up", icon: Users, bg: "bg-[#00B894]/10", iconColor: "text-[#00B894]" },
      { label: "Aktive Kampagnen", value: "11", change: "+2", trend: "up", icon: Activity, bg: "bg-[#F97316]/10", iconColor: "text-[#F97316]" },
    ],
    visitorData: [
      { name: "Jan", besucher: 3200, neueFollower: 820, engagement: 2100 },
      { name: "Feb", besucher: 3850, neueFollower: 960, engagement: 2540 },
      { name: "Mär", besucher: 4100, neueFollower: 1080, engagement: 2890 },
      { name: "Apr", besucher: 4600, neueFollower: 1250, engagement: 3200 },
      { name: "Mai", besucher: 5200, neueFollower: 1420, engagement: 3680 },
      { name: "Jun", besucher: 5800, neueFollower: 1610, engagement: 4100 },
      { name: "Jul", besucher: 6400, neueFollower: 1890, engagement: 4520 },
    ],
    reachData: [
      { name: "Mo", online: 820, offline: 240 },
      { name: "Di", online: 760, offline: 280 },
      { name: "Mi", online: 940, offline: 310 },
      { name: "Do", online: 880, offline: 290 },
      { name: "Fr", online: 1020, offline: 380 },
      { name: "Sa", online: 640, offline: 180 },
      { name: "So", online: 520, offline: 140 },
    ],
    satisfactionData: [
      { name: "Zufrieden", value: 76, color: "#00CEC9" },
      { name: "Neutral", value: 17, color: "#6C5CE7" },
      { name: "Unzufrieden", value: 7, color: "#F97316" },
    ],
    targetData: [
      { subject: "Reichweite", ist: 88, ziel: 85 },
      { subject: "Engagement", ist: 82, ziel: 80 },
      { subject: "Follower", ist: 91, ziel: 75 },
      { subject: "Content", ist: 85, ziel: 90 },
      { subject: "Conversions", ist: 72, ziel: 70 },
    ],
    topContent: [
      { rank: 1, title: "LinkedIn: KI im Marketing 2026", platform: "LinkedIn", engagement: "18.9K", trend: 52 },
      { rank: 2, title: "Instagram: Behind the Scenes EF", platform: "Instagram", engagement: "14.2K", trend: 38 },
      { rank: 3, title: "Blog: Marketing-Trends Schweiz", platform: "Website", engagement: "9.8K", trend: 24 },
      { rank: 4, title: "TikTok: Quick Marketing Hacks", platform: "TikTok", engagement: "7.5K", trend: 61 },
    ],
    platformData: [
      { name: "LinkedIn", value: 35, color: "#0A66C2" },
      { name: "Instagram", value: 28, color: "#E4405F" },
      { name: "TikTok", value: 18, color: "#00CEC9" },
      { name: "Twitter", value: 12, color: "#1DA1F2" },
      { name: "YouTube", value: 7, color: "#FF0000" },
    ],
    engagementBarData: [
      { name: "Wo 1", likes: 1280, kommentare: 520, shares: 340 },
      { name: "Wo 2", likes: 1450, kommentare: 580, shares: 390 },
      { name: "Wo 3", likes: 1620, kommentare: 640, shares: 420 },
      { name: "Wo 4", likes: 1380, kommentare: 560, shares: 360 },
    ],
  },
}

const DEFAULT_DATA = CUSTOMER_DATA["1"]

export function getCustomerDashboardData(customerId: string | null | undefined): CustomerDashboardData {
  if (!customerId) return DEFAULT_DATA
  return CUSTOMER_DATA[customerId] || DEFAULT_DATA
}
