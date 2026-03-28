-- 职位分类表
CREATE TABLE IF NOT EXISTS job_categories (
  id VARCHAR(36) PRIMARY KEY,
  code VARCHAR(10) NOT NULL UNIQUE,
  level INT NOT NULL,
  parent_code VARCHAR(10),
  name VARCHAR(100) NOT NULL,
  keywords TEXT,
  positions TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_level (level),
  INDEX idx_parent (parent_code),
  INDEX idx_code (code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='职位分类表';

-- 人才职位扩展字段
ALTER TABLE talents ADD COLUMN IF NOT EXISTS category_code VARCHAR(10) COMMENT '职位分类编码';
ALTER TABLE talents ADD COLUMN IF NOT EXISTS industry_code VARCHAR(10) COMMENT '行业编码';
ALTER TABLE talents ADD COLUMN IF NOT EXISTS job_level VARCHAR(10) COMMENT '职级（P5/P6/P7）';
ALTER TABLE talents ADD COLUMN IF NOT EXISTS position_name VARCHAR(100) COMMENT '标准化职位名称';

-- 索引
ALTER TABLE talents ADD INDEX IF NOT EXISTS idx_category (category_code);
ALTER TABLE talents ADD INDEX IF NOT EXISTS idx_industry (industry_code);
ALTER TABLE talents ADD INDEX IF NOT EXISTS idx_job_level (job_level);

-- 分类日志表（用于持续优化）
CREATE TABLE IF NOT EXISTS classification_logs (
  id VARCHAR(36) PRIMARY KEY,
  input_text TEXT NOT NULL,
  result_category_code VARCHAR(10),
  result_category_name VARCHAR(100),
  result_industry_code VARCHAR(10),
  result_industry_name VARCHAR(100),
  confidence DECIMAL(3,2),
  match_type VARCHAR(20),
  matched_keywords TEXT,
  is_manual_override BOOLEAN DEFAULT FALSE,
  manual_result_category_code VARCHAR(10),
  error_type VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_confidence (confidence),
  INDEX idx_manual_override (is_manual_override),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='分类日志表';
