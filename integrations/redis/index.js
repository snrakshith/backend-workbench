import axios from "axios";
import express from "express";
import { createClient } from "redis";

const app = express();
app.use(express.json());

const client = createClient({
  url: "redis://redis:6379",

  // url: process.env.REDIS_URL,
  // password: process.env.REDIS_PASSWORD,
});

client.on("error", async (err) => {
  console.log(err);
});
await client.connect().catch(console.error);

const homePageAPI = async (req, res) => {
  try {
    const { id } = req.params;

    const cashedPosts = await client.get(`posts-${id}`);
    if (cashedPosts) {
      const posts = JSON.parse(cashedPosts);
      return res.json({ posts });
    }

    const response = await axios.get(
      `https://jsonplaceholder.typicode.com/posts/${id}`
    );
    const postData = JSON.stringify(response.data);
    // const setNewData = await client.set(`post-${id}`, postData);
    // const setExpiry = await client.expire(`post-${id}`, 60);
    await client.set(`post-${id}`, postData, "EX", 10);
    return res.json({ data: response.data });
  } catch (error) {
    return res.json({ msg: error });
  }
};

app.get("/", async (req, res) => {
  const { key } = req.body;
  const value = await client.get(key);
  res.json({ value });
});

app.post("/", async (req, res) => {
  const { key, value } = req.body;
  const data = await client.set(key, value);
  res.json({ data });
});

app.get("/home", homePageAPI);

app.listen(5000, () => console.log("App running on 5000"));
