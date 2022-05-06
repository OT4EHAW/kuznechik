import express from "express"

import Account from "../models/Account"
import Group from "../models/Group"
import Record from "../models/Record"
import tokenHelper from "../utils/token/helper";
import { hashHelper } from "../utils/hash";
import { cipherHelper } from "../utils/cipher";
import { checkUserToken, createUserToken, updateUserToken } from "../utils/token";


const router = express.Router()

/**
 * ACCOUNT - профиль пользователя для аутентификации
 */

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

/**
 * GROUP - группа записей пользователя
 */

/* GET user groups*/
router.get('/group', (req, res) => {
  if (!checkUserToken(req.headers.authorization)) {
    res.status(401).send("invalid token...");
    return;
  }
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

/* POST create new group for user*/
router.post('/group/new', (req, res) => {
  if (!checkUserToken(req.headers.authorization)) {
    res.status(401).send("invalid token...");
    return;
  }
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
          res.status(200).json(data)
        }).catch(error => {
        console.error(error);
        res.status(500).send(error)
      })
    }).catch(error=>{
    console.error("error",error)
    res.status(500).send(error)
  })
})

/* POST create new record for group*/
router.post('/group/verify', (req, res) => {
  if (!checkUserToken(req.headers.authorization)) {
    res.status(401).send("invalid token...");
    return;
  }
  const { group } = req.body
  Group.findById( group._id )
    .then(data => {
      if (!data) {
        console.error("group",data);
        res.status(404).send("группа не найдена");
        return
      }
      console.log("group",group);
      const gost_hash_512 = hashHelper.streebog_512(group.password)
      if (gost_hash_512 !== data.gost_hash_512) {
        console.error("gost_hash_512",gost_hash_512);
        res.status(406).send("неверный пароль для указанной группы");
        return
      }
      res.status(200).json(data)
    }).catch(error=>{
    console.error("error",error)
    res.status(500).send(error)
  })
})


/**
 * RECORD - запись пользователя о доступе к некоторому ресурсу
 */

/* GET all group records*/
router.get('/record', (req, res) => {
  if (!checkUserToken(req.headers.authorization)) {
    res.status(401).send("invalid token...");
    return;
  }
  const {group_id}  = req.query
  console.log("group_id",group_id);
  if (!group_id) {
    Record.find().sort({label: 0}).then(data => {
        res.status(200).json({items: data})
      }).catch(err => {
      res.status(500).send("не удалось получить записи для указанной группы");
    })
    return;
  }
  Group.findById(group_id).then(data => {
    Record
      .find({group_id: data._id})
      .sort({label: 0})
      .then(data => {
        console.log(data.length)
      res.status(200).json({items: data})
    }).catch(err => {
      res.status(500).send("не удалось получить записи для указанной группы");
    })
  }).catch(err => {
    res.status(500).send("не удалось получить группу");
  })
})


/* POST create new record for group*/
router.post('/record/new', (req, res) => {
  if (!checkUserToken(req.headers.authorization)) {
    res.status(401).send("invalid token...");
    return;
  }
  const { record, group } = req.body
  Group.findById( group._id )
    .then(data => {
      if (!data) {
        console.error("group",data);
        res.status(404).send("группа не найдена");
        return
      }
      console.log("group",group);

      const gost_hash_512 = hashHelper.streebog_512(group.password)
      if (gost_hash_512 !== data.gost_hash_512) {
        console.error("gost_hash_512",gost_hash_512);
        res.status(406).send("неверный пароль для указанной группы");
        return
      }

      console.warn("new Record", record);
      console.error("key",group.password);
      const login_encrypted = cipherHelper.kuznechikEncrypt(record.login, group.password)
      const password_encrypted = cipherHelper.kuznechikEncrypt(record.password, group.password)
      console.error("login_encrypted",login_encrypted);
      console.error("password_encrypted",password_encrypted);

      const encrypted_fields_str = `${record.login}${record.password}`
      const encrypted_fields_gost_hash_512 =  hashHelper.streebog_512(encrypted_fields_str)

      new Record({
        group_id: group._id || null,
        label: record.label,
        login_encrypted,
        password_encrypted,
        encrypted_fields_gost_hash_512
      }).save()
        .then(data => {
          console.log(data);
          res.status(200).json(data)
        }).catch(error => {
        console.error(error);
        res.status(500).send(error)
      })
    }).catch(error=>{
    console.error("error",error)
    res.status(500).send(error)
  })
})


/* POST open encrypted record fields*/
router.post('/record/open', (req, res) => {
  if (!checkUserToken(req.headers.authorization)) {
    res.status(401).send("invalid token...");
    return;
  }
  const {group, record_id} = req.body
  Group.findById(group._id).then(data => {
    const gost_hash_512 = hashHelper.streebog_512(group.password)
    if (gost_hash_512 !== data.gost_hash_512) {
      res.status(406).send("неверный пароль для указанной группы");
      return
    }
    Record.findById(record_id).then(data => {
      console.error("login_encrypted",data.login_encrypted);
      console.error("password_encrypted",data.password_encrypted);
      console.error("key",group.password);

      const login_decrypted = cipherHelper.kuznechikDecrypt(data.login_encrypted, group.password)
      const password_decrypted = cipherHelper.kuznechikDecrypt(data.password_encrypted, group.password)
      console.error("login",login_decrypted);
      console.error("password",password_decrypted);
      const encrypted_fields_gost_hash_512 =  hashHelper.streebog_512(`${login_decrypted}${password_decrypted}`)
      if (encrypted_fields_gost_hash_512 !== data.encrypted_fields_gost_hash_512) {

        res.status(520).send("потеряна целостность указанной записи");
        return
      }
      res.status(200).json({
        group_id: data.group_id,
        label: data.label,
        login: login_decrypted,
        password: password_decrypted
      })
    }).catch(err => {
      res.status(500).send("не удалось получить записи для указанной группы");
    })
  }).catch(err => {
    res.status(500).send("не удалось получить группу");
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
