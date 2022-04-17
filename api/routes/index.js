import express from "express"

import Account from "../models/Account"
// import {Streebog} from "../utils/Streebog";

const router = express.Router()

/* GET all */
router.get('/account', (req, res) => {
  Account.find({}).then(data => {
    res.status(200).json(data)
  }).catch(err => {
    res.status(500).json(err)
  })
})


/* GET account by id */
router.get('/account/:id', (req, res) => {
  Account.findById(req.params.id)
    .then(data => {
     // let t= new Streebog(false)
     // console.warn(t)
      /* let t= new Streebog(false)
       let result = t.getHash(password, false)
       console.warn(result)*/
      res.status(200).json(data)
    }).catch(err => {
      res.status(500).json(err)
    })
})

/* POST create new account */
router.post('/account/new', (req, res) => {
  const { email, gost_hash_512 } = req.body
  Account.findById(email)
    .then(data => {
      if (data !== null || data === {}) {
        return res.status(406).json({})
      }
      new Account({
        _id: email,
        email,
        gost_hash_512
      }).save()
        .then(data => {
          res.status(201).json(data)
        }).catch(err => {
        res.status(500).json(err)
      })
    }).catch(()=>{
    res.status(500).json(err)
  })


})

/* PUT update account by id */
router.put('/account/update', (req, res) => {
  const { _id, email, gost_hash_512 } = req.body
  Account.findByIdAndUpdate(_id, { email, gost_hash_512 }, { new: true })
    .then(data => {
      res.status(200).json(data)
    }).catch(err => {
      res.status(500).json(err)
    })
})

/* DELETE delete account by id */
router.delete('/account/delete', (req, res) => {
  const { id } = req.body
  Account.findByIdAndDelete(id)
    .then(data => {
      res.status(200).json(data)
    }).catch(err => {
      res.status(500).json(err)
    })
})

module.exports = router
