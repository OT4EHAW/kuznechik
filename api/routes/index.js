import express from "express"

import Account from "../models/Account"
import Group from "../models/Group"
import { checkUserToken, createUserToken, updateUserToken } from "../utils/token";
import { hashHelper } from "../utils/hash";
import tokenHelper from "../utils/token/helper";


const router = express.Router()

const verify = (req, res) => {
  const accessToken = req.headers.authorization
  if (!checkUserToken(accessToken)) {
    res.status(401).send("invalid token...");
    return false
  }
  return true
}

/* POST create new account */
router.post('/account/new', (req, res) => {
  const { email, password } = req.body
  Account.findById(email)
    .then(data => {
      if (data !== null || data === {}) {
        // уже есть пользователь с таким логином
        return res.status(409).send("уже есть пользователь с таким логином");
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
        res.status(500).send("ошибка при создании аккаунгта");
      })
    }).catch(error=>{
      res.status(500).send(error)
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
       res.status(406).send("неверный пароль");
        return
      }
      let token = null
      try {
        // генетация токена
        token = createUserToken(account._id)
      } catch {
        res.status(520).json(null)
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
      res.status(404).send("пользователь не найден");
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
        return res.status(401).send("невозможно обновить токен");
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
    res.status(500).send("пользователь не найден");
  })
})

/* GET all */
router.get('/group', (req, res) => {
  verify(req, res)
  const user_id = tokenHelper.getUser(req.headers.authorization)
  if (!user_id) {
    console.error("user_id",user_id);
    res.status(401).send("пользователь не определен");
    return
  }
  Group.find({user_id: user_id}).sort({name: 0}).then(data => {
    res.status(200).json({items: data})
  }).catch(err => {
    res.status(500).json(err)
  })
})

/* POST create new account */
router.post('/group/new', (req, res) => {
  verify(req, res)
  const { name, password } = req.body
  Group.find({ name })
    .then(data => {
      console.log("data",data.length);
      if (data.length !== 0) {
        // уже есть группа с таким названием
        console.error("data",data.length);
        res.status(409).send("название группы должно быть уникальным");
        return
      }
      const gost_hash_512 = hashHelper.streebog_512(password)
      if (!gost_hash_512) {
        console.error("gost_hash_512",gost_hash_512);
        res.status(500).send("ошибка обработки пароля");
        return
      }
      const user_id = tokenHelper.getUser(req.headers.authorization)
      if (!user_id) {
        console.error("user_id",user_id);
        res.status(401).send("пользователь не определен");
        return
      }
      console.warn(" new Group", name);
      new Group({
        name,
        gost_hash_512,
        user_id
      }).save()
        .then(data => {
          console.log(data);

          res.status(200).json({items: data})
        }).catch(error => {
        console.error(error);
        res.status(500).send(error)
      })
    }).catch(error=>{
    console.error("error",error)
    res.status(500).send(error)
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
