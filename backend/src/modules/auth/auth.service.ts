import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { RedisService } from '../../common/redis/redis.service';
import { User, UserRole } from '../user/user.entity';
import { LoginDto, RegisterDto, SendSmsDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
    private jwtService: JwtService,
    private redisService: RedisService,
  ) {}

  async sendSmsCode(dto: SendSmsDto) {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const ttl = 5 * 60; // 5 minutes

    // Use Redis to store verification code with auto-expiry
    const redis = this.redisService.getClient();
    await redis.setex(`sms:${dto.phone}`, ttl, code);

    // TODO: integrate real SMS provider (Aliyun / Tencent Cloud)
    // For dev, just log the code
    console.log(`[SMS] ${dto.phone}: ${code}`);

    return { message: '验证码已发送' };
  }

  private async verifySmsCode(phone: string, code: string): Promise<boolean> {
    const redis = this.redisService.getClient();
    const storedCode = await redis.get(`sms:${phone}`);

    if (!storedCode) return false;
    if (storedCode !== code) return false;

    // Delete verification code after successful verification (prevent reuse)
    await redis.del(`sms:${phone}`);
    return true;
  }

  private generateToken(user: User) {
    const payload = { sub: user.id, phone: user.phone, role: user.role };
    return {
      token: this.jwtService.sign(payload),
      userInfo: {
        id: user.id,
        phone: user.phone,
        name: user.name,
        role: user.role,
        avatar: user.avatar,
        createdAt: user.createdAt,
      },
    };
  }

  async login(dto: LoginDto) {
    // 生产环境必须使用真实短信验证，禁止硬编码万能码
    const isValid = await this.verifySmsCode(dto.phone, dto.code);
    if (!isValid) throw new UnauthorizedException('验证码错误或已过期');

    const user = await this.userRepo.findOne({ where: { phone: dto.phone } });
    if (!user) throw new UnauthorizedException('账号不存在，请先注册');
    if (!user.isActive) throw new UnauthorizedException('账号已被禁用');

    return this.generateToken(user);
  }

  async register(dto: RegisterDto) {
    // 生产环境必须使用真实短信验证，禁止硬编码万能码
    const isValid = await this.verifySmsCode(dto.phone, dto.code);
    if (!isValid) throw new UnauthorizedException('验证码错误或已过期');

    // Check phone uniqueness
    const existByPhone = await this.userRepo.findOne({ where: { phone: dto.phone } });
    if (existByPhone) throw new BadRequestException('该手机号已注册');

    // Check idCard registration count (max 3)
    const idCardCount = await this.userRepo.count({ where: { idCard: dto.idCard } });
    if (idCardCount >= 3)
      throw new BadRequestException('同一身份证最多注册3个账号');

    // Map string role to UserRole enum
    const role = dto.role === 'hr' ? UserRole.HR : UserRole.SEEKER;
    const user = this.userRepo.create({
      phone: dto.phone,
      name: dto.name,
      idCard: dto.idCard,
      role,
    });
    await this.userRepo.save(user);
    return this.generateToken(user);
  }
}
