import express from "express"

import Account from "../models/Account"
import Group from "../models/Group"
import { checkUserToken, createUserToken, updateUserToken } from "../utils/token";
import { hashHelper } from "../utils/hash";


const router = express.Router()

const verify = (req, res) => {
  const accessToken = req.headers.authorization
  console.log("req",req)
  if (!checkUserToken(accessToken)) {
    res.status(401).send("invalid token...");
  }
}

/* POST create new account */
router.post('/account/new', (req, res) => {
  const { email, password } = req.body
  Account.findById(email)
    .then(data => {
      if (data !== null || data === {}) {
        // уже есть пользователь с таким логином
        return res.status(409).json({})
      }
      const gost_hash_512 = hashHelper.streebog_512(password)
      new Account({
        _id: email,
        email,
        gost_hash_512
      }).save()
        .then(data => {
          res.status(200).json(data)
        }).catch(error => {
        res.status(500).json(error)
      })
    }).catch(error=>{
      res.status(500).json(error)
     })
})

/* POST login account */
router.post('/account/login', (req, res) => {
  const { email, password } = req.body
  Account.findById(email)
    .then(account => {
      // аутентификация - проверка пароля по хэш-коду
      const gost_hash_512 = hashHelper.streebog_512(password) // потом заменить на hash-функцию
      if (account.gost_hash_512 !== gost_hash_512) {
        return res.status(406).json(null)
      }
      let token = null
      try {
        // генетация токена
        token = createUserToken(account._id)
      } catch {
        return res.status(520).json(null)
      }

      // отправка ответа с полученными данными
      res.status(200).json({
        user: {
          _id: account._id,
          email: account.email
        },
        token: {
          access_token: token.accessToken,
          refresh_token:  token.refreshToken
        }
      })
    }).catch(err => {
      res.status(500).json(err)
    })
})

/* POST refresh account */
router.post('/account/refresh', (req, res) => {
  const { _id, refresh_token } = req.body
  Account.findById(_id)
    .then(account => {
      // обновление токена
      const token = updateUserToken(_id, refresh_token)


      if (!token) {
        return res.status(406).json(null)
      }
      res.status(200).json({
        user: {
          _id: account._id,
          email: account.email
        },
        token: {
          access_token: token.accessToken,
          refresh_token:  token.refreshToken
        }
      })
    }).catch(err => {
    res.status(500).json(err)
  })
})

/* GET all */
router.get('/group', (req, res) => {
  verify(req, res)
  Group.find().then(data => {
    res.status(200).json(data)
  }).catch(err => {
    res.status(500).json(err)
  })
})

/* POST create new account */
router.post('/group/new', (req, res) => {
  const { name, password } = req.body
  Group.findById(name)
    .then(data => {
      if (data !== null || data === {}) {
        // уже есть группа с таким названием
        return res.status(406).json({})
      }
      const gost_hash_512 = hashHelper.streebog_512(password)
      new Group({
        name,
        gost_hash_512
      }).save()
        .then(data => {
          res.status(200).json({items: data})
        }).catch(error => {
        res.status(500).json(error)
      })
    }).catch(error=>{
    res.status(500).json(error)
  })
})
/*/!* GET all *!/
router.get('/group/:id', (req, res) => {
  verify(req.headers.authorization, res)
  Record.find(filter).then(data => {
    res.status(200).json(data)
  }).catch(err => {
    res.status(500).json(err)
  })
})*/




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
