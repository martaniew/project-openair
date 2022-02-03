const setCache =  (req, res, next) => {
    // here you can define period in second, this one is 5 minutes
   
  
    // you only want to cache for GET requests
    if (req.method == 'GET') {
      res.set('Cache-control', `no-cache, max-age=0, private`)
    } else {
      // for the other requests set strict no caching parameters
      res.set('Cache-control', `no-store`)
    }
  
    // remember to call next() to pass on the request
    next()
  }

  export {setCache}; 