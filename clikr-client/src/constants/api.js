const windowSplit = window.location.href.split("/")
const base = windowSplit[0] + "//" + windowSplit[2] + "/"

export const socketioURL =
         process.env.NODE_ENV === "production"
           ? base
           : "http://localhost:5000/";
export const baseURL = socketioURL + "api/v1/"; 