# 数据库初始化脚本

import { createConnection } from 'typeorm';

async function initDatabase() {
  console.log('🚀 开始初始化数据库...');

  const connection = await createConnection({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: 5432,
    username: process.env.DB_USERNAME || 'huntlink',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_DATABASE || 'huntlink',
  });

  console.log('✅ 数据库连接成功');

  // 创建 candidates 表
  await connection.query(`
    CREATE TABLE IF NOT EXISTS candidates (
      id SERIAL PRIMARY KEY,
      name VARCHAR(50) NOT NULL,
      mobile VARCHAR(20) UNIQUE NOT NULL,
      email VARCHAR(100),
      work_years INT DEFAULT 0,
      city VARCHAR(50),
      education_level INT,
      resume_jsonb JSONB,
      search_context tsvector,
      resume_url VARCHAR(255),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    )
  `);

  console.log('✅ candidates 表创建成功');

  // 创建 GIN 索引
  await connection.query(`
    CREATE INDEX IF NOT EXISTS idx_candidates_resume_jsonb 
    ON candidates USING GIN (resume_jsonb)
  `);

  await connection.query(`
    CREATE INDEX IF NOT EXISTS idx_candidates_search_context 
    ON candidates USING GIN (search_context)
  `);

  await connection.query(`
    CREATE INDEX IF NOT EXISTS idx_candidates_city ON candidates (city)
  `);

  await connection.query(`
    CREATE INDEX IF NOT EXISTS idx_candidates_education_level ON candidates (education_level)
  `);

  console.log('✅ GIN 索引创建成功');

  // 创建触发器函数
  await connection.query(`
    CREATE OR REPLACE FUNCTION update_candidate_search_vector()
    RETURNS TRIGGER AS $$
    BEGIN
      NEW.search_context := 
        setweight(to_tsvector('chinese', coalesce(NEW.name, '')), 'A') ||
        setweight(to_tsvector('chinese', coalesce(NEW.resume_jsonb->>'current_position', '')), 'A') ||
        setweight(to_tsvector('chinese', coalesce(array_to_string(NEW.resume_jsonb->'skills', ' '), '')), 'B') ||
        setweight(to_tsvector('chinese', coalesce(NEW.resume_jsonb->>'work_experience_text', '')), 'C') ||
        setweight(to_tsvector('chinese', coalesce(NEW.resume_jsonb->>'education_text', '')), 'D');
      
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;
  `);

  console.log('✅ 触发器函数创建成功');

  // 创建触发器
  await connection.query(`
    CREATE TRIGGER trg_update_search_vector
    BEFORE INSERT OR UPDATE ON candidates
    FOR EACH ROW
    EXECUTE FUNCTION update_candidate_search_vector()
  `);

  console.log('✅ 触发器创建成功');

  console.log('✅ 数据库初始化完成');
  await connection.close();
}

initDatabase().catch(err => {
  console.error('❌ 初始化失败:', err);
  process.exit(1);
});
