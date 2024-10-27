import request from 'supertest';
import express from 'express';
import { PrismaClient } from '@prisma/client';
import UserHandler  from '../src/handlers/user_handler';
import { UserRepo }  from '../src/repositories/user_repo';
import TUserRepo  from '../src/repositories/type_user_repo';
import { UserUsecase }  from '../src/usecases/user_usecase';
import { TPremiumRepo } from '../src/repositories/type_premium_repo';
import { PremiumRepo } from '../src/repositories/premium_repo';
import { TSwipeRepo } from '../src/repositories/type_swipe_repo';
import { SwipeRepo } from '../src/repositories/swipe_repo';
import { jwtAuthMiddleware } from "../src/utils/middlewares";
import errorHandler from '../src/utils/error';
import { checkIntegrationUser, deleteTestPremium, deleteTestSwipe, deleteTestUser, getBasicCredentials, getToken } from './helper';


const prisma = new PrismaClient();

const userRepo: TUserRepo = new UserRepo(prisma);
const premiumRepo: TPremiumRepo = new PremiumRepo(prisma);
const swipeRepo: TSwipeRepo = new SwipeRepo(prisma);

const userUsecase: UserUsecase = new UserUsecase(userRepo, swipeRepo, premiumRepo);
const userHandler = new UserHandler(userUsecase);
let token: string;
let credentials: string;

const app = express();
app.use(express.json());
app.post('/api/signup', (req, res, next) => userHandler.signup(req, res, next));
app.post('/api/login', (req, res, next) => userHandler.login(req, res, next));
app.get('/api/swipe-list', 
  (req, res, next) => jwtAuthMiddleware(req, res, next, userRepo),
  (req, res, next) => userHandler.swipeList(req, res, next)
);
app.post('/api/swipe', 
  (req, res, next) => jwtAuthMiddleware(req, res, next, userRepo),
  (req, res, next) => userHandler.swipe(req, res, next)
);
app.post('/api/purchase-premium', 
  (req, res, next) => jwtAuthMiddleware(req, res, next, userRepo),
  (req, res, next) => userHandler.purchasePremium(req, res, next)
);
app.use(errorHandler);


jest.mock('../src/utils/logger'); // Mock logger supaya tidak perlu logging saat test dijalankan



beforeAll(async () => {
  await checkIntegrationUser(prisma);
  await deleteTestPremium(prisma);
  await deleteTestSwipe(prisma);
  await deleteTestUser(prisma);
  credentials = await getBasicCredentials();
  token = await getToken(app);
});
  
afterAll(async () => {
  await prisma.$disconnect(); // Tutup koneksi Prisma setelah semua tes selesai
});


describe('User API Endpoints', () => {
  describe('POST /api/signup', () => {
    it('should create a user and return the user data', async () => {
      const response = await request(app)
        .post('/api/signup')
        .set('authorization', `Basic ${credentials}`)
        .send(
          {
            "name": "test",
            "email": "test@mail.com",
            "password": "password",
            "gender": "female",
            "birthDate": "19/09/2000"
          }
        );
      
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data.name).toBe('test');
    });

    it('should return 400 if user creation fails', async () => {
      const response = await request(app)
        .post('/api/signup')
        .set('authorization', `Basic ${credentials}`)
        .send(
          {
            "name": "test",
            "email": "test@mail.com",
            "password": "password",
            "gender": "female"
          }
        );

      expect(response.status).toBe(400);
      expect(response.body.data).toBeNull();
    });
  });

  describe("POST /api/swipe", () => {
    it('should success swipe user data', async () => {
      const response = await request(app)
        .post('/api/swipe')
        .set('authorization', `Bearer ${token}`)
        .send(
          {
            "status": "PASS",
            "swipedUserId": 3
          }
        );
        
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data.status).toBe('PASS');
    });

    it('should failed to validate request swipe user data', async () => {
      const response = await request(app)
        .post('/api/swipe')
        .set('authorization', `Bearer ${token}`)
        .send(
          {
            "status": "No",
            "swipedUserId": 3
          }
        );
          
      expect(response.status).toBe(403);
      expect(response.body.data).toBeNull();
    });

    it('should failed swipe user data if swiped user already swiped', async () => {
      const response = await request(app)
        .post('/api/swipe')
        .set('authorization', `Bearer ${token}`)
        .send(
          {
            "status": "LIKE",
            "swipedUserId": 6
          }
        );
      expect(response.status).toBe(403);
      expect(response.body.data).toBeNull();
      expect(response.body.message).toBe("You have already swiped on this profile today");
    });
  });

  describe("POST /api/purchase-premium", () => {
    it('should success swipe user data', async () => {
      await prisma.premium.deleteMany({
        where: {
          userId: 6
        }
      });

      const response = await request(app)
        .post('/api/purchase-premium')
        .set('authorization', `Bearer ${token}`);
        
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('data');
    });

    it('should failed if user already registered premium user', async () => {
      const response = await request(app)
        .post('/api/purchase-premium')
        .set('authorization', `Bearer ${token}`);

      expect(response.status).toBe(400);
      expect(response.body.data).toBeNull();
      expect(response.body.message).toBe("User already registered in premium member");
    });
  });
  

  describe('GET /api/swipe-list', () => {
    it('should return list of users', async () => {
      const response = await request(app)
        .get('/api/swipe-list')
        .set('authorization', `Bearer ${token}`);
    
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it('should return error unauthorized', async () => {
      const response = await request(app)
        .get('/api/swipe-list');
      
      expect(response.status).toBe(401);
    });
  });

});
