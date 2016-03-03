(function() {
  R.promiseAll = R.bind(self.Promise.all, self.Promise);

  R.resolveP = R.bind(self.Promise.resolve, self.Promise);
  R.rejectP = R.bind(self.Promise.reject, self.Promise);
  R.rejectIf = R.curry((test, reason, obj) => {
    if(test(obj)) return self.Promise.reject(reason);
    else return obj;
  });

  R.condErrorP = R.curry(function condErrorP(options, promise) {
    return promise.catch(R.cond(R.append([ R.T, R.reject ], options)));
  });
})();