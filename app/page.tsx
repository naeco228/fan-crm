import { Dashboard } from '@/components/Dashboard'

export default async function DashboardPage() {
  const stats = {
    totalClients: 0,
    vipClients: 0,
    inactiveClients: 0,
    todayReminders: 0,
    overdueReminders: 0,
    recentClients: []
  }

  return <Dashboard stats={stats} />
}