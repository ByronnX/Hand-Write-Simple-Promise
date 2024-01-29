class Promise {
  static PENDING = "PENDING";
  static FULFILLED = "FULFILLED";
  static REJECTED = "REJECTED";
  constructor(executor) {
    this.status = Promise.PENDING;
    this.result = null;
    this.resolveCallbacks = [];
    this.rejectCallbacks = [];
    try {
      executor(this.resolve.bind(this), this.reject.bind(this));
    } catch (error) {
      this.reject(error);
    }
  }

  resolve(result) {
    setTimeout(() => {
      if (this.status === Promise.PENDING) {
        this.status = Promise.FULFILLED;
        this.result = result;
        this.resolveCallbacks.forEach((callback) => callback(this.result));
      }
    });
  }
  reject(result) {
    setTimeout(() => {
      if (this.status === Promise.PENDING) {
        this.status = Promise.REJECTED;
        this.result = result;
        this.rejectCallbacks.forEach((callback) => callback(this.result));
      }
    });
  }
  then(onFulfilled, onRejected) {
    onFulfilled = typeof onFulfilled === "function" ? onFulfilled : () => {};
    onRejected = typeof onRejected === "function" ? onRejected : () => {};
    if (this.status === Promise.PENDING) {
      return new Promise((resolve, reject) => {
        try {
          this.resolveCallbacks.push(() => {
            const fn = onFulfilled(this.result);
            fn instanceof Promise ? fn.then(resolve, reject) : resolve(fn);
          });
          this.rejectCallbacks.push(() => {
            const fn = onRejected(this.result);
            fn instanceof Promise ? fn.then(resolve, reject) : resolve(fn);
          });
        } catch (error) {
          reject(error);
        }
      });
    }
    if (this.status === Promise.FULFILLED) {
      return new Promise((resolve, reject) => {
        try {
          const fn = onFulfilled(this.result);
          fn instanceof Promise ? fn.then(resolve, reject) : resolve(fn);
        } catch (error) {
          reject(error);
        }
      });
    }
    if (this.status === Promise.REJECTED) {
      return new Promise((resolve, reject) => {
        try {
          const fn = onRejected(this.result);
          fn instanceof Promise ? fn.then(resolve, reject) : reject(fn);
        } catch (error) {
          reject(error);
        }
      });
    }
  }
  catch(onRejected) {
    this.then(null, onRejected);
  }
}

// 创建Promise实例化对象
let promise = new Promise((resolve, reject) => {
  console.log("Promise1");
  setTimeout((e) => {
    resolve("Promise1");
  },1000);
});
// 链式调用示例
promise
  .then((data) => {
    console.log('11');
    
    console.log("then1:", data);
    return new Promise((resolve, reject) => {
      console.log("Promise2");
      setTimeout((e) => resolve("promise2"));
    });
  })
  .then((data) => {
    console.log("then2:", data);
    return new Promise((resolve, reject) => {
      console.log("Promise3");
      setTimeout((e) => resolve("promise3") );
    });
  })
  .then((data) => {
    console.log("then3:", data);
  })
  .catch((e) => console.log(e));
  console.log('tongbu');
  
