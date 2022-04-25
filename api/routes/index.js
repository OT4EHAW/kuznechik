import express from "express"

import Account from "../models/Account"
import {createAccessToken, createRefreshToken, verifyToken} from "../utils/token";
import { createHashCode } from "../utils/hashCode";

const router = express.Router()

const verify = (token, res) => {
  if (verifyToken(token)) {
    return
  }
  res.status(401).send("invalid token...");
}

/* POST create new account */
router.post('/account/new', (req, res) => {
  const { email, password } = req.body
  Account.findById(email)
    .then(data => {
      if (data !== null || data === {}) {
        return res.status(406).json({})
      }
      const gost_hash_512 = createHashCode(password)
      new Account({
        _id: email,
        email,
        gost_hash_512
      }).save()
        .then(data => {
          res.status(201).json(data)
        }).catch(error => {
        res.status(500).json(error)
      })
    }).catch(error=>{
      res.status(500).json(error)
     })
})

/* POST auth account */
router.post('/account/login', (req, res) => {
  const { _id, email, password } = req.body
  Account.findById(_id)
    .then(account => {
      // аутентификация - проверка пароля по хэш-коду
      const gost_hash_512 = createHashCode(password) // потом заменить на hashCode-функцию
      if (account.gost_hash_512 !== gost_hash_512) {
        return res.status(401).json(null)
      }
      // генетация токена для доступа и ключа для его обновления
      const access_token = createAccessToken(_id)
      const refresh_token = createRefreshToken()
      // передача токена
      res.status(200).json({
        user: { _id: account._id, email: account.email },
        token: { access_token, refresh_token }
      })
    }).catch(err => {
      res.status(500).json(err)
    })
})
/* GET all */
router.get('/account', (req, res) => {
  Account.find({}).then(data => {
    res.status(200).json(data)
  }).catch(err => {
    res.status(500).json(err)
  })
})

/* POST refresh account */
/*
router.post('/account/refresh', (req, res) => {
  const { refresh_token } = req.body
  const access_token = ""
  Account.findById(email)
    .then(account => {
      if (account.gost_hash_512 !== gost_hash_512) {
        return res.status(401).json(null)
      }
      res.status(200).json({ user: {id: account.id, email: account.email}, token:{ access_token, refresh_token }})
    }).catch(err => {
    res.status(500).json(err)
  })
})
*/




/*


/!* GET account by id *!/
router.get('/account/:id', (req, res) => {
  Account.findById(req.params.id)
    .then(data => {
      res.status(200).json({...data, hash_code: bytesString})
    }).catch(err => {
      res.status(500).json(err)
    })
})


/!* PUT update account by id *!/
router.put('/account/update', (req, res) => {
  const { _id, email, gost_hash_512 } = req.body
  Account.findByIdAndUpdate(_id, { email, gost_hash_512 }, { new: true })
    .then(data => {
      res.status(200).json(data)
    }).catch(err => {
      res.status(500).json(err)
    })
})

/!* DELETE delete account by id *!/
router.delete('/account/delete', (req, res) => {
  const { id } = req.body
  Account.findByIdAndDelete(id)
    .then(data => {
      res.status(200).json(data)
    }).catch(err => {
      res.status(500).json(err)
    })
})*/

module.exports = router
