-- EliteHost Database Schema
-- PostgreSQL 14+

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================
-- USERS & AUTHENTICATION
-- ============================================

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255),
    
    -- OAuth providers (JSONB for flexibility)
    oauth_providers JSONB DEFAULT '{}',
    
    -- Profile
    display_name VARCHAR(100),
    avatar_url TEXT,
    
    -- Role-based access control
    roles TEXT[] DEFAULT ARRAY['user'],
    
    -- 2FA
    totp_secret VARCHAR(32),
    totp_enabled BOOLEAN DEFAULT FALSE,
    
    -- Account status
    is_active BOOLEAN DEFAULT TRUE,
    is_verified BOOLEAN DEFAULT FALSE,
    verified_at TIMESTAMP WITH TIME ZONE,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_login_at TIMESTAMP WITH TIME ZONE,
    
    -- Constraints
    CONSTRAINT valid_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    CONSTRAINT valid_username CHECK (username ~* '^[a-z0-9_-]{3,30}$')
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_created_at ON users(created_at);

-- Sessions for JWT refresh tokens
CREATE TABLE sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    refresh_token_hash VARCHAR(255) NOT NULL,
    
    -- Device tracking
    device_info JSONB DEFAULT '{}',
    ip_address INET,
    user_agent TEXT,
    
    -- Validity
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    revoked_at TIMESTAMP WITH TIME ZONE,
    
    -- Constraints
    CONSTRAINT valid_expiry CHECK (expires_at > created_at)
);

CREATE INDEX idx_sessions_user_id ON sessions(user_id);
CREATE INDEX idx_sessions_token_hash ON sessions(refresh_token_hash);
CREATE INDEX idx_sessions_expires_at ON sessions(expires_at);

-- ============================================
-- DEPLOYMENTS
-- ============================================

CREATE TYPE deployment_status AS ENUM (
    'pending',
    'building',
    'deploying',
    'running',
    'stopped',
    'failed',
    'deleted'
);

CREATE TYPE source_type AS ENUM (
    'github',
    'zip',
    'file',
    'template'
);

CREATE TABLE deployments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Deployment info
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL,
    description TEXT,
    
    -- Source
    source_type source_type NOT NULL,
    repo_url TEXT,
    branch VARCHAR(100) DEFAULT 'main',
    commit_sha VARCHAR(40),
    
    -- Build configuration
    build_cmd TEXT,
    install_cmd TEXT,
    start_cmd TEXT,
    
    -- Environment variables (encrypted at rest)
    env_vars_encrypted BYTEA,
    
    -- Runtime
    port INTEGER DEFAULT 3000,
    dockerfile_path TEXT DEFAULT 'Dockerfile',
    
    -- Status & URLs
    status deployment_status DEFAULT 'pending',
    public_url TEXT,
    custom_domain TEXT,
    
    -- Resource limits
    memory_limit VARCHAR(10) DEFAULT '512M',
    cpu_limit VARCHAR(10) DEFAULT '0.5',
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deployed_at TIMESTAMP WITH TIME ZONE,
    
    -- Unique slug per user
    CONSTRAINT unique_user_slug UNIQUE (owner_id, slug)
);

CREATE INDEX idx_deployments_owner ON deployments(owner_id);
CREATE INDEX idx_deployments_status ON deployments(status);
CREATE INDEX idx_deployments_slug ON deployments(slug);
CREATE INDEX idx_deployments_created_at ON deployments(created_at);

-- ============================================
-- CONTAINERS
-- ============================================

CREATE TYPE container_status AS ENUM (
    'creating',
    'running',
    'paused',
    'stopped',
    'removing',
    'exited',
    'dead'
);

CREATE TABLE containers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    deployment_id UUID NOT NULL REFERENCES deployments(id) ON DELETE CASCADE,
    
    -- Docker info
    container_id VARCHAR(64),
    image_id VARCHAR(64),
    
    -- Networking
    node VARCHAR(100) DEFAULT 'primary',
    host_port INTEGER,
    internal_ip INET,
    
    -- Resource limits
    memory_limit BIGINT,
    cpu_limit NUMERIC(4,2),
    
    -- Status
    runtime_status container_status DEFAULT 'creating',
    health_status VARCHAR(20) DEFAULT 'unknown',
    
    -- Metrics snapshot (updated periodically)
    metrics_json JSONB DEFAULT '{}',
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    started_at TIMESTAMP WITH TIME ZONE,
    stopped_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_containers_deployment ON containers(deployment_id);
