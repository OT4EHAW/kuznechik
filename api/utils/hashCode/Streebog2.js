import values from "./values";
export class Streebog2 {
  h = []
  N = []
  sigma = values.sigma
  N512 = values.N512

  N0 = values.N0

  Pi = values.Pi

  Tau =values.Tau

  A = values.A
  C = values.C

  // Иницилизация данных Для разной длины сообщения
  constructor(){
  }

  /**
   * Обрабатывает блок данных
   *  messagePart блок данных 512 бит или меньше
   */
  getHashArray(message,outputMode) {

    return this.generateHash(message,outputMode)
  }

  addModule(a,b)
  {
    var result =[64]
    let t = 0;

    for(let i = 63; i >= 0; i--)
    {
      t = (a[i] & 0xff) + (b[i] & 0xff)  + (t >> 8)
      result[i] = (t & 0xff)
    }
    return result;
  }
  xor(a, b){

    const result = [64];
    for(let i=0;i< 64;i++){
      result[i] = a[i]^b[i]

    }
    return result



  }
  /**
   *  <h1>Функция сжатия.</h1>
   * Значение хэш-кода сообщения вычисляется с использованием
   * итерационной процедуры. На каждой итерации вычисления хэш-кода используется
   * функция сжатия: V512 x V512 -> V512

   */
  compression(N,m,h)  {
    let K
    K=this.xor(h,N)
    K=this.Stransformation(K)
    K=this.Ptransformation(K)
    K=this.Ltransformation(K)
    let t
    t=this.Etransformation(K,m)
    t=this.xor(t, h)
    let result
    result=this.xor(t,m)

    return result
  }
  /**
   * Часть функции сжатия. Состоит из 12 раундов.
   * Фактически блочный шифр.

   */
  Etransformation(k,m){

    let state=this.xor(k,m)
    for(var i=0; i<12; i++){
      state=this.Stransformation(state)
      state=this.Ptransformation(state)
      state=this.Ltransformation(state)
      k=this.Keyshedule(k,i)
      state=this.xor(state,k)
    }
    return state

  }
  /**
   * Генерация ключа для каждой итерации
   */
  Keyshedule(K,i){

    K=this.xor(K,this.C[i])
    K = this.Stransformation(K)
    K = this.Ptransformation(K)
    K = this.Ltransformation(K)

    return K;

  }
  /*
      * <h1>Нелинейное биективное преобразование множества двоичных векторов</h1>
      * Заменяет значения элементов в соответствие с таблицей
      */
  Stransformation(a)
  {
    let result = []

    for(var i = 0; i < 64; i++)
      result[i] = this.Pi[(a[i] & 0xFF)]

    return result;
  }

