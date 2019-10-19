import mongoose from 'mongoose';
import SimplicityClient from '../SimplicityClient';

export async function handle(client: SimplicityClient) {
  try {
    await mongoose.connect(process.env.DATABASE_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    client.databaseConnection = true;
    client.logger.log('Database:', 'conexão estabelecida sem problemas');
  } catch (error) {
    client.logger.error('Não foi possivel estabelecer conexão com banco de dados', error);
  }
}
