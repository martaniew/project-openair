const setCache =  (req, res, next) => {
   
    res.setHeader('Cache-Control', 'no-cache')
   
    next()
  }

  export {setCache}; 