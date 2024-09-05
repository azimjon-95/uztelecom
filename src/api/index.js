
import axios from "axios";

const mainURL = axios.create({
  baseURL: "https://api.uztelicom.dadabayev.uz/api",
});

export default mainURL;
