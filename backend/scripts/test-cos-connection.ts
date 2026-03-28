// COS 连接测试脚本
import * as dotenv from 'dotenv';
import * as path from 'path';

// 加载环境变量
dotenv.config({ path: path.join(__dirname, '../.env') });

// ESM 兼容导入
const COS = require('cos-nodejs-sdk-v5');

async function main() {
  console.log('🧪 开始测试 COS 连接...\n');

  const secretId = process.env.COS_SECRET_ID;
  const secretKey = process.env.COS_SECRET_KEY;
  const bucket = process.env.COS_BUCKET || 'huntlink-1306109984';
  const region = process.env.COS_REGION || 'ap-guangzhou';

  console.log('📋 配置信息:');
  console.log(`  SecretId: ${secretId ? secretId.substring(0, 10) + '...' : '未配置'}`);
  console.log(`  SecretKey: ${secretKey ? '******' : '未配置'}`);
  console.log(`  存储桶: ${bucket}`);
  console.log(`  地域: ${region}\n`);

  if (!secretId || !secretKey) {
    console.log('❌ 配置不完整！');
    console.log('请检查 .env 文件中的 COS_SECRET_ID 和 COS_SECRET_KEY');
    return;
  }

  const cos = new COS({
    SecretId: secretId,
    SecretKey: secretKey,
  });

  // 1. 先检查存储桶是否存在
  console.log('1️⃣ 检查存储桶是否存在...');
  
  try {
    const buckets = await new Promise<any>((resolve, reject) => {
      cos.getService({}, (err: any, data: any) => {
        if (err) reject(err);
        else resolve(data);
      });
    });

    console.log('✅ COS 连接成功！');
    console.log('📋 已有的存储桶:');
    
    const bucketList = buckets.Buckets?.Bucket || [];
    if (bucketList.length === 0) {
      console.log('  (暂无存储桶)');
    } else {
      bucketList.forEach((b: any) => {
        console.log(`  - ${b.Name} (${b.Location})`);
      });
    }

    // 2. 检查目标存储桶是否存在
    const targetBucket = bucketList.find((b: any) => b.Name === bucket && b.Location === region);
    
    if (targetBucket) {
      console.log(`\n✅ 存储桶 ${bucket} 存在！`);
      
      // 3. 测试读取存储桶内容
      console.log('\n2️⃣ 测试读取存储桶内容...');
      
      try {
        const content = await new Promise<any>((resolve, reject) => {
          cos.getBucket({ Bucket: bucket, Region: region }, (err: any, data: any) => {
            if (err) reject(err);
            else resolve(data);
          });
        });
        
        console.log(`✅ 存储桶可访问！`);
        console.log(`  对象数量: ${content.Contents?.length || 0}`);
      } catch (e: any) {
        console.log(`⚠️ 无法读取存储桶: ${e.message || e}`);
      }
      
      // 4. 测试上传文件
      console.log('\n3️⃣ 测试文件上传...');
      
      const testKey = `test/${Date.now()}-upload-test.txt`;
      const testContent = 'HuntLink COS Test File - ' + new Date().toISOString();
      
      try {
        const uploadResult = await new Promise<any>((resolve, reject) => {
          cos.putObject({
            Bucket: bucket,
            Region: region,
            Key: testKey,
            Body: Buffer.from(testContent),
          }, (err: any, data: any) => {
            if (err) reject(err);
            else resolve(data);
          });
        });
        
        console.log('✅ 文件上传成功！');
        console.log(`  文件 Key: ${testKey}`);
        console.log(`  ETag: ${uploadResult.ETag}`);
        
        // 5. 测试删除文件
        console.log('\n4️⃣ 测试文件删除...');
        
        try {
          await new Promise<any>((resolve, reject) => {
            cos.deleteObject({
              Bucket: bucket,
              Region: region,
              Key: testKey,
            }, (err: any, data: any) => {
              if (err) reject(err);
              else resolve(data);
            });
          });
          
          console.log('✅ 文件删除成功！');
        } catch (e: any) {
          console.log(`⚠️ 文件删除失败（不影响使用）: ${e.message || e}`);
        }
        
      } catch (e: any) {
        console.log(`❌ 文件上传失败！`);
        console.log(`错误信息: ${e.message || e}`);
      }
      
    } else {
      console.log(`\n⚠️ 存储桶 ${bucket} 不存在！`);
      console.log('\n需要先创建存储桶，或者检查存储桶名称是否正确。');
      console.log('\n创建存储桶的步骤:');
      console.log('1. 登录腾讯云控制台: https://console.cloud.tencent.com/cos');
      console.log('2. 点击"创建存储桶"');
      console.log('3. 名称: huntlink-1306109984');
      console.log('4. 地域: 广州');
      console.log('5. 点击"创建"');
    }

  } catch (err: any) {
    console.log('❌ COS 连接失败！');
    console.log('错误信息:', err.message || err);
    console.log('\n请检查:');
    console.log('  1. COS_SECRET_ID 和 COS_SECRET_KEY 是否正确');
    console.log('  2. 密钥是否有访问 COS 的权限');
  }

  console.log('\n========== 测试完成 ==========\n');
}

main().catch(console.error);
