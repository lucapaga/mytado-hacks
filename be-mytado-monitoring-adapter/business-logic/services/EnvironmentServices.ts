export class EnvironmentServices {
    public envVariable(value: string | undefined): string {
        console.log("Analyzing value >" + value + "<");
        return ((value == null || value == undefined) ? "" : "" + value);
    }
}