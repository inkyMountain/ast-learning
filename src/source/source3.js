function fn({ data }) {
  let dataList = data.dataList || [];
  let bgs =
    dataList.length > 0 ? dataList.map((item) => item) : ['https://xxx.png'];
  console.log(bgs);
}