CREATE INDEX idx_containers_status ON containers(runtime_status);
CREATE INDEX idx_containers_host_port ON containers(host_port);

-- ============================================
-- CREDITS & BILLING
-- ============================================

CREATE TYPE credit_source AS ENUM (
    'signup_bonus',
    'referral',
    'purchase',
    'admin_grant',
    'promotion'
);

CREATE TABLE credits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    amount NUMERIC(10,2) NOT NULL,
    remaining NUMERIC(10,2) NOT NULL,
    source credit_source NOT NULL,
    
    -- Expiry
    expires_at TIMESTAMP WITH TIME ZONE,
    
    -- Metadata
    metadata JSONB DEFAULT '{}',
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT positive_amount CHECK (amount > 0),
    CONSTRAINT valid_remaining CHECK (remaining >= 0 AND remaining <= amount)
);

CREATE INDEX idx_credits_user ON credits(user_id);
CREATE INDEX idx_credits_expires ON credits(expires_at);

CREATE TYPE transaction_type AS ENUM (
    'credit_add',
    'credit_deduct',
    'deployment_charge',
    'ai_usage',
    'refund',
    'expiry'
);

CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    credit_id UUID REFERENCES credits(id),
    
    action transaction_type NOT NULL,
    amount NUMERIC(10,2) NOT NULL,
    balance_after NUMERIC(10,2) NOT NULL,
    
    description TEXT,
    metadata JSONB DEFAULT '{}',
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_transactions_user ON transactions(user_id);
CREATE INDEX idx_transactions_created_at ON transactions(created_at);

-- ============================================
-- REFERRALS
-- ============================================

CREATE TYPE referral_status AS ENUM (
    'pending',
    'validated',
    'rewarded',
    'rejected',
    'expired'
);

CREATE TABLE referrals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    referrer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    referred_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    
    code VARCHAR(20) UNIQUE NOT NULL,
    status referral_status DEFAULT 'pending',
    
    -- Fraud detection
    referred_ip INET,
    referred_device_hash VARCHAR(64),
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    validated_at TIMESTAMP WITH TIME ZONE,
    rewarded_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_referrals_referrer ON referrals(referrer_id);
CREATE INDEX idx_referrals_code ON referrals(code);
CREATE INDEX idx_referrals_status ON referrals(status);

-- ============================================
-- CHAT SYSTEM
-- ============================================

CREATE TYPE chat_type AS ENUM ('global', 'private');

