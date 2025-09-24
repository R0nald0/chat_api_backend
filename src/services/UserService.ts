import { PrismaClient } from "@prisma/client";
import { User } from "../generated/prisma";

const prisma = new PrismaClient({
    omit: {
        user: {
            password: true
        }
    }
})

class UserService{
    
    async update(idUser : number,userDto : User){
         try {
      const user = await prisma.user.update({
        data: userDto,
        where: {
          id: idUser
        }
      })
      return user;

    } catch (err) {
      console.error(err)
    }
  }
    }
     
export default new UserService()