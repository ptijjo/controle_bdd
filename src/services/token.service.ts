import { Service } from 'typedi';
import { HttpException } from '@/exceptions/httpException';
import jwt from 'jsonwebtoken';
import { SECRET_KEY_INVITATION } from '@/config';

@Service()
export class TokenService {
  public async tokenInvitation(tokenInvitation: string): Promise<{ email: string }> {
    try {
      const decodedToken = jwt.verify(tokenInvitation, SECRET_KEY_INVITATION as string) as {
        email: string;
      };

      return decodedToken;
    } catch (error) {
      throw new HttpException(400, error);
    }
  }
}
