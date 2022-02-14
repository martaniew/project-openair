import path from 'path'
import express from 'express'
import dotenv from 'dotenv'
import colors from 'colors'
import morgan from 'morgan'
import cors from 'cors'
import rateLimit from 'express-rate-limit'
import helmet from 'helmet'
import cookies from 'cookie-parser'
import { notFound, errorHandler } from './middleware/errorMiddleware.js'
import connectDB from './config/db.js'
import mongoSanitize from 'express-mongo-sanitize'
import xss from 'xss-clean'
import activityRoutes from './routes/activityRoutes.js'
import userRoutes from './routes/userRoutes.js'
import uploadRoutes from './routes/uploadRoutes.js'


dotenv.config()

// connection to database 
connectDB()

const app = express()

app.enable('trust proxy'); 


// Impement CORS 
app.use(cors({
   origin: 'https://apenairapp.herokuapp.com'
}))

app.options('*', cors());


// Set security HTTP headers
app.use(helmet()); 

app.use(
  helmet
  .contentSecurityPolicy({
    directives: {
      "default-src": ["'self'"],
      "connect-src": ["'self'", 'https://maps.googleapis.com' ],
      "img-src": ["'self'", "data:", 'https://maps.gstatic.com', 'https://maps.googleapis.com/'],
      "style-src-elem": ["'self'",  'https://fonts.googleapis.com', 'https://cdnjs.cloudflare.com/', 'https://maps.googleapis.com', "'sha256-mmA4m52ZWPKWAzDvKQbF7Qhx9VHCZ2pcEdC0f9Xn/Po='", "'sha256-/VVOq+Ws/EiUxf2CU6tsqsHdOWqBgHSgwBPqCTjYD3U='", "'sha256-lqO9GtizDrXbeRXIR3ynpmU+gCyvU40G2GmqvrAGxBk='", "'sha256-g9aHNH7iF2hhGZYtVVd5mKQSnyLPmXWw5gwiuxBVonI='", "'sha256-EmpgQBYw6JFHxarOZhE2iFtBzBewJeLNUVVHfvN3Obw='", "'sha256-6EhLFF8G95u/ybGSFfUDwCI+tUnGaFOU7YO6RWksdT8='"],
      "script-src": [ "'self'", "'sha256-1kri9uKG6Gd9VbixGzyFE/kaQIHihYFdxFKKhgz3b80='",  'https://apis.google.com', 'https://maps.googleapis.com', 'https://unpkg.com', 'https://cdnjs.cloudflare.com/'],
      "object-src": ["'none'"],
      "font-src" : ["'self'", 'https://cdnjs.cloudflare.com/'], 
      "style-src" : [ "'self'", 'https://cdnjs.cloudflare.com', 'https://maps.googleapis.com/' ],
    },
  })
);


// Developement loging 
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

// Limit request from same API
const limiter = rateLimit({
  max:200, 
  windowMs: 60 * 60 * 1000,
  message: 'To many request from this IP, please try again in an hour'
})
app.use('/api', limiter)

//Body parser, reading data from the body with amount of data limited to 10 kb 
app.use(express.json({ limit: '10kb'}))

// Data sanitization againts NoSql query injection
app.use(mongoSanitize())

//Data sanitization againts XSS attacks 
app.use(xss()); 

// Cookie parser to receive data from cookies
app.use(cookies()); 


// Routes 
app.use('/api/activities', activityRoutes)
app.use('/api/users', userRoutes)
app.use('/api/upload', uploadRoutes)

// Serving static files 
const __dirname = path.resolve()
app.use('/uploads', express.static(path.join(__dirname, '/uploads')))

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '/frontend/build')))

  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'))
  )
} else {
  app.get('/', (req, res) => {
    res.send('API is running....')
  })
}

app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT || 5000

app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  )
)