CREATE TABLE chats (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type chat_type NOT NULL,
    name VARCHAR(100),
    
    -- For private chats
    participants UUID[] DEFAULT '{}',
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_chats_type ON chats(type);
CREATE INDEX idx_chats_participants ON chats USING GIN (participants);

CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    chat_id UUID NOT NULL REFERENCES chats(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    content TEXT NOT NULL,
    
    -- Moderation
    is_flagged BOOLEAN DEFAULT FALSE,
    flagged_reason TEXT,
    
    -- Edit tracking
    is_edited BOOLEAN DEFAULT FALSE,
    edited_at TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_messages_chat ON messages(chat_id);
CREATE INDEX idx_messages_sender ON messages(sender_id);
CREATE INDEX idx_messages_created_at ON messages(created_at);

-- ============================================
-- ADMIN & SYSTEM
-- ============================================

CREATE TABLE admin_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    admin_id UUID NOT NULL REFERENCES users(id),
    
    action VARCHAR(100) NOT NULL,
    target_type VARCHAR(50),
    target_id UUID,
    
    details JSONB DEFAULT '{}',
    ip_address INET,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_admin_logs_admin ON admin_logs(admin_id);
CREATE INDEX idx_admin_logs_action ON admin_logs(action);
CREATE INDEX idx_admin_logs_created_at ON admin_logs(created_at);

CREATE TABLE banners (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    title VARCHAR(200) NOT NULL,
    content TEXT,
    image_url TEXT,
    link_url TEXT,
    
    -- Display settings
    position VARCHAR(20) DEFAULT 'top',
    is_dismissible BOOLEAN DEFAULT TRUE,
    
    -- Scheduling
    starts_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    ends_at TIMESTAMP WITH TIME ZONE,
    
    is_active BOOLEAN DEFAULT TRUE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_banners_active ON banners(is_active, starts_at, ends_at);

CREATE TABLE system_settings (
    key VARCHAR(100) PRIMARY KEY,
    value JSONB NOT NULL,
    description TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_by UUID REFERENCES users(id)
);

CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    
    event_type VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50),
    entity_id UUID,
    
    old_values JSONB,
    new_values JSONB,
    
    ip_address INET,
    user_agent TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_event ON audit_logs(event_type);
CREATE INDEX idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);

-- ============================================
-- BUILD LOGS
-- ============================================

CREATE TABLE build_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    deployment_id UUID NOT NULL REFERENCES deployments(id) ON DELETE CASCADE,
    
    stage VARCHAR(50) NOT NULL,
    level VARCHAR(10) DEFAULT 'info',
    message TEXT NOT NULL,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_build_logs_deployment ON build_logs(deployment_id);
CREATE INDEX idx_build_logs_created_at ON build_logs(created_at);

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_deployments_updated_at
    BEFORE UPDATE ON deployments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_chats_updated_at
    BEFORE UPDATE ON chats
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_banners_updated_at
    BEFORE UPDATE ON banners
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Function to get user's total available credits
CREATE OR REPLACE FUNCTION get_user_credits(p_user_id UUID)
RETURNS NUMERIC AS $$
BEGIN
    RETURN COALESCE(
        (SELECT SUM(remaining) 
         FROM credits 
         WHERE user_id = p_user_id 
           AND remaining > 0 
           AND (expires_at IS NULL OR expires_at > CURRENT_TIMESTAMP)),
        0
    );
END;
$$ LANGUAGE plpgsql;

-- Function to deduct credits (FIFO by expiry)
CREATE OR REPLACE FUNCTION deduct_credits(
    p_user_id UUID,
    p_amount NUMERIC,
    p_description TEXT DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
    v_remaining NUMERIC := p_amount;
    v_credit RECORD;
    v_deduct NUMERIC;
    v_balance NUMERIC;
BEGIN
    -- Check if user has enough credits
    IF get_user_credits(p_user_id) < p_amount THEN
        RETURN FALSE;
    END IF;
    
    -- Deduct from credits (oldest expiry first)
    FOR v_credit IN 
        SELECT id, remaining 
        FROM credits 
        WHERE user_id = p_user_id 
          AND remaining > 0 
          AND (expires_at IS NULL OR expires_at > CURRENT_TIMESTAMP)
        ORDER BY expires_at ASC NULLS LAST
    LOOP
        IF v_remaining <= 0 THEN
            EXIT;
        END IF;
        
        v_deduct := LEAST(v_credit.remaining, v_remaining);
        
        UPDATE credits 
        SET remaining = remaining - v_deduct 
        WHERE id = v_credit.id;
        
        v_remaining := v_remaining - v_deduct;
    END LOOP;
    
    -- Get new balance
    v_balance := get_user_credits(p_user_id);
    
    -- Record transaction
    INSERT INTO transactions (user_id, action, amount, balance_after, description)
    VALUES (p_user_id, 'credit_deduct', -p_amount, v_balance, p_description);
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- SEED DATA
-- ============================================

-- Insert default system settings
INSERT INTO system_settings (key, value, description) VALUES
('signup_credits', '2', 'Number of free credits for new users'),
('credit_expiry_days', '30', 'Days until signup credits expire'),
('referral_reward', '0.5', 'Credits awarded per successful referral'),
('deploy_cost_per_week', '1', 'Credits charged per active deployment per week'),
('ai_cost_per_call', '0.1', 'Base cost for AI assistance calls'),
('max_deployments_free', '1', 'Maximum deployments for free tier'),
('max_memory_free', '512', 'Maximum memory (MB) for free tier containers'),
('maintenance_mode', 'false', 'Enable maintenance mode');

-- Create global chat
INSERT INTO chats (id, type, name) VALUES 
(uuid_generate_v4(), 'global', 'Global Chat');
