import { PipeTransform, Pipe } from "@angular/core";
@Pipe({
    name: 'transformUsername'
})
export class TransformUsername implements PipeTransform {
    transform(value: string): string {
        let firstChar = value.split(" ")[0].split('')[0].toUpperCase();
        let secondChar = value.split(" ")[1].split('')[0].toUpperCase();
        return firstChar+secondChar;
    }
}