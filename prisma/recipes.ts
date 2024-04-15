export class Recipes{
    constructor(
        public title : string,
        public description : string,
        public content: string,
        public preptime: number,
        public allergens: number[]
    ){}
}