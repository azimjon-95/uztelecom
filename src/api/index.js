import axios from "axios";

const mainURL = axios.create({
  baseURL: "https://api.uztelecom.dadabayev.uz/api",
});

export default mainURL;
