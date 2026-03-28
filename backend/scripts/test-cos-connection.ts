# COS 连接测试脚本

import { CosService } from '../src/common/storage/cos.service';
import { ConfigService } from '@nestjs/config';

async function testCosConnection() {
  console.log('🧪 开始测试 COS 连接...\n');

  const configService = new ConfigService();
  const cosService = new CosService(configService);

  // 测试连接
  const connected = await cosService.testConnection();
  
  if (connected) {
    console.log('✅ COS 连接成功！\n');
    console.log('配置信息:');
    console.log(`  存储桶：${process.env.COS_BUCKET}`);
    console.log(`  地域：${process.env.COS_REGION}`);
    console.log(`  域名：${process.env.COS_DOMAIN}`);
  } else {
    console.log('❌ COS 连接失败！\n');
    console.log('请检查:');
    console.log('  1. .env 文件中的 COS_SECRET_ID 和 COS_SECRET_KEY 是否正确');
    console.log('  2. 存储桶名称是否正确');
    console.log('  3. 地域是否正确（ap-guangzhou）');
    console.log('  4. 防火墙是否开放外网访问');
  }
}

testCosConnection().catch(console.error);
