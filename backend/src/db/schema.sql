-- Celestia Database Schema
-- PostgreSQL 14+

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ========== USERS TABLE ==========
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    nickname VARCHAR(100) NOT NULL, -- PII_ENCRYPTED
    birthdate DATE NOT NULL, -- PII_ENCRYPTED
    timezone VARCHAR(50) DEFAULT 'UTC',
    zodiac_sign VARCHAR(20) NOT NULL,
    rising_sign VARCHAR(20),
    relationship_status VARCHAR(50),
    personalization_enabled BOOLEAN DEFAULT true,
    is_admin BOOLEAN DEFAULT false,
    age_verified BOOLEAN DEFAULT false,
    parental_consent_required BOOLEAN DEFAULT false,
    parental_consent_given BOOLEAN DEFAULT false,
    parent_email VARCHAR(255), -- PII_ENCRYPTED
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    last_login_at TIMESTAMP,
    deleted_at TIMESTAMP,
    
    CONSTRAINT valid_zodiac CHECK (zodiac_sign IN (
        'aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo',
        'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces'
    ))
);

-- Indexes for performance
CREATE INDEX idx_users_email ON users(email) WHERE deleted_at IS NULL;
CREATE INDEX idx_users_zodiac ON users(zodiac_sign);
CREATE INDEX idx_users_created ON users(created_at);

-- ========== HOROSCOPES TABLE ==========
CREATE TABLE horoscopes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    zodiac_sign VARCHAR(20) NOT NULL,
    date DATE NOT NULL,
    content TEXT NOT NULL,
    tags TEXT[], -- Array of tag strings
    action_prompt TEXT NOT NULL,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    
    UNIQUE(zodiac_sign, date),
    CONSTRAINT valid_zodiac_horoscope CHECK (zodiac_sign IN (
        'aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo',
        'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces'
    ))
);

-- Indexes
CREATE INDEX idx_horoscopes_sign_date ON horoscopes(zodiac_sign, date DESC);
CREATE INDEX idx_horoscopes_date ON horoscopes(date DESC);

-- ========== JOURNALS TABLE ==========
CREATE TABLE journals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content_encrypted TEXT NOT NULL, -- AES-256-GCM encrypted content
    encryption_iv VARCHAR(32) NOT NULL, -- Initialization vector for decryption
    sentiment_score DECIMAL(3, 2), -- Range: -1.00 to 1.00
    detected_keywords TEXT[], -- Flagged keywords for safety monitoring
    horoscope_id UUID REFERENCES horoscopes(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    deleted_at TIMESTAMP
);

-- Indexes
CREATE INDEX idx_journals_user ON journals(user_id, created_at DESC) WHERE deleted_at IS NULL;
CREATE INDEX idx_journals_sentiment ON journals(user_id, sentiment_score, created_at) WHERE sentiment_score IS NOT NULL;

-- ========== DISTRESS REPORTS TABLE ==========
CREATE TABLE distress_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    trigger_type VARCHAR(50) NOT NULL, -- 'critical_keyword', 'sentiment_threshold', 'frequency_pattern'
    trigger_details JSONB, -- Additional context (anonymized)
    severity VARCHAR(20) DEFAULT 'medium', -- 'low', 'medium', 'high', 'critical'
    resolved BOOLEAN DEFAULT false,
    resolved_at TIMESTAMP,
    resolved_by UUID REFERENCES users(id),
    admin_notes TEXT,
    follow_up_sent BOOLEAN DEFAULT false,
    user_response VARCHAR(20), -- 'helped', 'not_helpful', 'no_response'
    created_at TIMESTAMP DEFAULT NOW(),
    
    CONSTRAINT valid_trigger CHECK (trigger_type IN (
        'critical_keyword', 'sentiment_threshold', 'frequency_pattern', 'manual_report'
    )),
    CONSTRAINT valid_severity CHECK (severity IN ('low', 'medium', 'high', 'critical'))
);

-- Indexes
CREATE INDEX idx_distress_user ON distress_reports(user_id, created_at DESC);
CREATE INDEX idx_distress_unresolved ON distress_reports(resolved, severity, created_at) WHERE NOT resolved;
CREATE INDEX idx_distress_created ON distress_reports(created_at DESC);

-- ========== USER SESSIONS TABLE (for JWT tracking) ==========
CREATE TABLE user_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) NOT NULL, -- SHA-256 hash of JWT
    device_info VARCHAR(255),
    ip_address INET,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    revoked_at TIMESTAMP
);

-- Indexes
CREATE INDEX idx_sessions_user ON user_sessions(user_id, created_at DESC);
CREATE INDEX idx_sessions_token ON user_sessions(token_hash) WHERE revoked_at IS NULL;
CREATE INDEX idx_sessions_expires ON user_sessions(expires_at) WHERE revoked_at IS NULL;

