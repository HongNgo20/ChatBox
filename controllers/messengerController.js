const express = require('express')
const router = express.Router()
const Message = require('../models/messenger')

router.get('/', function(req, res){
    Message.find({},(err, messages)=>{
      if (err) res.send(err);
      res.render("index.ejs",{messages:messages})
    })
  });
  
  
router.post('/', function (req, res) {
      Message.create(req.body, (err, messages) => {
      if (err) res.send(err);
      res.redirect("/messenger")
      })
    })
  
router.delete('/:id', (req, res) => {
      try{
        Message.findByIdAndDelete(req.params.id, (err, deletedMessages) => {
          if (err){
            console.log(err)
            res.send(err)
          } else {
          res.redirect('/messenger')
          }
        })
      }
      catch (err) {
        res.send(err.message)
      }
    })
  
//edit route
router.get('/:id/edit', (req, res) => {
    try{
        Message.findById(req.params.id, (err, foundMessage) => {
            if(err) {
                 res.send(err)
            } else { 
                res.render('edit.ejs', {
                message: foundMessage
            })
        }
        })
    }
    catch (err) {
        res.send(err.message)
    }
})

// update route
router.put('/:id/', (req, res) => {
  try {
      console.log(req.body)

      Message.findByIdAndUpdate(req.params.id, req.body, {new: true}, (err, updatedMessage) => {
        console.log(updatedMessage)  
        if(err) {
              res.send(err)
         } else { 
              res.redirect('/messenger/')
         }
      })
  }
  catch (err) {
      res.send(err.message)
  }
})




  
module.exports = router