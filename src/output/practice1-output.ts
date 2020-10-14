function fn({ data }) {
  const dataList: string = data.dataList || []
  const bgs: string =
    dataList.length > 0 ? dataList.map((item) => item) : ['https://xxx.png']
  console.log(bgs)
}
