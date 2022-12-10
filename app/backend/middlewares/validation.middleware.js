export default function validator(validationSchema) {
    return (req, res) => {
        console.log("hola", req, validationSchema);
    };
}