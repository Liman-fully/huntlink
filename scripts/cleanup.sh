#!/bin/bash

# HuntLink 版本迭代清理脚本
# 在每个版本发布前运行，确保环境干净

echo "🧹 开始清理 HuntLink 项目..."

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 清理后端
echo -e "${YELLOW}[1/5] 清理后端...${NC}"
cd backend
rm -rf node_modules dist coverage .tsbuildinfo
echo -e "${GREEN}✓ 后端清理完成${NC}"

# 清理前端
echo -e "${YELLOW}[2/5] 清理前端...${NC}"
cd ../frontend-web
rm -rf node_modules dist coverage .vite
echo -e "${GREEN}✓ 前端清理完成${NC}"

# 清理根目录
echo -e "${YELLOW}[3/5] 清理根目录...${NC}"
cd ..
rm -rf node_modules .cache tmp logs
echo -e "${GREEN}✓ 根目录清理完成${NC}"

# 重新安装依赖
echo -e "${YELLOW}[4/5] 重新安装依赖...${NC}"
cd backend && npm install
cd ../frontend-web && npm install
echo -e "${GREEN}✓ 依赖安装完成${NC}"

# 运行测试
echo -e "${YELLOW}[5/5] 运行测试...${NC}"
cd ../backend
npm run test
npm run test:e2e
cd ../frontend-web
npm run test
echo -e "${GREEN}✓ 测试全部通过${NC}"

echo -e "${GREEN}🎉 清理完成！项目已准备好发布新版本${NC}"
echo ""
echo "下一步："
echo "1. git add ."
echo "2. git commit -m 'chore: 版本 x.x.x 发布前清理'"
echo "3. git push origin main"
