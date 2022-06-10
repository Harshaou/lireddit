import 'reflect-metadata'
import { ApolloServer } from 'apollo-server-express'
import express from 'express'
import { buildSchema } from "type-graphql";
import Redis from "ioredis";
import session from "express-session";
import connectRedis from "connect-redis";
import { COOKIE_NAME, __prod__ } from './constants'
import { HelloResolver } from './resolvers/helo'
import { PostResolver } from './resolvers/post';
import { UserResolver } from './resolvers/user';
import cors from "cors";
import { createConnection } from "typeorm";
import { Post } from './entities/Post';
import { User } from './entities/User';
// import { sendEmail } from './utils/sendEmail';

const main = async () => {
    const conn = await createConnection({
    type: "postgres",
    database: "lireddit2",
    username: "postgres",
    password: "postgres",
    logging: true,
    synchronize: true,
    entities: [Post, User],
  });

   
    const app = express()  
    const RedisStore = connectRedis(session);
    const redis = new Redis();

    app.use(
    cors({
      origin: "http://localhost:3000",
      credentials: true,
    })
  );
 
    app.use(
        session({
        name: COOKIE_NAME,
        store: new RedisStore({
            client: redis,
            disableTouch: true,
        } as any),
        cookie: {
            maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // 10 years
            httpOnly: true,
            sameSite: "lax", // csrf
            secure: __prod__, // cookie only works in https
        },
        saveUninitialized: false,
        secret: "qowiueojwojfalksdjoqiwueo",
        resave: false,
        })
    );

    const appolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [HelloResolver, PostResolver, UserResolver],
            validate: false
            
        }),
       context: ({ req, res }) => ({ req, res, redis })
    })

    appolloServer.applyMiddleware({ app, cors: false })
    
   
    app.listen(4000, () => {
        console.log('Server is running on port 4000')
    })
    }

    main().catch(err => console.error(err))