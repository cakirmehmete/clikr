export const socketioURL =
         process.env.NODE_ENV === "production"
           ? "https://clikr.herokuapp.com/"
           : "http://localhost:5000/";
export const baseURL = socketioURL + "api/v1/"; 