-- ========== SAVED HOROSCOPES TABLE ==========
CREATE TABLE saved_horoscopes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    horoscope_id UUID NOT NULL REFERENCES horoscopes(id) ON DELETE CASCADE,
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    
    UNIQUE(user_id, horoscope_id)
);

-- Indexes
CREATE INDEX idx_saved_user ON saved_horoscopes(user_id, created_at DESC);

-- ========== APP METRICS TABLE ==========
CREATE TABLE app_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    metric_name VARCHAR(100) NOT NULL,
    metric_value DECIMAL(12, 2),
    metadata JSONB,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMP DEFAULT NOW(),
    
    UNIQUE(metric_name, date)
);

-- Indexes
CREATE INDEX idx_metrics_name_date ON app_metrics(metric_name, date DESC);

-- ========== AUDIT LOG TABLE ==========
CREATE TABLE audit_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(50),
    resource_id UUID,
    details JSONB,
    ip_address INET,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_audit_user ON audit_log(user_id, created_at DESC);
CREATE INDEX idx_audit_action ON audit_log(action, created_at DESC);
CREATE INDEX idx_audit_created ON audit_log(created_at DESC);

-- ========== FUNCTIONS ==========

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_horoscopes_updated_at BEFORE UPDATE ON horoscopes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_journals_updated_at BEFORE UPDATE ON journals
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to calculate zodiac sign from birthdate
CREATE OR REPLACE FUNCTION calculate_zodiac_sign(birth_date DATE)
RETURNS VARCHAR(20) AS $$
DECLARE
    month INT := EXTRACT(MONTH FROM birth_date);
    day INT := EXTRACT(DAY FROM birth_date);
BEGIN
    RETURN CASE
        WHEN (month = 3 AND day >= 21) OR (month = 4 AND day <= 19) THEN 'aries'
        WHEN (month = 4 AND day >= 20) OR (month = 5 AND day <= 20) THEN 'taurus'
        WHEN (month = 5 AND day >= 21) OR (month = 6 AND day <= 20) THEN 'gemini'
        WHEN (month = 6 AND day >= 21) OR (month = 7 AND day <= 22) THEN 'cancer'
        WHEN (month = 7 AND day >= 23) OR (month = 8 AND day <= 22) THEN 'leo'
        WHEN (month = 8 AND day >= 23) OR (month = 9 AND day <= 22) THEN 'virgo'
        WHEN (month = 9 AND day >= 23) OR (month = 10 AND day <= 22) THEN 'libra'
        WHEN (month = 10 AND day >= 23) OR (month = 11 AND day <= 21) THEN 'scorpio'
        WHEN (month = 11 AND day >= 22) OR (month = 12 AND day <= 21) THEN 'sagittarius'
        WHEN (month = 12 AND day >= 22) OR (month = 1 AND day <= 19) THEN 'capricorn'
        WHEN (month = 1 AND day >= 20) OR (month = 2 AND day <= 18) THEN 'aquarius'
        ELSE 'pisces'
    END;
END;
$$ LANGUAGE plpgsql;

-- ========== DATA RETENTION POLICIES ==========

-- Function to anonymize old logs
CREATE OR REPLACE FUNCTION anonymize_old_logs()
RETURNS void AS $$
BEGIN
    UPDATE audit_log 
    SET user_id = NULL, ip_address = NULL, details = NULL
    WHERE created_at < NOW() - INTERVAL '30 days';
END;
$$ LANGUAGE plpgsql;

-- Function to soft delete inactive users
CREATE OR REPLACE FUNCTION cleanup_deleted_users()
RETURNS void AS $$
BEGIN
    UPDATE users
    SET 
        email = 'deleted_' || id || '@deleted.local',
        password_hash = 'DELETED',
        nickname = 'DELETED',
        birthdate = '1900-01-01'
    WHERE deleted_at IS NOT NULL 
    AND deleted_at < NOW() - INTERVAL '30 days';
END;
$$ LANGUAGE plpgsql;

-- ========== COMMENTS FOR PII FIELDS ==========
COMMENT ON COLUMN users.nickname IS 'PII - Encrypted at rest';
COMMENT ON COLUMN users.birthdate IS 'PII - Encrypted at rest';
COMMENT ON COLUMN users.parent_email IS 'PII - Encrypted at rest';
COMMENT ON COLUMN journals.content_encrypted IS 'Encrypted with AES-256-GCM';
COMMENT ON COLUMN distress_reports.trigger_details IS 'Anonymized context, no raw PII';

-- ========== PERMISSIONS ==========
-- These would be configured based on your deployment environment
-- Example: GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO celestia_app_user;