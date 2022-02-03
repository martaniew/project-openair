const setCache =  (req, res, next) => {
   
      res.set('Cache-control', `no-store`)
   
    next()
  }

  export {setCache}; 