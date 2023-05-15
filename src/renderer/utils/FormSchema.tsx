import * as Yup from "yup";

const FormSchema = Yup.object({
    // email: Yup.string()
    //     .required("Email required!")
    //     .email("Invalid email format!")
    //     .max(100, "Email too long!"),
    password: Yup.string()
        .required("Password required!")
        .min(6, "Password too short!")
        .max(28, "Password too long!")
});

export default FormSchema