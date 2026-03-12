'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  Box, 
  Plus, 
  Search, 
  Filter,
  MoreVertical,
  Play,
  Square,
  Trash2,
  ExternalLink,
  Terminal,
  Clock,
  Cpu,
  HardDrive,
  Globe
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'

// Mock data
const deployments = [
  { 
    id: '1', 
    name: 'my-nextjs-app', 
    slug: 'my-nextjs-app',
    status: 'running', 
    url: 'my-nextjs-app.user.elitehost.app',
    sourceType: 'github',
    repoUrl: 'github.com/user/my-nextjs-app',
    createdAt: '2024-01-15',
    updatedAt: '2 hours ago',
    cpu: 12,
    memory: 45,
    memoryLimit: '512MB'
  },
  { 
    id: '2', 
    name: 'api-server', 
    slug: 'api-server',
    status: 'running', 
    url: 'api-server.user.elitehost.app',
    sourceType: 'github',
    repoUrl: 'github.com/user/api-server',
    createdAt: '2024-01-10',
    updatedAt: '1 day ago',
    cpu: 8,
    memory: 32,
    memoryLimit: '512MB'
  },
  { 
    id: '3', 
    name: 'landing-page', 
    slug: 'landing-page',
    status: 'stopped', 
    url: 'landing-page.user.elitehost.app',
    sourceType: 'zip',
    createdAt: '2024-01-05',
    updatedAt: '3 days ago',
    cpu: 0,
    memory: 0,
    memoryLimit: '256MB'
  },
  { 
    id: '4', 
    name: 'test-project', 
    slug: 'test-project',
    status: 'failed', 
    url: 'test-project.user.elitehost.app',
    sourceType: 'file',
    createdAt: '2024-01-01',
    updatedAt: '1 week ago',
    cpu: 0,
    memory: 0,
    memoryLimit: '256MB'
  },
]

const statusColors: Record<string, string> = {
  running: 'bg-green-500/10 text-green-500 border-green-500/20',
  stopped: 'bg-muted text-muted-foreground border-border',
  failed: 'bg-destructive/10 text-destructive border-destructive/20',
  building: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
  pending: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
}

export default function DeploysPage() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const filteredDeploys = deployments.filter(deploy => {
    const matchesSearch = deploy.name.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === 'all' || deploy.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Deployments</h1>
          <p className="text-muted-foreground">
            Manage all your deployed applications.
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/new">
            <Plus className="w-4 h-4 mr-2" />
            New Deploy
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search deployments..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-40">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Filter" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="running">Running</SelectItem>
            <SelectItem value="stopped">Stopped</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
            <SelectItem value="building">Building</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Deployments list */}
      <div className="space-y-4">
        {filteredDeploys.length === 0 ? (
          <Card className="border-border/50 bg-card/50">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Box className="w-12 h-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No deployments found</h3>
              <p className="text-muted-foreground text-center mb-4">
                {search || statusFilter !== 'all' 
                  ? 'Try adjusting your filters'
                  : 'Get started by creating your first deployment'
                }
              </p>
              {!search && statusFilter === 'all' && (
                <Button asChild>
                  <Link href="/dashboard/new">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Deployment
                  </Link>
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          filteredDeploys.map((deploy) => (
            <Card key={deploy.id} className="border-border/50 bg-card/50 hover:bg-card/80 transition-colors">
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    <div className={`w-3 h-3 rounded-full mt-1.5 ${
                      deploy.status === 'running' ? 'bg-green-500 animate-pulse' : 
                      deploy.status === 'failed' ? 'bg-destructive' :
                      'bg-muted-foreground'
                    }`} />
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 flex-wrap">
                        <Link 
                          href={`/dashboard/deploys/${deploy.slug}`}
                          className="font-semibold hover:text-primary transition-colors"
                        >
                          {deploy.name}
                        </Link>
                        <Badge variant="outline" className={statusColors[deploy.status]}>
                          {deploy.status}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground flex-wrap">
                        {deploy.status === 'running' && (
                          <a
                            href={`https://${deploy.url}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-primary hover:underline"
                          >
                            <Globe className="w-3 h-3" />
                            {deploy.url}
                          </a>
                        )}
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {deploy.updatedAt}
                        </span>
                        {deploy.repoUrl && (
                          <span className="truncate max-w-[200px]">
                            {deploy.repoUrl}
                          </span>
                        )}
                      </div>

                      {/* Resource usage */}
                      {deploy.status === 'running' && (
                        <div className="flex items-center gap-4 mt-3 text-xs">
                          <div className="flex items-center gap-2">
                            <Cpu className="w-3 h-3 text-muted-foreground" />
                            <div className="w-20 h-1.5 bg-muted rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-primary rounded-full"
                                style={{ width: `${deploy.cpu}%` }}
                              />
                            </div>
                            <span className="text-muted-foreground">{deploy.cpu}%</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <HardDrive className="w-3 h-3 text-muted-foreground" />
                            <div className="w-20 h-1.5 bg-muted rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-accent rounded-full"
                                style={{ width: `${deploy.memory}%` }}
                              />
                            </div>
                            <span className="text-muted-foreground">{deploy.memory}% of {deploy.memoryLimit}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {deploy.status === 'running' ? (
                        <DropdownMenuItem>
                          <Square className="w-4 h-4 mr-2" />
                          Stop
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem>
                          <Play className="w-4 h-4 mr-2" />
                          Start
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem asChild>
                        <Link href={`/dashboard/deploys/${deploy.slug}/logs`}>
                          <Terminal className="w-4 h-4 mr-2" />
                          View Logs
                        </Link>
                      </DropdownMenuItem>
                      {deploy.status === 'running' && (
                        <DropdownMenuItem asChild>
                          <a
                            href={`https://${deploy.url}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <ExternalLink className="w-4 h-4 mr-2" />
                            Open Site
                          </a>
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive focus:text-destructive">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
