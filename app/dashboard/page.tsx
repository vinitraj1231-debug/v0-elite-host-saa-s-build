'use client'

import Link from 'next/link'
import { 
  Box, 
  Plus, 
  Zap, 
  ArrowUpRight, 
  Activity,
  Clock,
  CheckCircle,
  AlertCircle,
  Cpu,
  HardDrive
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'

// Mock data - replace with real data from API
const recentDeploys = [
  { 
    id: '1', 
    name: 'my-nextjs-app', 
    slug: 'my-nextjs-app',
    status: 'running', 
    url: 'my-nextjs-app.user.elitehost.app',
    updatedAt: '2 hours ago',
    cpu: 12,
    memory: 45
  },
  { 
    id: '2', 
    name: 'api-server', 
    slug: 'api-server',
    status: 'running', 
    url: 'api-server.user.elitehost.app',
    updatedAt: '1 day ago',
    cpu: 8,
    memory: 32
  },
  { 
    id: '3', 
    name: 'landing-page', 
    slug: 'landing-page',
    status: 'stopped', 
    url: 'landing-page.user.elitehost.app',
    updatedAt: '3 days ago',
    cpu: 0,
    memory: 0
  },
]

const stats = [
  { label: 'Active Deploys', value: '2', icon: Box, trend: '+1 this week' },
  { label: 'Total Requests', value: '12.4K', icon: Activity, trend: '+23% vs last week' },
  { label: 'Uptime', value: '99.9%', icon: CheckCircle, trend: 'Last 30 days' },
  { label: 'Credits', value: '1.5', icon: Zap, trend: 'Expires in 25 days' },
]

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Welcome section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Welcome back!</h1>
          <p className="text-muted-foreground">
            Here&apos;s what&apos;s happening with your deployments.
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/new">
            <Plus className="w-4 h-4 mr-2" />
            New Deploy
          </Link>
        </Button>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="border-border/50 bg-card/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <stat.icon className="w-4 h-4 text-primary" />
                </div>
                <span className="text-sm text-muted-foreground">{stat.label}</span>
              </div>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="text-xs text-muted-foreground mt-1">{stat.trend}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent deployments */}
      <Card className="border-border/50 bg-card/50">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Deployments</CardTitle>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard/deploys">
              View all
              <ArrowUpRight className="w-4 h-4 ml-1" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentDeploys.map((deploy) => (
              <div
                key={deploy.id}
                className="flex items-center justify-between p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-2 h-2 rounded-full ${
                    deploy.status === 'running' ? 'bg-green-500' : 'bg-muted-foreground'
                  }`} />
                  <div>
                    <Link 
                      href={`/dashboard/deploys/${deploy.slug}`}
                      className="font-medium hover:text-primary transition-colors"
                    >
                      {deploy.name}
                    </Link>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {deploy.updatedAt}
                      </span>
                      {deploy.status === 'running' && (
                        <>
                          <span className="flex items-center gap-1">
                            <Cpu className="w-3 h-3" />
                            {deploy.cpu}%
                          </span>
                          <span className="flex items-center gap-1">
                            <HardDrive className="w-3 h-3" />
                            {deploy.memory}%
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  {deploy.status === 'running' && (
                    <a
                      href={`https://${deploy.url}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline hidden sm:block"
                    >
                      {deploy.url}
                    </a>
                  )}
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                    deploy.status === 'running' 
                      ? 'bg-green-500/10 text-green-500' 
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    {deploy.status}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick actions */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="border-border/50 bg-gradient-to-br from-primary/5 via-transparent to-transparent hover:from-primary/10 transition-colors cursor-pointer">
          <CardContent className="p-6">
            <Link href="/dashboard/new?source=github" className="block">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Box className="w-5 h-5 text-primary" />
                </div>
                <span className="font-medium">Deploy from GitHub</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Connect your repository and deploy with a single click.
              </p>
            </Link>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-gradient-to-br from-accent/5 via-transparent to-transparent hover:from-accent/10 transition-colors cursor-pointer">
          <CardContent className="p-6">
            <Link href="/dashboard/ai" className="block">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-accent/10">
                  <Zap className="w-5 h-5 text-accent" />
                </div>
                <span className="font-medium">AI Assistant</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Generate Dockerfiles and fix build errors automatically.
              </p>
            </Link>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-gradient-to-br from-muted/50 via-transparent to-transparent hover:from-muted transition-colors cursor-pointer">
          <CardContent className="p-6">
            <Link href="/dashboard/settings/referrals" className="block">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-muted">
                  <ArrowUpRight className="w-5 h-5" />
                </div>
                <span className="font-medium">Invite Friends</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Earn 0.5 credits for each friend who signs up.
              </p>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
