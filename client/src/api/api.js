import axios from 'axios';

export default axios.create({
    // baseURL: "http://localhost:5000/",
    baseURL: "http://localhost:5000/api/v1",
    // baseURL: "https://my-json-server.typicode.com/suhailsajahan/pearlDB",
});
