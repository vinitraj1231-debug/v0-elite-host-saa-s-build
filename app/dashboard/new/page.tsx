'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Github, 
  Upload, 
  FileCode, 
  Layers,
  ArrowRight,
  ArrowLeft,
  Loader2,
  Check,
  AlertCircle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'

const sourceTypes = [
  { 
    id: 'github', 
    icon: Github, 
    label: 'GitHub', 
    description: 'Deploy from a GitHub repository' 
  },
  { 
    id: 'zip', 
    icon: Upload, 
    label: 'Upload ZIP', 
    description: 'Upload a ZIP file with your code' 
  },
  { 
    id: 'file', 
    icon: FileCode, 
    label: 'Single File', 
    description: 'Deploy a single file (e.g., server.js)' 
  },
  { 
    id: 'template', 
    icon: Layers, 
    label: 'Template', 
    description: 'Start from a pre-built template' 
  },
]

interface EnvVar {
  key: string
  value: string
  isSecret: boolean
}

export default function NewDeployPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [sourceType, setSourceType] = useState<string | null>(null)
  
  const [formData, setFormData] = useState({
    name: '',
    repoUrl: '',
    branch: 'main',
    buildCmd: '',
    installCmd: '',
    startCmd: '',
    port: '3000',
    envVars: [] as EnvVar[],
    useAiDockerfile: true,
  })

  const addEnvVar = () => {
    setFormData(prev => ({
      ...prev,
      envVars: [...prev.envVars, { key: '', value: '', isSecret: false }]
    }))
  }

  const updateEnvVar = (index: number, field: keyof EnvVar, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      envVars: prev.envVars.map((env, i) => 
        i === index ? { ...env, [field]: value } : env
      )
    }))
  }

  const removeEnvVar = (index: number) => {
    setFormData(prev => ({
      ...prev,
      envVars: prev.envVars.filter((_, i) => i !== index)
    }))
  }

  const handleDeploy = async () => {
    setIsLoading(true)
    // Simulate deployment
    setTimeout(() => {
      router.push('/dashboard/deploys')
    }, 2000)
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Create New Deployment</h1>
        <p className="text-muted-foreground">
          Deploy your code to production in minutes.
        </p>
      </div>

      {/* Progress */}
      <div className="flex items-center gap-2">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              step > s ? 'bg-primary text-primary-foreground' :
              step === s ? 'bg-primary text-primary-foreground' :
              'bg-muted text-muted-foreground'
            }`}>
              {step > s ? <Check className="w-4 h-4" /> : s}
            </div>
            {s < 3 && (
              <div className={`w-12 h-0.5 mx-2 ${
                step > s ? 'bg-primary' : 'bg-muted'
              }`} />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Select Source */}
      {step === 1 && (
        <Card className="border-border/50 bg-card/50">
          <CardHeader>
            <CardTitle>Select Source</CardTitle>
            <CardDescription>
              Choose where your code is coming from.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 gap-4">
              {sourceTypes.map((source) => (
                <button
                  key={source.id}
                  onClick={() => setSourceType(source.id)}
                  className={`p-4 rounded-lg border text-left transition-all ${
                    sourceType === source.id
                      ? 'border-primary bg-primary/5'
                      : 'border-border/50 hover:border-primary/50 hover:bg-muted/50'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`p-2 rounded-lg ${
                      sourceType === source.id ? 'bg-primary/10' : 'bg-muted'
                    }`}>
                      <source.icon className={`w-5 h-5 ${
                        sourceType === source.id ? 'text-primary' : 'text-muted-foreground'
                      }`} />
                    </div>
                    <span className="font-medium">{source.label}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{source.description}</p>
                </button>
              ))}
            </div>

            <div className="flex justify-end mt-6">
              <Button 
                onClick={() => setStep(2)} 
                disabled={!sourceType}
              >
                Continue
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Configure */}
      {step === 2 && (
        <Card className="border-border/50 bg-card/50">
          <CardHeader>
            <CardTitle>Configure Deployment</CardTitle>
            <CardDescription>
              Set up your deployment settings.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Basic info */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Project Name</Label>
                <Input
                  id="name"
                  placeholder="my-awesome-project"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-') })}
                />
                <p className="text-xs text-muted-foreground">
                  URL: {formData.name || 'your-project'}.user.elitehost.app
                </p>
              </div>

              {sourceType === 'github' && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="repoUrl">Repository URL</Label>
                    <Input
                      id="repoUrl"
                      placeholder="https://github.com/user/repo"
                      value={formData.repoUrl}
                      onChange={(e) => setFormData({ ...formData, repoUrl: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="branch">Branch</Label>
                    <Input
                      id="branch"
                      placeholder="main"
                      value={formData.branch}
                      onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                    />
                  </div>
                </>
              )}
            </div>

            {/* Build settings */}
            <div className="space-y-4 pt-4 border-t border-border/50">
              <h3 className="font-medium">Build Settings</h3>
              
              <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                <div>
                  <Label htmlFor="useAi" className="font-medium">Use AI to generate Dockerfile</Label>
                  <p className="text-sm text-muted-foreground">
                    Let AI detect your framework and create an optimized Dockerfile
                  </p>
                </div>
                <Switch
                  id="useAi"
                  checked={formData.useAiDockerfile}
                  onCheckedChange={(checked) => setFormData({ ...formData, useAiDockerfile: checked })}
                />
              </div>

              {!formData.useAiDockerfile && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="installCmd">Install Command</Label>
                    <Input
                      id="installCmd"
                      placeholder="npm install"
                      value={formData.installCmd}
                      onChange={(e) => setFormData({ ...formData, installCmd: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="buildCmd">Build Command</Label>
                    <Input
                      id="buildCmd"
                      placeholder="npm run build"
                      value={formData.buildCmd}
                      onChange={(e) => setFormData({ ...formData, buildCmd: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="startCmd">Start Command</Label>
                    <Input
                      id="startCmd"
                      placeholder="npm start"
                      value={formData.startCmd}
                      onChange={(e) => setFormData({ ...formData, startCmd: e.target.value })}
                    />
                  </div>
                </>
              )}

              <div className="space-y-2">
                <Label htmlFor="port">Port</Label>
                <Input
                  id="port"
                  placeholder="3000"
                  value={formData.port}
                  onChange={(e) => setFormData({ ...formData, port: e.target.value })}
                />
              </div>
            </div>

            <div className="flex justify-between mt-6">
              <Button variant="outline" onClick={() => setStep(1)}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <Button onClick={() => setStep(3)} disabled={!formData.name}>
                Continue
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Environment & Deploy */}
      {step === 3 && (
        <Card className="border-border/50 bg-card/50">
          <CardHeader>
            <CardTitle>Environment Variables</CardTitle>
            <CardDescription>
              Add any environment variables your application needs.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Env vars */}
            <div className="space-y-4">
              {formData.envVars.map((env, index) => (
                <div key={index} className="flex items-start gap-2">
                  <div className="flex-1">
                    <Input
                      placeholder="KEY"
                      value={env.key}
                      onChange={(e) => updateEnvVar(index, 'key', e.target.value.toUpperCase())}
                    />
                  </div>
                  <div className="flex-1">
                    <Input
                      type={env.isSecret ? 'password' : 'text'}
                      placeholder="value"
                      value={env.value}
                      onChange={(e) => updateEnvVar(index, 'value', e.target.value)}
                    />
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeEnvVar(index)}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    &times;
                  </Button>
                </div>
              ))}
              
              <Button variant="outline" onClick={addEnvVar} className="w-full">
                Add Variable
              </Button>
            </div>

            {/* Summary */}
            <div className="p-4 rounded-lg bg-muted/30 space-y-2">
              <h4 className="font-medium">Deployment Summary</h4>
              <div className="text-sm text-muted-foreground space-y-1">
                <p>Name: <span className="text-foreground">{formData.name}</span></p>
                <p>Source: <span className="text-foreground capitalize">{sourceType}</span></p>
                {sourceType === 'github' && (
                  <p>Repository: <span className="text-foreground">{formData.repoUrl}</span></p>
                )}
                <p>Port: <span className="text-foreground">{formData.port}</span></p>
                <p>AI Dockerfile: <span className="text-foreground">{formData.useAiDockerfile ? 'Enabled' : 'Disabled'}</span></p>
              </div>
            </div>

            {/* Cost estimate */}
            <div className="p-4 rounded-lg border border-primary/20 bg-primary/5">
              <div className="flex items-center gap-2 text-primary mb-2">
                <AlertCircle className="w-4 h-4" />
                <span className="font-medium">Cost Estimate</span>
              </div>
              <p className="text-sm text-muted-foreground">
                This deployment will cost approximately <span className="text-foreground font-medium">1 credit per week</span> while running.
                {formData.useAiDockerfile && ' AI Dockerfile generation will cost 0.1 credits.'}
              </p>
            </div>

            <div className="flex justify-between mt-6">
              <Button variant="outline" onClick={() => setStep(2)}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <Button onClick={handleDeploy} disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Deploying...
                  </>
                ) : (
                  <>
                    Deploy
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
