const p1 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve('p1')
  }, 500)
})

const p2 = new Promise((resolve, reject) => {
  setTimeout(() => {
    reject('p2 error')
  }, 1000)
})

const p3 = new Promise((resolve, reject) => {
  setTimeout(() => {
    reject('p2 error')
  }, 1500)
})

let p4 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve('p4')
  }, 2500)
})
let p5 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve('p5')
  }, 3500)
})

// Promise.all方法
function _all(promises) {
  let count = 0
  let len = promises.length
  let result = []
  return new Promise((resolve, reject) => {
    for (let p of promises) {
      Promise.resolve(p).then((res) => {
        result[count] = res
        count++ 
        if (count == len) {
          return resolve(result)
        }
      }).catch((err) => {
         reject(err)
      })
    }
  })
}
_all([p1,p2,p3]).then(res=>console.log('res',res)).catch(err => console.log('err', err))

function _allSettled(promises) {
  let count = 0;
  let len = promises.length
  let result = []
  return new Promise((resolve, reject) => {
    for (let p of promises) {
      Promise.resolve(p).then((res) => {
        result[count] = {
          status: 'fulfilled',
          result : res
        }
        count++
        if (len == count) {
          resolve(result)
        }
      }).catch((err) => {
        result[count] = {
          status: 'rejected',
          result : err
        }
        count++
        if (len == count) {
          reject(err)
        }
      })
    }
  })
}
_allSettled([p1, p2, p3, p4, p5]).then(res => console.log('res', res)).catch(err => console.log('err', err))

function _any(promises) {
  let count = 0;
  let len = promises.length
  let result = []
  return new Promise((resolve, reject) => {
    for (let p of promises) {
      Promise.resolve(p).then((res) => {
        resolve(res)
      }).catch((err) => {
        result[count] = err 
        count++
        if (len == count) {
          reject(result)
        }
      })
    }
  })
}
_any([p1, p2, p3, p4, p5]).then(res => console.log('_any:res', res)).catch(err => console.log('err', err))

function _race(promises) {
  return new Promise((resolve, reject) => {
    for (let p of promises) {
      Promise.resolve(p).then((res) => {
        resolve(res)
      }).catch((err) => {
          reject(err)
      })
    }
  })
}
_race([p1, p2, p3, p4, p5]).then(res => console.log('_race:res', res)).catch(err => console.log('err', err))
