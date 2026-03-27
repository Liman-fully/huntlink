-- 简历库数据库迁移脚本
-- 执行时间: 2026-03-27

-- 1. 简历表
CREATE TABLE IF NOT EXISTS `resumes` (
  `id` varchar(36) NOT NULL,
  `userId` varchar(36) NOT NULL COMMENT '所属用户',
  `fileName` varchar(255) NOT NULL COMMENT '原始文件名',
  `filePath` varchar(500) NOT NULL COMMENT '文件存储路径',
  `fileSize` int NOT NULL COMMENT '文件大小(字节)',
  `fileType` varchar(20) NOT NULL COMMENT '文件类型: pdf/doc/docx/jpg/png',
  `folderId` varchar(36) COMMENT '所属文件夹',
  
  -- 解析后数据
  `parseStatus` enum('pending', 'parsed', 'failed') DEFAULT 'pending' COMMENT '解析状态',
  `parseError` text COMMENT '解析错误信息',
  
  -- 基本信息
  `name` varchar(50) COMMENT '姓名(脱敏)',
  `fullName` varchar(50) COMMENT '完整姓名',
  `phone` varchar(20) COMMENT '手机号',
  `email` varchar(100) COMMENT '邮箱',
  `location` varchar(100) COMMENT '现居住地',
  `age` int COMMENT '年龄',
  
  -- 教育信息
  `education` json COMMENT '教育经历数组',
  
  -- 工作经历
  `workExperience` json COMMENT '工作经历数组',
  
  -- 项目经历
  `projects` json COMMENT '项目经历数组',
  
  -- 技能标签
  `skills` json COMMENT '技能标签数组',
  
  -- 求职意向
  `jobIntention` json COMMENT '求职意向对象',
  
  -- 当前状态
  `currentTitle` varchar(100) COMMENT '当前职位',
  `currentCompany` varchar(100) COMMENT '当前公司',
  `experience` varchar(20) COMMENT '工作年限',
  `expectedSalary` varchar(50) COMMENT '期望薪资',
  
  -- 评分
  `personalScore` int DEFAULT 0 COMMENT '个人优秀度评分(0-100)',
  
  -- 元数据
  `isPublic` boolean DEFAULT false COMMENT '是否公开到人才广场',
  `viewCount` int DEFAULT 0 COMMENT '查看次数',
  `source` varchar(50) DEFAULT 'upload' COMMENT '来源: upload/email/external',
  `externalId` varchar(100) COMMENT '外部ID(用于去重)',
  `version` int DEFAULT 1 COMMENT '简历版本号',
  
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deletedAt` datetime,
  
  PRIMARY KEY (`id`),
  INDEX `idx_user` (`userId`),
  INDEX `idx_folder` (`folderId`),
  INDEX `idx_parse_status` (`parseStatus`),
  INDEX `idx_name` (`name`),
  INDEX `idx_phone` (`phone`),
  INDEX `idx_external` (`externalId`),
  INDEX `idx_public` (`isPublic`, `deletedAt`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. 简历文件夹表
CREATE TABLE IF NOT EXISTS `resume_folders` (
  `id` varchar(36) NOT NULL,
  `userId` varchar(36) NOT NULL,
  `name` varchar(100) NOT NULL COMMENT '文件夹名称',
  `parentId` varchar(36) COMMENT '父文件夹ID',
  `color` varchar(10) COMMENT '文件夹颜色',
  `icon` varchar(50) COMMENT '文件夹图标',
  `sort` int DEFAULT 0 COMMENT '排序',
  `isSystem` boolean DEFAULT false COMMENT '是否系统文件夹',
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deletedAt` datetime,
  
  PRIMARY KEY (`id`),
  INDEX `idx_user` (`userId`),
  INDEX `idx_parent` (`parentId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. 简历更新记录表(积分消费场景)
CREATE TABLE IF NOT EXISTS `resume_updates` (
  `id` varchar(36) NOT NULL,
  `userId` varchar(36) NOT NULL COMMENT '消费积分的用户',
  `resumeId` varchar(36) NOT NULL COMMENT '简历ID',
  `fromVersion` int NOT NULL COMMENT '原版本',
  `toVersion` int NOT NULL COMMENT '升级到版本',
  `pointsSpent` int NOT NULL COMMENT '消耗积分',
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  
  PRIMARY KEY (`id`),
  INDEX `idx_user` (`userId`),
  INDEX `idx_resume` (`resumeId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. 邮箱配置表
CREATE TABLE IF NOT EXISTS `email_configs` (
  `id` varchar(36) NOT NULL,
  `userId` varchar(36) NOT NULL,
  `email` varchar(100) NOT NULL COMMENT '邮箱地址',
  `imapHost` varchar(100) NOT NULL COMMENT 'IMAP服务器',
  `imapPort` int NOT NULL COMMENT 'IMAP端口',
  `imapUser` varchar(100) COMMENT 'IMAP用户名',
  `imapPassword` varchar(255) COMMENT 'IMAP密码(加密存储)',
  `lastSyncAt` datetime COMMENT '最后同步时间',
  `syncEnabled` boolean DEFAULT true COMMENT '是否启用同步',
  `autoParse` boolean DEFAULT true COMMENT '是否自动解析',
  `targetFolderId` varchar(36) COMMENT '导入目标文件夹',
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deletedAt` datetime,
  
  PRIMARY KEY (`id`),
  INDEX `idx_user` (`userId`),
  UNIQUE INDEX `uk_user_email` (`userId`, `email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. 插入系统默认文件夹
INSERT INTO `resume_folders` (`id`, `userId`, `name`, `isSystem`, `sort`) VALUES
('folder-all', 'system', '全部简历', true, 0),
('folder-upload', 'system', '上传简历', true, 1),
('folder-email', 'system', '邮箱导入', true, 2);

-- 6. 添加积分消费记录
ALTER TABLE `points_transactions` 
ADD COLUMN `resourceType` varchar(50) COMMENT '资源类型: resume_download/resume_update/advanced_search',
ADD COLUMN `resourceId` varchar(36) COMMENT '资源ID';
