import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  // 创建用户
  async create(user: Partial<User>) {
    return this.userRepository.save(user);
  }

  // 查询所有用户
  async findAll() {
    return this.userRepository.find();
  }

  // 根据ID查询用户
  async findOne(id: number) {
    return this.userRepository.findOne({ where: { id } });
  }

  // 更新用户
  async update(id: number, user: Partial<User>) {
    return this.userRepository.update(id, user);
  }

  // 删除用户
  async remove(id: number) {
    return this.userRepository.delete(id);
  }
}
