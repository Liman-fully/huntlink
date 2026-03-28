#!/bin/bash
# ==============================================================================
# 猎脉项目优化部署脚本
# 使用方法：bash deploy.optimized.sh
# ==============================================================================
set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 配置
DEPLOY_DIR="/var/www/huntlink"
BACKUP_DIR="/var/www/huntlink-backup-$(date +%Y%m%d-%H%M%S)"
HEALTH_CHECK_RETRIES=30
HEALTH_CHECK_INTERVAL=2

echo -e "${GREEN}=========================================${NC}"
echo -e "${GREEN}猎脉 HuntLink 优化部署脚本${NC}"
echo -e "${GREEN}=========================================${NC}"
echo ""
echo "部署目录：$DEPLOY_DIR"
echo "备份目录：$BACKUP_DIR"
echo ""

# ==============================================================================
# 函数定义
# ==============================================================================

log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

check_health() {
    local service=$1
    local max_retries=$HEALTH_CHECK_RETRIES
    local retry=0

    log_info "等待 $service 服务健康..."

    while [ $retry -lt $max_retries ]; do
        if docker inspect --format='{{.State.Health.Status}}' "huntlink-$service" 2>/dev/null | grep -q "healthy"; then
            log_info "$service 服务已健康"
            return 0
        fi
        
        retry=$((retry + 1))
        sleep $HEALTH_CHECK_INTERVAL
    done

    log_error "$service 服务健康检查失败"
    return 1
}

rollback() {
    if [ -d "$BACKUP_DIR" ]; then
        log_warn "部署失败，正在回滚..."
        docker-compose down
        rm -rf "$DEPLOY_DIR"
        cp -r "$BACKUP_DIR" "$DEPLOY_DIR"
        cd "$DEPLOY_DIR"
        docker-compose up -d
        log_info "已回滚到之前的版本"
    else
        log_error "部署失败，且没有备份可回滚"
    fi
}

# ==============================================================================
# 1. 检查 Docker
# ==============================================================================
log_info "检查 Docker..."
if ! command -v docker &> /dev/null; then
    log_error "Docker 未安装，请先安装 Docker"
    exit 1
fi
echo "✅ Docker 已安装: $(docker --version)"

# ==============================================================================
# 2. 检查 Docker Compose
# ==============================================================================
log_info "检查 Docker Compose..."
if ! command -v docker-compose &> /dev/null; then
    log_error "Docker Compose 未安装，请先安装"
    exit 1
fi
echo "✅ Docker Compose 已安装: $(docker-compose --version)"

# ==============================================================================
# 3. 备份现有部署
# ==============================================================================
if [ -d "$DEPLOY_DIR" ]; then
    log_info "备份现有部署..."
    cp -r "$DEPLOY_DIR" "$BACKUP_DIR"
    log_info "已备份到 $BACKUP_DIR"
    
    # 清理旧备份（保留最近 5 个）
    cd /var/www
    ls -dt huntlink-backup-* 2>/dev/null | tail -n +6 | xargs -r rm -rf
    log_info "已清理旧备份（保留最近 5 个）"
else
    log_info "首次部署，无需备份"
    mkdir -p "$DEPLOY_DIR"
fi

# ==============================================================================
# 4. 拉取最新代码
# ==============================================================================
log_info "拉取最新代码..."
cd "$DEPLOY_DIR"

if [ -d ".git" ]; then
    log_info "检测到已有仓库，执行 git pull..."
    git pull origin master || git pull origin main
else
    log_info "克隆仓库..."
    git clone https://github.com/Liman-fully/huntlink.git .
fi
log_info "代码已更新"

# ==============================================================================
# 5. 配置环境变量
# ==============================================================================
log_info "配置环境变量..."

if [ ! -f "backend/.env" ]; then
    log_info "创建 backend/.env..."
    if [ -f "backend/.env.example" ]; then
        cp backend/.env.example backend/.env
    else
        cat > backend/.env <<EOF
NODE_ENV=production
DATABASE_HOST=mysql
DATABASE_PORT=3306
DATABASE_USER=huntlink
DATABASE_PASSWORD=huntlink_user_password_2026
DATABASE_NAME=huntlink
JWT_SECRET=huntlink-jwt-secret-key-2026-change-in-production
PORT=3000
EOF
    fi
    log_warn "请编辑 backend/.env 配置生产环境密码"
else
    log_info "backend/.env 已存在"
fi

if [ ! -f "frontend-web/.env" ]; then
    log_info "创建 frontend-web/.env..."
    if [ -f "frontend-web/.env.example" ]; then
        cp frontend-web/.env.example frontend-web/.env
    else
        cat > frontend-web/.env <<EOF
VITE_API_BASE_URL=http://150.158.51.199:3000/api
EOF
    fi
fi

# ==============================================================================
# 6. 停止现有服务
# ==============================================================================
log_info "停止现有服务..."
cd "$DEPLOY_DIR"
docker-compose down --remove-orphans
log_info "服务已停止"

# ==============================================================================
# 7. 清理旧镜像（节省空间）
# ==============================================================================
log_info "清理悬空镜像..."
docker image prune -f
log_info "镜像清理完成"

# ==============================================================================
# 8. 构建并启动服务
# ==============================================================================
log_info "构建并启动服务..."

# 设置陷阱，部署失败时回滚
trap rollback ERR

docker-compose -f docker-compose.optimized.yml up -d --build

log_info "服务已启动"

# ==============================================================================
# 9. 等待服务健康
# ==============================================================================
log_info "等待服务健康检查..."

check_health "mysql" || {
    log_error "MySQL 健康检查失败"
    docker-compose -f docker-compose.optimized.yml logs mysql
    exit 1
}

check_health "backend" || {
    log_error "Backend 健康检查失败"
    docker-compose -f docker-compose.optimized.yml logs backend
    exit 1
}

check_health "frontend" || {
    log_error "Frontend 健康检查失败"
    docker-compose -f docker-compose.optimized.yml logs frontend
    exit 1
}

# 清除陷阱（部署成功）
trap - ERR

# ==============================================================================
# 10. 清理旧备份（部署成功后）
# ==============================================================================
if [ -d "$BACKUP_DIR" ]; then
    log_info "部署成功，清理旧备份..."
    cd /var/www
    ls -dt huntlink-backup-* 2>/dev/null | tail -n +6 | xargs -r rm -rf
fi

# ==============================================================================
# 完成
# ==============================================================================
echo ""
echo -e "${GREEN}=========================================${NC}"
echo -e "${GREEN}✅ 部署完成！${NC}"
echo -e "${GREEN}=========================================${NC}"
echo ""
echo "服务状态："
docker-compose -f docker-compose.optimized.yml ps
echo ""
echo "查看日志："
echo "  docker-compose -f docker-compose.optimized.yml logs -f [service]"
echo ""
echo "访问地址："
echo "  前端：http://150.158.51.199"
echo "  后端：http://150.158.51.199:3000"
echo ""
echo "资源限制："
echo "  MySQL:    CPU 2.0 / 内存 2G"
echo "  Backend:  CPU 1.0 / 内存 1G"
echo "  Frontend: CPU 0.5 / 内存 256M"
echo ""
echo "日志管理："
echo "  每个服务日志限制 100MB，保留 3 个文件"
echo ""
