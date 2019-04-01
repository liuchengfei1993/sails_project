module.exports = {
  handleStep(data) {
    var handledata = data.reverse();
    // console.log(handledata);
    var dateList = [];
    for (var i = 0; i < handledata.length; i++) {
      var time = new Date(handledata[0].timestamp * 1000);
      var date =
        time.getFullYear() +
        "年" +
        (time.getMonth() + 1) +
        "月" +
        time.getDate() +
        "日";
      // console.log(date);
    }
  }
}