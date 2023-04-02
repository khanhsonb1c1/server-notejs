const BlogRoute = require("./BlogRouter")

const app = express();


app.use("/api/blog", BlogRoute);


