const express = require("express")
const dotenv = require("dotenv")
dotenv.config()
const connectedDB = require("./src/config/connectedDb")
const { notFound, errorHandler } = require("./src/middelware/errorHandle")
const { default: helmet } = require("helmet")
const cors = require("cors")
const path = require("path")

// init app 
const app = express()

// middleware
app.use(express.json());
app.use(helmet())
app.use(cors())
app.use(express.static(path.join(__dirname, 'public'))); // مهم!

// routes
app.use("/api/auth" , require("./src/route/authRoutes"))
app.use("/api/users" , require("./src/route/userRouts"))
app.use("/api/blog" , require("./src/route/blogRoutes"))
app.use("/api/wallet-requests" , require("./src/route/walletRequestRoutes"))
app.use("/api/cause", require("./src/route/causeRoutes"))

// error handler
app.use(notFound)
app.use(errorHandler)

// running
const PORT = process.env.PORT;
(async () => {
  await connectedDB();
  app.listen(PORT, () => console.log(`Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`));
})();