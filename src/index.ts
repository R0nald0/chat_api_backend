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
import ConversastionController from './controller/ConversastionController';

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
app.use('', videosRouter);

const PORT = process.env.PORT || 3000;

const users = new Map();

io.on('connection', (socket) => {

  socket.on('joinedConversation', (conversationId) => {
    console.log('User joined Conversation ' + conversationId);
    socket.join(conversationId);
  });

  socket.on('register',(userId) =>{
    users.set(userId,socket.id);
    
  })

  socket.on('sendMessage', async (message) => {
    const { conversationId, senderId, content, destinationId, subject, unReadMessage } = message;

    try {
    
        const message = await MessageController.createMessage(senderId, content, conversationId);
        const updatedConversation =  await MessageController.updatedConversation(conversationId, message, senderId)
        
        io.to(conversationId).emit('newMessage', message);
        io.to(conversationId).emit('updateMessage', updatedConversation); 
      

        const destSokcteId = users.get(destinationId);
         if (destSokcteId) {
          io.to(destSokcteId).emit('updateMessage', updatedConversation);
          
        } 
      
    

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
