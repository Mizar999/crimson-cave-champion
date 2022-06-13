export class Cloner {
    static clone<Type>(value: Type): Type {
        // Easy but slow?
        return JSON.parse(JSON.stringify(value));
    }
}