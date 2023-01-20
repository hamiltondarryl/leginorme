Réaliser une application monolithe avec NestJs

----------------------------- 


Apres avoir installer NestJs  de manière globale :

```
npm i -g @nestjs/cli
```

on peut créer un projet en tapant la commande  : 
```
nest new project-name
```

Ajouter le système de templating (j'ai choisi EJS : site officiel )
```
npm i ejs
```

puis ajouter la prise en charge du templating dans le fichier main.ts , et par la suite  créer les dossiers public et views à la racine (ressource)
```
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
  );

  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('hbs');

  await app.listen(3000);
}
bootstrap();
```

On peut se lancer maintenant dans la création des modules, controller et service : 

Création de Module
```
nest g mo "nom_du_module"
```
Création de Controller
```
nest g co "nom_du_controller"
```
Création de service 
```
nest g s "nom_du_service"
```

Pour faciliter la récupération des données via la requête http  POST, on peut utiliser les DTO . Et pour cela on peut creer une classe et ajouter le packgage  
class-validator et class-transformer  pour le formatage de données .
Pour installer c'est 
```
npm i --save class-validator class-transformer
```
 
Puis on modifie le main.ts pour ajouter une ligne pour que le formatage soit prise en compte sur toute l'application
```
app.useGlobalPipes(new ValidationPipe());
```

Voici notre classe ayant des validations 

```
import { IsString, IsEmail, Length, IsNotEmpty }  from "class-validator";
export class SignupDto {
    @IsString()
    @IsNotEmpty()
    @Length(5, 50)
    readonly username : string;
    @IsEmail()
    readonly email : string;
    
    @IsString()
    @IsNotEmpty()
    @Length(8, 30)
    readonly password : string;
}
```

exemple au niveau du controller  
```
  @Post('/signup')
    signupPost(@Body() body : SignupDto){
        return body;
    }
```

On peut ajouter le service pour l'insertion des données 
```
import { Body, Controller, Get, Post, Render} from '@nestjs/common';
import { SignupDto } from 'src/dtos/signupDto';
import { UserService } from './user.service';
@Controller('user')
export class UserController {
    constructor(private readonly userService : UserService){}
    @Get('/signup')
    @Render('user/signup')
    signup(){}
    @Get('/signin')
    @Render('user/signin')
    signin(){}
    @Post('/signup')
    signupPost(@Body() body : SignupDto){
        return this.userService.signupPost(body);
    }
}
```

Présentation du service 
```
import { Injectable } from '@nestjs/common';
import { SignupDto } from 'src/dtos/signupDto';
@Injectable()
export class UserService {
    signupPost(body: SignupDto) {
        throw new Error('Method not implemented.');
    }
}
```

On peut par la suite utiliser une base de données avec typeorm (ressource)
```
npm install --save @nestjs/typeorm typeorm mysql2
```

Puis on va dans le module principal (app.module) de notre application pour inmport typeorm et ajouter le fichier de configuration 
```
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
@Module({
  imports: [ TypeOrmModule.forRoot({
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: 'root',
    database: 'test',
    entities: [],
    synchronize: true,
  }),, UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

Pour utiliser cette base de données on doit créer des entité (les tables de notre BDD), donc je créer dans le répertoire "rsc" un répertoire nommé entities
et je vais stocker les entités de mon application
exemple : 

```
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  readonly id: number;
  @Column({ unique : true })
  readonly username : string;
  @Column({ unique : true })
  readonly email : string;
  @Column()
  readonly password : string;
}
```

et par la suite de doit l'ajouter au niveau du module principal
```
entities: [User]
```

sans oublié au niveau du module dans lequel je veux l'utiliser
```
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';
@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [UserService]
})
export class UserModule {}
```

Pour hacher les mots de passe on installe le package bcrypt

```
npm i -D @types/bcrypt
```

et de l'injecter au niveau du service 
```
import { Injectable } from '@nestjs/common';
import { SignupDto } from 'src/dtos/signupDto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
    constructor( @InjectRepository(User)private readonly usersRepository: Repository<User>) {}

   async signupPost(body: SignupDto) : Promise<boolean> {
       try {
           const { password } = body;
           const hash = await bcrypt.hash(password, 10)
           const user = this.usersRepository.create({...body, password : hash});
           await this.usersRepository.save(user);
           return true;
        } catch (error) {
            
        }

    }
}
```