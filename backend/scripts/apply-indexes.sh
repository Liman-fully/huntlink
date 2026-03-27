#!/bin/bash

# 搜索性能优化 - 应用数据库索引脚本
# 使用方法：./scripts/apply-indexes.sh

set -e

# 从 .env 读取数据库配置
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
fi

# 默认值
DB_HOST=${DATABASE_HOST:-localhost}
DB_PORT=${DATABASE_PORT:-3306}
DB_USER=${DATABASE_USER:-root}
DB_PASS=${DATABASE_PASSWORD:-}
DB_NAME=${DATABASE_NAME:-huntlink}

echo "🚀 开始应用搜索性能优化索引..."
echo "数据库：${DB_HOST}:${DB_PORT}/${DB_NAME}"
echo ""

# 执行 SQL 迁移
mysql -h "${DB_HOST}" \
      -P "${DB_PORT}" \
      -u "${DB_USER}" \
      -p"${DB_PASS}" \
      "${DB_NAME}" \
      < src/migrations/add-search-indexes.sql

echo ""
echo "✅ 索引应用完成!"
echo ""
echo "下一步:"
echo "1. 编译 TypeScript: npm run build"
echo "2. 运行性能测试：npx ts-node src/performance/search-performance.test.ts"
echo "3. 重启服务：pm2 restart huntlink-backend 或 npm run start:prod"
