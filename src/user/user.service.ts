import { Injectable } from '@nestjs/common';
import { SignupDto } from 'src/dtos/signupDto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/entities/user.entity';

@Injectable()
export class UserService {
    constructor( @InjectRepository(User)private readonly usersRepository: Repository<User>) {}

   async signupPost(body: SignupDto) : Promise<boolean> {
       try {
           const { password } = body;
           const user = this.usersRepository.create({...body});
           await this.usersRepository.save(user);
           return true;
        } catch (error) {
            return false;
        }

    }
}