import { getRepository } from 'typeorm';
import path from 'path';
import fs from 'fs';

import AppError from '../errors/AppError';
import User from '../models/User';
import uploadConfig from '../config/upload';

interface Request {
  user_id: string;
  avatarFilename: string;
}

class UpdateUserAvatarService {
  public async execute({user_id, avatarFilename}: Request): Promise<User> {
    const usersRepository = getRepository(User);

    const user = await usersRepository.findOne(user_id);

    if (!user) {
      throw new AppError('Only authenticated users can change avatar.', 401);
    }

    if (user.avatar) {
      //Verifica se usuário já tem avatar salvo
      const userAvatarFilePath = path.join(uploadConfig.directory, user.avatar);
      //Verifica se o arquivo já existe
      const userAvatarFileExists = await fs.promises.stat(userAvatarFilePath);
      //Se o arquivo esiste, deleta ele com a função unlink();
      if (userAvatarFileExists) {
        await fs.promises.unlink(userAvatarFilePath);
      }
    }
    //Depois de deletar o arquivo, define novo caminho para campo avatar
    user.avatar = avatarFilename;
    //Salva a informação no banco de dados.
    await usersRepository.save(user);

    return user;
  }
}

export default UpdateUserAvatarService;
