import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()
import * as argon2 from "argon2";
import { fa, faker } from '@faker-js/faker';
import { Allergen } from "./allergens";
/**
 * jelszót titkosít
 * @param pass 
 * @returns hash jelszó
 */
async function hash(pass: string) {
    const secret = await argon2.hash(pass)
    return secret
}

/**
 * be tölt egy alapértelmezett Managert az adatbázisba
 */
async function seedAdmin() {
    const admin = await prisma.users.create({
        data: {
            email: "manager@example.com",
            name: "Manager User",
            /**az evn lévő megadott password hash-jük*/
            password: await hash(process.env.ADMIN_PASS),
            role: "manager"
        }
    })
    otherSeed()
}

async function otherSeed() {
    let allegenLenght
    //allegens
    try {
        const response = await fetch("./allergens.json")
        const x = await response.json() as Allergen[]
        allegenLenght = x.length
        for (let i = 0; i < x.length; i++) {
            prisma.allergens.create({
                data : {
                    name : x[i].name
                }
            })
        }
    } catch {
        console.log('hiba a allergens-el')
    }
    //conection table
    if (allegenLenght != 0) {
        for (let i = 0; i < 20; i++) {
            prisma.recipe_Allergens.create({
                data: {
                    allergen_id: faker.number.int({ min: 1, max: allegenLenght }),
                    recipe_id: faker.number.int({ min: 1, max: 10 })
                }
            })
        }
    }
    //recipes
    for (let i = 0; i < 10; i++) {
        prisma.recipes.create({
            data: {
                title: faker.lorem.words({ min: 1, max: 100 }),
                description: faker.lorem.words({ min: 1, max: 300 }),
                content: faker.lorem.text(),
                preptime: faker.number.int({ min: 1, max: 150 }),
                user_id: 1 //this for the default admin
            }
        })
    }
    //ratings
    for (let i = 10; i < 11; i++) {
        prisma.ratings.create({
            data: {
                content: faker.lorem.text(),
                user_id: 1,  //this for the default admin
                recipe_id: faker.number.int({ min: 1, max: 10 }),
                rating: faker.number.int({ min: 1, max: 5 })
            }
        })
    }
}
seedAdmin()