  /*
       * <h1>Функция перестановки.</h1>
       * Переставляет элементы массива в соответствие с таблицой

       */
  Ptransformation(a)
  {
    let result = []

    for(var i = 0; i < 64; i++)
      result[i] = a[this.Tau[i]]

    return result;
  }
  /**
   * <h1>Линейное преобразование множества двоичных векторов</h1>
   * Умножение справа на матрицу А над полем GF(2). Работает долго...
   */
  Ltransformation(a)
  {
    let result = []
    for(var i = 0; i < 8; i++)
    {
      for(var k = 0; k < 8; k++)
      {
        if((a[i*8+k] & (0x80)) != 0)
        {
          result[8*i] ^= this.A[k*8+0][0];
          result[8*i+1] ^= this.A[k*8+0][1]
          result[8*i+2] ^= this.A[k*8+0][2]
          result[8*i+3] ^= this.A[k*8+0][3]
          result[8*i+4] ^= this.A[k*8+0][4]
          result[8*i+5] ^= this.A[k*8+0][5]
          result[8*i+6] ^= this.A[k*8+0][6]
          result[8*i+7] ^= this.A[k*8+0][7]
        }
        if((a[i*8+k] & (0x40)) != 0)
        {
          result[8*i] ^= this.A[k*8+1][0];
          result[8*i+1] ^= this.A[k*8+1][1]
          result[8*i+2] ^= this.A[k*8+1][2]
          result[8*i+3] ^= this.A[k*8+1][3]
          result[8*i+4] ^= this.A[k*8+1][4]
          result[8*i+5] ^= this.A[k*8+1][5]
          result[8*i+6] ^= this.A[k*8+1][6]
          result[8*i+7] ^= this.A[k*8+1][7]
        }
        if((a[i*8+k] & (0x20)) != 0)
        {
          result[8*i] ^= this.A[k*8+2][0];
          result[8*i+1] ^= this.A[k*8+2][1]
          result[8*i+2] ^= this.A[k*8+2][2]
          result[8*i+4] ^= this.A[k*8+2][4]
          result[8*i+5] ^= this.A[k*8+2][5]
          result[8*i+6] ^= this.A[k*8+2][6]
          result[8*i+7] ^= this.A[k*8+2][7]
        }
        if((a[i*8+k] & (0x10)) != 0)
        {
          result[8*i] ^= this.A[k*8+3][0]
          result[8*i+1] ^= this.A[k*8+3][1]
          result[8*i+2] ^= this.A[k*8+3][2]
          result[8*i+3] ^= this.A[k*8+3][3]
          result[8*i+4] ^= this.A[k*8+3][4]
          result[8*i+5] ^= this.A[k*8+3][5]
          result[8*i+6] ^= this.A[k*8+3][6]
          result[8*i+7] ^= this.A[k*8+3][7]
        }
        if((a[i*8+k] & (0x8)) != 0)
        {
          result[8*i] ^= this.A[k*8+4][0];
          result[8*i+1] ^= this.A[k*8+4][1]
          result[8*i+2] ^= this.A[k*8+4][2]
          result[8*i+3] ^= this.A[k*8+4][3]
          result[8*i+4] ^= this.A[k*8+4][4]
          result[8*i+5] ^= this.A[k*8+4][5]
          result[8*i+6] ^= this.A[k*8+4][6]
          result[8*i+7] ^= this.A[k*8+4][7]
        }
        if((a[i*8+k] & (0x4)) != 0)
        {
          result[8*i] ^= this.A[k*8+5][0];
          result[8*i+1] ^= this.A[k*8+5][1]
          result[8*i+2] ^= this.A[k*8+5][2]
          result[8*i+3] ^= this.A[k*8+5][3]
          result[8*i+4] ^= this.A[k*8+5][4]
          result[8*i+5] ^= this.A[k*8+5][5]
          result[8*i+6] ^= this.A[k*8+5][6]
          result[8*i+7] ^= this.A[k*8+5][7]
        }
        if((a[i*8+k] & (0x2)) != 0)
        {
          result[8*i] ^= this.A[k*8+6][0];
          result[8*i+1] ^= this.A[k*8+6][1]
          result[8*i+2] ^= this.A[k*8+6][2]
          result[8*i+3] ^= this.A[k*8+6][3]
          result[8*i+4] ^= this.A[k*8+6][4]
          result[8*i+5] ^= this.A[k*8+6][5]
          result[8*i+6] ^= this.A[k*8+6][6]
          result[8*i+7] ^= this.A[k*8+6][7]
        }
        if((a[i*8+k] & (0x1)) != 0)
        {
          result[8*i] ^= this.A[k*8+7][0]
          result[8*i+1] ^= this.A[k*8+7][1]
          result[8*i+2] ^= this.A[k*8+7][2]
          result[8*i+3] ^= this.A[k*8+7][3]
          result[8*i+4] ^= this.A[k*8+7][4]
          result[8*i+5] ^= this.A[k*8+7][5]
          result[8*i+6] ^= this.A[k*8+7][6]
          result[8*i+7] ^= this.A[k*8+7][7]
        }
      }
    }
    return result;
  }


  generateHash(message,outputMode)
  {
    var tmpMessage =[64]
    let length = message.length * 8;

    if (!outputMode) {
      this.h.fill(0x01,0,64) // 256
    }
    else {
      this.h.fill(0x00,0,64)  //512
    }
    this.N.fill(0x00,0,64)
    this.sigma.fill(0x00,0,64)

    let inc = 0;
    let m = message.slice()
    while(length >= 512)
    {
      inc++;
      const lastPathIndex = m.length - 64*inc
      const tmp = m.slice(lastPathIndex,message.length - (inc-1)*64)
      this.h = this.compression(this.N, tmp, this.h)
      this.N = this.addModule(this.N, this.N512)
      this.sigma = this.addModule(this.sigma, tmp)
      // m = m.slice(0, lastPathIndex - 1)
      length -=512;
    }
    const len = m.length
    console.log(len)
    if(len < 64) //обработка сообщения длинной < 512 бит
    {
      const endIndex = 64 - len - 2
      console.log(endIndex)

      tmpMessage.fill(0x00,0,64-len-2);

      tmpMessage[64 - len - 1] = 0x01
      const startIndex = 64 - len
      for(let i = 0; i <= len; i++)
        tmpMessage[startIndex + i] = m[i]
    }
    const ideal = "01323130393837363534333231303938373635343332313039383736353433323130393837363534333231303938373635343332313039383736353433323130"
    console.log(ideal)
    console.log(tmpMessage.join(""))

    this.h = this.compression(this.N, tmpMessage, this.h)

    // BitConverter.GetBytes
    var NMessage = [64]
    NMessage.fill(0x00,0,64)
    inc = 0;
    while(length > 0)
    {
      NMessage[63 - inc] =length & 0xff
      length >>= 8;
      inc++;
    }
    this.N = this.addModule(this.N, NMessage)
    this.sigma = this.addModule(this.sigma, tmpMessage)

    this.h = this.compression(this.N0, this.N, this.h)
    this.h = this.compression(this.N0, this.sigma, this.h)

    if(outputMode) {
      return this.h;
    }
    return this.h.slice(0,32)// Не уверен что правильно Arrays.copyOf(h, 32);
  }
}
