let charts = ['0','1','2','3','4','5','6','7','8','9','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];

module.exports = (num) => {
  let yzm = '';
  for(let i = 0; i < num; i++) {
    yzm += charts[(Math.ceil(Math.random()*35))];
  }
  return yzm;
};