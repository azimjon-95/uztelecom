import axios from "axios";

const mainURL = axios.create({
  baseURL: "http://localhost:5500",
});

export default mainURL;
