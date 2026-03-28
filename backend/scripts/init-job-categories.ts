import * as fs from 'fs';
import * as path from 'path';
import { createConnection } from 'typeorm';

async function initJobCategories() {
  console.log('🚀 开始初始化职位分类数据...');

  // 连接数据库
  const connection = await createConnection({
    type: 'mysql',
    host: process.env.DB_HOST || 'localhost',
    port: 3306,
    username: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || 'HuntLink2026!dev',
    database: 'huntlink',
  });

  console.log('✅ 数据库连接成功');

  // 读取规则文件
  const rulesPath = path.join(__dirname, '../../resume-classification-rules/rules/classification_rules.json');
  
  if (!fs.existsSync(rulesPath)) {
    console.error('❌ 规则文件不存在:', rulesPath);
    await connection.close();
    return;
  }

  const rules = JSON.parse(fs.readFileSync(rulesPath, 'utf-8'));
  console.log('✅ 规则文件加载成功');

  // 插入行业数据
  console.log('📊 插入行业数据...');
  for (const industry of rules.industries.data) {
    await connection.query(`
      INSERT INTO job_categories (id, code, level, name, keywords, is_active)
      VALUES (UUID(), ?, 1, ?, ?, TRUE)
      ON DUPLICATE KEY UPDATE name = VALUES(name), keywords = VALUES(keywords)
    `, [industry.code, industry.name, JSON.stringify(industry.keywords)]);
  }
  console.log(`✅ 行业数据插入完成 (${rules.industries.data.length}条)`);

  // 插入职能数据
  console.log('📊 插入职能数据...');
  for (const func of rules.functions.data) {
    await connection.query(`
      INSERT INTO job_categories (id, code, level, name, keywords, positions, is_active)
      VALUES (UUID(), ?, 2, ?, ?, ?, TRUE)
      ON DUPLICATE KEY UPDATE name = VALUES(name), keywords = VALUES(keywords), positions = VALUES(positions)
    `, [func.code, func.name, JSON.stringify(func.keywords), JSON.stringify(func.positions || [])]);
  }
  console.log(`✅ 职能数据插入完成 (${rules.functions.data.length}条)`);

  // 统计
  const industryCount = await connection.query('SELECT COUNT(*) as count FROM job_categories WHERE level = 1');
  const functionCount = await connection.query('SELECT COUNT(*) as count FROM job_categories WHERE level = 2');
  
  console.log('📊 数据统计:');
  console.log(`   - 行业：${industryCount[0].count}个`);
  console.log(`   - 职能：${functionCount[0].count}个`);

  console.log('✅ 职位分类初始化完成');
  await connection.close();
}

initJobCategories().catch(err => {
  console.error('❌ 初始化失败:', err);
  process.exit(1);
});
