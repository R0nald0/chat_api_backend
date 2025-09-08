import express from 'express'
import { json } from 'body-parser'
import routes from './routes/routes'
import AuthMiddleware from './middlewares/AuthMiddleware';
import conversationRouter from './routes/conversationRouter';
import userRouter from './routes/userRoutes';

import http from 'http'
import { Server } from 'socket.io';
import messageRouter from './routes/messageRoute';
import MessageController from './controller/MessageController';
import videosRouter from './routes/videosRouter';

const app = express()
const server = http.createServer(app)

const io = new Server(server, {
  cors: {
    origin: '*'
  }
})

app.use(express.json());

// se for receber dados de formulário
app.use(express.urlencoded({ extended: true }));

app.use('/auth', routes);
app.use(AuthMiddleware.vetryToken)

app.use('', conversationRouter)
app.use('', userRouter)
app.use('', messageRouter)
app.use('',videosRouter);

const PORT = process.env.PORT || 3000;

io.on('connection', (socket) => {

  socket.on('joinedConversation', (conversationId) => {
    console.log('User joined Conversation ' + conversationId);
    socket.join(conversationId); // agora o user entra na sala
  });

  socket.on('sendMessage', async (message) => {
    const { conversationId, senderId, content, destinationId, subject } = message;
    try {

      console.log(`Message from ${senderId} in conversation ${conversationId}: ${content}`); console.log(`Message from ${senderId} in conversation ${conversationId}: ${content} To ${destinationId} with subject ${subject}`);

      if (conversationId === 0) {
        const createdConversationId = await MessageController.createConversation(senderId, destinationId, subject)
        const messageSaved  = await MessageController.createMessage(senderId, content, createdConversationId)
        io.to(createdConversationId.toString()).emit('newMessage', {messageSaved});
        return
      }
        const message  = await MessageController.createMessage(senderId, content, conversationId);
        const updatedConversation  =await  MessageController.updatedConversation(conversationId,message)
    
      io.to(conversationId).emit('newMessage', message);
    } catch (err) {
      console.error('Failed to save message', err);
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected', socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`Server listen ontem port ${PORT}`)
})
