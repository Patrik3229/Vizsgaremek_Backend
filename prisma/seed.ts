import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()
import * as argon2 from "argon2";

/**
 * jelszót titkosít
 * @param pass 
 * @returns hash jelszó
 */
async function hash (pass : string){
    const secret = await argon2.hash(pass)
    return secret
}

/**
 * be tölt egy alapértelmezett Managert az adatbázisba
 */
async function seedAdmin(){
    const admin = await prisma.users.create({
        data : {
            email : "manager@example.com",
            name : "Manager User",
            /**az evn lévő megadott password hash-jük*/
            password : await hash(process.env.ADMIN_PASS),
            role : "manager"
        }
    })
}
seedAdmin()