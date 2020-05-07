import path from 'path';
import fs from 'fs';

import uploadConfig from '@config/upload';
import AppError from '@shared/errors/AppError';
import { injectable, inject } from 'tsyringe';
import User from '../infra/typeorm/entities/User';
import IUsersRepository from '../repositories/IUsersRepository';

interface IRequest {
  user_id: string;
  avatarFilename: string;
}

@injectable()
class UpdateUserAvatarService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute({ user_id, avatarFilename }: IRequest): Promise<User> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError('Only authenticated users can change avatar.', 401);
    }

    if (user.avatar) {
      // Verifica se usuário já tem avatar salvo
      const userAvatarFilePath = path.join(uploadConfig.directory, user.avatar);
      // Verifica se o arquivo já existe
      const userAvatarFileExists = await fs.promises.stat(userAvatarFilePath);
      // Se o arquivo esiste, deleta ele com a função unlink();
      if (userAvatarFileExists) {
        await fs.promises.unlink(userAvatarFilePath);
      }
    }
    // Depois de deletar o arquivo, define novo caminho para campo avatar
    user.avatar = avatarFilename;
    // Salva a informação no banco de dados.
    await this.usersRepository.save(user);

    return user;
  }
}

export default UpdateUserAvatarService;
