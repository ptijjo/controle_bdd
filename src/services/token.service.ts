import { Service } from 'typedi';
import { HttpException } from '@/exceptions/httpException';
import jwt from 'jsonwebtoken';
import { SECRET_KEY_INVITATION } from '@/config';
import { JWT_ALGORITHM } from '@/constants/jwt';

@Service()
export class TokenService {
  public async tokenInvitation(tokenInvitation: string): Promise<{ email: string }> {
    try {
      const decodedToken = jwt.verify(tokenInvitation, SECRET_KEY_INVITATION as string, {
        algorithms: [JWT_ALGORITHM],
      }) as {
        email: string;
      };

      return decodedToken;
    } catch (error) {
      throw new HttpException(400, 'Token d\'invitation invalide ou expiré');
    }
  }
}
