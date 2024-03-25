import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient()
import * as argon2 from "argon2";
import { faker } from '@faker-js/faker';
import { Allergen } from "./allergens";
import {promises as fs} from 'fs'
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
    await otherSeed() /**modosított rating */
    //AllergensFinalSeed() /**modosított rating */
}

async function otherSeed() {
    let allegenLenght = 0
    /**allergens */
    try {
        const response = await fs.readFile("./prisma/allergens.json", "utf8")
        const x = JSON.parse(response) as Allergen[]
        allegenLenght = x.length
        for (let i = 0; i < x.length; i++) {
            const y = await prisma.allergens.create({
                data: {
                    name: x[i].name
                }
            })
        }
    } catch(e) {
        console.log(e)
    }
    /**recipes + conection table*/
    for (let i = 0; i < 10; i++) {
        const x = await prisma.recipes.create({
            data: {
                title: faker.lorem.words({ min: 1, max: 100 }),
                description: faker.lorem.words({ min: 1, max: 300 }),
                content: faker.lorem.text(),
                preptime: faker.number.int({ min: 1, max: 150 }),
                user_id: 1 //this for the default admin
            }
        })
        for (let i = 0; i < 5; i++) {
            const y = await prisma.recipe_Allergens.create({
                data: {
                    allergen_id: faker.number.int({ min: 1, max: allegenLenght }),
                    recipe_id: x.id
                }
            })
        }
    }
    /**ratings*/
    for (let i = 10; i < 11; i++) {
        const x = await prisma.ratings.create({
            data: {
                content: faker.lorem.text(),
                user_id: 1,  //this for the default admin
                recipe_id: faker.number.int({ min: 1, max: 10 }),
                rating: faker.number.int({ min: 1, max: 5 })
            }
        })
    }
}

/**
 * allergen seed a final-hoz
 */
async function AllergensFinalSeed() {
    try {
        const response = await fs.readFile("./prisma/allergens.json", "utf8")
        const x = JSON.parse(response) as Allergen[]
        for (let i = 0; i < x.length; i++) {
            const y = await prisma.allergens.create({
                data: {
                    name: x[i].name
                }
            })
        }
    } catch (e) {
        console.log(e)
    }
}
seedAdmin()