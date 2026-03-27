-- 搜索性能优化索引迁移 (MySQL 版本)
-- 创建时间：2026-03-27
-- 目标：将搜索响应时间从 3 秒优化到 < 1 秒
-- 数据库：MySQL 8.0+

-- 1. 常用过滤字段的复合索引
CREATE INDEX IF NOT EXISTS idx_talents_jobstatus_location ON talents(job_status, location);
CREATE INDEX IF NOT EXISTS idx_talents_jobstatus_experience ON talents(job_status, experience);
CREATE INDEX IF NOT EXISTS idx_talents_jobstatus_education ON talents(job_status, education);

-- 2. 活跃时间索引（用于 sortBy=ACTIVE）
CREATE INDEX IF NOT EXISTS idx_talents_lastactive_desc ON talents(last_active DESC);

-- 3. 匹配分数索引（用于 sortBy=SCORE 和 matchScore 过滤）
CREATE INDEX IF NOT EXISTS idx_talents_matchscore_desc ON talents(match_score DESC);

-- 4. 综合搜索索引（覆盖最常用的过滤组合）
CREATE INDEX IF NOT EXISTS idx_talents_search_composite ON talents(
    job_status,
    location,
    experience,
    education,
    last_active
);

-- 5. 创建时间索引（用于 sortBy=LATEST）
CREATE INDEX IF NOT EXISTS idx_talents_createdat_desc ON talents(created_at DESC);

-- 6. 技能数量索引（用于 skillsCount 过滤）
CREATE INDEX IF NOT EXISTS idx_talents_skills_count ON talents(skills_count);

-- 7. 验证状态索引（用于 verified 过滤）
CREATE INDEX IF NOT EXISTS idx_talents_verified ON talents(verified);

-- 8. 简历完整度索引（用于 resumeComplete 过滤）
CREATE INDEX IF NOT EXISTS idx_talents_resume_complete ON talents(resume_complete);

-- 9. 地点模糊查询优化（可选，如果数据量大）
-- CREATE INDEX IF NOT EXISTS idx_talents_location ON talents(location(50));

-- 10. 公司名称模糊查询优化（可选）
-- CREATE INDEX IF NOT EXISTS idx_talents_current_company ON talents(current_company(50));

-- 11. 行业模糊查询优化（可选）
-- CREATE INDEX IF NOT EXISTS idx_talents_industry ON talents(industry(50));

-- 分析表以更新统计信息
ANALYZE TABLE talents;

-- 输出索引创建结果
SELECT 
    INDEX_NAME,
    COLUMN_NAME,
    SEQ_IN_INDEX,
    COLLATION
FROM INFORMATION_SCHEMA.STATISTICS
WHERE TABLE_SCHEMA = DATABASE()
  AND TABLE_NAME = 'talents'
ORDER BY INDEX_NAME, SEQ_IN_INDEX;
