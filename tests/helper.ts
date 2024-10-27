import { PrismaClient } from "@prisma/client";
import { Application } from "express";
import request from 'supertest';


export const checkIntegrationUser = async(prisma: PrismaClient) => {
  const checkUser = await prisma.user.findFirst({
    where: {
      email: 'integration@mail.com'
    }
  });
  if (!checkUser) {
    await prisma.user.create({
      data: {
        name: "integration",
        gender: "male",
        email: "integration@mail.com",
        birthdate: "19/09/2000",
        password: "password"
      }
    });
  }
};

export const deleteTestPremium = async(prisma: PrismaClient) => {
  return await prisma.premium.deleteMany({
    where: {
      User: {
        email: {
          contains: 'test'
        }
      }
    }
  });
};

export const deleteTestSwipe = async(prisma: PrismaClient) => {
  return await prisma.swipe.deleteMany({
    where: {
      swipedUserId: 3,
      swiperId: 6
    }
  });
};

export const deleteTestUser = async(prisma: PrismaClient) => {
  return await prisma.user.deleteMany({
    where: { email: {
      contains: 'test'
    }}
  });
};

export const getBasicCredentials = async()=> {
  const username = 'admin';
  const password = 'password';
  const encodeCredentials = (username: string, password: string) => {
    return Buffer.from(`${username}:${password}`).toString('base64');
  };
  const credentials = encodeCredentials(username, password);
  return credentials;
};

export const getToken = async(app: Application) => {
  const responseLogin = await request(app)
    .post("/api/login")
    .set('authorization', `Basic ${getBasicCredentials()}`)
    .send(
      {
        "email": "integration@mail.com",
        "password": "password"
      }
    );

  return responseLogin.body.data.accessToken;
};