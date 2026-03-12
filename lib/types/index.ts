// EliteHost TypeScript Types

// ============================================
// USER TYPES
// ============================================

export type UserRole = 'user' | 'admin' | 'superadmin'

export interface User {
  id: string
  email: string
  username: string
  displayName?: string
  avatarUrl?: string
  roles: UserRole[]
  oauthProviders: OAuthProvider[]
  totpEnabled: boolean
  isActive: boolean
  isVerified: boolean
  verifiedAt?: string
  createdAt: string
  updatedAt: string
  lastLoginAt?: string
}

export interface OAuthProvider {
  provider: 'google' | 'github'
  providerId: string
  email?: string
  connectedAt: string
}

export interface Session {
  id: string
  userId: string
  deviceInfo: DeviceInfo
  ipAddress: string
  userAgent: string
  createdAt: string
  expiresAt: string
  revokedAt?: string
}

export interface DeviceInfo {
  browser?: string
  os?: string
  device?: string
  isMobile?: boolean
}

// ============================================
// AUTH TYPES
// ============================================

export interface LoginCredentials {
  email: string
  password: string
  totpCode?: string
}

export interface SignupData {
  email: string
  username: string
  password: string
  referralCode?: string
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
  expiresIn: number
}

export interface JWTPayload {
  sub: string // user id
  email: string
  username: string
  roles: UserRole[]
  iat: number
  exp: number
}

// ============================================
// DEPLOYMENT TYPES
// ============================================

export type DeploymentStatus = 
  | 'pending'
  | 'building'
  | 'deploying'
  | 'running'
  | 'stopped'
  | 'failed'
  | 'deleted'

export type SourceType = 'github' | 'zip' | 'file' | 'template'

export interface Deployment {
  id: string
  ownerId: string
  name: string
  slug: string
  description?: string
  
  sourceType: SourceType
  repoUrl?: string
  branch: string
  commitSha?: string
  
  buildCmd?: string
  installCmd?: string
  startCmd?: string
  
  envVars: EnvVar[]
  
  port: number
  dockerfilePath: string
  
  status: DeploymentStatus
  publicUrl?: string
  customDomain?: string
  
  memoryLimit: string
  cpuLimit: string
  
  createdAt: string
  updatedAt: string
  deployedAt?: string
}

export interface EnvVar {
  key: string
  value: string
  isSecret: boolean
}

export interface CreateDeploymentInput {
  name: string
  sourceType: SourceType
  repoUrl?: string
  branch?: string
  buildCmd?: string
  installCmd?: string
  startCmd?: string
  envVars?: EnvVar[]
  port?: number
}

// ============================================
// CONTAINER TYPES
// ============================================

export type ContainerStatus = 
  | 'creating'
  | 'running'
  | 'paused'
  | 'stopped'
  | 'removing'
  | 'exited'
  | 'dead'

export interface Container {
  id: string
  deploymentId: string
  containerId?: string
  imageId?: string
  
  node: string
  hostPort?: number
  internalIp?: string
  
  memoryLimit: number
  cpuLimit: number
  
  runtimeStatus: ContainerStatus
  healthStatus: 'unknown' | 'healthy' | 'unhealthy'
  
  metrics: ContainerMetrics
  
  createdAt: string
  startedAt?: string
  stoppedAt?: string
}

export interface ContainerMetrics {
  cpuPercent: number
  memoryUsed: number
  memoryLimit: number
  networkRxBytes: number
  networkTxBytes: number
  timestamp: string
}

// ============================================
// CREDITS & BILLING TYPES
// ============================================

export type CreditSource = 
  | 'signup_bonus'
  | 'referral'
  | 'purchase'
  | 'admin_grant'
  | 'promotion'

export interface Credit {
  id: string
  userId: string
  amount: number
  remaining: number
  source: CreditSource
  expiresAt?: string
  metadata: Record<string, unknown>
  createdAt: string
}

export type TransactionType =
  | 'credit_add'
  | 'credit_deduct'
  | 'deployment_charge'
  | 'ai_usage'
  | 'refund'
  | 'expiry'

export interface Transaction {
  id: string
  userId: string
  creditId?: string
  action: TransactionType
  amount: number
  balanceAfter: number
  description?: string
  metadata: Record<string, unknown>
  createdAt: string
}

export interface UserBalance {
  total: number
  expiringSoon: number
  expiresAt?: string
}

// ============================================
// REFERRAL TYPES
// ============================================

export type ReferralStatus = 
  | 'pending'
  | 'validated'
  | 'rewarded'
  | 'rejected'
  | 'expired'

export interface Referral {
  id: string
  referrerId: string
  referredUserId?: string
  code: string
  status: ReferralStatus
  createdAt: string
  validatedAt?: string
  rewardedAt?: string
}

export interface ReferralStats {
  totalReferrals: number
  validatedReferrals: number
  totalEarned: number
  pendingRewards: number
}

// ============================================
// CHAT TYPES
// ============================================

export type ChatType = 'global' | 'private'

export interface Chat {
  id: string
  type: ChatType
  name?: string
  participants: string[]
  createdAt: string
  updatedAt: string
}

export interface Message {
  id: string
  chatId: string
  senderId: string
  sender?: User
  content: string
  isFlagged: boolean
  flaggedReason?: string
  isEdited: boolean
  editedAt?: string
  createdAt: string
}

// ============================================
// ADMIN TYPES
// ============================================

export interface AdminLog {
  id: string
  adminId: string
  admin?: User
  action: string
  targetType?: string
  targetId?: string
  details: Record<string, unknown>
  ipAddress: string
  createdAt: string
}

export interface Banner {
  id: string
  title: string
  content?: string
  imageUrl?: string
  linkUrl?: string
  position: 'top' | 'bottom' | 'modal'
  isDismissible: boolean
  startsAt: string
  endsAt?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface SystemSettings {
  signupCredits: number
  creditExpiryDays: number
  referralReward: number
  deployCostPerWeek: number
  aiCostPerCall: number
  maxDeploymentsFree: number
  maxMemoryFree: number
  maintenanceMode: boolean
}

// ============================================
// BUILD LOG TYPES
// ============================================

export type LogLevel = 'info' | 'warn' | 'error' | 'debug'

export interface BuildLog {
  id: string
  deploymentId: string
  stage: string
  level: LogLevel
  message: string
  createdAt: string
}

// ============================================
// AI TYPES
// ============================================

export interface AIProvider {
  name: 'openrouter' | 'gemini'
  model: string
  maxTokens: number
  costPerToken: number
}

export interface AIRequest {
  prompt: string
  context?: string
  maxTokens?: number
  temperature?: number
}

export interface AIResponse {
  content: string
  usage: {
    promptTokens: number
    completionTokens: number
    totalTokens: number
  }
  cost: number
  provider: string
  model: string
}

export interface DockerfileGenerationRequest {
  framework?: string
  runtime?: string
  buildLogs?: string
  repoStructure?: string[]
}

// ============================================
// API RESPONSE TYPES
// ============================================

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: {
    code: string
    message: string
    details?: Record<string, unknown>
  }
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

// ============================================
// WEBSOCKET TYPES
// ============================================

export type WSEventType = 
  | 'log'
  | 'metrics'
  | 'status_change'
  | 'chat_message'
  | 'notification'

export interface WSMessage<T = unknown> {
  type: WSEventType
  payload: T
  timestamp: string
}

export interface LogStreamPayload {
  deploymentId: string
  stage: string
  level: LogLevel
  message: string
}

export interface MetricsStreamPayload {
  containerId: string
  metrics: ContainerMetrics
}
