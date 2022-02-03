const setCache =  (req, res, next) => {
   
    res.setHeader('Cache-Control', 'no-store')
    next()
  }

  export {setCache}; 