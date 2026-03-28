import { createConnection } from 'typeorm';

async function runMigration() {
  console.log('🚀 开始执行数据库迁移...');

  const connection = await createConnection({
    type: 'mysql',
    host: process.env.DB_HOST || 'localhost',
    port: 3306,
    username: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || 'HuntLink2026!dev',
    database: 'huntlink',
  });

  console.log('✅ 数据库连接成功');

  // 创建职位分类表
  await connection.query(`
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
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `);
  console.log('✅ 职位分类表创建成功');

  // 扩展 talents 表
  try {
    await connection.query(`ALTER TABLE talents ADD COLUMN category_code VARCHAR(10) COMMENT '职位分类编码'`);
    console.log('✅ 添加 category_code 字段');
  } catch (e) {
    console.log('⚠️  category_code 字段已存在');
  }

  try {
    await connection.query(`ALTER TABLE talents ADD COLUMN industry_code VARCHAR(10) COMMENT '行业编码'`);
    console.log('✅ 添加 industry_code 字段');
  } catch (e) {
    console.log('⚠️  industry_code 字段已存在');
  }

  try {
    await connection.query(`ALTER TABLE talents ADD COLUMN job_level VARCHAR(10) COMMENT '职级（P5/P6/P7）'`);
    console.log('✅ 添加 job_level 字段');
  } catch (e) {
    console.log('⚠️  job_level 字段已存在');
  }

  try {
    await connection.query(`ALTER TABLE talents ADD COLUMN position_name VARCHAR(100) COMMENT '标准化职位名称'`);
    console.log('✅ 添加 position_name 字段');
  } catch (e) {
    console.log('⚠️  position_name 字段已存在');
  }

  // 创建索引
  try {
    await connection.query(`CREATE INDEX IF NOT EXISTS idx_category ON talents (category_code)`);
    console.log('✅ 创建 idx_category 索引');
  } catch (e) {
    console.log('⚠️  idx_category 索引已存在');
  }

  try {
    await connection.query(`CREATE INDEX IF NOT EXISTS idx_industry ON talents (industry_code)`);
    console.log('✅ 创建 idx_industry 索引');
  } catch (e) {
    console.log('⚠️  idx_industry 索引已存在');
  }

  try {
    await connection.query(`CREATE INDEX IF NOT EXISTS idx_job_level ON talents (job_level)`);
    console.log('✅ 创建 idx_job_level 索引');
  } catch (e) {
    console.log('⚠️  idx_job_level 索引已存在');
  }

  // 创建分类日志表
  await connection.query(`
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
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  `);
  console.log('✅ 分类日志表创建成功');

  console.log('✅ 数据库迁移完成');
  await connection.close();
}

runMigration().catch(err => {
  console.error('❌ 迁移失败:', err);
  process.exit(1);
});
